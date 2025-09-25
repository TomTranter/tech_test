import React from "react";
import { StatsData } from "./types";

export const Stats: React.FC<{
  stats: StatsData | null;
}> = ({ stats }) => {
  if (!stats) return null;

  return (
    <div className="bg-gray-100 rounded-lg p-4 text-center">
      <div className="text-lg font-bold mb-2">Statistics</div>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <div className="font-medium text-blue-600">Player X</div>
          <div className="text-xl font-bold">{stats.x_wins} wins</div>
        </div>
        <div>
          <div className="font-medium text-red-600">Player O</div>
          <div className="text-xl font-bold">{stats.o_wins} wins</div>
        </div>
        <div>
          <div className="font-medium text-gray-600">Ties</div>
          <div className="text-xl font-bold">{stats.ties}</div>
        </div>
        <div>
          <div className="font-medium text-gray-600">Total Games</div>
          <div className="text-xl font-bold">{stats.total_games}</div>
        </div>
      </div>
    </div>
  );
};
