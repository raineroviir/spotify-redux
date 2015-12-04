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

  createThePlaylist() {
    const {dispatch} = this.props;
    const token = this.props.auth.accessToken;
    const user = 'raineroviir';
    const name = 'my awesome Playlist';
    const tracks = this.props.auth.topTracks.map(track => {
      return track.uri;
    })
    dispatch(createPlaylist(tracks, name, user, token));
  }

  // addTracksToPlaylist() {
  //   const {dispatch} = this.props;
  //   const token = this.props.auth.accessToken;
  //   const user = 'raineroviir';
  //   const playlist = 'playlistID';
  //   const tracks = this.props.auth.topTracks.map(track => {
  //     return track.uri;
  //   })
  //   console.log(tracks);
  //   dispatch(addTracksToPlaylist(tracks, user, playlist, token))
  // }
  render() {
    const {dispatch} = this.props;
    const token = this.props.auth.accessToken;
    const followingArtists = this.props.auth.following;
    const savedPlaylists = this.props.auth.playlists;
    const topTracks = this.props.auth.topTracks;
    return (
      <div>
        <ul>
          <li><a href="/auth/spotify"><button>Sign in using Spotify</button></a></li>
          <li><button onClick={::this.getTheToken}>get token</button></li>
          <li><button onClick={::this.getThePlaylists}>Playlists</button></li>
          <li><button onClick={::this.getTheArtistsTopTracks}>Popular Artists Tracks</button></li>
          <li><button onClick={::this.createThePlaylist}>Create Playlist</button></li>
        </ul>
        <ul>
          {followingArtists.map(artist =>
          <div onClick={this.getTheRelatedArtists.bind(this, artist.id)} style={{height: '10em', width: '12em', backgroundImage: `url(${artist.images[2].url})`}} key={artist.id}>{artist.name}</div>)}
        </ul>
        <ul>
          {savedPlaylists.map(playlist =>
          <li key={playlist.id}><button onClick={this.getTheTracksFromPlaylist.bind(this, playlist.tracks.href)} key={playlist.id}>{playlist.name}: { playlist.tracks.total}</button></li>)}
        </ul>
        <ul>
          {topTracks.map(track =>
          <li key={track.id}>
          {track.name}
          </li>
          )}
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
