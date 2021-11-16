import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../images/Vector.svg";

function Register(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({});

  function handleEmail(e) {
    setEmail(e.target.value);
    setError({ ...error, [e.target.name]: e.target.validationMessage });
  }
  function handlePassword(e) {
    setPassword(e.target.value);
    setError({ ...error, [e.target.name]: e.target.validationMessage });
  }

  function resetInfo() {
    setEmail("");
    setPassword("");
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!Object.values(error).filter((e) => e).length) {
      props.handleRegister(password, email);
      resetInfo();
    }
  }

  return (
    <div className="login">
      <div className="login__container">
        <img src={logo} alt="logo" className="logo" />
        <Link to="/signin" className="login__link">
          Log in
        </Link>
      </div>
      <form action="#" className="login__form" onSubmit={handleSubmit}>
        <p className="login__title">Sign up</p>
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
          Sign up
        </button>
        <Link to="/signin" className="login__link login__text">
          Already a member? Log in here!
        </Link>
      </form>
    </div>
  );
}

export default Register;
