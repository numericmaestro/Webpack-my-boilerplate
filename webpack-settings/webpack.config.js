'use strict';

const path = require('path');
const copyWepbackPlugin = require('copy-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

//PATHS
//__dirname = ..../rootPath/webpack-settings
const rootPath = path.resolve(__dirname, '../');
const srcPath = path.resolve(rootPath, './src')
const distPath = path.resolve(rootPath, './dist')

//ENV
const mode = process.env.NODE_ENV;
const serverRuns = process.env.SERVER_RUNS == 'true' //true if webpack dev server runs
const isProduction = mode == 'production';
const isDevelopment = !isProduction;


//CONSOLE OUTPUT SETTINGS
//Possible values: 'detailed', 'verbose', 'normal', 'none', 'minimal', 'errors-warnings', 'errors-only'
function resolveStats() {
    if (serverRuns) //npm start
        return 'errors-only'
    else if (isProduction) //npm run build
        return 'errors-warnings'
    else //npm run build-dev (there is no server and dev mode)
        return 'normal'
}

module.exports = {
    stats: resolveStats(),
    entry: {
        app: path.resolve(srcPath, './index.js'),
    },
    output: {
        // path: distPath,
        path: distPath,
        filename: isProduction ? '[name].[contenthash].bundle.js' : '[name].js',
        publicPath: '',
    },
    // context: path.resolve(__dirname),
    // context: srcPath,
    resolve: {
        alias: {
            '@src': srcPath,
            '@dist': distPath,
            '@public': path.resolve(srcPath, './public'),
        }
    },
    devtool: isDevelopment ? 'inline-source-map' : undefined,
    module: {
        rules: [
            {
                test: /\.s?css/i,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: ''
                        }
                    },
                    {
                        loader: 'css-loader',
                    },
                    "sass-loader",
                    {
                        loader: "postcss-loader",
                        options: {
                            postcssOptions: {
                                config: path.resolve(rootPath, './postcss-settings/postcss.settings.js')
                            }
                        }
                    },
                ]
            },
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            ['@babel/preset-env', { targets: "defaults" }]
                        ]
                    }
                }
            },
            {
                test: /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)(\?.*)?$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: '[path][name].[ext]',
                    },
                },
            },
            {
                test: /\.html$/i,
                loader: 'html-loader',
                options: {
                    // Disables attributes processing
                    attributes: true,
                },
            },
        ]
    },
    plugins: [
        new MiniCssExtractPlugin(
            {
                filename: isProduction ? '[name].[contenthash].css' : '[name].css'
            }
        ),
        // new copyWepbackPlugin({
        //     patterns: [
        //         {
        //             from: path.resolve(srcPath, './public'),
        //             to: path.resolve(distPath, './public'),
        //         },
        //         // { from: "any", to: "destination" },
        //     ]
        // }),
        new HTMLWebpackPlugin({
            filename: 'index.html',
            template: path.join(srcPath, 'index.html'),
            minify: isProduction,
            // chunks: ['app'],
            cache: true,
        }),
        new HTMLWebpackPlugin({
            filename: 'index2.html',
            template: path.join(srcPath, 'index2.html'),
            minify: isProduction,
            // chunks: ['test'],
            cache: true,
        }),
        new CleanWebpackPlugin(),
    ],
    devServer: {
        stats: "errors-only",
        contentBase: srcPath,
        watchContentBase: true,
        // clientLogLevel: 'silent',
        compress: true,
        hot: true,
        open: true,
        port: 9000
    }
};
