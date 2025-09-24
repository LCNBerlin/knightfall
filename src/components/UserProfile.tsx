'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Edit3, Save, X, LogOut, Crown, Coins, DollarSign } from 'lucide-react';

export default function UserProfile() {
  const { user, logout, updateProfile, isLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    username: '',
    email: '',
  });
  const [error, setError] = useState('');


  // Initialize editData when user becomes available
  useEffect(() => {
    if (user) {
      setEditData({
        username: user.username,
        email: user.email,
      });
    }
  }, [user]);

  if (!user) {
    return (
      <div className="luxury-card p-6">
        <div className="text-center text-gray-400">
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  const handleEdit = () => {
    setEditData({
      username: user.username,
      email: user.email,
    });
    setIsEditing(true);
    setError('');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({
      username: user.username,
      email: user.email,
    });
    setError('');
  };

  const handleSave = async () => {
    if (!editData.username || !editData.email) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const result = await updateProfile(editData);
      
      if (result.success) {
        setIsEditing(false);
        setError('');
      } else {
        setError(result.error || 'Update failed');
      }
    } catch (error) {
      console.error('Error in handleSave:', error);
      setError('An unexpected error occurred');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // Ensure user has all required properties
  if (!user.username || !user.email) {
    return (
      <div className="luxury-card p-6">
        <div className="text-center text-red-400">
          <p>Error: Incomplete user data</p>
        </div>
      </div>
    );
  }

  const winRate = Number(user.games_played || 0) > 0 ? ((Number(user.games_won || 0) / Number(user.games_played || 1)) * 100).toFixed(1) : '0.0';

  return (
    <div className="luxury-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gold-gradient">Profile</h3>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="p-2 text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                <Save size={20} />
              </button>
              <button
                onClick={handleCancel}
                disabled={isLoading}
                className="p-2 text-red-400 hover:text-red-300 transition-colors"
              >
                <X size={20} />
              </button>
            </>
          ) : (
            <button
              onClick={handleEdit}
              className="p-2 text-gray-400 hover:text-gold transition-colors"
            >
              <Edit3 size={20} />
            </button>
          )}
          <button
            onClick={logout}
            className="p-2 text-red-400 hover:text-red-300 transition-colors"
            title="Logout"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gold-gradient rounded-full flex items-center justify-center">
            <Crown size={24} className="text-black" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              {isEditing ? (
                <input
                  type="text"
                  name="username"
                  value={editData.username}
                  onChange={handleChange}
                  className="bg-gray-800/50 border border-gray-600 rounded px-2 py-1 text-white"
                  disabled={isLoading}
                />
              ) : (
                <h4 className="text-lg font-semibold text-white">{user.username}</h4>
              )}
              <span className="px-2 py-1 bg-gold/20 text-gold text-xs rounded-full">
                {user.rank || 'Rookie'}
              </span>
            </div>
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={editData.email}
                onChange={handleChange}
                className="bg-gray-800/50 border border-gray-600 rounded px-2 py-1 text-white text-sm"
                disabled={isLoading}
              />
            ) : (
              <p className="text-gray-400 text-sm">{user.email}</p>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-3 text-red-300 text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-700">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 text-gold mb-1">
              <Crown size={16} />
              <span className="text-sm font-medium">Rating</span>
            </div>
            <p className="text-2xl font-bold text-white">{Number(user.elo_rating || 1200)}</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 text-emerald-400 mb-1">
              <span className="text-sm font-medium">Win Rate</span>
            </div>
            <p className="text-2xl font-bold text-white">{winRate}%</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-700">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 text-gold mb-1">
              <Coins size={16} />
              <span className="text-sm font-medium">Tokens</span>
            </div>
            <p className="text-xl font-bold text-white">{Number(user.token_balance || 0).toLocaleString()}</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 text-emerald-400 mb-1">
              <DollarSign size={16} />
              <span className="text-sm font-medium">Cash</span>
            </div>
            <p className="text-xl font-bold text-white">${Number(user.cash_balance || 0).toFixed(2)}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-700">
          <div className="text-center">
            <p className="text-sm text-gray-400 mb-1">Games Played</p>
            <p className="text-lg font-semibold text-white">{Number(user.games_played || 0)}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-400 mb-1">Games Won</p>
            <p className="text-lg font-semibold text-white">{Number(user.games_won || 0)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}