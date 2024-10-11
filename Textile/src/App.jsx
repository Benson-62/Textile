import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './components/Loginpage';
import HomePage from './components/Homepage';
import Navbar from './components/Navbar';
import AdminPage from './components/Admin';
import SignUpPage from './components/Signup';



function App() {
  return (
    
    <Router>
       <Navbar /> {/* Navbar will be displayed on all pages */}
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/t" element={<AdminPage/>} />
        <Route path="/signup" element={<SignUpPage />} />
      </Routes>
    </Router>
  
  );
}

export default App;
