import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './components/Loginpage';
import HomePage from './components/Homepage';
import Navbar from './components/Navbar';



function App() {
  return (
    
    <Router>
       <Navbar /> {/* Navbar will be displayed on all pages */}
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
      </Routes>
    </Router>
  
  );
}

export default App;
