import axios from "axios";

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

export const addFavoriteMovie = (movie, cb) => (dispatch) => {
  const movieId = movie._id;
  axios({
    url: "/user-movies",
    method: "post",
    data: { movieId },
  })
    .then(({ data }) => {
      const { data: createdUserMovieId, movieExist } = data;

      const message = movieExist
        ? `${movie.title} ya está agregada a tus favoritos! 😊`
        : `${movie.title} fue agregada a tus favoritos 😃`;

      if (!movieExist) {
        movie.userMovieId = createdUserMovieId;
        dispatch(setFavorite(movie));
      }
      cb(movieExist, message);
    })
    .catch((err) => dispatch(setError(err)));
};

export const removeFavoriteMovie = (userMovieId, cb) => {
  return (dispatch) => {
    axios
      .delete(`/user-movies/${userMovieId}`)
      .then(({ data }) => {
        dispatch(deleteFavorite(userMovieId));
        cb("Película removida de tu lista... 😔");
      })
      .catch((error) => {
        dispatch(setError(error));
      });
  };
};

export { setFavorite as default };
