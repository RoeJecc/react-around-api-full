import React from "react";

function ImagePopup(props) {
  return (
    <div
      className={`modal modal_type_preview ${props.isOpen ? "modal_open" : ""}`}
    >
      <div className="modal__container modal__container_preview">
        <button
          className="modal__close-button modal__close-button_preview"
          type="reset"
          name="close"
          onClick={props.onClose}
        />
        <figure className="modal__image-container">
          <img
            className="modal__image"
            alt="Picture"
            src={props.card ? props.card.link : "#"}
          />
          <figcaption className="modal__image-caption">
            {props.card ? props.card.name : ""}
          </figcaption>
        </figure>
      </div>
    </div>
  );
}

export default ImagePopup;
