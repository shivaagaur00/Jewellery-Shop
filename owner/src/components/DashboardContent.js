import React, { useEffect, useState } from 'react';
import {
  Notifications as NotificationsIcon,
  AccountBalanceWallet as WalletIcon,
  AttachMoney as MoneyIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  CompareArrows as CompareArrowsIcon,
  ShowChart as ChartIcon,
  AccessTime as TimeIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Diamond as DiamondIcon,
  Watch as WatchIcon,
  ShoppingCart as CartIcon,
  Spa as SpaIcon,
  Refresh as RefreshIcon,
  LocationOn as LocationIcon
} from '@mui/icons-material';
import { getDashBoard } from '../api/owners';
import { Select, MenuItem, FormControl, InputLabel, IconButton, CircularProgress, Tooltip } from '@mui/material';

const API_KEY = 'goldapi-vskn7slxu8tuwu-io'; // Replace with your actual API key
const BASE_URL = 'https://www.goldapi.io/api';

const DashboardContent = () => {
  const [dashboardDetails, setDashboardDetails] = useState({
    gold: 0,
    silver: 0,
    platinum: 0,
    totalActiveLoans: 0,
    totalpendingOrders: 0,
    todayRevenue: 0,
    newCustomersToday: 0,
    notifications: []
  });

  const [metalRates, setMetalRates] = useState({
    gold: { rate24k: 0, rate22k: 0, yesterday24k: 0, taxRate: 3 },
    silver: { rate: 0, yesterdayRate: 0, taxRate: 3 },
    timestamp: ''
  });

  const [loading, setLoading] = useState(true);
  const [metalLoading, setMetalLoading] = useState(true);
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

  // Fetch dashboard data
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await getDashBoard();
        setDashboardDetails(res.data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, []);

  // Fetch metal prices per 10 grams
  const fetchMetalRates = async () => {
    try {
      setMetalLoading(true);
      
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
      
      // Calculate rates per 10 grams (1 troy ounce = 31.1035 grams)
      const goldPricePer10Gram = (goldData.price / 31.1035 * 10) * cityPremiumFactor;
      const silverPricePer10Gram = (silverData.price / 31.1035 * 10) * cityPremiumFactor;
      
      // Previous close prices
      const goldPrevPricePer10Gram = (goldData.prev_close_price / 31.1035 * 10) * cityPremiumFactor;
      const silverPrevPricePer10Gram = (silverData.prev_close_price / 31.1035 * 10) * cityPremiumFactor;
      
      setMetalRates({
        gold: {
          rate24k: goldPricePer10Gram,
          rate22k: goldPricePer10Gram * 0.9167, // 22k is 91.67% pure
          yesterday24k: goldPrevPricePer10Gram,
          taxRate: 3, // GST
        },
        silver: {
          rate: silverPricePer10Gram,
          yesterdayRate: silverPrevPricePer10Gram,
          taxRate: 3 // GST
        },
        timestamp: new Date().toISOString()
      });
      
      setLastUpdated(new Date().toLocaleTimeString());
      setError(null);
    } catch (err) {
      setError('Failed to fetch live rates. Using cached data instead.');
      console.error('Error fetching metal rates:', err);
      
      // Fallback data with city premium applied (per 10gm)
      const cityPremiumFactor = 1 + (cityPremiums[selectedCity] / 100);
      const baseGoldPrice = 62355.00 * cityPremiumFactor; // ~₹62,355 per 10gm
      const baseSilverPrice = 748.50 * cityPremiumFactor; // ~₹748 per 10gm
      
      setMetalRates({
        gold: {
          rate24k: baseGoldPrice,
          rate22k: baseGoldPrice * 0.9167,
          yesterday24k: 61807.50 * cityPremiumFactor,
          taxRate: 3,
        },
        silver: {
          rate: baseSilverPrice,
          yesterdayRate: 732.00 * cityPremiumFactor,
          taxRate: 3
        },
        timestamp: new Date().toISOString()
      });
    } finally {
      setMetalLoading(false);
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
    if (!metalRates) return 0;
    const taxAmount = baseRate * (isGold ? metalRates.gold.taxRate : metalRates.silver.taxRate) / 100;
    return baseRate + taxAmount;
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

  const marketPrices = [
    { 
      metal: '24K Gold', 
      price: `₹${formatNumber(calculateFinalPrice(metalRates.gold.rate24k, true))}/10g`, 
      change: getTrendText(metalRates.gold.rate24k, metalRates.gold.yesterday24k), 
      icon: <DiamondIcon className="text-yellow-500" />,
      trendIcon: getTrendIcon(metalRates.gold.rate24k, metalRates.gold.yesterday24k)
    },
    { 
      metal: '22K Gold', 
      price: `₹${formatNumber(calculateFinalPrice(metalRates.gold.rate22k, true))}/10g`, 
      change: getTrendText(metalRates.gold.rate22k, metalRates.gold.yesterday24k * 0.9167), 
      icon: <DiamondIcon className="text-yellow-600" />,
      trendIcon: getTrendIcon(metalRates.gold.rate22k, metalRates.gold.yesterday24k * 0.9167)
    },
    { 
      metal: 'Silver', 
      price: `₹${formatNumber(calculateFinalPrice(metalRates.silver.rate))}/10g`, 
      change: getTrendText(metalRates.silver.rate, metalRates.silver.yesterdayRate), 
      icon: <SpaIcon className="text-gray-300" />,
      trendIcon: getTrendIcon(metalRates.silver.rate, metalRates.silver.yesterdayRate)
    }
  ];

  const quickStats = [
    { title: 'Active Loans', value: dashboardDetails.totalActiveLoans, icon: <MoneyIcon className="text-amber-800" /> },
    { title: 'Pending Orders', value: dashboardDetails.totalpendingOrders, icon: <CartIcon className="text-purple-800" /> },
    { title: "Today's Revenue", value: `₹${dashboardDetails.todayRevenue.toLocaleString('en-IN')}`, icon: <WalletIcon className="text-green-800" /> },
    { title: 'New Customers', value: dashboardDetails.newCustomersToday, icon: <TrendingUpIcon className="text-blue-800" /> }
  ];

  const getNotificationIcon = (type) => {
    switch(type) {
      case 'LOAN_EXPIRY': 
      case 'DELIVERY_DUE': 
        return <WarningIcon className="text-orange-500" />;
      case 'NEW_ORDERS': 
        return <InfoIcon className="text-blue-500" />;
      default: 
        return <InfoIcon className="text-blue-500" />;
    }
  };

  return (
    <div className="flex min-h-screen bg-amber-50 p-5 font-serif">
      {/* Main Content */}
      <div className="flex-1 mr-5">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-amber-900 border-b-2 border-amber-400 pb-2">
            <TrendingUpIcon className="align-middle mr-2 text-amber-500" />
            Dashboard
          </h1>
          <div className="flex items-center space-x-2">
            <FormControl size="small" className="min-w-[120px]">
              <InputLabel>Location</InputLabel>
              <Select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                label="Location"
              >
                {cities.map(city => (
                  <MenuItem key={city} value={city}>
                    <LocationIcon fontSize="small" className="mr-1" />
                    {city}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Tooltip title="Refresh prices">
              <IconButton onClick={handleRefresh} disabled={metalLoading}>
                {metalLoading ? <CircularProgress size={24} /> : <RefreshIcon />}
              </IconButton>
            </Tooltip>
          </div>
        </div>

        {/* Market Prices Section */}
        <div className="bg-white rounded-lg shadow-md p-5 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-amber-900">
              <ChartIcon className="align-middle mr-2 text-amber-500" />
              Live Metal Prices ({selectedCity})
            </h2>
            <div className="text-sm text-amber-700 flex items-center">
              <TimeIcon className="text-sm mr-1" />
              Updated: {lastUpdated || '--'}
            </div>
          </div>
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 mb-4">
              <p>{error}</p>
            </div>
          )}
          <div className="flex flex-wrap gap-4 justify-between">
            {marketPrices.map((item, index) => (
              <div key={index} className="flex-1 min-w-[200px] bg-amber-50 border border-amber-100 rounded-md p-4">
                <div className="flex justify-between items-start">
                  <div className="text-3xl mb-2">
                    {item.icon}
                  </div>
                  <div className="flex items-center">
                    {item.trendIcon}
                  </div>
                </div>
                <h3 className="text-lg font-medium text-amber-900">{item.metal}</h3>
                <p className="text-xl font-bold text-amber-900 my-1">{item.price}</p>
                <p className={`text-sm ${item.change.startsWith('↑') ? 'text-green-700' : item.change.startsWith('↓') ? 'text-red-700' : 'text-gray-700'}`}>
                  {item.change}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
          {quickStats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-5 text-center">
              <div className="text-4xl mb-3">
                {stat.icon}
              </div>
              <h3 className="text-2xl font-bold text-amber-900 mb-1">{stat.value}</h3>
              <p className="text-amber-700">{stat.title}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Notifications Panel */}
      <div className="w-80">
        <div className="bg-white rounded-lg shadow-md p-5 h-full">
          <h2 className="text-xl font-semibold text-amber-900 border-b-2 border-amber-400 pb-2 flex items-center">
            <NotificationsIcon className="mr-2 text-amber-500" />
            Alerts
          </h2>
          <div className="mt-5">
            {dashboardDetails.notifications.length > 0 ? (
              dashboardDetails.notifications.map((notification, index) => (
                <div key={index} className="py-3 border-b border-amber-100 flex items-start">
                  <div className="text-xl mr-3">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div>
                    <p className="text-amber-900 font-medium mb-1">{notification.message}</p>
                    <p className="text-amber-700 text-xs flex items-center">
                      <TimeIcon className="text-sm mr-1" />
                      Today
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-amber-700 text-center py-4">No notifications</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;