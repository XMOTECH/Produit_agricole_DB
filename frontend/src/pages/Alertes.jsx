import React, { useEffect, useState } from 'react';
import { Printer, ArrowRight, ShieldAlert, CheckCircle, TrendingUp, AlertTriangle } from 'lucide-react';
import { getAlertesStock, getPredictions } from '../services/api';
import { useNavigate } from 'react-router-dom';

const Alertes = () => {
    const navigate = useNavigate();
    const [alertes, setAlertes] = useState([]);
    const [predictions, setPredictions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [alertRes, predRes] = await Promise.all([
                getAlertesStock(),
                getPredictions()
            ]);
            setAlertes(alertRes.data);
            // FILTRAGE FRONTEND : On ne garde que les vrais problèmes pour cette vue
            setPredictions(predRes.data.filter(p => p.NIVEAU_URGENCE !== 'NORMAL'));
            setLoading(false);
        } catch (error) {
            console.error("Erreur chargement données", error);
            setLoading(false);
        }
    };

    // Fonction pour imprimer la page proprement
    const handlePrint = () => {
        window.print();
    };

    // Logique de sévérité (Couleurs) pour le Stock réel
    const getSeverityParams = (stock) => {
        if (stock <= 0) return { color: '#ef4444', bg: '#fee2e2', text: 'RUPTURE DE STOCK', border: '#b91c1c' };
        if (stock < 20) return { color: '#f97316', bg: '#ffedd5', text: 'NIVEAU CRITIQUE', border: '#c2410c' };
        return { color: '#eab308', bg: '#fef9c3', text: 'STOCK FAIBLE', border: '#a16207' };
    };

    // Styles
    const styles = {
        headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
        sectionTitle: { fontSize: '1.2rem', fontWeight: 'bold', color: '#334155', marginBottom: '15px', marginTop: '30px', display: 'flex', alignItems: 'center', gap: '8px' },
        printBtn: {
            display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px',
            backgroundColor: 'white', border: '1px solid #cbd5e1', borderRadius: '8px',
            cursor: 'pointer', color: '#475569', fontWeight: '600'
        },
        grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' },
        card: (params) => ({
            backgroundColor: 'white', borderRadius: '12px', padding: '20px',
            borderLeft: `5px solid ${params.border}`,
            boxShadow: '0 4px 6px rgba(0,0,0,0.05)', position: 'relative'
        }),
        badge: (params) => ({
            backgroundColor: params.bg, color: params.border, padding: '4px 10px',
            borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase',
            display: 'inline-block', marginBottom: '10px'
        }),
        prodName: { fontSize: '1.2rem', fontWeight: 'bold', color: '#1e293b', margin: '0 0 5px 0' },
        details: { color: '#64748b', fontSize: '0.9rem', marginBottom: '15px' },
        stockBig: { fontSize: '2rem', fontWeight: 'bold', color: '#0f172a' },
        aiBadge: { backgroundColor: '#eff6ff', color: '#2563eb', padding: '5px 10px', borderRadius: '5px', fontSize: '0.8rem', fontWeight: '600', marginTop: '10px', display: 'flex', alignItems: 'center', gap: '5px' },
        actionBtn: {
            width: '100%', padding: '10px', marginTop: '15px', backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0', borderRadius: '8px', color: '#475569', fontWeight: '600',
            cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px'
        },
        emptyState: { textAlign: 'center', padding: '50px', color: '#64748b' }
    };

    if (loading) return <div style={{ padding: '40px' }}>Analyse AI en cours...</div>;

    return (
        <div>
            {/* Header */}
            <div style={styles.headerRow}>
                <div>
                    <h2 style={{ margin: 0, color: '#1e293b' }}>Centre de Vigilance</h2>
                    <p style={{ margin: '5px 0 0 0', color: '#64748b' }}>
                        Surveillance temps réel & Prédictions AI
                    </p>
                </div>
                <button style={styles.printBtn} onClick={handlePrint}>
                    <Printer size={18} /> Imprimer Vue
                </button>
            </div>

            {/* 1. SECTION AI PREDICTIONS (NOUVEAU) */}
            {predictions.length > 0 && (
                <>
                    <h3 style={styles.sectionTitle}><TrendingUp size={20} color="#7c3aed" /> Prédictions de Rupture (Data Mining)</h3>
                    <div style={styles.grid}>
                        {predictions.map((pred, idx) => (
                            <div key={`pred-${idx}`} style={{ ...styles.card({ border: '#7c3aed' }), borderLeft: '5px solid #7c3aed' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ backgroundColor: '#f5f3ff', color: '#7c3aed', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                                        IA : {pred.NIVEAU_URGENCE}
                                    </span>
                                </div>
                                <h3 style={styles.prodName}>{pred.NOM_VARIETE}</h3>
                                <div style={styles.stockBig}>{pred.JOURS_RESTANTS} <span style={{ fontSize: '1rem', color: '#64748b' }}>jours restants</span></div>
                                <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Basé sur une moyenne de <strong>{pred.VENTE_MOYENNE_JOUR} kg/jour</strong>.</p>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* 2. SECTION STOCK ACTUEL (EXISTANT) */}
            <h3 style={styles.sectionTitle}><AlertTriangle size={20} color="#f59e0b" /> Alertes Stock Réel</h3>
            {alertes.length > 0 ? (
                <div style={styles.grid}>
                    {alertes.map((item) => {
                        const params = getSeverityParams(item.STOCK_ACTUEL_KG);
                        return (
                            <div key={item.ID_VARIETE} style={styles.card(params)}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                    <span style={styles.badge(params)}>{params.text}</span>
                                    <ShieldAlert size={20} color={params.border} />
                                </div>

                                <h3 style={styles.prodName}>{item.NOM_VARIETE}</h3>
                                <div style={{ display: 'flex', alignItems: 'baseline', gap: '5px' }}>
                                    <span style={styles.stockBig}>{item.STOCK_ACTUEL_KG}</span>
                                    <span style={{ color: '#64748b' }}>kg restants</span>
                                </div>

                                <button
                                    style={styles.actionBtn}
                                    onClick={() => navigate('/operations')}
                                >
                                    Approvisionner <ArrowRight size={16} />
                                </button>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div style={styles.emptyState}>
                    <CheckCircle size={64} color="#16a34a" style={{ marginBottom: '20px' }} />
                    <p>Aucune alerte de stock physique.</p>
                </div>
            )}
        </div>
    );
};

export default Alertes;