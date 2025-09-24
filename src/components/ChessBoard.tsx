'use client';

import { useState } from 'react';

interface Square {
  piece: string | null;
  color: 'white' | 'black' | null;
  isSelected: boolean;
  isHighlighted: boolean;
  isLastMove: boolean;
}

interface Move {
  from: { row: number; col: number };
  to: { row: number; col: number };
  piece: string;
  color: 'white' | 'black';
  capturedPiece?: string;
  capturedColor?: 'white' | 'black';
  isEnPassant?: boolean;
  enPassantTarget?: { row: number; col: number };
}

interface ChessBoardProps {
  size?: 'sm' | 'md' | 'lg';
}

export default function ChessBoard({ size = 'md' }: ChessBoardProps) {
  const [board, setBoard] = useState<Square[][]>(initializeBoard());
  const [selectedSquare, setSelectedSquare] = useState<{ row: number; col: number } | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<'white' | 'black'>('white');
  const [moveHistory, setMoveHistory] = useState<Move[]>([]);
  const [castlingRights, setCastlingRights] = useState({
    white: { kingside: true, queenside: true },
    black: { kingside: true, queenside: true }
  });
  const [enPassantTarget, setEnPassantTarget] = useState<{ row: number; col: number } | null>(null);
  const [gameState, setGameState] = useState<'playing' | 'check' | 'checkmate' | 'stalemate' | 'draw'>('playing');

  function initializeBoard(): Square[][] {
    const board: Square[][] = [];
    
    // Initialize empty board
    for (let row = 0; row < 8; row++) {
      board[row] = [];
      for (let col = 0; col < 8; col++) {
        board[row][col] = {
          piece: null,
          color: null,
          isSelected: false,
          isHighlighted: false,
          isLastMove: false
        };
      }
    }

    // Set up initial piece positions
    const initialSetup = {
      0: ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'],
      1: ['pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn'],
      6: ['pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn'],
      7: ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook']
    };

    // Place black pieces (top rows)
    for (let row = 0; row <= 1; row++) {
      for (let col = 0; col < 8; col++) {
        board[row][col].piece = initialSetup[row as keyof typeof initialSetup][col];
        board[row][col].color = 'black';
      }
    }

    // Place white pieces (bottom rows)
    for (let row = 6; row <= 7; row++) {
      for (let col = 0; col < 8; col++) {
        board[row][col].piece = initialSetup[row as keyof typeof initialSetup][col];
        board[row][col].color = 'white';
      }
    }

    return board;
  }

  const handleUndo = () => {
    if (moveHistory.length === 0) return;
    
    const lastMove = moveHistory[moveHistory.length - 1];
    
    // Create a new board state
    const newBoard = board.map(row => 
      row.map(square => ({
        ...square,
        isSelected: false,
        isHighlighted: false,
        isLastMove: false
      }))
    );
    
    // Restore the moved piece to its original position
    newBoard[lastMove.from.row][lastMove.from.col] = {
      piece: lastMove.piece,
      color: lastMove.color,
      isSelected: false,
      isHighlighted: false,
      isLastMove: false
    };
    
    // Restore the captured piece if any, or clear the square
    newBoard[lastMove.to.row][lastMove.to.col] = {
      piece: lastMove.capturedPiece || null,
      color: lastMove.capturedColor || null,
      isSelected: false,
      isHighlighted: false,
      isLastMove: false
    };
    
    // Update all states
    setBoard(newBoard);
    setCurrentPlayer(currentPlayer === 'white' ? 'black' : 'white');
    setMoveHistory(moveHistory.slice(0, -1));
    
    // Note: Castling rights restoration would require more complex logic
    // For now, we'll keep it simple and not restore castling rights on undo
  };

  // Phase 2: Legal Move Validation Functions
  const isValidPawnMove = (board: Square[][], from: { row: number; col: number }, to: { row: number; col: number }, color: 'white' | 'black'): boolean => {
    const direction = color === 'white' ? -1 : 1; // White moves up, black moves down
    const startRow = color === 'white' ? 6 : 1; // Starting row for each color
    
    const rowDiff = to.row - from.row;
    const colDiff = Math.abs(to.col - from.col);
    
    // Forward movement
    if (colDiff === 0) {
      // Single square forward
      if (rowDiff === direction && !board[to.row][to.col].piece) {
        return true;
      }
      // Double square forward from starting position
      if (from.row === startRow && rowDiff === 2 * direction && 
          !board[from.row + direction][from.col].piece && 
          !board[to.row][to.col].piece) {
        return true;
      }
    }
    
    // Diagonal capture
    if (colDiff === 1 && rowDiff === direction) {
      // Regular capture
      if (board[to.row][to.col].piece && board[to.row][to.col].color !== color) {
        return true;
      }
      // En passant capture
      if (enPassantTarget && to.row === enPassantTarget.row && to.col === enPassantTarget.col) {
        const enPassantRow = from.row; // The row where the captured pawn is
        const enPassantCol = to.col; // The column where the captured pawn is
        const capturedPawn = board[enPassantRow][enPassantCol];
        if (capturedPawn.piece === 'pawn' && capturedPawn.color !== color) {
          return true;
        }
      }
    }
    
    return false;
  };

  const isValidRookMove = (board: Square[][], from: { row: number; col: number }, to: { row: number; col: number }): boolean => {
    const rowDiff = Math.abs(to.row - from.row);
    const colDiff = Math.abs(to.col - from.col);
    
    // Rook moves horizontally or vertically
    if (rowDiff !== 0 && colDiff !== 0) return false;
    
    // Check if path is clear
    const rowStep = rowDiff === 0 ? 0 : (to.row - from.row) / rowDiff;
    const colStep = colDiff === 0 ? 0 : (to.col - from.col) / colDiff;
    
    let currentRow = from.row + rowStep;
    let currentCol = from.col + colStep;
    
    while (currentRow !== to.row || currentCol !== to.col) {
      if (board[currentRow][currentCol].piece) return false;
      currentRow += rowStep;
      currentCol += colStep;
    }
    
    return true;
  };

  const isValidBishopMove = (board: Square[][], from: { row: number; col: number }, to: { row: number; col: number }): boolean => {
    const rowDiff = Math.abs(to.row - from.row);
    const colDiff = Math.abs(to.col - from.col);
    
    // Bishop moves diagonally
    if (rowDiff !== colDiff) return false;
    
    // Check if path is clear
    const rowStep = (to.row - from.row) / rowDiff;
    const colStep = (to.col - from.col) / colDiff;
    
    let currentRow = from.row + rowStep;
    let currentCol = from.col + colStep;
    
    while (currentRow !== to.row && currentCol !== to.col) {
      if (board[currentRow][currentCol].piece) return false;
      currentRow += rowStep;
      currentCol += colStep;
    }
    
    return true;
  };

  const isValidQueenMove = (board: Square[][], from: { row: number; col: number }, to: { row: number; col: number }): boolean => {
    // Queen combines rook and bishop movement
    return isValidRookMove(board, from, to) || isValidBishopMove(board, from, to);
  };

  const isValidKingMove = (board: Square[][], from: { row: number; col: number }, to: { row: number; col: number }): boolean => {
    const rowDiff = Math.abs(to.row - from.row);
    const colDiff = Math.abs(to.col - from.col);
    
    // King moves one square in any direction
    return rowDiff <= 1 && colDiff <= 1 && (rowDiff !== 0 || colDiff !== 0);
  };

  const isValidKnightMove = (board: Square[][], from: { row: number; col: number }, to: { row: number; col: number }): boolean => {
    const rowDiff = Math.abs(to.row - from.row);
    const colDiff = Math.abs(to.col - from.col);
    
    // Knight moves in L-shape: 2+1 or 1+2
    return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);
  };

  const canCastle = (board: Square[][], color: 'white' | 'black', side: 'kingside' | 'queenside'): boolean => {
    const row = color === 'white' ? 7 : 0;
    const kingCol = 4;
    const rookCol = side === 'kingside' ? 7 : 0;
    const targetKingCol = side === 'kingside' ? 6 : 2;
    
    // Check if castling rights exist
    if (!castlingRights[color][side]) return false;
    
    // Check if king and rook are in correct positions
    if (board[row][kingCol].piece !== 'king' || board[row][kingCol].color !== color) return false;
    if (board[row][rookCol].piece !== 'rook' || board[row][rookCol].color !== color) return false;
    
    // Check if king is in check
    if (isInCheck(board, color)) return false;
    
    // Check if squares between king and rook are empty
    const startCol = Math.min(kingCol, targetKingCol);
    const endCol = Math.max(kingCol, targetKingCol);
    for (let col = startCol + 1; col < endCol; col++) {
      if (board[row][col].piece) return false;
    }
    
    // Check if king would pass through check
    for (let col = kingCol; col !== targetKingCol; col += (targetKingCol > kingCol ? 1 : -1)) {
      const tempBoard = board.map(row => [...row]);
      tempBoard[row][col] = { ...tempBoard[row][kingCol] };
      tempBoard[row][kingCol] = { piece: null, color: null, isSelected: false, isHighlighted: false, isLastMove: false };
      if (isInCheck(tempBoard, color)) return false;
    }
    
    return true;
  };

  const getValidMoves = (board: Square[][], from: { row: number; col: number }, color: 'white' | 'black'): { row: number; col: number }[] => {
    const validMoves: { row: number; col: number }[] = [];
    
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (isValidMove(board, from, { row, col }, color)) {
          validMoves.push({ row, col });
        }
      }
    }
    
    // Add castling moves if king is selected
    if (board[from.row][from.col].piece === 'king') {
      if (canCastle(board, color, 'kingside')) {
        validMoves.push({ row: from.row, col: 6 });
      }
      if (canCastle(board, color, 'queenside')) {
        validMoves.push({ row: from.row, col: 2 });
      }
    }
    
    return validMoves;
  };

  // Step 2: Advanced Rules
  const isInCheck = (board: Square[][], color: 'white' | 'black'): boolean => {
    // Find king position
    let kingRow = -1, kingCol = -1;
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (board[row][col].piece === 'king' && board[row][col].color === color) {
          kingRow = row;
          kingCol = col;
          break;
        }
      }
      if (kingRow !== -1) break;
    }
    
    if (kingRow === -1) return false; // King not found
    
    // Check if any opponent piece can attack the king
    const opponentColor = color === 'white' ? 'black' : 'white';
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (board[row][col].piece && board[row][col].color === opponentColor) {
          if (isValidMove(board, { row, col }, { row: kingRow, col: kingCol }, opponentColor)) {
            return true;
          }
        }
      }
    }
    
    return false;
  };

  const hasLegalMoves = (board: Square[][], color: 'white' | 'black'): boolean => {
    // Check if the player has any legal moves
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (board[row][col].piece && board[row][col].color === color) {
          const validMoves = getValidMoves(board, { row, col }, color);
          if (validMoves.length > 0) {
            return true;
          }
        }
      }
    }
    return false;
  };

  const isCheckmate = (board: Square[][], color: 'white' | 'black'): boolean => {
    return isInCheck(board, color) && !hasLegalMoves(board, color);
  };

  const isStalemate = (board: Square[][], color: 'white' | 'black'): boolean => {
    return !isInCheck(board, color) && !hasLegalMoves(board, color);
  };

  const isValidMove = (board: Square[][], from: { row: number; col: number }, to: { row: number; col: number }, color: 'white' | 'black'): boolean => {
    const piece = board[from.row][from.col].piece;
    const targetColor = board[to.row][to.col].color;
    
    // Can't capture own piece
    if (targetColor === color) return false;
    
    // Handle castling separately
    if (piece === 'king' && Math.abs(to.col - from.col) === 2 && to.row === from.row) {
      const side = to.col > from.col ? 'kingside' : 'queenside';
      return canCastle(board, color, side);
    }
    
    // Piece-specific validation
    let isValid = false;
    switch(piece) {
      case 'pawn': isValid = isValidPawnMove(board, from, to, color); break;
      case 'rook': isValid = isValidRookMove(board, from, to); break;
      case 'bishop': isValid = isValidBishopMove(board, from, to); break;
      case 'queen': isValid = isValidQueenMove(board, from, to); break;
      case 'king': isValid = isValidKingMove(board, from, to); break;
      case 'knight': isValid = isValidKnightMove(board, from, to); break;
      default: return false;
    }
    
    if (!isValid) return false;
    
    // Check if move would put/leave own king in check
    const tempBoard = board.map(row => [...row]);
    tempBoard[to.row][to.col] = { ...tempBoard[from.row][from.col] };
    tempBoard[from.row][from.col] = { piece: null, color: null, isSelected: false, isHighlighted: false, isLastMove: false };
    
    return !isInCheck(tempBoard, color);
  };

  const handleSquareClick = (row: number, col: number) => {
    const square = board[row][col];
    
    // If a square is selected and we're clicking on a valid move target
    if (selectedSquare) {
      const fromSquare = board[selectedSquare.row][selectedSquare.col];
      const targetSquare = board[row][col];
      
      // Check if this is a valid move using chess rules
      if (isValidMove(board, selectedSquare, { row, col }, currentPlayer)) {
        // Store the piece data BEFORE modifying the board
        const movedPiece = fromSquare.piece;
        const movedColor = fromSquare.color;
        const capturedPiece = targetSquare.piece;
        const capturedColor = targetSquare.color;
        
        // Make the move
        const newBoard = board.map(row => [...row]);
        
        newBoard[row][col].piece = movedPiece;
        newBoard[row][col].color = movedColor;
        newBoard[selectedSquare.row][selectedSquare.col].piece = null;
        newBoard[selectedSquare.row][selectedSquare.col].color = null;
        
        // Pawn promotion: if pawn reaches the opposite end, promote to queen
        if (movedPiece === 'pawn') {
          const promotionRow = movedColor === 'white' ? 0 : 7;
          if (row === promotionRow) {
            newBoard[row][col].piece = 'queen';
          }
        }
        
        // Set en passant target for double pawn moves
        let newEnPassantTarget: { row: number; col: number } | null = null;
        if (movedPiece === 'pawn' && Math.abs(row - selectedSquare.row) === 2) {
          // Pawn moved two squares, set en passant target
          newEnPassantTarget = { row: (selectedSquare.row + row) / 2, col: col };
        }
        setEnPassantTarget(newEnPassantTarget);
        
        // Handle en passant capture
        let isEnPassantCapture = false;
        let enPassantCapturedSquare: { row: number; col: number } | null = null;
        if (movedPiece === 'pawn' && Math.abs(col - selectedSquare.col) === 1 && 
            enPassantTarget && row === enPassantTarget.row && col === enPassantTarget.col) {
          // This is an en passant capture
          isEnPassantCapture = true;
          enPassantCapturedSquare = { row: selectedSquare.row, col: col };
          // Remove the captured pawn
          newBoard[enPassantCapturedSquare.row][enPassantCapturedSquare.col].piece = null;
          newBoard[enPassantCapturedSquare.row][enPassantCapturedSquare.col].color = null;
        }
        
        // Handle castling
        if (movedPiece === 'king' && Math.abs(col - selectedSquare.col) === 2) {
          // This is a castling move
          const isKingside = col > selectedSquare.col;
          const rookFromCol = isKingside ? 7 : 0;
          const rookToCol = isKingside ? 5 : 3;
          
          // Move the rook
          newBoard[row][rookToCol].piece = 'rook';
          newBoard[row][rookToCol].color = movedColor;
          newBoard[row][rookFromCol].piece = null;
          newBoard[row][rookFromCol].color = null;
          
          // Mark rook squares for last move highlighting
          newBoard[row][rookFromCol].isLastMove = true;
          newBoard[row][rookToCol].isLastMove = true;
        }
        
        // Update castling rights
        if (movedPiece === 'king') {
          setCastlingRights(prev => ({
            ...prev,
            [movedColor as 'white' | 'black']: { kingside: false, queenside: false }
          }));
        } else if (movedPiece === 'rook') {
          const isKingsideRook = selectedSquare.col === 7;
          setCastlingRights(prev => ({
            ...prev,
            [movedColor as 'white' | 'black']: {
              ...prev[movedColor as 'white' | 'black'],
              [isKingsideRook ? 'kingside' : 'queenside']: false
            }
          }));
        }
        
        // Clear all highlights and mark last move
        newBoard.forEach(boardRow => 
          boardRow.forEach(square => {
            square.isSelected = false;
            square.isHighlighted = false;
            square.isLastMove = false;
          })
        );
        
        // Mark last move squares
        newBoard[selectedSquare.row][selectedSquare.col].isLastMove = true;
        newBoard[row][col].isLastMove = true;
        
        // Add move to history
        const newMove: Move = {
          from: selectedSquare,
          to: { row, col },
          piece: movedPiece!,
          color: movedColor!,
          capturedPiece: capturedPiece || undefined,
          capturedColor: capturedColor || undefined,
          isEnPassant: isEnPassantCapture,
          enPassantTarget: enPassantCapturedSquare || undefined
        };
        
        setMoveHistory(prev => [...prev, newMove]);
        const nextPlayer = currentPlayer === 'white' ? 'black' : 'white';
        setCurrentPlayer(nextPlayer);
        
        // Check game state after the move
        const newGameState = (() => {
          if (isCheckmate(newBoard, nextPlayer)) {
            return 'checkmate';
          } else if (isStalemate(newBoard, nextPlayer)) {
            return 'stalemate';
          } else if (isInCheck(newBoard, nextPlayer)) {
            return 'check';
          } else {
            return 'playing';
          }
        })();
        setGameState(newGameState);
        
        setSelectedSquare(null);
        setBoard(newBoard);
        return;
      }
    }
    
    // Prevent moves if game is over
    if (gameState === 'checkmate' || gameState === 'stalemate') {
      return;
    }
    
    // Clear previous highlights and selections
    const newBoard = board.map(row => 
      row.map(square => ({
        ...square,
        isSelected: false,
        isHighlighted: false,
        isLastMove: false
      }))
    );

    // If clicked square has a piece of current player's color
    if (square.piece && square.color === currentPlayer) {
      newBoard[row][col].isSelected = true;
      setSelectedSquare({ row, col });
      
      // Highlight valid moves using chess rules - use original board state
      const validMoves = getValidMoves(board, { row, col }, currentPlayer);
      console.log('Selected piece:', square.piece, 'at', { row, col });
      console.log('Valid moves:', validMoves);
      validMoves.forEach(move => {
        newBoard[move.row][move.col].isHighlighted = true;
      });
    }
    // Otherwise, deselect
    else {
      setSelectedSquare(null);
    }

    setBoard(newBoard);
  };

  const getSquareColor = (row: number, col: number) => {
    const isLight = (row + col) % 2 === 0;
    const square = board[row][col];
    
    // King in check highlighting (highest priority)
    if (square.piece === 'king' && square.color === currentPlayer && gameState === 'check') {
      return 'bg-red-400 ring-4 ring-red-600 animate-pulse';
    }
    
    if (square.isSelected) {
      return 'bg-blue-400 ring-2 ring-blue-600';
    }
    
    if (square.isHighlighted) {
      return 'bg-emerald-300 ring-4 ring-emerald-500';
    }
    
    if (square.isLastMove) {
      return 'bg-gold-300 ring-2 ring-gold-500';
    }
    
    return isLight ? 'bg-knight-200' : 'bg-knight-600';
  };

  const getPieceSymbol = (piece: string, color: 'white' | 'black') => {
    const symbols: { [key: string]: string } = {
      king: '♔',
      queen: '♕',
      rook: '♖',
      bishop: '♗',
      knight: '♘',
      pawn: '♙'
    };
    
    const symbol = symbols[piece] || '';
    return color === 'white' ? symbol : symbol;
  };

  const sizeClasses = {
    sm: 'w-96 h-96',
    md: 'w-[500px] h-[500px]',
    lg: 'w-[60vw] h-[60vw] max-w-[700px] max-h-[700px]'
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Game Info */}
      <div className="luxury-card p-4 flex items-center justify-between w-full max-w-[800px]">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-white rounded-sm"></div>
            <span className="text-white font-semibold">White</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-knight-600 rounded-sm"></div>
            <span className="text-white font-semibold">Black</span>
          </div>
        </div>
        <div className="text-gold-400 font-bold text-lg">
          {gameState === 'checkmate' ? (
            <span className="text-red-500">
              CHECKMATE! {currentPlayer === 'white' ? 'Black' : 'White'} Wins!
            </span>
          ) : gameState === 'stalemate' ? (
            <span className="text-yellow-500">STALEMATE! Draw!</span>
          ) : (
            <>
              {currentPlayer === 'white' ? 'White' : 'Black'}&apos;s Turn
              {gameState === 'check' && (
                <span className="text-red-500 ml-2">♔ CHECK!</span>
              )}
            </>
          )}
        </div>
      </div>

      {/* Chess Board */}
      <div className={`${sizeClasses[size]} luxury-card p-4 ${gameState === 'checkmate' || gameState === 'stalemate' ? 'ring-4 ring-gold-400 animate-pulse' : ''}`}>
        <div className="w-full h-full flex flex-col">
          {/* File labels (a-h) at top */}
          <div className="grid grid-cols-8 h-6">
            {Array.from({ length: 8 }, (_, i) => (
              <div key={i} className="flex items-center justify-center">
                <span className="text-xs text-knight-400 font-mono">
                  {String.fromCharCode(97 + i)}
                </span>
              </div>
            ))}
          </div>
          
          {/* Main board with rank labels */}
          <div className="flex flex-1">
            {/* Rank labels (1-8) on left */}
            <div className="grid grid-rows-8 w-6">
              {Array.from({ length: 8 }, (_, i) => (
                <div key={i} className="flex items-center justify-center">
                  <span className="text-xs text-knight-400 font-mono">
                    {8 - i}
                  </span>
                </div>
              ))}
            </div>
            
            {/* Chess board */}
            <div className="flex-1 grid grid-cols-8 grid-rows-8 border-2 border-knight-700">
              {board.map((row, rowIndex) => 
                row.map((square, colIndex) => (
                  <button
                    key={`${rowIndex}-${colIndex}`}
                    onClick={() => handleSquareClick(rowIndex, colIndex)}
                    className={`
                      ${getSquareColor(rowIndex, colIndex)}
                      flex items-center justify-center
                      transition-all duration-300 ease-in-out
                      hover:brightness-110 hover:scale-105
                      border border-knight-700
                      ${square.piece && square.color === currentPlayer ? 'hover:shadow-lg cursor-pointer' : ''}
                      ${gameState === 'checkmate' || gameState === 'stalemate' ? 'opacity-75' : ''}
                    `}
                  >
                    {square.piece && (
                      <span 
                        className={`
                          text-4xl font-bold select-none
                          transition-all duration-300 ease-in-out
                          ${square.color === 'white' ? 'text-white drop-shadow-2xl' : 'text-knight-900 drop-shadow-2xl'}
                          ${square.isSelected ? 'scale-110 animate-pulse' : ''}
                          ${square.piece === 'king' && square.color === currentPlayer && gameState === 'check' ? 'animate-bounce' : ''}
                          hover:scale-105 hover:drop-shadow-2xl
                          filter hover:brightness-110
                        `}
                      >
                        {getPieceSymbol(square.piece, square.color!)}
                      </span>
                    )}
                  </button>
                ))
              )}
            </div>
            
            {/* Rank labels (1-8) on right */}
            <div className="grid grid-rows-8 w-6">
              {Array.from({ length: 8 }, (_, i) => (
                <div key={i} className="flex items-center justify-center">
                  <span className="text-xs text-knight-400 font-mono">
                    {8 - i}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          {/* File labels (a-h) at bottom */}
          <div className="grid grid-cols-8 h-6">
            {Array.from({ length: 8 }, (_, i) => (
              <div key={i} className="flex items-center justify-center">
                <span className="text-xs text-knight-400 font-mono">
                  {String.fromCharCode(97 + i)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Game Controls */}
      <div className="luxury-card p-4 flex items-center justify-center space-x-4 w-full max-w-[800px]">
        <button 
          className="luxury-button hover:scale-105 transition-transform duration-200"
          onClick={() => {
            setBoard(initializeBoard());
            setSelectedSquare(null);
            setCurrentPlayer('white');
            setMoveHistory([]);
            setCastlingRights({
              white: { kingside: true, queenside: true },
              black: { kingside: true, queenside: true }
            });
            setEnPassantTarget(null);
            setGameState('playing');
          }}
          aria-label="Start a new chess game"
        >
          ♔ New Game
        </button>
        <button 
          className="luxury-button-secondary hover:scale-105 transition-transform duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          onClick={handleUndo}
          disabled={moveHistory.length === 0 || gameState === 'checkmate' || gameState === 'stalemate'}
          aria-label={`Undo last move (${moveHistory.length} moves in history)`}
        >
          ↶ Undo Move ({moveHistory.length})
        </button>
      </div>
    </div>
  );
}
