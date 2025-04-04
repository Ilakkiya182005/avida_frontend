import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./LandingPage.jsx";
import About from "./About.jsx";
import Services from "./Services.jsx";
import Products from "./Products.jsx";
import SignUpLogin from "./SignUpLogin.jsx";
import Login from "./Login.jsx";
import VolunteerDash from "./VolunteerDash.jsx";
import RegisterVolunteer from "./RegisterVolunteer.jsx"
import VolunteerProfile from "./VolunteerProfile.jsx";
import DisabledDash from "./DisabledDash.jsx";
import RegisterDisabled from "./RegisterDisabled.jsx";
import ReadyMatch from "./ReadyMatch.jsx"
import DisabledLogic from "./DisabledLogic.jsx";

import "@fontsource/outfit";
import TestReader from "./TextReader.jsx";
function App() {
  return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/products" element={<Products />} />
        <Route path="/signup-login" element={<SignUpLogin />} />
        <Route path="/login" element={<Login/>}/>
        <Route path="/volunteer-dashboard" element ={<VolunteerDash/>}/>
        <Route path="/disabled-dashboard" element={<DisabledDash/>}/>
        <Route path="/register-volunteer" element={<RegisterVolunteer/>}/>
        <Route path="/profile" element={<VolunteerProfile/>}/>
        <Route path="/register-exam" element={<RegisterDisabled/>}/>
        <Route path="/ready-to-match" element={<ReadyMatch/>}/>
        <Route path="/profile-view" element={<DisabledLogic/>}/>
        <Route path="/test-reader" element={<TestReader/>}/>
        
      </Routes>
    
  );
}

export default App;




