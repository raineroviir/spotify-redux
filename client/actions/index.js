import fetch from 'isomorphic-fetch';

export function getToken() {
  return dispatch => {
    return fetch('/api/token').then(response => response.json()).then(json => console.log(json))
  }
}

function receiveToken(token) {

}

export function fetchFollowers(token) {

  return fetch('https://api.spotify.com/v1/me/following?type=artist', {
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
  });
}
