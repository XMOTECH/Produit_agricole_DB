import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import Operations from './pages/Operations';
import Stocks from './pages/Stocks';
import Alertes from './pages/Alertes'; // IMPORTER ALERTES

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout title="Tableau de Bord"><Dashboard /></MainLayout>} />
        <Route path="/operations" element={<MainLayout title="Gestion des Opérations"><Operations /></MainLayout>} />
        <Route path="/stocks" element={<MainLayout title="Catalogue & Stocks"><Stocks /></MainLayout>} />

        {/* MISE A JOUR FINALE ICI */}
        <Route path="/alertes" element={<MainLayout title="Alertes & Rapports"><Alertes /></MainLayout>} />

      </Routes>
    </Router>
  );
}

export default App;