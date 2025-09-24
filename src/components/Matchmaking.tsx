'use client';

import { useState } from 'react';
import { Coins, DollarSign, Clock, Users, Target, Zap } from 'lucide-react';

interface WagerOption {
  value: number;
  label: string;
  currency: 'tokens' | 'cash';
}

export default function Matchmaking() {
  const [selectedMode, setSelectedMode] = useState<'tokens' | 'cash'>('tokens');
  const [selectedWager, setSelectedWager] = useState<number>(100);
  const [isSearching, setIsSearching] = useState(false);

  const tokenWagers: WagerOption[] = [
    { value: 50, label: '50 Tokens', currency: 'tokens' },
    { value: 100, label: '100 Tokens', currency: 'tokens' },
    { value: 250, label: '250 Tokens', currency: 'tokens' },
    { value: 500, label: '500 Tokens', currency: 'tokens' },
    { value: 1000, label: '1000 Tokens', currency: 'tokens' },
  ];

  const cashWagers: WagerOption[] = [
    { value: 5, label: '$5', currency: 'cash' },
    { value: 10, label: '$10', currency: 'cash' },
    { value: 25, label: '$25', currency: 'cash' },
    { value: 50, label: '$50', currency: 'cash' },
    { value: 100, label: '$100', currency: 'cash' },
  ];

  const gameModes = [
    {
      id: 'blitz',
      name: 'Blitz',
      time: '3+2',
      icon: Zap,
      description: 'Fast-paced action'
    },
    {
      id: 'rapid',
      name: 'Rapid',
      time: '10+0',
      icon: Clock,
      description: 'Balanced gameplay'
    },
    {
      id: 'classical',
      name: 'Classical',
      time: '15+10',
      icon: Target,
      description: 'Strategic depth'
    }
  ];

  const handleStartSearch = () => {
    setIsSearching(true);
    // Simulate matchmaking
    setTimeout(() => {
      setIsSearching(false);
      // Here you would typically redirect to a game or show match found
      alert('Match found! Redirecting to game...');
    }, 3000);
  };

  const handleGameModeSelect = (modeId: string) => {
    // Handle game mode selection
    console.log('Selected game mode:', modeId);
  };

  return (
    <div className="luxury-card p-8 max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-serif font-bold text-gold-500 mb-2">
          Find Your Match
        </h2>
        <p className="text-knight-300">
          Choose your stakes and prepare for battle
        </p>
      </div>

      {/* Mode Selection */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-white mb-4">Game Mode</h3>
        <div className="grid grid-cols-3 gap-4">
          {gameModes.map((mode) => {
            const Icon = mode.icon;
            return (
              <button
                key={mode.id}
                onClick={() => handleGameModeSelect(mode.id)}
                className="luxury-card p-4 hover:border-gold-500/50 transition-all duration-200 group"
              >
                <div className="flex flex-col items-center space-y-2">
                  <Icon className="w-8 h-8 text-gold-500" />
                  <span className="font-semibold text-white">{mode.name}</span>
                  <span className="text-sm text-gold-400">{mode.time}</span>
                  <span className="text-xs text-knight-400">{mode.description}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Currency Selection */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-white mb-4">Wager Type</h3>
        <div className="flex space-x-4">
          <button
            onClick={() => setSelectedMode('tokens')}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all duration-200 ${
              selectedMode === 'tokens'
                ? 'bg-gold-500/20 text-gold-400 border border-gold-500/30'
                : 'bg-knight-700/50 text-knight-300 hover:bg-knight-700/70'
            }`}
          >
            <Coins className="w-5 h-5" />
            <span>Token Ladder</span>
          </button>
          <button
            onClick={() => setSelectedMode('cash')}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all duration-200 ${
              selectedMode === 'cash'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-knight-700/50 text-knight-300 hover:bg-knight-700/70'
            }`}
          >
            <DollarSign className="w-5 h-5" />
            <span>Cash Ladder</span>
          </button>
        </div>
      </div>

      {/* Wager Selection */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-white mb-4">Select Wager</h3>
        <div className="grid grid-cols-5 gap-3">
          {(selectedMode === 'tokens' ? tokenWagers : cashWagers).map((wager) => (
            <button
              key={wager.value}
              onClick={() => setSelectedWager(wager.value)}
              className={`p-3 rounded-lg transition-all duration-200 ${
                selectedWager === wager.value
                  ? selectedMode === 'tokens'
                    ? 'bg-gold-500/20 text-gold-400 border border-gold-500/30'
                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-knight-700/50 text-knight-300 hover:bg-knight-700/70'
              }`}
            >
              <div className="flex items-center justify-center space-x-1">
                {wager.currency === 'tokens' ? (
                  <Coins className="w-4 h-4" />
                ) : (
                  <DollarSign className="w-4 h-4" />
                )}
                <span className="text-sm font-medium">{wager.label}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Matchmaking Stats */}
      <div className="mb-8">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-knight-700/30 rounded-lg p-4">
            <Users className="w-6 h-6 text-gold-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">1,247</div>
            <div className="text-sm text-knight-400">Players Online</div>
          </div>
          <div className="bg-knight-700/30 rounded-lg p-4">
            <Clock className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">12s</div>
            <div className="text-sm text-knight-400">Avg Wait Time</div>
          </div>
          <div className="bg-knight-700/30 rounded-lg p-4">
            <Target className="w-6 h-6 text-gold-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">85%</div>
            <div className="text-sm text-knight-400">Elo Match</div>
          </div>
        </div>
      </div>

      {/* Start Search Button */}
      <div className="text-center">
        <button
          onClick={handleStartSearch}
          disabled={isSearching}
          className={`luxury-button text-lg px-12 py-4 ${
            isSearching ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
          }`}
        >
          {isSearching ? (
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Searching...</span>
            </div>
          ) : (
            'Find Match'
          )}
        </button>
      </div>

      {/* Current Balance */}
      <div className="mt-6 text-center">
        <div className="flex items-center justify-center space-x-6">
          <div className="flex items-center space-x-2">
            <Coins className="w-5 h-5 text-gold-400" />
            <span className="text-gold-400">2,450 Tokens</span>
          </div>
          <div className="flex items-center space-x-2">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            <span className="text-emerald-400">$1,250</span>
          </div>
        </div>
      </div>
    </div>
  );
} 