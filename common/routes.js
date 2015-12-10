import { Route, IndexRoute, IndexRedirect, Redirect} from 'react-router';
import React from 'react';
import CreatePlaylist from './containers/CreatePlaylist';
import App from './containers/App';
import WelcomePage from './containers/WelcomePage';

function requireAuth(nextState, replaceState, callback) {

  // const redirect = () => {
  //   if (!isAuthLoaded) {
  //     replaceState({ nextPathname: nextState.location.pathname }, '/');
  //   }
  //   callback();
  // }
  // const isAuthLoaded = () => {
  //   return fetch('./api/token', {
  //   method: 'get',
  //   credentials: 'include'
  //   })
  //   .then(response => {
  //   return response.json()
  //   })
  //   .then(json => {
  //     console.log(json.accessToken);
  //     return json.accessToken;
  //   // if (!json.accessToken) {
  //   //   callback(replaceState({ nextPathname: nextState.location.pathname }, '/'))
  //   // }
  //   // callback()
  //   })
  //   .catch(error => {throw error});
  // }
  return fetch('./api/token', {
    method: 'get',
    credentials: 'include'
    })
    .then(response => {
    return response.json()
    })
    .then(json => {
      console.log(json.accessToken);
      return json.accessToken;
      callback();
    })
    .catch(error => {throw error});
}

export default (
  <Route name='app' path='/' component={App} >
    <IndexRoute component={WelcomePage} />
    <Route name='playlist' path='/playlist' component={CreatePlaylist} />
  </Route>
);
