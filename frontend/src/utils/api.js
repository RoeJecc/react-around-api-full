class Api {
  constructor({ baseUrl, headers }) {
    this._baseUrl = baseUrl;
    this._headers = headers;
  }

  _checkServerResponse(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Error: ${res.status}`);
  }

  getInitialCards(token) {
    return fetch(this._baseUrl + "/cards/", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    }).then((res) => {
      return this._checkServerResponse(res);
    });
  }

  getUserInfo(token) {
    return fetch(this._baseUrl + "/users/me", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    }).then((res) => {
      return this._checkServerResponse(res);
    });
  }

  getAppInfo(token) {
    return Promise.all([this.getUserInfo(localStorage.getItem("jwt")), this.getInitialCards(localStorage.getItem("jwt"))]);
  }

  addCard({ name, link }, token) {
    return fetch(this._baseUrl + "/cards/", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
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
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
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
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
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
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
      method: "DELETE",
    }).then((res) => {
      return this._checkServerResponse(res);
    });
  }

  setUserInfo({ name, about }, token) {
    return fetch(this._baseUrl + "/users/me", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
      body: JSON.stringify({
        name,
        about,
      }),
    }).then((res) => {
      return this._checkServerResponse(res);
    });
  }

  setUserAvatar({ avatar }, token) {
    return fetch(this._baseUrl + "/users/me/avatar", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
      body: JSON.stringify({
        avatar,
      }),
    }).then((res) => {
      return this._checkServerResponse(res);
    });
  }
}

const api = new Api({
  baseUrl:
    process.env.NODE_ENV === "production"
      ? "https://api.jrecchia.students.nomoreparties.site"
      : "http://localhost:3000",
});

export default api;
