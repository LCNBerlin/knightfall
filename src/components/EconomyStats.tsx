'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Coins, TrendingUp, Trophy, DollarSign, History, Plus } from 'lucide-react';

interface EconomyStats {
  currentBalance: number;
  totalWagered: number;
  totalWon: number;
  netProfit: number;
  gamesPlayed: number;
  winRate: number;
}

interface Transaction {
  id: string;
  type: string;
  amount: number;
  balanceAfter: number;
  description: string;
  createdAt: string;
  gameId?: string;
}

export default function EconomyStats() {
  const { user, token } = useAuth();
  const [stats, setStats] = useState<EconomyStats | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [bonusAmount, setBonusAmount] = useState(100);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  useEffect(() => {
    if (user && token) {
      fetchEconomyData();
    }
  }, [user, token]);

  const fetchEconomyData = async () => {
    try {
      setLoading(true);
      const [statsResponse, transactionsResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/api/economy/stats`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${API_BASE_URL}/api/economy/transactions`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData.data);
      }

      if (transactionsResponse.ok) {
        const transactionsData = await transactionsResponse.json();
        setTransactions(transactionsData.data);
      }
    } catch (error) {
      console.error('Error fetching economy data:', error);
    } finally {
      setLoading(false);
    }
  };

  const addBonusTokens = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/economy/bonus`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: bonusAmount,
          description: `Bonus of ${bonusAmount} tokens`
        })
      });

      if (response.ok) {
        await fetchEconomyData(); // Refresh data
      }
    } catch (error) {
      console.error('Error adding bonus tokens:', error);
    }
  };

  const formatTransactionType = (type: string) => {
    switch (type) {
      case 'game_wager': return 'Wager';
      case 'game_win': return 'Win';
      case 'game_loss': return 'Loss';
      case 'bonus': return 'Bonus';
      case 'refund': return 'Refund';
      default: return type;
    }
  };

  const getTransactionColor = (type: string, amount: number) => {
    if (type === 'game_win' || type === 'bonus' || type === 'refund') {
      return amount > 0 ? 'text-emerald-400' : 'text-gray-400';
    }
    if (type === 'game_wager') {
      return 'text-red-400';
    }
    return 'text-gray-400';
  };

  if (loading) {
    return (
      <div className="luxury-card p-6">
        <div className="text-center text-gray-400">
          <p>Loading economy data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Economy Stats */}
      <div className="luxury-card p-6">
        <h3 className="text-xl font-bold text-gold-gradient mb-4 flex items-center gap-2">
          <Coins className="w-5 h-5" />
          Economy Overview
        </h3>
        
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-gold mb-1">
                <Coins size={16} />
                <span className="text-sm font-medium">Balance</span>
              </div>
              <p className="text-2xl font-bold text-white">{stats.currentBalance.toLocaleString()}</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-emerald-400 mb-1">
                <TrendingUp size={16} />
                <span className="text-sm font-medium">Net Profit</span>
              </div>
              <p className={`text-xl font-bold ${stats.netProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {stats.netProfit >= 0 ? '+' : ''}{stats.netProfit.toLocaleString()}
              </p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-blue-400 mb-1">
                <Trophy size={16} />
                <span className="text-sm font-medium">Win Rate</span>
              </div>
              <p className="text-xl font-bold text-white">{stats.winRate}%</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-purple-400 mb-1">
                <DollarSign size={16} />
                <span className="text-sm font-medium">Total Wagered</span>
              </div>
              <p className="text-xl font-bold text-white">{stats.totalWagered.toLocaleString()}</p>
            </div>
          </div>
        )}
      </div>

      {/* Bonus Tokens (for testing) */}
      <div className="luxury-card p-6">
        <h3 className="text-lg font-bold text-white mb-4">Add Bonus Tokens</h3>
        <div className="flex items-center gap-4">
          <input
            type="number"
            value={bonusAmount}
            onChange={(e) => setBonusAmount(parseInt(e.target.value) || 0)}
            className="bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white w-24"
            min="1"
            max="10000"
          />
          <button
            onClick={addBonusTokens}
            className="bg-gold hover:bg-gold/80 text-black font-semibold py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
          >
            <Plus size={16} />
            Add Tokens
          </button>
        </div>
      </div>

      {/* Transaction History */}
      <div className="luxury-card p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <History className="w-5 h-5" />
          Recent Transactions
        </h3>
        
        {transactions.length === 0 ? (
          <p className="text-gray-400 text-center py-4">No transactions yet</p>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {transactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between py-2 px-3 bg-gray-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-300">
                    {formatTransactionType(tx.type)}
                  </span>
                  <span className="text-xs text-gray-500">{tx.description}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-medium ${getTransactionColor(tx.type, tx.amount)}`}>
                    {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString()}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(tx.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
