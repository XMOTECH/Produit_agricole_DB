import React from 'react';
import { LayoutDashboard, Sprout, ShoppingCart, AlertTriangle } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
    const menuItems = [
        { name: 'Tableau de Bord', icon: LayoutDashboard, path: '/' },
        { name: 'Opérations', icon: ShoppingCart, path: '/operations' }, // Page de saisie Vente/Récolte
        { name: 'Stocks & Produits', icon: Sprout, path: '/stocks' },
        { name: 'Alertes', icon: AlertTriangle, path: '/alertes' },
    ];

    // Styles CSS en JS pour garder le tout propre
    const linkStyle = ({ isActive }) => ({
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 15px',
        borderRadius: '8px',
        textDecoration: 'none',
        color: isActive ? '#fff' : '#94a3b8',
        backgroundColor: isActive ? '#16a34a' : 'transparent', // Vert Agri-Ges si actif
        fontWeight: isActive ? '600' : '400',
        marginBottom: '8px',
        transition: 'all 0.2s'
    });

    return (
        <div style={{ width: '260px', backgroundColor: '#1e293b', height: '100vh', padding: '20px', position: 'fixed', left: 0, top: 0, color: 'white' }}>
            {/* Logo Sidebar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '40px', paddingLeft: '10px' }}>
                <div style={{ width: '35px', height: '35px', backgroundColor: '#16a34a', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Sprout color="white" size={20} />
                </div>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', margin: 0 }}>Agri-Ges</h2>
            </div>

            {/* Menu */}
            <nav>
                {menuItems.map((item) => (
                    <NavLink to={item.path} key={item.path} style={linkStyle}>
                        <item.icon size={20} />
                        {item.name}
                    </NavLink>
                ))}
            </nav>

            {/* Footer Sidebar */}
            <div style={{ position: 'absolute', bottom: '20px', left: '20px', color: '#64748b', fontSize: '0.8rem' }}>
                © 2025 Agri-Tech v1.0
            </div>
        </div>
    );
};

export default Sidebar;