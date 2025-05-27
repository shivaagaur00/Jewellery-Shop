import {
  Dashboard as DashboardIcon,
  Inventory as InventoryIcon,
  ShoppingBag as OrdersIcon,
  People as CustomersIcon,
  Receipt as TransactionsIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
  Diamond,
} from "@mui/icons-material";
import RealEstateAgentIcon from '@mui/icons-material/RealEstateAgent';
import { useState } from "react";
import MJnoBG from "../assets/MJnoBG.png";

const SideBar = ({ activeTab, setActiveTab }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: <DashboardIcon /> },
    { id: "inventory", label: "Inventory", icon: <InventoryIcon /> },
    { id: "orders", label: "Orders", icon: <OrdersIcon /> },
    { id: "customers", label: "Customers", icon: <CustomersIcon /> },
    { id: "loan", label: "Loan", icon: <RealEstateAgentIcon /> },
    { id: "transactions", label: "Transactions", icon: <TransactionsIcon /> },
    { id: "settings", label: "Settings", icon: <SettingsIcon /> },
  ];

  return (
    <div
      className={`bg-gradient-to-b from-gray-900 to-gray-800 text-white h-screen flex flex-col ${
        collapsed ? "w-28" : "w-64"
      } transition-all duration-300 ease-in-out shadow-xl`}
    >
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-gray-700">
        {!collapsed ? (
          <div className="flex flex-col justify-center items-center w-full h-full text-center">
            <img src={MJnoBG} alt="MJ Logo" className="w-20 h-auto mb-2" />
            <h1 className="text-xl font-serif font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-amber-200">
              Luxe Jewels
            </h1>
          </div>
        ) : (
          <div className="flex justify-center items-center w-full h-full">
            <img src={MJnoBG} alt="MJ Logo" />
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-400 hover:text-amber-300 transition-colors duration-200 p-1 rounded-full hover:bg-gray-700"
        >
          <MenuIcon />
        </button>
      </div>

      {/* Menu Items */}
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

      {/* Footer */}
      <div className="p-4 border-t border-gray-700">
        <button
          onMouseEnter={() => setHoveredItem("logout")}
          onMouseLeave={() => setHoveredItem(null)}
          onClick={() => console.log("Logout")}
          className={`w-full flex items-center py-2 px-4 rounded-lg transition-all duration-200 ${
            hoveredItem === "logout"
              ? "bg-gray-700 text-white"
              : "text-gray-300"
          }`}
        >
          <LogoutIcon
            className={`${
              hoveredItem === "logout" ? "text-red-400" : "text-gray-400"
            }`}
          />
          {!collapsed && (
            <span className="ml-3 font-medium">
              {hoveredItem === "logout" ? "Logging out..." : "Logout"}
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export default SideBar;
