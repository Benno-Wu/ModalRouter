const path = require('path')
const html = require('html-webpack-plugin')

module.exports = {
    mode: 'development',
    devtool: 'cheap-module-source-map',
    entry: {
        index: './src/test/index.jsx',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        libraryTarget: 'umd',
    },
    devServer: {
        contentBase: path.join(__dirname + 'dist'),
        hot: true,
        open: true,
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-react'],
                    },
                },
            },
            {
                test: /\.css/,
                use: [
                    { loader: 'style-loader' },
                    { loader: 'css-loader' },
                ]
            },
        ]
    },
    plugins: [
        new html({
            template: path.resolve(__dirname, './public/index.html'),
            favicon: './public/favicon.ico',
            hash: true,
        })
    ],
    optimization: {
        minimize: false,
    }
}