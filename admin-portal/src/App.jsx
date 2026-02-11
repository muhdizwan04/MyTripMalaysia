import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import HotelsManager from './pages/HotelsManager';
import ActivitiesManager from './pages/ActivitiesManager';
import DestinationsManager from './pages/DestinationsManager';
import LogisticsManager from './pages/LogisticsManager';
import AnalyticsPage from './pages/AnalyticsPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="destinations" element={<DestinationsManager />} />
          <Route path="activities" element={<ActivitiesManager />} />
          <Route path="hotels" element={<HotelsManager />} />
          <Route path="logistics" element={<LogisticsManager />} />
          <Route path="analytics" element={<AnalyticsPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
