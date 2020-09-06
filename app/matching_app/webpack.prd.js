'use strict';

require('@babel/register'); // development.jsでES6を使えるようにする
var webpack = require('webpack');
var path = require('path');
var NODE_ENV="production";

var config = {
    mode: NODE_ENV,
    entry: {
        'index': path.resolve(__dirname, 'statics/js') + '/index.js'
    },
    output: {
        path: path.resolve(__dirname, 'public/js'),
        filename: 'bundle.js'
    },

    module: {
        rules: [
            // js
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                          '@babel/preset-env',
                          '@babel/preset-react'
                        ],
                        plugins: ['@babel/plugin-syntax-jsx']
                    }
                }
            },
            // sass
            {
                test: /\.(scss|css)$/,
                exclude: /node_modules/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            url: false
                        },
                    }
                ]
            },
            // img
            {
                test: /\.(jpg|png|gif|svg|ico)$/i,
                loader: 'url-loader',
                options: {
                    limit: 2048,
                    name: '../img/[name].[ext]'
                }
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
          'process.env.NODE_ENV': JSON.stringify(NODE_ENV)
        }),
        new webpack.optimize.OccurrenceOrderPlugin(),
    ],
    resolve: {
        extensions: ['.json', '.js', '.jsx'],
    },
}

module.exports = config;