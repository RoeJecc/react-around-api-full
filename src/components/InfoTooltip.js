import React from "react";

function InfoTooltip({ isOpen, toggleTooltip, isRegistered }) {
  return (
    <div
      className={`tooltip ${isOpen && "tooltip_visible"}`}
      onClick={(e) => e.target === e.currentTarget && toggleTooltip()}
    >
      <div className="tooltip__container">
        <div className={isRegistered ? "tooltip__success" : "tooltip__error"} />
        <p className="tooltip__text">
          {isRegistered
            ? "Success! You are now registered."
            : "Oops, something went wrong! Please try again."}
        </p>
        <button
          className="tooltip__close-button"
          type="reset"
          name="close"
          onClick={toggleTooltip}
        />
      </div>
    </div>
  );
}

export default InfoTooltip;
