import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { RootLayout } from './layouts/RootLayout';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import CreateTrip from './pages/trips/CreateTrip';
import ItineraryView from './pages/trips/ItineraryView';
import ExpenseTracker from './pages/trips/ExpenseTracker';
import Expenses from './pages/Expenses';
import TrendingItineraries from './pages/trips/TrendingItineraries';

import { CurrencyProvider } from './context/CurrencyContext';
import Profile from './pages/Profile';
import TripsList from './pages/trips/TripsList';
import TrendingPage from './pages/TrendingPage';
import CommunityFeedPage from './pages/CommunityFeedPage';
import FoodPage from './pages/FoodPage';
import ShoppingPage from './pages/ShoppingPage';
import MustVisitPage from './pages/MustVisitPage';
import MallDetailsPage from './pages/MallDetailsPage';
import SettingsPage from './pages/SettingsPage';
import TransportPage from './pages/TransportPage';
import AdminDashboard from './pages/Admin/Dashboard';
import AdminMalls from './pages/Admin/Malls';

function App() {
  return (
    <CurrencyProvider>
      <Router>
        <Routes>
          <Route element={<RootLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/malls" element={<AdminMalls />} />
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/signup" element={<Signup />} />
            <Route path="/trips" element={<TripsList />} />
            <Route path="/trips/create" element={<CreateTrip />} />
            <Route path="/trending" element={<TrendingPage />} />
            <Route path="/community" element={<CommunityFeedPage />} />
            <Route path="/food" element={<FoodPage />} />
            <Route path="/shopping" element={<ShoppingPage />} />
            <Route path="/shopping/mall/:mallId" element={<MallDetailsPage />} />
            <Route path="/must-visit" element={<MustVisitPage />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/trips/itinerary" element={<ItineraryView />} />
            <Route path="/trips/trending" element={<TrendingItineraries />} />
            <Route path="/trips/expenses" element={<Expenses />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/transport" element={<TransportPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </Router>
    </CurrencyProvider>
  );
}

export default App;
