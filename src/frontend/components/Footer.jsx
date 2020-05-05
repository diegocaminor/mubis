import React from "react";
import "../assets/styles/components/Footer.scss";
import githubIcon from "../assets/static/github-icon.svg";
import linkedinIcon from "../assets/static/linkedin-icon.svg";

const Header = () => (
  <footer className="footer">
    <a href="/">Terminos de uso</a>
    <a href="/">Declaración de privacidad</a>
    <a href="/">Centro de ayuda</a>
    <a href="/">Hecho por Diego Camino</a>
    <a
      className="svg-icon"
      href="/https://github.com/diegocaminor"
      target="_blank"
    >
      <img src={githubIcon} />
    </a>
    <a
      className="svg-icon"
      href="/https://www.linkedin.com/in/DiegoCaminoR/"
      target="_blank"
    >
      <img src={linkedinIcon} />
    </a>
  </footer>
);

export default Header;
