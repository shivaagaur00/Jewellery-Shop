import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
  LocalShipping as ShippingIcon,
  HourglassEmpty as PendingIcon,
  Cancel as CancelledIcon,
  Assignment as OrderIcon,
  Diamond as DiamondIcon,
  Edit as EditIcon,
  Star as StarIcon
} from '@mui/icons-material';
import { updateDeliveryStatus, getAllNotDeliveredOrders } from '../api/owners';

const DeliveryStatusUpdate = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [status, setStatus] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [notes, setNotes] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await getAllNotDeliveredOrders();
        setOrders(response.data.orders);
      console.log(response.data.orders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleOpenDialog = (order) => {
    setSelectedOrder(order);
    setStatus(order.deliveryStatus);
    setTrackingNumber(order.trackingNumber || '');
    setNotes(order.notes || '');
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedOrder(null);
  };

  const handleStatusUpdate = async () => {
    try {
      const updates = {
        deliveryStatus: status,
        trackingNumber,
        notes,
        updatedAt: new Date().toISOString()
      };

      await updateDeliveryStatus({
        orderId: selectedOrder._id,
        updates
      });

      setOrders(orders.map(order => 
        order._id === selectedOrder._id ? { ...order, ...updates } : order
      ));

      handleCloseDialog();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return <CheckCircleIcon className="text-emerald-500" />;
      case 'shipped':
        return <ShippingIcon className="text-blue-500" />;
      case 'cancelled':
        return <CancelledIcon className="text-red-500" />;
      default:
        return <PendingIcon className="text-amber-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'shipped':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'cancelled':
        return 'bg-red-50 text-red-800 border-red-200';
      default:
        return 'bg-amber-50 text-amber-800 border-amber-200';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="relative">
            <DiamondIcon className="text-yellow-500 text-6xl mb-4 animate-spin-slow" />
            <StarIcon className="absolute top-0 right-0 text-yellow-300 text-xl animate-pulse" />
          </div>
          <span className="text-yellow-600 font-serif text-xl tracking-wider">Loading Precious Orders...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-yellow-50 to-yellow-100 min-h-screen p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <button 
            className="flex items-center px-4 py-3 bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            onClick={() => navigate(-1)}
          >
            <ArrowBackIcon className="mr-2" />
            Back
          </button>
          <div className="text-center">
            <h1 className="text-4xl font-serif font-bold text-yellow-800 tracking-wide">
              Order Fulfillment Dashboard
            </h1>
            <div className="h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent mt-2 mx-auto w-3/4"></div>
          </div>
          <div className="w-24"></div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-yellow-200">
          <div className="p-6 bg-gradient-to-r from-yellow-600 to-yellow-700 relative overflow-hidden">
            <div className="absolute top-0 right-0 opacity-20">
              <DiamondIcon className="text-white text-9xl" />
            </div>
            <h2 className="text-3xl font-serif font-semibold text-white relative z-10">
              Pending Deliveries
            </h2>
            <p className="text-yellow-100 relative z-10">
              Manage your precious jewelry orders with the care they deserve
            </p>
          </div>

          <div className="p-6">
            {orders.length === 0 ? (
              <div className="text-center py-12">
                <div className="relative inline-block">
                  <DiamondIcon className="text-yellow-300 text-6xl mx-auto mb-4" />
                  <div className="absolute -inset-2 border-2 border-yellow-200 rounded-full animate-pulse"></div>
                </div>
                <h3 className="text-2xl font-serif text-yellow-700">
                  No pending deliveries found
                </h3>
                <p className="text-yellow-600">
                  All precious orders have been processed with care
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order, index) => (
                  <div 
                    key={index}
                    className="border border-yellow-200 rounded-lg p-6 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-yellow-50 relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-16 h-16 bg-yellow-500 opacity-10 transform rotate-45 translate-x-8 -translate-y-8"></div>
                    <div className="flex justify-between items-start relative">
                      <div>
                        <div className="flex items-center mb-4">
                          <div className="bg-yellow-100 p-2 rounded-full mr-3">
                            <OrderIcon className="text-yellow-600" />
                          </div>
                          <h3 className="text-2xl font-serif font-medium text-yellow-800">
                            Order #{order._id.toString().slice(-6).toUpperCase()}
                          </h3>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100">
                            <p className="text-yellow-600 font-medium">Placed on</p>
                            <p className="font-medium text-gray-800">{formatDate(order.orderDate)}</p>
                          </div>
                          <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100">
                            <p className="text-yellow-600 font-medium">Expected Delivery</p>
                            <p className="font-medium text-gray-800">{formatDate(order.expectedDeliveryDate)}</p>
                          </div>
                          <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100">
                            <p className="text-yellow-600 font-medium">Items</p>
                            <p className="font-medium text-gray-800">{order.items.length} jewelry pieces</p>
                          </div>
                          <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100">
                            <p className="text-yellow-600 font-medium">Total Value</p>
                            <p className="font-medium text-gray-800">₹{order.orderCost}</p>
                          </div>
                        </div>

                        {order.trackingNumber && (
                          <div className="mt-4 bg-yellow-50 p-3 rounded-lg border border-yellow-100">
                            <p className="text-yellow-600 font-medium">Tracking Number</p>
                            <p className="font-mono font-medium text-gray-800">{order.trackingNumber}</p>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col items-end space-y-4 min-w-[180px]">
                        <div className={`flex items-center px-4 py-2 rounded-full border ${getStatusColor(order.deliveryStatus)} shadow-sm`}>
                          {getStatusIcon(order.deliveryStatus)}
                          <span className="ml-2 capitalize font-medium">
                            {order.deliveryStatus.replace('_', ' ')}
                          </span>
                        </div>
                        <button
                          className="flex items-center px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                          onClick={() => handleOpenDialog(order)}
                        >
                          <EditIcon className="mr-2" />
                          Update Status
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Update Status Dialog */}
      {openDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden border border-yellow-300">
            <div className="p-6 bg-gradient-to-r from-yellow-600 to-yellow-700 relative overflow-hidden">
              <div className="absolute top-0 right-0 opacity-20">
                <DiamondIcon className="text-white text-6xl" />
              </div>
              <h3 className="text-2xl font-serif font-semibold text-white relative z-10">
                Update Order Status
              </h3>
              <p className="text-yellow-100 relative z-10">
                Order #{selectedOrder?._id.toString().slice(-6).toUpperCase()}
              </p>
            </div>
            
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-yellow-700 mb-2">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full p-3 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 bg-yellow-50"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="out_for_delivery">Out for Delivery</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-yellow-700 mb-2">Tracking Number</label>
                <input
                  type="text"
                  className="w-full p-3 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 bg-yellow-50"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Enter courier tracking number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-yellow-700 mb-2">Notes</label>
                <textarea
                  className="w-full p-3 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 bg-yellow-50"
                  rows="4"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any special instructions or notes..."
                ></textarea>
              </div>
            </div>
            
            <div className="p-4 border-t border-yellow-200 flex justify-end space-x-3 bg-yellow-50">
              <button 
                className="px-5 py-2 border border-yellow-300 text-yellow-700 rounded-lg hover:bg-yellow-100 transition-colors duration-300"
                onClick={handleCloseDialog}
              >
                Cancel
              </button>
              <button 
                className="px-5 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                onClick={handleStatusUpdate}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryStatusUpdate;