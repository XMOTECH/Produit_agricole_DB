import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000/api',
    headers: {
        "Content-Type": 'application/json',
    },
});

// Fonctions d'appel API
// Fonctions d'appel API avec filtres optionnels
export const getGlobalStats = (period = '') => api.get(`/dashboard/stats-globales?period=${period}`);
export const getEvolutionData = (period = '') => api.get(`/dashboard/evolution?period=${period}`);
export const getActivityData = (period = '') => api.get(`/dashboard/activite?period=${period}`);
export const getAlertesStock = () => api.get('/dashboard/alertes');
export const getPredictions = () => api.get('/dashboard/predictions');
export const getTrends = () => api.get('/dashboard/trends');
// Cette fonction accepte un terme de recherche et une période
export const getRendementData = (searchTerm = '', period = '') =>
    api.get(`/dashboard/rendement?search=${searchTerm}&period=${period}`);

export const getRepartitionProduit = (period = '') => api.get(`/dashboard/repartition-produit?period=${period}`);
export const getTopVarietes = (period = '') => api.get(`/dashboard/top-varietes?period=${period}`);
export const getTopPertes = (period = '') => api.get(`/dashboard/top-pertes?period=${period}`);

// --- IMPORT ---
export const importVarietes = (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/import/varietes', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
};

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