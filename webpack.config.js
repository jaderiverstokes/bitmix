const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    entry: './src/index.js',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
            },
            {
               test: /\.(png|j?g|svg|gif)?$/,
               use: 'file-loader?name=./public/[name].[ext]'
              },
        ]
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },
    plugins: [
      new HtmlWebpackPlugin({
          template: "./public/index.html",
          filename: "./index.html"
      })
    ]
};
