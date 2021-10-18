// Generated using webpack-cli https://github.com/webpack/webpack-cli
// Used the command: `npx webpack-cli init` to generate this webpack 5 boilerplate
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const { HotModuleReplacementPlugin } = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');


const isProduction = process.env.NODE_ENV == 'production';

const jsEntry = './src/client/index.js';

let devPlugins = [];
if (!isProduction) {
    devPlugins = [new CleanWebpackPlugin(), new HotModuleReplacementPlugin()]
}

const config = {
    entry: jsEntry,
    output: {
        path: path.resolve(__dirname, 'dist'),
    },
    resolve: {
        extensions: ['js', '*']
    },
    devtool: "source-map",
    target: 'web',
    devServer: {
        host: 'localhost',
        historyApiFallback: true,
        compress: true,
        hot: false,
        port: 8080,
    },
    plugins: [
        isProduction && new MiniCssExtractPlugin(),
        new HtmlWebpackPlugin({
            template: './src/client/html/index.html',
            filename: 'index.html'
        }),
        ...devPlugins
    ],
    stats: {
        colors: true
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                enforce: "pre",
                use: ["source-map-loader"],
            },
            {
                test: /\.html$/i,
                loader: "html-loader",
            },
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        plugins: ['@babel/plugin-proposal-optional-chaining', '@babel/plugin-transform-runtime']
                    }
                }
            },
            {
                test: /\.scss$/,
                use: [(isProduction ? MiniCssExtractPlugin.loader : 'style-loader'), 'css-loader', 'sass-loader'],
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
                type: 'asset',
            }
        ],
    },
};

module.exports = () => {
    if (isProduction) {
        config.mode = 'production';

        // TODO: uncomment this when production ready
        // config.plugins.push(new WorkboxWebpackPlugin.GenerateSW());

    } else {
        config.mode = 'development';
    }
    return config;
};
