import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const EvolutionChart = ({ data }) => {
    // 1. SÉCURITÉ : Si pas de données, on affiche un message
    if (!data || data.length === 0) {
        return (
            <div style={{ padding: '40px', textAlign: 'center', backgroundColor: 'white', borderRadius: '12px', height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p style={{ color: '#64748b' }}>Aucune donnée de vente disponible pour le graphique.</p>
            </div>
        );
    }

    // 2. NORMALISATION & PARSING DATE SÉCURISÉ
    let cleanData = data.map(item => {
        const rawDateStr = item.JOUR || item.jour || item.date_vente;
        return {
            rawDate: rawDateStr,
            // Parsing manuel pour éviter les problèmes de TimeZone (YYYY-MM-DD)
            dateObj: rawDateStr ? new Date(rawDateStr.split('-')[0], rawDateStr.split('-')[1] - 1, rawDateStr.split('-')[2]) : null,
            value: item.TOTAL_CA || item.total_ca || item.value || 0
        };
    });

    // 3. FIX VISUEL : Si une seule donnée, on ajoute un point "0" la veille pour avoir une courbe
    if (cleanData.length === 1 && cleanData[0].dateObj) {
        const singleDate = cleanData[0].dateObj;
        const prevDate = new Date(singleDate);
        prevDate.setDate(prevDate.getDate() - 1);

        const prevDateStr = prevDate.toISOString().split('T')[0];

        cleanData = [
            { rawDate: prevDateStr, dateObj: prevDate, value: 0 },
            ...cleanData
        ];
    }

    // Formattage Argent
    const formatCurrency = (value) => new Intl.NumberFormat('fr-FR').format(value) + ' F';

    // Formattage Date
    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const parts = dateStr.split('-');
        if (parts.length === 3) {
            const d = new Date(parts[0], parts[1] - 1, parts[2]);
            return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short' }).format(d);
        }
        return dateStr;
    };

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', padding: '10px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>{formatDate(label)}</p>
                    <p style={{ margin: 0, fontSize: '1rem', fontWeight: 'bold', color: '#10b981' }}>
                        {formatCurrency(payload[0].value)}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', height: '400px' }}>
            <h3 style={{ marginBottom: '20px', color: '#1e293b' }}>Évolution des Ventes</h3>

            <div style={{ width: '100%', height: 320 }}>
                <ResponsiveContainer>
                    <AreaChart data={cleanData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorCa" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis
                            dataKey="rawDate"
                            tickFormatter={formatDate}
                            stroke="#94a3b8"
                            tick={{ fontSize: 12 }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis
                            tickFormatter={(val) => new Intl.NumberFormat('fr-FR', { notation: "compact" }).format(val)}
                            stroke="#94a3b8"
                            tick={{ fontSize: 12 }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke="#10b981"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorCa)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default EvolutionChart;