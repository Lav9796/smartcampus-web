const API_ROOT = `${process.env.REACT_APP_API_URL}/api`;

/**
 * Calls SmartCampus API with proper options and formats response
 * @param  {String}  path     Endpoint to hit (e.g. '/events')
 * @param  {String}  method   HTTP verb (e.g. 'GET')
 * @param  {Object}  body     JSON request body
 * @return {Promise(Object)}  Response containing 'status' and 'body'
 */
const apiFetch = (path, method = 'GET', body = null) => {
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

var currentlyRefreshing = false;
const apiFetchWithRefresh = (path, method = 'GET', body = null) => {

  return apiFetch(path, method, body).catch(error => {
    console.log(JSON.stringify(error));
    if (error.body && error.body.error === "token_expired") {
      if (currentlyRefreshing) {
        // another request is currently refreshing the token, 
        // so wait for it before re-calling api
        return new Promise(resolve => {
          var _refreshCheck = setInterval(function() {
            if (!currentlyRefreshing) {
              clearInterval(_refreshCheck);
              apiFetch(path, method, body).then(resolve);
            } 
          }, 50);
        });
      } else {
        // refresh the token and call api if successful
        currentlyRefreshing = true;
        return apiFetch('/user/refresh', 'POST').then(response => {
          localStorage.setItem('token', response.body.user.token);
          currentlyRefreshing = false;
          return apiFetch(path, method, body);
        }).catch(error => {
          currentlyRefreshing = false;
          throw error;
        });
      }
    } 
      
    throw error;
  });

};

//===================================================================
// Request Helpers
//

const requests = {
  del: path =>
    apiFetchWithRefresh(path, 'DELETE'),
  get: path =>
    apiFetchWithRefresh(path, 'GET'),
  put: (path, body) =>
    apiFetchWithRefresh(path, 'PUT', body),
  post: (path, body) =>
    apiFetchWithRefresh(path, 'POST', body)
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