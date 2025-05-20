import { 
  Dashboard as DashboardIcon,
  Inventory as InventoryIcon,
  ShoppingBag as OrdersIcon,
  People as CustomersIcon,
  Receipt as TransactionsIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
  Diamond 
} from '@mui/icons-material';
import react,{useState} from "react";
const SideBar = ({ activeTab, setActiveTab }) => {
  const [collapsed, setCollapsed] = useState(false);
  
  const menuItems = [
      { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
      
      { id: 'inventory', label: 'Inventory', icon: <InventoryIcon /> },
      { id: 'orders', label: 'Orders', icon: <OrdersIcon /> },
      { id: 'customers', label: 'Customers', icon: <CustomersIcon /> },
      { id: 'loan', label: 'Loan', icon: <CustomersIcon /> },
      { id: 'transactions', label: 'Transactions', icon: <TransactionsIcon /> },
      { id: 'settings', label: 'Settings', icon: <SettingsIcon /> },
  ];

  return (
      <div className={`bg-gray-900 text-white h-screen flex flex-col ${collapsed ? 'w-20' : 'w-64'} transition-all duration-300`}>
      <div className="p-4 flex items-center justify-between border-b border-gray-700">
        {!collapsed && (
            <div className="flex items-center">
            <Diamond className="text-amber-400 mr-2" />
            <h1 className="text-xl font-serif font-bold">Luxe Jewels</h1>
          </div>
        )}
        {collapsed && (
            <div className="flex justify-center w-full">
            <Diamond className="text-amber-400" />
          </div>
        )}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-400 hover:text-white"
          >
          <MenuIcon />
        </button>
      </div>
      <div>
      </div>
      <div className="flex-1 overflow-y-auto py-4">
        {menuItems.map((item) => (
            <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center py-3 px-4 ${activeTab === item.id ? 'bg-amber-500 text-white' : 'text-gray-300 hover:bg-gray-800'}`}
          >
            <span className="mr-3">{item.icon}</span>
            {!collapsed && <span>{item.label}</span>}
          </button>
        ))}
      </div>
      <div className="p-4 border-t border-gray-700">
        <button 
          onClick={() => console.log('Logout')}
          className="w-full flex items-center text-gray-300 hover:text-white py-2 px-4 rounded"
          >
          <LogoutIcon className="mr-3" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default SideBar