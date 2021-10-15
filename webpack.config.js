// Generated using webpack-cli https://github.com/webpack/webpack-cli
// Used the command: `npx webpack-cli init` to generate this webpack 5 boilerplate
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const { HotModuleReplacementPlugin } = require('webpack');


const isProduction = process.env.NODE_ENV == 'production';

const config = {
    entry: './src/client/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
    },
    target: 'web',
    devServer: {
        host: 'localhost',
        historyApiFallback: true,
        compress: true,
        hot: false,
        port: 8080,
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/client/html/views/index.html',
            filename: 'index.html'
        }),
        new MiniCssExtractPlugin(),
        new CleanWebpackPlugin(),
        new HotModuleReplacementPlugin(),

        // Add your plugins here
        // Learn more about plugins from https://webpack.js.org/configuration/plugins/
    ],
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/i,
                loader: 'babel-loader',
            },
            {
                test: /\.s[ac]ss$/i,
                use: ['style-loader', 'css-loader', 'sass-loader'],
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
                type: 'asset',
            },

            // Add your rules for custom modules here
            // Learn more about loaders from https://webpack.js.org/loaders/
        ],
    },
};

module.exports = () => {
    if (isProduction) {
        config.mode = 'production';


        config.plugins.push(new WorkboxWebpackPlugin.GenerateSW());

    } else {
        config.mode = 'development';
    }
    return config;
};