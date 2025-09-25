import React, { useState, useEffect } from "react";
import { XorO, StatsData } from "./types";
import { createGame, createMove, updateGame, getStats } from "./api";
import { Stats } from "./Stats";

export const Main = () => {
  const createEmptyBoard = (size: number): (XorO | undefined)[][] => {
    return Array(size)
      .fill(null)
      .map(() => Array(size).fill(undefined));
  };

  const [boardSize, setBoardSize] = useState<number>(3);
  const [board, setBoard] = useState<(XorO | undefined)[][]>(() =>
    createEmptyBoard(3)
  );
  const [currentPlayer, setCurrentPlayer] = useState<XorO>("X");
  const [winner, setWinner] = useState<XorO | null>(null);
  const [isTie, setIsTie] = useState<boolean>(false);
  const [moveNumber, setMoveNumber] = useState<number>(1);
  const [gameId, setGameId] = useState<number | null>(null);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [showGameSetup, setShowGameSetup] = useState<boolean>(false);
  const [stats, setStats] = useState<StatsData | null>(null);

  const loadStats = async () => {
    try {
      const statsData = await getStats();
      setStats(statsData);
    } catch (error) {
      console.error("Failed to load stats:", error);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const handleBoardSizeChange = (newSize: number) => {
    if (newSize >= 3 && newSize <= 15) {
      setBoardSize(newSize);
      setBoard(createEmptyBoard(newSize));
    }
  };

  const handleStartGame = async () => {
    try {
      const gameData = {
        board_size: boardSize,
      };
      const newGame = await createGame(gameData);
      setGameId(newGame.id);
      setCurrentPlayer("X");
      setWinner(null);
      setIsTie(false);
      setMoveNumber(1);
      setGameStarted(true);
      setShowGameSetup(false);
    } catch (error) {
      console.error("Failed to create game:", error);
    }
  };

  const handleNewGame = () => {
    // Reset everything and show setup
    setBoard(createEmptyBoard(boardSize));
    setCurrentPlayer("X");
    setWinner(null);
    setIsTie(false);
    setMoveNumber(1);
    setGameId(null);
    setGameStarted(false);
    setShowGameSetup(true);
  };

  const checkWinner = (board: (XorO | undefined)[][]): XorO | null => {
    const size = board.length;

    // Check rows
    for (let row = 0; row < size; row++) {
      if (
        board[row].every((cell) => cell !== undefined && cell === board[row][0])
      ) {
        return board[row][0]!;
      }
    }

    // Check columns
    for (let col = 0; col < size; col++) {
      if (
        board.every(
          (row) => row[col] !== undefined && row[col] === board[0][col]
        )
      ) {
        return board[0][col]!;
      }
    }

    // Check main diagonal (top-left to bottom-right)
    if (
      board.every(
        (row, index) => row[index] !== undefined && row[index] === board[0][0]
      )
    ) {
      return board[0][0]!;
    }

    // Check anti-diagonal (top-right to bottom-left)
    if (
      board.every(
        (row, index) =>
          row[size - 1 - index] !== undefined &&
          row[size - 1 - index] === board[0][size - 1]
      )
    ) {
      return board[0][size - 1]!;
    }

    return null;
  };

  const checkTie = (board: (XorO | undefined)[][]): boolean => {
    return board.every((row) => row.every((cell) => cell !== undefined));
  };

  const handleCellClick = async (rowIndex: number, colIndex: number) => {
    // Don't allow moves on occupied cells, if game is over, or if game hasn't started
    if (
      board[rowIndex][colIndex] !== undefined ||
      winner !== null ||
      isTie ||
      !gameStarted
    ) {
      return;
    }

    const newBoard = [...board];
    newBoard[rowIndex][colIndex] = currentPlayer;
    setBoard(newBoard);

    // Create move in backend
    try {
      await createMove({
        game: gameId,
        player: currentPlayer,
        row: rowIndex,
        column: colIndex,
        move_number: moveNumber,
      });
    } catch (error) {
      console.error("Failed to create move:", error);
    }

    // Check for winner
    const gameWinner = checkWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
      // Update game with winner
      try {
        await updateGame(gameId, { winner: gameWinner });
        loadStats(); // Refresh stats after game ends
      } catch (error) {
        console.error("Failed to update game with winner:", error);
      }
    } else if (checkTie(newBoard)) {
      setIsTie(true);
      // Update game with tie
      try {
        await updateGame(gameId, { is_tie: true });
        loadStats(); // Refresh stats after game ends
      } catch (error) {
        console.error("Failed to update game with tie:", error);
      }
    } else {
      setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
      setMoveNumber(moveNumber + 1);
    }
  };

  return (
    <div className="flex flex-col mt-10 items-center gap-10">
      <div className="font-bold text-2xl">Tic Tac Toe</div>

      {!gameStarted && !showGameSetup && (
        <div className="flex flex-col items-center gap-6">
          <button
            onClick={handleNewGame}
            className="px-6 py-3 bg-blue-500 text-white font-medium rounded hover:bg-blue-600 transition-colors text-lg"
          >
            🎮 New Game
          </button>

          <Stats stats={stats} />
        </div>
      )}

      {showGameSetup && (
        <div className="flex flex-col items-center gap-4">
          <div className="text-lg font-medium">Choose Board Size:</div>
          <div className="flex items-center gap-3">
            <input
              type="number"
              min="3"
              max="15"
              value={boardSize}
              onChange={(e) => handleBoardSizeChange(parseInt(e.target.value))}
              className="border-2 border-gray-300 rounded px-3 py-1 text-center w-16 text-lg"
            />
            <span className="text-sm text-gray-600">(3-15)</span>
          </div>
          <button
            onClick={handleStartGame}
            className="px-6 py-2 bg-blue-500 text-white font-medium rounded hover:bg-blue-600 transition-colors"
          >
            Start Game
          </button>
        </div>
      )}

      {(gameStarted || winner || isTie) && (
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <label className="text-lg font-medium">Board Size:</label>
            <span className="text-lg font-bold">
              {boardSize}x{boardSize}
            </span>
          </div>

          <button
            onClick={handleNewGame}
            className="px-4 py-2 bg-blue-500 text-white font-medium rounded hover:bg-blue-600 transition-colors"
          >
            🎮 New Game
          </button>
        </div>
      )}

      {gameStarted && !winner && !isTie && (
        <div className="text-lg">
          Current Player:{" "}
          <span className="font-bold text-blue-600">{currentPlayer}</span>
          {" • "}
          <span className="font-medium text-gray-600">Move #{moveNumber}</span>
        </div>
      )}

      {winner && (
        <div className="flex flex-col items-center gap-6">
          <div className="text-3xl font-bold text-green-600">
            🎉 Player {winner} Wins! 🎉
          </div>
          <div className="text-xl font-medium text-gray-700">
            Game completed in {moveNumber} moves
          </div>
          <div className="text-lg text-gray-600">
            Player X: {Math.ceil(moveNumber / 2)} moves • Player O:{" "}
            {Math.floor(moveNumber / 2)} moves
          </div>

          <Stats stats={stats} />

          <div className="text-lg text-gray-600">
            Click "New Game" to play again!
          </div>
        </div>
      )}

      {isTie && (
        <div className="flex flex-col items-center gap-6">
          <div className="text-3xl font-bold text-orange-600">
            🤝 It's a Tie! 🤝
          </div>
          <div className="text-xl font-medium text-gray-700">
            Game completed in {moveNumber} moves
          </div>
          <div className="text-lg text-gray-600">
            Player X: {Math.ceil(moveNumber / 2)} moves • Player O:{" "}
            {Math.floor(moveNumber / 2)} moves
          </div>

          <Stats stats={stats} />

          <div className="text-lg text-gray-600">
            Click "New Game" to play again!
          </div>
        </div>
      )}

      {gameStarted && !winner && !isTie && (
        <div className="flex flex-col gap-1">
          {board.map((row, rowIndex) => (
            <div className="flex gap-1" key={rowIndex}>
              {row.map((column, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`border-2 border-gray-900 items-center justify-center font-bold flex ${
                    boardSize <= 5 ? "w-12 h-12 text-2xl" : "w-10 h-10 text-lg"
                  } ${
                    column === undefined
                      ? "cursor-pointer hover:bg-gray-100"
                      : "cursor-not-allowed bg-gray-50"
                  }`}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                >
                  {column}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
