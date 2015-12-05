import React from 'react';
import fetch from 'isomorphic-fetch';
import { connect } from 'react-redux';
import {getToken, fetchFollowing, fetchRelatedArtists, fetchPlaylists, fetchSavedTracks, fetchTracksFromPlaylist, fetchArtistsTopTracks, createPlaylist} from '../actions';

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
    dispatch(fetchRelatedArtists(artist));
  }

  getThePlaylists() {
    const {dispatch} = this.props;
    const token = this.props.auth.accessToken;
    dispatch(fetchPlaylists(token));
  }

  getTheSavedTracks() {
    const {dispatch} = this.props;
    const token = this.props.auth.accessToken;
    dispatch(fetchSavedTracks(token));
  }

  getTheTracksFromPlaylist(href) {
    const {dispatch} = this.props;
    const token = this.props.auth.accessToken;
    dispatch(fetchTracksFromPlaylist(href, token))
  }

  getTheArtistsTopTracks() {
    const {dispatch} = this.props;
    const token = this.props.auth.accessToken;
    this.props.auth.tracks.forEach(object => {
      const artist = object.track.artists[0].id;
      const filter = object.track.id;
      dispatch(fetchArtistsTopTracks(artist, filter));
    })
  }

  render() {
    const {dispatch} = this.props;
    const token = this.props.auth.accessToken;
    const followingArtists = this.props.auth.following;
    return (
      <div>
        {!token && <li><a href="/auth/spotify"><button>Sign in using Spotify</button></a></li>}
        {this.props.children}
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
