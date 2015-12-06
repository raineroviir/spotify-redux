import fetch from 'isomorphic-fetch';
import * as types from '../constants/ActionTypes';

export function getTokenAndPlaylistAndTopTracks() {
  return dispatch => {
    fetch('./api/token', {
      method: 'get',
      credentials: 'include'
    })
    .then(response => {
      return response.json()
    })
    .then(json => {
      const accessToken = json.accessToken;
      const username = json.username;
      dispatch(receiveToken(accessToken))
      dispatch(receiveUsername(username))
      Promise.resolve(dispatch(fetchPlaylists(accessToken)))
      .then(playlist => {
        const href = playlist.href;
        dispatch(fetchArtistAndTopThreeTracksFromArtist(href, accessToken));
      })
    })
    .catch(error => {throw error});
  }
}

export function getTokenAndPlaylist() {
  return dispatch => {
    fetch('./api/token', {
      method: 'get',
      credentials: 'include'
    })
    .then(response => {
      return response.json()
    })
    .then(json => {
      const accessToken = json.accessToken;
      const username = json.username;
      dispatch(receiveToken(accessToken))
      dispatch(receiveUsername(username))
      return dispatch(fetchPlaylists(accessToken))
    })
    .catch(error => {throw error});
  }
}

export function getToken() {
  return dispatch => {
    fetch('./api/token', {
      method: 'get',
      credentials: 'include'
    })
    .then(response => {
      return response.json()
    })
    .then(json => {
      const accessToken = json.accessToken;
      const username = json.username;
      dispatch(receiveToken(accessToken))
      dispatch(receiveUsername(username))
      console.log(accessToken);
      return accessToken;
    })
    .catch(error => {throw error});
  }
}
function receiveToken(accessToken) {
  return {
    type: types.RECEIVE_ACCESS_TOKEN,
    accessToken
  }
}

function receiveUsername(username) {
  return {
    type: types.RECEIVE_USERNAME,
    username
  }
}

export function fetchPlaylists(token) {
  return dispatch => {
    return fetch(`https://api.spotify.com/v1/me/playlists?limit=50&offset=0`, {
      method: 'get',
      headers: {
        Authorization: 'Bearer ' + token
      }
    })
    .then(
      response => {
        return response.json();
      }
    ).then(json => {
      const discoverWeekly = json.items.filter(playlist => playlist.name === 'Discover Weekly');
      return discoverWeekly[0];
    })
    .catch(error => {throw error});
  }
}

function receivePlaylists(playlists) {
  return {
    type: types.RECEIVE_PLAYLISTS,
    playlists
  }
}
export function fetchTracksFromPlaylist(href, token) {
  return dispatch => {
    return fetch(href, {
      method: 'get',
      headers: {
        Authorization: 'Bearer ' + token
      }
    })
    .then(
      response => {
        return response.json();
      }
    ).then(json => {
      const tracks = json.tracks.items;
      return tracks;
    })
    .catch(error => {throw error});
  }
}

function receiveTracksFromPlaylist(tracks) {
  return {
    type: types.RECEIVE_TRACKS_FROM_PLAYLIST,
    tracks
  }
}

export function fetchArtistAndTopThreeTracksFromArtist(href, token) {
  console.log(href);
  console.log(token);
  return dispatch => {
    Promise.resolve(dispatch(fetchTracksFromPlaylist(href, token)))
    .then(tracks => {
      console.log(tracks);
      tracks.forEach(object => {
        const artist = object.track.artists[0].id;
        const filter = object.track.id;
        dispatch(fetchArtistsTopTracks(artist, filter));
      })
    })
  }
}

export function handleClick(href, token) {
  return dispatch => {
    return Promise.resolve(dispatch(fetchTracksFromPlaylist(href, token)))
    .then(tracks => {
      tracks.forEach(object => {
        const artist = object.track.artists[0].id;
        const filter = object.track.id;
        dispatch(fetchArtistsTopTracks(artist, filter));
      })
    })
  }
}

export function fetchArtistsTopTracks(artist, filter) {
  return dispatch => {
    return fetch(`https://api.spotify.com/v1/artists/${artist}/top-tracks?country=US`, {
      method: 'get'
    })
    .then(
      response => {
        return response.json();
      }
    ).then(json => {
      const tracks = json.tracks.slice(0,4);
      let filteredTracks = tracks.filter(track => {
        return track.id !== filter
      });
      if (filteredTracks.length > 3) {
        filteredTracks = filteredTracks.slice(0, 3);
      }
      dispatch(receiveArtistsTopTracks(filteredTracks));
    })
    .catch(error => {throw error});
  }
}

function receiveArtistsTopTracks(topTracks) {
  return {
    type: types.RECEIVE_ARTISTS_TOP_TRACKS,
    topTracks
  }
}

export function createPlaylist(tracks, playlistName, username, token) {
  return dispatch => {
    return fetch(`https://api.spotify.com/v1/users/${username}/playlists`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      },
      body: JSON.stringify({name: playlistName + ' created at DiscoverMore'})
    })
    .then(
      response => {
        return response.json();
      }
    ).then(json => {
      console.log(json);
      const playlist = json.id;
      dispatch(addTracksToPlaylist(tracks, username, playlist, token))
    })
    .catch(error => {throw error});
  }
}

function addTracksToPlaylist(tracks, username, playlist, token) {
  return dispatch => {
    return fetch(`https://api.spotify.com/v1/users/${username}/playlists/${playlist}/tracks`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      },
      body: JSON.stringify({uris: tracks})
    })
    .then(
      response => {
        return response.json();
      }
    ).then(json => {
      console.log(json);
    })
    .catch(error => {throw error});
  }
}
