import React from "react";
import LandingPage from "./components/LandingPage";
import OwnerLogin from "./components/owner/loginAndSignIn/OwnerLogin";
import OwnerSignUp from "./components/owner/loginAndSignIn/OwnerSignUp";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import OwnerDashBoardMain from "./components/owner/loginAndSignIn/OwnerDashBoardMain";
import ContactUs from "./components/common/ContactUs";
import Collections from "./components/common/Collections";
const App = () => {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<LandingPage></LandingPage>} />
      <Route path="/ContactUs" element={<ContactUs></ContactUs>}/>
      <Route path="/Collections" element={<Collections></Collections>}/>
      <Route path="/OwnerDashBoardMain" element={<OwnerDashBoardMain></OwnerDashBoardMain>}/>
      <Route path="/ownerLogin" element={<OwnerLogin></OwnerLogin>}/>
      <Route path="/ownerSignUP" element={<OwnerSignUp></OwnerSignUp>}/>
      </Routes>
    </Router>
  );
};
export default App;
