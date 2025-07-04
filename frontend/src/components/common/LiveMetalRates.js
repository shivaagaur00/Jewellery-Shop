import React, { useState, useEffect } from 'react';
import { CircularProgress, Tooltip } from '@mui/material';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import InfoIcon from '@mui/icons-material/Info';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import RefreshIcon from '@mui/icons-material/Refresh';
import LocationCityIcon from '@mui/icons-material/LocationCity';

const LiveMetalRates = () => {
  const API_KEY = 'goldapi-vskn7slxu8tuwu-io'; 
  const BASE_URL = 'https://www.goldapi.io/api';

  const [rates, setRates] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState('');
  const [selectedCity, setSelectedCity] = useState('Mumbai');
  const [autoRefresh, setAutoRefresh] = useState(true);

  const cities = ['Mumbai', 'Delhi', 'Chennai', 'Kolkata', 'Bangalore', 'Hyderabad'];

  // City-based premium factors (percentage added to base price)
  const cityPremiums = {
    Mumbai: 1.5,
    Delhi: 1.8,
    Chennai: 1.2,
    Kolkata: 1.3,
    Bangalore: 1.6,
    Hyderabad: 1.4
  };

  const fetchMetalRates = async () => {
    try {
      setLoading(true);
      
      // Fetch gold rates
      const goldResponse = await fetch(`${BASE_URL}/XAU/INR`, {
        headers: {
          'x-access-token': API_KEY,
          'Content-Type': 'application/json'
        }
      });
      
      // Fetch silver rates
      const silverResponse = await fetch(`${BASE_URL}/XAG/INR`, {
        headers: {
          'x-access-token': API_KEY,
          'Content-Type': 'application/json'
        }
      });
      
      if (!goldResponse.ok || !silverResponse.ok) {
        throw new Error('API rate limit exceeded or service unavailable');
      }
      
      const goldData = await goldResponse.json();
      const silverData = await silverResponse.json();
      
      // Apply city premium
      const cityPremiumFactor = 1 + (cityPremiums[selectedCity] / 100);
      
      // Calculate rates per gram (1 troy ounce = 31.1035 grams)
      const goldPricePerGram = (goldData.price / 31.1035) * cityPremiumFactor;
      const silverPricePerGram = (silverData.price / 31.1035) * cityPremiumFactor;
      
      // Previous close prices
      const goldPrevPricePerGram = (goldData.prev_close_price / 31.1035) * cityPremiumFactor;
      const silverPrevPricePerGram = (silverData.prev_close_price / 31.1035) * cityPremiumFactor;
      
      setRates({
        gold: {
          rate24k: goldPricePerGram,
          rate22k: goldPricePerGram * 0.9167,
          yesterday24k: goldPrevPricePerGram,
          taxRate: 4, // GST
        },
        silver: {
          rate: silverPricePerGram,
          yesterdayRate: silverPrevPricePerGram,
          taxRate: 4 // GST
        },
        timestamp: new Date().toISOString()
      });
      
      setLastUpdated(new Date().toLocaleTimeString());
      setError(null);
    } catch (err) {
      setError('Failed to fetch live rates. Using cached data instead.');
      console.error('Error fetching metal rates:', err);
      
      // Fallback data with city premium applied
      const cityPremiumFactor = 1 + (cityPremiums[selectedCity] / 100);
      const baseGoldPrice = 6235.50 * cityPremiumFactor;
      const baseSilverPrice = 74.85 * cityPremiumFactor;
      
      setRates({
        gold: {
          rate24k: baseGoldPrice,
          rate22k: baseGoldPrice * 0.9167,
          yesterday24k: 6180.75 * cityPremiumFactor,
          taxRate: 3,
        },
        silver: {
          rate: baseSilverPrice,
          yesterdayRate: 73.20 * cityPremiumFactor,
          taxRate: 3
        },
        timestamp: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetalRates();
    
    if (autoRefresh) {
      const interval = setInterval(fetchMetalRates, 60000);
      return () => clearInterval(interval);
    }
  }, [selectedCity, autoRefresh]);

  const calculateFinalPrice = (baseRate, isGold = false) => {
    if (!rates) return 0;
    const taxAmount = baseRate * (isGold ? rates.gold.taxRate : rates.silver.taxRate) / 100;
    return baseRate + taxAmount ;
  };

  const formatNumber = (num) => {
    return num?.toLocaleString('en-IN', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2
    }) || '--';
  };

  const getTrendIcon = (current, previous) => {
    if (!current || !previous) return <CompareArrowsIcon className="text-gray-400" />;
    if (current > previous) return <TrendingUpIcon className="text-green-500" />;
    if (current < previous) return <TrendingDownIcon className="text-red-500" />;
    return <CompareArrowsIcon className="text-gray-500" />;
  };

  const getTrendText = (current, previous) => {
    if (!current || !previous) return 'Data not available';
    const difference = current - previous;
    const percentage = (Math.abs(difference) / previous * 100).toFixed(2);
    
    if (difference > 0) return `↑ ₹${formatNumber(difference)} (${percentage}%)`;
    if (difference < 0) return `↓ ₹${formatNumber(Math.abs(difference))} (${percentage}%)`;
    return 'No change';
  };

  const handleRefresh = () => {
    fetchMetalRates();
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-xl p-6 max-w-5xl mx-auto transition-all duration-300 hover:shadow-2xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h2 className="text-3xl font-extrabold text-gray-900 flex items-center">
          <CurrencyRupeeIcon className="mr-2 text-amber-500" />
          Live Gold & Silver Rates
          <span className="ml-2 text-sm font-normal bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
            {selectedCity}
          </span>
        </h2>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center">
            <LocationCityIcon className="text-gray-600 mr-2" />
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition duration-200"
            >
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center text-sm bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 disabled:bg-amber-300 transition duration-200"
            >
              <RefreshIcon className={`mr-2 ${loading ? 'animate-spin' : ''}`} fontSize="small" />
              Refresh
            </button>
            
            <label className="flex items-center text-sm text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="mr-2 accent-amber-500"
              />
              Auto-refresh
            </label>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {loading && !rates ? (
        <div className="flex justify-center items-center h-64">
          <CircularProgress size={60} className="text-amber-500" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-6 shadow-lg hover:shadow-xl transition duration-300">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-bold text-amber-900 flex items-center">
                  <img src="https://cdn-icons-png.flaticon.com/512/2583/2583344.png" alt="Gold" className="w-6 h-6 mr-2" />
                  Gold Rates
                </h3>
                <div className="flex flex-col items-end">
                  <span className="text-xs bg-amber-200 text-amber-900 px-2 py-1 rounded-full mb-1">
                    24K Pure
                  </span>
                  <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
                    City Premium: +{cityPremiums[selectedCity]}%
                  </span>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Today's Rate (per gram)</span>
                  <div className="flex items-center">
                    <span className="font-bold text-lg text-gray-900 mr-2">₹{formatNumber(rates?.gold?.rate24k)}</span>
                    {getTrendIcon(rates?.gold?.rate24k, rates?.gold?.yesterday24k)}
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">22K Carat (per gram)</span>
                  <span className="font-bold text-gray-900">₹{formatNumber(rates?.gold?.rate22k)}</span>
                </div>
                
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">GST</span>
                  <span className="font-bold text-gray-900">{rates?.gold?.taxRate}%</span>
                </div>
                
                <div className="pt-4 border-t border-amber-200">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Final Price (approx.)</span>
                    <span className="font-bold text-xl text-amber-800">
                      ₹{formatNumber(calculateFinalPrice(rates?.gold?.rate24k, true))}/g
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 shadow-lg hover:shadow-xl transition duration-300">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                  <img src="https://cdn-icons-png.flaticon.com/512/2583/2583436.png" alt="Silver" className="w-6 h-6 mr-2" />
                  Silver Rates
                </h3>
                <div className="flex flex-col items-end">
                  <span className="text-xs bg-gray-200 text-gray-900 px-2 py-1 rounded-full mb-1">
                    Pure 999
                  </span>
                  <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
                    City Premium: +{cityPremiums[selectedCity]}%
                  </span>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Today's Rate (per gram)</span>
                  <div className="flex items-center">
                    <span className="font-bold text-lg text-gray-900 mr-2">₹{formatNumber(rates?.silver?.rate)}</span>
                    {getTrendIcon(rates?.silver?.rate, rates?.silver?.yesterdayRate)}
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Yesterday's Rate</span>
                  <span className="font-bold text-gray-900">₹{formatNumber(rates?.silver?.yesterdayRate)}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">GST</span>
                  <span className="font-bold text-gray-900">{rates?.silver?.taxRate}%</span>
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Final Price (approx.)</span>
                    <span className="font-bold text-xl text-gray-800">
                      ₹{formatNumber(calculateFinalPrice(rates?.silver?.rate))}/g
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-sm text-gray-600">
            <div>
              <p className="flex items-center">
                <span className="mr-2">Market Trend:</span>
                {getTrendIcon(rates?.gold?.rate24k, rates?.gold?.yesterday24k)}
                <span className="ml-1">
                  Gold {getTrendText(rates?.gold?.rate24k, rates?.gold?.yesterday24k)}
                </span>
                <span className="mx-2">|</span>
                {getTrendIcon(rates?.silver?.rate, rates?.silver?.yesterdayRate)}
                <span className="ml-1">
                  Silver {getTrendText(rates?.silver?.rate, rates?.silver?.yesterdayRate)}
                </span>
              </p>
            </div>
            <div>
              <p>Last updated: {lastUpdated || '--'}</p>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
            <h4 className="font-medium text-amber-900 mb-2">Note:</h4>
            <p className="text-sm text-amber-800">
              Rates are calculated from international prices (per troy ounce) converted to INR per gram, 
              including GST (4%). Prices include a city premium based on local market conditions.
              Actual prices may vary based on design and additional charges. Rates are updated every minute when auto-refresh is enabled.
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default LiveMetalRates;