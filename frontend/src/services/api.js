import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000/api',
    headers: {
        "Content-Type": 'application/json',
    },
});

// Fonctions d'appel API
export const getGlobalStats = () => api.get('/dashboard/stats-globales');
export const getEvolutionData = () => api.get('/dashboard/evolution');
export const getAlertesStock = () => api.get('/dashboard/alertes');
// Cette fonction accepte un terme de recherche
export const getRendementData = (searchTerm = '') => api.get(`/dashboard/rendement?search=${searchTerm}`);

export const getRepartitionProduit = () => api.get('/dashboard/repartition-produit');
export const getTopVarietes = () => api.get('/dashboard/top-varietes');

// --- REFERENTIELS ---
export const getVarietes = () => api.get('/varietes');
export const getProduits = () => api.get('/produits')

// --- TRANSACTIONS (ECRITURE) ---
export const addRecolte = (data) => api.post('/recoltes', data);
export const addVente = (data) => api.post('/ventes', data);

// --- HISTORIQUES (LECTURE) ---
export const getHistoriqueRecoltes = () => api.get('/historique/recoltes');
export const getHistoriqueVentes = () => api.get('/historique/ventes');

// --- ADMINISTRATION (REFERENTIELS) ---
export const addProduit = (data) => api.post('/produits', data);
export const addVariete = (data) => api.post('/varietes', data);

// --- PERTES ---
export const addPerte = (data) => api.post('/pertes', data);



export default api;