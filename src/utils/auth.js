const BASE_URL = 'http://localhost:3001';

function checkServerResponse(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject('Error' + res.statusText);
  }

export const register = (password, email) => {
    return fetch(`${BASE_URL}/signup`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password, email })
    })
    .then((res) => {
        return checkServerResponse(res);
    })
};

export const authorize = (password, email) => {
    return fetch(`${BASE_URL}/signin`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password, email })
    })
    .then((res) => {
        return checkServerResponse(res);
    })
    .then((data) => {
        if (data.token) {
            localStorage.setItem('jwt', data.token);
            return data;
        } return;
    })
};

export const checkToken = (token) => {
    return fetch(`${BASE_URL}/users/me`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        }
    })
    .then((res) => {
        return checkServerResponse(res);
    })
}