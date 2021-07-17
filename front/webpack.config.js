const HtmlWebPackPlugin = require("html-webpack-plugin");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const ServiceWorkerWebpackPlugin= require('serviceworker-webpack-plugin');
const path = require('path',);

module.exports = {
    entry: './src/main.js',
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, '../server/dist')
    },
    module: {
        rules: [
        { test: /\.js$/, use: 'babel-loader' },
        { test: /\.vue$/, use: 'vue-loader' },
        { test: /\.css$/, 
          use: [
          { loader: 'vue-style-loader',},
          { loader: 'css-loader',      },
          { loader: 'postcss-loader',  
            options: {
            ident: 'postcss',
            plugins: [
              require('tailwindcss'),
              require('autoprefixer'),
            ],
          },
        },
      ]},
        { test: /\.html$/,
            use: [
                {
                    loader: "html-loader",
                    options: {  minimize: true } 
                }
            ]
        },
        ]
    },
    resolve: {
        alias: {
          "vue$": "vue/dist/vue.esm.js"
        },
        extensions: ['*', '.js', '.vue', '.json']
      },
    plugins: [
        new HtmlWebPackPlugin({
            template: './public/index.html',
          }),
        new VueLoaderPlugin(),
        new ServiceWorkerWebpackPlugin({
          entry: './src/sw.js',
          filename: 'sw.js'
        }),
    ],
    performance: {
        hints: process.env.NODE_ENV === 'production' ? "warning" : false
      },
};