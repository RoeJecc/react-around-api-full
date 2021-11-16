import React, { useState, useEffect} from "react";
import PopupWithForm from "./PopupWithForm.js";
import CurrentUserContext from "../contexts/CurrentUserContext.js";

function EditProfilePopup({ isOpen, onClose, onUpdateUser }) {

  const currentUser = React.useContext(CurrentUserContext);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  

  

  function handleNameChange(e){
    setName(e.target.value);
  }

  function handleDescriptionChange(e){
    setDescription(e.target.value)
  }
  
  function handleSubmit(e) {
    e.preventDefault();
    onUpdateUser({
      name: name,
      about: description,
    });
  }

  useEffect(() => {
      setName(currentUser?.name);
      setDescription(currentUser?.about);
  }, [  currentUser, isOpen ])

  return (
    <PopupWithForm
      name="profile"
      title="Edit Profile"
      buttonText="Save"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <input
        value = {name || ""}
        id="name"
        name="name"
        type="text"
        className="modal__text-input modal__text-input_type_name"
        required
        placeholder="Name"
        minLength={2}
        maxLength={40}
        onChange={handleNameChange}
      />
      <span id="name-error" className="modal__error" />
      <input
        value = {description || ""}
        id="occupation"
        name="occupation"
        type="text"
        placeholder="About Me"
        required
        className="modal__text-input modal__text-input_type_occupation"
        minLength={2}
        maxLength={200}
        onChange={handleDescriptionChange}
      />
      <span id="occupation-error" className="modal__error" />
    </PopupWithForm>
  );
}

export default EditProfilePopup;
