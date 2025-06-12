const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common');

const entries = {
    'donation': './src/element/donation-tab.js',
    'campaign-donation': './src/element/campaign-donation.js',
   
};

module.exports = merge(common, {
    mode: 'production',
    entry: entries,
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].bundle.js',
        environment: {
            module: true,
        },
        library: {
            type: 'module'
        }
    },
    experiments: {
        outputModule: true,
    }
});