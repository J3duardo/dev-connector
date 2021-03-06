import { GET_PROFILE, PROFILE_ERROR, CLEAR_PROFILE, UPDATE_PROFILE, GET_PROFILES, GET_GITHUB_REPOS, SET_PROFILE_LOADER } from "../actions/types";

const initialState = {
  profile: null,
  profiles: [],
  repos: [],
  loading: false,
  error: {}
}

export default (state = initialState, action) => {
  switch(action.type) {
    case GET_PROFILE:
    case UPDATE_PROFILE:
      return {
        ...state,
        profile: action.payload,
        loading: false
      }
    case GET_PROFILES:
      return {
        ...state,
        profiles: action.payload,
        loading: false
      }
    case GET_GITHUB_REPOS:
      return {
        ...state,
        repos: action.payload,
        loading: false
      }
    case PROFILE_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      }
    case CLEAR_PROFILE:
      return {
        ...initialState,
        loading: false
      }
    case SET_PROFILE_LOADER:
      return {
        ...state,
        loading: true
      }
    default:
      return state
  }
}