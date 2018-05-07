const jwtDecode = require('jwt-decode');

const API_ROOT = `${process.env.REACT_APP_API_URL}/api`;

var currentlyRefreshing = false;

/**
 * Calls SmartCampus API with proper options and formats response
 * @param  {String}  path     Endpoint to hit (e.g. '/events')
 * @param  {String}  method   HTTP verb (e.g. 'GET')
 * @param  {Object}  body     JSON request body
 * @return {Promise(Object)}  Response containing 'status' and 'body'
 */
const apiFetch = (path, method = 'GET', body = null) => {
  return new Promise(function(resolve, reject){
    if (isTokenExpired()) {
      console.log("token expired");
      // For multiple async requests, the first will 
      // refresh the token and the others will wait.
      var _refreshCheck = setInterval(function() {
        if (!currentlyRefreshing) {
          console.log(path + " done waiting.");
          clearInterval(_refreshCheck);
          return refreshToken().then(() => {
            console.log(path + " calling api..");
            return apiWrapper(path, method, body);
          });
        } else {
          console.log(path + " waiting for refreshed token..");
        }
      }, 50);
    } else {
      console.log("token not expired, calling api");
      return apiWrapper(path, method, body);
    }
  });
};

function apiWrapper (path, method = 'GET', body = null) {
  const options = {
    method,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  };

  // Add POST/PUT body, if given
  if (body) {
    options.body = JSON.stringify(body);
  }

  // Add token as header, if in storage
  const token = localStorage.getItem('token');
  if (token) {
    options.headers['Authorization'] = `Bearer ${token}`;
  }

  // Call the API
  return fetch(`${API_ROOT}${path}`, options).then(response => {
    return response.json().then(json => {
      
      // Wrap response json body with status code
      const status_json = {
        status: response.status,
        body: json
      };

      // Reject promise if bad response
      return response.ok ? status_json : Promise.reject(status_json);
    });
  });
}

/**
 * Checks if token is expired.
 * @return {Boolean} true if expired, false otherwise.
 */
function isTokenExpired() {
  const token = localStorage.getItem('token');

  if (!token) {
    return false; // no token
  } else {
    const jwt = jwtDecode(token);
    const current_time = Date.now() / 1000;
    return current_time >= jwt.exp;
  }
}

// Attempts to refresh the stored JWT token if expired
function refreshToken() {
  currentlyRefreshing = true;

  return apiWrapper('/user/refresh', 'POST').then(response => {
    localStorage.setItem('token', response.body.user.token);
    currentlyRefreshing = false;
  }).catch(error => {
    currentlyRefreshing = false;
  });
};

//===================================================================
// Request Helpers
//

const requests = {
  del: path =>
    apiFetch(path, 'DELETE'),
  get: path =>
    apiFetch(path, 'GET'),
  put: (path, body) =>
    apiFetch(path, 'PUT', body),
  post: (path, body) =>
    apiFetch(path, 'POST', body)
};

const User = {
  current: () =>
    requests.get('/user'),
  login: (email, password) =>
    requests.post('/user/login', { user: { email, password } }),
  logout: () =>
    requests.post('/user/logout'),
  register: (username, email, password) =>
    requests.post('/user/register', { user: { username, email, password } })
};

const Event = {
  create: (title, time, location, link, body) =>
    requests.post('/events', { event: { title, time, location, link, body } }),
  delete: (id) =>
    requests.del('/events/' + id),
  get: (id) =>
    requests.get('/events/' + id),
  feed: () =>
    requests.get('/events')
};

export default {
  User, Event
};