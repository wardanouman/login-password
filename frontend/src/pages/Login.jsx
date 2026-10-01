import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/tempInstance';
import { AuthContext } from '../context/AuthContext';

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = isRegister ? '/register' : '/login';

    try {
      const response = await API.post(endpoint, { username, password });
      if (response.data.token) {
        login(response.data.token);
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F3F3] flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-white border border-gray-300 rounded-lg shadow-md p-8">
        
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            market<span className="text-amber-500">hub</span>
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            {isRegister ? 'Create a new seller account' : 'Seller Central & Product Management'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Username</label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 bg-white border border-gray-400 text-gray-900 rounded focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Password</label>
            <input
              type="password"
              required
              className="w-full px-3 py-2 bg-white border border-gray-400 text-gray-900 rounded focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-400 hover:bg-amber-500 text-gray-900 font-medium py-2 rounded border border-amber-600 shadow-sm transition-all disabled:opacity-50 text-sm"
          >
            {loading ? 'Processing...' : isRegister ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-gray-200 text-center">
          <button
            onClick={() => {
              setIsRegister(!isRegister);
              setError('');
            }}
            className="text-xs text-blue-600 hover:underline font-medium"
          >
            {isRegister ? 'Already have an account? Log In' : 'New to MarketHub? Create an account'}
          </button>
        </div>

      </div>
    </div>
  );
}