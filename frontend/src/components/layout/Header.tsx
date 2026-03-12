import React from 'react';
import { Bell, User, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
    title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
    const { user, logoutUser } = useAuth();
    
    return (
        <header style={{
            height: '70px',
            backgroundColor: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 30px',
            borderBottom: '1px solid #e2e8f0',
            marginLeft: '260px' // Pour ne pas passer sous la sidebar
        }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#0f172a' }}>{title}</h2>

            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                {/* Date du jour */}
                <span style={{ color: '#64748b', fontSize: '0.9rem' }}>
                    {new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </span>

                {/* Notifications */}
                <div style={{ position: 'relative', cursor: 'pointer' }}>
                    <Bell size={20} color="#64748b" />
                    <span style={{ position: 'absolute', top: '-2px', right: '-2px', width: '8px', height: '8px', backgroundColor: '#ef4444', borderRadius: '50%' }}></span>
                </div>

                {/* Profil & Déconnexion */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', paddingLeft: '20px', borderLeft: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '35px', height: '35px', backgroundColor: '#f1f5f9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <User size={18} color="#475569" />
                        </div>
                        <div>
                            <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: '500', color: '#334155' }}>
                                {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : 'Utilisateur'}
                            </p>
                            <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8' }}>
                                {user?.role === 'SELLER' ? 'Agriculteur' : user?.role === 'ADMIN' ? 'Administrateur' : 'Acheteur'}
                            </p>
                        </div>
                    </div>
                    
                    {/* Bouton Déconnexion */}
                    <button 
                        onClick={logoutUser} 
                        style={{ 
                            background: 'transparent', 
                            border: 'none', 
                            color: '#ef4444', 
                            cursor: 'pointer', 
                            padding: '5px', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            marginLeft: '10px'
                        }}
                        title="Se déconnecter"
                    >
                        <LogOut size={20} />
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;