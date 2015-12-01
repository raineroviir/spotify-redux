import React from 'react';
import fetch from 'isomorphic-fetch';
import { connect } from 'react-redux';
import getToken from '../actions';

class App extends React.Component {

  ComponentDidMount() {
    const {dispatch} = this.props;
    dispatch(getToken());
  }

  render() {
    return (
      <div>
      <a href="/auth/spotify">Sign in using Spotify</a>

        Hello world!!!!!
        <a href="/following">Get followed artists</a>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    auth: state.auth
  }
}

export default connect(mapStateToProps)(App)
