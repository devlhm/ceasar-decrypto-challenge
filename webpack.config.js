module.exports = {
    entry: {
        src: './src/index.js'
    },

    output: {
        filename: 'bundle.js',
        path: __dirname + '/dist'
    },

    module:{
        rules: [
          {test: /\.css$/, loader: "style-loader!css-loader"},
        //   {test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/, query:{presets:['es2015']}}
        ]
    },

    mode: 'development'
}