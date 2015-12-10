import * as types from '../constants/ActionTypes';

const initialState = {
  accessToken: null,
  isFollowingDW: null,
  playlists: [],
  username: null,
  topTracks: [],
  newPlaylistID: null,
  success: null,
  isMobile: false,
  screenHeight: null,
  screenWidth: null
}

export default function auth(state = initialState, action) {
  switch(action.type) {
    case types.RECEIVE_ACCESS_TOKEN:
      return {
        ...state, accessToken: action.accessToken
      }

    case types.RECEIVE_USERNAME:
      return {
        ...state, username: action.username
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

    case types.RECEIVE_SUCCESS:
      return {
        ...state, success: action.success
      }

    case types.RECEIVE_FAILURE:
      return {
        ...state, success: action.failure
      }

    case types.RECEIVE_NEW_PLAYLIST:
      return {
        ...state, newPlaylistID: action.newPlaylist.id
      }

    case types.CHANGE_IS_MOBILE:
      return {
        ...state, isMobile: action.isMobile
      }

    case types.CHANGE_WIDTH_AND_HEIGHT:
      return {
        ...state, screenHeight: action.screenHeight, screenWidth: action.screenWidth
      }

    case types.IS_FOLLOWING_DW:
      return {
        ...state, isFollowingDW: action.isFollowingDW
      }
    default:
      return state;
  }
}

export function isAuthLoaded(globalState) {
  return globalState.auth.accessToken && globalState.auth.username;
}
