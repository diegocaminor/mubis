import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createStore, compose, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { Router } from "react-router";
import { createBrowserHistory } from "history";
import reducer from "./reducers";
import App from "./routes/App";

const history = createBrowserHistory();
const preloadedState = window.__PRELOADED_STATE__; // se accede al estado inicial (initialState) de la aplicación, esta data fue enviada desde servidor
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose; // configuración para utilizar redux devtools en chrome
const store = createStore(
  reducer,
  preloadedState,
  composeEnhancers(applyMiddleware(thunk))
);

delete window.__PRELOADED_STATE__; // una vez que se cargue nuestra estado inicial a nuestro store, lo eliminamos para que el usuario no tenga acceso a esta información

ReactDOM.hydrate(
  <Provider store={store}>
    <Router history={history}>
      <App isLogged={preloadedState.user.id} />
    </Router>
  </Provider>,
  document.getElementById("app")
);
