import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import { fetchGames, fetchGameDetails } from './fetchData';

const loadLikedGames = () => {
  try {
    return JSON.parse(localStorage.getItem('likedGames')) || [];
  } catch {
    return [];
  }
};

const saveLikedGames = (likedGames) => {
  localStorage.setItem('likedGames', JSON.stringify(likedGames));
};

const loadCustomGames = () => {
  try {
    return JSON.parse(localStorage.getItem('customGames')) || [];
  } catch {
    return [];
  }
};

const saveCustomGames = (games) => {
  localStorage.setItem('customGames', JSON.stringify(games));
};

const initialState = {
  allGames: [],
  customGames: loadCustomGames(),
  likedGames: loadLikedGames(),
  currentGame: null,
  filter: 'all',
  loading: false,
  detailsLoading: false,
  error: null,
  isLoaded: false,
  searchQuery: '',
  pagination: {
    currentPage: 1,
    gamesPerPage: 12
  }
};

export const loadGames = createAsyncThunk(
  'games/loadGames',
  async (_, { rejectWithValue }) => {
    try {
      return await fetchGames();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const loadGameDetails = createAsyncThunk(
  'games/loadGameDetails',
  async (id, { getState, rejectWithValue }) => {
    const state = getState();
    const allGames = state.games.allGames;
    const localGame = allGames.find(game => String(game.id) === String(id));

    if (localGame) {
      return localGame;
    }
    try {
      return await fetchGameDetails(id);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const gamesSlice = createSlice({
  name: 'games',
  initialState,
  reducers: {
    toggleLike: (state, action) => {
      const gameId = action.payload;
      const index = state.likedGames.indexOf(gameId);
      if (index === -1) {
        state.likedGames.push(gameId);
      } else {
        state.likedGames.splice(index, 1);
      }
      saveLikedGames(state.likedGames);
    },
    deleteGame: (state, action) => {
      const gameId = action.payload;
      state.allGames = state.allGames.filter(game => game.id !== gameId);
      state.customGames = state.customGames.filter(game => game.id !== gameId);
      state.likedGames = state.likedGames.filter(id => id !== gameId);
      saveCustomGames(state.customGames);
      saveLikedGames(state.likedGames);
    },
    addGame: {
      reducer: (state, action) => {
        const newGame = action.payload;
        state.customGames.unshift(newGame);
        state.allGames.unshift(newGame);
        state.pagination.currentPage = 1;
        saveCustomGames(state.customGames);
      },
      prepare: (gameData) => {
        return {
          payload: {
            ...gameData,
            id: Date.now(),
            thumbnail: gameData.image || 'https://i.ebayimg.com/images/g/4f0AAOSwKrNmH8oD/s-l1600.png',
            short_description: gameData.description?.substring(0, 100) || '',
            genre: gameData.genre || 'Unknown',
            platform: 'PC',
            publisher: gameData.publisher || 'Independent',
            release_date: new Date().toISOString().split('T')[0]
          }
        };
      }
    },
    setFilter: (state, action) => {
      state.filter = action.payload;
      state.pagination.currentPage = 1;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
      state.pagination.currentPage = 1;
    },
    setCurrentPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    },
    clearCurrentGame: (state) => {
      state.currentGame = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadGames.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadGames.fulfilled, (state, action) => {
        state.loading = false;
        state.isLoaded = true;

        const fetched = action.payload;
        const merged = [...fetched];

        state.customGames.forEach(customGame => {
          if (!merged.find(g => g.id === customGame.id)) {
            merged.unshift(customGame);
          }
        });

        state.allGames = merged;
        state.pagination.currentPage = 1;
      })
      .addCase(loadGames.rejected, (state, action) => {
        state.loading = false;
        state.isLoaded = true;
        state.error = action.payload;
      })
      .addCase(loadGameDetails.pending, (state) => {
        state.detailsLoading = true;
        state.error = null;
      })
      .addCase(loadGameDetails.fulfilled, (state, action) => {
        state.detailsLoading = false;
        state.currentGame = action.payload;
      })
      .addCase(loadGameDetails.rejected, (state, action) => {
        state.detailsLoading = false;
        state.error = action.payload;
      });
  }
});

export const selectAllGames = (state) => state.games.allGames;
export const selectCurrentGame = (state) => state.games.currentGame;
export const selectFilter = (state) => state.games.filter;
export const selectLoading = (state) => state.games.loading;
export const selectDetailsLoading = (state) => state.games.detailsLoading;
export const selectError = (state) => state.games.error;
export const selectLikedGames = (state) => state.games.likedGames;
export const selectSearchQuery = (state) => state.games.searchQuery;
export const selectCurrentPage = (state) => state.games.pagination.currentPage;
export const selectGamesPerPage = (state) => state.games.pagination.gamesPerPage;
export const selectIsLoaded = (state) => state.games.isLoaded;

export const selectFilteredGames = createSelector(
  [selectAllGames, selectFilter, selectLikedGames, selectSearchQuery],
  (games, filter, likedGames, searchQuery) => {
    let filtered = games;

    if (filter === 'favorites') {
      filtered = filtered.filter(game => likedGames.includes(game.id));
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(game =>
        game.title.toLowerCase().includes(query)
      );
    }

    return filtered;
  }
);

export const selectPaginatedGames = createSelector(
  [selectFilteredGames, selectCurrentPage, selectGamesPerPage],
  (filteredGames, currentPage, gamesPerPage) => {
    const startIndex = (currentPage - 1) * gamesPerPage;
    return filteredGames.slice(startIndex, startIndex + gamesPerPage);
  }
);

export const selectTotalPages = createSelector(
  [selectFilteredGames, selectGamesPerPage],
  (filteredGames, gamesPerPage) => {
    return Math.ceil(filteredGames.length / gamesPerPage);
  }
);

export const {
  toggleLike,
  deleteGame,
  setFilter,
  clearCurrentGame,
  setSearchQuery,
  setCurrentPage,
  addGame
} = gamesSlice.actions;

export default gamesSlice.reducer;
