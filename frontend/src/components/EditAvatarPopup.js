import React, { useRef } from "react";
import PopupWithForm from "./PopupWithForm";

function EditAvatarPopup({ isOpen, onClose, onUpdateAvatar }) {
  
  const avatarRef = useRef();
  
  function handleSubmit(e) {
    e.preventDefault();
    onUpdateAvatar(avatarRef.current.value)
  }

  return (
    <PopupWithForm
      name="avatar"
      title="Change Profile Picture"
      buttonText="Save"
      isOpen={isOpen}
      onClose={onClose}
      onUpdateAvatar={onUpdateAvatar}
      onSubmit={handleSubmit}
    >
      <input
        ref={avatarRef}
        id="newAvatarURL"
        name="newAvatarURL"
        type="url"
        required
        placeholder="Image link"
        className="modal__text-input modal__text-input_type_url"
      />
      <span id="newAvatarURL-error" className="modal__error" />
    </PopupWithForm>
  );
}

export default EditAvatarPopup;
