'use client';

import { useState, useEffect } from 'react';
import { Trophy, Crown, Medal, Star, TrendingUp } from 'lucide-react';

interface LeaderboardEntry {
  username: string;
  eloRating: number;
  tokenBalance: number;
  gamesPlayed: number;
  gamesWon: number;
  winRate: number;
}

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/economy/leaderboard?limit=20`);
      
      if (response.ok) {
        const data = await response.json();
        setLeaderboard(data.data);
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Crown className="w-5 h-5 text-yellow-400" />;
      case 1:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 2:
        return <Medal className="w-5 h-5 text-amber-600" />;
      default:
        return <span className="text-sm font-bold text-gray-400">#{index + 1}</span>;
    }
  };

  const getRankColor = (index: number) => {
    switch (index) {
      case 0:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black';
      case 1:
        return 'bg-gradient-to-r from-gray-300 to-gray-500 text-black';
      case 2:
        return 'bg-gradient-to-r from-amber-400 to-amber-600 text-black';
      default:
        return 'bg-gray-800 text-white';
    }
  };

  if (loading) {
    return (
      <div className="luxury-card p-6">
        <div className="text-center text-gray-400">
          <p>Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="luxury-card p-6">
      <h3 className="text-xl font-bold text-gold-gradient mb-6 flex items-center gap-2">
        <Trophy className="w-6 h-6" />
        Leaderboard
      </h3>
      
      {leaderboard.length === 0 ? (
        <p className="text-gray-400 text-center py-8">No players yet</p>
      ) : (
        <div className="space-y-2">
          {leaderboard.map((player, index) => (
            <div
              key={player.username}
              className={`flex items-center justify-between p-4 rounded-lg ${getRankColor(index)}`}
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  {getRankIcon(index)}
                </div>
                
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{player.username}</span>
                    {index < 3 && <Star className="w-4 h-4 text-yellow-400" />}
                  </div>
                  <div className="flex items-center gap-4 text-sm opacity-80">
                    <span>Rating: {player.eloRating}</span>
                    <span>Games: {player.gamesPlayed}</span>
                    <span>Win Rate: {player.winRate}%</span>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="flex items-center gap-1 text-lg font-bold">
                  <Trophy className="w-4 h-4" />
                  {player.tokenBalance.toLocaleString()}
                </div>
                <div className="text-sm opacity-80">tokens</div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-6 text-center">
        <button
          onClick={fetchLeaderboard}
          className="text-gold hover:text-gold/80 transition-colors text-sm"
        >
          <TrendingUp className="w-4 h-4 inline mr-1" />
          Refresh Leaderboard
        </button>
      </div>
    </div>
  );
}
