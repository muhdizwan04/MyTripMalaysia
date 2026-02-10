import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import HotelsManager from './pages/HotelsManager';
import ActivitiesManager from './pages/ActivitiesManager';
import DiscoveryManager from './pages/DiscoveryManager';
import LogisticsManager from './pages/LogisticsManager';
import AnalyticsPage from './pages/AnalyticsPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="hotels" element={<HotelsManager />} />
          <Route path="activities" element={<ActivitiesManager />} />
          <Route path="discovery" element={<DiscoveryManager />} />
          <Route path="logistics" element={<LogisticsManager />} />
          <Route path="analytics" element={<AnalyticsPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
