import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import express from 'express';

import React from 'react';
import { RoutingContext, match } from 'react-router';
import { Provider } from 'react-redux';
import {createLocation} from 'history';

import configureStore from './client/store/configureStore';
import routes from './client/routes';
import packagejson from './package.json';

const app = express();

const renderFullPage = (html, initialState) => {
  return `
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Full Stack Web Developer based in London</title>
        <link rel="stylesheet" type="text/css" href="/static/app.css">
      </head>
      <body>
        <div id="react">${html}</div>
        <script>
          window.__INITIAL_STATE__ = ${JSON.stringify(initialState)};
        </script>
        <script src="/static/bundle.js"></script>
      </body>
    </html>
  `;
}

if(process.env.NODE_ENV !== 'production') {
  const compiler = webpack(webpackConfig);
  app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: webpackConfig.output.publicPath
  }));
  app.use(require('webpack-hot-middleware')(compiler));
  app.use(express.static(path.join(__dirname)));
}

function fetchComponentDataBeforeRender(dispatch, components, params) {
  const needs = components.reduce( (prev, current) => {
    return (current.need || [])
      .concat((current.WrappedComponent ? current.WrappedComponent.need : []) || [])
      .concat(prev);
    }, []);
    const promises = needs.map(need => dispatch(need()));
    return Promise.all(promises);
}

app.get('/*', function (req, res) {
  const location = createLocation(req.url);

  match({ routes, location }), (err, redirectLocation, renderProps) => {
    if (err) {
      console.error(err);
      return res.status(500).end('Internal Server Error');
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

    fetchComponentDataBeforeRender(store.dispatch, renderProps.components, renderProps.params)
    .then(html => {
      const componentHTML = React.renderToString(InitialView);
      const initialState = store.getState();
      res.status(200).end(renderFullPage(componentHTML, initialState))
    })
    .catch(err => {
      console.log(err)
      res.end(renderFullPage("",{}))
    });

  }
})

const server = app.listen(3002, function() {
  const host = server.address().address;
  const port = server.address().port;
  console.log('example app listening at http://%s:%s', host, port);
});

import path from 'path';
import bodyParser from 'body-parser';
import webpackConfig from './webpack.config.dev';
import passport from 'passport';
import passportSpotify from 'passport-spotify';
import session from 'express-session';
import spotifyConfig from './config/spotify';
const SpotifyStrategy = passportSpotify.Strategy;
const port = 3000;
import cookieParser from 'cookie-parser';

passport.serializeUser(function(user, done) {
  // console.log('serializeUser: ' + user.id)
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  findUser(id, function(err, user) {
    // console.log('deserializeUser: ' + user.id);
    done(err, user);
  });
});

// set up the DB
import r from 'rethinkdb';
const dbConfig = {
  host: process.env.RDB_HOST || 'localhost',
  port: parseInt(process.env.RDB_PORT) || 28015
};
let connection = null
r.connect({ host: dbConfig.host, port: dbConfig.port }, function(err, conn) {

  if (err) throw err;
  connection = conn;
  r.db('test').tableList().contains('users').do(function(databaseExists) {
    return r.branch(
      databaseExists,
      { created: 0 },
      r.db('test').tableCreate('users')
    );
  });
});

// DB functions, TODO: move these to a separate file
function saveUser(profile, callback) {
  r.db('test').table('users').insert(profile, {conflict:"update"}).run(connection, function(err, result) {
    if (err) {
      console.log(err);
      callback(err);
    }
    callback(null, true);
  });
}
function findUser(id, callback) {
  r.db('test').table('users').get(id).run(connection, function(err, result) {
    if (err) {
      console.log(err);
      callback(err);
    }
    callback(null, result);
  });
}

passport.use(new SpotifyStrategy({
  clientID: spotifyConfig.clientID,
  clientSecret: spotifyConfig.clientSecret,
  callbackURL:  spotifyConfig.redirectURI,
  passReqToCallback: true
},
  function(req, accessToken, refreshToken, profile, done) {
    // if(!req.user) {
    //  // Not logged-in. Authenticate based on spotify account.
    // } else {
    //
    // }
    req.session.accessToken = accessToken;
    saveUser(profile._json, function(err, user) {
      if (err) { return done(err); }
      done(null, profile._json);
    });
  }
));
app.use(cookieParser());
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
app.get('/callback', passport.authenticate('spotify', { failureRedirect: '/login'}), function(req, res) {
  res.redirect('/');
});

app.get('/api/token', function(req, res) {
  res.json(req.session.accessToken);
});

app.listen(port, function(error) {
  if (error) {
    console.log(error)
  } else {
    console.info("==> Listening on port %s.  Open up http://localhost:%s in your browser.", port, port)
  }
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
}
