import api from './api';

/*
 * Action Types
 */

export const ADD_EVENT = 'ADD_EVENT';
export const POST_EVENT = 'POST_EVENT';
export const FETCH_EVENTS = 'FETCH_EVENTS';

export const FETCH_CURRENT_USER = 'FETCH_CURRENT_USER';
export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';
export const REGISTER = 'REGISTER';

export const OPEN_MODAL = 'OPEN_MODAL';
export const CLOSE_MODAL = 'CLOSE_MODAL';

/*
 * Synchronous Action Creators
 */

export function addEvent(event) {
  return {
    type: ADD_EVENT,
    event
  }
}

export function openModal(modalType) {
  return {
    type: OPEN_MODAL,
    modalType
  }
}

export function closeModal() {
  return {
    type: CLOSE_MODAL
  }
}

/*
 * Async Action Creators
 */

export function fetchEvents() {
  return {
    type: FETCH_EVENTS,
    payload: api.Event.feed()
  }
}

export function postEvent(title, startTimestamp, endTimestamp, location, link, body) {
  return dispatch => {
    dispatch({ 
      type: POST_EVENT,
      payload: api.Event.create(title, startTimestamp, endTimestamp, location, link, body)
    }).then(res => {
      dispatch({ type: CLOSE_MODAL });
    });
  }
}

export function fetchCurrentUser() {
  return dispatch => {
    dispatch({ 
      type: FETCH_CURRENT_USER,
      payload: api.User.current()
    }).then(res => {
      localStorage.setItem('token', res.value.body.user.token);
    });
  }
}

export function login(email, password) {
  return dispatch => {
    dispatch({ 
      type: LOGIN,
      payload: api.User.login(email, password)
    }).then(res => {
      localStorage.setItem('token', res.value.body.user.token);
      dispatch({ type: CLOSE_MODAL });
    });
  }
}

export function register(username, email, password) {
  return dispatch => {
    dispatch({ 
      type: REGISTER,
      payload: api.User.register(username, email, password)
    }).then(res => {
      localStorage.setItem('token', res.value.body.user.token);
      dispatch({ type: CLOSE_MODAL });
    });
  }
}

export function logout() {
  return dispatch => {
    dispatch({ 
      type: LOGOUT,
      payload: api.User.logout()
    }).then(res => {
      localStorage.clear();
    });
  }
}
