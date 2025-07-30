'use client';

import { useState, useCallback } from 'react';

interface ChessPiece {
  type: 'king' | 'queen' | 'rook' | 'bishop' | 'knight' | 'pawn';
  color: 'white' | 'black';
  position: string;
}

// Chess piece Unicode symbols
const pieceSymbols = {
  white: {
    king: '♔',
    queen: '♕',
    rook: '♖',
    bishop: '♗',
    knight: '♘',
    pawn: '♙'
  },
  black: {
    king: '♚',
    queen: '♛',
    rook: '♜',
    bishop: '♝',
    knight: '♞',
    pawn: '♟'
  }
};

export default function ChessBoard() {
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [currentTurn, setCurrentTurn] = useState<'white' | 'black'>('white');
  const [hoveredSquare, setHoveredSquare] = useState<string | null>(null);
  const [board, setBoard] = useState<ChessPiece[]>([
    // White pieces (bottom - ranks 1-2)
    { type: 'rook', color: 'white', position: 'a1' },
    { type: 'knight', color: 'white', position: 'b1' },
    { type: 'bishop', color: 'white', position: 'c1' },
    { type: 'queen', color: 'white', position: 'd1' },
    { type: 'king', color: 'white', position: 'e1' },
    { type: 'bishop', color: 'white', position: 'f1' },
    { type: 'knight', color: 'white', position: 'g1' },
    { type: 'rook', color: 'white', position: 'h1' },
    // White pawns (rank 2)
    { type: 'pawn', color: 'white', position: 'a2' },
    { type: 'pawn', color: 'white', position: 'b2' },
    { type: 'pawn', color: 'white', position: 'c2' },
    { type: 'pawn', color: 'white', position: 'd2' },
    { type: 'pawn', color: 'white', position: 'e2' },
    { type: 'pawn', color: 'white', position: 'f2' },
    { type: 'pawn', color: 'white', position: 'g2' },
    { type: 'pawn', color: 'white', position: 'h2' },
    // Black pieces (top - ranks 7-8)
    { type: 'rook', color: 'black', position: 'a8' },
    { type: 'knight', color: 'black', position: 'b8' },
    { type: 'bishop', color: 'black', position: 'c8' },
    { type: 'queen', color: 'black', position: 'd8' },
    { type: 'king', color: 'black', position: 'e8' },
    { type: 'bishop', color: 'black', position: 'f8' },
    { type: 'knight', color: 'black', position: 'g8' },
    { type: 'rook', color: 'black', position: 'h8' },
    // Black pawns (rank 7)
    { type: 'pawn', color: 'black', position: 'a7' },
    { type: 'pawn', color: 'black', position: 'b7' },
    { type: 'pawn', color: 'black', position: 'c7' },
    { type: 'pawn', color: 'black', position: 'd7' },
    { type: 'pawn', color: 'black', position: 'e7' },
    { type: 'pawn', color: 'black', position: 'f7' },
    { type: 'pawn', color: 'black', position: 'g7' },
    { type: 'pawn', color: 'black', position: 'h7' },
  ]);

  // Create 8x8 grid coordinates
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

  const getPieceAt = useCallback((position: string) => {
    return board.find(piece => piece.position === position);
  }, [board]);

  const getSquareColor = useCallback((fileIndex: number, rankIndex: number) => {
    const isLightSquare = (fileIndex + rankIndex) % 2 === 0;
    return isLightSquare ? 'bg-green-200' : 'bg-green-800';
  }, []);

  const handleSquareClick = useCallback((position: string) => {
    const piece = getPieceAt(position);
    
    if (!selectedSquare) {
      if (piece && piece.color === currentTurn) {
        setSelectedSquare(position);
      }
      return;
    }

    if (selectedSquare === position) {
      setSelectedSquare(null);
      return;
    }

    // Simple move logic for now
    if (piece && piece.color === currentTurn) {
      setSelectedSquare(position);
    } else {
      // Try to move
      setBoard(prevBoard => {
        const newBoard = [...prevBoard];
        const pieceIndex = newBoard.findIndex(p => p.position === selectedSquare);
        
        if (pieceIndex !== -1) {
          // Remove captured piece if any
          const capturedPieceIndex = newBoard.findIndex(p => p.position === position);
          if (capturedPieceIndex !== -1) {
            newBoard.splice(capturedPieceIndex, 1);
          }
          
          // Move the piece
          newBoard[pieceIndex] = { ...newBoard[pieceIndex], position };
        }
        
        return newBoard;
      });

      setCurrentTurn(currentTurn === 'white' ? 'black' : 'white');
      setSelectedSquare(null);
    }
  }, [selectedSquare, currentTurn, getPieceAt]);

  const handleMouseEnter = useCallback((position: string) => {
    setHoveredSquare(position);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredSquare(null);
  }, []);

  return (
    <div className="luxury-card p-6 w-full">
      <div className="flex flex-col items-center space-y-6">
        <h3 className="text-xl font-semibold text-gold-500">Chess Board</h3>
        
        {/* Turn Indicator */}
        <div className="text-center">
          <p className="text-white text-lg">
            Current Turn: <span className={`font-bold ${currentTurn === 'white' ? 'text-gray-100' : 'text-black'}`}>
              {currentTurn.charAt(0).toUpperCase() + currentTurn.slice(1)}
            </span>
          </p>
        </div>
        
        {/* Simple 8x8 Grid - 40% of screen width */}
        <div className="w-[40vw] max-w-2xl">
          {/* File labels (a-h) at top */}
          <div className="flex justify-center mb-2">
            {files.map(file => (
              <div key={file} className="flex-1 text-center text-sm font-medium text-gray-600">
                {file}
              </div>
            ))}
          </div>
          
          {/* Board with rank labels */}
          <div className="flex items-center">
            {/* Rank labels (8-1) on left */}
            <div className="flex flex-col mr-2">
              {ranks.map(rank => (
                <div key={rank} className="flex items-center justify-center text-sm font-medium text-gray-600" style={{ height: 'calc(40vw / 8)'}}>
                  {rank}
                </div>
              ))}
            </div>
            
            {/* Chess board */}
            <div className="border-2 border-gray-600 rounded-lg overflow-hidden shadow-lg flex-1">
              <div className="grid grid-cols-8">
                {ranks.map((rank, rankIndex) => 
                  files.map((file, fileIndex) => {
                    const position = `${file}${rank}`;
                    const piece = getPieceAt(position);
                    const isSelected = selectedSquare === position;
                    
                    return (
                      <button
                        key={position}
                        className={`aspect-square flex items-center justify-center transition-all duration-200 ${getSquareColor(fileIndex, rankIndex)} ${
                          isSelected ? 'ring-2 ring-blue-500 ring-offset-1' : ''
                        } ${
                          hoveredSquare === position ? 'ring-2 ring-yellow-400 ring-offset-1' : ''
                        }`}
                        onClick={() => handleSquareClick(position)}
                        onMouseEnter={() => handleMouseEnter(position)}
                        onMouseLeave={handleMouseLeave}
                      >
                        {piece && (
                          <div className={`text-4xl font-bold drop-shadow-lg ${
                            piece.color === 'white' ? 'text-gray-100' : 'text-black'
                          }`}>
                            {pieceSymbols[piece.color][piece.type]}
                          </div>
                        )}
                      </button>
                    );
                  })
                )}
              </div>
            </div>
            
            {/* Rank labels (8-1) on right */}
            <div className="flex flex-col ml-2">
              {ranks.map(rank => (
                <div key={rank} className="flex items-center justify-center text-sm font-medium text-gray-600" style={{ height: 'calc(40vw / 8)' }}>
                  {rank}
                </div>
              ))}
            </div>
          </div>
          
          {/* File labels (a-h) at bottom */}
          <div className="flex justify-center mt-2">
            {files.map(file => (
              <div key={file} className="flex-1 text-center text-sm font-medium text-gray-600">
                {file}
              </div>
            ))}
          </div>
        </div>

        {/* Selected Square Info */}
        {selectedSquare && (
          <div className="text-center">
            {getPieceAt(selectedSquare) ? (
              <p className="text-white">
                Selected: {getPieceAt(selectedSquare)?.color} {getPieceAt(selectedSquare)?.type} at {selectedSquare}
              </p>
            ) : (
              <p className="text-white">Selected: Empty square {selectedSquare}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 