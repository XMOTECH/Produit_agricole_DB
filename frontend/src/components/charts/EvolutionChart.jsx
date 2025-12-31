import React, { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';

const EvolutionChart = ({ data }) => {
    const [viewMode, setViewMode] = useState('day'); // 'day', 'week', 'month'

    // We removed the early return here to keep Hook order consistent.
    // The check will be done inside useMemo and before rendering the chart.

    // 2. LOGIQUE D'AGRÉGATION (Memoized)
    const processedData = useMemo(() => {
        // Safety check inside hook
        if (!data || data.length === 0) return [];

        // A. Nettoyage initial et Tri
        const baseData = data.map(item => {
            const rawDateStr = item.JOUR || item.jour || item.date_vente;
            return {
                date: rawDateStr ? new Date(rawDateStr) : new Date(),
                value: item.TOTAL_CA || item.total_ca || item.value || 0
            };
        }).sort((a, b) => a.date - b.date);

        if (baseData.length === 0) return [];

        // B. Agrégation simple d'abord
        const grouped = {};
        baseData.forEach(item => {
            const d = item.date;
            let key;
            if (viewMode === 'day') key = d.toISOString().split('T')[0];
            else if (viewMode === 'week') {
                const firstDay = new Date(d);
                firstDay.setDate(d.getDate() - d.getDay() + 1);
                key = firstDay.toISOString().split('T')[0];
            } else if (viewMode === 'month') {
                key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
            }

            if (!grouped[key]) grouped[key] = 0;
            grouped[key] += item.value;
        });

        // C. REMPLISSAGE DES TROUS (CONTNUITÉ)
        const filledData = [];
        const minDate = new Date(baseData[0].date);
        const maxDate = new Date(baseData[baseData.length - 1].date);

        // On étend un peu la plage pour l'esthétique (optionnel, ici on reste strict sur les données)
        let currentDate = new Date(minDate);
        // Si semaine, on cale le start au lundi
        if (viewMode === 'week') {
            currentDate.setDate(currentDate.getDate() - currentDate.getDay() + 1);
        }
        // Si mois, on cale le start au 1er
        if (viewMode === 'month') {
            currentDate.setDate(1);
        }

        while (currentDate <= maxDate) {
            let key;
            if (viewMode === 'day') {
                key = currentDate.toISOString().split('T')[0];
                currentDate.setDate(currentDate.getDate() + 1);
            } else if (viewMode === 'week') {
                key = currentDate.toISOString().split('T')[0]; // La date "current" est déjà le lundi
                currentDate.setDate(currentDate.getDate() + 7);
            } else if (viewMode === 'month') {
                key = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
                currentDate.setMonth(currentDate.getMonth() + 1);
            }

            // On ajoute le point (donnée réelle ou 0)
            filledData.push({
                dateStr: key,
                value: grouped[key] || 0,
                // Pour Recharts, on peut passer l'objet Date
                dateObj: new Date(key)
            });
        }

        return filledData;
    }, [data, viewMode]);

    // 1. SÉCURITÉ : Si pas de données (Check AFTER hooks)
    if (!data || data.length === 0) {
        return (
            <div style={{ padding: '40px', textAlign: 'center', backgroundColor: 'white', borderRadius: '12px', height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p style={{ color: '#64748b' }}>Aucune donnée de vente disponible pour le graphique.</p>
            </div>
        );
    }


    // Utils de formatage
    const formatCurrency = (val) => new Intl.NumberFormat('fr-FR').format(val) + ' F';
    const formatXAxis = (tick) => {
        const d = new Date(tick);
        if (viewMode === 'day') return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short' }).format(d);
        if (viewMode === 'week') return 'Sem ' + getWeekNumber(d);
        if (viewMode === 'month') return new Intl.DateTimeFormat('fr-FR', { month: 'long', year: '2-digit' }).format(d);
        return tick;
    };

    // Helper semaine
    function getWeekNumber(d) {
        d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
        d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
        const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    }

    // Styles boutons
    const btnStyle = (mode) => ({
        padding: '6px 12px',
        fontSize: '0.85rem',
        borderRadius: '6px',
        border: 'none',
        cursor: 'pointer',
        fontWeight: '600',
        backgroundColor: viewMode === mode ? '#10b981' : '#f1f5f9',
        color: viewMode === mode ? 'white' : '#64748b',
        transition: 'all 0.2s'
    });

    return (
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', height: '400px' }}>

            {/* Header avec Contrôles */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ margin: 0, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <TrendingUp size={20} /> Évolution des Ventes
                </h3>
                <div style={{ display: 'flex', gap: '8px', backgroundColor: '#f8fafc', padding: '4px', borderRadius: '8px' }}>
                    <button onClick={() => setViewMode('day')} style={btnStyle('day')}>Jours</button>
                    <button onClick={() => setViewMode('week')} style={btnStyle('week')}>Semaines</button>
                    <button onClick={() => setViewMode('month')} style={btnStyle('month')}>Mois</button>
                </div>
            </div>

            <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                    <AreaChart data={processedData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorCa" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis
                            dataKey="dateStr"
                            tickFormatter={formatXAxis}
                            stroke="#94a3b8"
                            tick={{ fontSize: 12 }}
                            minTickGap={30}
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
                        <Tooltip
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                            labelFormatter={formatXAxis}
                            formatter={(value) => [formatCurrency(value), "Chiffre d'Affaires"]}
                        />
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke="#10b981"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorCa)"
                            animationDuration={500}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default EvolutionChart;