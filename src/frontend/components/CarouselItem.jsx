import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { addFavoriteMovie, removeFavoriteMovie } from "../actions";
import "../assets/styles/components/CarouselItem.scss";
import playIcon from "../assets/static/play-icon.png";
import plusIcon from "../assets/static/plus-icon.png";
import removeIcon from "../assets/static/remove-icon.png";
import Swal from "sweetalert2";

const CarouselItem = (props) => {
  const {
    _id,
    id,
    userMovieId,
    cover,
    title,
    year,
    contentRating,
    duration,
    isList,
  } = props;
  const handleSetFavorite = () => {
    props.addFavoriteMovie(
      {
        _id,
        id,
        cover,
        title,
        year,
        contentRating,
        duration,
      },
      function (movieExist, message) {
        if (!movieExist) {
          Swal.fire(message, "", "success");
        } else {
          Swal.fire(message, "", "warning");
        }
      }
    );
  };
  const handleDeleteFavorite = (movieId) => {
    props.removeFavoriteMovie(movieId, function (message) {
      Swal.fire(message, "", "info");
    });
  };
  return (
    <div className="carousel-item">
      <img className="carousel-item__img" src={cover} alt={title} />
      <div className="carousel-item__details">
        <div>
          <Link to={`/player/${id}`}>
            <img
              className="carousel-item__details--img"
              src={playIcon}
              alt="Play Icon"
            />
          </Link>
          {isList ? (
            <img
              className="carousel-item__details--img"
              src={removeIcon}
              alt="Remove Icon"
              onClick={() => handleDeleteFavorite(userMovieId)}
            />
          ) : (
            <img
              className="carousel-item__details--img"
              src={plusIcon}
              alt="Plus Icon"
              onClick={handleSetFavorite}
            />
          )}
        </div>
        <p className="carousel-item__details--title">{title}</p>
        <p className="carousel-item__details--subtitle">
          {`${year} ${contentRating} ${duration}`}
        </p>
      </div>
    </div>
  );
};

CarouselItem.propTypes = {
  cover: PropTypes.string,
  title: PropTypes.string,
  year: PropTypes.number,
  contentRating: PropTypes.string,
  duration: PropTypes.number,
};

const mapDispatchToProps = {
  addFavoriteMovie,
  removeFavoriteMovie,
};

export default connect(null, mapDispatchToProps)(CarouselItem);
