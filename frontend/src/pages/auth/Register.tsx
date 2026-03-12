import React, { useState } from 'react';
import { register } from '../../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus } from 'lucide-react';

const Register: React.FC = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        role: 'BUYER'
    });
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsLoading(true);

        try {
            await register(formData);
            setSuccess('Compte créé avec succès ! Redirection vers la connexion...');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err: any) {
            setError(typeof err.response?.data?.message === 'string' 
                ? err.response.data.message 
                : err.response?.data?.message?.[0] || 'Erreur lors de l\'inscription');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.header}>
                    <h1 style={styles.title}>Créer un compte</h1>
                    <p style={styles.subtitle}>Rejoignez la plateforme en 1 minute</p>
                </div>

                {error && <div style={styles.error}><span>{error}</span></div>}
                {success && <div style={styles.success}><span>{success}</span></div>}

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.row}>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Prénom</label>
                            <input
                                name="firstName"
                                type="text"
                                style={styles.input}
                                value={formData.firstName}
                                onChange={handleChange}
                            />
                        </div>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Nom</label>
                            <input
                                name="lastName"
                                type="text"
                                style={styles.input}
                                value={formData.lastName}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Email *</label>
                        <input
                            name="email"
                            type="email"
                            required
                            style={styles.input}
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>
                    
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Mot de passe *</label>
                        <input
                            name="password"
                            type="password"
                            required
                            minLength={6}
                            style={styles.input}
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Je suis un :</label>
                        <select name="role" style={styles.input} value={formData.role} onChange={handleChange}>
                            <option value="BUYER">Acheteur (Supermarché, particulier)</option>
                            <option value="SELLER">Agriculteur / Vendeur</option>
                        </select>
                    </div>

                    <button type="submit" style={styles.button} disabled={isLoading}>
                        {isLoading ? <span>Création...</span> : <><UserPlus size={20} /> <span>S'inscrire</span></>}
                    </button>
                    
                    <div style={styles.footer}>
                        Déjà un compte ? <Link to="/login" style={styles.link}>Se connecter</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Utilisation partielle des mêmes styles que Login pour la cohérence
const styles: any = {
    container: { height: '100vh', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc', fontFamily: "'Poppins', sans-serif", boxSizing: 'border-box' },
    card: { backgroundColor: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', width: '100%', maxWidth: '450px', boxSizing: 'border-box' },
    header: { display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '30px' },
    title: { margin: '0 0 5px 0', color: '#1e293b', fontSize: '24px', fontWeight: 'bold' },
    subtitle: { margin: 0, color: '#64748b', fontSize: '14px' },
    form: { display: 'flex', flexDirection: 'column', gap: '20px', width: '100%', boxSizing: 'border-box' },
    row: { display: 'flex', gap: '15px', width: '100%' },
    inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, minWidth: 0 }, // minWidth 0 prevents flex child from overflowing container
    label: { fontSize: '14px', fontWeight: '500', color: '#334155' },
    input: { padding: '10px 15px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '15px', outline: 'none', width: '100%', boxSizing: 'border-box' },
    button: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', backgroundColor: '#16a34a', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', width: '100%' },
    error: { backgroundColor: '#fee2e2', color: '#ef4444', padding: '10px', borderRadius: '8px', fontSize: '14px', marginBottom: '20px', textAlign: 'center' },
    success: { backgroundColor: '#dcfce3', color: '#16a34a', padding: '10px', borderRadius: '8px', fontSize: '14px', marginBottom: '20px', textAlign: 'center' },
    footer: { marginTop: '10px', textAlign: 'center', fontSize: '14px', color: '#64748b' },
    link: { color: '#16a34a', textDecoration: 'none', fontWeight: '500' }
};

export default Register;
