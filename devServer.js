import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import express from 'express';
const app = express();
import path from 'path';
import bodyParser from 'body-parser';
import webpackConfig from './webpack.config.dev';
const compiler = webpack(webpackConfig);
import passport from 'passport';
import passportSpotify from 'passport-spotify';
import session from 'express-session';
import spotifyConfig from './config/spotify';
const SpotifyStrategy = passportSpotify.Strategy;
import fetch from 'isomorphic-fetch';
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
app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: webpackConfig.output.publicPath
}));
app.use(require('webpack-hot-middleware')(compiler));

app.use(express.static(path.join(__dirname)));

app.get('/auth/spotify', passport.authenticate('spotify', {scope: [ 'playlist-read-private', 'playlist-modify-public', 'user-follow-read', 'user-library-read'], showDialog: true}), function(req, res) {
  // The request will be redirected to spotify for authentication, so this
// function will not be called.
});

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
