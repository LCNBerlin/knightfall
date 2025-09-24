'use client';

import { useState } from 'react';
import { Activity, CheckCircle, XCircle, Clock } from 'lucide-react';

interface ApiResponse {
  status?: string;
  timestamp?: string;
  service?: string;
  version?: string;
  message?: string;
}

export default function ApiTest() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const testBackendConnection = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('http://localhost:3001/health', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const testApiEndpoints = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      // Test multiple endpoints
      const endpoints = [
        { name: 'Health Check', url: '/health' },
        { name: 'User Profile', url: '/api/users/profile' },
        { name: 'Leaderboard', url: '/api/users/leaderboard' },
        { name: 'Auth Login', url: '/api/auth/login' }
      ];

      const results = await Promise.all(
        endpoints.map(async (endpoint) => {
          try {
            const response = await fetch(`http://localhost:3001${endpoint.url}`);
            const data = await response.json();
            return { ...endpoint, success: true, data };
          } catch (err) {
            return { ...endpoint, success: false, error: err instanceof Error ? err.message : 'Failed' };
          }
        })
      );

      setResult({ message: `Tested ${results.length} endpoints`, endpoints: results } as any);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="luxury-card p-6 max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-serif font-bold text-gold-500 mb-2">
          Backend Connection Test
        </h2>
        <p className="text-knight-300">
          Test the connection between frontend and backend
        </p>
      </div>

      <div className="flex space-x-4 mb-6">
        <button
          onClick={testBackendConnection}
          disabled={isLoading}
          className="luxury-button flex items-center space-x-2 flex-1"
        >
          {isLoading ? <Clock className="w-4 h-4 animate-spin" /> : <Activity className="w-4 h-4" />}
          <span>Test Health Endpoint</span>
        </button>
        
        <button
          onClick={testApiEndpoints}
          disabled={isLoading}
          className="luxury-button-secondary flex items-center space-x-2 flex-1"
        >
          {isLoading ? <Clock className="w-4 h-4 animate-spin" /> : <Activity className="w-4 h-4" />}
          <span>Test All Endpoints</span>
        </button>
      </div>

      {/* Results */}
      {result && (
        <div className="luxury-card p-4 mb-4 bg-knight-700/30">
          <div className="flex items-center space-x-2 mb-3">
            <CheckCircle className="w-5 h-5 text-emerald-500" />
            <h3 className="font-semibold text-emerald-500">Connection Successful!</h3>
          </div>
          <pre className="text-sm text-knight-300 bg-knight-800/50 p-3 rounded overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}

      {error && (
        <div className="luxury-card p-4 mb-4 bg-red-500/10 border border-red-500/30">
          <div className="flex items-center space-x-2 mb-3">
            <XCircle className="w-5 h-5 text-red-500" />
            <h3 className="font-semibold text-red-500">Connection Failed</h3>
          </div>
          <p className="text-red-400">{error}</p>
          <div className="mt-3 text-sm text-knight-400">
            <p><strong>Troubleshooting:</strong></p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>Make sure the backend server is running on port 3001</li>
              <li>Check that CORS is configured correctly</li>
              <li>Verify the backend health endpoint is accessible</li>
              <li>Ensure both frontend (3000) and backend (3001) are running</li>
            </ul>
          </div>
        </div>
      )}

      {/* Connection Status */}
      <div className="text-center text-sm text-knight-400">
        <p>Frontend: <span className="text-emerald-400">http://localhost:3000</span></p>
        <p>Backend: <span className="text-gold-400">http://localhost:3001</span></p>
      </div>
    </div>
  );
}