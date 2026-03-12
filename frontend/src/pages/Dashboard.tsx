import React, { useEffect, useState } from 'react';
import { FileText } from 'lucide-react';
import {
    getGlobalStats,
    getEvolutionData,
    getRendementData,
    getRepartitionProduit,
    getTopVarietes,
    getTopPertes,
    getActivityData,
    getPredictions
} from '../services/api';

import StatCard from '../components/kpi/StatCard';
import ActivityChart from '../components/charts/ActivityChart';
import EvolutionChart from '../components/charts/EvolutionChart';
import PredictionScatterChart from '../components/charts/PredictionScatterChart';
import RevenuePieChart from '../components/charts/RevenuePieChart';
import TopVarietiesChart from '../components/charts/TopVarietiesChart';
import TopLossesChart from '../components/charts/TopLossesChart';
import InventoryTable from '../components/tables/InventoryTable';
import { generateReport } from '../utils/ReportGenerator';

const Dashboard: React.FC = () => {
    // États pour les données
    const [globalStats, setGlobalStats] = useState<any>(null);
    const [activityData, setActivityData] = useState<any[]>([]);
    const [evolutionData, setEvolutionData] = useState<any[]>([]);
    const [repartitionData, setRepartitionData] = useState<any[]>([]);
    const [topVarietesData, setTopVarietesData] = useState<any[]>([]);
    const [topPertesData, setTopPertesData] = useState<any[]>([]);
    const [tableData, setTableData] = useState<any[]>([]);
    const [predictions, setPredictions] = useState<any[]>([]);
    const [period, setPeriod] = useState<string>(''); // '', 'month', 'quarter', 'year'
    const [loading, setLoading] = useState<boolean>(true);

    // Chargement initial et lors du changement de période
    useEffect(() => {
        loadDashboardData(period);
    }, [period]);

    const loadDashboardData = async (currentPeriod: string) => {
        setLoading(true);
        try {
            const [statsRes, actRes, evoRes, pieRes, barRes, pertesRes, tableRes, predRes] = await Promise.all([
                getGlobalStats(currentPeriod).catch(() => ({ data: null })),
                getActivityData(currentPeriod).catch(() => ({ data: [] })),
                getEvolutionData(currentPeriod).catch(() => ({ data: [] })),
                getRepartitionProduit(currentPeriod).catch(() => ({ data: [] })),
                getTopVarietes(currentPeriod).catch(() => ({ data: [] })),
                getTopPertes(currentPeriod).catch(() => ({ data: [] })),
                getRendementData('', currentPeriod).catch(() => ({ data: [] })),
                getPredictions().catch(() => ({ data: [] }))
            ]);

            setGlobalStats(statsRes.data);
            setActivityData(actRes.data || []);
            setEvolutionData(evoRes.data || []);
            setRepartitionData(pieRes.data || []);
            setTopVarietesData(barRes.data || []);
            setTopPertesData(pertesRes.data || []);
            setTableData(tableRes.data || []);
            setPredictions(predRes.data || []);
        } catch (error) {
            console.error("Erreur critique chargement dashboard:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (term: string) => {
        try {
            const result = await getRendementData(term, period);
            setTableData(result.data);
        } catch (error) {
            console.error("Erreur recherche:", error);
        }
    };

    if (loading) return <div style={styles.loading}>Chargement du Tableau de Bord...</div>;

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <div>
                    <h1 style={styles.title}>Tableau de Bord Exécutif</h1>
                    <span style={styles.date}>{new Date().toLocaleDateString('fr-FR')}</span>
                </div>

                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                    {/* SÉLECTEUR DE PÉRIODE */}
                    <div style={styles.periodSelector}>
                        <button onClick={() => setPeriod('')} style={styles.periodBtn(period === '')}>Total</button>
                        <button onClick={() => setPeriod('month')} style={styles.periodBtn(period === 'month')}>Mois</button>
                        <button onClick={() => setPeriod('quarter')} style={styles.periodBtn(period === 'quarter')}>Trimestre</button>
                        <button onClick={() => setPeriod('year')} style={styles.periodBtn(period === 'year')}>Année</button>
                    </div>

                    {/* BOUTON RAPPORT STRATÉGIQUE */}
                    <button
                        onClick={() => generateReport(globalStats, activityData, predictions, topVarietesData)}
                        style={styles.reportBtn}
                    >
                        <FileText size={18} /> Télécharger Rapport
                    </button>
                </div>
            </div>

            {/* 1. INDICATEURS CLÉS (KPI) */}
            {globalStats && (
                <div style={styles.kpiGrid}>
                    <StatCard title="Récolte Totale (Kg)" value={globalStats.TOTAL_RECOLTE} type="default" />
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

                {/* Graphique IA (Matrice des Risques) - NOUVEAU */}
                <div style={styles.mainChart}>
                    <PredictionScatterChart data={predictions} />
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

                {/* Classement Top 5 Pertes (Barres) - NOUVEAU */}
                <div style={styles.subChart}>
                    <TopLossesChart data={topPertesData} />
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
// Styles CSS-in-JS pour la mise en page
const styles: any = {
    container: { padding: '30px', backgroundColor: '#f8fafc', minHeight: '100vh', color: '#1e293b' },
    loading: { padding: '50px', textAlign: 'center', color: '#64748b' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
    title: { fontSize: '1.8rem', fontWeight: '800', color: '#1e293b', margin: 0, letterSpacing: '-0.5px' },
    date: { color: '#64748b', fontWeight: '500', fontSize: '0.95rem', marginTop: '4px', display: 'block' },
    reportBtn: {
        display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px',
        backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '10px',
        cursor: 'pointer', fontWeight: '600', fontSize: '1rem',
        boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.4)', transition: 'all 0.2s ease'
    },
    kpiGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '30px' },

    // Grille pour les graphiques : 2 colonnes. 
    chartsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '24px',
        alignItems: 'stretch'
    },
    mainChart: { gridColumn: '1 / -1' }, // S'étend sur toute la largeur
    subChart: { minHeight: '400px' },
    periodSelector: {
        display: 'flex',
        backgroundColor: 'white',
        padding: '5px',
        borderRadius: '12px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        gap: '4px'
    },
    periodBtn: (active) => ({
        padding: '8px 16px',
        borderRadius: '8px',
        border: 'none',
        cursor: 'pointer',
        fontWeight: '600',
        fontSize: '0.9rem',
        backgroundColor: active ? '#10b981' : 'transparent',
        color: active ? 'white' : '#64748b',
        transition: 'all 0.2s ease'
    })
};

export default Dashboard;