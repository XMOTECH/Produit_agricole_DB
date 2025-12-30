import React, { useState, useEffect } from 'react';
import { AlertTriangle, Save, FolderPlus, Tag } from 'lucide-react';
import { getVarietes, getProduits, addProduit, addVariete, addPerte } from '../services/api';

const Stocks = () => {
    const [activeTab, setActiveTab] = useState('catalogue'); // 'catalogue' ou 'perte'
    const [produits, setProduits] = useState([]);
    const [varietes, setVarietes] = useState([]);
    const [message, setMessage] = useState({ type: '', text: '' });

    // --- FORMS STATES ---
    const [newProduit, setNewProduit] = useState('');
    const [newVariete, setNewVariete] = useState({ nom: '', description: '', id_produit: '' });
    const [newPerte, setNewPerte] = useState({ id_variete: '', qte_kg: '', motif: '' });

    useEffect(() => {
        refreshData();
    }, []);

    const refreshData = async () => {
        try {
            const p = await getProduits();
            const v = await getVarietes();
            setProduits(p.data);
            setVarietes(v.data);
        } catch (err) {
            console.error(err);
        }
    };

    // --- HANDLERS ---

    const handleCreateProduit = async (e) => {
        e.preventDefault();
        try {
            await addProduit({ nom_produit: newProduit });
            setMessage({ type: 'success', text: 'Catégorie produit créée !' });
            setNewProduit('');
            refreshData();
        } catch (err) {
            setMessage({ type: 'error', text: "Erreur création produit." });
        }
    };

    const handleCreateVariete = async (e) => {
        e.preventDefault();
        try {
            await addVariete({
                nom_variete: newVariete.nom,
                description: newVariete.description,
                id_produit: newVariete.id_produit
            });
            setMessage({ type: 'success', text: 'Variété ajoutée au catalogue !' });
            setNewVariete({ nom: '', description: '', id_produit: '' });
            refreshData();
        } catch (err) {
            setMessage({ type: 'error', text: "Erreur création variété." });
        }
    };

    const handleDeclarerPerte = async (e) => {
        e.preventDefault();
        try {
            await addPerte({
                id_variete: newPerte.id_variete,
                qte_kg: parseFloat(newPerte.qte_kg),
                motif: newPerte.motif
            });
            setMessage({ type: 'success', text: 'Perte enregistrée et stock mis à jour.' });
            setNewPerte({ id_variete: '', qte_kg: '', motif: '' });
            refreshData(); // Met à jour les stocks affichés dans les listes
        } catch (err) {
            // Gestion des erreurs Oracle (ex: Perte > Stock)
            const msg = err.response?.data?.error || "Erreur lors de l'enregistrement.";
            setMessage({ type: 'error', text: msg });
        }
    };

    // --- STYLES ---
    const styles = {
        container: { display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px', alignItems: 'start' },
        card: { backgroundColor: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', marginBottom: '20px' },
        header: { fontSize: '1.1rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' },
        inputGroup: { marginBottom: '15px' },
        label: { display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: '#64748b', fontWeight: '500' },
        input: { width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem' },
        button: (color) => ({
            width: '100%', padding: '12px', backgroundColor: color, color: 'white', border: 'none', borderRadius: '8px',
            fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: 'center', gap: '8px', fontSize: '1rem'
        }),
        alert: (type) => ({
            padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.9rem',
            backgroundColor: type === 'success' ? '#dcfce7' : '#fee2e2',
            color: type === 'success' ? '#166534' : '#991b1b'
        }),
        tabButton: (isActive) => ({
            padding: '10px 20px', marginRight: '10px', borderRadius: '8px', border: 'none', cursor: 'pointer',
            backgroundColor: isActive ? '#0f172a' : '#e2e8f0',
            color: isActive ? 'white' : '#64748b', fontWeight: '600'
        })
    };

    return (
        <div>
            {/* Navigation Onglets */}
            <div style={{ marginBottom: '30px' }}>
                <button style={styles.tabButton(activeTab === 'catalogue')} onClick={() => setActiveTab('catalogue')}>Catalogue & Référentiels</button>
                <button style={styles.tabButton(activeTab === 'perte')} onClick={() => setActiveTab('perte')}>Gestion des Pertes</button>
            </div>

            {message.text && <div style={styles.alert(message.type)}>{message.text}</div>}

            {activeTab === 'catalogue' ? (
                <div style={styles.container}>
                    {/* COLONNE GAUCHE : Créer Produit */}
                    <div style={styles.card}>
                        <div style={styles.header}><FolderPlus size={20} color="#2563eb" /> Nouveau Produit</div>
                        <form onSubmit={handleCreateProduit}>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Nom de la catégorie (ex: Légumes)</label>
                                <input type="text" style={styles.input} value={newProduit} onChange={e => setNewProduit(e.target.value)} required placeholder="Ex: Tubercule" />
                            </div>
                            <button type="submit" style={styles.button('#2563eb')}>Créer Catégorie</button>
                        </form>
                    </div>

                    {/* COLONNE DROITE : Créer Variété */}
                    <div style={styles.card}>
                        <div style={styles.header}><Tag size={20} color="#16a34a" /> Nouvelle Variété</div>
                        <form onSubmit={handleCreateVariete}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>Produit Parent</label>
                                    <select style={styles.input} value={newVariete.id_produit} onChange={e => setNewVariete({ ...newVariete, id_produit: e.target.value })} required>
                                        <option value="">-- Choisir --</option>
                                        {produits.map(p => <option key={p.ID_PRODUIT} value={p.ID_PRODUIT}>{p.NOM_PRODUIT}</option>)}
                                    </select>
                                </div>
                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>Nom Variété</label>
                                    <input type="text" style={styles.input} value={newVariete.nom} onChange={e => setNewVariete({ ...newVariete, nom: e.target.value })} required placeholder="Ex: Manioc Bonoua" />
                                </div>
                            </div>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Description (Optionnel)</label>
                                <input type="text" style={styles.input} value={newVariete.description} onChange={e => setNewVariete({ ...newVariete, description: e.target.value })} placeholder="Cycle court, résistant..." />
                            </div>
                            <button type="submit" style={styles.button('#16a34a')}>Ajouter au Catalogue</button>
                        </form>

                        {/* Aperçu rapide */}
                        <div style={{ marginTop: '20px', borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}>
                            <h4 style={{ margin: '0 0 10px 0', color: '#64748b' }}>Variétés existantes ({varietes.length})</h4>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                {varietes.slice(0, 8).map(v => (
                                    <span key={v.ID_VARIETE} style={{ fontSize: '0.8rem', padding: '5px 10px', backgroundColor: '#f1f5f9', borderRadius: '15px', color: '#475569' }}>
                                        {v.NOM_VARIETE}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                // ONGLET PERTES
                <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                    <div style={styles.card}>
                        <div style={styles.header}><AlertTriangle size={24} color="#dc2626" /> Déclarer une Perte / Avarie</div>
                        <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '20px' }}>
                            Cette action retirera définitivement les quantités du stock. Utilisez ceci pour les produits pourris, volés ou détruits.
                        </p>
                        <form onSubmit={handleDeclarerPerte}>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Variété concernée</label>
                                <select style={styles.input} value={newPerte.id_variete} onChange={e => setNewPerte({ ...newPerte, id_variete: e.target.value })} required>
                                    <option value="">-- Choisir la variété --</option>
                                    {varietes.map(v => (
                                        <option key={v.ID_VARIETE} value={v.ID_VARIETE}>
                                            {v.NOM_VARIETE} (Dispo: {v.STOCK_ACTUEL_KG} kg)
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Quantité Perdue (Kg)</label>
                                <input type="number" step="0.01" style={styles.input} value={newPerte.qte_kg} onChange={e => setNewPerte({ ...newPerte, qte_kg: e.target.value })} required />
                            </div>

                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Motif de la perte</label>
                                <input type="text" style={styles.input} value={newPerte.motif} onChange={e => setNewPerte({ ...newPerte, motif: e.target.value })} placeholder="Ex: Pourriture, Insectes, Vol..." required />
                            </div>

                            <button type="submit" style={styles.button('#dc2626')}>
                                <Save size={18} /> Confirmer la Perte
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Stocks;