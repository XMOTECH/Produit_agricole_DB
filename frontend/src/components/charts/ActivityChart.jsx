import React from 'react';
import {
    ComposedChart, Line, Area, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    Legend, ResponsiveContainer
} from 'recharts';

const ActivityChart = ({ data }) => {
    // SÉCURITÉ : Si pas de données
    if (!data || data.length === 0) {
        return (
            <div style={{ padding: '40px', textAlign: 'center', backgroundColor: 'white', borderRadius: '12px', height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p style={{ color: '#64748b' }}>En attente de données d'activité...</p>
            </div>
        );
    }

    // NORMALISATION
    const cleanData = data.map(item => ({
        jour: item.JOUR || item.jour,
        dateObj: new Date(item.JOUR || item.jour),
        recolte: item.QTE_RECOLTE || item.qte_recolte || 0,
        vente: item.QTE_VENTE || item.qte_vente || 0,
        perte: item.QTE_PERTE || item.qte_perte || 0,
        revenu: item.REVENU || item.revenu || 0
    }));

    const formatCurrency = (val) => new Intl.NumberFormat('fr-FR', { notation: "compact" }).format(val) + ' F';
    const formatKg = (val) => new Intl.NumberFormat('fr-FR', { notation: "compact" }).format(val) + ' kg';

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        return isNaN(d) ? dateStr : new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: '2-digit' }).format(d);
    };

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div style={{ backgroundColor: 'white', border: '1px solid #e2e8f0', padding: '15px', borderRadius: '8px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}>
                    <p style={{ fontWeight: 'bold', marginBottom: '8px', color: '#1e293b' }}>{new Date(label).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                    {payload.map((entry, index) => (
                        <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', fontSize: '0.9rem' }}>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: entry.color }}></div>
                            <span style={{ color: '#64748b', width: '60px' }}>{entry.name}:</span>
                            <span style={{ fontWeight: '600', color: '#334155' }}>
                                {entry.name === 'Revenu' ? entry.value.toLocaleString() + ' F' : entry.value + ' kg'}
                            </span>
                        </div>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', height: '450px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                    <h3 style={{ margin: 0, color: '#1e293b', fontSize: '1.2rem', fontWeight: '700' }}>Flux d'Activité Agricole</h3>
                    <p style={{ margin: '5px 0 0 0', color: '#94a3b8', fontSize: '0.85rem' }}>Corrélation Récoltes (Entrées) vs Ventes (Sorties)</p>
                </div>
            </div>

            <ResponsiveContainer width="100%" height={350}>
                <ComposedChart data={cleanData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <defs>
                        <linearGradient id="colorRevenu" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#eab308" stopOpacity={0.2} />
                            <stop offset="95%" stopColor="#eab308" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid stroke="#f1f5f9" vertical={false} strokeDasharray="3 3" />

                    <XAxis
                        dataKey="jour"
                        tickFormatter={formatDate}
                        stroke="#94a3b8"
                        tick={{ fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                        dy={10}
                    />

                    {/* Axe Gauche : Quantités (kg) */}
                    <YAxis
                        yAxisId="left"
                        tickFormatter={formatKg}
                        stroke="#94a3b8"
                        tick={{ fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                    />

                    {/* Axe Droit : Revenus (FCFA) */}
                    <YAxis
                        yAxisId="right"
                        orientation="right"
                        tickFormatter={formatCurrency}
                        stroke="#eab308"
                        tick={{ fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                    />

                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ paddingTop: '20px' }} />

                    <Bar yAxisId="left" dataKey="recolte" name="Récolte" barSize={20} fill="#10b981" radius={[4, 4, 0, 0]} />
                    <Bar yAxisId="left" dataKey="vente" name="Vente" barSize={20} fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    <Line yAxisId="left" type="monotone" dataKey="perte" name="Perte" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} />
                    <Area yAxisId="right" type="monotone" dataKey="revenu" name="Revenu" fill="url(#colorRevenu)" stroke="#eab308" strokeWidth={3} />
                </ComposedChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ActivityChart;
