const path = require('path');
const webpack = require("webpack");
module.exports = {
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        alias: {
            jquery: 'jquery',
        },
    },

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.tsx?$/,
                use: 'babel-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: 'babel-loader',  // You can adjust this based on your requirements
            },
        ],
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery'

        }),
    
    ],
    target: 'web',
};