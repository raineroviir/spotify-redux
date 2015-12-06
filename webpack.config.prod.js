import path from 'path';
import webpack from 'webpack';

module.exports = {
  devtool: 'source-map',
  entry: [
    'webpack-hot-middleware/client',
    './client/index'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
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
