import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import Operations from './pages/Operations';
import Stocks from './pages/Stocks';
import Alertes from './pages/Alertes';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Routes publiques */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Routes privées globales avec Layout commun */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <MainLayout title="Tableau de Bord">
                  <Dashboard />
                </MainLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/stocks" 
            element={
              <ProtectedRoute>
                <MainLayout title="Catalogue & Achats">
                  <Stocks />
                </MainLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/alertes" 
            element={
              <ProtectedRoute>
                <MainLayout title="Alertes & Tendances">
                  <Alertes />
                </MainLayout>
              </ProtectedRoute>
            } 
          />

          {/* Options spécifiques vendeurs ou admnistrateurs */}
          <Route 
            path="/operations" 
            element={
              <ProtectedRoute allowedRoles={['SELLER', 'ADMIN']}>
                <MainLayout title="Opérations">
                  <Operations />
                </MainLayout>
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;