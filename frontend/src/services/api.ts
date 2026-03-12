import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { User, Product } from '../types';

const api: AxiosInstance = axios.create({
    baseURL: 'http://localhost:3005/api',
    headers: {
        "Content-Type": 'application/json',
    },
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => Promise.reject(error));

// --- AUTHENTIFICATION ---
export const login = (credentials: any) => axios.post('http://localhost:3005/auth/login', credentials);
export const register = (userData: any) => axios.post('http://localhost:3005/auth/register', userData);

// Fonctions d'appel API avec filtres optionnels
export const getGlobalStats = (period: string = '') => api.get(`/dashboard/stats-globales?period=${period}`);
export const getEvolutionData = (period: string = '') => api.get(`/dashboard/evolution?period=${period}`);
export const getActivityData = (period: string = '') => api.get(`/dashboard/activite?period=${period}`);
export const getAlertesStock = () => api.get('/dashboard/alertes');
export const getPredictions = () => api.get('/dashboard/predictions');
export const getTrends = () => api.get('/dashboard/trends');
// Cette fonction accepte un terme de recherche et une période
export const getRendementData = (searchTerm: string = '', period: string = '') =>
    api.get(`/dashboard/rendement?search=${searchTerm}&period=${period}`);

export const getRepartitionProduit = (period: string = '') => api.get(`/dashboard/repartition-produit?period=${period}`);
export const getTopVarietes = (period: string = '') => api.get(`/dashboard/top-varietes?period=${period}`);
export const getTopPertes = (period: string = '') => api.get(`/dashboard/top-pertes?period=${period}`);

// --- IMPORT ---
export const importVarietes = (file: File) => {
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
export const addRecolte = (data: any) => api.post('/recoltes', data);
export const addVente = (data: any) => api.post('/ventes', data);

// --- HISTORIQUES (LECTURE) ---
export const getHistoriqueRecoltes = () => api.get('/historique/recoltes');
export const getHistoriqueVentes = () => api.get('/historique/ventes');

// --- ADMINISTRATION (REFERENTIELS) ---
export const addProduit = (data: any) => api.post('/produits', data);
export const addVariete = (data: any) => api.post('/varietes', data);

// --- PERTES ---
export const addPerte = (data: any) => api.post('/pertes', data);

export default api;