import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generateReport = (globalStats, activityData, predictions, topVarietes) => {
    const doc = new jsPDF();
    const dateStr = new Date().toLocaleDateString('fr-FR');
    const timeStr = new Date().toLocaleTimeString('fr-FR');

    // --- PAGE DE GARDE ---
    doc.setFillColor(16, 185, 129); // Green Primary
    doc.rect(0, 0, 210, 40, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(26);
    doc.text("RAPPORT STRATÉGIQUE", 105, 20, null, null, "center");
    doc.setFontSize(14);
    doc.text(`Généré le ${dateStr} à ${timeStr}`, 105, 30, null, null, "center");

    // --- 1. SYNTHÈSE EXÉCUTIVE ---
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.text("1. Synthèse de la Performance", 14, 55);

    const kpiData = [
        ["Chiffre d'Affaires", globalStats.TOTAL_VENTE_FCFA?.toLocaleString() + ' F'],
        ["Volume Récolté", globalStats.TOTAL_RECOLTE + ' kg'],
        ["Volume Perdu", globalStats.TOTAL_PERTE_KG + ' kg'],
        ["Taux d'Écoulement", (globalStats.TAUX_ECOULEMENT || 0) + '%'],
        ["Valeur Stock Estimée", (globalStats.VALEUR_STOCK_ESTIMEE || 0).toLocaleString() + ' F']
    ];

    autoTable(doc, {
        startY: 60,
        head: [['Indicateur Clé', 'Valeur Actuelle']],
        body: kpiData,
        theme: 'striped',
        headStyles: { fillColor: [16, 185, 129] },
        styles: { fontSize: 12 }
    });

    // --- 2. ANALYSE PRÉDICTIVE (AI) ---
    doc.text("2. Prédictions & Risques (IA Analyse)", 14, doc.lastAutoTable.finalY + 20);

    let predBody = [];
    if (predictions && predictions.length > 0) {
        predBody = predictions.map(p => [
            p.NOM_VARIETE,
            p.JOURS_RESTANTS + ' jours',
            p.NIVEAU_URGENCE
        ]);
    } else {
        predBody = [["Aucun risque critique détecté", "-", "RAS"]];
    }

    autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 25,
        head: [['Variété', 'Rupture Estimée', 'Niveau Urgence']],
        body: predBody,
        theme: 'grid',
        headStyles: { fillColor: [220, 38, 38] }, // Red for alerts
        columnStyles: { 2: { fontStyle: 'bold', textColor: [220, 38, 38] } }
    });

    // --- 3. TOP PERFORMERS ---
    doc.text("3. Top 5 Variétés (Rentabilité)", 14, doc.lastAutoTable.finalY + 20);

    const topBody = topVarietes.map(t => [t.NOM_VARIETE, t.TOTAL_CA.toLocaleString() + ' F']);

    autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 25,
        head: [['Variété', 'Revenus Générés']],
        body: topBody,
        theme: 'plain',
        headStyles: { fillColor: [59, 130, 246] }
    });

    // --- FOOTER ---
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text("Agri-Ges Intelligence System - Confidentiel", 105, 290, null, null, "center");

    // SAVE
    doc.save(`Rapport_Agricole_${dateStr.replace(/\//g, '-')}.pdf`);
};
