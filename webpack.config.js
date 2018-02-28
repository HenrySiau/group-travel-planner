module.exports = {
    entry: './src/index.js',
    output: {
        path: __dirname + '/public',
        filename: 'bundle.js'
    },
    module: {
        loaders: [{
                test: /\.json$/,
                loader: 'json-loader'
            },
            {
                test: /\.js$/,
                loader: 'babel-loader'
            },
            {
                test: /\.css$/,
                use: [ 'style-loader', 'css-loader' ]
              }
        ]
        
    },
    resolve: {
        extensions: ['.js', '.jsx', '.css'],       
    }
};