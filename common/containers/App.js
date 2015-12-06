import React from 'react';
import fetch from 'isomorphic-fetch';
import { connect } from 'react-redux';
import {getToken, fetchFollowing, fetchRelatedArtists, fetchPlaylists, fetchSavedTracks, fetchTracksFromPlaylist, fetchArtistsTopTracks, createPlaylist} from '../actions';
import { Button } from 'react-bootstrap';

class App extends React.Component {
  render() {
    const {dispatch} = this.props;
    const token = this.props.auth.accessToken;
    const followingArtists = this.props.auth.following;
    return (
      <div>
        {!token && <div style={{fontSize: '2em', display: 'flex', justifyContent: 'center'}}>
        Welcome to Spotify 3x!
        </div>}
        {!token && <div style={{fontSize: '2em', display: 'flex', justifyContent: 'center'}}>This app will go through your 'Discover Weekly' Spotify playlist and create a playlist with each artists' top 3 songs.
        </div>}
        {!token && <a style={{display: 'flex', justifyContent: 'center'}} href="/auth/spotify"><Button bsSize="large" bsStyle="success" ><i style={{fontSize: '3em', marginRight: '0.5em'}} className="fa fa-spotify"></i><span style={{fontSize: '2em'}}>Create your Playlist!</span></Button></a>}
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
