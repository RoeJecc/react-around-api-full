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

  getInitialCards() {
    return fetch(this._baseURL + "/cards", {
      headers: this._headers,
    }).then((res) => {
      return this._checkServerResponse(res);
    });
  }

  getUserInfo() {
    return fetch(this._baseURL + "/users/me", {
      headers: this._headers,
    }).then((res) => {
      return this._checkServerResponse(res);
    });
  }

  getAppInfo() {
    return Promise.all([this.getUserInfo(), this.getInitialCards()]);
  }

  addCard({ name, link }) {
    return fetch(this._baseURL + "/cards", {
      headers: this._headers,
      method: "POST",
      body: JSON.stringify({
        name,
        link,
      }),
    }).then((res) => {
      return this._checkServerResponse(res);
    });
  }

  removeCard(cardID) {
    return fetch(this._baseURL + "/cards/" + cardID, {
      headers: this._headers,
      method: "DELETE",
    }).then((res) => {
      return this._checkServerResponse(res);
    });
  }

  addLike(cardID) {
    return fetch(this._baseURL + "/cards/likes/" + cardID, {
      headers: this._headers,
      method: "PUT",
    }).then((res) => {
      return this._checkServerResponse(res);
    });
  }

  removeLike(cardID) {
    return fetch(this._baseURL + "/cards/likes/" + cardID, {
      headers: this._headers,
      method: "DELETE",
    }).then((res) => {
      return this._checkServerResponse(res);
    });
  }

  setUserInfo({ name, about }) {
    return fetch(this._baseURL + "/users/me/", {
      method: "PATCH",
      headers: {
        authorization: "f3cf689f-e903-4b5b-9d77-2b0b4048d455",
        "Content-Type": "application/json",
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
    return fetch(this._baseURL + "/users/me/avatar/", {
      headers: this._headers,
      method: "PATCH",
      body: JSON.stringify({
        avatar,
      }),
    }).then((res) => {
      return this._checkServerResponse(res);
    });
  }
}

const api = new Api({
    baseURL: "https://around.nomoreparties.co/v1/group-12",
    headers: {
      authorization: "f3cf689f-e903-4b5b-9d77-2b0b4048d455",
      "Content-Type": "application/json",
    },
  });

  export default api;