import React, { useState } from "react";
import { XorO } from "./types";

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
  const [moveNumber, setMoveNumber] = useState<number>(1);

  const handleBoardSizeChange = (newSize: number) => {
    if (newSize >= 3 && newSize <= 15) {
      setBoardSize(newSize);
      setBoard(createEmptyBoard(newSize));
      setCurrentPlayer("X");
      setWinner(null);
      setMoveNumber(1);
    }
  };

  const handleRestart = () => {
    setBoard(createEmptyBoard(boardSize));
    setCurrentPlayer("X");
    setWinner(null);
    setMoveNumber(1);
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

  const handleCellClick = (rowIndex: number, colIndex: number) => {
    // Don't allow moves on occupied cells or if game is over
    if (board[rowIndex][colIndex] !== undefined || winner !== null) {
      return;
    }

    const newBoard = [...board];
    newBoard[rowIndex][colIndex] = currentPlayer;
    setBoard(newBoard);

    // Check for winner
    const gameWinner = checkWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
    } else {
      setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
      setMoveNumber(moveNumber + 1);
    }
  };

  return (
    <div className="flex flex-col mt-10 items-center gap-10">
      <div className="flex items-center gap-8">
        <div className="font-bold text-2xl">Tic Tac Toe</div>
        {!winner && (
          <div className="text-lg font-medium text-gray-600">
            Move #{moveNumber}
          </div>
        )}
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <label className="text-lg font-medium">Board Size:</label>
          <input
            type="number"
            min="3"
            max="15"
            value={boardSize}
            onChange={(e) => handleBoardSizeChange(parseInt(e.target.value))}
            className="border-2 border-gray-300 rounded px-3 py-1 text-center w-16"
          />
          <span className="text-sm text-gray-600">(3-15)</span>
        </div>

        <button
          onClick={handleRestart}
          className="px-4 py-2 bg-blue-500 text-white font-medium rounded hover:bg-blue-600 transition-colors"
        >
          🔄 Restart Game
        </button>
      </div>

      {!winner && (
        <div className="text-lg">
          Current Player:{" "}
          <span className="font-bold text-blue-600">{currentPlayer}</span>
        </div>
      )}

      {winner ? (
        <div className="flex flex-col items-center gap-4">
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
          <div className="text-lg text-gray-600">
            Click "Restart Game" to play again!
          </div>
        </div>
      ) : (
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
