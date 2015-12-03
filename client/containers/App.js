import React from 'react';
import fetch from 'isomorphic-fetch';
import { connect } from 'react-redux';
import {getToken, fetchFollowing, fetchRelatedArtists} from '../actions';

class App extends React.Component {

  getTheToken() {
    const {dispatch} = this.props;
    dispatch(getToken());
  }

  getTheFollowings() {
    const {dispatch} = this.props;
    const token = this.props.auth.accessToken;
    dispatch(fetchFollowing(token));
  }

  getTheRelatedArtists(artist) {
    const {dispatch} = this.props;
    console.log(artist);
    dispatch(fetchRelatedArtists(artist));
  }
  render() {
    const {dispatch} = this.props;
    const token = this.props.auth.accessToken;
    const artists = this.props.auth.following;
    return (
      <div>
        <ul>
          <a href="/auth/spotify"><button>Sign in using Spotify</button></a>
          <button onClick={::this.getTheToken}>get token</button>
          <button onClick={::this.getTheFollowings}>FOLLOWINGS </button>
          <button onClick={::this.getTheRelatedArtists}>related artists</button>
        </ul>
        <ul>
          {artists.map(artist =>
          <div onClick={this.getTheRelatedArtists.bind(this, artist.id)} style={{height: '10em', width: '12em', backgroundImage: `url(${artist.images[2].url})`}} key={artist.id}>{artist.name}</div>)}
        </ul>
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
