import React, { useEffect, useState } from 'react';
import {
    getGlobalStats,
    getEvolutionData,
    getRendementData,
    getRepartitionProduit,
    getTopVarietes,
    getActivityData
} from '../services/api';

import StatCard from '../components/kpi/StatCard';
import ActivityChart from '../components/charts/ActivityChart';
import EvolutionChart from '../components/charts/EvolutionChart';
import RevenuePieChart from '../components/charts/RevenuePieChart';
import TopVarietiesChart from '../components/charts/TopVarietiesChart';
import InventoryTable from '../components/tables/InventoryTable';

const Dashboard = () => {
    // États pour les données
    const [globalStats, setGlobalStats] = useState(null);
    const [activityData, setActivityData] = useState([]);
    const [evolutionData, setEvolutionData] = useState([]);
    const [repartitionData, setRepartitionData] = useState([]);
    const [topVarietesData, setTopVarietesData] = useState([]);
    const [tableData, setTableData] = useState([]);
    const [loading, setLoading] = useState(true);

    // Chargement initial
    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            // Chargement parallèle pour optimiser la performance
            const [statsRes, actRes, evoRes, pieRes, barRes, tableRes] = await Promise.all([
                getGlobalStats(),
                getActivityData(),
                getEvolutionData(),
                getRepartitionProduit(),
                getTopVarietes(),
                getRendementData()
            ]);

            setGlobalStats(statsRes.data);
            setActivityData(actRes.data);
            setEvolutionData(evoRes.data);
            setRepartitionData(pieRes.data);
            setTopVarietesData(barRes.data);
            setTableData(tableRes.data);
        } catch (error) {
            console.error("Erreur chargement dashboard:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (term) => {
        try {
            const result = await getRendementData(term);
            setTableData(result.data);
        } catch (error) {
            console.error("Erreur recherche:", error);
        }
    };

    if (loading) return <div style={styles.loading}>Chargement du Tableau de Bord...</div>;

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.title}>Tableau de Bord Exécutif</h1>
                <span style={styles.date}>{new Date().toLocaleDateString('fr-FR')}</span>
            </div>

            {/* 1. INDICATEURS CLÉS (KPI) */}
            {globalStats && (
                <div style={styles.kpiGrid}>
                    <StatCard title="Récolte Totale (Kg)" value={globalStats.TOTAL_RECOLTE} type="stock" />
                    <StatCard title="Revenus Totaux (FCFA)" value={globalStats.TOTAL_VENTE_FCFA?.toLocaleString()} type="money" />
                    <StatCard title="Pertes Totales (Kg)" value={globalStats.TOTAL_PERTE_KG} type="alert" />
                    <StatCard title="Taux d'Écoulement" value={(globalStats.TAUX_ECOULEMENT || 0) + '%'} type="percent" />
                    <StatCard title="Valeur Stock (Est.)" value={(globalStats.VALEUR_STOCK_ESTIMEE || 0).toLocaleString() + ' F'} type="money" />
                </div>
            )}

            {/* 2. GRILLE DES GRAPHIQUES AVANCÉS */}
            <div style={styles.chartsGrid}>
                {/* Graphique d'Activité (Combined) */}
                <div style={styles.mainChart}>
                    <ActivityChart data={activityData} />
                </div>

                {/* Graphique d'Évolution des Ventes (Area Chart) - RESTORED */}
                <div style={styles.mainChart}>
                    <EvolutionChart data={evolutionData} />
                </div>

                {/* Diagramme Circulaire (Donut) */}
                <div style={styles.subChart}>
                    <RevenuePieChart data={repartitionData} />
                </div>

                {/* Classement Top 5 (Barres) */}
                <div style={styles.subChart}>
                    <TopVarietiesChart data={topVarietesData} />
                </div>
            </div>

            {/* 3. TABLEAU DÉTAILLÉ DU RENDEMENT */}
            <div style={{ marginTop: '30px' }}>
                <InventoryTable data={tableData} onSearch={handleSearch} />
            </div>
        </div>
    );
};

// Styles CSS-in-JS pour la mise en page
const styles = {
    container: { padding: '30px', backgroundColor: '#f1f5f9', minHeight: '100vh', fontFamily: "'Segoe UI', sans-serif" },
    loading: { padding: '50px', textAlign: 'center', color: '#64748b' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
    title: { fontSize: '24px', fontWeight: '800', color: '#0f172a', margin: 0 },
    date: { color: '#64748b', fontWeight: '500' },
    kpiGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' },

    // Grille pour les graphiques : 2 colonnes. 
    chartsGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px',
        alignItems: 'stretch'
    },
    mainChart: { gridColumn: '1 / -1' }, // S'étend sur toute la largeur
    subChart: { minHeight: '400px' }
};

export default Dashboard;