import React, { useState } from 'react';
import { Upload, FileType, CheckCircle, AlertCircle } from 'lucide-react';
import { importVarietes } from '../../services/api';

const CsvImporter = ({ onImportSuccess }) => {
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState({ type: '', text: '' });
    const [uploading, setUploading] = useState(false);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && (selectedFile.name.endsWith('.csv') || selectedFile.type === 'text/csv')) {
            setFile(selectedFile);
            setStatus({ type: '', text: '' });
        } else {
            setStatus({ type: 'error', text: 'Veuillez sélectionner un fichier CSV.' });
        }
    };

    const handleUpload = async () => {
        if (!file) return;
        setUploading(true);
        setStatus({ type: 'info', text: 'Importation en cours...' });

        try {
            const res = await importVarietes(file);
            setStatus({ type: 'success', text: res.data.message });
            setFile(null);
            if (onImportSuccess) onImportSuccess();
        } catch (err) {
            const errorMsg = err.response?.data?.error || "Erreur lors de l'import.";
            setStatus({ type: 'error', text: errorMsg });
        } finally {
            setUploading(false);
        }
    };

    const styles = {
        container: {
            padding: '20px',
            border: '2px dashed #cbd5e1',
            borderRadius: '12px',
            textAlign: 'center',
            backgroundColor: '#f8fafc',
            transition: 'all 0.3s ease',
            marginTop: '20px'
        },
        title: { fontSize: '1rem', fontWeight: 'bold', marginBottom: '10px', color: '#1e293b' },
        desc: { fontSize: '0.85rem', color: '#64748b', marginBottom: '15px' },
        fileInput: { display: 'none' },
        selectBtn: {
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            backgroundColor: 'white',
            border: '1px solid #cbd5e1',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '0.9rem',
            fontWeight: '600',
            color: '#475569'
        },
        uploadBtn: {
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            backgroundColor: '#10b981',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '0.9rem',
            fontWeight: '600',
            color: 'white',
            marginTop: '10px'
        },
        status: (type) => ({
            marginTop: '15px',
            padding: '10px',
            borderRadius: '8px',
            fontSize: '0.85rem',
            backgroundColor: type === 'success' ? '#dcfce7' : (type === 'error' ? '#fee2e2' : '#e0f2fe'),
            color: type === 'success' ? '#166534' : (type === 'error' ? '#991b1b' : '#0369a1'),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
        })
    };

    return (
        <div style={styles.container}>
            <div style={styles.title}>Importation Massive CSV</div>
            <p style={styles.desc}>
                Format attendu : <br />
                <code style={{ backgroundColor: '#e2e8f0', padding: '2px 4px', borderRadius: '4px', fontSize: '0.75rem' }}>NOM_PRODUIT, NOM_VARIETE, DESCRIPTION</code>
            </p>

            {!file ? (
                <label style={styles.selectBtn}>
                    <Upload size={18} /> Sélectionner un fichier .csv
                    <input type="file" accept=".csv" style={styles.fileInput} onChange={handleFileChange} />
                </label>
            ) : (
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '10px', color: '#1e293b', fontWeight: '500' }}>
                        <FileType size={20} color="#10b981" /> {file.name}
                    </div>
                    <button style={styles.uploadBtn} onClick={handleUpload} disabled={uploading}>
                        {uploading ? 'Importation en cours...' : 'Lancer l\'importation'}
                    </button>
                    <button
                        style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '0.85rem', cursor: 'pointer', marginLeft: '10px' }}
                        onClick={() => setFile(null)}
                    >
                        Annuler
                    </button>
                </div>
            )}

            {status.text && (
                <div style={styles.status(status.type)}>
                    {status.type === 'success' && <CheckCircle size={16} />}
                    {status.type === 'error' && <AlertCircle size={16} />}
                    {status.text}
                </div>
            )}
        </div>
    );
};

export default CsvImporter;
