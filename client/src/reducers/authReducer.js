import {REGISTER_SUCCESS, REGISTER_FAIL} from "../actions/types";

const initialState = {
  token: localStorage.getItem("token"),
  isAuthenticated: false,
  loading: true,
  user: null
}

export default (state = initialState, action) => {
  switch(action.type) {
    case REGISTER_SUCCESS:
      localStorage.setItem("token", action.payload.token);
      return {
        ...state,
        ...action.payload,
        isAuthtenticated: true,
        loading: false
      }
    case REGISTER_FAIL:
      localStorage.removeItem("token");
      return {
        ...state,
        token: null,
        isAuthtenticated: false,
        loading: false
      }
    default:
      return state;
  }
}