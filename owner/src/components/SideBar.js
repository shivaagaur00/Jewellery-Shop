import {
  Dashboard as DashboardIcon,
  Inventory as InventoryIcon,
  ShoppingBag as OrdersIcon,
  People as CustomersIcon,
  Receipt as TransactionsIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
} from "@mui/icons-material";
import RealEstateAgentIcon from '@mui/icons-material/RealEstateAgent';
import { useState } from "react";
import { useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';
import MJnoBG from "../assets/MJnoBG.png";
import EditLocationAltIcon from '@mui/icons-material/EditLocationAlt';
const SideBar = ({activeTab,setActiveTab }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: <DashboardIcon /> },
    { id: "inventory", label: "Inventory", icon: <InventoryIcon /> },
    { id: "orders", label: "Orders", icon: <OrdersIcon /> },
    { id: "customers", label: "Customers", icon: <CustomersIcon /> },
    { id: "loan", label: "Loan", icon: <RealEstateAgentIcon /> },
    { id: "transactions", label: "Transactions", icon: <TransactionsIcon /> },
    { id: "update", label: "Update Status", icon: <EditLocationAltIcon /> },
    { id: "settings", label: "Settings", icon: <SettingsIcon /> }, 
  
  ];

  const handleLogout = async () => {
  setIsLoggingOut(true);
  try {
    dispatch(logout());
    setTimeout(() => {
      navigate('/');
    }, 500);
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    setIsLoggingOut(false);
  }
};

  return (
    <div
      className={`bg-gradient-to-b from-gray-900 to-gray-800 text-white h-screen flex flex-col ${
        collapsed ? "w-28" : "w-64"
      } transition-all duration-300 ease-in-out shadow-xl`}
    >
      <div className="p-4 flex items-center justify-between border-b border-gray-700">
        {!collapsed ? (
          <div className="flex flex-col justify-center items-center w-full h-full text-center">
            <img src={MJnoBG} alt="MJ Logo" className="w-20 h-auto mb-2" />
            <h1 className="text-xl font-serif font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-amber-200">
              Jewells
            </h1>
          </div>
        ) : (
          <div className="flex justify-center items-center w-full h-full">
            <img src={MJnoBG} alt="MJ Logo" className="w-12 h-auto" />
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-400 hover:text-amber-300 transition-colors duration-200 p-1 rounded-full hover:bg-gray-700"
        >
          <MenuIcon />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onMouseEnter={() => setHoveredItem(item.id)}
            onMouseLeave={() => setHoveredItem(null)}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center py-3 px-4 mb-1 rounded-lg transition-all duration-200 ${
              activeTab === item.id
                ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg"
                : "text-gray-300 hover:bg-gray-700"
            } ${
              hoveredItem === item.id && activeTab !== item.id
                ? "translate-x-1"
                : ""
            }`}
          >
            <span
              className={`${
                activeTab === item.id ? "text-white" : "text-amber-300"
              }`}
            >
              {item.icon}
            </span>
            {!collapsed && (
              <span className="ml-3 font-medium">{item.label}</span>
            )}
          </button>
        ))}
      </div>

      <div className="p-4 border-t border-gray-700">
        <button
          onMouseEnter={() => setHoveredItem("logout")}
          onMouseLeave={() => setHoveredItem(null)}
          onClick={handleLogout}
          disabled={isLoggingOut}
          className={`w-full flex items-center py-2 px-4 rounded-lg transition-all duration-200 ${
            hoveredItem === "logout" || isLoggingOut
              ? "bg-gray-700 text-white"
              : "text-gray-300"
          } ${isLoggingOut ? "opacity-75 cursor-not-allowed" : ""}`}
        >
          {isLoggingOut ? (
            <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <LogoutIcon
              className={`${
                hoveredItem === "logout" ? "text-red-400" : "text-gray-400"
              }`}
            />
          )}
          {!collapsed && (
            <span className="ml-3 font-medium">
              {isLoggingOut ? "Logging out..." : "Logout"}
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export default SideBar;