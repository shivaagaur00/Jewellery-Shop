import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const OwnerLogin = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { username, password } = formData;

    if (!username || !password) {
      setError('Please fill in both fields.');
      return;
    }
    setError('');
    console.log('Login data:', formData);
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center p-4'>
      <div className='w-full max-w-md bg-white/5 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden border border-white/10'>
        <div className='p-8'>
          <div className='flex flex-col items-center mb-8'>
            <div className='w-16 h-16 mb-4 rounded-full bg-gradient-to-r from-amber-400 to-rose-500 flex items-center justify-center shadow-lg'>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7a2 2 0 012-2h6a2 2 0 012 2v1a2 2 0 01-2 2h-2a2 2 0 00-2 2v1h4v4h-4v1a2 2 0 01-2 2H9a2 2 0 01-2-2v-1H5v-4h2v-1a2 2 0 00-2-2H3a2 2 0 01-2-2V7z" />
              </svg>
            </div>
            <h1 className='text-2xl font-bold text-white'>Luxury Jewelry Admin</h1>
            <p className='text-white/60 mt-1'>Owner Portal</p>
          </div>

          <form onSubmit={handleSubmit} className='space-y-6'>
            {error && <p className="text-red-400 text-sm text-center">{error}</p>}

            <div>
              <label htmlFor='username' className='block text-sm font-medium text-white/80 mb-1'>
                Username
              </label>
              <input
                id='username'
                name='username'
                type='text'
                value={formData.username}
                onChange={handleChange}
                required
                className='w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent text-white placeholder-white/30'
                placeholder='Enter your username'
              />
            </div>

            <div>
              <label htmlFor='password' className='block text-sm font-medium text-white/80 mb-1'>
                Password
              </label>
              <input
                id='password'
                name='password'
                type='password'
                value={formData.password}
                onChange={handleChange}
                required
                className='w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent text-white placeholder-white/30'
                placeholder='Enter your password'
              />
            </div>

            <div className='flex items-center justify-between'>
              <div className='flex items-center'>
                <input
                  id='remember-me'
                  name='remember-me'
                  type='checkbox'
                  className='h-4 w-4 text-amber-500 focus:ring-amber-400 border-white/10 rounded bg-white/5'
                />
                <label htmlFor='remember-me' className='ml-2 block text-sm text-white/70'>
                  Remember me
                </label>
              </div>

              <div className='text-sm'>
                <Link to="/forgot-password" className='font-medium text-amber-400 hover:text-amber-300'>
                  Forgot password?
                </Link>
              </div>
            </div>

            <div>
              <button
                type='submit'
                className='w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-black bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-400'
              >
                Sign in
              </button>
            </div>
          </form>

          <div className='mt-6 text-center'>
            <p className='text-sm text-white/70'>
              New to Luxury Jewelry?{' '}
              <Link to="/ownerSignUp" className='font-medium text-amber-400 hover:text-amber-300'>
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerLogin;