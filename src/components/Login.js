import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "./Header";
import logo from "../images/Vector.svg";

function Login(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleEmail(e) {
    setEmail(e.target.value);
  }

  function handlePassword(e) {
    setPassword(e.target.value);
  }

  function resetInfo() {
    setEmail("");
    setPassword("");
  }

  function handleSubmit(e) {
    e.preventDefault();
    props.handleAuthorize(password, email);
    resetInfo();
  }

  return (
    <div className="login">
      <Header headerText="Sign Up" headerLink="/signup" />
      <form action="#" className="login__form" onSubmit={handleSubmit}>
        <p className="login__title">Log in</p>
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="login__input"
          value={email}
          onChange={handleEmail}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="login__input"
          value={password}
          onChange={handlePassword}
          minLength={4}
          maxLength={12}
          required
        />
        <button className="login__submit" type="submit">
          Log in
        </button>
        <Link to="/signup" className="login__link login__text">
          Not a member yet? Sign up here!
        </Link>
      </form>
    </div>
  );
}

export default Login;
