import React, { useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { loginUser, signProvider } from "../actions";
import Header from "../components/Header";
import "../assets/styles/components/Login.scss";
import googleIcon from "../assets/static/google-icon.png";
import twitterIcon from "../assets/static/twitter-icon.png";
import facebookIcon from "../assets/static/facebook-icon.svg";
import linkedinIcon from "../assets/static/linkedin-icon.svg";

const Login = (props) => {
  const [form, setValues] = useState({
    email: "",
  });

  const handleInput = (event) => {
    // si pasamos una sola propiedad no es necesario poner los paréntesis (event)
    setValues({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    props.loginUser(form, "/");
  };

  const handleSignProvider = (socialMedia) => {
    props.signProvider(socialMedia, "/");
  };

  return (
    <>
      <Header isLogin />
      <section className="login">
        <section className="login__container">
          <h2>Inicia sesión</h2>
          <form className="login__container--form" onSubmit={handleSubmit}>
            <input
              name="email"
              className="input"
              type="text"
              placeholder="Correo"
              onChange={handleInput}
            />
            <input
              name="password"
              className="input"
              type="password"
              placeholder="Contraseña"
              onChange={handleInput}
            />
            <button className="button" type="submit">
              Iniciar sesión
            </button>
            <div className="login__container--remember-me">
              <label>
                <input type="checkbox" id="cbox1" value="first_checkbox" />
                Recuérdame
              </label>
              <a href="/">Olvidé mi contraseña</a>
            </div>
          </form>
          <section className="login__container--social-media">
            <div onClick={() => handleSignProvider("/auth/google")}>
              <img src={googleIcon} /> Inicia sesión con Google
            </div>
            <div onClick={() => handleSignProvider("/auth/twitter")}>
              <img src={twitterIcon} /> Inicia sesión con Twitter
            </div>
            <div
              onClick={() => handleSignProvider("/auth/facebook")}
              className="svg-icon"
            >
              <img src={facebookIcon} /> Inicia sesión con Facebook
            </div>
            <div
              onClick={() => handleSignProvider("/auth/linkedin")}
              className="svg-icon"
            >
              <img src={linkedinIcon} /> Inicia sesión con Linkedin
            </div>
          </section>
          <p className="login__container--register">
            No tienes ninguna cuenta <Link to="/register">Regístrate</Link>
          </p>
        </section>
      </section>
    </>
  );
};

const mapDispatchToProps = {
  loginUser,
  signProvider,
};

export default connect(null, mapDispatchToProps)(Login);
