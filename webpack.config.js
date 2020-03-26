const path= require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// const {CleanWebpackPlugin} = require('clean-webpack-plugin');

const config = {
    mode:'development',
    devtool:'inline-source-map',
    devServer:{
        contentBase:path.join(__dirname, 'dist')
    },
    entry:{
        main:'./src/main.js'
    },
    output:{
        path:path.join(__dirname,'./dist'),
        // publicPath: "/dist/",
        filename:'main.js'
    },
    module:{
        rules:[
            {
                test:/\.vue$/,
                loader:'vue-loader',
                options:{
                    css:[
                        {
                            loader: MiniCssExtractPlugin.loader
                        },
                        'css-loader'
                    ]
                }
            },
            {
                test:/\.js$/,
                loader: 'babel-loader',
                exclude:/node_modules/
            },
            {
                test:/\.css$/,
                use:[
                    {
                        loader: MiniCssExtractPlugin.loader
                    },
                    'css-loader'
                ]
            },
            {
                test: /\.(gif|jpg|png|woff|svg|eot|ttf)\??.*$/,
                loader: 'url-loader?limit=1024'
            }
        ]
    },
    plugins:[
        // new ExtractTextPlugin('main.css'),
        new HtmlWebpackPlugin({
            filename: "index.html",
            title:'知乎日报',
            template: "./index.html"
        }),

        new VueLoaderPlugin(),
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: "[name].css",
            chunkFilename: "[id].css"
        })
    ],
    resolve: {
        extensions: ['.js', '.vue', '.css'] // import引入文件的时候不用加后缀

    }
}
module.exports =config;
