import * as types from '../constants/ActionTypes';

const initialState = {
  accessToken: null,
  following: [],
  likes: {},
  playlists: [],
  user: null,
  tracks: [],
  artists: [],
  topTracks: []
}

export default function auth(state = initialState, action) {
  switch(action.type) {
    case types.RECEIVE_ACCESS_TOKEN:
      return {
        ...state, accessToken: action.accessToken
      }

    case types.RECEIVE_FOLLOWING:
      return {
        ...state, following: action.artists
      }

    case types.RECEIVE_PLAYLISTS:
      return {
        ...state, playlists: action.playlists
      }

    case types.RECEIVE_TRACKS_FROM_PLAYLIST:
      return {
        ...state, tracks: action.tracks
      }

    case types.RECEIVE_ARTISTS_FROM_PLAYLIST:
      return {
        ...state, artists: action.artists
      }

    case types.RECEIVE_ARTISTS_TOP_TRACKS:
      return {
        ...state, topTracks: [...state.topTracks, ...action.topTracks]
      }
    default:
      return state;
  }
}
