'use strict';
const utils = require('./utils');
const webpack = require('webpack');
const config = require('../config');
const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.conf');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const portfinder = require('portfinder');
const axios = require('axios');
const express = require('express');
const app = express();

var apiRoutes = express.Router();
app.use('', apiRoutes);

const devWebpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({sourceMap: config.dev.cssSourceMap, usePostCSS: true})
  },
  // cheap-module-eval-source-map is faster for development
  devtool: config.dev.devtool,

  // these devServer options should be customized in /config/index.js
  devServer: {
    clientLogLevel: 'warning',
    historyApiFallback: true,
    hot: true,
    compress: true,
    host: process.env.HOST || config.dev.host,
    port: process.env.PORT || config.dev.port,
    open: config.dev.autoOpenBrowser,
    overlay: config.dev.errorOverlay ? {
      warnings: false,
      errors: true
    } : false,
    publicPath: config.dev.assetsPublicPath,
    disableHostCheck: true,
    proxy: config.dev.proxyTable,
    quiet: true, // necessary for FriendlyErrorsPlugin
    watchOptions: {
      poll: config.dev.poll
    },
    before (app) {
      app.get('/top/playlist/highquality', function (req, res) {
        var url = 'http://localhost:3000/top/playlist/highquality';
        axios.get(url, {params: req.query}).then((response) => {
          res.json(response.data);
        }).catch((e) => {
          console.log(e);
        });
      });

      app.get('/playlist/detail', function (req, res) {
        var url = 'http://localhost:3000/playlist/detail';
        axios.get(url, {params: req.query}).then((response) => {
          res.json(response.data);
        }).catch((e) => {
          console.log(e);
        });
      });

      app.get('/top/playlist', function (req, res) {
        var url = 'http://localhost:3000/top/playlist';
        axios.get(url, {params: req.query}).then((response) => {
          res.json(response.data);
        }).catch((e) => {
          console.log(e);
        });
      });

      app.get('/toplist', function (req, res) {
        var url = 'http://localhost:3000/toplist';
        axios.get(url).then((response) => {
          res.json(response.data);
        }).catch((e) => {
          console.log(e);
        });
      });

      app.get('/top/artists', function (req, res) {
        var url = 'http://localhost:3000/top/artists';
        axios.get(url, {params: req.query}).then((response) => {
          res.json(response.data);
        }).catch((e) => {
          console.log(e);
        });
      });

      app.get('/artists', function (req, res) {
        var url = 'http://localhost:3000/artists';
        axios.get(url, {params: req.query}).then((response) => {
          res.json(response.data);
        }).catch((e) => {
          console.log(e);
        });
      });

      app.get('/music/url', function (req, res) {
        var url = 'http://localhost:3000/music/url';
        axios.get(url, {params: req.query}).then((response) => {
          res.json(response.data);
        }).catch((e) => {
          console.log(e);
        });
      });

      app.get('/lyric', function (req, res) {
        var url = 'http://localhost:3000/lyric';
        axios.get(url, {params: req.query}).then((response) => {
          res.json(response.data);
        }).catch((e) => {
          console.log(e);
        });
      });

      app.get('/artist/desc', function (req, res) {
        var url = 'http://localhost:3000/artist/desc';
        axios.get(url, {params: req.query}).then((response) => {
          res.json(response.data);
        }).catch((e) => {
          console.log(e);
        });
      });

      app.get('/search/hot', function (req, res) {
        var url = 'http://localhost:3000/search/hot';
        axios.get(url).then((response) => {
          res.json(response.data);
        }).catch((e) => {
          console.log(e);
        });
      });

      app.get('/search', function (req, res) {
        var url = 'http://localhost:3000/search';
        axios.get(url, {params: req.query}).then((response) => {
          res.json(response.data);
        }).catch((e) => {
          console.log(e);
        });
      });
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': require('../config/dev.env')
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    })
  ]
});

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || config.dev.port;
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err);
    } else {
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port;
      // add port to devServer config
      devWebpackConfig.devServer.port = port;

      // Add FriendlyErrorsPlugin
      devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
          messages: [`Your application is running here: http://${config.dev.host}:${port}`]
        },
        onErrors: config.dev.notifyOnErrors ?
          utils.createNotifierCallback() : undefined
      }));

      resolve(devWebpackConfig);
    }
  });
});
