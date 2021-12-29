import React, { useState } from "react";

import Header from "./Header.js";
import Main from "./Main.js";
import Footer from "./Footer.js";
import Login from "./Login.js";
import Register from "./Register.js";
import ProtectedRoute from "./ProtectedRoute.js";
import InfoTooltip from "./InfoTooltip.js";

import EditAvatarPopup from "./EditAvatarPopup.js";
import EditProfilePopup from "./EditProfilePopup.js";
import AddPlacePopup from "./AddPlacePopup.js";
import ImagePopup from "./ImagePopup.js";
import { Redirect, Route, Switch, useHistory } from "react-router-dom";
import api from "../utils/api.js";
import PopupWithForm from "./PopupWithForm.js";
import CurrentUserContext from "../contexts/CurrentUserContext.js";
import * as auth from "../utils/auth";

function App() {
  const history = useHistory();

  const [editAvatarOpen, setEditAvatarOpen] = useState(false);
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [addPlaceOpen, setAddPlaceOpen] = useState(false);
  const [imagePopupOpen, setImagePopupOpen] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [openTooltip, setOpenTooltip] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState("");

  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState({});
  const [currentUser, setCurrentUser] = useState({});
  const [token, setToken] = useState(localStorage.getItem("jwt"));

  React.useEffect(() => {
    if (token) {
      auth
        .checkToken(token)
        .then((res) => {
          setLoggedIn(true);
          setEmail(res.user.email);
          history.push("/");
          return api.getUserInfo(token);
        })
        .then((res) => {
          setCurrentUser(res.user);
          return api.getInitialCards(token);
        })
        .then((res) => {
          setCards(res.data);
        })
        .catch((err) => console.log(err));
    }
  }, [history, token]);

  function handleCardLike(card, token) {
    const isLiked = card.likes.some((i) => i === currentUser._id);

    if (isLiked === false) {
      api
        .addLike(card._id, token)
        .then((newCard) => {
          setCards((state) =>
            state.map((c) => (c._id === card._id ? newCard : c))
          );
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      api
        .removeLike(card._id, token)
        .then((newCard) => {
          setCards((state) =>
            state.map((c) => (c._id === card._id ? newCard : c))
          );
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  function handleCardDelete(card, token) {
    api
      .removeCard(card._id, token)
      .then(() => {
        const cardList = cards.filter((c) => c._id !== card._id);
        setCards(cardList);
      })
      .catch((err) => console.log(err));
  }

  function handleUpdateUser({ name, about }) {
    api
      .setUserInfo({ name, about }, token)
      .then((res) => {
        setCurrentUser(res.data);
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  }

  function handleUpdateAvatar(avatar, token) {
    api
      .setUserAvatar(avatar, token)
      .then((res) => {
        setCurrentUser(res.data);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleAddPlace({ name, link }, token) {
    api
      .addCard({ name, link }, token)
      .then((newCard) => {
        setCards([newCard.data, ...cards]);
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  }

  function handleEditAvatarClick() {
    setEditAvatarOpen(true);
  }

  function handleEditProfileClick() {
    setEditProfileOpen(true);
  }

  function handleAddPlaceClick() {
    setAddPlaceOpen(true);
  }

  function closeAllPopups() {
    setEditAvatarOpen(false);
    setEditProfileOpen(false);
    setAddPlaceOpen(false);
    setImagePopupOpen(false);
  }

  function handleCloseAllPopups(e) {
    if (e.target !== e.currentTarget) return;
    closeAllPopups();
  }

  function handleCardClick(card) {
    setSelectedCard(card);
    setImagePopupOpen(true);
  }

  function toggleTooltip() {
    setOpenTooltip(!openTooltip);
  }

  function handleRegister(password, email) {
    if (!password || !email) {
      return;
    }
    auth
      .register(password, email)
      .then((res) => {
        if (res) {
          setIsRegistered(true);
          toggleTooltip();
          history.push("/signin");
        } else {
          setIsRegistered(false);
          toggleTooltip();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleAuthorize(password, email) {
    if (!password || !email) {
      console.log("no email or password");
      return;
    }

    auth
      .authorize(password, email)
      .then((data) => {
        console.log({ data });
        if (data.token) {
          console.log({ token });
          localStorage.setItem("jwt", data.token);
          setToken(data.token);
          setLoggedIn(true);
          setEmail(email);
        }
      })
      .catch((err) => console.log(err));
  }

  function onLogout() {
    setLoggedIn(false);
    setEmail("");
    localStorage.removeItem("jwt");
    history.push("/signin");
  }

  React.useEffect(() => {
    const closeByEscape = (e) => {
      if (e.key === "Escape") {
        closeAllPopups();
      }
    };

    document.addEventListener("keydown", closeByEscape);

    return () => document.removeEventListener("keydown", closeByEscape);
  }, []);

  return (
    <div className="page">
      <CurrentUserContext.Provider value={currentUser}>
        <Switch>
          <Route path="/signin">
            {loggedIn ? (
              <Redirect to="/" />
            ) : (
              <Login handleAuthorize={handleAuthorize} />
            )}
          </Route>
          <Route path="/signup">
            {loggedIn ? (
              <Redirect to="/" />
            ) : (
              <Register handleRegister={handleRegister} />
            )}
          </Route>
          <ProtectedRoute path="/" loggedIn={loggedIn}>
            <Header
              email={email}
              onLogout={onLogout}
              loggedIn={loggedIn}
              headerText="Log out"
              headerLink="/signin"
            />
            <Main
              onEditAvatarClick={handleEditAvatarClick}
              onEditProfileClick={handleEditProfileClick}
              onAddPlaceClick={handleAddPlaceClick}
              cards={cards}
              onCardClick={handleCardClick}
              onCardLike={handleCardLike}
              onCardDelete={handleCardDelete}
            />
            <Footer />

            <EditAvatarPopup
              isOpen={editAvatarOpen}
              onClose={handleCloseAllPopups}
              onUpdateAvatar={handleUpdateAvatar}
            />
            <EditProfilePopup
              isOpen={editProfileOpen}
              onClose={handleCloseAllPopups}
              onUpdateUser={handleUpdateUser}
            />
            <AddPlacePopup
              isOpen={addPlaceOpen}
              onClose={handleCloseAllPopups}
              onAddPlace={handleAddPlace}
            />

            <ImagePopup
              card={selectedCard}
              isOpen={imagePopupOpen}
              onClose={closeAllPopups}
            />

            <PopupWithForm
              name="delete-card"
              title="Are you sure?"
              buttonText="Yes"
            />
          </ProtectedRoute>
          <Route path="/">
            {loggedIn ? <Redirect to="/" /> : <Redirect to="/signin" />}
          </Route>
        </Switch>
        <InfoTooltip
          isOpen={openTooltip}
          isRegistered={isRegistered}
          toggleTooltip={toggleTooltip}
        />
      </CurrentUserContext.Provider>
    </div>
  );
}

export default App;
