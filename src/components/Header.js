import React from "react";
import vector from "../images/Vector.svg";

function Header() {
  return (
    <header className="header">
      <img
        className="header__vector"
        alt="Around The U.S."
        id="vector-image"
        src={vector}
      />
    </header>
  );
}

export default Header;
