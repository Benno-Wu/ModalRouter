const path = require('path')
const TerserPlugin = require('terser-webpack-plugin')

// test: npm link
// https://zhuanlan.zhihu.com/p/270649464

module.exports = {
    mode: 'production',
    entry: {
        index: './src/index.js',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        libraryTarget: 'umd',
    },
    // bug
    // https://caijialinxx.github.io/2019/11/20/fix-react-error-321-by-webpack-externals/
    externals: {
        react: {
            commonjs: 'react',
            commonjs2: 'react',
            amd: 'react',
            root: 'React',
        },
        'react-dom': {
            commonjs: 'react-dom',
            commonjs2: 'react-dom',
            amd: 'react-dom',
            root: 'ReactDOM',
        },
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-react', '@babel/preset-env'],
                        plugins: ["@babel/plugin-transform-runtime"],
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
    optimization: {
        minimize: true,
        // https://github.com/terser/terser#compress-options
        minimizer: [new TerserPlugin({
            // no comments
            terserOptions: {
                format: {
                    comments: false,
                },
                compress: {
                    pure_funcs: ['console.log']
                }
            },
            extractComments: false,
        })],
    }
}