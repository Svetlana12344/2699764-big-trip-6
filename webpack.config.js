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
        port: 8080,
        hot: true,
        open: true,
    },
    resolve: {
        extensions: ['.js'],
        alias: { 
            '@const': path.resolve(__dirname, 'src/const.js'),
            '@model': path.resolve(__dirname, 'src/model/'),
            '@mock': path.resolve(__dirname, 'src/mock/'),
            '@presenter': path.resolve(__dirname, 'src/presenter/'),
            '@utils': path.resolve(__dirname, 'src/utils/'),
            '@view': path.resolve(__dirname, 'src/view/'),
        }
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
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader']
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