import fetch from 'isomorphic-fetch';
import * as types from '../constants/ActionTypes';

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
      const accessToken = json;
      dispatch(receiveToken(accessToken))
      dispatch(fetchPlaylists(accessToken))
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
      return dispatch(receiveToken(json))
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

export function fetchSavedTracks(token) {
  return dispatch => {
    return fetch(`https://api.spotify.com/v1/me/tracks?limit=50&offset=0`, {
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
      console.log(json);
    })
    .catch(error => {throw error});
  }
}

export function fetchFollowing(token) {
  return dispatch => {
    return fetch('https://api.spotify.com/v1/me/following?type=artist&limit=50&offset=0', {
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
      console.log(json);
      const artists = json.artists.items; //array of 50 artists. limit of 50 is set by the API
      dispatch(receiveFollowing(artists))
    })
    .catch(error => {throw error});
  }
}

function receiveFollowing(artists) {
  return {
    type: types.RECEIVE_FOLLOWING,
    artists
  }
}

export function fetchRelatedArtists(artist) {
  return dispatch => {
    return fetch(`https://api.spotify.com/v1/artists/${artist}/related-artists`, {
      method: 'get'
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
      const artists = json.items;
      dispatch(receivePlaylists(artists))
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
      const tracks = json.items;
      dispatch(receiveTracksFromPlaylist(tracks))
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

export function createPlaylist(tracks, name, user, token) {
  return dispatch => {
    return fetch(`https://api.spotify.com/v1/users/${user}/playlists`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      },
      body: JSON.stringify({name: name + ' from DiscoverMore'})
    })
    .then(
      response => {
        return response.json();
      }
    ).then(json => {
      console.log(json);
      const playlist = json.id;
      dispatch(addTracksToPlaylist(tracks, user, playlist, token))
    })
    .catch(error => {throw error});
  }
}

function addTracksToPlaylist(tracks, user, playlist, token) {
  return dispatch => {
    return fetch(`https://api.spotify.com/v1/users/${user}/playlists/${playlist}/tracks`, {
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
