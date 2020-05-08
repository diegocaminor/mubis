import React from "react";
import { renderToString } from "react-dom/server"; // devuelve vista renderizada en un string
import { Provider } from "react-redux";
import { createStore } from "redux";
import { renderRoutes } from "react-router-config"; // renderRoutes recibe un arreglo de rutas, y nos ayudará a poder renderizar toda nuestra aplicación
import { StaticRouter } from "react-router-dom";
import serverRoutes from "../../frontend/routes/serverRoutes"; // rutas de nuestro servidor
import reducer from "../../frontend/reducers";

import render from "../render";
import axios from "axios";
const { config } = require("../config");

// El proceso fundamental de server side render(ssr) consta de 2 procesos:
// el primero es rederizar a un string con renderToString
// el segundo es recibir este string e hidratar todos los eventos necesarios como el onClick u onLoad o cualquier otro
// evento que solo exista desde el lado del cliente para ser cargado desde el lado del cliente.
// Es decir una vez que enviamos un string renderizado a cliente, no será necesario renderizar la vista nuevamente, simplemente hidratamos la vista con los eventos que necesita.

const main = async (req, res, next) => {
  try {
    let initialState;
    const { token, email, name, id } = req.cookies;

    try {
      let moviesList = await axios({
        url: `${config.apiUrl}/api/movies`,
        headers: { Authorization: `Bearer ${token}` },
        method: "get",
      });
      moviesList = moviesList.data.data;

      let userMovies = await axios({
        url: `${config.apiUrl}/api/user-movies/?userId=${id}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        method: "get",
      });
      userMovies = userMovies.data.data;

      let myList = [];
      userMovies.filter((userMovie) => {
        moviesList.filter((movie) => {
          if (userMovie.userId === id && userMovie.movieId === movie._id) {
            movie.userMovieId = userMovie._id;
            myList.push(movie);
          }
        });
      });

      initialState = {
        user: { id, email, name },
        playing: {},
        myList,
        trends: moviesList.filter(
          (movie) => movie.contentRating === "PG" && movie._id
        ),
        originals: moviesList.filter(
          (movie) => movie.contentRating === "G" && movie._id
        ),
      };
    } catch (err) {
      initialState = {
        user: {},
        myList: [],
        trends: [],
        originals: [],
      };
    }

    const store = createStore(reducer, initialState);
    const preloadedState = store.getState(); // estado precargado para evitar llamar la misma librería en cliente, se estaría enviando initialState
    const isLogged = initialState.user.id;
    const html = renderToString(
      <Provider store={store}>
        <StaticRouter location={req.url} context={{}}>
          {renderRoutes(serverRoutes(isLogged))}
        </StaticRouter>
      </Provider>
    );

    res.send(render(html, preloadedState, req.hashManifest)); // le pasamos el preloadedState al setResponse
  } catch (err) {
    next(err);
  }
};

export default main;
