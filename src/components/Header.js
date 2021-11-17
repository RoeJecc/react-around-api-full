import React from "react";
import logo from "../images/Vector.svg";
import { Link } from "react-router-dom";

function Header({
  onLogout,
  handleLogout,
  headerLink,
  headerText,
  loggedIn,
  email,
  onClick,
}) {
  function logout() {
    onLogout();
  }

  return (
    <header className="header">
      <img src={logo} alt="logo" className="logo" />
      <div className="header__container">
        {loggedIn && <p className="header__email">{email}</p>}
        <Link
          className="header__logout"
          to={headerLink}
          onClick={loggedIn ? logout : ""}
        >
          {headerText}
        </Link>
      </div>
    </header>
  );
}

export default Header;
