import React, { useState, useEffect } from "react";
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Inventory as InventoryIcon,
  Diamond as GemIcon,
  Category as CategoryIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import BalanceIcon from "@mui/icons-material/Balance";
import DiamondIcon from "@mui/icons-material/Diamond";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import ErrorIcon from '@mui/icons-material/Error';
import FilterListAltIcon from "@mui/icons-material/FilterListAlt";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import {
  addItem,
  getItems,
  updateItem,
  deleteItem,
  addSale,
} from "../api/owners";
import axios from "axios";
const InventoryContent = () => {
  const [inventory, setInventory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [error, setError] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    ID: "",
    metalType: "",
    itemName: "",
    weight: 0,
    itemPurity: "24K",
    metalPrice: "",
    quantity: 0,
    tags: [],
    category: "",
    date: new Date().toISOString().split("T")[0],
    image: "",
  });
  const [showSaleModal, setShowSaleModal] = useState(false);
  const [sale, setSale] = useState({
    isExistingCustomer: false,
    customerID: "",
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    orderType: "Full Payment",
    depositeAmount: 0,
    amountPayingNow: 0,
    totalPayable: 0,
    pendingAmount: 0,
    date: new Date().toISOString().split("T")[0],
    discount: 0,
    makingCharges: 0,
    paymentMethod: "",
    taxes: 0,
    notes: "",
  });
  const getStockStatus = (quantity) => {
    if (quantity <= 0) return "Out of Stock";
    if (quantity <= 2) return "Low Stock";
    return "In Stock";
  };
  useEffect(() => {
    fetchInventory();
  }, []);
  const fetchInventory = async () => {
    try {
      const res = await getItems();
      if (res.status === 200) {
        setInventory(res.data.data);
        // console.log(inventory);
      } else {
        setError(res.message || "Failed to fetch inventory");
      }
    } catch (err) {
      setError("An error occurred while fetching inventory");
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  useEffect(() => {
    if (currentItem) {
      const total =
        Number(currentItem.metalPrice) +
        Number(sale.makingCharges || 0) +
        Number(sale.taxes || 0) -
        Number(sale.discount || 0);

      setSale((prev) => ({
        ...prev,
        totalPayable: total,
        pendingAmount:
          sale.orderType === "Partial Payment"
            ? total - Number(sale.amountPayingNow || 0)
            : 0,
      }));
    }
  }, [
    sale.orderType,
    sale.amountPayingNow,
    sale.makingCharges,
    sale.taxes,
    sale.discount,
    currentItem,
  ]);
  const handleSaleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!sale.paymentMethod) {
      setError("Please select a payment method");
      return;
    }
    if (sale.orderType === "Partial Payment" && !sale.amountPayingNow) {
      setError("Please enter amount paying now for partial payment");
      return;
    }
    if (!sale.isExistingCustomer && !sale.customerName) {
      setError("Please enter customer name");
      return;
    }
    try {
      const totalPayable =
        Number(currentItem.metalPrice) +
        Number(sale.makingCharges || 0) +
        Number(sale.taxes || 0) -
        Number(sale.discount || 0);
      const saleData = {
        ...sale,
        itemID: currentItem.ID,
        totalPayable: totalPayable,
        amountPayingNow: Number(sale.amountPayingNow || totalPayable),
        pendingAmount:
          sale.orderType === "Partial Payment"
            ? totalPayable - Number(sale.amountPayingNow)
            : 0,
        metalPrice: currentItem.metalPrice,
        weight: currentItem.weight,
        itemPurity: currentItem.itemPurity,
      };

      const res = await addSale({ data: saleData });
      if (res.status === 200) {
        setShowSaleModal(false);
        // Reset form or show success message
      } else {
        setError(res.message || "Failed to record sale");
      }
    } catch (err) {
      setError("An error occurred while recording the sale");
      console.error(err);
    }
  };
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const cloudinaryFormData = new FormData();
      cloudinaryFormData.append("file", file);
      cloudinaryFormData.append("upload_preset", "ml_default");

      const cloudinaryResponse = await axios.post(
        "https://api.cloudinary.com/v1_1/dthriaot4/image/upload",
        cloudinaryFormData
      );
      // console.log(cloudinaryResponse.data.secure_url);
      setFormData((prev) => ({
        ...prev,
        image: cloudinaryResponse.data.secure_url,
      }));
      setIsUploading(false);
    } catch (err) {
      setError("Failed to upload image");
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (
      !formData.itemName ||
      !formData.category ||
      !formData.weight ||
      !formData.itemPurity ||
      !formData.metalPrice ||
      formData.quantity === undefined
    ) {
      setError("Please enter all required details");
      return;
    }

    try {
      const itemData = {
        ...formData,
        quantity: Number(formData.quantity),
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag),
      };

      let res;
      // console.log(itemData);
      if (currentItem) {
        res = await updateItem({ id: currentItem._id, updateData: itemData });
      } else {
        res = await addItem(itemData);
      }

      if (res.status !== 201) {
        setError(res.message || "Operation failed");
        // console.log(res);
      } else {
        setShowForm(false);
        fetchInventory();
      }
    } catch (err) {
      setError("An error occurred while saving the item");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        const res = await deleteItem({ id: id });
        if (res.status === 200) {
          fetchInventory(); // Refresh the inventory
        } else {
          setError(res.message || "Failed to delete item");
        }
      } catch (err) {
        setError("An error occurred while deleting the item");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      ID: "",
      metalType: "",
      itemName: "",
      weight: 0,
      itemPurity: "24K",
      metalPrice: "",
      quantity: 0,
      tags: [],
      category: "",
      date: new Date().toISOString().split("T")[0],
      image: "",
    });
    setCurrentItem(null);
    setError("");
  };
  const [filters, setFilters] = useState({
    minPrice: "",
    maxPrice: "",
    minWeight: "",
    maxWeight: "",
    purity: "",
    category: "",
    metalType: "",
  });
  const filteredInventory = inventory.filter((item) => {
    const searchTermLower = searchTerm.toLowerCase();
    const matchesSearch =
      item.itemName.toLowerCase().includes(searchTermLower) ||
      item.category.toLowerCase().includes(searchTermLower) ||
      item.ID.toLowerCase().includes(searchTermLower) ||
      item.metalType?.toLowerCase().includes(searchTermLower) ||
      item.itemPurity.toLowerCase().includes(searchTermLower) ||
      item.tags?.some((tag) => tag.toLowerCase().includes(searchTermLower)) ||
      item.metalPrice.toString().includes(searchTerm);

    const matchesFilters =
      (!filters.minPrice || item.metalPrice >= Number(filters.minPrice)) &&
      (!filters.maxPrice || item.metalPrice <= Number(filters.maxPrice)) &&
      (!filters.minWeight || item.weight >= Number(filters.minWeight)) &&
      (!filters.maxWeight || item.weight <= Number(filters.maxWeight)) &&
      (!filters.purity || item.itemPurity === filters.purity) &&
      (!filters.category || item.category === filters.category) &&
      (!filters.metalType ||
        item.metalType?.toLowerCase() === filters.metalType.toLowerCase());

    const stockStatus = getStockStatus(item.quantity);

    if (activeTab === "all") return matchesSearch && matchesFilters;
    if (activeTab === "low")
      return matchesSearch && matchesFilters && stockStatus === "Low Stock";
    if (activeTab === "out")
      return matchesSearch && matchesFilters && stockStatus === "Out of Stock";
    return matchesSearch && matchesFilters;
  });
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="min-h-screen bg-gray-50">
  <header className="bg-gradient-to-b from-yellow-700 to-yellow-600 shadow-lg mb-2">
    <div className="max-w-7xl mx-auto px-6 py-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center">
          <div className="bg-yellow-500/20 p-3 rounded-xl backdrop-blur-sm border border-yellow-400/30">
            <InventoryIcon className="text-white text-2xl" />
          </div>
          <div className="ml-4">
            <h1 className="text-2xl font-bold text-white tracking-tight font-serif">
              LuxeGold Inventory
            </h1>
            <p className="text-yellow-100/90 text-sm mt-1 font-light">
              Managing precious assets with excellence
            </p>
          </div>
        </div>
        
        <button
          className="bg-white/90 hover:bg-white text-yellow-800 px-6 py-3 rounded-xl flex items-center transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 font-medium group"
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
        >
          <div className="bg-yellow-600/20 p-1.5 rounded-lg mr-3 group-hover:bg-yellow-600/30 transition-colors">
            <AddIcon className="text-yellow-700" />
          </div>
          <span>Add New Jewelry</span>
        </button>
      </div>
    </div>
  </header>

  <main className="max-w-7xl mx-auto px-6 py-6 -mt-6">
    <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">
      <div className="p-6 bg-gradient-to-r from-yellow-50 to-amber-50 border-b border-yellow-100">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="text-yellow-600" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-4 py-2.5 border border-yellow-200 rounded-xl bg-white/80 shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-300 text-gray-700 placeholder-yellow-600/60"
              placeholder="Search jewelry items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Premium Tabs */}
          <div className="flex gap-2 bg-white/80 p-1 rounded-xl border border-yellow-100 shadow-inner">
            <button
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === "all"
                  ? "bg-yellow-600 text-white shadow-md"
                  : "text-gray-600 hover:bg-yellow-100/50"
              }`}
              onClick={() => setActiveTab("all")}
            >
              All Items
            </button>
            <button
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === "low"
                  ? "bg-yellow-600 text-white shadow-md"
                  : "text-gray-600 hover:bg-yellow-100/50"
              }`}
              onClick={() => setActiveTab("low")}
            >
              Low Stock
            </button>
            <button
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === "out"
                  ? "bg-yellow-600 text-white shadow-md"
                  : "text-gray-600 hover:bg-yellow-100/50"
              }`}
              onClick={() => setActiveTab("out")}
            >
              Out of Stock
            </button>
            <button
              className="px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-yellow-100/50 flex items-center transition-all"
              onClick={() => setShowFilters(!showFilters)}
            >
              <FilterListAltIcon className="mr-1.5 text-yellow-600" />
              Filters
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="mt-4 bg-white rounded-lg shadow-lg border border-yellow-100 overflow-hidden">
            <div className="p-5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                  <FilterListAltIcon className="mr-2 text-yellow-600" />
                  Refine Your Collection
                </h3>
                <button
                  className="text-sm text-yellow-700 hover:text-yellow-900 flex items-center font-medium"
                  onClick={() =>
                    setFilters({
                      minPrice: "",
                      maxPrice: "",
                      minWeight: "",
                      maxWeight: "",
                      purity: "",
                      category: "",
                      metalType: "",
                    })
                  }
                >
                  <RestartAltIcon className="mr-1.5" fontSize="small" />
                  Reset All
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {/* Price Filter */}
                <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-100">
                  <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <CurrencyRupeeIcon className="mr-2 text-yellow-600" />
                    Price Range (₹)
                  </label>
                  <div className="flex gap-3 items-center">
                    <input
                      type="number"
                      placeholder="Min"
                      className="w-full px-3 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-300 focus:border-amber-300 bg-white/70"
                      value={filters.minPrice}
                      onChange={(e) =>
                        setFilters({ ...filters, minPrice: e.target.value })
                      }
                    />
                    <span className="text-gray-400">—</span>
                    <input
                      type="number"
                      placeholder="Max"
                      className="w-full px-3 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-300 focus:border-amber-300 bg-white/70"
                      value={filters.maxPrice}
                      onChange={(e) =>
                        setFilters({ ...filters, maxPrice: e.target.value })
                      }
                    />
                  </div>
                </div>

                {/* Weight Filter */}
                <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-100">
                  <label className=" text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <BalanceIcon className="mr-2 text-yellow-600" />
                    Weight (grams)
                  </label>
                  <div className="flex gap-3 items-center">
                    <input
                      type="number"
                      placeholder="Min"
                      className="w-full px-3 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-300 focus:border-amber-300 bg-white/70"
                      value={filters.minWeight}
                      onChange={(e) =>
                        setFilters({ ...filters, minWeight: e.target.value })
                      }
                    />
                    <span className="text-gray-400">—</span>
                    <input
                      type="number"
                      placeholder="Max"
                      className="w-full px-3 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-300 focus:border-amber-300 bg-white/70"
                      value={filters.maxWeight}
                      onChange={(e) =>
                        setFilters({ ...filters, maxWeight: e.target.value })
                      }
                    />
                  </div>
                </div>

                {/* Purity Filter */}
                <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-100">
                  <label className=" text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <DiamondIcon className="mr-2 text-yellow-600" />
                    Gold Purity
                  </label>
                  <select
                    className="block w-full px-3 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-300 focus:border-amber-300 bg-white/70"
                    value={filters.purity}
                    onChange={(e) =>
                      setFilters({ ...filters, purity: e.target.value })
                    }
                  >
                    <option value="">All Purity</option>
                    <option value="24K">24K (Pure Gold)</option>
                    <option value="22K">22K (91.6%)</option>
                    <option value="18K">18K (75%)</option>
                    <option value="14K">14K (58.3%)</option>
                  </select>
                </div>

                <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-100">
                  <label className=" text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <CategoryIcon className="mr-2 text-yellow-600" />
                    Jewelry Type
                  </label>
                  <select
                    className="block w-full px-3 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-300 focus:border-amber-300 bg-white/70"
                    value={filters.category}
                    onChange={(e) =>
                      setFilters({ ...filters, category: e.target.value })
                    }
                  >
                    <option value="">All Types</option>
                    <option value="Necklace">Necklace</option>
                    <option value="Ring">Ring</option>
                    <option value="Bracelet">Bracelet</option>
                    <option value="Earrings">Earrings</option>
                    <option value="Bangle">Bangle</option>
                    <option value="Chain">Chain</option>
                  </select>
                </div>

                <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-100">
                  <label className=" text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <GemIcon className="mr-2 text-yellow-600" />
                    Metal Type
                  </label>
                  <select
                    className="block w-full px-3 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-300 focus:border-amber-300 bg-white/70"
                    value={filters.metalType}
                    onChange={(e) =>
                      setFilters({ ...filters, metalType: e.target.value })
                    }
                  >
                    <option value="">All Metals</option>
                    <option value="Gold">Gold</option>
                    <option value="Silver">Silver</option>
                    <option value="Platinum">Platinum</option>
                    <option value="Diamond">Diamond</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 md:hidden">
                <button
                  className="w-full py-3 px-4 bg-yellow-600 hover:bg-yellow-700 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all"
                  onClick={() => setShowFilters(false)}
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="mx-6 mt-6">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg shadow-sm">
            <div className="flex items-center">
              <ErrorIcon className="text-red-500 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="text-sm text-red-600 mt-1">{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="p-6">
        {filteredInventory.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredInventory.map((item) => {
              const stockStatus = getStockStatus(item.quantity);
              const statusColor =
                stockStatus === "In Stock"
                  ? "bg-green-100 text-green-800"
                  : stockStatus === "Low Stock"
                  ? "bg-amber-100 text-amber-800"
                  : "bg-red-100 text-red-800";

              return (
                <div
                  key={item._id}
                  className="group bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="relative bg-gradient-to-br from-amber-50 to-yellow-50 flex items-center justify-center p-6 border-b border-amber-100">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.itemName}
                        className="w-full h-48 object-contain object-center transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-48 flex items-center justify-center text-yellow-200">
                        <GemIcon className="w-16 h-16" />
                      </div>
                    )}
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                      {item.tags?.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-black/70 text-white"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="absolute top-3 right-3">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusColor}`}
                      >
                        {stockStatus}
                      </span>
                    </div>
                  </div>

                  {/* Jewelry Details */}
                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
                      {item.itemName}
                    </h3>
                    <p className="text-sm text-gray-500 mb-3">{item.category}</p>

                    <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                      <div>
                        <p className="text-gray-500">Weight</p>
                        <p className="font-medium">{item.weight}g</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Purity</p>
                        <p className="font-medium">{item.itemPurity}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Qty</p>
                        <p className="font-medium">{item.quantity}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Metal</p>
                        <p className="font-medium">{item.metalType || "-"}</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                      <div>
                        <p className="text-xs text-gray-400">Price</p>
                        <p className="text-xl font-bold text-yellow-600">
                          ₹{item.metalPrice.toLocaleString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setCurrentItem(item);
                            setFormData({
                              ...item,
                              tags: item.tags?.join(", ") || "",
                              date: item.date.split("T")[0],
                            });
                            setShowForm(true);
                          }}
                          className="p-2 text-gray-500 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <EditIcon className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <DeleteIcon className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => {
                            setCurrentItem(item);
                            setShowSaleModal(true);
                            setSale({
                              ...sale,
                              itemName: item.itemName,
                              itemID: item.ID,
                              weight: item.weight,
                              itemPurity: item.itemPurity,
                              metalPrice: item.metalPrice,
                              metalType: item.metalType,
                              date: new Date().toISOString().split("T")[0],
                              isExistingCustomer: false,
                              customerID: "",
                              customerName: "",
                              customerPhone: "",
                              customerEmail: "",
                              orderType: "Full Payment",
                              depositeAmount: 0,
                              totalPayble: 0,
                              pendingAmount: 0,
                              discount: 0,
                              makingCharges: 0,
                              paymentMethod: "",
                              taxes: 0,
                              notes: "",
                            });
                          }}
                          className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Sell"
                        >
                          <PointOfSaleIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl border-2 border-dashed border-amber-200">
            <GemIcon className="w-20 h-20 text-yellow-300 mb-4" />
            <h3 className="text-xl font-medium text-gray-700 mb-2">
              No Jewelry Found
            </h3>
            <p className="text-gray-500 text-center max-w-md">
              Your inventory is empty or no items match your search. Add new
              jewelry pieces to showcase your collection.
            </p>
            <button
              className="mt-6 bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-2.5 rounded-lg font-medium shadow-md hover:shadow-lg transition-all"
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
            >
              <AddIcon className="mr-2" />
              Add First Item
            </button>
          </div>
        )}
      </div>
    </div>
  </main>
</div>
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-yellow-700">
                  {currentItem ? "Edit Gold Item" : "Add New Gold Item"}
                </h2>
                <button
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                >
                  <CloseIcon />
                </button>
              </div>

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                  <span className="block sm:inline">{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        ID <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="ID"
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                        value={formData.ID}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Item Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="itemName"
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                        value={formData.itemName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="category"
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                        value={formData.category}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select Category</option>
                        <option value="Necklace">Necklace</option>
                        <option value="Ring">Ring</option>
                        <option value="Bracelet">Bracelet</option>
                        <option value="Earrings">Earrings</option>
                        <option value="Bangle">Bangle</option>
                        <option value="Chain">Chain</option>
                      </select>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tags (comma separated)
                      </label>
                      <input
                        type="text"
                        name="tags"
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                        value={formData.tags}
                        onChange={handleInputChange}
                        placeholder="wedding, festival, etc."
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Item Image
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                        onChange={handleImageUpload}
                        disabled={isUploading}
                      />
                      {isUploading && (
                        <p className="text-sm text-gray-500 mt-1">
                          Uploading image...
                        </p>
                      )}
                      {formData.image && (
                        <div className="mt-2">
                          <img
                            src={formData.image}
                            alt="Preview"
                            className="h-20 w-20 object-cover rounded"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column */}
                  <div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Weight (grams) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          name="weight"
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                          value={formData.weight}
                          onChange={handleInputChange}
                          required
                          step="0.1"
                          min="0"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Purity <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="itemPurity"
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                          value={formData.itemPurity}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="24K">24K</option>
                          <option value="22K">22K</option>
                          <option value="18K">18K</option>
                          <option value="14K">14K</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Price (₹) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          name="metalPrice"
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                          value={formData.metalPrice}
                          onChange={handleInputChange}
                          required
                          min="0"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Quantity <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          name="quantity"
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                          value={formData.quantity}
                          onChange={handleInputChange}
                          required
                          min="0"
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Metal Type
                      </label>
                      <input
                        type="text"
                        name="metalType"
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                        value={formData.metalType}
                        onChange={handleInputChange}
                        placeholder="Gold, Silver, Platinum, etc."
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date
                      </label>
                      <input
                        type="date"
                        name="date"
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                        value={formData.date}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    onClick={() => {
                      setShowForm(false);
                      resetForm();
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg"
                    disabled={isUploading}
                  >
                    {isUploading
                      ? "Uploading..."
                      : currentItem
                      ? "Update Item"
                      : "Add Item"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {showSaleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4 border-b pb-4">
                <div className="flex items-center">
                  <PointOfSaleIcon className="text-green-600 mr-2" />
                  <h2 className="text-2xl font-bold text-green-700">
                    Sell Jewelry Item
                  </h2>
                </div>
                <button
                  className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                  onClick={() => {
                    setShowSaleModal(false);
                    setSale({
                      isExistingCustomer: false,
                      customerID: "",
                      customerName: "",
                      customerPhone: "",
                      customerEmail: "",
                      orderType: "Full Payment",
                      depositeAmount: 0,
                      amountPayingNow: 0,
                      totalPayable: 0,
                      pendingAmount: 0,
                      date: new Date().toISOString().split("T")[0],
                      discount: 0,
                      makingCharges: 0,
                      paymentMethod: "",
                      taxes: 0,
                      notes: "",
                    });
                  }}
                >
                  <CloseIcon />
                </button>
              </div>

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                  <span className="block sm:inline">{error}</span>
                </div>
              )}
              <form onSubmit={handleSaleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Customer Information */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2 text-green-600"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Customer Details
                    </h3>

                    <div className="mb-4">
                      <label className="flex items-center cursor-pointer">
                        <div className="relative">
                          <input
                            type="checkbox"
                            className="sr-only"
                            checked={sale.isExistingCustomer}
                            onChange={(e) =>
                              setSale({
                                ...sale,
                                isExistingCustomer: e.target.checked,
                              })
                            }
                          />
                          <div
                            className={`block w-10 h-6 rounded-full ${
                              sale.isExistingCustomer
                                ? "bg-green-400"
                                : "bg-gray-400"
                            }`}
                          ></div>
                          <div
                            className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition ${
                              sale.isExistingCustomer
                                ? "transform translate-x-4"
                                : ""
                            }`}
                          ></div>
                        </div>
                        <div className="ml-3 text-sm font-medium text-gray-700">
                          Existing Customer
                        </div>
                      </label>
                    </div>

                    {sale.isExistingCustomer ? (
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Customer ID <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="customerID"
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          value={sale.customerID}
                          onChange={(e) =>
                            setSale({ ...sale, customerID: e.target.value })
                          }
                          required
                        />
                      </div>
                    ) : (
                      <>
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Customer Name{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="customerName"
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            value={sale.customerName}
                            onChange={(e) =>
                              setSale({ ...sale, customerName: e.target.value })
                            }
                            required
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Phone Number{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="tel"
                              name="customerPhone"
                              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                              value={sale.customerPhone}
                              onChange={(e) =>
                                setSale({
                                  ...sale,
                                  customerPhone: e.target.value,
                                })
                              }
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Email
                            </label>
                            <input
                              type="email"
                              name="customerEmail"
                              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                              value={sale.customerEmail}
                              onChange={(e) =>
                                setSale({
                                  ...sale,
                                  customerEmail: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                      </>
                    )}

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Order Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="orderType"
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        value={sale.orderType}
                        onChange={(e) =>
                          setSale({ ...sale, orderType: e.target.value })
                        }
                        required
                      >
                        <option value="Full Payment">Full Payment</option>
                        <option value="Partial Payment">Partial Payment</option>
                      </select>
                    </div>
                  </div>

                  {/* Item Information */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <GemIcon className="text-yellow-600 mr-2" />
                      Item Details
                    </h3>

                    <div className="mb-4 grid grid-cols-2 gap-4">
                      <div className="bg-white p-3 rounded-lg border">
                        <p className="text-xs text-gray-500">Item ID</p>
                        <p className="font-medium">{currentItem?.ID || "-"}</p>
                      </div>
                      <div className="bg-white p-3 rounded-lg border">
                        <p className="text-xs text-gray-500">Category</p>
                        <p className="font-medium">
                          {currentItem?.category || "-"}
                        </p>
                      </div>
                    </div>

                    <div className="mb-4 grid grid-cols-3 gap-4">
                      <div className="bg-white p-3 rounded-lg border">
                        <p className="text-xs text-gray-500">Weight</p>
                        <p className="font-medium">{currentItem?.weight}g</p>
                      </div>
                      <div className="bg-white p-3 rounded-lg border">
                        <p className="text-xs text-gray-500">Purity</p>
                        <p className="font-medium">{currentItem?.itemPurity}</p>
                      </div>
                      <div className="bg-white p-3 rounded-lg border">
                        <p className="text-xs text-gray-500">Price</p>
                        <p className="font-medium">
                          ₹{currentItem?.metalPrice?.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {currentItem?.image && (
                      <div className="mb-4 flex justify-center">
                        <img
                          src={currentItem.image}
                          alt={currentItem.itemName}
                          className="h-24 w-24 object-contain rounded border"
                        />
                      </div>
                    )}
                  </div>

                  {/* Payment Information */}
                  <div className="md:col-span-2 bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2 text-green-600"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Payment Details
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Making Charges (₹)
                        </label>
                        <input
                          type="number"
                          name="makingCharges"
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          value={sale.makingCharges}
                          onChange={(e) =>
                            setSale({ ...sale, makingCharges: e.target.value })
                          }
                          min="0"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Discount (₹)
                        </label>
                        <input
                          type="number"
                          name="discount"
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          value={sale.discount}
                          onChange={(e) =>
                            setSale({ ...sale, discount: e.target.value })
                          }
                          min="0"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Taxes (₹)
                        </label>
                        <input
                          type="number"
                          name="taxes"
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          value={sale.taxes}
                          onChange={(e) =>
                            setSale({ ...sale, taxes: e.target.value })
                          }
                          min="0"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Payment Method <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="paymentMethod"
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          value={sale.paymentMethod}
                          onChange={(e) =>
                            setSale({ ...sale, paymentMethod: e.target.value })
                          }
                          required
                        >
                          <option value="">Select Payment Method</option>
                          <option value="Cash">Cash</option>
                          <option value="Credit Card">Credit Card</option>
                          <option value="Debit Card">Debit Card</option>
                          <option value="UPI">UPI</option>
                          <option value="Bank Transfer">Bank Transfer</option>
                          <option value="Cheque">Cheque</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Date <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          name="date"
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          value={sale.date}
                          onChange={(e) =>
                            setSale({ ...sale, date: e.target.value })
                          }
                          required
                        />
                      </div>
                    </div>

                    {sale.orderType === "Partial Payment" && (
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Pending Amount (₹)
                          </label>
                          <input
                            type="number"
                            name="pendingAmount"
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-gray-100"
                            value={sale.pendingAmount}
                            readOnly
                          />
                        </div>
                        {/* Replace the depositeAmount field with this: */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Amount Paying Now (₹){" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="number"
                            name="amountPayingNow"
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            value={sale.amountPayingNow}
                            onChange={(e) =>
                              setSale({
                                ...sale,
                                amountPayingNow: e.target.value,
                              })
                            }
                            required
                            min="0"
                            max={sale.totalPayable}
                          />
                        </div>
                      </div>
                    )}

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Additional Notes
                      </label>
                      <textarea
                        name="notes"
                        rows="2"
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        value={sale.notes}
                        onChange={(e) =>
                          setSale({ ...sale, notes: e.target.value })
                        }
                        placeholder="Any special instructions or remarks..."
                      ></textarea>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-3 border-t pt-4">
                  <button
                    type="button"
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
                    onClick={() => {
                      setShowSaleModal(false);
                      setSale({
                        ...sale,
                        isExistingCustomer: false,
                        customerID: "",
                        customerName: "",
                        customerPhone: "",
                        customerEmail: "",
                        orderType: "Full Payment",
                        depositeAmount: 0,
                        pendingAmount: "",
                        date: new Date().toISOString().split("T")[0],
                        discount: "",
                        makingCharges: "",
                        paymentMethod: "",
                        taxes: "",
                        notes: "",
                      });
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium flex items-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Complete Sale
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryContent;
