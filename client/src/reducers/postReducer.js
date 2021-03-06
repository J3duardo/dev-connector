import {GET_POSTS, POST_ERROR, UPDATE_LIKES, DELETE_POST, ADD_POST, GET_POST, ADD_COMMENT, REMOVE_COMMENT, SET_LOADER} from "../actions/types";

const initialState = {
  posts: [],
  post: null,
  loading: false,
  error: {}
}

export default (state = initialState, action) => {
  switch(action.type) {
    case GET_POSTS:
      return {
        ...state,
        posts: action.payload,
        error: {},
        loading: false
      }
    case GET_POST:
      return {
        ...state,
        post: action.payload,
        error: {},
        loading: false
      }
    case POST_ERROR:
      return {
        ...state,
        error: action.payload,
        post: null,
        loading: false
      }
    case UPDATE_LIKES:
      return {
        ...state,
        posts: state.posts.map(post => post._id === action.payload.id ?
          {...post, likes: action.payload.likes}
          : post)
      }
    case DELETE_POST:
      return {
        ...state,
        posts: [...action.payload],
        error: {},
        loading: false
      }
    case ADD_POST:
      return {
        ...state,
        posts: [...state.posts, action.payload],
        loading: false
      }
    case ADD_COMMENT:
      return {
        ...state,
        post: {...state.post, comments: action.payload},
        loading: false
      }
    case REMOVE_COMMENT:
      return {
        ...state,
        post: {...state.post, comments: action.payload},
        loading: false
      }
    case SET_LOADER:
      return {
        ...state,
        loading: true
      }
    default:
      return state
  }
}