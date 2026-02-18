const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/main.js',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'bundle.[contenthash].js', 
        clean: true,
    },
    devtool: 'source-map',
    devServer: {
        static: {
            directory: path.join(__dirname, 'public'),
        },
        compress: true,
        port: 9000,
        hot: true,
        open: true,
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html', 
            filename: 'index.html', 
            inject: 'body', 
        }),
        new CopyWebpackPlugin({
            patterns: [
                { 
                    from: 'public', 
                    to: '.',
                    globOptions: {
                        ignore: ['**/index.html'], 
                    }
                }
            ]
        })
    ]
};