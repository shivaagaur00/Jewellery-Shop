import React, { useState } from 'react';
import InventoryContent from './InventoryContent';
import SideBar from './SideBar';
import DashboardContent from './DashboardContent';
import Loan from './Loan';
import  Customers  from './Customers';
import Orders from './Orders';
import Transactions from './Transactions';
import Settings from './Settings';
import DeliveryStatusUpdate from "./DeliveryStatusUpdate";
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
      case 'update':
        return <DeliveryStatusUpdate/>;   
      default:
        return <DashboardContent />;
    }
  };

  return (
    <div className="flex-1 bg-gray-50 overflow-y-auto">
      <div >
        {renderContent()}
      </div>
    </div>
  );
};


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