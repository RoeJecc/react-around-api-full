class Api {
  constructor({ baseURL, headers }) {
    this._baseURL = baseURL;
    this._headers = headers;
  }

  _checkServerResponse(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject("Error" + res.statusText);
  }

  getInitialCards(token) {
    return fetch(this._baseUrl + "/cards/", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }).then((res) => {
      return this._checkServerResponse(res);
    });
  }

  getUserInfo(token) {
    return fetch(this._baseUrl + "/users/me/", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }).then((res) => {
      return this._checkServerResponse(res);
    });
  }

  getAppInfo() {
    return Promise.all([this.getUserInfo(token), this.getInitialCards(token)]);
  }

  addCard({ name, link }, token) {
    return fetch(this._baseUrl + "/cards/", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      method: "POST",
      body: JSON.stringify({
        name,
        link,
      }),
    }).then((res) => {
      return this._checkServerResponse(res);
    });
  }

  removeCard(cardID, token) {
    return fetch(this._baseUrl + "/cards/" + cardID, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      method: "DELETE",
    }).then((res) => {
      return this._checkServerResponse(res);
    });
  }

  addLike(cardID, token) {
    return fetch(this._baseUrl + "/cards/likes/" + cardID, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      method: "PUT",
    }).then((res) => {
      return this._checkServerResponse(res);
    });
  }

  removeLike(cardID, token) {
    return fetch(this._baseUrl + "/cards/likes/" + cardID, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      method: "DELETE",
    }).then((res) => {
      return this._checkServerResponse(res);
    });
  }

  setUserInfo({ name, about }, token) {
    return fetch(this._baseUrl + "/users/me/", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name,
        about,
      }),
    }).then((res) => {
      return this._checkServerResponse(res);
    });
  }

  setUserAvatar(avatar) {
    return fetch(this._baseUrl + '/users/me/avatar/', { 
      headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
      }, 
      method: "PATCH", 
      body: JSON.stringify({ 
          avatar 
      }) 
  }).then((res) => {
      return this._checkServerResponse(res);
    });
  }
}

const api = new Api({
  baseUrl: 'http://localhost:3001',
});

export default api;
