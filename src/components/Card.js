import React, { useContext } from "react";
import CurrentUserContext from '../contexts/CurrentUserContext.js';

function Card({ card, onCardDelete, onCardClick, onCardLike}) {
  const currentUser = useContext(CurrentUserContext);

  const isOwn = card.owner._id === currentUser._id;

  const cardDeleteButtonClassName = (
    `element__delete-button ${isOwn ? 'element__delete-button_active' : 'element__delete-button'}`
  );

  const isLiked = card.likes.some(i => i._id === currentUser._id);

  const cardLikeButtonClassName = `element__button ${isLiked ? 'element__button_active' : 'element__button'}`;

  function handleCLick() {
    onCardClick(card);
  }

  return (
    <div className="element">
      <button className={cardDeleteButtonClassName} type="button" onClick={() => onCardDelete(card)} />
      <img
        className="element__image"
        src={card.link}
        alt={card.name}
        onClick={handleCLick}
      />
      <div className="element__info">
        <h2 className="element__text">{card.name}</h2>
        <div className="element__like-container">
          <button className={cardLikeButtonClassName} type="button" onClick={() => onCardLike(card)} />
          <p className="element__likes">{card.likes.length}</p>
        </div>
      </div>
    </div>
  );
}

export default Card;
