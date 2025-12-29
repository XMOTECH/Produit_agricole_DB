import React, { useState, useEffect } from 'react';
import { Sprout, ShoppingCart, Save, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { getVarietes, addRecolte, addVente, getHistoriqueRecoltes, getHistoriqueVentes } from '../services/api';

const Operations = () => {
    // --- ÉTATS (STATES) ---
    const [activeTab, setActiveTab] = useState('recolte'); // 'recolte' ou 'vente'
    const [varietes, setVarietes] = useState([]);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    // États du formulaire
    const [formData, setFormData] = useState({
        id_variete: '',
        qte_kg: '',
        prix_unitaire: ''
    });

    // Feedback
    const [message, setMessage] = useState({ type: '', text: '' });

    // --- CHARGEMENT DES DONNÉES ---
    const loadVarietes = async () => {
        try {
            const response = await getVarietes();
            setVarietes(response.data);
        } catch (error) {
            console.error("Erreur chargement variétés", error);
        }
    };

    const loadHistory = React.useCallback(async () => {
        setLoading(true);
        try {
            const apiCall = activeTab === 'recolte' ? getHistoriqueRecoltes : getHistoriqueVentes;
            const response = await apiCall();
            setHistory(response.data);
        } catch (error) {
            console.error("Erreur chargement historique", error);
        } finally {
            setLoading(false);
        }
    }, [activeTab]);

    useEffect(() => {
        loadVarietes();
    }, []);

    useEffect(() => {
        loadHistory();
    }, [loadHistory]); // Recharger l'historique quand on change d'onglet

    // --- GESTION DU FORMULAIRE ---
    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        try {
            if (activeTab === 'recolte') {
                await addRecolte({
                    id_variete: formData.id_variete,
                    qte_kg: parseFloat(formData.qte_kg)
                });
            } else {
                await addVente({
                    id_variete: formData.id_variete,
                    qte_kg: parseFloat(formData.qte_kg),
                    prix_unitaire: parseFloat(formData.prix_unitaire)
                });
            }

            // Succès
            setMessage({ type: 'success', text: 'Opération enregistrée avec succès !' });
            setFormData({ id_variete: '', qte_kg: '', prix_unitaire: '' }); // Reset form
            loadHistory(); // Rafraîchir le tableau
        } catch (error) {
            // Gestion erreur Backend (ex: Stock insuffisant)
            const errorMsg = error.response?.data?.error || "Une erreur est survenue.";
            setMessage({ type: 'error', text: errorMsg });
        }
    };

    // --- STYLES EN JS (Pour garder le composant propre) ---
    const styles = {
        container: { padding: '0' },
        tabHeader: { display: 'flex', gap: '20px', marginBottom: '30px' },
        tabButton: (isActive, color) => ({
            flex: 1,
            padding: '20px',
            borderRadius: '12px',
            border: 'none',
            backgroundColor: isActive ? 'white' : 'transparent',
            boxShadow: isActive ? '0 4px 6px rgba(0,0,0,0.05)' : 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            color: isActive ? color : '#94a3b8',
            transition: 'all 0.3s ease',
            border: isActive ? `2px solid ${color}` : '2px solid transparent'
        }),
        card: { backgroundColor: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', marginBottom: '30px' },
        formGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '20px' },
        inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
        label: { fontSize: '0.9rem', fontWeight: '600', color: '#475569' },
        input: { padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem', outline: 'none' },
        button: (color) => ({
            backgroundColor: color, color: 'white', padding: '12px 25px', border: 'none', borderRadius: '8px',
            fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1rem'
        }),
        table: { width: '100%', borderCollapse: 'collapse', marginTop: '15px' },
        th: { textAlign: 'left', padding: '15px', borderBottom: '2px solid #e2e8f0', color: '#64748b' },
        td: { padding: '15px', borderBottom: '1px solid #f1f5f9' },
        alert: (type) => ({
            padding: '15px', borderRadius: '8px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px',
            backgroundColor: type === 'success' ? '#dcfce7' : '#fee2e2',
            color: type === 'success' ? '#166534' : '#991b1b',
            border: `1px solid ${type === 'success' ? '#bbf7d0' : '#fecaca'}`
        })
    };

    const activeColor = activeTab === 'recolte' ? '#16a34a' : '#2563eb'; // Vert pour récolte, Bleu pour vente

    return (
        <div style={styles.container}>

            {/* 1. ONGLETS DE NAVIGATION */}
            <div style={styles.tabHeader}>
                <button
                    style={styles.tabButton(activeTab === 'recolte', '#16a34a')}
                    onClick={() => setActiveTab('recolte')}
                >
                    <Sprout size={24} />
                    Nouvelle Récolte
                </button>
                <button
                    style={styles.tabButton(activeTab === 'vente', '#2563eb')}
                    onClick={() => setActiveTab('vente')}
                >
                    <ShoppingCart size={24} />
                    Nouvelle Vente
                </button>
            </div>

            {/* 2. ZONE DE SAISIE */}
            <div style={styles.card}>
                <h3 style={{ marginTop: 0, marginBottom: '20px', color: '#1e293b' }}>
                    {activeTab === 'recolte' ? 'Enregistrer une entrée de stock' : 'Enregistrer une sortie (Vente)'}
                </h3>

                {/* Message de notification */}
                {message.text && (
                    <div style={styles.alert(message.type)}>
                        {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={styles.formGrid}>

                        {/* Sélection Variété */}
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Variété</label>
                            <select
                                name="id_variete"
                                value={formData.id_variete}
                                onChange={handleInputChange}
                                style={styles.input}
                                required
                            >
                                <option value="">-- Choisir une variété --</option>
                                {varietes.map((v) => (
                                    <option key={v.ID_VARIETE} value={v.ID_VARIETE}>
                                        {v.NOM_VARIETE} (Stock: {v.STOCK_ACTUEL_KG} kg)
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Quantité */}
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Quantité (Kg)</label>
                            <input
                                type="number"
                                name="qte_kg"
                                value={formData.qte_kg}
                                onChange={handleInputChange}
                                style={styles.input}
                                placeholder="0.00"
                                step="0.01"
                                min="0.1"
                                required
                            />
                        </div>

                        {/* Prix Unitaire (Uniquement pour Vente) */}
                        {activeTab === 'vente' && (
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Prix Unitaire (FCFA)</label>
                                <input
                                    type="number"
                                    name="prix_unitaire"
                                    value={formData.prix_unitaire}
                                    onChange={handleInputChange}
                                    style={styles.input}
                                    placeholder="0"
                                    min="0"
                                    required
                                />
                            </div>
                        )}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <button type="submit" style={styles.button(activeColor)}>
                            <Save size={18} />
                            Valider l'opération
                        </button>
                    </div>
                </form>
            </div>

            {/* 3. HISTORIQUE DES OPÉRATIONS */}
            <div style={styles.card}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                    <Clock size={20} color="#64748b" />
                    <h3 style={{ margin: 0, color: '#1e293b' }}>
                        Historique des {activeTab === 'recolte' ? 'Récoltes' : 'Ventes'}
                    </h3>
                </div>

                {loading ? (
                    <p style={{ color: '#94a3b8' }}>Chargement...</p>
                ) : (
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>Date</th>
                                <th style={styles.th}>Variété</th>
                                <th style={styles.th}>Produit</th>
                                <th style={styles.th}>Quantité</th>
                                {activeTab === 'vente' && <th style={styles.th}>Montant Total</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {history.length > 0 ? (
                                history.map((row, index) => (
                                    <tr key={index}>
                                        <td style={styles.td}>{row.DATE_FMT}</td>
                                        <td style={{ ...styles.td, fontWeight: '600' }}>{row.NOM_VARIETE}</td>
                                        <td style={styles.td}>{row.NOM_PRODUIT}</td>
                                        <td style={styles.td}>
                                            <span style={{
                                                backgroundColor: activeTab === 'recolte' ? '#dcfce7' : '#e0f2fe',
                                                color: activeTab === 'recolte' ? '#166534' : '#0369a1',
                                                padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold'
                                            }}>
                                                {activeTab === 'recolte' ? '+' : '-'}{row.QTE_KG} kg
                                            </span>
                                        </td>
                                        {activeTab === 'vente' && (
                                            <td style={{ ...styles.td, fontWeight: 'bold', color: '#16a34a' }}>
                                                {row.TOTAL_VENTE?.toLocaleString()} FCFA
                                            </td>
                                        )}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" style={{ padding: '30px', textAlign: 'center', color: '#94a3b8' }}>
                                        Aucune donnée disponible
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>

        </div>
    );
};

export default Operations;