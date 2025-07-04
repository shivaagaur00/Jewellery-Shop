import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock } from '@mui/icons-material';
import DiamondIcon from '@mui/icons-material/Diamond';
import { CircularProgress } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '../../store/authSlice.js';
import { login } from '../../api/customerAPIs';

const Login = () => {
  const [formData, setFormData] = useState({
    id: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.id.trim()) newErrors.id = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(formData.id)) newErrors.id = 'Email is invalid';
    if (!formData.password.trim()) newErrors.password = 'Password is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      dispatch(loginStart());
      const response = await login(formData);
      console.log(response.data);
      dispatch(loginSuccess(response.data));
      navigate('/profile');
    } catch (err) {
      dispatch(loginFailure(err.response?.data?.message || 'Login failed'));
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-white flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-6xl flex flex-col lg:flex-row bg-white rounded-xl shadow-lg overflow-hidden border border-amber-100">
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-amber-500 to-amber-700 flex-col items-center justify-center p-8 lg:p-12">
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center gap-3 mb-4 lg:mb-6">
              <DiamondIcon className="text-white text-4xl lg:text-5xl" />
              <h1 className="text-3xl lg:text-4xl font-bold text-white font-serif">Jewelsphere</h1>
            </div>
            <p className="text-amber-100 text-lg lg:text-xl max-w-md">
              Welcome back to our exquisite jewelry collection
            </p>
          </div>
        </div>
        <div className="w-full md:w-1/2 flex items-center justify-center p-6 sm:p-8 lg:p-12">
          <div className="w-full max-w-md">
            <div className="md:hidden mb-6 text-center">
              <div className="flex justify-center items-center gap-2 mb-3">
                <DiamondIcon className="text-amber-600 text-3xl" />
                <h2 className="text-2xl font-bold text-amber-800 font-serif">Jewelsphere</h2>
              </div>
              <p className="text-amber-600">Sign in to your account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="hidden md:block text-2xl font-bold text-amber-800 text-center mb-6">Sign In</h2>
              <div>
                <label htmlFor="email" className="block text-sm sm:text-base font-medium text-amber-800 mb-1">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="text-amber-500" />
                  </div>
                  <input
                    type="email"
                    id="id"
                    name="id"
                    value={formData.id}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-3 py-2 text-sm sm:text-base border ${
                      errors.id ? 'border-rose-500' : 'border-amber-200'
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500`}
                    placeholder="your@email.com"
                    disabled={loading}
                  />
                </div>
                {errors.id && <p className="mt-1 text-sm text-rose-600">{errors.id}</p>}
              </div>
              <div>
                <label htmlFor="password" className="block text-sm sm:text-base font-medium text-amber-800 mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="text-amber-500" />
                  </div>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-3 py-2 text-sm sm:text-base border ${
                      errors.password ? 'border-rose-500' : 'border-amber-200'
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500`}
                    placeholder="••••••••"
                    disabled={loading}
                  />
                </div>
                {errors.password && <p className="mt-1 text-sm text-rose-600">{errors.password}</p>}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="remember"
                    className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-amber-300 rounded"
                  />
                  <label htmlFor="remember" className="ml-2 block text-sm sm:text-base text-amber-800">
                    Remember me
                  </label>
                </div>
                <Link to="/forgot-password" className="text-sm sm:text-base font-medium text-amber-600 hover:text-amber-800">
                  Forgot password?
                </Link>
              </div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-4 mt-4 rounded-lg shadow-sm text-sm sm:text-base font-medium text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-all ${
                  loading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {loading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  'Sign In'
                )}
              </button>
              {error && (
                <p className="text-sm text-rose-600 text-center mt-2">{error}</p>
              )}
              <div className="text-center pt-4">
                <p className="text-sm sm:text-base text-amber-800">
                  Don't have an account?{' '}
                  <Link 
                    to="/signup" 
                    className="font-medium text-amber-600 hover:text-amber-800 hover:underline"
                  >
                    Sign up
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;