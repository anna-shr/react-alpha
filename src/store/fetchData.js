const API_BASE = 'https://api.codetabs.com/v1/proxy?quest=https://www.freetogame.com/api';

export const fetchGames = async () => {
  const response = await fetch(`${API_BASE}/games`);
  if (!response.ok) throw new Error('Network response was not ok');
  return await response.json();
};

export const fetchGameDetails = async (id) => {
  const response = await fetch(`${API_BASE}/game?id=${id}`);
  if (!response.ok) throw new Error('Game not found');
  return await response.json();
};