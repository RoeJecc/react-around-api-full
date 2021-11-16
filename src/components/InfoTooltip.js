import React from "react";
import SuccessIcon from "../images/Union.svg";
import FailureIcon from "../images/Union2.svg";


function InfoTooltip({ isOpen, onClose, isRegistered }) {


  return(
    <div className={`modal modal_type_tooltip ${isOpen ? "modal_open" : ""}`} onClick={onClose}>
      <div className="modal__container">
        <button className="modal__close-button modal__close-button_type_form" type="button" aria-label="Close modal" onClick={onClose}></button>
        <div className="modal__form modal__form_type_tooltip">
          <img src={isRegistered ? SuccessIcon : FailureIcon} className="modal__tooltip-icon" alt="success icon" />
          <h2 className="modal__tooltip-text">{isRegistered ? 'Success! You have now been registered.' : 'Oops, something went wrong! Please try again.'}</h2>
        </div>
      </div>
    </div>
  );
}

export default InfoTooltip;