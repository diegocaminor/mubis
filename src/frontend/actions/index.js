import axios from "axios";
import Swal from "sweetalert2";

export const setFavorite = (payload) => ({
  type: "SET_FAVORITE",
  payload,
});

export const deleteFavorite = (payload) => ({
  type: "DELETE_FAVORITE",
  payload,
});

export const loginRequest = (payload) => ({
  type: "LOGIN_REQUEST",
  payload,
});

export const logoutRequest = (payload) => ({
  type: "LOGOUT_REQUEST",
  payload,
});

export const registerRequest = (payload) => ({
  type: "REGISTER_REQUEST",
  payload,
});

export const getVideoSource = (payload) => ({
  type: "GET_VIDEO_SOURCE",
  payload,
});

export const setError = (payload) => ({
  type: "SET_ERROR",
  payload,
});

export const registerUser = (payload, redirectUrl) => {
  return (dispatch) => {
    axios
      .post("/auth/sign-up", payload)
      .then(({ data }) => {
        dispatch(registerRequest(data));
      })
      .then(() => {
        window.location.href = redirectUrl;
      })
      .catch((error) => dispatch(setError(error)));
  };
};

export const loginUser = ({ email, password }, redirectUrl) => {
  return (dispatch) => {
    axios({
      url: "/auth/sign-in/",
      method: "post",
      auth: {
        username: email,
        password,
      },
    })
      .then(({ data }) => {
        document.cookie = `email=${data.email}`;
        document.cookie = `name=${data.name}`;
        document.cookie = `id=${data.id}`;
        dispatch(loginRequest(data));
      })
      .then(() => {
        window.location.href = redirectUrl;
      })
      .catch((err) => dispatch(setError(err)));
  };
};

export const signProvider = (socialMedia, redirectUrl) => {
  return (dispatch) => {
    axios({
      url: socialMedia,
      method: "get",
    })
      .then(({ data }) => {
        document.cookie = `email=${data.email}`;
        document.cookie = `name=${data.name}`;
        document.cookie = `id=${data.id}`;
        dispatch(loginRequest(data));
      })
      .then(() => {
        window.location.href = redirectUrl;
      })
      .catch((err) => dispatch(setError(err)));
  };
};

export const addMovieUserList = (userId, movie) => {
  return (dispatch) => {
    const userMovie = {
      userId,
      movieId: movie._id,
    };
    axios
      .post("/user-movies", userMovie)
      .then(({ data }) => {
        if (typeof data === "object") {
          const userMovieId = data.data; // id de la película añadida a favoritos
          dispatch(setFavorite(movie));
          Swal.fire("Película añadida", data.message, "success");
        } else {
          Swal.fire("Ya se encuentra añadida", "", "warning");
        }
      })
      .catch((error) => {
        alert(error);
        dispatch(setError(error));
      });
  };
};

export const removeMovieUserList = (movieId) => {
  return (dispatch) => {
    axios
      .delete(`/user-movies/${movieId}`)
      .then(({ data }) => {
        dispatch(deleteFavorite(movieId));
        Swal.fire("Película removida", data.message, "info");
      })
      .catch((error) => {
        alert(error);
        dispatch(setError(error));
      });
  };
};

export { setFavorite as default };
