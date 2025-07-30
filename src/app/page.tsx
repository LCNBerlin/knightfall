'use client';

import { useState } from 'react';
import { 
  Home, 
  Swords, 
  Puzzle, 
  Users, 
  Trophy, 
  Store, 
  User,
  Crown,
  Coins,
  DollarSign,
  MessageCircle,
  Users as FriendsIcon,
  Calendar,
  Play,
  TrendingUp,
  ArrowLeft
} from 'lucide-react';
import ChessBoard from '../components/ChessBoard';
import Matchmaking from '../components/Matchmaking';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('home');
  const [showMatchmaking, setShowMatchmaking] = useState(false);
  const [showChessBoard, setShowChessBoard] = useState(false);

  const navigationItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'play', label: 'Play', icon: Swords },
    { id: 'puzzle', label: 'Puzzle Ladder', icon: Puzzle },
    { id: 'battle', label: 'Battle Royale', icon: Trophy },
    { id: 'teams', label: 'Teams', icon: Users },
    { id: 'tournaments', label: 'Tournaments', icon: Trophy },
    { id: 'store', label: 'Store', icon: Store },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const quickPlayOptions = [
    { label: 'Token Ladder', icon: Coins, color: 'gold', action: () => setShowMatchmaking(true) },
    { label: 'Cash Ladder', icon: DollarSign, color: 'emerald', action: () => setShowMatchmaking(true) },
    { label: 'Puzzle Ladder', icon: Puzzle, color: 'gold', action: () => setActiveTab('puzzle') },
    { label: 'Battle Royale', icon: Swords, color: 'emerald', action: () => setActiveTab('battle') },
  ];

  const liveTournaments = [
    '🏆 Weekly Championship - $5000 Prize Pool',
    '⚔️ Team Showdown - House vs House',
    '🎯 Puzzle Master Challenge - 1000 Tokens',
    '👑 Royal Tournament - Invite Only',
  ];

  const friendsOnline = [
    { name: 'ChessMaster', status: 'online', rank: 'King' },
    { name: 'PawnSlayer', status: 'playing', rank: 'Queen' },
    { name: 'RookRider', status: 'online', rank: 'Bishop' },
  ];

  const upcomingEvents = [
    { title: 'Daily Puzzle Reset', time: '2 hours', type: 'puzzle' },
    { title: 'Team Tournament', time: '6 hours', type: 'tournament' },
    { title: 'Cash Ladder Reset', time: '1 day', type: 'ladder' },
  ];

  return (
    <div className="flex h-screen bg-knight-900">
      {/* Left Sidebar */}
      <div className="w-64 bg-knight-800/50 backdrop-blur-sm border-r border-knight-700/50">
        {/* Logo */}
        <div className="p-6 border-b border-knight-700/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-gold-500 to-gold-600 rounded-lg flex items-center justify-center">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-serif font-bold text-gold-500">Knightfall</h1>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setShowMatchmaking(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  activeTab === item.id
                    ? 'bg-gold-500/20 text-gold-400 border border-gold-500/30'
                    : 'text-knight-300 hover:bg-knight-700/50 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="h-16 bg-knight-800/30 backdrop-blur-sm border-b border-knight-700/50 flex items-center justify-between px-6">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Crown className="w-5 h-5 text-gold-500" />
                <span className="text-gold-500 font-semibold">King</span>
              </div>
              <div className="flex items-center space-x-2 text-knight-300">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm">Elo: 1850</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Coins className="w-5 h-5 text-gold-400" />
              <span className="text-gold-400 font-semibold">2,450</span>
            </div>
            <div className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-emerald-400" />
              <span className="text-emerald-400 font-semibold">$1,250</span>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-6 overflow-auto">
          {/* Matchmaking Modal */}
          {showMatchmaking && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="relative w-full max-w-4xl">
                <button
                  onClick={() => setShowMatchmaking(false)}
                  className="absolute top-4 right-4 z-10 p-2 bg-knight-800/80 rounded-full hover:bg-knight-700/80 transition-colors"
                >
                  <ArrowLeft className="w-6 h-6 text-white" />
                </button>
                <Matchmaking />
              </div>
            </div>
          )}

          {/* Conditional Content Based on Active Tab */}
          {activeTab === 'home' && !showMatchmaking && (
            <>
              {/* Welcome Banner */}
              <div className="luxury-card p-6 mb-6">
                <h2 className="text-2xl font-serif font-bold text-gold-500 mb-2">
                  Welcome back, ChessMaster
                </h2>
                <p className="text-knight-300">
                  Ready for your next high-stakes match? Choose your game mode below.
                </p>
              </div>

              {/* Quick Play Buttons */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {quickPlayOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.label}
                      onClick={option.action}
                      className={`luxury-card p-8 hover:scale-105 transition-all duration-300 group border-2 ${
                        option.color === 'gold' 
                          ? 'border-gold-500/30 hover:border-gold-500/70 hover:shadow-gold-500/20' 
                          : 'border-emerald-500/30 hover:border-emerald-500/70 hover:shadow-emerald-500/20'
                      } hover:shadow-2xl`}
                    >
                      <div className="flex flex-col items-center space-y-4">
                        <div className={`w-16 h-16 rounded-xl flex items-center justify-center shadow-lg ${
                          option.color === 'gold' 
                            ? 'bg-gradient-to-br from-gold-500 to-gold-600 shadow-gold-500/30' 
                            : 'bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-emerald-500/30'
                        }`}>
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                        <span className="font-bold text-lg text-white group-hover:text-gold-400 transition-colors">
                          {option.label}
                        </span>
                        <div className={`text-xs px-3 py-1 rounded-full ${
                          option.color === 'gold' 
                            ? 'bg-gold-500/20 text-gold-300' 
                            : 'bg-emerald-500/20 text-emerald-300'
                        }`}>
                          High Stakes
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Live Tournaments Ticker */}
              <div className="luxury-card p-4 mb-6 overflow-hidden">
                <div className="flex items-center space-x-3 mb-3">
                  <Trophy className="w-5 h-5 text-gold-500" />
                  <h3 className="font-semibold text-gold-500">Live Tournaments</h3>
                </div>
                <div className="flex space-x-8 animate-pulse-slow">
                  {liveTournaments.map((tournament, index) => (
                    <span key={index} className="text-knight-300 whitespace-nowrap">
                      {tournament}
                    </span>
                  ))}
                </div>
              </div>

              {/* Recent Match Clips */}
              <div className="luxury-card p-6">
                <h3 className="text-lg font-semibold text-gold-500 mb-4">Recent Highlights</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-knight-700/50 rounded-lg p-4 hover:bg-knight-700/70 transition-colors cursor-pointer">
                      <div className="w-full h-32 bg-knight-600 rounded mb-3 flex items-center justify-center">
                        <Play className="w-8 h-8 text-gold-500" />
                      </div>
                      <p className="text-sm text-knight-300">Amazing Checkmate #{i}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Puzzle Ladder Tab */}
          {activeTab === 'puzzle' && (
            <div className="luxury-card p-6">
              <h2 className="text-2xl font-serif font-bold text-gold-500 mb-6">Puzzle Ladder</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="luxury-card p-6 hover:border-gold-500/50 transition-all duration-200 cursor-pointer">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-lg font-bold text-white">Puzzle #{i}</span>
                      <span className="text-sm text-gold-400">Rating: 1200</span>
                    </div>
                    <div className="w-full h-32 bg-knight-600 rounded mb-3 flex items-center justify-center">
                      <Puzzle className="w-8 h-8 text-gold-500" />
                    </div>
                    <p className="text-sm text-knight-300 mb-3">Find the winning combination in 3 moves</p>
                    <button 
                      className="luxury-button w-full text-sm"
                      onClick={() => alert('Puzzle #' + i + ' selected! Opening puzzle interface...')}
                    >
                      Solve Puzzle
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Battle Royale Tab */}
          {activeTab === 'battle' && (
            <div className="luxury-card p-6">
              <h2 className="text-2xl font-serif font-bold text-gold-500 mb-6">Battle Royale</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="luxury-card p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Active Battles</h3>
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-knight-700/30 rounded">
                        <div>
                          <span className="text-white font-medium">Battle #{i}</span>
                          <p className="text-sm text-knight-400">8 players remaining</p>
                        </div>
                        <button 
                          className="luxury-button text-sm px-4 py-2"
                          onClick={() => alert('Joining Battle #' + i + '!')}
                        >
                          Join
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="luxury-card p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Upcoming Battles</h3>
                  <div className="space-y-3">
                    {[1, 2].map((i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-knight-700/30 rounded">
                        <div>
                          <span className="text-white font-medium">Battle #{i + 3}</span>
                          <p className="text-sm text-knight-400">Starting in 5m</p>
                        </div>
                        <button 
                          className="luxury-button-secondary text-sm px-4 py-2"
                          onClick={() => alert('Registered for Battle #' + (i + 3) + '!')}
                        >
                          Register
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Play Tab - Chess Board */}
          {activeTab === 'play' && (
            <div className="flex justify-center">
              <ChessBoard />
            </div>
          )}

          {/* Teams Tab */}
          {activeTab === 'teams' && (
            <div className="luxury-card p-6">
              <h2 className="text-2xl font-serif font-bold text-gold-500 mb-6">Teams & Houses</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {['House of Kings', 'Pawn Masters', 'Rook Riders', 'Bishop Brigade', 'Queen\'s Guard', 'Knight\'s Order'].map((team, i) => (
                  <div key={i} className="luxury-card p-6 hover:border-gold-500/50 transition-all duration-200 cursor-pointer">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-gold-500 to-gold-600 rounded-lg flex items-center justify-center">
                        <Crown className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-white">{team}</h3>
                        <p className="text-sm text-knight-400">Rank: #{i + 1}</p>
                      </div>
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-knight-400">Members:</span>
                        <span className="text-white">24</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-knight-400">Rating:</span>
                        <span className="text-gold-400">1850</span>
                      </div>
                    </div>
                    <button 
                      className="luxury-button w-full text-sm"
                      onClick={() => alert('Joining team: ' + team)}
                    >
                      Join Team
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tournaments Tab */}
          {activeTab === 'tournaments' && (
            <div className="luxury-card p-6">
              <h2 className="text-2xl font-serif font-bold text-gold-500 mb-6">Tournaments</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="luxury-card p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Active Tournaments</h3>
                  <div className="space-y-4">
                    {[
                      { name: 'Weekly Championship', prize: '$5000', players: '128/256', time: '2h left' },
                      { name: 'Team Showdown', prize: '1000 Tokens', players: '16/32', time: '1h left' },
                      { name: 'Puzzle Master', prize: '500 Tokens', players: '64/128', time: '30m left' }
                    ].map((tournament, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-knight-700/30 rounded">
                        <div>
                          <h4 className="font-semibold text-white">{tournament.name}</h4>
                          <p className="text-sm text-gold-400">{tournament.prize}</p>
                          <p className="text-xs text-knight-400">{tournament.players} • {tournament.time}</p>
                        </div>
                        <button 
                          className="luxury-button text-sm px-4 py-2"
                          onClick={() => alert('Joining tournament: ' + tournament.name)}
                        >
                          Join
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="luxury-card p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Upcoming Tournaments</h3>
                  <div className="space-y-4">
                    {[
                      { name: 'Monthly Grand Prix', prize: '$10000', start: 'Tomorrow 2PM' },
                      { name: 'Royal Invitational', prize: '2000 Tokens', start: 'Friday 8PM' },
                      { name: 'Speed Chess Cup', prize: '$2500', start: 'Sunday 3PM' }
                    ].map((tournament, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-knight-700/30 rounded">
                        <div>
                          <h4 className="font-semibold text-white">{tournament.name}</h4>
                          <p className="text-sm text-emerald-400">{tournament.prize}</p>
                          <p className="text-xs text-knight-400">Starts: {tournament.start}</p>
                        </div>
                        <button 
                          className="luxury-button-secondary text-sm px-4 py-2"
                          onClick={() => alert('Registered for tournament: ' + tournament.name)}
                        >
                          Register
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Store Tab */}
          {activeTab === 'store' && (
            <div className="luxury-card p-6">
              <h2 className="text-2xl font-serif font-bold text-gold-500 mb-6">Store</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { name: 'Golden Crown', price: '500 Tokens', type: 'Avatar' },
                  { name: 'Emerald Board', price: '$25', type: 'Board Theme' },
                  { name: 'Royal Sound Pack', price: '200 Tokens', type: 'Audio' },
                  { name: 'VIP Pass', price: '$50', type: 'Premium' },
                  { name: 'Custom Pieces', price: '300 Tokens', type: 'Pieces' },
                  { name: 'Tournament Entry', price: '$10', type: 'Ticket' }
                ].map((item, i) => (
                  <div key={i} className="luxury-card p-6 hover:border-gold-500/50 transition-all duration-200 cursor-pointer">
                    <div className="w-full h-32 bg-knight-600 rounded mb-4 flex items-center justify-center">
                      <Store className="w-8 h-8 text-gold-500" />
                    </div>
                    <h3 className="font-bold text-white mb-2">{item.name}</h3>
                    <p className="text-sm text-knight-400 mb-2">{item.type}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-gold-400 font-semibold">{item.price}</span>
                      <button 
                        className="luxury-button text-sm px-4 py-2"
                        onClick={() => alert('Purchasing: ' + item.name + ' for ' + item.price)}
                      >
                        Buy
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="luxury-card p-6">
              <h2 className="text-2xl font-serif font-bold text-gold-500 mb-6">Profile</h2>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                  <div className="luxury-card p-6 text-center">
                    <div className="w-24 h-24 bg-gradient-to-br from-gold-500 to-gold-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <Crown className="w-12 h-12 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">ChessMaster</h3>
                    <p className="text-gold-400 mb-4">King • Elo: 1850</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-knight-400">Games Played:</span>
                        <span className="text-white">1,247</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-knight-400">Win Rate:</span>
                        <span className="text-emerald-400">68%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-knight-400">Tournaments Won:</span>
                        <span className="text-gold-400">12</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="lg:col-span-2">
                  <div className="luxury-card p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
                    <div className="space-y-3">
                      {[
                        { action: 'Won Tournament', details: 'Weekly Championship', time: '2 hours ago', result: 'win' },
                        { action: 'Lost Match', details: 'vs PawnSlayer', time: '5 hours ago', result: 'loss' },
                        { action: 'Solved Puzzle', details: 'Rating 1500', time: '1 day ago', result: 'win' },
                        { action: 'Joined Team', details: 'House of Kings', time: '2 days ago', result: 'neutral' }
                      ].map((activity, i) => (
                        <div key={i} className="flex items-center space-x-3 p-3 bg-knight-700/30 rounded">
                          <div className={`w-3 h-3 rounded-full ${
                            activity.result === 'win' ? 'bg-emerald-500' : 
                            activity.result === 'loss' ? 'bg-red-500' : 'bg-knight-400'
                          }`} />
                          <div className="flex-1">
                            <p className="text-white font-medium">{activity.action}</p>
                            <p className="text-sm text-knight-400">{activity.details}</p>
                          </div>
                          <span className="text-xs text-knight-400">{activity.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-80 bg-knight-800/30 backdrop-blur-sm border-l border-knight-700/50 flex flex-col">
        {/* Team Chat */}
        <div className="flex-1 p-4 border-b border-knight-700/50">
          <div className="flex items-center space-x-2 mb-4">
            <MessageCircle className="w-5 h-5 text-gold-500" />
            <h3 className="font-semibold text-gold-500">Team Chat</h3>
          </div>
          <div className="space-y-3 max-h-64 overflow-y-auto scrollbar-hide">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="bg-knight-700/30 rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-sm font-medium text-gold-400">Player{i}</span>
                  <span className="text-xs text-knight-400">2m ago</span>
                </div>
                <p className="text-sm text-knight-300">Great game! Ready for the next match?</p>
              </div>
            ))}
          </div>
        </div>

        {/* Friends Online */}
        <div className="p-4 border-b border-knight-700/50">
          <div className="flex items-center space-x-2 mb-4">
            <FriendsIcon className="w-5 h-5 text-emerald-500" />
            <h3 className="font-semibold text-emerald-500">Friends Online</h3>
          </div>
          <div className="space-y-3">
            {friendsOnline.map((friend, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    friend.status === 'online' ? 'bg-emerald-500' : 'bg-gold-500'
                  }`} />
                  <span className="text-sm font-medium text-white">{friend.name}</span>
                  <span className="text-xs text-knight-400">({friend.rank})</span>
                </div>
                <button className="text-xs bg-emerald-600 hover:bg-emerald-500 px-2 py-1 rounded transition-colors">
                  Challenge
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="p-4">
          <div className="flex items-center space-x-2 mb-4">
            <Calendar className="w-5 h-5 text-gold-500" />
            <h3 className="font-semibold text-gold-500">Upcoming Events</h3>
          </div>
          <div className="space-y-3">
            {upcomingEvents.map((event, index) => (
              <div key={index} className="bg-knight-700/30 rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-white">{event.title}</span>
                  <span className="text-xs text-knight-400">{event.time}</span>
                </div>
                <span className={`text-xs px-2 py-1 rounded ${
                  event.type === 'tournament' ? 'bg-gold-500/20 text-gold-400' :
                  event.type === 'puzzle' ? 'bg-emerald-500/20 text-emerald-400' :
                  'bg-knight-500/20 text-knight-400'
                }`}>
                  {event.type}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
