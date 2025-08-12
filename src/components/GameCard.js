import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaTimes } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { toggleLike, deleteGame } from '../store/gamesSlice';

const GameCard = ({ game }) => {
  const [isHovered, setIsHovered] = useState(false);
  const dispatch = useDispatch();
  const isLiked = useSelector(state => 
    state.games.likedGames.includes(game.id)
  );

  const handleDelete = (e) => {
    e.stopPropagation();
    dispatch(deleteGame(game.id));
  };

  const handleToggleLike = (e) => {
    e.stopPropagation();
    dispatch(toggleLike(game.id));
  };

  return (
    <div 
      className="game-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isHovered && (
        <button className="delete-btn" onClick={handleDelete}>
          <FaTimes />
        </button>
      )}
      
      <Link to={`/products/${game.id}`} className="game-card-link">
        <img 
          src={game.thumbnail} 
          alt={game.title} 
          className="game-image"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
          }}
        />
        
        <div className="game-content">
          <h3 className="game-title">{game.title}</h3>
          <p className="game-description">
            {game.short_description}
          </p>
        </div>
      </Link>
      
      <button 
        className={`like-btn ${isLiked ? 'liked' : ''}`}
        onClick={handleToggleLike}
      >
        {isLiked ? <FaHeart /> : <FaRegHeart />}
      </button>
    </div>
  );
};

export default GameCard;