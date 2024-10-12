// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import PropertyList from './pages/PropertyList'; // PropertyList for listing properties
import LocationDetails from './pages/LocationDetails'; // LocationDetails for location-specific details
import PropertyDetails from './pages/PropertyDetails'; // PropertyDetails for specific property information
// import ContactPage from './pages/ContactPage';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  const [properties, setProperties] = useState([]); // State to hold properties (can be location or property-specific)

  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <div style={{ flex: '1' }}>
          <Routes>
            {/* Home Page */}
            <Route path="/" element={<HomePage />} />

            {/* Property List Page: Listing all available properties */}
            <Route 
              path="/properties" 
              element={<PropertyList setProperties={setProperties} />} // Passing setProperties to list properties
            />

            {/* Property Details Page: Show details of a specific property */}
            <Route 
              path="/properties/:id" 
              element={<PropertyDetails properties={properties} />} // Pass properties as props to PropertyDetails
            />

            {/* Location Details Page: Show details of various locations */}
            <Route 
              path="/locations" 
              element={<LocationDetails />} // Showing location details, like different neighborhoods
            />

            {/* Contact Page */}
            {/* <Route path="/contact" element={<ContactPage />} /> */}
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
