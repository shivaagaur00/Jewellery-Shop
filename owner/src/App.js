import "./App.css";
import HomePage from "./components/HomePage";
import Header from "./components/Header";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Footer from "./components/Footer";
import OwnerLayout from "./components/OwnerLayout";
import CustomerDetail  from "./components/CustomerDetail.js";
function App() {
  return (
    <div className="">
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <HomePage />
              </>
            }
          />
          <Route
          path="/ownerLayout" 
          element={
            <OwnerLayout></OwnerLayout>
          }/>
          <Route path="/customer/:customerId" element={<CustomerDetail/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
