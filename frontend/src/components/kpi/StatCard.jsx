import React from 'react';
import { TrendingDown, DollarSign, Package } from 'lucide-react';

const StatCard = ({ title, value, type }) => {
    // Sélection de l'icône et de la couleur selon le type
    let Icon = Package;
    let colorClass = "text-blue-600";
    let bgClass = "bg-blue-100";

    if (type === 'money') {
        Icon = DollarSign;
        colorClass = "text-green-600";
        bgClass = "bg-green-100";
    } else if (type === 'alert') {
        Icon = TrendingDown;
        colorClass = "text-red-600";
        bgClass = "bg-red-100";
    }

    return (
        <div style={{ padding: '20px', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ padding: '12px', borderRadius: '50%' }} className={bgClass}>
                <Icon size={24} className={colorClass} color={type === 'money' ? '#16a34a' : type === 'alert' ? '#dc2626' : '#2563eb'} />
            </div>
            <div>
                <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>{title}</p>
                <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b' }}>{value}</h3>
            </div>
        </div>
    );
};

export default StatCard;