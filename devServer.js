import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import express from 'express';
const app = express();
import path from 'path';

import webpackConfig from './webpack.config.dev';
const compiler = webpack(webpackConfig);

const port = 3000;

app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: webpackConfig.output.publicPath
}));
app.use(require('webpack-hot-middleware')(compiler));

app.use(express.static(path.join(__dirname)));

app.listen(port, function(error) {
  if (error) {
    console.log(error)
  } else {
    console.info("==> Listening on port %s.  Open up http://localhost:%s in your browser.", port, port)
  }
})
