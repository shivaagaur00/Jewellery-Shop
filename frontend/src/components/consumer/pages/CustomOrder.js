import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  AddCircle as AddIcon,
  CheckCircle as CompletedIcon,
  LocalShipping as InProgressIcon,
  Schedule as PendingIcon,
  Receipt as OrderIcon,
  Payment as PaymentIcon,
  Info as DetailsIcon,
  Close as CloseIcon,
  ArrowBack as BackIcon,
  ArrowForward as NextIcon,
  AttachMoney as MoneyIcon,
  CalendarToday as CalendarIcon,
  Description as DescriptionIcon,
  Scale as WeightIcon,
  Star as SpecialIcon
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { addOrder, fetchCustomOrders } from '../../../api/customerAPIs';

const loadRazorpay = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => {
      resolve(window.Razorpay);
    };
    script.onerror = () => {
      resolve(null);
    };
    document.body.appendChild(script);
  });
};

const metalTypes = ["Gold", "Silver", "Platinum", "Palladium"];
const purityOptions = {
  Gold: ["24K", "22K", "18K", "14K", "10K"],
  Silver: ["999", "925", "900"],
  Platinum: ["950", "900", "850"],
  Palladium: ["950", "900"]
};

const StatusBadge = ({ status }) => {
  const getStatusDetails = () => {
    switch (status.toLowerCase()) {
      case "completed":
        return { icon: <CompletedIcon className="text-emerald-500" />, text: "Completed", classes: "bg-emerald-100 text-emerald-800" };
      case "in-progress":
        return { icon: <InProgressIcon className="text-blue-500" />, text: "In Progress", classes: "bg-blue-100 text-blue-800" };
      case "pending":
        return { icon: <PendingIcon className="text-amber-500" />, text: "Pending", classes: "bg-amber-100 text-amber-800" };
      default:
        return { icon: <PendingIcon className="text-amber-500" />, text: "Pending", classes: "bg-amber-100 text-amber-800" };
    }
  };

  const { icon, text, classes } = getStatusDetails();

  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${classes}`}>
      {icon}
      {text}
    </span>
  );
};

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const CustomOrder = () => {
  const [customerOrders, setCustomerOrders] = useState([]);
  const token = useSelector((state) => state.auth.user?.token);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetchCustomOrders(token);
        setCustomerOrders(res.data || []);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      }
    };
    if (token) fetchOrders();
  }, [token]);

  const [activeTab, setActiveTab] = useState('all');
  const [showNewOrder, setShowNewOrder] = useState(false);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [formStep, setFormStep] = useState(1);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageError, setImageError] = useState(null);
  
  const [orderForm, setOrderForm] = useState({
    metalType: "",
    itemName: "",
    orderDescription: "",
    weightExpected: "",
    itemPurity: "",
    priceExpected: "",
    depositedAmount: "",
    expectedDeliverDate: "",
    notes: "",
    image: ""
  });

  useEffect(() => {
    loadRazorpay().then(() => {
      setRazorpayLoaded(true);
    });
  }, []);

  const filteredOrders = customerOrders.filter(order => {
    if (activeTab === 'all') return true;
    if (activeTab === 'in-progress') return order.status.toLowerCase() === "in-progress";
    if (activeTab === 'completed') return order.status.toLowerCase() === "completed";
    if (activeTab === 'pending') return order.status.toLowerCase() === "pending";
    return true;
  });

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleNewOrder = () => {
    setShowNewOrder(true);
    setFormStep(1);
    setOrderForm({
      metalType: "",
      itemName: "",
      orderDescription: "",
      weightExpected: "",
      itemPurity: "",
      priceExpected: "",
      depositedAmount: "",
      expectedDeliverDate: "",
      notes: "",
      image: ""
    });
    setImagePreview(null);
  };

  const handleCloseNewOrder = () => {
    setShowNewOrder(false);
  };

  const handleNextStep = () => {
    setFormStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    setFormStep(prev => prev - 1);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setOrderForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitOrder = async () => {
    try {
      await addOrder(orderForm, token);
      const res = await fetchCustomOrders(token);
      setCustomerOrders(res.data || []);
      setShowNewOrder(false);
    } catch (error) {
      console.error("Failed to submit order:", error);
    }
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const handleImageUpload = async (file) => {
    if (!file) return;
    
    try {
      setIsImageLoading(true);
      setImageError(null);
      
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
      
      const cloudinaryFormData = new FormData();
      cloudinaryFormData.append("file", file);
      cloudinaryFormData.append("upload_preset", "ml_default");
      
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dthriaot4/image/upload",
        cloudinaryFormData,
        {
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
          },
        }
      );
      
      setOrderForm(prev => ({
        ...prev,
        image: response.data.secure_url,
      }));
      
    } catch (err) {
      setImageError("Failed to upload image. Please try again.");
      console.error(err);
    } finally {
      setIsImageLoading(false);
      setUploadProgress(0);
    }
  };

  const initiatePayment = async (order) => {
    if (!razorpayLoaded) {
      alert('Payment gateway is still loading. Please try again in a moment.');
      return;
    }

    setPaymentProcessing(true);
    
    try {
      const balance = order.priceExpected - order.depositedAmount;
      const amountInPaise = balance * 100;
      
      const options = {
        key: 'YOUR_RAZORPAY_KEY_ID',
        amount: amountInPaise.toString(),
        currency: 'INR',
        name: 'Jewelry Store',
        description: `Payment for ${order.itemName}`,
        image: 'https://example.com/your_logo.jpg',
        order_id: 'order_' + Math.random().toString(36).substr(2, 9),
        handler: function(response) {
          alert(`Payment successful! Payment ID: ${response.razorpay_payment_id}`);
          setPaymentProcessing(false);
          setShowOrderDetails(false);
        },
        prefill: {
          name: 'Customer Name',
          email: order.customerID,
          contact: '9999999999'
        },
        notes: {
          order_id: order._id
        },
        theme: {
          color: '#F59E0B'
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
      
      rzp.on('payment.failed', function(response) {
        alert(`Payment failed: ${response.error.description}`);
        setPaymentProcessing(false);
      });

    } catch (error) {
      console.error('Payment error:', error);
      alert('Error initiating payment. Please try again.');
      setPaymentProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-amber-800 flex items-center gap-2">
            <OrderIcon className="text-amber-600" />
            My Jewelry Orders
          </h1>
          <button 
            onClick={handleNewOrder}
            className="bg-gradient-to-r from-amber-600 to-amber-800 text-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2"
          >
            <AddIcon />
            New Custom Order
          </button>
        </header>

        <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200 pb-4">
          <button
            onClick={() => handleTabChange('all')}
            className={`px-4 py-2 rounded-lg transition-all ${activeTab === 'all' ? 'bg-amber-100 text-amber-800 font-medium' : 'hover:bg-gray-100'}`}
          >
            All Orders
          </button>
          <button
            onClick={() => handleTabChange('in-progress')}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-1 ${activeTab === 'in-progress' ? 'bg-blue-100 text-blue-800 font-medium' : 'hover:bg-gray-100'}`}
          >
            <InProgressIcon className="text-sm" />
            In Progress
          </button>
          <button
            onClick={() => handleTabChange('completed')}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-1 ${activeTab === 'completed' ? 'bg-emerald-100 text-emerald-800 font-medium' : 'hover:bg-gray-100'}`}
          >
            <CompletedIcon className="text-sm" />
            Completed
          </button>
          <button
            onClick={() => handleTabChange('pending')}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-1 ${activeTab === 'pending' ? 'bg-amber-100 text-amber-800 font-medium' : 'hover:bg-gray-100'}`}
          >
            <PendingIcon className="text-sm" />
            Pending
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrders.map(order => (
            <div key={order._id} className="bg-white rounded-xl shadow-md overflow-hidden transition-transform hover:-translate-y-1 border-t-4 border-amber-500">
              <div className="p-4 flex justify-between items-center bg-gray-50 border-b">
                <span className="font-medium text-amber-700">{order._id.slice(-6)}</span>
                <StatusBadge status={order.status} />
              </div>
 <div className="relative h-28 w-full overflow-hidden rounded-lg bg-gray-100">
  <img 
    src={order.image || '/placeholder-jewelry.jpg'} 
    alt={order.itemName}
    className="absolute inset-0 w-full h-full object-contain p-1 transition-transform duration-300 hover:scale-105"
    onError={(e) => {
      e.target.onerror = null; 
      e.target.src = '/placeholder-jewelry.jpg'
    }}
  />
</div>
              <div className="p-5">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{order.itemName}</h3>
                <p className="text-gray-600 mb-4">
                  <span className="font-medium">{order.metalType} {order.itemPurity}</span> • {order.weightExpected}gm
                </p>
                <div className="flex justify-between text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <CalendarIcon className="text-amber-600" />
                    {formatDate(order.date)}
                  </span>
                  <span className="flex items-center gap-1">
                    <MoneyIcon className="text-amber-600" />
                    ${order.priceExpected}
                  </span>
                </div>
              </div>
              <div className="border-t flex divide-x divide-gray-200">
                <button 
                  onClick={() => handleViewDetails(order)}
                  className="flex-1 py-3 flex items-center justify-center gap-1 text-amber-700 hover:bg-amber-50 transition-colors"
                >
                  <DetailsIcon />
                  Details
                </button>
                {order.status.toLowerCase() === 'in-progress' && (
                  <button 
                    className="flex-1 py-3 flex items-center justify-center gap-1 bg-amber-50 text-amber-700 font-medium hover:bg-amber-100 transition-colors"
                    onClick={() => initiatePayment(order)}
                  >
                    <PaymentIcon />
                    Pay
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {showNewOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border-t-4 border-amber-500">
              <div className="sticky top-0 bg-white p-5 border-b flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">
                  {formStep === 1 && "Item Details"}
                  {formStep === 2 && "Payment & Delivery"}
                  {formStep === 3 && "Review Order"}
                </h2>
                <button 
                  onClick={handleCloseNewOrder}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <CloseIcon />
                </button>
              </div>
              <div className="p-5">
                <div className="flex justify-between mb-8">
                  {[1, 2, 3].map((step) => (
                    <div key={step} className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${formStep >= step ? 'bg-amber-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                        {step}
                      </div>
                      <span className={`text-xs mt-1 ${formStep >= step ? 'font-medium text-amber-600' : 'text-gray-500'}`}>
                        {step === 1 && "Details"}
                        {step === 2 && "Payment"}
                        {step === 3 && "Review"}
                      </span>
                    </div>
                  ))}
                </div>

                {formStep === 1 && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                        <OrderIcon className="text-amber-600" />
                        Metal Type
                      </label>
                      <select
                        name="metalType"
                        value={orderForm.metalType}
                        onChange={handleFormChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                        required
                      >
                        <option value="">Select metal</option>
                        {metalTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>

                    {orderForm.metalType && (
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                          <OrderIcon className="text-amber-600" />
                          Purity
                        </label>
                        <select
                          name="itemPurity"
                          value={orderForm.itemPurity}
                          onChange={handleFormChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                          required
                        >
                          <option value="">Select purity</option>
                          {purityOptions[orderForm.metalType]?.map(option => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      </div>
                    )}

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                        <DescriptionIcon className="text-amber-600" />
                        Item Name
                      </label>
                      <input
                        type="text"
                        name="itemName"
                        value={orderForm.itemName}
                        onChange={handleFormChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                        <DescriptionIcon className="text-amber-600" />
                        Description
                      </label>
                      <textarea
                        name="orderDescription"
                        value={orderForm.orderDescription}
                        onChange={handleFormChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 min-h-[100px]"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                          <WeightIcon className="text-amber-600" />
                          Weight (g)
                        </label>
                        <input
                          type="number"
                          name="weightExpected"
                          value={orderForm.weightExpected}
                          onChange={handleFormChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                          <MoneyIcon className="text-amber-600" />
                          Expected Price ($)
                        </label>
                        <input
                          type="number"
                          name="priceExpected"
                          value={orderForm.priceExpected}
                          onChange={handleFormChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                        <DescriptionIcon className="text-amber-600" />
                        Sample Photo (Optional)
                      </label>
                      <div className="mt-1 flex items-center gap-4">
                        <label className="cursor-pointer bg-amber-50 text-amber-700 px-4 py-2 rounded-lg border border-amber-200 hover:bg-amber-100 transition-colors">
                          <input 
                            type="file" 
                            className="hidden" 
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e.target.files[0])}
                          />
                          Upload Photo
                        </label>
                        {isImageLoading && (
                          <div className="w-full max-w-xs">
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-amber-600 transition-all duration-300" 
                                style={{ width: `${uploadProgress}%` }}
                              ></div>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              Uploading... {uploadProgress}%
                            </p>
                          </div>
                        )}
                      </div>
                      {imageError && (
                        <p className="mt-1 text-sm text-red-600">{imageError}</p>
                      )}
                      {imagePreview && (
                        <div className="mt-3">
                          <p className="text-sm font-medium text-gray-700 mb-1">Preview:</p>
                          <div className="w-32 h-32 border rounded-lg overflow-hidden">
                            <img 
                              src={imagePreview} 
                              alt="Sample preview" 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {formStep === 2 && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                        <MoneyIcon className="text-amber-600" />
                        Deposit Amount ($)
                      </label>
                      <input
                        type="number"
                        name="depositedAmount"
                        value={orderForm.depositedAmount}
                        onChange={handleFormChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                        <CalendarIcon className="text-amber-600" />
                        Expected Delivery Date
                      </label>
                      <input
                        type="date"
                        name="expectedDeliverDate"
                        value={orderForm.expectedDeliverDate}
                        onChange={handleFormChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                        <SpecialIcon className="text-amber-600" />
                        Special Instructions
                      </label>
                      <textarea
                        name="notes"
                        value={orderForm.notes}
                        onChange={handleFormChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 min-h-[100px]"
                      />
                    </div>
                  </div>
                )}

                {formStep === 3 && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 flex items-center gap-2">
                      <OrderIcon className="text-amber-600" />
                      Order Summary
                    </h3>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-800 mb-3">Item Details</h4>
                      <div className="space-y-2 text-sm">
                        <p><span className="font-medium">Metal:</span> {orderForm.metalType} {orderForm.itemPurity}</p>
                        <p><span className="font-medium">Item:</span> {orderForm.itemName}</p>
                        <p><span className="font-medium">Description:</span> {orderForm.orderDescription}</p>
                        <p><span className="font-medium">Weight:</span> {orderForm.weightExpected}g</p>
                        {orderForm.image && (
                          <div className="mt-2">
                            <p className="font-medium">Sample Photo:</p>
                            <img 
                              src={orderForm.image} 
                              alt="Sample" 
                              className="w-32 h-32 object-cover rounded border mt-1"
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-800 mb-3">Financial Details</h4>
                      <div className="space-y-2 text-sm">
                        <p><span className="font-medium">Expected Price:</span> ${orderForm.priceExpected}</p>
                        <p><span className="font-medium">Deposit Amount:</span> ${orderForm.depositedAmount}</p>
                        <p><span className="font-medium">Balance Due:</span> ${(orderForm.priceExpected - orderForm.depositedAmount) || 0}</p>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-800 mb-3">Delivery</h4>
                      <div className="space-y-2 text-sm">
                        <p><span className="font-medium">Expected Delivery:</span> {orderForm.expectedDeliverDate || "Not specified"}</p>
                        {orderForm.notes && (
                          <p><span className="font-medium">Special Instructions:</span> {orderForm.notes}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="sticky bottom-0 bg-white p-4 border-t flex justify-between">
                {formStep > 1 ? (
                  <button
                    onClick={handlePrevStep}
                    className="flex items-center gap-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    <BackIcon />
                    Back
                  </button>
                ) : (
                  <div></div>
                )}

                {formStep < 3 ? (
                  <button
                    onClick={handleNextStep}
                    className="bg-amber-600 text-white px-6 py-2 rounded-lg shadow hover:bg-amber-700 transition-colors flex items-center gap-1"
                  >
                    Next
                    <NextIcon />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmitOrder}
                    className="bg-gradient-to-r from-amber-600 to-amber-800 text-white px-6 py-2 rounded-lg shadow hover:shadow-md transition-all"
                  >
                    Submit Order
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {showOrderDetails && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border-t-4 border-amber-500">
              <div className="sticky top-0 bg-white p-5 border-b flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">
                  Order Details - {selectedOrder._id.slice(-6)}
                </h2>
                <button 
                  onClick={() => setShowOrderDetails(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <CloseIcon />
                </button>
              </div>

              <div className="p-5">
                <div className="flex items-start gap-4 mb-6">
                  <div className="bg-amber-100 p-3 rounded-full">
                    <OrderIcon className="text-amber-600 text-3xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">{selectedOrder.itemName}</h3>
                    <p className="text-gray-600">
                      {selectedOrder.metalType} {selectedOrder.itemPurity} • {selectedOrder.weightExpected}gm
                    </p>
                    <div className="mt-2">
                      <StatusBadge status={selectedOrder.status} />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <CalendarIcon className="text-amber-600" />
                    <div>
                      <p className="text-xs text-gray-500">Order Date</p>
                      <p className="font-medium">{formatDate(selectedOrder.date)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <InProgressIcon className="text-amber-600" />
                    <div>
                      <p className="text-xs text-gray-500">Expected Delivery</p>
                      <p className="font-medium">{formatDate(selectedOrder.expectedDeliverDate)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <MoneyIcon className="text-amber-600" />
                    <div>
                      <p className="text-xs text-gray-500">Total Price</p>
                      <p className="font-medium">${selectedOrder.priceExpected}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <PaymentIcon className="text-amber-600" />
                    <div>
                      <p className="text-xs text-gray-500">Deposit Paid</p>
                      <p className="font-medium">${selectedOrder.depositedAmount}</p>
                    </div>
                  </div>
                </div>

                {selectedOrder.image && (
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <DescriptionIcon className="text-amber-600" />
                      Sample Image
                    </h4>
                    <div className="w-full max-w-xs border rounded-lg overflow-hidden">
                      <img 
                        src={selectedOrder.image} 
                        alt="Order sample" 
                        className="w-full h-auto object-cover"
                      />
                    </div>
                  </div>
                )}

                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <DescriptionIcon className="text-amber-600" />
                    Description
                  </h4>
                  <p className="text-gray-600">{selectedOrder.orderDescription}</p>
                </div>

                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <MoneyIcon className="text-amber-600" />
                    Payment History
                  </h4>
                  {selectedOrder.transactions && selectedOrder.transactions.length > 0 ? (
                    <div className="border rounded-lg overflow-hidden">
                      {selectedOrder.transactions.map((txn, index) => (
                        <div key={index} className="p-3 border-b last:border-b-0 flex justify-between">
                          <span>{formatDate(txn.date)}</span>
                          <span className="font-medium text-amber-700">${txn.amount}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">No payments recorded</p>
                  )}
                </div>
              </div>

              <div className="sticky bottom-0 bg-white p-4 border-t">
                {selectedOrder.status.toLowerCase() === 'in-progress' && (
                  <button 
                    className="w-full bg-amber-600 text-white py-2 rounded-lg shadow hover:bg-amber-700 transition-colors flex items-center justify-center gap-2"
                    onClick={() => initiatePayment(selectedOrder)}
                    disabled={paymentProcessing}
                  >
                    {paymentProcessing ? (
                      'Processing...'
                    ) : (
                      <>
                        <PaymentIcon />
                        Make Payment (${selectedOrder.priceExpected - selectedOrder.depositedAmount})
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomOrder;