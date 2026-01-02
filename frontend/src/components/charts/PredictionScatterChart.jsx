import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceArea } from 'recharts';
import { Brain } from 'lucide-react';

const PredictionScatterChart = ({ data }) => {
    // Transformation des données pour le graphique
    const chartData = data.map(item => ({
        x: item.JOURS_RESTANTS, // Jours restants
        y: item.VENTE_MOYENNE_JOUR, // Vitesse de vente
        z: item.STOCK_ACTUEL_KG, // Volume (pour info)
        name: item.NOM_VARIETE,
        status: item.NIVEAU_URGENCE
    }));

    // Custom Tooltip (AI Analysis)
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div style={{ backgroundColor: '#fff', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                    <p style={{ margin: 0, fontWeight: 'bold', color: '#1e293b' }}>{data.name}</p>
                    <p style={{ margin: '5px 0', fontSize: '0.9rem', color: '#64748b' }}>
                        Risque : <span style={{ fontWeight: 'bold', color: data.status === 'CRITIQUE' ? '#ef4444' : '#10b981' }}>{data.status}</span>
                    </p>
                    <hr style={{ borderColor: '#f1f5f9' }} />
                    <p style={{ margin: 0, fontSize: '0.8rem' }}>Rupture dans : <strong>{data.x} jours</strong></p>
                    <p style={{ margin: 0, fontSize: '0.8rem' }}>Vitesse : <strong>{data.y} kg/j</strong></p>
                </div>
            );
        }
        return null;
    };

    return (
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', height: '400px' }}>
            <h3 style={{ marginBottom: '10px', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Brain size={20} color="#0f172a" /> Matrice des Risques
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '20px' }}>
                Positionnement des variétés selon l'urgence de rupture (Axe X) et la vitesse de vente (Axe Y).
            </p>

            <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" />

                        {/* Zones de Risque */}
                        <ReferenceArea x1={0} x2={3} fill="#fee2e2" fillOpacity={0.5} stroke="none" label={{ position: 'insideTop', value: 'CRITIQUE', fill: '#ef4444', fontSize: 10 }} />
                        <ReferenceArea x1={3} x2={7} fill="#ffedd5" fillOpacity={0.3} stroke="none" label={{ position: 'insideTop', value: 'ATTENTION', fill: '#f97316', fontSize: 10 }} />
                        <ReferenceArea x1={7} fill="#dcfce7" fillOpacity={0.3} stroke="none" label={{ position: 'insideTop', value: 'SÉCURISÉ', fill: '#10b981', fontSize: 10 }} />

                        <XAxis type="number" dataKey="x" name="Jours Restants" unit="j" stroke="#94a3b8" label={{ value: 'Jours avant rupture', position: 'insideBottom', offset: -10 }} />
                        <YAxis type="number" dataKey="y" name="Ventes/Jour" unit="kg" stroke="#94a3b8" label={{ value: 'Vitesse Vente', angle: -90, position: 'insideLeft' }} />

                        <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />

                        <Scatter name="Produits" data={chartData} fill="#3b82f6" shape="circle" />
                    </ScatterChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default PredictionScatterChart;
