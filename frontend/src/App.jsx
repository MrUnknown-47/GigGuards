// ==========================================
// GigGuards AI — App (Root Component)
// ==========================================

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { SimulationProvider } from './engine/SimulationContext';
import { AuthProvider, useAuth } from './engine/AuthContext';
import Navbar from './components/Navbar';
import NotificationToast from './components/NotificationToast';
import DemoModeBanner from './components/DemoModeBanner';
import LoginPage from './pages/LoginPage';
import LandingPage from './pages/LandingPage';
import WorkerDashboard from './pages/WorkerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import BuyPolicyPage from './pages/BuyPolicyPage';
import ClaimHistory from './pages/ClaimHistory';
import RegisterPage from "./pages/RegisterPage";
import 'leaflet/dist/leaflet.css'

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function AppContent() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-dark-500">
      {isAuthenticated && <Navbar />}
      {isAuthenticated && <DemoModeBanner />}
      {isAuthenticated && <NotificationToast />}
      <main>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={
            <ProtectedRoute><LandingPage /></ProtectedRoute>
          } />
          <Route path="/register" element={
            <ProtectedRoute><RegisterPage /></ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute><WorkerDashboard /></ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute><AdminDashboard /></ProtectedRoute>
          } />
          <Route path="/buy-policy" element={
            <ProtectedRoute><BuyPolicyPage /></ProtectedRoute>
          } />
          <Route path="/claims" element={
            <ProtectedRoute><ClaimHistory /></ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <SimulationProvider>
          <AppContent />
        </SimulationProvider>
      </AuthProvider>
    </Router>
  );
}
