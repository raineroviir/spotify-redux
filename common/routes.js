import { Route } from 'react-router';
import React from 'react';

import CreatePlaylist from './containers/CreatePlaylist';
import App from './containers/App';

export default (
  <Route name='app' path='/' component={App}>
    <Route name='playlist' path='/playlist' component={CreatePlaylist} />
  </Route>
);
