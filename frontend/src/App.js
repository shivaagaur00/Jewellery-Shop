import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LandingPage from "./components/LandingPage";
import ContactUs from "./components/common/ContactUs";
import Collections from "./components/common/Collections";
import Login from "./components/customerLoginSignup/Login";
import Signup from "./components/customerLoginSignup/Signup";
import ProtectedRoute from "./components/customerLoginSignup/ProtectedRoute";
import Profile from "./components/consumer/pages/Profile";
import GoldenCart from "./components/consumer/pages/GoldenCart";
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import CustomOrder from "./components/consumer/pages/CustomOrder";
import NotDeliveredOrders from "./components/consumer/pages/NotDeliveredOrders";
import LoansPage from "./components/consumer/pages/LoansPage";
import PurchasesPage from "./components/consumer/pages/PurchasesPage";
const App = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Header />
              <LandingPage />
              <Footer />
            </>
          }
        />

        <Route
          path="/contactUS"
          element={
            <>
              <Header />
              <ContactUs />
              <Footer />
            </>
          }
        />
        <Route
          path="/collections"
          element={
            <>
              <Header />
              <Collections />
              <Footer />
            </>
          }
        />
        <Route
          path="/login"
          element={
            <>
              <Header />
              <Login />
              <Footer />
            </>
          }
        />
        <Route
          path="/signup"
          element={
            <>
              <Header />
              <Signup />
              <Footer />
            </>
          }
        />
        <Route
          path="/cart"
          element={
            <>
              <Header />
              <GoldenCart />
              <Footer />
            </>
          }
        />
        <Route
          path="/not-delivered-orders"
          element={
            <>
              <Header />
              <NotDeliveredOrders />
              <Footer />
            </>
          }
        />
        <Route element={<ProtectedRoute />}>
          <Route
            path="/profile"
            element={
              <>
                <Header />
                <Profile />
                <Footer />
              </>
            }
          />
          <Route
            path="/loans"
            element={
              <>
                <Header />
                <LoansPage />
                <Footer />
              </>
            }
          />
          <Route
            path="/customOrder"
            element={
              <>
                <Header />
                <CustomOrder />
                <Footer />
              </>
            }
          />
          <Route
            path="/purchases"
            element={
              <>
                <Header />
                <PurchasesPage />
                <Footer />
              </>
            }
          />
        </Route>
        <Route
          path="*"
          element={
            <>
              <Header />
              <LandingPage />
              <Footer />
            </>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
