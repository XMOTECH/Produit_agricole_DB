// ============================================================
// SECTION VUES (POUR LE DASHBOARD & RENDEMENT)
// ============================================================
const VIEW_QUERIES = [
    // KPI 1 : Revenus par variété (Total CA)
    {
        name: "View KPI_REVENUS",
        sql: `CREATE OR REPLACE VIEW KPI_REVENUS AS
              SELECT v.nom_variete, NVL(SUM(s.qte_kg * s.prix_unitaire), 0) as total_ca
              FROM VARIETE v
              LEFT JOIN VENTE s ON v.id_variete = s.id_variete
              GROUP BY v.nom_variete`
    },
    // KPI 2 : Alertes Stock Faible
    {
        name: "View ALERTE_STOCK",
        sql: `CREATE OR REPLACE VIEW ALERTE_STOCK AS
              SELECT nom_variete, stock_actuel_kg 
              FROM VARIETE 
              WHERE stock_actuel_kg < 10`
    },
    // KPI 3 : Rendement Détaillé (Le plus important pour l'analyse)
    {
        name: "View RENDEMENT_DETAIL",
        sql: `CREATE OR REPLACE VIEW RENDEMENT_DETAIL AS
              SELECT 
                v.id_variete, v.nom_variete, p.nom_produit,
                NVL((SELECT SUM(qte_kg) FROM RECOLTE WHERE id_variete = v.id_variete), 0) as qte_recoltee,
                NVL((SELECT SUM(qte_kg) FROM VENTE WHERE id_variete = v.id_variete), 0) as qte_vendue,
                NVL((SELECT SUM(qte_kg) FROM PERTE WHERE id_variete = v.id_variete), 0) as qte_perdue,
                v.stock_actuel_kg,
                NVL((SELECT SUM(qte_kg * prix_unitaire) FROM VENTE WHERE id_variete = v.id_variete), 0) as ca_total
              FROM VARIETE v
              JOIN PRODUIT p ON v.id_produit = p.id_produit`
    },
    // KPI 4 : Stats Globales (Pour les cartes du haut du Dashboard)
    {
        name: "View GLOBAL_STATS",
        sql: `CREATE OR REPLACE VIEW GLOBAL_STATS AS
              SELECT 
                (SELECT NVL(SUM(qte_kg),0) FROM RECOLTE) as total_recolte,
                (SELECT NVL(SUM(qte_kg * prix_unitaire),0) FROM VENTE) as total_vente_fcfa,
                (SELECT NVL(SUM(qte_kg),0) FROM PERTE) as total_perte_kg,
                -- KPI: Taux d'écoulement = (Total Vendu / Total Récolté) * 100
                ROUND(
                    CASE WHEN (SELECT NVL(SUM(qte_kg),0) FROM RECOLTE) > 0 
                    THEN ((SELECT NVL(SUM(qte_kg),0) FROM VENTE) / (SELECT NVL(SUM(qte_kg),0) FROM RECOLTE)) * 100 
                    ELSE 0 END, 
                2) as taux_ecoulement,
                -- KPI: Valeur Stock Estimée = Somme (Stock Variété * Prix Moyen Variété)
                (SELECT NVL(SUM(v.stock_actuel_kg * (
                    SELECT NVL(AVG(s.prix_unitaire), 0) FROM VENTE s WHERE s.id_variete = v.id_variete
                )), 0) FROM VARIETE v) as valeur_stock_estimee
              FROM DUAL`
    },
    // Vue pour le graphique d'évolution des ventes (Par jour)
    {
        name: "View EVOLUTION_VENTES",
        sql: `CREATE OR REPLACE VIEW EVOLUTION_VENTES AS
              SELECT 
                  TO_CHAR(date_vente, 'YYYY-MM-DD') as jour,
                  SUM(qte_kg * prix_unitaire) as total_ca
              FROM VENTE
              GROUP BY TO_CHAR(date_vente, 'YYYY-MM-DD')
              ORDER BY jour ASC`
    },
    {
        name: "View REPARTITION_CA_PRODUIT",
        sql: `CREATE OR REPLACE VIEW REPARTITION_CA_PRODUIT AS
              SELECT p.nom_produit, SUM(v.qte_kg * v.prix_unitaire) as value
              FROM VENTE v
              JOIN VARIETE var ON v.id_variete = var.id_variete
              JOIN PRODUIT p ON var.id_produit = p.id_produit
              GROUP BY p.nom_produit`
    },
    // Vue Combinée pour le Graphique Décideur (Recolte vs Vente vs Revenu)
    {
        name: "View V_ACTIVITE_JOUR",
        sql: `CREATE OR REPLACE VIEW V_ACTIVITE_JOUR AS
              SELECT jour, 
                     SUM(qte_recolte) as qte_recolte, 
                     SUM(qte_vente) as qte_vente, 
                     SUM(revenu) as revenu, 
                     SUM(qte_perte) as qte_perte
              FROM (
                  SELECT TO_CHAR(date_rec, 'YYYY-MM-DD') as jour, qte_kg as qte_recolte, 0 as qte_vente, 0 as revenu, 0 as qte_perte FROM RECOLTE
                  UNION ALL
                  SELECT TO_CHAR(date_vente, 'YYYY-MM-DD') as jour, 0 as qte_recolte, qte_kg as qte_vente, qte_kg * prix_unitaire as revenu, 0 as qte_perte FROM VENTE
                  UNION ALL
                  SELECT TO_CHAR(date_perte, 'YYYY-MM-DD') as jour, 0 as qte_recolte, 0 as qte_vente, 0 as revenu, qte_kg as qte_perte FROM PERTE
              )
              GROUP BY jour
              ORDER BY jour ASC`
    },
];

module.exports = VIEW_QUERIES;
