import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { RootLayout } from './layouts/RootLayout';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import CreateTrip from './pages/trips/CreateTrip';
import ItineraryView from './pages/trips/ItineraryView';

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<RootLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/signup" element={<Signup />} />
          <Route path="/trips/create" element={<CreateTrip />} />
          <Route path="/trips/itinerary" element={<ItineraryView />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
