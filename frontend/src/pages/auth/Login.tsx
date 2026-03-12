import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { login } from '../../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn } from 'lucide-react';

const Login: React.FC = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [error, setError] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { loginUser } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await login(credentials);
            loginUser(response.data.access_token, response.data.user);
            
            // Redirect based on role
            if (response.data.user.role === 'BUYER') {
                navigate('/stocks'); // Buyers see catalog
            } else {
                navigate('/'); // Sellers see dashboard
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erreur de connexion');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.header}>
                    <h1 style={styles.title}>Connexion</h1>
                    <p style={styles.subtitle}>Accédez à votre espace sécurisé</p>
                </div>

                {error && <div style={styles.error}><span>{error}</span></div>}

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Email</label>
                        <input
                            type="email"
                            required
                            style={styles.input}
                            value={credentials.email}
                            onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                        />
                    </div>
                    
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Mot de passe</label>
                        <input
                            type="password"
                            required
                            style={styles.input}
                            value={credentials.password}
                            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                        />
                    </div>

                    <button type="submit" style={styles.button} disabled={isLoading}>
                        {isLoading ? <span>Connexion...</span> : <><LogIn size={20} /> <span>Se connecter</span></>}
                    </button>
                    
                    <div style={styles.footer}>
                        Pas encore de compte ? <Link to="/register" style={styles.link}>S'inscrire</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

const styles: any = {
    container: {
        height: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8fafc',
        fontFamily: "'Poppins', sans-serif",
        boxSizing: 'border-box'
    },
    card: {
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        width: '100%',
        maxWidth: '400px',
        boxSizing: 'border-box'
    },
    header: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: '30px'
    },
    title: {
        margin: '0 0 5px 0',
        color: '#1e293b',
        fontSize: '24px',
        fontWeight: 'bold'
    },
    subtitle: {
        margin: 0,
        color: '#64748b',
        fontSize: '14px'
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        width: '100%',
        boxSizing: 'border-box'
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        width: '100%'
    },
    label: {
        fontSize: '14px',
        fontWeight: '500',
        color: '#334155'
    },
    input: {
        padding: '10px 15px',
        borderRadius: '8px',
        border: '1px solid #cbd5e1',
        fontSize: '15px',
        outline: 'none',
        width: '100%',
        boxSizing: 'border-box',
        transition: 'border-color 0.2s',
        '&:focus': {
            borderColor: '#16a34a'
        }
    },
    button: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        backgroundColor: '#16a34a',
        color: 'white',
        border: 'none',
        padding: '12px',
        borderRadius: '8px',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
        width: '100%'
    },
    error: {
        backgroundColor: '#fee2e2',
        color: '#ef4444',
        padding: '10px',
        borderRadius: '8px',
        fontSize: '14px',
        marginBottom: '20px',
        textAlign: 'center'
    },
    footer: {
        marginTop: '10px',
        textAlign: 'center',
        fontSize: '14px',
        color: '#64748b'
    },
    link: {
        color: '#16a34a',
        textDecoration: 'none',
        fontWeight: '500'
    }
};

export default Login;
