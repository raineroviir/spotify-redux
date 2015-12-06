var webpack = require("webpack");
var path = require("path");
var relativeAssetsPath = './static/dist';
var assetsPath = path.join(__dirname, relativeAssetsPath);
var CleanPlugin = require('clean-webpack-plugin');

module.exports = {
  devtool: 'source-map',
  entry: [
    './client/index'
  ],
  output: {
    path: path.join(__dirname, './static/dist'),
    filename: 'bundle.js',
    publicPath: '/dist/'
  },
  plugins: [
    new CleanPlugin([relativeAssetsPath]),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'production')
      }
    }),
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
		new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ],
  module: {
      loaders: [
        {
          test: /\.js$/,
          loader: 'babel',
          exclude: /node_modules/,
          include: __dirname,
          query: {
            optional: [ 'runtime' ],
            stage: 0,
            env: {
              development: {
                plugins: [
                  'react-transform'
                ],
                extra: {
                  'react-transform': {
                    transforms: [
                      {
                        transform:  'react-transform-hmr',
                        imports: [ 'react' ],
                        locals:  [ 'module' ]
                      }
                    ]
                  }
                }
              }
            }
          }
        }
      ]
    }
};
