import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { RootLayout } from './layouts/RootLayout';
import Home from './pages/Home';

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<RootLayout />}>
          <Route path="/" element={<Home />} />
          {/* Add more routes here later */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
