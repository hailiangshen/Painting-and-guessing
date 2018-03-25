/**
 * Created by greedy on 2018/2/23.
 */
const path = require('path');
const fs = require('fs');
const url = require('url');
const webpack = require('webpack');
const extractTextPlugin = require('extract-text-webpack-plugin');
const htmlWebpackPlugin = require("html-webpack-plugin");
const manifestPlugin = require('webpack-manifest-plugin');
const moment = require("moment");
const opn = require("opn");
const chalk = require("chalk");
const CleanWebpackPlugin = require('clean-webpack-plugin');
const bundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

let loadEntry = (appDir) => {
    // let appDir = path.resolve('./src/app');

    // let entry = [];
    // fs.readdirSync(appDir).map(subDir => {
    //     let apps = fs.readdirSync(path.join(appDir, subDir)).filter(file => /^[\s\S]+.route.js$/.test(file)).map(file => path.join(appDir, subDir, file));
    //     if(apps.length) {
    //         entry = entry.concat(apps);
    //     }
    // });

    // return {
    //     app: entry
    // };

    let entry = {};
    fs.readdirSync(appDir).map(subDir => {
        let apps = fs.readdirSync(path.join(appDir, subDir)).filter(file => /^[\s\S]+.route.js$/.test(file)).map(file => path.join(appDir, subDir, file));
        if(apps.length) {
            entry[subDir] = apps;
        }
    });

    return entry;
}

module.exports = (options = {}) => {
    let entry = loadEntry(path.resolve('./src/app'));
    
    let res = {
        entry,
        output : {
            filename: options.hashNaming ? 'scripts/[name].[chunkhash].js' : 'scripts/[name].js',
            path: path.resolve(__dirname, options.path),
            publicPath: options.publicPath || ''
        },
        module: {
            rules: [
                {
                    test: /\.vue$/,
                    loader: 'vue-loader',
                    options: {
                        loaders: {
                            // Since sass-loader (weirdly) has SCSS as its default parse mode, we map
                            // the "scss" and "sass" values for the lang attribute to the right configs here.
                            // other preprocessors should work out of the box, no loader config like this necessary.
                            'scss': 'vue-style-loader!css-loader!sass-loader',
                            'sass': 'vue-style-loader!css-loader!sass-loader?indentedSyntax'
                        },
                        hotReload: true,
                        cssModules: {
                            localIdentName: '[path][name]---[local]---[hash:base64:5]',
                            camelCase: true
                        }
                    }
                },
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: [{
                        loader: 'babel-loader',
                        options: {
                            presets: ["env"],
                            plugins: ['syntax-dynamic-import']
                        }
                    }]
                },
                {
                    test: /\.css$/,
                    exclude: [/node_modules/],
                    use: extractTextPlugin.extract({
                        use: [{
                            loader: 'css-loader',
                            options: {
                                modules: true,
                                localIdentName: '[path]__[local]--[hash:base64]'
                            }
                        }]
                    })
                },
                {
                    test: /\.(jpg|jpeg|png|gif|swf|svg)$/,
                    loader: 'file-loader',
                    query: {
                        name: 'resource/[name].[hash].[ext]'
                    }
                },
                {
                    test: /\.(htm|html)$/,
                    loader: 'html-loader',
                    query: {
                        // root: path.resolve('src')
                    }
                },
                {
                    test: /\.(ttf)$/,
                    loader: 'url-loader?name=font/[name].[ext]&limit=10&minetype=application/octet-stream'
                },
            ]
        },
        plugins: [
            new webpack.optimize.CommonsChunkPlugin({
                name: 'common',
                minChunks: (module, count) => count >= 2
            }),
            new webpack.optimize.CommonsChunkPlugin({
                name: 'vendor',
                minChunks: (module) => module.context && module.context.indexOf('node_modules') !== -1
            }),
            // new webpack.optimize.CommonsChunkPlugin({
            //     name: 'manifest',
            //     minChunks: Infinity
            // }),
            // new manifestPlugin(),
            new extractTextPlugin(options.hashNaming ? 'css/[name].[contenthash].css' : 'css/[name].css'),
            new htmlWebpackPlugin({
                filename: path.resolve(__dirname, options.path, './index.html'),
                template: 'src/index.tpl.html',
                inject: 'false',
                // chunks: ['vendor', 'common', 'app', 'style'],
                chunksSortMode: 'dependency',
                minify: {
                    // https://github.com/kangax/html-minifier#options-quick-reference
                    collapseInlineTagWhitespace: true,
                    collapseWhitespace: true,
                    minifyCSS: true,
                    minifyJS: true,
                },
                hash: false
            }),
            new webpack.ProvidePlugin({
                moment: 'moment'
            }),
            new webpack.ProvidePlugin({
                _: 'lodash'
            }),
            new CleanWebpackPlugin(
                [options.path],
                {
                    root: __dirname,  //根目录
                    verbose: true,    //开启在控制台输出信息
                    dry: false,       //启用删除文件
                    beforeEmit: true
                }
            ),
            function () {
                this.plugin("done", function (stats) {
                    setTimeout(() => {
                        console.log(chalk.greenBright(`Compiled ${stats.hasErrors() ? 'failed' : 'success'} at ${moment(new Date()).format('MM/DD HH:mm:ss')}`));
                    }, 0);
                });
            }
        ],
        resolve: {
            alias: {
                vue: 'vue/dist/vue',
                src: path.resolve('src'),
                runtime: path.resolve('src/vue.runtime.js'),
                services: path.resolve('src/services'),
            },
            extensions: ['.vue', '.js', '.html', '.css']
        },
    };

    if (options.devServer) {
        let port = options.devServerPort || 8088;
        res.output.publicPath = url.resolve(`http://127.0.0.1:${port}/`, options.path);
        res.devServer = {
            publicPath: url.resolve('/', options.path + '/'),
            port,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            // hot: true,
            // host: 'localhost',
            historyApiFallback: true,
            proxy: {
                '/api/*': {
                    target: 'http://localhost',
                    pathRewrite: {'^/api': '/api'},
                    changeOrigin: true,
                },
                '/socket.io/*': {
                    target: 'http://localhost',
                    changeOrigin: true,
                }
            },
        }
    }

    if(!options.devServer) {
        res.plugins.push(new bundleAnalyzerPlugin({
            analyzerMode: 'static', //server
            analyzerPort: 4000
        }));

        // res.plugins.push(new PrerenderSpaPlugin(
        //     path.resolve(__dirname, './dist'),
        //     ['/home'],
        // ));
    }

    if (options.compress) {
        res.plugins.push(new webpack.optimize.UglifyJsPlugin({
            minimize: true,
            compress: {
                // drop_console: true,
                drop_debugger: true,
                warnings: false
            },
            warningsFilter: () => false,
        }));
    }

    if (options.devtool) {
        res.devtool = options.devtool;
    }

    return res;
}