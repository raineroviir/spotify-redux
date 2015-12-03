import fetch from 'isomorphic-fetch';
import * as types from '../constants/ActionTypes';

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

export function fetchFollowing(token) {
  return dispatch => {
    return fetch('https://api.spotify.com/v1/me/following?type=artist&limit=50', {
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
      const artistList = json.artists.items; //array of 50 artists. limit of 50 is set by the API
      dispatch(receiveFollowing(artistList))
    })
    .catch(error => {throw error});
  }
}

function receiveFollowing(artistList) {
  return {
    type: types.RECEIVE_FOLLOWING,
    artistList
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
