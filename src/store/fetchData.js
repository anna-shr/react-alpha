const API_BASE = 'https://www.freetogame.com/api';

export const fetchGames = async () => {
  const url = `https://api.allorigins.win/get?url=${encodeURIComponent(`${API_BASE}/games`)}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const data = await response.json();
  return JSON.parse(data.contents);
};

export const fetchGameDetails = async (id) => {
  const url = `https://api.allorigins.win/get?url=${encodeURIComponent(`${API_BASE}/game?id=${id}`)}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Game not found');
  }

  const data = await response.json();
  return JSON.parse(data.contents);
};
