const path = require('path'),
    ExtractTextPlugin = require('extract-text-webpack-plugin'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    webpack = require('webpack'),
    BrowserSyncPlugin = require('browser-sync-webpack-plugin');

const VENDOR_LIBS = [
    'jquery', 'mustache'
];

const config = {
    entry: {
        bundle: 'index.js',
        vendor: VENDOR_LIBS,
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: '[name].[chunkhash].js',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env']
                    }
                }
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader"
                })
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: { limit: 40000 }
                    },
                    'image-webpack-loader'
                ]
            }
        ]
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({ names: ['vendor', 'manifest'] }),
        new ExtractTextPlugin('style.css'),
        new HtmlWebpackPlugin({ template: 'src/index.html' }),
        new webpack.DefinePlugin({ 'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV) }),
        new BrowserSyncPlugin(
            {
                host: 'localhost',
                port: 3050,
                proxy: 'http://localhost:3050/',
                files: ['./src/*.html']
            },
            {
                reload: true,
                injectCss: true
            }
        )
    ],
    resolve: {
        modules: ['./javascript', './styles', 'node_modules']
    }
};

module.exports = config;