import { Route, IndexRoute, IndexRedirect, Redirect} from 'react-router';
import React from 'react';
import CreatePlaylist from './containers/CreatePlaylist';
import App from './containers/App';
import WelcomePage from './containers/WelcomePage';

export default (
  <Route name='app' path='/' component={App} >
    <IndexRoute component={WelcomePage} />
    <Route name='playlist' path='/playlist' component={CreatePlaylist} />
  </Route>
);
