import React, { useState } from "react";
import PopupWithForm from "./PopupWithForm";

function AddPlacePopup({ isOpen, onClose, onAddPlace }) {
  const [cardName, setCardName] = useState("");
  const [link, setLink] = useState("");

  function handleCardNameChange(e){
    setCardName(e.target.value);
  }

  function handleLinkChange(e){
    setLink(e.target.value);
  }
  
  
  function handleSubmit(e) {
    e.preventDefault();
    onAddPlace({
      name: cardName,
      link: link
    })
    setCardName("")
    setLink("")
  }

  return (
    <PopupWithForm
      name="add-card"
      title="New Place"
      buttonText="Create"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <input
        value={cardName}
        onChange= {handleCardNameChange}
        id="newCardTitle"
        name="newCardTitle"
        type="text"
        className="modal__text-input modal__text-input_type_name"
        required
        placeholder="Title"
        minLength={1}
        maxLength={30}
      />
      <span id="newCardTitle-error" className="modal__error" />
      <input
        value={link}
        onChange={handleLinkChange}
        id="newCardURL"
        name="newCardURL"
        type="url"
        placeholder="Image link"
        required
        className="modal__text-input modal__text-input_type_url"
      />
      <span id="newCardURL-error" className="modal__error" />
    </PopupWithForm>
  );
}

export default AddPlacePopup;
