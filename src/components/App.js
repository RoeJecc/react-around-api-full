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
import { checkToken, authorize, register } from "../utils/auth";

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
  const [selectedCard, setSelectedCard] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  React.useEffect(() => {
    api
      .getInitialCards()
      .then((res) => {
        setCards(res);
      })
      .catch((err) => console.log(err));
  }, []);

  React.useEffect(() => {
    api
      .getUserInfo()
      .then((res) => {
        setCurrentUser(res);
      })
      .catch((err) => console.log(err));
  }, []);

  function handleCardLike(card) {
    const isLiked = card.likes.some((i) => i._id === currentUser._id);
    let likeValue;
    if (isLiked === false) {
      likeValue = api.addLike(card._id);
    } else {
      likeValue = api.removeLike(card._id);
    }
    likeValue
      .then((newCard) => {
        const newCards = cards.map((c) => (c._id === card._id ? newCard : c));
        setCards(newCards);
      })
      .catch((err) => console.log(err));
  }

  function handleCardDelete(card) {
    api
      .removeCard(card._id)
      .then(() => {
        const cardList = cards.filter((c) => c._id !== card._id);
        setCards(cardList);
      })
      .catch((err) => console.log(err));
  }

  function handleUpdateUser({ name, about }) {
    api
      .setUserInfo({ name, about })
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  }

  function handleUpdateAvatar(avatar) {
    api
      .setUserAvatar(avatar)
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  }

  function handleAddPlace({ name, link }) {
    api
      .addCard({ name, link })
      .then((newCard) => {
        setCards([newCard, ...cards]);
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
    return register(password, email)
      .then((res) => {
        if (res.data) {
          setLoggedIn(true);
          history.push("/signin");
          handleAuthorize(password, email);
          setIsRegistered(true);
          setEmail(email);
          toggleTooltip();
          return;
        }
        setIsRegistered(false);
        toggleTooltip();
      })
      .catch((err) => console.log(err));
  }

  function handleAuthorize(password, email) {
    authorize(password, email)
      .then(({ token }) => {
        if (token) {
          localStorage.setItem("jwt", token);
          setLoggedIn(true);
          setEmail(email);
          return;
        }
        setIsRegistered(false);
        toggleTooltip();
      })
      .catch((err) => console.log(err));
  }

  function handleLogout() {
    setLoggedIn(!loggedIn);
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

  React.useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      return checkToken(jwt)
        .then(({ data }) => {
          if (data) {
            setLoggedIn(true);
            setEmail(data.email);
            return;
          }
          setLoggedIn(false);
        })
        .catch((err) => console.log(err));
    }
    setLoggedIn(false);
  }, []);

  return (
    <div className="page">
      <CurrentUserContext.Provider value={currentUser}>
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
          <Header email={email} handleLogout={handleLogout} />
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
