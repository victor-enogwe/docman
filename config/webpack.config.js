import webpack           from 'webpack';
import path              from 'path';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

process.env.NODE_ENV = process.env.NODE_ENV || "development";

const config = {
    entry: ['webpack-hot-middleware/client', './client/app.js'],
    output: {
        path: path.join(__dirname, '../client/assets/javascripts'),
        filename: 'bundle.js',
        publicPath: '/'
    },
    plugins: [
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),
        // new webpack.optimize.UglifyJsPlugin({
        //     compress: {
        //         warnings: false,
        //         'screw_ie8': true
        //     },
        //     output: {
        //         comments: false
        //     },
        //     sourceMap: false
        // }),
        new ExtractTextPlugin({
            filename: './client/assets/stylesheets/app.css',
            allChunks: true
        })
    ],
    resolve: {
        extensions: ['', '.js'],
        alias: {
        request: 'browser-request'
        }
    },
    module: {
        noParse: /\.min\.js$/,
        loaders: [
            // Javascript
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: path.join(__dirname, '../client'),
                query: {
                    "env": {
                        "development": {
                            "presets": ["react-hmre"],
                            "plugins": [
                                ["react-transform", {
                                    "transforms": [{
                                        "transform": "react-transform-hmr",
                                        "imports": ["react"],
                                        "locals": ["module"]
                                    }]
                                }]
                            ]
                        }
                    },
                }
            },
            // scss
            {
                test: /(\.scss|\.css)$/,
                loaders: [
                    require.resolve('style-loader'),
                    require.resolve('css-loader') + '?sourceMap&modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]',
                    require.resolve('sass-loader') + '?sourceMap',
                    require.resolve('postcss-loader')
                ]
            }
        ]
    }

}

export default config;