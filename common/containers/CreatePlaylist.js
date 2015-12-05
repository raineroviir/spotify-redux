import React from 'react';
import { connect } from 'react-redux';
import {getToken, fetchFollowing, fetchRelatedArtists, fetchPlaylists, fetchSavedTracks, fetchTracksFromPlaylist, fetchArtistsTopTracks, createPlaylist, getTokenAndPlaylist, handleClick} from '../actions';


class CreatePlaylist extends React.Component {

  componentDidMount() {
    console.log(this.props);
    const {dispatch, history} = this.props;
    const token = this.props.auth.accessToken;
    if(!token) {
      dispatch(getTokenAndPlaylist())
    } else {
      dispatch(fetchPlaylists(token));
    }
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

  handleTheClick(href) {
    const {dispatch} = this.props;
    const token = this.props.auth.accessToken;
    dispatch(handleClick(href, token));
  }

  render() {
    const savedPlaylists = this.props.auth.playlists;
    const topTracks = this.props.auth.topTracks;
    return (
      <div>
        <li><button onClick={this.getTheArtistsTopTracks.bind(this)}>Popular Artists Tracks</button></li>
        <li><button onClick={this.createThePlaylist.bind(this)}>Create Playlist</button></li>
        <ul>
          {savedPlaylists.map(playlist =>
          <li key={playlist.id}><button onClick={this.handleTheClick.bind(this, playlist.tracks.href)} key={playlist.id}>{playlist.name}: { playlist.tracks.total}</button></li>)}
        </ul>
        <ul>
          {topTracks.map(track =>
          <li key={track.id}>
          {track.name}
          </li>
          )}
        </ul>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    auth: state.auth
  }
}

export default connect(mapStateToProps)(CreatePlaylist)
