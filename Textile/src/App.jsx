import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './components/Loginpage';
import HomePage from './components/Homepage';
import Navbar from './components/Navbar';
import AdminPage from './components/Admin';
import SignUpPage from './components/Signup';
import UserProfile from './components/Userprofile';
import SummerCollections from './components/SummerCollections';
import AutumnCollection from './components/AutumnCollection';
import WinterCollection from './components/WinterCollection';
import MensFashion from './components/MensFashion';
import WomensFashion from './components/WomensCollection';
import AdminLoginPage from './components/Adminpage';



function App() {
  return (
    
    <Router>
       <Navbar /> 
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/collections/summer" element={<SummerCollections />} />
        <Route path="/collections/autumn" element={<AutumnCollection />} />
        <Route path="/collections/winter" element={<WinterCollection />} />
        <Route path="/collections/men" element={<MensFashion />} />
        <Route path="/collections/women" element={<WomensFashion />} />
        <Route path="/adminlogin" element={<AdminLoginPage />} />
        <Route path="/t" element={<AdminPage/>} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/u" element={<UserProfile />} />
      </Routes>
    </Router>
  
  );
}

export default App;
