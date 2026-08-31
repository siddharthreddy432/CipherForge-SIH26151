/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Investigate from './pages/Investigate';
import NetworkGraph from './pages/NetworkGraph';
import Evidence from './pages/Evidence';
import Actors from './pages/Actors';
import Infrastructure from './pages/Infrastructure';
import Blockchain from './pages/Blockchain';
import Sources from './pages/Sources';
import Alerts from './pages/Alerts';
import Reports from './pages/Reports';
import PersonaAnalysis from './pages/PersonaAnalysis';
import Search from './pages/Search';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="investigate" element={<Investigate />} />
          <Route path="graph" element={<NetworkGraph />} />
          <Route path="actors" element={<Actors />} />
          <Route path="infrastructure" element={<Infrastructure />} />
          <Route path="blockchain" element={<Blockchain />} />
          <Route path="persona" element={<PersonaAnalysis />} />
          <Route path="search" element={<Search />} />
          <Route path="evidence" element={<Evidence />} />
          <Route path="sources" element={<Sources />} />
          <Route path="alerts" element={<Alerts />} />
          <Route path="reports" element={<Reports />} />
        </Route>
      </Routes>
    </Router>
  );
}
