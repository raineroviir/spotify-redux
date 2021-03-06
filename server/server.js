/* eslint-disable no-console, no-use-before-define */

import path from 'path'
import Express from 'express'

import React from 'react'
import reactDOMServer from 'react-dom/server'
import { Provider } from 'react-redux'

import configureStore from '../common/store/configureStore'
import App from '../common/containers/App'
import { RoutingContext, match } from 'react-router';
import routes from '../common/routes';
import { createLocation } from 'history';

const app = new Express()
process.env.PORT = process.env.PORT || 3000;
import bodyParser from 'body-parser';

import passport from 'passport';
import passportSpotify from 'passport-spotify';
import spotifyConfig from '../config/spotify';
const SpotifyStrategy = passportSpotify.Strategy;
import cookieSession from 'cookie-session';

passport.use(new SpotifyStrategy({
  clientID: spotifyConfig.clientID,
  clientSecret: spotifyConfig.clientSecret,
  callbackURL: 'http://localhost:3000/callback',
  passReqToCallback: true
},
  function(req, accessToken, refreshToken, profile, done) {

    req.session.username = profile.username;
    req.session.accessToken = accessToken;
    done(null);
  }
));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
  name: 'session',
  keys: ['accessToken', 'username']
}))
app.use(passport.initialize());
app.use(passport.session());


app.get('/auth/spotify', passport.authenticate('spotify', {scope: [ 'playlist-read-private', 'playlist-modify-public'], showDialog: true}), function(req, res) {
  // The request will be redirected to spotify for authentication, so this
// function will not be called.
});

//there is a bug currently with passport where the failureredirect happens when a success should have.
app.get('/callback', passport.authenticate('spotify',
{
  successRedirect: '/',
  failureRedirect: '/playlist'
}))

app.get('/api/token', function(req, res) {
  res.json({ accessToken: req.session.accessToken, username: req.session.username });
});

// Use this middleware to set up hot module reloading via webpack.

if(process.env.NODE_ENV !== 'production') {
  const webpack = require('webpack')
  const webpackDevMiddleware = require('webpack-dev-middleware')
  const webpackHotMiddleware = require('webpack-hot-middleware')
  const webpackConfig = require('../webpack.config.dev')
  const compiler = webpack(webpackConfig)
  app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: webpackConfig.output.publicPath }))
  app.use(webpackHotMiddleware(compiler))
}
// This is fired every time the server side receives a request
app.use(Express.static(path.join(__dirname, '..', 'static')));

app.get('/*', function(req, res) {

  const location = createLocation(req.url)

  match({ routes, location }, (err, redirectLocation, renderProps) => {

    if(err) {
      console.error(err);
      return res.status(500).end('Internal server error');
    }

    if(!renderProps) {
      return res.status(404).end('Not found');
    }

    const store = configureStore();

    const InitialView = (
      <Provider store={store}>
        <RoutingContext {...renderProps} />
      </Provider>
    );

    const initialState = store.getState();
    const html = reactDOMServer.renderToString(InitialView);
    res.status(200).end(renderFullPage(html, initialState));
  })
})

function renderFullPage(html, initialState) {
  return `
    <!doctype html>
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css" />
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css" />
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
        <title>spotify3x</title>
      </head>
      <body>
        <div id="react">${html}</div>
        <script>
          window.__INITIAL_STATE__ = ${JSON.stringify(initialState)}
        </script>
        <script src="/dist/bundle.js"></script>
      </body>
    </html>
  `
}

app.listen(process.env.PORT, (error) => {
  if (error) {
    console.error(error)
  } else {
    console.info(`==> 🌎  Listening on port ${process.env.PORT}. Open up http://localhost:${process.env.PORT}/ in your browser.`)
  }
})
