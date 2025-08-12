import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  loadGames,
  selectPaginatedGames,
  selectLoading,
  selectError,
  selectFilter,
  selectTotalPages,
  selectCurrentPage,
  selectSearchQuery,
  toggleLike,
  deleteGame,
  setFilter,
  setCurrentPage,
  setSearchQuery,
  selectIsLoaded
} from '../store/gamesSlice';
import GameCard from '../components/GameCard';
import './GamesList.css';

const GamesList = () => {
  const dispatch = useDispatch();

  const games = useSelector(selectPaginatedGames);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const filter = useSelector(selectFilter);
  const currentPage = useSelector(selectCurrentPage);
  const totalPages = useSelector(selectTotalPages);
  const searchQuery = useSelector(selectSearchQuery);
  const isLoaded = useSelector(selectIsLoaded);

  useEffect(() => {
    if (!isLoaded) {
      dispatch(loadGames());
    }
  }, [dispatch, isLoaded]);

  const handleToggleLike = (id) => {
    dispatch(toggleLike(id));
  };

  const handleDelete = (id) => {
    dispatch(deleteGame(id));
  };

  const handleFilterChange = (newFilter) => {
    dispatch(setFilter(newFilter));
  };

  const handlePageChange = (page) => {
    dispatch(setCurrentPage(page));
    window.scrollTo(0, 0);
  };

  const handleSearchChange = (e) => {
    dispatch(setSearchQuery(e.target.value));
  };

  const getVisiblePages = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, currentPage + 2);

    if (currentPage <= 3) {
      end = 5;
    } else if (currentPage >= totalPages - 2) {
      start = totalPages - 4;
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  if (loading) return <div className="loading">Loading games...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="games-container">
      <h1 className="page-title">Free to Play Games</h1>

      <div className="controls-container">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search games..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="search-input"
          />
        </div>

        <div className="filter-buttons">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => handleFilterChange('all')}
          >
            Все игры
          </button>
          <button
            className={`filter-btn ${filter === 'favorites' ? 'active' : ''}`}
            onClick={() => handleFilterChange('favorites')}
          >
            Избранное
          </button>
        </div>
      </div>

      <div className="games-grid">
        {games.length > 0 ? (
          games.map((game) => (
            <GameCard
              key={game.id}
              game={game}
              onDelete={handleDelete}
              onToggleLike={handleToggleLike}
            />
          ))
        ) : (
          isLoaded && (
            <div className="no-results">
              No games found matching your criteria
            </div>
          )
        )}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            className="pagination-arrow"
          >
            &lt;&lt;
          </button>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="pagination-arrow"
          >
            &lt;
          </button>

          {getVisiblePages().map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`pagination-page ${currentPage === page ? 'active' : ''}`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="pagination-arrow"
          >
            &gt;
          </button>
          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
            className="pagination-arrow"
          >
            &gt;&gt;
          </button>
        </div>
      )}
    </div>
  );
};

export default GamesList;
