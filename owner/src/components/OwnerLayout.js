import React, { useState } from 'react';
import InventoryContent from './InventoryContent';
import SideBar from './SideBar';
import DashboardContent from './DashboardContent';
import Loan from './Loan';
import  Customers  from './Customers';
import Orders from './Orders';
import Transactions from './Transactions';
import Settings from './Settings';
const MainHome = ({ activeTab }) => {
  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard':
        return <DashboardContent />;
      case 'inventory':
        return <InventoryContent />;
      case 'orders':
        return <Orders />;
      case 'customers':
        return <Customers />;
      case 'transactions':
        return <Transactions />;
      case 'settings':
        return <Settings/>;
      case 'loan':
        return <Loan/>;
      default:
        return <DashboardContent />;
    }
  };

  return (
    <div className="flex-1 bg-gray-50 overflow-y-auto">
      <div className="p-1">
        {renderContent()}
      </div>
    </div>
  );
};

const CustomersContent = () => (
  <div className="bg-white rounded-xl shadow p-6">
    <p>Customers management content will appear here</p>
  </div>
);

// const TransactionsContent = () => (
//   <div className="bg-white rounded-xl shadow p-6">
//     <p>Transactions content will appear here</p>
//   </div>
// );

const SettingsContent = () => (
  <div className="bg-white rounded-xl shadow p-6">
    <p>Settings content will appear here</p>
  </div>
);

const OwnerLayout = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="flex h-screen bg-gray-100">
      <SideBar activeTab={activeTab} setActiveTab={setActiveTab} />
      <MainHome activeTab={activeTab} />
    </div>
  );
};

export default OwnerLayout;