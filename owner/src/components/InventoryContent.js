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

  // Validation
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
      pendingAmount: sale.orderType === "Partial Payment" 
        ? totalPayable - Number(sale.amountPayingNow) 
        : 0,
      metalPrice: currentItem.metalPrice,
      weight: currentItem.weight,
      itemPurity: currentItem.itemPurity
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

  const filteredInventory = inventory.filter((item) => {
    const matchesSearch =
      item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase());

    const stockStatus = getStockStatus(item.quantity);

    if (activeTab === "all") return matchesSearch;
    if (activeTab === "low")
      return matchesSearch && stockStatus === "Low Stock";
    if (activeTab === "out")
      return matchesSearch && stockStatus === "Out of Stock";
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        {/* Header */}
        <div className="fixed top-0 left-64 right-0 z-50 bg-white p-6 border-b border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center">
            <InventoryIcon className="text-yellow-600 mr-3 text-3xl" />
            <h1 className="text-2xl font-bold text-yellow-700">
              Gold Shop Inventory
            </h1>
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
              className={`px-3 py-1 rounded-lg ${
                activeTab === "all"
                  ? "bg-yellow-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => setActiveTab("all")}
            >
              All
            </button>
            <button
              className={`px-3 py-1 rounded-lg ${
                activeTab === "low"
                  ? "bg-yellow-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => setActiveTab("low")}
            >
              Low Stock
            </button>
            <button
              className={`px-3 py-1 rounded-lg ${
                activeTab === "out"
                  ? "bg-yellow-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
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
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Item Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  <WeightIcon className="inline mr-1" /> Weight
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Purity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  <PriceIcon className="inline mr-1" /> Price (₹)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Stock Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  <GemIcon className="inline mr-1" /> Metal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInventory.length > 0 ? (
                filteredInventory.map((item) => {
                  const stockStatus = getStockStatus(item.quantity);
                  return (
                    <tr key={item._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.ID}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {item.image && (
                            <img
                              src={item.image}
                              alt={item.itemName}
                              className="w-10 h-10 rounded-full object-cover mr-3"
                            />
                          )}
                          <div className="text-sm font-medium text-gray-900">
                            {item.itemName}
                          </div>
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
                        <CategoryIcon className="inline mr-1 text-gray-400" />{" "}
                        {item.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.weight}g
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.itemPurity}
                      </td>
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.metalType || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          className="text-yellow-600 hover:text-yellow-900 mr-3"
                          onClick={() => {
                            setCurrentItem(item);
                            setFormData({
                              ...item,
                              tags: item.tags.join(", "),
                              date: item.date.split("T")[0],
                            });
                            setShowForm(true);
                          }}
                        >
                          <EditIcon />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-900 mr-3"
                          onClick={() => handleDelete(item._id)}
                        >
                          <DeleteIcon />
                        </button>
                        <button
                          className="text-green-600 hover:text-green-700"
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
                        >
                          <PointOfSaleIcon />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan="10"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No items found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
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
