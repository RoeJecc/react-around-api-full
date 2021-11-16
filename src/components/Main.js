import React, { useContext } from "react";
import Card from "./Card.js";
import CurrentUserContext from "../contexts/CurrentUserContext.js";

function Main({
  onEditAvatarClick,
  onEditProfileClick,
  onAddPlaceClick,
  cards,
  onCardClick,
  onCardLike,
  onCardDelete,
}) {
  const currentUser = useContext(CurrentUserContext);

  return (
    <main className="content">
      <section className="profile">
        <div className="profile__avatar-container">
          <img
            className="profile__avatar"
            src={currentUser ? currentUser.avatar : ""}
            alt="Cousteau Image"
            id="cousteau-image"
          />
          <div className="profile__overlay">
            <button
              onClick={onEditAvatarClick}
              className="profile__avatar-button"
              type="button"
              name="avatar"
            />
          </div>
        </div>
        <div className="profile__info">
          <h1 className="profile__name">
            {currentUser ? currentUser.name : ""}
          </h1>
          <button
            onClick={onEditProfileClick}
            className="profile__edit-button"
            type="button"
            name="edit"
          />
          <p className="profile__occupation">
            {currentUser ? currentUser.about : ""}
          </p>
        </div>
        <button
          onClick={onAddPlaceClick}
          className="profile__add-button"
          type="button"
          name="add"
        />
      </section>
      <section className="elements">
        {cards.map((card) => (
          <Card
            key={card._id}
            card={card}
            onCardClick={onCardClick}
            onCardLike={onCardLike}
            onCardDelete={onCardDelete}
          />
        ))}
      </section>
    </main>
  );
}

export default Main;
