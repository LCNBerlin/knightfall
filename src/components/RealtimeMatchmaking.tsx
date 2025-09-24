'use client';

import { useState, useEffect } from 'react';
import { useSocket } from '../contexts/SocketContext';
import { useAuth } from '../contexts/AuthContext';
import { Coins, DollarSign, Clock, Users, X, CheckCircle } from 'lucide-react';

interface MatchmakingProps {
  onMatchFound: (gameData: any) => void;
  onClose: () => void;
}

export default function RealtimeMatchmaking({ onMatchFound, onClose }: MatchmakingProps) {
  console.log('RealtimeMatchmaking component rendered');
  const { socket, isConnected, joinMatchmaking, leaveMatchmaking } = useSocket();
  const { user } = useAuth();
  
  console.log('Socket state:', { socket: !!socket, isConnected, user: !!user });
  const [isSearching, setIsSearching] = useState(false);
  const [queuePosition, setQueuePosition] = useState<number | null>(null);
  const [estimatedWaitTime, setEstimatedWaitTime] = useState<number | null>(null);
  const [selectedGameType, setSelectedGameType] = useState('ladder');
  const [selectedWagerAmount, setSelectedWagerAmount] = useState(100);
  const [selectedWagerType, setSelectedWagerType] = useState<'tokens' | 'cash'>('tokens');

  const wagerOptions = {
    tokens: [
      { amount: 50, label: '50 Tokens' },
      { amount: 100, label: '100 Tokens' },
      { amount: 250, label: '250 Tokens' },
      { amount: 500, label: '500 Tokens' },
      { amount: 1000, label: '1000 Tokens' }
    ],
    cash: [
      { amount: 1, label: '$1.00' },
      { amount: 5, label: '$5.00' },
      { amount: 10, label: '$10.00' },
      { amount: 25, label: '$25.00' },
      { amount: 50, label: '$50.00' }
    ]
  };

  useEffect(() => {
    if (!socket) return;

    const handleMatchFound = (data: any) => {
      console.log('Match found:', data);
      setIsSearching(false);
      setQueuePosition(null);
      setEstimatedWaitTime(null);
      onMatchFound(data);
    };

    const handleMatchmakingJoined = (data: any) => {
      console.log('Joined matchmaking:', data);
      setQueuePosition(data.position);
      setEstimatedWaitTime(data.estimatedWaitTime);
    };

    const handleMatchmakingLeft = () => {
      console.log('Left matchmaking');
      setIsSearching(false);
      setQueuePosition(null);
      setEstimatedWaitTime(null);
    };

    const handleError = (data: any) => {
      console.error('Socket error:', data);
      setIsSearching(false);
      setQueuePosition(null);
      setEstimatedWaitTime(null);
    };

    socket.on('match_found', handleMatchFound);
    socket.on('matchmaking_joined', handleMatchmakingJoined);
    socket.on('matchmaking_left', handleMatchmakingLeft);
    socket.on('error', handleError);

    return () => {
      socket.off('match_found', handleMatchFound);
      socket.off('matchmaking_joined', handleMatchmakingJoined);
      socket.off('matchmaking_left', handleMatchmakingLeft);
      socket.off('error', handleError);
    };
  }, [socket, onMatchFound]);

  const handleStartSearch = () => {
    if (!isConnected) {
      alert('Not connected to server. Please try again.');
      return;
    }

    setIsSearching(true);
    joinMatchmaking(selectedGameType, selectedWagerAmount, selectedWagerType);
  };

  const handleStopSearch = () => {
    setIsSearching(false);
    setQueuePosition(null);
    setEstimatedWaitTime(null);
    leaveMatchmaking();
  };

  const formatWaitTime = (seconds: number) => {
    if (seconds < 60) {
      return `${seconds}s`;
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" 
      style={{zIndex: 9999, position: 'fixed', top: 0, left: 0, right: 0, bottom: 0}}
      id="matchmaking-modal"
    >
      <div className="luxury-card p-8 max-w-md mx-auto w-full mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gold-gradient">Find a Match</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {!isConnected && (
          <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4 mb-6">
            <p className="text-red-300 text-sm">
              ⚠️ Not connected to server. Please refresh the page.
            </p>
          </div>
        )}

        {!isSearching ? (
          <div className="space-y-6">
            {/* Game Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Game Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setSelectedGameType('ladder')}
                  className={`p-3 rounded-lg border transition-colors ${
                    selectedGameType === 'ladder'
                      ? 'border-gold bg-gold/10 text-gold'
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                >
                  <Users size={20} className="mx-auto mb-2" />
                  <div className="text-sm font-medium">Ladder</div>
                </button>
                <button
                  onClick={() => setSelectedGameType('tournament')}
                  className={`p-3 rounded-lg border transition-colors ${
                    selectedGameType === 'tournament'
                      ? 'border-gold bg-gold/10 text-gold'
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                >
                  <CheckCircle size={20} className="mx-auto mb-2" />
                  <div className="text-sm font-medium">Tournament</div>
                </button>
              </div>
            </div>

            {/* Wager Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Wager Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setSelectedWagerType('tokens')}
                  className={`p-3 rounded-lg border transition-colors flex items-center justify-center ${
                    selectedWagerType === 'tokens'
                      ? 'border-gold bg-gold/10 text-gold'
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                >
                  <Coins size={20} className="mr-2" />
                  <span className="text-sm font-medium">Tokens</span>
                </button>
                <button
                  onClick={() => setSelectedWagerType('cash')}
                  className={`p-3 rounded-lg border transition-colors flex items-center justify-center ${
                    selectedWagerType === 'cash'
                      ? 'border-gold bg-gold/10 text-gold'
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                >
                  <DollarSign size={20} className="mr-2" />
                  <span className="text-sm font-medium">Cash</span>
                </button>
              </div>
            </div>

            {/* Wager Amount Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Wager Amount
              </label>
              <div className="grid grid-cols-2 gap-2">
                {wagerOptions[selectedWagerType].map((option) => (
                  <button
                    key={option.amount}
                    onClick={() => setSelectedWagerAmount(option.amount)}
                    className={`p-2 rounded-lg border transition-colors text-sm ${
                      selectedWagerAmount === option.amount
                        ? 'border-gold bg-gold/10 text-gold'
                        : 'border-gray-600 hover:border-gray-500'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* User Balance Display */}
            <div className="bg-gray-800/50 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Your Balance:</span>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Coins size={16} className="text-gold" />
                    <span className="text-white font-medium">
                      {user?.token_balance?.toLocaleString() || 0}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign size={16} className="text-emerald-400" />
                    <span className="text-white font-medium">
                      ${user?.cash_balance?.toFixed(2) || '0.00'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Start Search Button */}
            <button
              onClick={handleStartSearch}
              disabled={!isConnected}
              className="w-full bg-gold-gradient hover:bg-gold-gradient-hover text-black font-semibold py-3 px-6 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Start Searching
            </button>
          </div>
        ) : (
          <div className="text-center space-y-6">
            <div className="animate-spin w-12 h-12 border-4 border-gold border-t-transparent rounded-full mx-auto"></div>
            
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">Searching for Opponent</h3>
              <p className="text-gray-400">Looking for a suitable match...</p>
            </div>

            {queuePosition && (
              <div className="bg-gray-800/50 rounded-lg p-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Users size={20} className="text-gold" />
                  <span className="text-white font-medium">Position in Queue: #{queuePosition}</span>
                </div>
                {estimatedWaitTime && (
                  <div className="flex items-center justify-center gap-2">
                    <Clock size={16} className="text-gray-400" />
                    <span className="text-gray-400 text-sm">
                      Est. wait time: {formatWaitTime(estimatedWaitTime)}
                    </span>
                  </div>
                )}
              </div>
            )}

            <button
              onClick={handleStopSearch}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Cancel Search
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
