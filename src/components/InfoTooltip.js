import React from "react";


function InfoTooltip(props) {

  function handlePopupClick(e) {
    if (e.target.classList.contains('modal_open')) {
      props.onClose();
    }
  }

  return(
    <div className={`modal modal_type_tooltip ${props.isOpen ? 'modal_open' : '' }`} onClick={handlePopupClick}>
      <div className="modal__container">
        <button className="modal__close-button modal__close-button_type_form" type="button" aria-label="Close modal" onClick={props.onClose}></button>
        <div className="modal__form modal__form_type_tooltip">
          <img src={props.isRegistered ? SuccessIcon : FailureIcon} className="modal__tooltip-icon" alt="success icon" />
          <h2 className="modal__tooltip-text">{props.isRegistered ? 'Success! You have now been registered.' : 'Oops, something went wrong! Please try again.'}</h2>
        </div>
      </div>
    </div>
  );
}

export default InfoTooltip;