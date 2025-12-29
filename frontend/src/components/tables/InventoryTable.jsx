import React from 'react';
import { Search } from 'lucide-react';

const InventoryTable = ({ data, onSearch }) => {
    return (
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', marginTop: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ margin: 0, color: '#1e293b' }}>Détail des Rendements par Variété</h3>

                {/* Barre de Recherche */}
                <div style={{ position: 'relative' }}>
                    <Search size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input
                        type="text"
                        placeholder="Rechercher une variété..."
                        onChange={(e) => onSearch(e.target.value)}
                        style={{ padding: '8px 10px 8px 35px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', width: '250px' }}
                    />
                </div>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ borderBottom: '2px solid #e2e8f0', textAlign: 'left' }}>
                        <th style={{ padding: '12px', color: '#64748b' }}>Variété</th>
                        <th style={{ padding: '12px', color: '#64748b' }}>Produit</th>
                        <th style={{ padding: '12px', color: '#64748b' }}>Récolté (kg)</th>
                        <th style={{ padding: '12px', color: '#64748b' }}>Vendu (kg)</th>
                        <th style={{ padding: '12px', color: '#64748b' }}>Stock (kg)</th>
                        <th style={{ padding: '12px', color: '#64748b' }}>CA Total</th>
                    </tr>
                </thead>
                <tbody>
                    {data.length > 0 ? (
                        data.map((row) => (
                            <tr key={row.ID_VARIETE} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                <td style={{ padding: '12px', fontWeight: '500' }}>{row.NOM_VARIETE}</td>
                                <td style={{ padding: '12px', color: '#64748b' }}>{row.NOM_PRODUIT}</td>
                                <td style={{ padding: '12px' }}>{row.QTE_RECOLTEE}</td>
                                <td style={{ padding: '12px' }}>{row.QTE_VENDUE}</td>
                                <td style={{ padding: '12px' }}>
                                    <span style={{
                                        padding: '4px 8px',
                                        borderRadius: '12px',
                                        backgroundColor: row.STOCK_ACTUEL_KG < 10 ? '#fee2e2' : '#dcfce7',
                                        color: row.STOCK_ACTUEL_KG < 10 ? '#991b1b' : '#166534',
                                        fontWeight: 'bold',
                                        fontSize: '0.85rem'
                                    }}>
                                        {row.STOCK_ACTUEL_KG}
                                    </span>
                                </td>
                                <td style={{ padding: '12px', fontWeight: 'bold' }}>{row.CA_TOTAL.toLocaleString()} FCFA</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" style={{ padding: '20px', textAlign: 'center', color: '#94a3b8' }}>Aucune donnée trouvée</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default InventoryTable;