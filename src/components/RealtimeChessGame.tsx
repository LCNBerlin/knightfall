'use client';

import { useState, useEffect } from 'react';
import { useSocket } from '../contexts/SocketContext';
import { useAuth } from '../contexts/AuthContext';
import { X, RotateCcw, Flag } from 'lucide-react';

interface RealtimeChessGameProps {
  gameData: {
    gameId: string;
    opponent: { id: string; username: string };
    gameType: string;
    wagerAmount: number;
    wagerType: string;
  };
  onClose: () => void;
}

export default function RealtimeChessGame({ gameData, onClose }: RealtimeChessGameProps) {
  const { socket } = useSocket();
  const { user } = useAuth();
  const [gameState, setGameState] = useState<string | null>(null);
  const [moves, setMoves] = useState<string[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<'white' | 'black'>('white');
  const [status, setStatus] = useState<string>('active');
  const [isMyTurn, setIsMyTurn] = useState(false);
  const [opponent, setOpponent] = useState<{ id: string; username: string } | null>(null);

  useEffect(() => {
    if (!socket) return;

    // Set up opponent info
    const isWhite = gameData.opponent.id !== user?.id;
    setOpponent(gameData.opponent);
    setIsMyTurn(isWhite ? currentPlayer === 'white' : currentPlayer === 'black');

    const handleGameState = (data: {
      gameState: string;
      moves: string[];
      currentPlayer: 'white' | 'black';
      status: string;
    }) => {
      console.log('Game state received:', data);
      setGameState(data.gameState);
      setMoves(data.moves || []);
      setCurrentPlayer(data.currentPlayer);
      setStatus(data.status);
      
      // Update turn indicator
      const isWhite = gameData.opponent.id !== user?.id;
      setIsMyTurn(isWhite ? data.currentPlayer === 'white' : data.currentPlayer === 'black');
    };

    const handleMoveMade = (data: {
      gameState: string;
      moves: string[];
      currentPlayer: 'white' | 'black';
      status: string;
    }) => {
      console.log('Move made:', data);
      setGameState(data.gameState);
      setMoves(data.moves || []);
      setCurrentPlayer(data.currentPlayer);
      setStatus(data.status);
      
      // Update turn indicator
      const isWhite = gameData.opponent.id !== user?.id;
      setIsMyTurn(isWhite ? data.currentPlayer === 'white' : data.currentPlayer === 'black');
    };

    const handleGameEnded = (data: { result: string; winner?: string }) => {
      console.log('Game ended:', data);
      setStatus('finished');
      setIsMyTurn(false);
    };

    const handlePlayerJoined = (data: { player: string }) => {
      console.log('Player joined:', data);
    };

    const handlePlayerDisconnected = (data: { player: string; gameId: string }) => {
      console.log('Player disconnected:', data);
    };

    const handleError = (data: { message: string }) => {
      console.error('Game error:', data);
    };

    socket.on('game_state', handleGameState);
    socket.on('move_made', handleMoveMade);
    socket.on('game_ended', handleGameEnded);
    socket.on('player_joined', handlePlayerJoined);
    socket.on('player_disconnected', handlePlayerDisconnected);
    socket.on('error', handleError);

    // Join the game room
    socket.emit('join_game', { gameId: gameData.gameId });

    return () => {
      socket.off('game_state', handleGameState);
      socket.off('move_made', handleMoveMade);
      socket.off('game_ended', handleGameEnded);
      socket.off('player_joined', handlePlayerJoined);
      socket.off('player_disconnected', handlePlayerDisconnected);
      socket.off('error', handleError);
    };
  }, [socket, gameData, user]);

  const handleMove = (move: string) => {
    if (!isMyTurn || status !== 'active') return;
    
    socket?.emit('make_move', { 
      gameId: gameData.gameId, 
      move: move 
    });
  };

  const handleResign = () => {
    if (confirm('Are you sure you want to resign?')) {
      socket?.emit('resign', { gameId: gameData.gameId });
    }
  };

  const getStatusMessage = () => {
    if (status === 'finished') {
      return 'Game Finished';
    }
    if (status === 'waiting') {
      return 'Waiting for opponent...';
    }
    if (isMyTurn) {
      return 'Your turn';
    }
    return `${opponent?.username}'s turn`;
  };

  const getStatusColor = () => {
    if (status === 'finished') {
      return 'text-gray-400';
    }
    if (isMyTurn) {
      return 'text-gold';
    }
    return 'text-gray-300';
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="luxury-card p-6 max-w-4xl mx-auto w-full mx-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gold-gradient">Chess Match</h2>
            <p className="text-gray-400">vs {opponent?.username}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className={`text-sm font-medium ${getStatusColor()}`}>
              {getStatusMessage()}
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chess Board Area */}
          <div className="lg:col-span-2">
            <div className="bg-knight-800 rounded-lg p-4">
              <div className="aspect-square max-w-md mx-auto">
                {/* Placeholder for chess board - will integrate with existing ChessBoard component */}
                <div className="w-full h-full bg-knight-700 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-4">♔</div>
                    <p className="text-gray-400">Chess Board</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Real-time moves will appear here
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Game Info Sidebar */}
          <div className="space-y-4">
            {/* Game Status */}
            <div className="bg-knight-800/50 rounded-lg p-4">
              <h3 className="font-semibold text-white mb-3">Game Status</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Status:</span>
                  <span className={`font-medium ${getStatusColor()}`}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Current Player:</span>
                  <span className="text-white">
                    {currentPlayer === 'white' ? 'White' : 'Black'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Moves:</span>
                  <span className="text-white">{moves.length}</span>
                </div>
              </div>
            </div>

            {/* Move History */}
            <div className="bg-knight-800/50 rounded-lg p-4">
              <h3 className="font-semibold text-white mb-3">Move History</h3>
              <div className="max-h-40 overflow-y-auto">
                {moves.length === 0 ? (
                  <p className="text-gray-400 text-sm">No moves yet</p>
                ) : (
                  <div className="space-y-1">
                    {moves.map((move, index) => (
                      <div key={index} className="text-sm text-gray-300">
                        {index + 1}. {move}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Game Actions */}
            <div className="bg-knight-800/50 rounded-lg p-4">
              <h3 className="font-semibold text-white mb-3">Actions</h3>
              <div className="space-y-2">
                <button
                  onClick={handleResign}
                  disabled={status !== 'active'}
                  className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Flag size={16} />
                  Resign
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <RotateCcw size={16} />
                  Refresh
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
