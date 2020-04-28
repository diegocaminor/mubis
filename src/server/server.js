/* eslint-disable global-require */
import express from "express";
import dotenv from "dotenv";
import webpack from "webpack";
import helmet from "helmet";
import React from "react";
import { renderToString } from "react-dom/server"; // devuelve vista renderizada en un string
import { Provider } from "react-redux";
import { createStore } from "redux";
import { renderRoutes } from "react-router-config"; // renderRoutes recibe un arreglo de rutas, y nos ayudará a poder renderizar toda nuestra aplicación
import { StaticRouter } from "react-router-dom";
import serverRoutes from "../frontend/routes/serverRoutes"; // rutas de nuestro servidor
import reducer from "../frontend/reducers";
import initialState from "../frontend/initialState";
import getManifest from "./getManifest"; // lee el archivo manifest.json

import cookieParser from require("cookie-parser");
import boom from require("@hapi/boom");
import passport from require("passport");
import session from require("express-session");
import axios from require("axios");

const { config } = require("./config");
dotenv.config();

const { ENV, PORT } = process.env;
const app = express();

// body parser
app.use(express.json());
app.use(cookieParser());
app.use(session({ secret: config.sessionSecret })); // esto es requerido debido a que la librería de twitter para iniciar sesión exige que tengamos una sesión activa, cabe resaltar que twitter para la autenticación de usuarios maneja el protocolo OAuth1.0
app.use(passport.initialize());
app.use(passport.session());

// Basic strategy
require("./utils/auth/strategies/basic");
// OAuth strategy
require("./utils/auth/strategies/oauth");
// Google strategy
require("./utils/auth/strategies/google");
// Twitter strategy
require("./utils/auth/strategies/twitter");
// Linkedin strategy
require("./utils/auth/strategies/linkedin");
// Facebook strategy
require("./utils/auth/strategies/facebook");

if (ENV === "development") {
  console.log("Development config");
  const webpackConfig = require("../../webpack.config");
  const webpackDevMiddleware = require("webpack-dev-middleware");
  const webpackHotMiddleware = require("webpack-hot-middleware");
  const compiler = webpack(webpackConfig);
  const serverConfig = { port: PORT, hot: true };

  app.use(webpackDevMiddleware(compiler, serverConfig));
  app.use(webpackHotMiddleware(compiler));
} else {
  app.use((req, res, next) => {
    if (!req.hashManifest) res.hashManifest = getManifest();
    next();
  });
  app.use(express.static(`${__dirname}/public`)); // aquí se almacenarán todos los archivos que se generen dentro de nuestro budle de webpack
  app.use(helmet());
  app.use(helmet.permittedCrossDomainPolicies()); // bloquea adobe flash y adobe acrobat para que no puedan ser insertados y no pueadan consumir ancho de banda excesivo de la aplicación
  // normalmente el navegador puede tener información desde el servidor que nos estamos conectando, es decir si estamos sirviendo con un servidor express el navegador puede saberlo
  // al deshabilitar x-powered-by no hay forma de que el navegador pueda saber desde donde no estamos conectando y así evitar ataques dirigidos a ciertos frameworks o librerías que estemos usando
  app.disable("x-powered-by");
}

// setReponse cargará el html, el estado inicial (initialState) de la aplicación para poder ser accedido desde cliente y el archivo manifest.json
const setResponse = (html, preloadedState, manifest) => {
  // esta función recibe el html y retorna el html definido en un string
  const mainStyles = manifest ? manifest["main.css"] : "assets/app.css";
  const mainBuild = manifest ? manifest["main.js"] : "assets/app.js";
  const vendorBuild = manifest ? manifest["vendors.js"] : "assets/vendor.js";

  return `
  <!DOCTYPE html>
  <html>
    <head>
      <link rel="stylesheet" href="${mainStyles}" type="text/css">
      <title>Platzi Video</title>
    </head>
    <body>
      <div id="app">${html}</div>
      <script>
        window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(
          /</g,
          "\\u003c"
        )}
      </script>
      <script src="${mainBuild}" type="text/javascript"></script>
      <script src="${vendorBuild}" type="text/javascript"></script>
    </body>
  </html>
  `;
};

// El proceso fundamental de server side render(ssr) consta de 2 procesos:
// el primero es rederizar a un string con renderToString
// el segundo es recibir este string e hidratar todos los eventos necesarios como el onClick u onLoad o cualquier otro
// evento que solo exista desde el lado del cliente para ser cargado desde el lado del cliente.
// Es decir una vez que enviamos un string renderizado a cliente, no será necesario renderizar la vista nuevamente, simplemente hidratamos la vista con los eventos que necesita.

const renderApp = (req, res) => {
  const store = createStore(reducer, initialState);
  const preloadedState = store.getState(); // estado precargado para evitar llamar la misma librería en cliente, se estaría enviando initialState
  const html = renderToString(
    <Provider store={store}>
      <StaticRouter location={req.url} context={{}}>
        {renderRoutes(serverRoutes)}
      </StaticRouter>
    </Provider>
  );

  res.send(setResponse(html, preloadedState, req.hashManifest)); // le pasamos el preloadedState al setResponse
};

app.post("/auth/sign-in", async function (req, res, next) {
  passport.authenticate("basic", function (error, data) {
    try {
      if (error || !data) {
        next(boom.unauthorized());
      }
      const { token, user } = data;

      req.login(data, { session: false }, async function (error) {
        if (error) {
          next(error);
        }

        res.cookie("token", token, {
          httpOnly: !config.dev,
          secure: !config.dev,
        });

        res.status(200).json(user);
      });
    } catch (error) {
      next(error);
    }
  })(req, res, next);
});

app.post("/auth/sign-up", async function (req, res, next) {
  const { body: user } = req;

  try {
    const userData = await axios({
      url: `${config.apiUrl}/api/auth/sign-up`,
      method: "post",
      data: {
        'email': user.email,
        'name': user.name,
        'user': user.password
      },
    });

    res.status(201).json({
      name: req.body.name,
      email: req.body.email,
      id: userData.data.id
    });
  } catch (error) {
    next(error);
  }
});

app.get("*", renderApp);

app.listen(PORT, (err) => {
  if (err) console.log(err);
  else console.log(`Server running on port ${PORT}`);
});
