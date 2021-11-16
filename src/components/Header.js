import React from "react";
import logo from "../images/Vector.svg";

function Header(props) {
  function logout() {
    localStorage.removeItem("jwt");
    props.handleLogout();
  }

  return (
    <header className="header">
      <img
        className="header__vector"
        alt="Around The U.S."
        id="vector-image"
        src={logo}
      />
      <div className="header__container">
        <p className="header__email">{props.email}</p>
        <button className="header__logout" onClick={logout}>
          Log out
        </button>
      </div>
    </header>
  );
}

export default Header;
