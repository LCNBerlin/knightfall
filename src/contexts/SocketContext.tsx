'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  joinMatchmaking: (gameType: string, wagerAmount: number, wagerType: string) => void;
  leaveMatchmaking: () => void;
  joinGame: (gameId: string) => void;
  makeMove: (gameId: string, move: string) => void;
  resignGame: (gameId: string) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

interface SocketProviderProps {
  children: ReactNode;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { user, token } = useAuth();

  useEffect(() => {
    if (user && token) {
      // Initialize socket connection
      const newSocket = io(API_BASE_URL, {
        auth: {
          token: token
        }
      });

      newSocket.on('connect', () => {
        console.log('Connected to WebSocket server');
        setIsConnected(true);
      });

      newSocket.on('disconnect', () => {
        console.log('Disconnected from WebSocket server');
        setIsConnected(false);
      });

      newSocket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        setIsConnected(false);
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    } else {
      // Disconnect if user logs out
      if (socket) {
        socket.close();
        setSocket(null);
        setIsConnected(false);
      }
    }
  }, [user, token]);

  const joinMatchmaking = (gameType: string, wagerAmount: number, wagerType: string) => {
    if (socket) {
      socket.emit('join_matchmaking', { gameType, wagerAmount, wagerType });
    }
  };

  const leaveMatchmaking = () => {
    if (socket) {
      socket.emit('leave_matchmaking');
    }
  };

  const joinGame = (gameId: string) => {
    if (socket) {
      socket.emit('join_game', { gameId });
    }
  };

  const makeMove = (gameId: string, move: string) => {
    if (socket) {
      socket.emit('make_move', { gameId, move });
    }
  };

  const resignGame = (gameId: string) => {
    if (socket) {
      socket.emit('resign', { gameId });
    }
  };

  const value: SocketContextType = {
    socket,
    isConnected,
    joinMatchmaking,
    leaveMatchmaking,
    joinGame,
    makeMove,
    resignGame
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};
