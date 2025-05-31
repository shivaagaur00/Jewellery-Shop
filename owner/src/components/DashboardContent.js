import React, { useEffect, useState } from 'react';
import {
  Notifications as NotificationsIcon,
  LocalShipping as ShippingIcon,
  Payment as PaymentIcon,
  AccountBalanceWallet as WalletIcon,
  AttachMoney as MoneyIcon,
  TrendingUp as TrendingUpIcon,
  ShowChart as ChartIcon,
  AccessTime as TimeIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon,
  Diamond as DiamondIcon,
  Watch as WatchIcon,
  ShoppingCart as CartIcon,
  Spa as SpaIcon 
} from '@mui/icons-material';
import { getDashBoard } from '../api/owners';

const DashboardContent = () => {
  const [details, setDetails] = useState({
    gold: 0,
    silver: 0,
    platinum: 0,
    totalActiveLoans: 0,
    totalpendingOrders: 0,
    todayRevenue: 0,
    newCustomersToday: 0,
    notifications: []
  });

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await getDashBoard();
        setDetails(res.data.data);
        console.log(res);
      } catch (error) {
        console.error(error);
      }
    };
    fetchDetails();
  }, []);

  // Market prices - using SpaIcon for silver instead of RingIcon
  const marketPrices = [
    { metal: '24K Gold', price: `₹${details.gold}/g`, change: '+1.2%', icon: <DiamondIcon className="text-yellow-500" /> },
    { metal: 'Silver', price: `₹${details.silver}/g`, change: '+0.8%', icon: <SpaIcon className="text-gray-300" /> },
    { metal: 'Platinum', price: `₹${details.platinum}/g`, change: '-0.4%', icon: <WatchIcon className="text-gray-200" /> }
  ];

  // Quick stats
  const quickStats = [
    { title: 'Active Loans', value: details.totalActiveLoans, icon: <MoneyIcon className="text-amber-800" /> },
    { title: 'Pending Orders', value: details.totalpendingOrders, icon: <CartIcon className="text-purple-800" /> },
    { title: 'Today\'s Revenue', value: `₹${details.todayRevenue}`, icon: <WalletIcon className="text-green-800" /> },
    { title: 'New Customers', value: details.newCustomersToday, icon: <TrendingUpIcon className="text-blue-800" /> }
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
        <h1 className="text-3xl font-bold text-amber-900 border-b-2 border-amber-400 pb-2 mb-6">
          <TrendingUpIcon className="align-middle mr-2 text-amber-500" />
          Dashboard
        </h1>

        {/* Market Prices Section */}
        <div className="bg-white rounded-lg shadow-md p-5 mb-6">
          <h2 className="text-xl font-semibold text-amber-900 mb-4">
            <ChartIcon className="align-middle mr-2 text-amber-500" />
            Live Metal Prices
          </h2>
          <div className="flex flex-wrap gap-4 justify-between">
            {marketPrices.map((item, index) => (
              <div key={index} className="flex-1 min-w-[150px] bg-amber-50 border border-amber-100 rounded-md p-4 text-center">
                <div className="text-3xl mb-2">
                  {item.icon}
                </div>
                <h3 className="text-lg font-medium text-amber-900">{item.metal}</h3>
                <p className="text-xl font-bold text-amber-900 my-1">{item.price}</p>
                <p className={`text-sm ${item.change.startsWith('+') ? 'text-green-700' : 'text-red-700'}`}>
                  {item.change}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
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

      {/* Notifications Sidebar */}
      <div className="w-80">
        <div className="bg-white rounded-lg shadow-md p-5 h-full">
          <h2 className="text-xl font-semibold text-amber-900 border-b-2 border-amber-400 pb-2 flex items-center">
            <NotificationsIcon className="mr-2 text-amber-500" />
            Alerts
          </h2>
          <div className="mt-5">
            {details.notifications.length > 0 ? (
              details.notifications.map((notification, index) => (
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