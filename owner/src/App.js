import "./App.css";
import HomePage from "./components/HomePage";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import OwnerLayout from "./components/OwnerLayout";
import CustomerDetail from "./components/CustomerDetail.js";
import { Provider } from 'react-redux';
import { store } from './store/store';
import ProtectedRoute from './components/ProtectedRoute';
import DeliveryStatusUpdate from "./components/DeliveryStatusUpdate.js";

function App() {
  return (
    <Provider store={store}>
      <div className="">
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/ownerLayout"
              element={
                <ProtectedRoute>
                  <OwnerLayout />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/customer/:customerId" 
              element={
                <ProtectedRoute>
                  <CustomerDetail />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/deliveryStatusUpdate" 
              element={
                <ProtectedRoute>
                  <DeliveryStatusUpdate />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </div>
    </Provider>
  );
}

export default App;