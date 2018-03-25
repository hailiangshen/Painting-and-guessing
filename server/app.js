var express = require('express');
var path = require('path');
// var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var url = require("url");
var http = require('http');
const chalk = require("chalk");

var publicDir = path.resolve(__dirname, '../dist');
console.info(chalk.greenBright(`bind static path on '${publicDir}'`));

var app = express();
app.engine('.html', ejs.__express);
app.set('view engine', 'html');

// app.use(favicon(path.resolve(__dirname, 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(publicDir, {
    dotfiles: 'ignore',
    etag: true, // 用于304
    index: 'index.html',
    lastModified: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    setHeaders: function (res, path, stat) {

    }
}));

// app.all('/api/*', require('./routes/proxy.js'));

app.all('((?!/socket.io/).)*', function (req, res) {
    res.sendFile('index.html', {
        root: publicDir
    });
});

module.exports = app;