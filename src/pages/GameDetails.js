import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  loadGameDetails, 
  clearCurrentGame,
  selectCurrentGame,
  selectDetailsLoading,
  selectError
} from '../store/gamesSlice';
import './GameDetails.css';

const GameDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const game = useSelector(selectCurrentGame);
  const loading = useSelector(selectDetailsLoading);
  const error = useSelector(selectError);

  useEffect(() => {
    dispatch(loadGameDetails(id));

    return () => {
      dispatch(clearCurrentGame());
    };
  }, [id, dispatch]);

  if (loading) return <div className="loading">Loading game details...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!game) return <div className="not-found">Game not found</div>;

  return (
    <div className="game-detail-container">
      <div className="game-detail-header">
        <h1>{game.title}</h1>
      </div>

      <img 
        src={game.thumbnail} 
        alt={game.title}
        className="game-detail-image"
      />
      
      <div className="game-detail-info">
        <p><strong>Жанр:</strong> {game.genre}</p>
        <p><strong>Платформа:</strong> {game.platform}</p>
        <p><strong>Издатель:</strong> {game.publisher}</p>
        <p><strong>Дата выхода:</strong> {game.release_date}</p>
        
        <div className="game-detail-description">
          <h3>Описание</h3>
          <p>{game.short_description}</p>
        </div>
        
        <button 
          onClick={() => navigate(-1)} 
          className="back-btn"
        >
          Назад к списку игр
        </button>
      </div>
    </div>
  );
};

export default GameDetails;