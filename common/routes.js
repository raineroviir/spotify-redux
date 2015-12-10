import { Route, IndexRoute, IndexRedirect, Redirect} from 'react-router';
import React from 'react';
import CreatePlaylist from './containers/CreatePlaylist';
import App from './containers/App';
import WelcomePage from './containers/WelcomePage';

function requireAuth(nextState, replaceState, callback) {
  return fetch('./api/token', {
    method: 'get',
    credentials: 'include'
  })
  .then(response => {
    return response.json()
  })
  .then(json => {
    console.log(json);
    if (!json.accessToken) {
      callback(replaceState({ nextPathname: nextState.location.pathname }, '/'))
    }
    callback()
  })
  .catch(error => {throw error});
}

export default (
  <Route name='app' path='/' component={App} >
    <IndexRoute component={WelcomePage} />
    <Route name='playlist' path='/playlist' component={CreatePlaylist} onEnter={requireAuth}/>
  </Route>
);
