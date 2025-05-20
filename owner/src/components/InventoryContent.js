import React, { useState, useEffect } from "react";
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Inventory as InventoryIcon,
  AttachMoney as PriceIcon,
  Scale as WeightIcon,
  Diamond as GemIcon,
  Category as CategoryIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { addItem, getItems, updateItem, deleteItem } from "../api/owners";
import axios from "axios";

const InventoryContent = () => {
  const [inventory, setInventory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [error, setError] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    ID: "",
    metalType: "",
    itemName: "",
    weight: "",
    itemPurity: "24K",
    metalPrice: "",
    quantity: 0,
    tags: [],
    category: "",
    date: new Date().toISOString().split('T')[0], 
    image: "",
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
      setFormData(prev => ({
        ...prev,
        image: cloudinaryResponse.data.secure_url
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
    if (!formData.itemName || !formData.category || !formData.weight || 
        !formData.itemPurity || !formData.metalPrice || formData.quantity === undefined) {
      setError('Please enter all required details');
      return;
    }

    try {
      const itemData = {
        ...formData,
        quantity: Number(formData.quantity),
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      };

      let res;
      // console.log(itemData);
      if (currentItem) {
        res = await updateItem({id:currentItem._id,updateData:itemData});
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
        const res = await deleteItem({id:id});
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
      weight: "",
      itemPurity: "24K",
      metalPrice: "",
      quantity: 0,
      tags: [],
      category: "",
      date: new Date().toISOString().split('T')[0],
      image: "",
    });
    setCurrentItem(null);
    setError("");
  };

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         item.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const stockStatus = getStockStatus(item.quantity);
    
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "low") return matchesSearch && stockStatus === "Low Stock";
    if (activeTab === "out") return matchesSearch && stockStatus === "Out of Stock";
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        {/* Header */}
        <div className="fixed top-0 left-64 right-0 z-50 bg-white p-6 border-b border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center">
            <InventoryIcon className="text-yellow-600 mr-3 text-3xl" />
            <h1 className="text-2xl font-bold text-yellow-700">Gold Shop Inventory</h1>
          </div>
          <button
            className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
          >
            <AddIcon className="mr-1" /> Add Gold Item
          </button>
        </div>

        {/* Search and Filter */}
        <div className="mt-24 p-6 flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <button
              className={`px-3 py-1 rounded-lg ${activeTab === "all" ? 'bg-yellow-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              onClick={() => setActiveTab("all")}
            >
              All
            </button>
            <button
              className={`px-3 py-1 rounded-lg ${activeTab === "low" ? 'bg-yellow-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              onClick={() => setActiveTab("low")}
            >
              Low Stock
            </button>
            <button
              className={`px-3 py-1 rounded-lg ${activeTab === "out" ? 'bg-yellow-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              onClick={() => setActiveTab("out")}
            >
              Out of Stock
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="px-6">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
              <span className="block sm:inline">{error}</span>
            </div>
          </div>
        )}

        {/* Inventory Table */}
        <div className="overflow-x-auto px-6 pb-6">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-yellow-600 text-white">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Item Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"><WeightIcon className="inline mr-1" /> Weight</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Purity</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"><PriceIcon className="inline mr-1" /> Price (₹)</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Stock Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"><GemIcon className="inline mr-1" /> Metal</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInventory.length > 0 ? (
                filteredInventory.map((item) => {
                  const stockStatus = getStockStatus(item.quantity);
                  return (
                    <tr key={item._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.ID}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {item.image && (
                            <img 
                              src={item.image} 
                              alt={item.itemName} 
                              className="w-10 h-10 rounded-full object-cover mr-3"
                            />
                          )}
                          <div className="text-sm font-medium text-gray-900">{item.itemName}</div>
                        </div>
                        {item.tags && item.tags.length > 0 && (
                          <div className="mt-1 flex flex-wrap gap-1">
                            {item.tags.map((tag, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <CategoryIcon className="inline mr-1 text-gray-400" /> {item.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.weight}g</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.itemPurity}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ₹{item.metalPrice.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            stockStatus === "In Stock"
                              ? "bg-green-100 text-green-800"
                              : stockStatus === "Low Stock"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {stockStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.metalType || "-"}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          className="text-yellow-600 hover:text-yellow-900 mr-3"
                          onClick={() => {
                            setCurrentItem(item);
                            setFormData({
                              ...item,
                              tags: item.tags.join(', '),
                              date: item.date.split('T')[0],
                            });
                            setShowForm(true);
                          }}
                        >
                          <EditIcon />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-900"
                          onClick={() => handleDelete(item._id)}
                        >
                          <DeleteIcon />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="10" className="px-6 py-4 text-center text-gray-500">
                    No items found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Item Form Modal */}
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
                      {isUploading && <p className="text-sm text-gray-500 mt-1">Uploading image...</p>}
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
                    {isUploading ? "Uploading..." : currentItem ? "Update Item" : "Add Item"}
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