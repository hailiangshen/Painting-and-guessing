/**
 * Created by greedy on 2018/2/23.
 */
const webpackMerge = require( 'webpack-merge' );
const base = require( './webpack.base' );
const path = require( 'path' );
const fs = require( 'fs' );

module.exports = ( env ) => {
    env = ['dev', 'prod'].indexOf(env) !== -1 ? env : 'dev';
    var options = {};

    if (env === 'dev') {
        options = webpackMerge(options, {
            path: '',
            compress: false,
            hashNaming: false,
            devServer: true,
            devtool: 'inline-source-map'
        })
    } else {
        options = webpackMerge(options, {
            path: './dist',
            compress: true,
            hashNaming: true,
            devServer: false
        })
    }

    let res = base(options);
    return res;
}