// ============================================================
// SECTION DATA MINING & PREDICTIVE ANALYTICS (Oracle SQL)
// ============================================================

const ML_QUERIES = [
    // 1. ANALYSE DE TENDANCE (Régression Linéaire via REGR_SLOPE)
    // Détermine mathématiquement si les ventes d'une variété sont en hausse ou en baisse
    {
        name: "View V_ML_TRENDS",
        sql: `CREATE OR REPLACE VIEW V_ML_TRENDS AS
              SELECT 
                  v.nom_variete,
                  -- Pente de la régression (Y=Quantité, X=Jour Julien)
                  REGR_SLOPE(s.qte_kg, TO_NUMBER(TO_CHAR(s.date_vente, 'J'))) as slope,
                  -- Qualité de la régression (R²)
                  REGR_R2(s.qte_kg, TO_NUMBER(TO_CHAR(s.date_vente, 'J'))) as reliability,
                  -- Interprétation Humaine
                  CASE 
                      WHEN REGR_SLOPE(s.qte_kg, TO_NUMBER(TO_CHAR(s.date_vente, 'J'))) > 0.5 THEN 'Croissance Forte 🚀'
                      WHEN REGR_SLOPE(s.qte_kg, TO_NUMBER(TO_CHAR(s.date_vente, 'J'))) > 0 THEN 'Légère Hausse ↗️'
                      WHEN REGR_SLOPE(s.qte_kg, TO_NUMBER(TO_CHAR(s.date_vente, 'J'))) < -0.5 THEN 'Déclin Rapide 📉'
                      WHEN REGR_SLOPE(s.qte_kg, TO_NUMBER(TO_CHAR(s.date_vente, 'J'))) < 0 THEN 'Légère Baisse ↘️'
                      ELSE 'Stable ➡️' 
                  END as tendance_txt
              FROM VARIETE v
              JOIN VENTE s ON v.id_variete = s.id_variete
              GROUP BY v.nom_variete`
    },

    // 2. PRÉDICTION DE RUPTURE DE STOCK (Extrapolation)
    // Estime le nombre de jours restants avant rupture basée sur la moyenne mobile des ventes
    {
        name: "View V_ML_STOCK_PREDICT",
        sql: `CREATE OR REPLACE VIEW V_ML_STOCK_PREDICT AS
              WITH DailySales AS (
                  SELECT id_variete, AVG(qte_kg) as avg_daily_sale
                  FROM VENTE 
                  -- Analyse sur les 30 derniers jours pour pertinence
                  WHERE date_vente >= SYSDATE - 30 
                  GROUP BY id_variete
              )
              SELECT 
                  v.nom_variete,
                  v.stock_actuel_kg,
                  ROUND(ds.avg_daily_sale, 2) as vente_moyenne_jour,
                  -- Formule : Stock Actuel / Vente Moyenne
                  CASE 
                      WHEN ds.avg_daily_sale > 0 THEN ROUND(v.stock_actuel_kg / ds.avg_daily_sale)
                      ELSE 999 -- Considéré comme infini si pas de vente
                  END as jours_restants,
                  -- Niveau d'urgence (Machine Learning basique par seuils)
                  CASE 
                      WHEN ds.avg_daily_sale > 0 AND (v.stock_actuel_kg / ds.avg_daily_sale) < 3 THEN 'CRITIQUE'
                      WHEN ds.avg_daily_sale > 0 AND (v.stock_actuel_kg / ds.avg_daily_sale) < 7 THEN 'ATTENTION'
                      ELSE 'NORMAL'
                  END as niveau_urgence
              FROM VARIETE v
              LEFT JOIN DailySales ds ON v.id_variete = ds.id_variete`
    }
];

module.exports = ML_QUERIES;
