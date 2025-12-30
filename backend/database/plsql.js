// ============================================================
// SECTION PL/SQL (TRIGGERS CRUD & FONCTIONS)
// ============================================================
const PLSQL_QUERIES = [

    // --- A. GESTION DES RÉCOLTES (Insert/Update/Delete) ---
    {
        name: "Trigger MVT_RECOLTE",
        sql: `CREATE OR REPLACE TRIGGER MVT_RECOLTE
              AFTER INSERT OR UPDATE OR DELETE ON RECOLTE
              FOR EACH ROW
              BEGIN
                  IF INSERTING THEN
                      UPDATE VARIETE SET stock_actuel_kg = stock_actuel_kg + :NEW.qte_kg
                      WHERE id_variete = :NEW.id_variete;
                  ELSIF DELETING THEN
                      UPDATE VARIETE SET stock_actuel_kg = stock_actuel_kg - :OLD.qte_kg
                      WHERE id_variete = :OLD.id_variete;
                  ELSIF UPDATING THEN
                      UPDATE VARIETE SET stock_actuel_kg = stock_actuel_kg - :OLD.qte_kg + :NEW.qte_kg
                      WHERE id_variete = :NEW.id_variete;
                  END IF;
              END;`
    },

    // --- B. GESTION DES VENTES (Sécurité + Mouvement Stock) ---

    // 1. Trigger de Sécurité (BEFORE) : Empêche de vendre ce qu'on n'a pas
    {
        name: "Trigger CHECK_VENTE",
        sql: `CREATE OR REPLACE TRIGGER CHECK_VENTE
              BEFORE INSERT OR UPDATE ON VENTE
              FOR EACH ROW
              DECLARE
                  stock NUMBER;
                  delta NUMBER;
              BEGIN
                  IF INSERTING THEN delta := :NEW.qte_kg;
                  ELSE delta := :NEW.qte_kg - :OLD.qte_kg; -- Delta positif si on augmente la vente
                  END IF;

                  SELECT stock_actuel_kg INTO stock FROM VARIETE WHERE id_variete = :NEW.id_variete;
                  
                  -- Si on retire du stock (delta > 0) et qu'il n'y en a pas assez
                  IF delta > 0 AND stock < delta THEN
                      RAISE_APPLICATION_ERROR(-20001, 'Erreur : Stock insuffisant pour cette vente !');
                  END IF;
              END;`
    },
    // 2. Trigger de Mise à jour (AFTER) : Décrémente le stock
    {
        name: "Trigger MVT_VENTE",
        sql: `CREATE OR REPLACE TRIGGER MVT_VENTE
              AFTER INSERT OR UPDATE OR DELETE ON VENTE
              FOR EACH ROW
              BEGIN
                  IF INSERTING THEN
                      UPDATE VARIETE SET stock_actuel_kg = stock_actuel_kg - :NEW.qte_kg 
                      WHERE id_variete = :NEW.id_variete;
                  ELSIF DELETING THEN
                      UPDATE VARIETE SET stock_actuel_kg = stock_actuel_kg + :OLD.qte_kg 
                      WHERE id_variete = :OLD.id_variete; -- Annulation vente = Retour stock
                  ELSIF UPDATING THEN
                      UPDATE VARIETE SET stock_actuel_kg = stock_actuel_kg + :OLD.qte_kg - :NEW.qte_kg 
                      WHERE id_variete = :NEW.id_variete;
                  END IF;
              END;`
    },

    // --- C. GESTION DES PERTES (Sécurité + Mouvement Stock) ---

    // 1. Trigger de Sécurité (BEFORE)
    {
        name: "Trigger CHECK_PERTE",
        sql: `CREATE OR REPLACE TRIGGER CHECK_PERTE
              BEFORE INSERT OR UPDATE ON PERTE
              FOR EACH ROW
              DECLARE
                  stock NUMBER;
              BEGIN
                  SELECT stock_actuel_kg INTO stock FROM VARIETE WHERE id_variete = :NEW.id_variete;
                  IF :NEW.qte_kg > stock THEN
                      RAISE_APPLICATION_ERROR(-20002, 'Impossible de perdre plus que le stock disponible !');
                  END IF;
              END;`
    },
    // 2. Trigger de Mise à jour (AFTER)
    {
        name: "Trigger MVT_PERTE",
        sql: `CREATE OR REPLACE TRIGGER MVT_PERTE
              AFTER INSERT OR UPDATE OR DELETE ON PERTE
              FOR EACH ROW
              BEGIN
                  IF INSERTING THEN
                      UPDATE VARIETE SET stock_actuel_kg = stock_actuel_kg - :NEW.qte_kg 
                      WHERE id_variete = :NEW.id_variete;
                  ELSIF DELETING THEN
                      UPDATE VARIETE SET stock_actuel_kg = stock_actuel_kg + :OLD.qte_kg 
                      WHERE id_variete = :OLD.id_variete;
                  ELSIF UPDATING THEN
                      UPDATE VARIETE SET stock_actuel_kg = stock_actuel_kg + :OLD.qte_kg - :NEW.qte_kg 
                      WHERE id_variete = :NEW.id_variete;
                  END IF;
              END;`
    },


    // --- D. FONCTION FINANCIÈRE ---
    {
        name: "Fonction CA_TOTAL",
        sql: `CREATE OR REPLACE FUNCTION CA_TOTAL RETURN NUMBER IS
                  total NUMBER;
              BEGIN
                  SELECT NVL(SUM(qte_kg * prix_unitaire), 0) INTO total FROM VENTE;
                  RETURN total;
              END;`
    },

    // --- E. JEU DE DONNÉES TEST ---
    {
        name: "Procédure INIT_TEST_DATA",
        sql: `CREATE OR REPLACE PROCEDURE INIT_TEST_DATA AS
                  prod_id NUMBER;
                  var_id NUMBER;
              BEGIN
                  -- On ne crée les données que si la table est vide
                  INSERT INTO PRODUIT (nom_produit) VALUES ('Chou') RETURNING id_produit INTO prod_id;
                  INSERT INTO VARIETE (nom_variete, description, id_produit) VALUES ('Chou rouge', 'Variété test', prod_id) RETURNING id_variete INTO var_id;
                  INSERT INTO RECOLTE (qte_kg, id_variete) VALUES (100, var_id);
                  COMMIT;
              END;`
    },
    { name: "EXECUTION DONNEES TEST", sql: `BEGIN INIT_TEST_DATA; END;` }
];

module.exports = PLSQL_QUERIES;
