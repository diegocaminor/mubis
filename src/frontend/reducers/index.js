const reducer = (state, action) => {
  switch (action.type) {
    case "SET_FAVORITE":
      const myListHasFavoriteMovie = state.myList.some(
        (items) => items._id == action.payload._id
      );
      if (!myListHasFavoriteMovie)
        return {
          ...state,
          myList: [...state.myList, action.payload],
        };
      return state;
    case "DELETE_FAVORITE":
      return {
        ...state,
        myList: state.myList.filter(
          (items) => items.userMovieId !== action.payload
        ),
      };
    case "LOGIN_REQUEST":
    case "LOGOUT_REQUEST":
    case "REGISTER_REQUEST":
      return {
        ...state,
        user: action.payload,
      };
    case "GET_VIDEO_SOURCE":
      return {
        ...state,
        playing:
          state.trends.find((item) => item.id === action.payload) ||
          state.originals.find((item) => item.id === action.payload) ||
          [],
      };
    default:
      return state;
  }
};

export default reducer;
