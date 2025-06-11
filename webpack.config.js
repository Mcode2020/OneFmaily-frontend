const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");

module.exports = {
    entry: "./src/index.js", // 👈 Main entry point
    output: {
        filename: "[name].js", // 👈 Output file
        path: path.resolve(__dirname, "distt"), // 👈 Output folder changed to "sahil"
        publicPath: "/", // Serve from root
        clean: true, // Clean the 'sahil/' folder before each build
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
            {
                test: /\.css$/, // 👈 Load .css files
                use: ["style-loader", "css-loader"],
            },
            // {
            //     test: /\.tsx?$/, // Handle TypeScript and TypeScript JSX files
            //     use: 'babel-loader', // Use Babel loader to transpile the code
            //     exclude: /node_modules/,
            // },
            // {
            //     test: /\.js$/, // Handle regular JavaScript files
            //     use: 'babel-loader',
            //     exclude: /node_modules/,
            // }
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./public/index.html", // 👈 Generates index.html inside "sahil/"
            filename: "index.html",
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery'
        }),
    
    ],
    devServer: {
        static: {
            directory: path.join(__dirname, "distt"), // Serve files from 'sahil/'
        },
        compress: true,
        port: 3000, // Change the port if needed
        open: true, // Automatically open the browser
        hot: true, // Enable hot reload
        historyApiFallback: true, // Fixes route refresh issues in SPAs
    },
};