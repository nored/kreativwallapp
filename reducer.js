export const SET_SLUG = 'kreativwallapp/wallSlug/SET_SLUG';
export const SET_WALL_ID = 'kreativwallapp/wallID/SET_WALL_ID';
export const SET_WALL_NAME = 'kreativwallapp/wallName/SET_WALL_NAME';
export const SET_USER_ID = 'kreativwallapp/userID/SET_USER_ID';
export const SET_API_KEY = 'kreativwallapp/apiKey/SET_API_KEY';
export const SET_ANON = 'kreativwallapp/isAnon/SET_ANON';
export const BASE_URL = 'http://192.168.1.224:3000/v1';
export const WALLS_CONTROLLER = '/walls/';
export const USERS_CONTROLLER = '/users/';
export const COMMENTS_CONTROLLER = '/comments/';
export const TEXT_POST_CONTROLLER = '/text_posts/';
export const VIDEO_POST_CONTROLLER = '/video_posts/';
export const PICTURE_POST_CONTROLLER = '/picture_posts/';
export const LIKES_CONTROLLER = '/likes/';
export const STD_USER_ID = '14';
export const STD_API_KEY = 'sKzWNwMCVQZG8QhoklEEPAtt';
export const STD_IMAGE = 'http://192.168.1.224:3000/none/none.jpeg'

const initialState = { wallSlug: "", wallID: "", wallName: "", userID: "14", apiKey: "", isAnon: true };

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_SLUG:
        return { ...state, wallSlug: action.wallSlug };
    case SET_WALL_ID:
        return { ...state, wallID: action.wallID };
    case SET_WALL_NAME:
        return { ...state, wallName: action.wallName };
    case SET_USER_ID:
        return { ...state, userID: action.userID };
    case SET_ANON:
        return { ...state, isAnon: action.isAnon };
    case SET_API_KEY:
        return { ...state, apiKey: action.apiKey };
    default:
      return state;
  }
}

export function setSlug(slug) {
  return {
    type: SET_SLUG,
    wallSlug: slug
  };
}

export function setWallID(id) {
  return {
    type: SET_WALL_ID,
    wallID: id
  };
}

export function setWallName(name) {
  return {
    type: SET_WALL_NAME,
    wallName: name
  };
}

export function setUserID(id) {
  return {
    type: SET_USER_ID,
    userID: id
  };
}

export function setApiKey(key) {
  return {
    type: SET_API_KEY,
    apiKey: key
  };
}

export function setAnon(bool) {
  return {
    type: SET_ANON,
    isAnon: bool
  };
}

