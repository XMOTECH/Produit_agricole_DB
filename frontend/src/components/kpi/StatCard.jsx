import React from 'react';
import { TrendingDown, DollarSign, Package, Activity } from 'lucide-react';

const StatCard = ({ title, value, type }) => {
    // Sélection de l'icône et de la couleur selon le type
    let Icon = Package;
    let iconColor = "#2563eb"; // Blue default
    let bgColor = "#dbeafe";

    if (type === 'money') {
        Icon = DollarSign;
        iconColor = "#16a34a";
        bgColor = "#dcfce7";
    } else if (type === 'alert') {
        Icon = TrendingDown;
        iconColor = "#dc2626";
        bgColor = "#fee2e2";
    } else if (type === 'percent') {
        Icon = Activity;
        iconColor = "#9333ea";
        bgColor = "#f3e8ff";
    }

    return (
        <div style={{ padding: '20px', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ padding: '12px', borderRadius: '50%', backgroundColor: bgColor }}>
                <Icon size={24} color={iconColor} />
            </div>
            <div>
                <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>{title}</p>
                <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b' }}>{value}</h3>
            </div>
        </div>
    );
};

export default StatCard;