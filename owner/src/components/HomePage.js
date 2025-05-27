import React, { useState } from 'react';
import { Lock, Person, Visibility, VisibilityOff } from '@mui/icons-material';
import { login } from '../api/owners';
import { useNavigate } from "react-router-dom";
import MJnoBG from "./../assets/MJnoBG.png";

const HomePage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }
    
    setIsLoading(true);
    try {
      const res = await login({ username, password });
      if (res.status !== 200) {
        setError(res.data.message || 'Login failed');
      } else {
        navigate("/ownerLayout");
      }
    } catch (err) {
      setError('An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-amber-400 filter blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/3 w-40 h-40 rounded-full bg-amber-500 filter blur-3xl"></div>
      </div>
      
      {/* Main content container - changes layout based on screen size */}
      <div className="relative z-10 w-full max-w-6xl flex flex-col lg:flex-row items-center justify-center lg:items-stretch gap-8 lg:gap-12">
        {/* Left side (60%) - Branding - hidden on mobile, shown on tablet and up */}
        <div className="hidden md:flex md:w-full lg:w-3/5 flex-col items-center lg:items-start justify-center pr-0 lg:pr-12">
          <div className="flex flex-col items-center lg:items-start">
            <img 
              src={MJnoBG} 
              alt="Luxe Jewels Logo" 
              className="h-32 lg:h-48 mb-4 lg:mb-6 transform hover:scale-105 transition duration-500" 
            />
            <h1 className="text-3xl lg:text-5xl font-serif font-bold text-white text-center lg:text-left">
              <span className="text-amber-400">Admin</span> Login
            </h1>
            <div className="mt-2 lg:mt-4 h-1 w-16 lg:w-24 bg-gradient-to-r from-amber-400 to-transparent rounded-full"></div>
            <p className="mt-4 lg:mt-6 text-gray-300 text-sm lg:text-lg text-center lg:text-left max-w-md">
              Welcome back to the Luxe Jewels management portal. Please authenticate to access your dashboard.
            </p>
          </div>
        </div>

        {/* Mobile header (shown only on mobile) */}
        <div className="md:hidden w-full flex flex-col items-center mb-6">
          <img 
            src={MJnoBG} 
            alt="Luxe Jewels Logo" 
            className="h-24 mb-4 transform hover:scale-105 transition duration-500" 
          />
          <h1 className="text-2xl font-serif font-bold text-white text-center">
            <span className="text-amber-400">Admin</span> Login
          </h1>
          <div className="mt-2 h-1 w-12 bg-gradient-to-r from-amber-400 to-transparent rounded-full"></div>
        </div>

        {/* Right side (40%) - Login Card - full width on mobile, constrained on larger screens */}
        <div className="w-full md:w-2/3 lg:w-2/5 max-w-md">
          <div className="bg-white bg-opacity-5 backdrop-filter backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden border border-gray-700 border-opacity-30">
            {/* Card header */}
            <div className="bg-gradient-to-r from-amber-900 to-amber-700 p-4">
              <h2 className="text-xl font-serif font-medium text-white text-center">
                Owner Portal
              </h2>
            </div>

            {/* Card body */}
            <div className="p-6 sm:p-8">
              <p className="text-gray-300 mb-6 text-center font-light text-sm sm:text-base">
                Please enter your credentials to access the dashboard
              </p>

              {error && (
                <div className="bg-red-900 bg-opacity-30 text-red-200 p-3 rounded-lg mb-4 text-sm border border-red-700">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* Username field */}
                <div className="mb-4 sm:mb-6">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Person className="text-amber-400" />
                    </div>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => {
                        setUsername(e.target.value);
                        setError('');
                      }}
                      className="w-full pl-10 pr-3 py-2 sm:py-3 bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none transition text-white placeholder-gray-400 text-sm sm:text-base"
                      placeholder="Enter your username"
                    />
                  </div>
                </div>

                {/* Password field */}
                <div className="mb-6 sm:mb-8">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="text-amber-400" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setError('');
                      }}
                      className="w-full pl-10 pr-10 py-2 sm:py-3 bg-gray-800 bg-opacity-50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none transition text-white placeholder-gray-400 text-sm sm:text-base"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <VisibilityOff className="text-amber-400 hover:text-amber-300 text-lg" />
                      ) : (
                        <Visibility className="text-amber-400 hover:text-amber-300 text-lg" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Remember me & forgot password */}
                <div className="flex items-center justify-between mb-6 sm:mb-8">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-amber-500 focus:ring-amber-400 border-gray-600 rounded bg-gray-700"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-xs sm:text-sm text-gray-300">
                      Remember me
                    </label>
                  </div>
                  <div className="text-xs sm:text-sm">
                    <a href="#" className="font-medium text-amber-400 hover:text-amber-300">
                      Forgot password?
                    </a>
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-2 sm:py-3 px-4 rounded-lg transition duration-300 shadow-lg ${
                    isLoading
                      ? 'bg-amber-700 cursor-not-allowed'
                      : 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600'
                  } text-white font-medium flex items-center justify-center text-sm sm:text-base`}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Authenticating...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </form>
            </div>

            {/* Card footer */}
            <div className="bg-gray-900 bg-opacity-50 px-4 sm:px-8 py-3 sm:py-4 border-t border-gray-800">
              <p className="text-xs text-gray-400 text-center">
                &copy; {new Date().getFullYear()} Luxe Jewels. Strictly confidential - Owner access only.
              </p>
            </div>
          </div>

          {/* Security notice */}
          <p className="mt-4 sm:mt-6 text-xs text-gray-400 text-center flex items-center justify-center">
            <Lock className="mr-1 sm:mr-2" fontSize="small" />
            <span>Secure encrypted connection</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;