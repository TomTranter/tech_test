const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:8000/api";

export const createGame = async (gameData) => {
  const response = await fetch(`${API_BASE_URL}/games/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(gameData),
  });

  if (!response.ok) {
    throw new Error("Failed to create game");
  }

  return response.json();
};

export const createMove = async (moveData) => {
  const response = await fetch(`${API_BASE_URL}/moves/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(moveData),
  });

  if (!response.ok) {
    throw new Error("Failed to create move");
  }

  return response.json();
};

export const updateGame = async (gameId, gameData) => {
  const response = await fetch(`${API_BASE_URL}/games/${gameId}/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(gameData),
  });

  if (!response.ok) {
    throw new Error("Failed to update game");
  }

  return response.json();
};

export const getStats = async () => {
  const response = await fetch(`${API_BASE_URL}/stats/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch stats");
  }

  return response.json();
};
