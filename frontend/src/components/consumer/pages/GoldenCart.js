import React, { useEffect, useState } from 'react';
import {
  ShoppingBagOutlined,
  Close,
  FavoriteBorder,
  ArrowForward,
  LocalShipping,
  VerifiedUser,
  Diamond,
  CheckCircleOutline,
  Add,
  Remove
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { cartItems, placeOrder, removeFromCart } from '../../../api/customerAPIs';

const GoldenCart = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = useSelector((state) => state.auth.user?.token);
  const handlePlaceOrder = async () => {
  try {
    const orderData = {
      itemIds: items.map(item => item.ID),
      orderCost: total
    };
    let res = await placeOrder(orderData, token);
    console.log(res);
    await fetchCartItems();
  } catch (error) {
    console.log(error);
  }
}
  const fetchCartItems = async () => {
    try {
      setLoading(true);
      const res = await cartItems(token);
      setItems(res.cartItems || []);
    } catch (error) {
      console.error("Failed to fetch cart items", error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (itemId) => {
    try {
      await removeFromCart({ itemId }, token);
      await fetchCartItems();
    } catch (error) {
      console.error("Failed to remove item", error);
    }
  };
  useEffect(() => {
    if (token) {
      fetchCartItems();
    }
  }, [token]);

  const subtotal = items.reduce((sum, item) => sum + (parseInt(item.metalPrice) * item.quantity), 0);
  const tax = subtotal * 0.1;
  const shipping = subtotal > 5000 ? 0 : 49.99;
  const total = subtotal + tax + shipping;

  return (
    <div className="min-h-screen bg-amber-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-amber-900 mb-2">Your Jewelry Collection</h1>
          <div className="flex items-center justify-center gap-2 text-amber-700">
            <ShoppingBagOutlined className="text-amber-600" />
            <span>{items.length} {items.length === 1 ? 'Item' : 'Items'}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-xl shadow-md overflow-hidden">
            {loading ? (
              <div className="p-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500 mx-auto"></div>
              </div>
            ) : items.length === 0 ? (
              <div className="p-12 text-center">
                <div className="text-amber-600 mb-4">
                  <ShoppingBagOutlined style={{ fontSize: '3rem' }} />
                </div>
                <h3 className="text-xl font-medium text-amber-900 mb-2">Your Cart is Empty</h3>
                <p className="text-amber-700 mb-6">Discover our exquisite jewelry collection</p>
                <button className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-lg font-medium transition-colors">
                  Browse Collections
                </button>
              </div>
            ) : (
              <>
                <div className="p-6 border-b border-amber-100">
                  <h2 className="text-xl font-semibold text-amber-900">Shopping Cart</h2>
                </div>
                <div className="divide-y divide-amber-100">
                  {items.map((item) => (
                    <div key={item.ID} className="p-6">
                      <div className="flex flex-col sm:flex-row gap-6">
                        <div className="relative flex-shrink-0">
                          <img 
                            src={item.image} 
                            alt={item.itemName}
                            className="w-32 h-32 object-cover rounded-lg border border-amber-200"
                          />
                          <button className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm rounded-full p-1.5 text-amber-600 hover:text-amber-800 transition-colors">
                            <FavoriteBorder fontSize="small" />
                          </button>
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-lg font-medium text-amber-900">{item.itemName}</h3>
                              <p className="text-sm text-amber-600">{item.ID}</p>
                            </div>
                            <button 
                              onClick={() => handleRemove(item.ID)}
                              className="text-amber-500 hover:text-amber-700 transition-colors"
                            >
                              <Close fontSize="small" />
                            </button>
                          </div>
                          
                          <div className="mt-2 text-sm text-amber-700 space-y-1">
                            <p><span className="font-medium">Metal:</span> {item.metalType} ({item.itemPurity})</p>
                            <p><span className="font-medium">Weight:</span> {item.weight}g</p>
                            <p><span className="font-medium">Quantity:</span></p>
                            
                          </div>
                          
                          <div className="mt-4">
                            <p className="text-lg font-semibold text-amber-800">
                              ₹{(parseInt(item.metalPrice) * item.quantity).toLocaleString()}
                            </p>
                            {item.quantity > 1 && (
                              <p className="text-sm text-gray-500">
                                ₹{parseInt(item.metalPrice).toLocaleString()} each
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="sticky top-8 h-fit">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6 border-b border-amber-100">
                <h2 className="text-xl font-semibold text-amber-900">Order Summary</h2>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="flex justify-between">
                  <span className="text-amber-700">Subtotal</span>
                  <span className="font-medium">₹{subtotal.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-amber-700">Tax (10%)</span>
                  <span className="font-medium">₹{tax.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-amber-700">Shipping</span>
                  <span className="font-medium">
                    {shipping === 0 ? (
                      <span className="text-green-600">FREE</span>
                    ) : (
                      `₹${shipping.toLocaleString()}`
                    )}
                  </span>
                </div>
                
                <div className="pt-4 mt-4 border-t border-amber-100 flex justify-between">
                  <span className="text-lg font-semibold text-amber-900">Total</span>
                  <span className="text-lg font-bold text-amber-800">₹{total.toLocaleString()}</span>
                </div>
                
                <button 
                  disabled={items.length === 0}
                  onClick={()=>handlePlaceOrder()}
                  className={`w-full py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors ${items.length === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-amber-600 hover:bg-amber-700 text-white'}`}
                >
                  Proceed to Checkout <ArrowForward />
                </button>
                
                <div className="pt-4 mt-4 border-t border-amber-100">
                  <p className="text-sm text-amber-700 mb-3">Jewelry Sphere guarantees:</p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-amber-700">
                      <VerifiedUser fontSize="small" className="text-amber-600" />
                      <span>100% Authentic Gemstones & Metals</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-amber-700">
                      <CheckCircleOutline fontSize="small" className="text-amber-600" />
                      <span>Certified Appraisal Included</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-amber-700">
                      <Diamond fontSize="small" className="text-amber-600" />
                      <span>Lifetime Craftsmanship Warranty</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-amber-700">
                      <LocalShipping fontSize="small" className="text-amber-600" />
                      <span>Insured Express Shipping</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 bg-white rounded-xl shadow-md overflow-hidden p-6">
              <h3 className="font-medium text-amber-900 mb-3">Need Assistance?</h3>
              <p className="text-sm text-amber-700 mb-4">
                Our jewelry specialists are available to help with your purchase or customization requests.
              </p>
              <button className="w-full border border-amber-600 text-amber-600 hover:bg-amber-50 py-2 rounded-lg font-medium transition-colors">
                Contact Concierge
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoldenCart;