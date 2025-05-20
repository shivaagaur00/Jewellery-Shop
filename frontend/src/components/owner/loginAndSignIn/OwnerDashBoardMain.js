import React, { useState } from 'react';
import {
  AttachMoney,
  ShoppingCart,
  Schedule,
  Warning,
  TrendingUp,
  Inventory,
  Notifications,
  LocalAtm,
  Diamond,
  CurrencyRupee,
  StarBorder,
  MonetizationOn,
  AccountBalanceWallet,
  Menu,
  People,
  AddShoppingCart,
  SwapHoriz,
  Receipt,
  AddBox,
  Close,
  ChevronLeft,
  ChevronRight
} from '@mui/icons-material';
import { Avatar, Chip, Divider, IconButton } from '@mui/material';

const OwnerDashBoardMain = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const dashboardData = {
    totalLoan: 1850000,
    goldPrice: 6245, // per gram
    silverPrice: 78.3, // per gram
    todaySales: 428500,
    pendingOrders: 12,
    goldStock: 6.2, // kg
    silverStock: 32.8, // kg
    premiumCustomers: 8,
    notifications: [
      {
        id: 1,
        title: 'VIP Customer Visit',
        description: 'Mrs. Sharma (Premium) arriving tomorrow at 11 AM',
        type: 'vip',
        time: '1 hour ago',
        icon: <StarBorder className="text-amber-500" />
      },
      {
        id: 2,
        title: 'Gold Price Alert',
        description: 'Gold price increased by ₹210/gram this week',
        type: 'alert',
        time: '5 hours ago',
        icon: <TrendingUp className="text-amber-400" />
      }
    ],
    recentTransactions: [
      {
        id: 1,
        customer: 'Rajesh Malhotra',
        amount: 285000,
        type: 'sale',
        item: 'Platinum Ring (18g) with diamonds',
        date: 'Today, 11:45 AM',
        premium: true
      },
      {
        id: 2,
        customer: 'Priya Kapoor',
        amount: 127500,
        type: 'sale',
        item: 'Gold Mangalsutra (22g)',
        date: 'Today, 10:30 AM',
        premium: false
      }
    ]
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'vip': return 'bg-gradient-to-r from-amber-100 to-amber-50 border-l-4 border-amber-500';
      case 'alert': return 'bg-gradient-to-r from-red-50 to-amber-50 border-l-4 border-amber-400';
      case 'order': return 'bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-400';
      case 'stock': return 'bg-gradient-to-r from-green-50 to-green-100 border-l-4 border-green-500';
      default: return 'bg-gray-50 border-l-4 border-gray-300';
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    setCollapsed(!collapsed);
  };

  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!mobileSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex">
      {/* Desktop Sidebar */}
      <div className={`bg-white shadow-md p-4 hidden md:block transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'}`}>
        <div className="flex justify-between items-center mb-6">
          {!collapsed && (
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <Diamond className="text-amber-500 mr-2" />
              Royal Jewelers
            </h3>
          )}
          <IconButton onClick={toggleSidebar} size="small" className="text-gray-500">
            {collapsed ? <ChevronRight /> : <ChevronLeft />}
          </IconButton>
        </div>
        
        <nav className="space-y-2">
          <button className={`w-full flex items-center p-3 rounded-lg hover:bg-amber-50 text-amber-700 ${collapsed ? 'justify-center' : 'space-x-2'}`}>
            <LocalAtm className="text-amber-600" />
            {!collapsed && <span>Create Loan</span>}
          </button>
          
          <button className={`w-full flex items-center p-3 rounded-lg hover:bg-blue-50 text-blue-700 ${collapsed ? 'justify-center' : 'space-x-2'}`}>
            <ShoppingCart className="text-blue-600" />
            {!collapsed && <span>Create Sale</span>}
          </button>
          
          <button className={`w-full flex items-center p-3 rounded-lg hover:bg-gray-100 text-gray-700 ${collapsed ? 'justify-center' : 'space-x-2'}`}>
            <People className="text-gray-600" />
            {!collapsed && <span>All Users</span>}
          </button>
          
          <button className={`w-full flex items-center p-3 rounded-lg hover:bg-green-50 text-green-700 ${collapsed ? 'justify-center' : 'space-x-2'}`}>
            <AddShoppingCart className="text-green-600" />
            {!collapsed && <span>Create Order</span>}
          </button>
          
          <button className={`w-full flex items-center p-3 rounded-lg hover:bg-purple-50 text-purple-700 ${collapsed ? 'justify-center' : 'space-x-2'}`}>
            <SwapHoriz className="text-purple-600" />
            {!collapsed && <span>Exchange Metal</span>}
          </button>
          
          <button className={`w-full flex items-center p-3 rounded-lg hover:bg-indigo-50 text-indigo-700 ${collapsed ? 'justify-center' : 'space-x-2'}`}>
            <Receipt className="text-indigo-600" />
            {!collapsed && <span>All Orders</span>}
          </button>
          
          <button className={`w-full flex items-center p-3 rounded-lg hover:bg-red-50 text-red-700 ${collapsed ? 'justify-center' : 'space-x-2'}`}>
            <Receipt className="text-red-600" />
            {!collapsed && <span>All Sales</span>}
          </button>
          
          <button className={`w-full flex items-center p-3 rounded-lg hover:bg-teal-50 text-teal-700 ${collapsed ? 'justify-center' : 'space-x-2'}`}>
            <AddBox className="text-teal-600" />
            {!collapsed && <span>Add Items</span>}
          </button>
        </nav>

        {!collapsed && (
          <div className="mt-8 pt-4 border-t border-gray-200">
            <div className="flex items-center space-x-2 p-2 rounded-lg bg-gray-50">
              <Avatar className="bg-gradient-to-r from-amber-500 to-amber-700">JS</Avatar>
              <div>
                <p className="text-sm font-medium">Jewelry Shop</p>
                <p className="text-xs text-gray-500">Owner</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={toggleMobileSidebar}></div>
      )}

      {/* Mobile Sidebar */}
      <div className={`fixed inset-y-0 left-0 transform ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:hidden z-50 w-64 bg-white shadow-lg transition-transform duration-300`}>
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            <Diamond className="text-amber-500 mr-2" />
            Royal Jewelers
          </h3>
          <IconButton onClick={toggleMobileSidebar} size="small">
            <Close className="text-gray-500" />
          </IconButton>
        </div>
        
        <nav className="p-4 space-y-2">
          <button className="w-full flex items-center space-x-2 p-3 rounded-lg hover:bg-amber-50 text-amber-700">
            <LocalAtm className="text-amber-600" />
            <span>Create Loan</span>
          </button>
          
          <button className="w-full flex items-center space-x-2 p-3 rounded-lg hover:bg-blue-50 text-blue-700">
            <ShoppingCart className="text-blue-600" />
            <span>Create Sale</span>
          </button>
          
          <button className="w-full flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-100 text-gray-700">
            <People className="text-gray-600" />
            <span>All Users</span>
          </button>
          
          <button className="w-full flex items-center space-x-2 p-3 rounded-lg hover:bg-green-50 text-green-700">
            <AddShoppingCart className="text-green-600" />
            <span>Create Order</span>
          </button>
          
          <button className="w-full flex items-center space-x-2 p-3 rounded-lg hover:bg-purple-50 text-purple-700">
            <SwapHoriz className="text-purple-600" />
            <span>Exchange Metal</span>
          </button>
          
          <button className="w-full flex items-center space-x-2 p-3 rounded-lg hover:bg-indigo-50 text-indigo-700">
            <Receipt className="text-indigo-600" />
            <span>All Orders</span>
          </button>
          
          <button className="w-full flex items-center space-x-2 p-3 rounded-lg hover:bg-red-50 text-red-700">
            <Receipt className="text-red-600" />
            <span>All Sales</span>
          </button>
          
          <button className="w-full flex items-center space-x-2 p-3 rounded-lg hover:bg-teal-50 text-teal-700">
            <AddBox className="text-teal-600" />
            <span>Add Items</span>
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-x-hidden">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 bg-white shadow-sm">
          <IconButton onClick={toggleMobileSidebar}>
            <Menu className="text-gray-600" />
          </IconButton>
          <h1 className="text-xl font-bold text-gray-800">Royal Jewelers</h1>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Notifications className="text-gray-600 text-xl cursor-pointer" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">3</span>
            </div>
            <Avatar className="h-8 w-8 bg-gradient-to-r from-amber-500 to-amber-700 text-xs">JS</Avatar>
          </div>
        </div>

        <div className="p-4 md:p-6">
          {/* Desktop Header */}
          <div className="hidden md:flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Royal Jewelers Dashboard</h1>
              <p className="text-gray-500">Welcome back! Here's your business overview</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Notifications className="text-gray-600 text-2xl cursor-pointer" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">3</span>
              </div>
              <Avatar className="bg-gradient-to-r from-amber-500 to-amber-700">JS</Avatar>
            </div>
          </div>

          {/* Rest of your dashboard content remains exactly the same */}
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Sales Card */}
            <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-amber-500 transform hover:scale-[1.02] transition-all duration-200">
              <div className="flex justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Today's Sales</p>
                  <p className="text-2xl font-bold text-gray-800 mt-2">
                    <CurrencyRupee className="inline text-lg" /> 
                    {dashboardData.todaySales.toLocaleString()}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-amber-100">
                  <ShoppingCart className="text-amber-600 text-xl" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-green-500">
                <TrendingUp className="mr-1" />
                <span>12% from yesterday</span>
              </div>
            </div>

            {/* Total Loan Card */}
            <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-blue-500 transform hover:scale-[1.02] transition-all duration-200">
              <div className="flex justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Outstanding Loans</p>
                  <p className="text-2xl font-bold text-gray-800 mt-2">
                    <CurrencyRupee className="inline text-lg" /> 
                    {dashboardData.totalLoan.toLocaleString()}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-blue-100">
                  <AccountBalanceWallet className="text-blue-600 text-xl" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-gray-500">
                <Schedule className="mr-1 text-sm" />
                <span>3 pending repayments</span>
              </div>
            </div>

            {/* Metal Prices Card */}
            <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-amber-300 transform hover:scale-[1.02] transition-all duration-200">
              <div className="flex justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Gold Price</p>
                  <p className="text-2xl font-bold text-gray-800 mt-2">
                    <CurrencyRupee className="inline text-lg" /> 
                    {dashboardData.goldPrice.toLocaleString()}/g
                  </p>
                </div>
                <div className="p-3 rounded-full bg-amber-50">
                  <MonetizationOn className="text-amber-400 text-xl" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-green-500">
                <TrendingUp className="mr-1" />
                <span>₹213 (3.5%) increase</span>
              </div>
            </div>

            {/* Premium Customers Card */}
            <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-purple-500 transform hover:scale-[1.02] transition-all duration-200">
              <div className="flex justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Premium Clients</p>
                  <p className="text-2xl font-bold text-gray-800 mt-2">
                    {dashboardData.premiumCustomers}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-purple-100">
                  <StarBorder className="text-purple-600 text-xl" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-gray-500">
                <Diamond className="mr-1 text-sm" />
                <span>2 new this month</span>
              </div>
            </div>
          </div>

          {/* Transactions and Notifications Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Transactions Section */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-800">Recent Transactions</h2>
                </div>
                <div className="divide-y divide-gray-200">
                  {dashboardData.recentTransactions.map(transaction => (
                    <div key={transaction.id} className="p-4 hover:bg-gray-50 transition-colors duration-150">
                      <div className="flex items-center">
                        <Avatar className={`mr-4 ${transaction.premium ? 'bg-gradient-to-r from-amber-400 to-amber-600' : 'bg-gray-300'}`}>
                          {transaction.premium ? <StarBorder className="text-white" /> : <Diamond className="text-gray-600" />}
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-gray-800">{transaction.customer}</h4>
                              <p className="text-sm text-gray-500">{transaction.item}</p>
                            </div>
                            <div className="text-right">
                              <p className={`font-semibold ${transaction.type === 'bulk' ? 'text-blue-600' : 'text-gray-800'}`}>
                                <CurrencyRupee className="inline text-sm" /> 
                                {transaction.amount.toLocaleString()}
                              </p>
                              <p className="text-xs text-gray-400">{transaction.date}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      {transaction.premium && (
                        <div className="mt-2 flex justify-end">
                          <Chip 
                            label="Premium Client" 
                            size="small" 
                            icon={<StarBorder className="text-amber-500" />}
                            className="bg-amber-50 text-amber-700"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="p-4 bg-gray-50 text-center">
                  <button className="text-amber-600 hover:text-amber-800 text-sm font-medium">
                    View all transactions →
                  </button>
                </div>
              </div>
            </div>

            {/* Notifications & Stock Section */}
            <div className="space-y-6">
              {/* Notifications */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-6 border-b border-gray-200 flex items-center">
                  <Notifications className="text-gray-600 mr-2" />
                  <h2 className="text-xl font-semibold text-gray-800">Alerts & Notifications</h2>
                </div>
                <div className="divide-y divide-gray-200">
                  {dashboardData.notifications.map(notification => (
                    <div key={notification.id} className={`p-4 ${getNotificationColor(notification.type)}`}>
                      <div className="flex items-start">
                        <div className="mr-3 mt-1">
                          {notification.icon}
                        </div>
                        <div>
                          <h4 className="font-medium mb-1">{notification.title}</h4>
                          <p className="text-sm text-gray-600">{notification.description}</p>
                          <p className="text-xs mt-2 text-gray-500 flex items-center">
                            <Schedule className="text-xs mr-1" />
                            {notification.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stock Levels */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Inventory Status</h2>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Gold Stock</span>
                      <span>{dashboardData.goldStock} kg</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-gradient-to-r from-amber-400 to-amber-600 h-2.5 rounded-full" 
                        style={{ width: `${Math.min(100, (dashboardData.goldStock / 10) * 100)}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{(dashboardData.goldStock / 10 * 100).toFixed(0)}% of capacity</p>
                  </div>
                  
                  <Divider />
                  
                  <div>
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Silver Stock</span>
                      <span>{dashboardData.silverStock} kg</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-gradient-to-r from-gray-400 to-gray-600 h-2.5 rounded-full" 
                        style={{ width: `${Math.min(100, (dashboardData.silverStock / 50) * 100)}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{(dashboardData.silverStock / 50 * 100).toFixed(0)}% of capacity</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashBoardMain;