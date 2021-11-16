import React from "react";
import logo from "../images/Vector.svg";

function Header() {
  return (
    <header className="header">
      <img
        className="header__vector"
        alt="Around The U.S."
        id="vector-image"
        src={logo}
      />
    </header>
  );
}

export default Header;
