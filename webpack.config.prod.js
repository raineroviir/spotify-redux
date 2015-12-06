var webpack = require("webpack");
var path = require("path");

module.exports = {
  devtool: 'source-map',
  entry: [
    './client/index'
  ],
  output: {
    path: path.join(__dirname, 'static'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'production')
      }
    }),
		new webpack.optimize.DedupePlugin()
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
