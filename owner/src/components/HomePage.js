import React, { useState } from 'react';
import { Lock, Person, Visibility, VisibilityOff, Diamond } from '@mui/icons-material';
import { login } from '../api/owners';
import {useNavigate} from "react-router-dom";

const HomePage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
 const navigate = useNavigate();
  const handleSubmit = async(e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }
    console.log('Login attempt:', { username, password });
    const res=await login({username:username,password:password});
    if(res.status!=200) setError(res.data.message);
    else navigate("/ownerLayout");
    console.log(res);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex flex-col items-center justify-center p-6">
      <div className="flex items-center mb-8">
        <Diamond className="text-amber-400 text-4xl mr-2" />
        <h1 className="text-3xl font-serif font-bold text-white">LUXE JEWELS ADMIN</h1>
      </div>
      <div className="bg-white bg-opacity-90 w-full max-w-md rounded-2xl shadow-xl overflow-hidden">
        <div className="p-8">
          <h2 className="text-2xl font-serif font-medium text-gray-800 mb-1">Owner Portal</h2>
          <p className="text-gray-600 mb-6">Access your jewelry business dashboard</p>
          
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Person className="text-gray-400" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setError('');
                  }}
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-300 focus:border-amber-300 outline-none transition"
                  placeholder="Enter your username"
                />
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-300 focus:border-amber-300 outline-none transition"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <VisibilityOff className="text-gray-400 hover:text-gray-500" />
                  ) : (
                    <Visibility className="text-gray-400 hover:text-gray-500" />
                  )}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-amber-500 focus:ring-amber-400 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <a href="#" className="font-medium text-amber-600 hover:text-amber-500">
                  Forgot password?
                </a>
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-600 text-white font-medium py-3 px-4 rounded-lg transition duration-300 shadow-md"
            >
              Sign In
            </button>
          </form>
        </div>
        <div className="bg-gray-50 px-8 py-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            &copy; {new Date().getFullYear()} Luxe Jewels. Strictly confidential - Owner access only.
          </p>
        </div>
      </div>
      <p className="mt-6 text-xs text-gray-400 text-center max-w-md">
        <Lock className="inline mr-1" fontSize="small" />
        This portal uses end-to-end encryption. Ensure you're on a secure network before logging in.
      </p>
    </div>
  );
};

export default HomePage;