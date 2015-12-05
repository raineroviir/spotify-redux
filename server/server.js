/* eslint-disable no-console, no-use-before-define */

import path from 'path'
import Express from 'express'
import qs from 'qs'

import webpack from 'webpack'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
import webpackConfig from '../webpack.config'

import React from 'react'
import { renderToString } from 'react-dom/server'
import { Provider } from 'react-redux'

import configureStore from '../common/store/configureStore'
import App from '../common/containers/App'
import { fetchCounter } from '../common/api/counter'
import { RoutingContext, match } from 'react-router';
import routes from '../common/routes';
import { createLocation } from 'history';

const app = new Express()
const port = 3000

import bodyParser from 'body-parser';

import passport from 'passport';
import passportSpotify from 'passport-spotify';
import spotifyConfig from '../config/spotify';
const SpotifyStrategy = passportSpotify.Strategy;
import session from 'express-session';
const COOKIE_PATH = 'accessToken';
passport.use(new SpotifyStrategy({
  clientID: spotifyConfig.clientID,
  clientSecret: spotifyConfig.clientSecret,
  callbackURL:  spotifyConfig.redirectURI,
  passReqToCallback: true
},
  function(req, accessToken, refreshToken, profile, done) {
    req.session.accessToken = accessToken;
    done(null);
  }
));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({ secret: 'spot', saveUninitialized: true, resave: false}));
app.use(passport.initialize());
app.use(passport.session());


app.get('/auth/spotify', passport.authenticate('spotify', {scope: [ 'playlist-read-private', 'playlist-modify-public', 'user-follow-read', 'user-library-read'], showDialog: true}), function(req, res) {
  // The request will be redirected to spotify for authentication, so this
// function will not be called.
});
//
app.get('/callback', passport.authenticate('spotify', {
  successRedirect: '/playlist',
  failureRedirect: '/playlist'})
)

app.get('/api/token', function(req, res) {
  res.json(req.session.accessToken);
});

// Use this middleware to set up hot module reloading via webpack.
const compiler = webpack(webpackConfig)
app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: webpackConfig.output.publicPath }))
app.use(webpackHotMiddleware(compiler))

// This is fired every time the server side receives a request
app.use(Express.static(path.join(__dirname)));

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
    const html = React.renderToString(InitialView);
    res.status(200).end(renderFullPage(html, initialState));
  })
})

// app.use(handleRender)
//
// function handleRender(req, res) {
//   // Query our mock API asynchronously
//   fetchCounter(apiResult => {
//     // Read the counter from the request, if provided
//     const params = qs.parse(req.query)
//     const auth = {
//       accessToken: null,
//       following: [],
//       likes: {},
//       playlists: [],
//       user: null,
//       tracks: [],
//       artists: [],
//       topTracks: []
//     }
//
//     // Compile an initial state
//     const initialState = { auth }
//
//     // Create a new Redux store instance
//     const store = configureStore(initialState)
//
//     // Render the component to a string
//     const html = renderToString(
//       <Provider store={store}>
//         <App />
//       </Provider>
//     )
//
//     // Grab the initial state from our Redux store
//     const finalState = store.getState()
//
//     // Send the rendered page back to the client
//     res.send(renderFullPage(html, finalState))
//   })
// }

function renderFullPage(html, initialState) {
  return `
    <!doctype html>
    <html>
      <head>
        <title>Discover More</title>
      </head>
      <body>
        <div id="react">${html}</div>
        <script>
          window.__INITIAL_STATE__ = ${JSON.stringify(initialState)}
        </script>
        <script src="/static/bundle.js"></script>
      </body>
    </html>
    `
}

app.listen(port, (error) => {
  if (error) {
    console.error(error)
  } else {
    console.info(`==> 🌎  Listening on port ${port}. Open up http://localhost:${port}/ in your browser.`)
  }
})
