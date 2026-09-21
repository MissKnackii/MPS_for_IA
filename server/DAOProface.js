const sql = require("mssql");
function daysDiff(date) {
    let dateFrom = new Date(new Date(date).getFullYear(), 0, 1);
    let dateTo = new Date(date);
    const diffTime = Math.abs(dateTo - dateFrom);
    return resu = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}
function weeksDiff(date) {
    let dateFrom = new Date(new Date(date).getFullYear(), 0, 1);
    let dateTo = new Date(date);
    return Math.round((dateTo - dateFrom) / (7 * 24 * 60 * 60 * 1000));
}

function monthDiff(date) {
    let dateFrom = new Date(new Date(date).getFullYear(), 0, 1);
    let dateTo = new Date(date);
    return dateTo.getMonth() - dateFrom.getMonth() + (12 * (dateTo.getFullYear() - dateFrom.getFullYear()))
}

function addMonths(date, months) {
    let dateDebut = new Date(date);
    var d = dateDebut.getDate();
    dateDebut.setMonth(dateDebut.getMonth() + +months);
    if (dateDebut.getDate() != d) {
        dateDebut.setDate(0);
    }
    return convertDate(dateDebut);
}

function getQuarter(date) {
    //Janv-Mars = 1
    //Avr--Juin = 2
    //Juil-Sept = 3
    //Oct- Dec = 4
    let d = new Date(date);
    var q = [1,2,3,4];
    return q[Math.floor(d.getMonth() / 3)];
}

function getSemester(date) {
    //Janv-Juin = 1
    //Juil-Dec = 2
    let d = new Date(date);
    var q = [1,2];
    return q[Math.floor(d.getMonth() / 6)];
}

function addDays(date, numberOfDay) {
    let d = new Date(date);
    d.setDate(d.getDate() + numberOfDay);
    return convertDate(d);
}

function addWeeks(date, weeks) {
    let d = new Date(date);
    d.setDate(d.getDate() + weeks * 7);
    return convertDate(d);
}

function convertDate(inputFormat) {
    function pad(s) { return (s < 10) ? '0' + s : s; }
    var d = new Date(inputFormat)
    return [pad(d.getDate()), pad(d.getMonth()+1), d.getFullYear()].join('-')
}

class DAOProface {
    constructor() {
        this.sqlConfig = {
            user: 'intranet',
            password: 'PWD',
            database: 'PROFACE',
            server: 'SRV-RH',
            pool: {
                max: 10,
                min: 0,
                idleTimeoutMillis: 30000
            },
            options: {
                encrypt: false,
                enableArithAbort: false
            }
        }
    }

    async connect() {
        console.log("Connecting Proface database ...");
        try {
            await sql.connect(this.sqlConfig).then(() => {
                console.log("Database connected !")
            })
        } catch (error) {
            console.log("Error, cannot run script : ", error)
        }
    }

    async sendDemande(nom, service, nature, marque, categorie, reference1, unite1, qte1, reference2, unite2, qte2, reference3, unite3, qte3, reference4, unite4, qte4, reference5, unite5, qte5, commentaire, refe, delai, urg, livraison, justificatif) {
        try {
            let request = "INSERT INTO PROFACE.dbo.Demandes(nomSalarie, service, natureDemande, nomFournisseur, codeCategorie, referenceProduit1, uniteProduit1, qteProduit1, referenceProduit2, uniteProduit2, qteProduit2, referenceProduit3, uniteProduit3, qteProduit3, referenceProduit4, uniteProduit4, qteProduit4, referenceProduit5, uniteProduit5, qteProduit5, infosComplementaires, referencePiece, delaiDemande, urgent, justificatifDemande, etatDemande, lieuEnlevement) VALUES (\'"+nom+"\', \'"+service+"\', \'"+nature+"\', \'"+marque.replace(/'/gi,"''")+"\', \'"+categorie+"\', \'"+reference1.replace(/'/gi,"''")+"\', \'"+unite1+"\',"+qte1+", \'"+reference2.replace(/'/gi,"''")+"\', \'"+unite2+"\',"+qte2+", \'"+reference3.replace(/'/gi,"''")+"\', \'"+unite3+"\',"+qte3+", \'"+reference4.replace(/'/gi,"''")+"\', \'"+unite4+"\',"+qte4+", \'"+reference5.replace(/'/gi,"''")+"\', \'"+unite5+"\',"+qte5+", \'" + commentaire.replace(/'/gi,"''") + "\', \'" +refe+"\', \'"+delai+"\', "+urg+", \'"+justificatif.replace(/'/gi,"''")+"\', \'En attente de traitement\', \'"+livraison+"\');"
            let results = await sql.query(request);
            return results;
        } catch (e) {
            console.log(e);
        }
    }
    async getCategories() {
        try {
            let request = "SELECT code FROM PROFACE.dbo.CategoriesProduit;"

            let results = await sql.query(request);

            return results;
        } catch (e) {
            console.log(e);
        }
    }
    async getAllDemandes() {
        try {
            let request = "SELECT * FROM PROFACE.dbo.Demandes ORDER BY dateDemande DESC";

            let results = await sql.query(request);

            return results;
        } catch (e) {
            console.log(e);
        }
    }
    async getAllDemandesEnCours() {
        try {
/*
            let request = "SELECT * FROM PROFACE.dbo.Demandes ORDER BY dateDemande DESC";
*/
            let request = "SELECT * FROM PROFACE.dbo.Demandes WHERE etatDemande = \'En attente de traitement\' OR etatDemande = \'En cours de traitement\' ORDER BY dateDemande DESC";

            let results = await sql.query(request);

            return results;
        } catch (e) {
            console.log(e);
        }
    }
    async filtrer(ordreDateDemande,salarie, service, codeCategorie, nomFournisseur, numCommande, urgent, etat) {
        try {
            let request = "SELECT * FROM PROFACE.dbo.Demandes";

            if (salarie != "null" || service != "null" || codeCategorie != "null" || nomFournisseur != "null" || numCommande!= "null" || urgent != "null" || etat != "null") {
                request = request + " WHERE"

                if (salarie != "null") {
                    request = request + " nomSalarie = \'" + salarie +"\'";

                    if (service != "null" || codeCategorie != "null" || urgent != "null" || etat != "null") {
                        request = request + " AND"
                    }
                }

                if (service != "null") {
                    request = request + " service = \'" + service +"\'";

                    if (codeCategorie != "null" || urgent != "null" || etat != "null") {
                        request = request + " AND"
                    }
                }

                if (codeCategorie != "null") {
                    request = request + " codeCategorie = \'" + codeCategorie +"\'";

                    if (nomFournisseur != "null" || urgent != "null" || etat != "null") {
                        request = request + " AND"
                    }
                }

                if (nomFournisseur != "null") {
                    request = request + " nomFournisseur = \'" + nomFournisseur +"\'";

                    if (numCommande!= "null" || urgent != "null" || etat != "null") {
                        request = request + " AND"
                    }
                }

                if (numCommande != "null") {
                    request = request + " numCommande LIKE \'%" + numCommande +"%\'";

                    if (urgent != "null" || etat != "null") {
                        request = request + " AND"
                    }
                }

                if (urgent != "null") {
                    request = request + " urgent = " + urgent;

                    if (etat != "null") {
                        request = request + " AND"
                    }
                }

                if (etat != "null") {
                    request = request + " etatDemande = \'" + etat +"\'";
                }
                // else {
                // 	request = request + " AND etatDemande = \'En attente de traitement\' OR etatDemande = \'En cours de traitement\'";
                // }

            } else {
                request = request + " WHERE etatDemande = \'En attente de traitement\' OR etatDemande = \'En cours de traitement\'"
            }

            if (ordreDateDemande != "null") {
                if (ordreDateDemande === "Chronologique") {
                    request = request + " ORDER BY dateDemande"
                } else if (ordreDateDemande === "Antéchronologique") {
                    request = request + " ORDER BY dateDemande DESC"
                }
            } else {
                request = request + " ORDER BY dateDemande DESC"
            }
            //console.log(request);

            let results = await sql.query(request);

            return results;
        } catch (e) {
            console.log(e);
        }
    }
    async updateDemande(numDemande, nomFournisseur, delaiAttribue, etatDemande, numCommande, commentaires, lieuEnlevement) {
        try {
            let request;

            if (commentaires == "null" || commentaires == null) {
                commentaires = "-";
            }

            if (delaiAttribue == null || delaiAttribue == "null") {

                request = "UPDATE PROFACE.dbo.Demandes SET nomFournisseur = \'"+nomFournisseur.replace(/'/gi,"''")+"\', delaiAttribue = null, dateValidation = getDate(), etatDemande = \'"+etatDemande+"\', numCommande = \'"+numCommande+"\', commentaires = \'"+commentaires.replace(/'/gi,"''")+"\', lieuEnlevement = \'"+lieuEnlevement+"\'	WHERE numDemande = "+numDemande;
            } else {
                request = "UPDATE PROFACE.dbo.Demandes SET nomFournisseur = \'"+nomFournisseur.replace(/'/gi,"''")+"\', delaiAttribue = \'"+delaiAttribue+"\', dateValidation = getDate(), etatDemande = \'"+etatDemande+"\', numCommande = \'"+numCommande+"\', commentaires = \'"+commentaires.replace(/'/gi,"''")+"\', lieuEnlevement = \'"+lieuEnlevement+"\'	WHERE numDemande = "+numDemande;
            }

            let results = await sql.query(request);
            return results;
        } catch (e) {
            console.log(e);
        }
    }
    async receptionCommande(numDemande, etatDemande, numCommande, lieuEnlevement) {
        try {
            let request = "UPDATE PROFACE.dbo.Demandes SET etatDemande = \'"+etatDemande+"\', numCommande = \'"+numCommande+"\', lieuEnlevement = \'"+lieuEnlevement+"\'	WHERE numDemande = "+numDemande;
            let results = await sql.query(request);
            return results;
        } catch (e) {
            console.log(e);
        }
    }

    async filtrerMaintenance(periode, firstday, lastday, mois, annee, analytique, sousSecteur, site, moyen, idOperationMaintenance, etat, niveau) {
        try {
            const conditions = [
                "ope.idOperationGamme = opeM.id",
                "moy.code = ope.moyenCode",
                "ope.idOperationGamme = opeG.id",
                "ope.moyenCode = opeG.moyenCode"
            ];
            //console.log(periode, firstday, lastday, mois, annee, analytique, sousSecteur, site, moyen, idOperationMaintenance, etat, niveau)
            if (analytique !== null) conditions.push(`moy.codeAnalytique = '${analytique}'`);
            if (sousSecteur !== null) conditions.push(`moy.sousSecteur = '${sousSecteur}'`);
            if (site !== null) conditions.push(`moy.site = '${site}'`);
            if (moyen !== null) conditions.push(`ope.moyenCode = '${moyen}'`);
            // console.log(idOperationMaintenance);
            if (idOperationMaintenance !== null) conditions.push(`opeM.libelle = '${idOperationMaintenance.replace(/'/g, "''")}'`);
            if (etat !== null) conditions.push(`ope.etatOperation = '${etat}'`);
            if (niveau !== null) conditions.push(`opeM.niveau = ${niveau}`);
            // console.log(conditions);
            // 🔹 Période
            if (periode === "semaine") {
                // Inclure :
                // 1️⃣ Opérations chevauchant la période
                // 2️⃣ Opérations en retard dont la dateDebut > lastday
                conditions.push(`
                    (
                      (ope.dateDebut <= '${lastday}' AND ope.dateFin >= '${firstday}')
                      OR
                      (ope.dateDebut > '${lastday}' AND ope.etatOperation = 'en retard')
                    )
                `);
            } else if (periode === "mois") {
                // Même logique sur le mois
                conditions.push(`(
                ((MONTH(ope.dateDebut) = ${mois} AND YEAR(ope.dateDebut) = ${annee})
                  OR (MONTH(ope.dateFin) = ${mois} AND YEAR(ope.dateFin) = ${annee})
                  OR (ope.dateDebut <= EOMONTH(DATEFROMPARTS(${annee}, ${mois}, 1)) 
                      AND ope.dateFin >= DATEFROMPARTS(${annee}, ${mois}, 1)))
                   OR
                    (ope.dateDebut > EOMONTH(DATEFROMPARTS(${annee}, ${mois}, 1)) AND ope.etatOperation = 'en retard')
                )`);
            } else if (periode === "annee") {
                conditions.push(`(YEAR(ope.dateDebut) = ${annee} OR YEAR(ope.dateFin) = ${annee})`);
            }

            // 🔹 Si aucun état n’est spécifié → par défaut “en retard” et “à faire”
            if (!etat) {
                conditions.push(`ope.etatOperation IN ('en retard', 'à faire')`);
            }

            // 🔹 Requête finale
            const request = `
              SELECT DISTINCT
                opeM.libelle,
                opeM.niveau,
                ope.*,
                moy.codeAnalytique,
                moy.sousSecteur,
                moy.site,
                moy.libelle AS moyLibelle,
                opeG.periodicite
              FROM PROFACE.dbo.Maintenance_Operations ope
              JOIN PROFACE.dbo.Maintenance_OperationsMaintenance opeM ON ope.idOperationGamme = opeM.id
              JOIN PROFACE.dbo.Maintenance_Moyens moy ON moy.code = ope.moyenCode
              JOIN PROFACE.dbo.Maintenance_OperationsGamme opeG ON ope.idOperationGamme = opeG.id AND ope.moyenCode = opeG.moyenCode
              WHERE ${conditions.join(" AND ")}
              ORDER BY ope.moyenCode ASC, ope.dateDebut ASC
            `;
            console.log(request);
            const results = await sql.query(request);
            //console.log(results);
            return results;
        } catch (e) {
            console.error(e);
        }
    }
    async getOperations() {
        try {

            return await sql.query('SELECT TOP(200) m.libelle moyenLibelle, opeM.libelle, ope.* FROM PROFACE.dbo.Maintenance_Moyens m, PROFACE.dbo.Maintenance_Operations ope, PROFACE.dbo.Maintenance_OperationsMaintenance opeM WHERE ope.idOperationGamme = opeM.id AND ope.moyenCode = m.code ORDER BY dateDebut;')
        } catch (e) {
            console.log(e);
        }
    }

    async getSousSecteurs(analytique) {
        try {
            return await sql.query(`SELECT DISTINCT sousSecteur FROM PROFACE.dbo.Maintenance_Moyens WHERE codeAnalytique = '${analytique}'`)
        } catch (error) {
            console.log(error);
        }
    }

    async getMoyens(analytique, sousSecteur) {
        try {
            let request;
            if (analytique == 'null' && sousSecteur == 'null') {
                request = 'SELECT * FROM PROFACE.dbo.Maintenance_Moyens;';
            } else {
                if (analytique == 'null') {
                    request = `SELECT * FROM PROFACE.dbo.Maintenance_Moyens WHERE sousSecteur='${sousSecteur}';`;
                } else if (sousSecteur == 'null') {
                    request = `SELECT * FROM PROFACE.dbo.Maintenance_Moyens WHERE codeAnalytique='${analytique}';`
                } else {
                    request = `SELECT * FROM PROFACE.dbo.Maintenance_Moyens WHERE codeAnalytique='${analytique}' AND sousSecteur = '${sousSecteur}';`;
                }
            }
            return await sql.query(request);

        } catch (e) {
            console.log(e);
        }
    }
    async getOperationsMaintenance(niveau) {
        try {
            if (niveau == 'null') {
                return await sql.query('SELECT * FROM PROFACE.dbo.Maintenance_OperationsMaintenance ORDER BY libelle ASC;')
            } else {
                return await sql.query('SELECT * FROM PROFACE.dbo.Maintenance_OperationsMaintenance WHERE niveau = ' + niveau + ' ORDER BY libelle ASC;')
            }
        } catch (e) {
            console.log(e);
        }
    }
    async getMoyensStopped() {
        try {
            let req = `SELECT code FROM PROFACE.dbo.Maintenance_Moyens WHERE enArret = 1`;
            let res = await sql.query(req);

            return res;
        } catch (e) {
            console.log(e);
        }
    }
    async declareMoyenStopped(code) {
        try {
            let res = await sql.query(`UPDATE PROFACE.dbo.Maintenance_Moyens SET enArret = 1 WHERE code = '${code}'`);
            return res;
        } catch (e) {
            console.log("Error in declareMoyenStopped() : " + e);
            return 'ERROR';
        }
    }
    async restartMoyenStopped(code) {
        try {
            let res = await sql.query(`EXEC PROFACE.dbo.Maintenance_startMachine '${code}'`);
            return 'OK';
        } catch (e) {
            console.log("Error in restartMoyenStopped() : " + e);
            return 'ERROR';
        }
    }

    async getRetards(codeAnalytique) {
        try {
            let request = "SELECT COUNT(*) as \'retard\' FROM PROFACE.dbo.Maintenance_Operations ope, PROFACE.dbo.Maintenance_Moyens moy WHERE moy.code = ope.moyenCode AND ope.etatOperation = \'en retard\'";
            if (codeAnalytique != 'null' ) {
                request = request + ` AND moy.codeAnalytique ='${codeAnalytique}'`
            }
            return await sql.query(request);
        } catch (e) {
            console.log(e);
            return e;
        }
    }

    async getTauxAvancement(periode, firstday, lastday, mois, annee, codeAnalytique, sousSecteur, niveau, codeMoyen) {
        try {
            let request =
                `DECLARE @totalOpe int, @opeOK int, @tauxAvancement int;
				SET @totalOpe = 0;
				SET @opeOK = 0;
				SET @tauxAvancement = 0;`

            let requestTotalOpe = 'SELECT @totalOpe = COUNT(ope.refOperation) FROM PROFACE.dbo.Maintenance_Operations ope, PROFACE.dbo.Maintenance_OperationsMaintenance opeM, PROFACE.dbo.Maintenance_Moyens moy WHERE ope.idOperationGamme = opeM.id AND moy.code = ope.moyenCode';
            let requestOpeOK = 'SELECT @opeOK = COUNT(ope.refOperation) FROM PROFACE.dbo.Maintenance_Operations ope, PROFACE.dbo.Maintenance_OperationsMaintenance opeM, PROFACE.dbo.Maintenance_Moyens moy WHERE (etatOperation = \'validée\' OR etatOperation = \'annulée\') AND ope.idOperationGamme = opeM.id AND moy.code = ope.moyenCode';

            if (codeAnalytique != 'null' || sousSecteur != 'null' || niveau != 'null' || codeMoyen != 'null') {
                requestTotalOpe = requestTotalOpe + " AND";
                requestOpeOK = requestOpeOK + " AND";

                if (codeAnalytique != 'null') {
                    requestTotalOpe = `${requestTotalOpe} moy.codeAnalytique = '${codeAnalytique}'`;
                    requestOpeOK = `${requestOpeOK} moy.codeAnalytique = '${codeAnalytique}'`;

                    if (sousSecteur != 'null' || niveau != 'null' || codeMoyen != 'null') {
                        requestTotalOpe = requestTotalOpe + " AND";
                        requestOpeOK = requestOpeOK + " AND";
                    }
                }

                if (sousSecteur != 'null') {
                    requestTotalOpe = `${requestTotalOpe} moy.sousSecteur = '${sousSecteur}'`;
                    requestOpeOK = `${requestOpeOK} moy.sousSecteur = '${sousSecteur}'`;

                    if (niveau != 'null' || codeMoyen != 'null') {
                        requestTotalOpe = requestTotalOpe + " AND";
                        requestOpeOK = requestOpeOK + " AND";
                    }
                }

                if (niveau != 'null') {
                    requestTotalOpe = `${requestTotalOpe} opeM.niveau = ${niveau}`;
                    requestOpeOK = `${requestOpeOK} opeM.niveau = ${niveau}`;

                    if (codeMoyen != 'null') {
                        requestTotalOpe = requestTotalOpe + " AND";
                        requestOpeOK = requestOpeOK + " AND";
                    }
                }

                if (codeMoyen != 'null') {
                    requestTotalOpe = `${requestTotalOpe} moy.code = '${codeMoyen}'`;
                    requestOpeOK = `${requestOpeOK} moy.code = '${codeMoyen}'`;
                }

            }

            if (periode == "semaine") {
                requestTotalOpe = `${requestTotalOpe} AND ope.dateDebut BETWEEN '${firstday}' AND '${lastday}'`;
                requestOpeOK = `${requestOpeOK} AND ope.dateDebut BETWEEN '${firstday}' AND '${lastday}'`;
            } else if (periode == "mois") {
                requestTotalOpe = `${requestTotalOpe} AND MONTH(ope.dateDebut) = ${mois} AND YEAR(ope.dateDebut) = ${annee}`
                requestOpeOK = `${requestOpeOK} AND MONTH(ope.dateDebut) = ${mois} AND YEAR(ope.dateDebut) = ${annee}`;
            } else if (periode == "annee") {
                requestTotalOpe = `${requestTotalOpe} AND YEAR(ope.dateDebut) = ${annee}`;
                requestOpeOK = `${requestOpeOK} AND YEAR(ope.dateDebut) = ${annee}`;
            }

            request = `${request} \n${requestOpeOK}\n${requestTotalOpe}\n 
			IF @totalOpe = 0 
			BEGIN
				SELECT 100 as tauxAvancement;
			END
			ELSE
			BEGIN 
				SELECT @opeOK*100/@totalOpe as tauxAvancement;
			END`

            let results = await sql.query(request);
            return results;
        } catch (e) {
            console.log(e);
        }
    }
    async updateOperation(refOperation, action, visa, commentaires, dateDebut, dateFin)
    {
        console.log(refOperation, action, visa, commentaires, dateDebut, dateFin);
        if (refOperation === null || action === null || visa === null) {
            console.log("Il en manque");
        } else {
            let request = "";
            if (action === 'enregistrer'){
                request = `UPDATE PROFACE.dbo.Maintenance_Operations SET dateDebut='${dateDebut}', dateFin='${dateFin}', commentaire = '${commentaires.replace(/'/g,"''")}' WHERE refOperation = '${refOperation}'`;
            }
            if (action === 'valider') {
                if (commentaires === 'null'|| commentaires === null) {
                    request = `UPDATE PROFACE.dbo.Maintenance_Operations SET etatOperation = 'validée', visa = '${visa}', commentaire = null, dateAction = GETDATE(), dateDebut='${dateDebut}', dateFin='${dateFin}' WHERE refOperation = '${refOperation}'`;
                } else {
                    request = `UPDATE PROFACE.dbo.Maintenance_Operations SET etatOperation = 'validée', visa = '${visa}', commentaire = '${commentaires.replace(/'/g,"''")}', dateAction = GETDATE(), dateDebut='${dateDebut}', dateFin='${dateFin}' WHERE refOperation = '${refOperation}'`;
                }
            } else if (action === 'annuler') {
                if (commentaires === 'null' || commentaires === null) {
                    request = `UPDATE PROFACE.dbo.Maintenance_Operations SET etatOperation = 'annulée',  visa = '${visa}', commentaire = null, dateAction = GETDATE(), dateDebut='${dateDebut}', dateFin='${dateFin}' WHERE refOperation = '${refOperation}'`;
                } else {
                    request = `UPDATE PROFACE.dbo.Maintenance_Operations SET etatOperation = 'annulée',  visa = '${visa}', commentaire = '${commentaires.replace(/'/g,"''")}', dateAction = GETDATE(), dateDebut='${dateDebut}', dateFin='${dateFin}' WHERE refOperation = '${refOperation}'`;
                }
            } else if (action === 'reinitialiser') {
                if (commentaires === 'null' || commentaires === null) {
                    request = `UPDATE PROFACE.dbo.Maintenance_Operations SET etatOperation = 'à faire',  visa = '${visa}', commentaire = null, dateAction = NULL, dateDebut='${dateDebut}', dateFin='${dateFin}' WHERE refOperation = '${refOperation}'`;
                } else {
                    request = `UPDATE PROFACE.dbo.Maintenance_Operations SET etatOperation = 'à faire',  visa = '${visa}', commentaire = '${commentaires.replace(/'/g,"''")}', dateAction = NULL, dateDebut='${dateDebut}', dateFin='${dateFin}' WHERE refOperation = '${refOperation}'`;
                }
            }
            //console.log(request);
            let results = await sql.query(request);
            //console.log(results);
            return results;
        }
    }
    async createOperationMultiSwiss(moyen, id, visa, heuresMachine) {
        try {
            let request = `INSERT INTO PROFACE.dbo.Maintenance_Operations VALUES ('${id}', '${moyen}', GETDATE(), GETDATE(), 'validée', '${visa}', '${heuresMachine}', GETDATE())`;
            //console.log(request);
            let res =  await sql.query(request);
            //console.log("ERROR try : " + res.message);
            return res;
        } catch (e) {
            if (e.name == 'RequestError') {
                return "RequestError";
            }
            // console.log("Error catch : " + e.message);

            // if (e.message == 'The INSERT statement conflicted with the FOREIGN KEY constraint "FK__Maintenance_Oper__45DE573A". The conflict occurred in database "PROFACE", table "dbo.Maintenance_OperationsGamme""') {
            // 	console.log("error");
            // }

        }
    }
    async getOperationsMultiswiss() {
        try {
            let request = "SELECT * FROM PROFACE.dbo.Maintenance_OperationsMaintenance WHERE donneesGMAO = 1 ORDER BY libelle"
            let res =  await sql.query(request);
            return res;
        } catch (e) {
            console.log(e);
            return e;
        }
    }
    async getOperationsMoyen(code) {
        try {
            let request = "SELECT opeM.libelle, ope.* FROM PROFACE.dbo.Maintenance_Operations ope, PROFACE.dbo.Maintenance_OperationsMaintenance opeM WHERE moyenCode = \'" + code +"\' AND ope.idOperationGamme = opeM.id AND YEAR(dateDebut) = 2023"
            return await sql.query(request);
        } catch (e) {
            console.log(e);
            return e;
        }
    }
    async deleteOperationsGammeFromMoyen(code) {
        try {
            let request = "DELETE FROM PROFACE.dbo.Maintenance_OperationsGamme WHERE moyenCode = \'" + code + "\'";
            return await sql.query(request);
        } catch (e) {
            console.log(e);
        }
    }
    async getIdOpe(libelleOpe) {
        if (libelleOpe) {
            let request = 'SELECT id FROM PROFACE.dbo.Maintenance_OperationsMaintenance WHERE libelle =\'' + libelleOpe.replace(/'/gi,"''") +'\'';
            let results = await sql.query(request);
            return results;
        }
    }
    async getIdGamme(moyenCode) {
        return await sql.query('SELECT idGamme FROM PROFACE.dbo.Maintenance_Moyens WHERE code =\'' + moyenCode +"\'");
    }

    async addGamme(moyenCode, idGamme, operationsGamme) {
        let request = "DECLARE @inserted table(idOperationGamme int, moyenCode varchar(50), dateDebut date, dateFin date);\nset dateformat dmy;\n";

        operationsGamme.forEach(operation => {
            request = request +
                `BEGIN
				IF NOT EXISTS (SELECT * FROM PROFACE.dbo.Maintenance_OperationsGamme 
							WHERE id = ${operation.id}
							AND moyenCode = '${moyenCode}')
				BEGIN
					INSERT INTO PROFACE.dbo.Maintenance_OperationsGamme 
					VALUES (${operation.id}, '${moyenCode}', ${idGamme}, '${operation.periodicite}' , '${operation.debut}');
				END
			END\n`;
            if (operation.periodicite === "quotidienne") {
                let daysElapsed = daysDiff(operation.debut);
                for (let i = 0; i <= 365-daysElapsed; i++) {
                    if (operation.execution === 'jour') {
                        request = request + `INSERT INTO PROFACE.dbo.Maintenance_Operations(idOperationGamme, moyenCode, dateDebut, dateFin, etatOperation) OUTPUT INSERTED.idOperationGamme, INSERTED.moyenCode, INSERTED.dateDebut, INSERTED.dateFin INTO @inserted VALUES('${operation.id}', '${moyenCode}', '${addDays(operation.debut, i)}', DATEADD (day, 1, '${addDays(operation.debut, i)}'), 'à faire')`
                    } else if (operation.execution === 'semaine') {
                        request = request + `INSERT INTO PROFACE.dbo.Maintenance_Operations(idOperationGamme, moyenCode, dateDebut, dateFin, etatOperation) OUTPUT INSERTED.idOperationGamme, INSERTED.moyenCode, INSERTED.dateDebut, INSERTED.dateFin INTO @inserted VALUES('${operation.id}', '${moyenCode}', '${addDays(operation.debut, i)}', DATEADD (week, 1, '${addDays(operation.debut, i)}'), 'à faire');`
                    } else if (operation.execution === 'mois') {
                        request = request + `INSERT INTO PROFACE.dbo.Maintenance_Operations(idOperationGamme, moyenCode, dateDebut, dateFin, etatOperation) OUTPUT INSERTED.idOperationGamme, INSERTED.moyenCode, INSERTED.dateDebut, INSERTED.dateFin INTO @inserted VALUES('${operation.id}', '${moyenCode}', '${addDays(operation.debut, i)}', DATEADD (month, 1, '${addDays(operation.debut, i)}'), 'à faire');`
                    }
                }
            } else if (operation.periodicite === "hebdomadaire") {
                let weeksElapsed = weeksDiff(operation.debut) +1;
                let count = 0;
                for (let i = 0; i <= 52-weeksElapsed; i++) {
                    if (operation.execution === 'jour') {
                        request = request + `INSERT INTO PROFACE.dbo.Maintenance_Operations(idOperationGamme, moyenCode, dateDebut, dateFin, etatOperation) OUTPUT INSERTED.idOperationGamme, INSERTED.moyenCode, INSERTED.dateDebut, INSERTED.dateFin INTO @inserted VALUES('${operation.id}', '${moyenCode}', '${addWeeks(operation.debut, i)}', DATEADD (day, 1, '${addWeeks(operation.debut, i)}'), 'à faire');`
                    } else if (operation.execution === 'semaine') {
                        request = request + `INSERT INTO PROFACE.dbo.Maintenance_Operations(idOperationGamme, moyenCode, dateDebut, dateFin, etatOperation) OUTPUT INSERTED.idOperationGamme, INSERTED.moyenCode, INSERTED.dateDebut, INSERTED.dateFin INTO @inserted VALUES('${operation.id}', '${moyenCode}', '${addWeeks(operation.debut, i)}', DATEADD (week, 1, '${addWeeks(operation.debut, i)}'), 'à faire');`
                    } else if (operation.execution === 'mois') {
                        request = request + `INSERT INTO PROFACE.dbo.Maintenance_Operations(idOperationGamme, moyenCode, dateDebut, dateFin, etatOperation) OUTPUT INSERTED.idOperationGamme, INSERTED.moyenCode, INSERTED.dateDebut, INSERTED.dateFin INTO @inserted VALUES('${operation.id}', '${moyenCode}', '${addWeeks(operation.debut, i)}', DATEADD (month, 1, '${addWeeks(operation.debut, i)}'), 'à faire');`
                    }
                }
            } else if (operation.periodicite === "mensuelle") {
                let monthElapsed = monthDiff(operation.debut);
                for (let i = 0; i < 12-monthElapsed; i++) {
                    if (operation.execution === 'jour') {
                        request = request + `INSERT INTO PROFACE.dbo.Maintenance_Operations(idOperationGamme, moyenCode, dateDebut, dateFin, etatOperation) OUTPUT INSERTED.idOperationGamme, INSERTED.moyenCode, INSERTED.dateDebut, INSERTED.dateFin INTO @inserted VALUES('${operation.id}', '${moyenCode}', '${addMonths(operation.debut, i)}', DATEADD (day, 1, '${addMonths(operation.debut, i)}'), 'à faire');`
                    } else if (operation.execution === 'semaine') {
                        request = request + `INSERT INTO PROFACE.dbo.Maintenance_Operations(idOperationGamme, moyenCode, dateDebut, dateFin, etatOperation) OUTPUT INSERTED.idOperationGamme, INSERTED.moyenCode, INSERTED.dateDebut, INSERTED.dateFin INTO @inserted VALUES('${operation.id}', '${moyenCode}', '${addMonths(operation.debut, i)}', DATEADD (week, 1, '${addMonths(operation.debut, i)}'), 'à faire');`
                    } else if (operation.execution === 'mois') {
                        request = request + `INSERT INTO PROFACE.dbo.Maintenance_Operations(idOperationGamme, moyenCode, dateDebut, dateFin, etatOperation) OUTPUT INSERTED.idOperationGamme, INSERTED.moyenCode, INSERTED.dateDebut, INSERTED.dateFin INTO @inserted VALUES('${operation.id}', '${moyenCode}', '${addMonths(operation.debut, i)}', DATEADD (month, 1, '${addMonths(operation.debut, i)}'), 'à faire');`
                    }
                }
            } else if (operation.periodicite === "trimestrielle") {
                let quarterElapsed = getQuarter(operation.debut);
                for (let i = 0; i <= 4-quarterElapsed; i++) {
                    if (operation.execution === 'jour') {
                        request = request + `INSERT INTO PROFACE.dbo.Maintenance_Operations(idOperationGamme, moyenCode, dateDebut, dateFin, etatOperation) OUTPUT INSERTED.idOperationGamme, INSERTED.moyenCode, INSERTED.dateDebut, INSERTED.dateFin INTO @inserted VALUES('${operation.id}', '${moyenCode}', '${addMonths(operation.debut, i*3)}', DATEADD (day, 1, '${addMonths(operation.debut, i*3)}'), 'à faire');`
                    } else if (operation.execution === 'semaine') {
                        request = request + `INSERT INTO PROFACE.dbo.Maintenance_Operations(idOperationGamme, moyenCode, dateDebut, dateFin, etatOperation) OUTPUT INSERTED.idOperationGamme, INSERTED.moyenCode, INSERTED.dateDebut, INSERTED.dateFin INTO @inserted VALUES('${operation.id}', '${moyenCode}', '${addMonths(operation.debut, i*3)}', DATEADD (week, 1, '${addMonths(operation.debut, i*3)}'), 'à faire');`
                    } else if (operation.execution === 'mois') {
                        request = request + `INSERT INTO PROFACE.dbo.Maintenance_Operations(idOperationGamme, moyenCode, dateDebut, dateFin, etatOperation) OUTPUT INSERTED.idOperationGamme, INSERTED.moyenCode, INSERTED.dateDebut, INSERTED.dateFin INTO @inserted VALUES('${operation.id}', '${moyenCode}', '${addMonths(operation.debut, i*3)}', DATEADD (month, 1, '${addMonths(operation.debut, i*3)}'), 'à faire');`
                    }
                }
            } else if (operation.periodicite === "bisemestrielle") {
                let monthElapsed = monthDiff(operation.debut)/2;
                for (let i = 0; i < 6-monthElapsed; i++) {
                    if (operation.execution === 'jour') {
                        request = request + `INSERT INTO PROFACE.dbo.Maintenance_Operations(idOperationGamme, moyenCode, dateDebut, dateFin, etatOperation) OUTPUT INSERTED.idOperationGamme, INSERTED.moyenCode, INSERTED.dateDebut, INSERTED.dateFin INTO @inserted VALUES('${operation.id}', '${moyenCode}', '${addMonths(operation.debut, i*2)}', DATEADD (day, 1, '${addMonths(operation.debut, i*2)}'), 'à faire');`
                    } else if (operation.execution === 'semaine') {
                        request = request + `INSERT INTO PROFACE.dbo.Maintenance_Operations(idOperationGamme, moyenCode, dateDebut, dateFin, etatOperation) OUTPUT INSERTED.idOperationGamme, INSERTED.moyenCode, INSERTED.dateDebut, INSERTED.dateFin INTO @inserted VALUES('${operation.id}', '${moyenCode}', '${addMonths(operation.debut, i*2)}', DATEADD (week, 1, '${addMonths(operation.debut, i*2)}'), 'à faire');`
                    } else if (operation.execution === 'mois') {
                        request = request + `INSERT INTO PROFACE.dbo.Maintenance_Operations(idOperationGamme, moyenCode, dateDebut, dateFin, etatOperation) OUTPUT INSERTED.idOperationGamme, INSERTED.moyenCode, INSERTED.dateDebut, INSERTED.dateFin INTO @inserted VALUES('${operation.id}', '${moyenCode}', '${addMonths(operation.debut, i*2)}', DATEADD (month, 1, '${addMonths(operation.debut, i*2)}'), 'à faire');`
                    }
                }
            } else if (operation.periodicite === "semestrielle") {
                let semesterElapsed = getSemester(operation.debut);
                for (let i = 0; i <= 2-semesterElapsed; i++) {
                    if (operation.execution === 'jour') {
                        request = request + `INSERT INTO PROFACE.dbo.Maintenance_Operations(idOperationGamme, moyenCode, dateDebut, dateFin, etatOperation) OUTPUT INSERTED.idOperationGamme, INSERTED.moyenCode, INSERTED.dateDebut, INSERTED.dateFin INTO @inserted VALUES('${operation.id}', '${moyenCode}', '${addMonths(operation.debut, i*6)}', DATEADD (day, 1, '${addMonths(operation.debut, i*6)}'), \'à faire\');`
                    } else if (operation.execution === 'semaine') {
                        request = request + `INSERT INTO PROFACE.dbo.Maintenance_Operations(idOperationGamme, moyenCode, dateDebut, dateFin, etatOperation) OUTPUT INSERTED.idOperationGamme, INSERTED.moyenCode, INSERTED.dateDebut, INSERTED.dateFin INTO @inserted VALUES('${operation.id}', '${moyenCode}', '${addMonths(operation.debut, i*6)}', DATEADD (week, 1, '${addMonths(operation.debut, i*6)}'), \'à faire\');`
                    } else if (operation.execution === 'mois') {
                        request = request + `INSERT INTO PROFACE.dbo.Maintenance_Operations(idOperationGamme, moyenCode, dateDebut, dateFin, etatOperation) OUTPUT INSERTED.idOperationGamme, INSERTED.moyenCode, INSERTED.dateDebut, INSERTED.dateFin INTO @inserted VALUES('${operation.id}', '${moyenCode}', '${addMonths(operation.debut, i*6)}', DATEADD (month, 1, '${addMonths(operation.debut, i*6)}'), \'à faire\');`
                    }
                }
            } else if (operation.periodicite === "annuelle") {
                if (operation.execution === 'jour') {
                    request = request + `INSERT INTO PROFACE.dbo.Maintenance_Operations(idOperationGamme, moyenCode, dateDebut, dateFin, etatOperation) OUTPUT INSERTED.idOperationGamme, INSERTED.moyenCode, INSERTED.dateDebut, INSERTED.dateFin INTO @inserted VALUES('${operation.id}', '${moyenCode}', '${addMonths(operation.debut, 0)}', DATEADD (day, 1, '${addMonths(operation.debut, 0)}'), 'à faire');`
                } else if (operation.execution === 'semaine') {
                    request = request + `INSERT INTO PROFACE.dbo.Maintenance_Operations(idOperationGamme, moyenCode, dateDebut, dateFin, etatOperation) OUTPUT INSERTED.idOperationGamme, INSERTED.moyenCode, INSERTED.dateDebut, INSERTED.dateFin INTO @inserted VALUES('${operation.id}', '${moyenCode}', '${addMonths(operation.debut, 0)}', DATEADD (week, 1, '${addMonths(operation.debut, 0)}'), 'à faire');`
                } else if (operation.execution === 'mois') {
                    request = request + `INSERT INTO PROFACE.dbo.Maintenance_Operations(idOperationGamme, moyenCode, dateDebut, dateFin, etatOperation) OUTPUT INSERTED.idOperationGamme, INSERTED.moyenCode, INSERTED.dateDebut, INSERTED.dateFin INTO @inserted VALUES('${operation.id}', '${moyenCode}', '${addMonths(operation.debut, 0)}', DATEADD (month, 1, '${addMonths(operation.debut, 0)}'), 'à faire');`
                }
            }
        });

        request = request + "SELECT opM.libelle as 'Operation', i.* FROM @inserted i, PROFACE.dbo.Maintenance_OperationsMaintenance opM WHERE i.idOperationGamme = opM.id"
        //console.log(request);
        try {
            let results = await sql.query(request);
            return results;
        } catch (e) {
            console.log(e);
            return e;
        }
    }
    async getMoyensStoppedFromSecteur(code) {
        try {
            let req = `SELECT code
					   FROM PROFACE.dbo.Maintenance_Moyens
					   WHERE enArret = 1
						 AND codeAnalytique = '${code}'`;

            let res = await sql.query(req);

            return res;
        } catch (e) {
            console.log(e);

        }

    }

    async getAllRebuts() {
        try {
            let request = "SELECT G.id, G.date, G.ordre_fabrication, S.secteur, R.reference, G.quantite, G.visa, G.commentaire FROM PROFACE.dbo.Gestion_Rebuts G\n" + "INNER JOIN PROFACE.dbo.Gestion_Rebuts_References_Pieces R ON G.id_reference_piece = R.id\n" + "INNER JOIN PROFACE.dbo.Gestion_Rebuts_Secteurs S ON G.id_secteur = S.id ORDER BY id DESC"
            let results = await sql.query(request);

            return results;
        } catch (e) {
            console.log(e);
        }
    }

    async getAllRef(){
        try {
            let request = "SELECT * FROM PROFACE.dbo.Gestion_Rebuts_References_Pieces"
            let results = await sql.query(request);

            return results;
        } catch (e) {
            console.log(e);
        }
    }

    async getTop5(){
        try {
            let request = "SELECT T.date, T.id_ref, T.quantite, R.reference FROM PROFACE.dbo.Gestion_Rebuts_Top5 AS T INNER JOIN Proface.dbo.Gestion_Rebuts_References_Pieces AS R ON R.id = T.id_ref "
            let results = await sql.query(request);

            return results;
        } catch (e) {
            console.log(e);
        }
    }

    async addRebuts(of, secteur, reference, commentaire, quantite, visa){
        let months = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"]
        let month= (new Date).getMonth()
        let currentMonth = months[month]
        let date = new Date();
        const sqlDate = date.toISOString().slice(0, 19).replace('T', ' ');
        //console.log(sqlDate, of, secteur, reference, commentaire, quantite, visa)
        try {
            let request = `INSERT INTO PROFACE.dbo.Gestion_Rebuts (date, ordre_fabrication, id_secteur, id_reference_piece, quantite, visa, commentaire) VALUES ('${sqlDate}','${of}', ${secteur}, ${reference}, ${quantite}, '${visa}', '${commentaire}')`
            let request2 = `MERGE PROFACE.dbo.Gestion_Rebuts_Top5 AS top5 USING (VALUES (${reference}, '${currentMonth}', ${quantite})) AS source (id_ref, date, quantite) ON (top5.id_ref = source.id_ref AND top5.date = source.date) WHEN MATCHED THEN UPDATE SET top5.quantite = top5.quantite + source.quantite WHEN NOT MATCHED THEN INSERT (id_ref, date, quantite) VALUES (source.id_ref, source.date, source.quantite);`

            let results = await sql.query(request);
            let secondRequest = await sql.query(request2);
            return {results, secondRequest};
        } catch (e) {
            console.log(e);
        }
    }

    async addRef(ref, des){
        try {
            let request = `INSERT INTO PROFACE.dbo.Gestion_Rebuts_References_Pieces VALUES ('${ref}','${des}')`
            let results = await sql.query(request);

            return results;
        } catch (e) {
            console.log(e);
        }
    }
    async getConsignes() {
        try {
            let request = `SELECT TOP(20) c.dateCreation, c.dateModification, c.demande, c.idDestinataire, c.idDemandeur, e.nom AS demandeur, e2.nom AS destinataire, c.etat, c.id, c.numMachine, c.origine, c.reference, c.reponse, c.secteurMachine, c.sectionMachine, c.typeAction
                           FROM PROFACE.dbo.Consignes AS c
                                    INNER JOIN PROFACE.dbo.Consignes_Effectifs AS e ON c.idDemandeur = e.id
                                    INNER JOIN PROFACE.dbo.Consignes_Effectifs AS e2 ON c.idDestinataire = e2.id
                           ORDER BY dateModification DESC`
            let results = await sql.query(request);
            return results;
        } catch (e) {
            console.log(e);
        }
    }
    async solderConsigne(id, demande, reponse) {
        try {
            let request = `UPDATE PROFACE.dbo.Consignes
			SET demande = '${demande.replace(/'/gi,"''")}', reponse = '${reponse.replace(/'/gi,"''")}', etat = 'Soldée', dateModification = GETDATE()
			WHERE id = ${id}`;

            let results = await sql.query(request);
            return results;
        } catch (e) {
            console.log(e);
            return 'ERROR';
        }
    }

    async passerEnCoursConsigne(id, demande, reponse) {
        try {
            let request = `UPDATE PROFACE.dbo.Consignes
			SET demande = '${demande.replace(/'/gi,"''")}', reponse = '${reponse.replace(/'/gi,"''")}', etat = 'En cours', dateModification = GETDATE()
			WHERE id = ${id}`;
            let results = await sql.query(request);
            return results;
        } catch (e) {
            console.log(e);
            return 'ERROR';
        }
    }

    async enregistrerConsigne(id, demande, destinataire, reponse) {
        try {
            let request = `UPDATE PROFACE.dbo.Consignes
			SET demande = '${demande.replace(/'/gi,"''")}', idDestinataire='${destinataire}', reponse = '${reponse.replace(/'/gi,"''")}', dateModification = GETDATE()
			WHERE id = ${id}`;

            let results = await sql.query(request);
            return results;
        } catch (e) {
            console.log(e);
            return 'ERROR';
        }
    }

    async supprimerConsigne(id) {
        try {
            let request = `DELETE PROFACE.dbo.Consignes
			WHERE id = ${id}`;
            let results = await sql.query(request);
            return results;
        } catch (e) {
            console.log(e);
            return 'ERROR';
        }
    }
    async getS() {
        try {
            let request = `SELECT DISTINCT * FROM PROFACE.dbo.Consignes_Secteurs;`;
            let results = await sql.query(request);
            return results;
        } catch (e) {
            console.log(e);
        }
    }
    async getSections(secteur) {
        try {
            let request;

            if (secteur) {
                request = `SELECT DISTINCT section FROM PROFACE.dbo.Consignes_Machines WHERE secteur = ${secteur};`;
            } else {
                request = `SELECT DISTINCT section FROM PROFACE.dbo.Consignes_Machines;`
            }

            let results = await sql.query(request);
            return results;
        } catch (e) {
            console.log(e);
        }
    }

    async getM(secteur, section) {
        try {
            let request = `SELECT DISTINCT numMachine FROM PROFACE.dbo.Consignes_Machines`;

            if ((secteur != 'undefined' && secteur != undefined && secteur != 'null') || (section != 'undefined' && section != undefined && section != 'null')) {
                request = request + ` WHERE`;

                if (secteur != 'undefined' && secteur != undefined && section != "null") {
                    request = request + ` secteur = '${secteur}'`;

                    if (section != 'undefined' && secteur != undefined && section != "null") {
                        request = request + ` AND`;
                    }
                }

                if (section != 'undefined' && section != undefined && section != "null") {
                    request = request + ` section = '${section}'`;
                }
            }

            let results = await sql.query(request);
            return results;
        } catch (e) {
            console.log(e);
        }
    }
    async getR(secteur, section, machine) {
        try {
            let request = `SELECT DISTINCT reference FROM PROFACE.dbo.Consignes_Machines`;

            if ((secteur != 'undefined' && secteur != undefined && secteur != "null") || (section != 'undefined' && section != undefined && section != "null") || (machine != 'undefined' && machine != undefined && machine != "null")) {
                request = request + ` WHERE`;

                if (secteur != 'undefined' && secteur != undefined && secteur != "null") {
                    request = request + ` secteur = '${secteur}'`;

                    if ((section != 'undefined' && section != undefined && section != "null") || (machine != 'undefined' && machine != undefined && machine != "null")) {
                        request = request + ` AND`;
                    }
                }

                if (section != 'undefined' && section != undefined && section != "null") {
                    request = request + ` section = '${section}'`;

                    if (machine != 'undefined' && machine != undefined && machine != "null") {
                        request = request + ` AND`;
                    }
                }

                if (machine != 'undefined' && machine != undefined && machine != "null") {
                    request = request + ` numMachine = '${machine}'`;
                }
            }

            let results = await sql.query(request);
            return results;
        } catch (e) {
            console.log(e);
        }
    }
    async getEffectifs(secteur) {
        try {
            let request;
            if (secteur == 'undefined' || secteur == 'null') {
                request = `SELECT DISTINCT * FROM PROFACE.dbo.Consignes_Effectifs ORDER BY nom;`
            } else {
                request = `SELECT DISTINCT * FROM PROFACE.dbo.Consignes_Effectifs WHERE secteur = '${secteur}' ORDER BY nom;`;
            }
            let results = await sql.query(request);
            return results;
        } catch (e) {
            console.log(e);
        }
    }
    async newConsigne(secteur, section, machine, reference, origine, action, nom, detail, destinataire, reponse, etat) {
        try {
            let request = `INSERT INTO PROFACE.dbo.Consignes(dateModification, secteurMachine, sectionMachine, numMachine, reference, origine, typeAction, idDemandeur, demande, idDestinataire, reponse, etat) VALUES (GETDATE(), '${secteur}', '${section}', ${machine}, '${reference}', '${origine}', '${action}', '${nom}', '${detail.replace(/'/gi,"''")}', '${destinataire}', '${reponse.replace(/'/gi,"''")}', '${etat}');`
            let results = await sql.query(request);
            return results;
        } catch (e) {
            console.log(e);
        }
    }

    async getMachinesBonneville() {
        try {
            let result = await sql.query(`SELECT * FROM ${this.sqlConfig.database}.dbo.Machines WHERE site = 'Bonneville'`);
            return result;
        } catch (e) {
            console.log(e);
        }
    }

    async getReferencePieces(idMachine) {
        try {
            let request = 'SELECT idReferencePieces FROM ' + this.sqlConfig.database + '.dbo.ParametresMachines WHERE idMachine=\'' + idMachine + '\'';
            let result = await sql.query(request);
            return result;
        } catch (e) {
            console.log(e);
            return e;
        }
    }
    async getParam(idMachine, idReferencePieces) {
        try {
            let request = 'SELECT * FROM ' + this.sqlConfig.database + '.dbo.ParametresMachines WHERE idMachine=\'' + idMachine + '\' AND idReferencePieces=\'' + idReferencePieces +'\''
            let result = await sql.query(request);
            return result;
        } catch (e) {
            console.log(e);
            return e;
        }
    }
    async getIndicators(machine, reference, startDate, endDate) {
        try {
            let request = `set dateformat dmy; EXEC ${this.sqlConfig.database}.dbo.getIndicators '${machine}', '${reference}', '${startDate.toISOString().replace("Z", "").replace("T", " ")}', '${endDate.toISOString().replace("Z", "").replace("T", " ")}'`;
            let results = 	await sql.query(request)
            return results;
        } catch  (e) {
            if (e.name == 'RequestError') {
                return "RequestError";
            } else {
                return e;
            }
        }
    }
    async getNC(machine, reference, startDate, endDate) {
        try {
            let result = await sql.query(`EXEC ${this.sqlConfig.database}.dbo.getNC '${machine}', '${reference}', '${startDate.toISOString().replace("Z", "").replace("T", " ")}', '${endDate.toISOString().replace("Z", "").replace("T", " ")}'`);

            return result;
        } catch  (e) {
            console.log(e);
        }
    }

    async getNbArrets(machine, reference, startDate, endDate, deuxiemePassage) {
        try {
            let result = await sql.query(`EXEC ${this.sqlConfig.database}.dbo.getNbArrets '${machine}', '${reference}', '${startDate.toISOString().replace("Z", "").replace("T", " ")}', '${endDate.toISOString().replace("Z", "").replace("T", " ")}', '${deuxiemePassage}'`);
            return result;
        } catch  (e) {
            console.log(e);
        }
    }

    async getTempsArrets(machine, reference, startDate, endDate, deuxiemePassage) {
        try {
            let result = await sql.query(`EXEC ${this.sqlConfig.database}.dbo.getTempsArrets  '${machine}', '${reference}', '${startDate.toISOString().replace("Z", "").replace("T", " ")}', '${endDate.toISOString().replace("Z", "").replace("T", " ")}', '${deuxiemePassage}'`);
            return result;
        } catch (e) {
            console.log(e);
        }
    }
    async exportData(allData, idMachine, idReferencePieces, deuxiemePassage, startDatetime, endDatetime) {
        if (deuxiemePassage === true) {
            deuxiemePassage = 1
        }else{
            deuxiemePassage = 0
        }
        startDatetime = startDatetime.replace('T', ' ')
        endDatetime = endDatetime.replace('T', ' ')
        try {
            let request ;
            if (allData) {
                if (deuxiemePassage) {
                    request = `SELECT * FROM PROFACE.dbo.EvenementsMachines WHERE timeStamp BETWEEN '${startDatetime}' AND '${endDatetime}'`;
                } else {
                    request = `SELECT * FROM PROFACE.dbo.EvenementsMachines WHERE deuxiemePassage = 0 AND timeStamp BETWEEN '${startDatetime}' AND '${endDatetime}'`;
                }
            } else {
                if (deuxiemePassage) {
                    if (idReferencePieces) {
                        request = `SELECT * FROM PROFACE.dbo.EvenementsMachines WHERE idMachine='${idMachine}' AND idReferencePieces='${idReferencePieces}' AND timeStamp BETWEEN '${startDatetime}' AND '${endDatetime}'`;
                    } else {
                        request = `SELECT * FROM PROFACE.dbo.EvenementsMachines WHERE idMachine='${idMachine}' AND timeStamp BETWEEN '${startDatetime}' AND '${endDatetime}'`;
                    }
                } else {
                    if (idReferencePieces) {
                        request = `SELECT * FROM PROFACE.dbo.EvenementsMachines WHERE idMachine='${idMachine}' AND idReferencePieces='${idReferencePieces}' AND deuxiemePassage = 0 AND timeStamp BETWEEN '${startDatetime}' AND '${endDatetime}'`;
                    } else {
                        request = `SELECT * FROM PROFACE.dbo.EvenementsMachines WHERE idMachine='${idMachine}' AND deuxiemePassage = 0 AND timeStamp BETWEEN '${startDatetime}' AND '${endDatetime}'`;
                    }
                }
            }
            let results = await sql.query(request)
            return this.convertToCSV(JSON.stringify(results.recordset))

        } catch (e) {
            console.log(e);
        }
    }
    convertToCSV(objArray) {
        var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
        var str = '', header = '';

        for (var i = 0; i < array.length; i++) {
            var line = '';

            for (var index in array[i]) {
                if (i == 0) {
                    if (header != '') {
                        header += ';'
                    }
                    header += index;
                }
                if (line != '') {
                    line += ';'
                }
                line += array[i][index];
            }
            str += line + '\r\n';
        }
        return (header + '\r\n' + str);
    }
    async setObjectives(trg, trs, tre, piecesMinute, tpsCycle, idMachine, referencePiece) {
        let request;
        if (tpsCycle === 'null' && piecesMinute === 'null') {
            request = `UPDATE ${this.sqlConfig.database}.dbo.parametresMachines SET objectifTRS = ${trs}, objectifTRG = ${trg}, objectifTRE = ${tre} WHERE idMachine = '${idMachine}' AND idReferencePieces = '${referencePiece}'`;
        } else if (tpsCycle === 'null') {
            request = `UPDATE ${this.sqlConfig.database}.dbo.parametresMachines SET objectifTRS = ${trs}, objectifTRG = ${trg}, objectifTRE = ${tre}, piecesMinute = ${piecesMinute} WHERE idMachine = '${idMachine}' AND idReferencePieces = '${referencePiece}'`;
        } else if (piecesMinute === 'null') {
            request = `UPDATE ${this.sqlConfig.database}.dbo.parametresMachines SET objectifTRS = ${trs}, objectifTRG = ${trg}, objectifTRE = ${tre}, tempsCycle = ${tpsCycle} WHERE idMachine = '${idMachine}' AND idReferencePieces = '${referencePiece}'`;
        } else {
            request = `UPDATE ${this.sqlConfig.database}.dbo.parametresMachines SET objectifTRS = ${trs}, objectifTRG = ${trg}, objectifTRE = ${tre}, piecesMinute = ${piecesMinute}, tempsCycle = ${tpsCycle} WHERE idMachine = '${idMachine}' AND idReferencePieces = '${referencePiece}'`;
        }

        try {
            let result = await sql.query(request);
            return result;
        } catch (e) {
            console.log(e);
            if (e.name === 'RequestError') {
                return "RequestError";
            } else {
                return e;
            }
        }
    }
    async insertNewMachine(idMachine, libelleMachine, referencePieces, tempsCycle, piecesMinute, objectifTRS, objectifTRG, objectifTRE, objectifRebuts, libelleNC1, libelleNC2, libelleNC3, libelleNC4, libelleNC5, libelleNC6, libelleNC7, libelleNC8, libelleNC9, libelleNC10, libelleArret1, libelleArret2, libelleArret3, libelleArret4, libelleArret5, libelleArret6, libelleArret7, libelleArret8, libelleArret9, libelleArret10) {
        try {
            let request;

            if (libelleMachine) {
                request = `INSERT INTO ${this.sqlConfig.database}.dbo.Machines(idMachine, libelle, site) VALUES ( '${idMachine}','${libelleMachine}', 'Bonneville');`;
            } else {
                request = `INSERT INTO ${this.sqlConfig.database}.dbo.Machines(idMachine, site) VALUES ( '${idMachine}', 'Bonneville');`;
            }

            await sql.query(request).then(value => {
                let request = `INSERT INTO ${this.sqlConfig.database}.dbo.ParametresMachines(idMachine, secteur, idReferencePieces, tempsCycle, piecesMinute, objectifTRS, objectifTRG, objectifTRE, objectifRebuts, libelleNC1, libelleNC2, libelleNC3, libelleNC4, libelleNC5, libelleNC6, libelleNC7, libelleNC8, libelleNC9, libelleNC10, LibelleArret1, LibelleArret2, LibelleArret3, LibelleArret4, LibelleArret5, LibelleArret6, LibelleArret7, LibelleArret8, LibelleArret9, LibelleArret10) VALUES ('${idMachine}', '', '${referencePieces}','${tempsCycle}', '${piecesMinute}', '${objectifTRS}', '${objectifTRG}', '${objectifTRE}', '${objectifRebuts}', '${libelleNC1}', '${libelleNC2}', '${libelleNC3}', '${libelleNC4}', '${libelleNC5}', '${libelleNC6}', '${libelleNC7}', '${libelleNC8}', '${libelleNC9}', '${libelleNC10}', '${libelleArret1}', '${libelleArret2}', '${libelleArret3}', '${libelleArret4}', '${libelleArret5}', '${libelleArret6}','${libelleArret7}', '${libelleArret8}', '${libelleArret9}','${libelleArret10}');`;
                sql.query(request)
            });
        } catch (e) {
            console.log(e);
        }
    }
    async exportLibelle() {
        try {
            let request = "SELECT * FROM PROFACE.dbo.ParametresMachines;"
            let results = await sql.query(request);

            return this.convertToCSV(JSON.stringify(results.recordset))

        } catch (e) {
            console.log(e);
        }
    }

    async filtrerConsignes(secteur, section, machine, reference, origine, action, nom, etat) {
        try {
            let request = "SELECT c.id, C.dateCreation, s.libelle secteurMachine, c.sectionMachine, c.numMachine, c.reference, c.origine, c.typeAction, e.nom demandeur, c.demande, ef.nom destinataire, c.reponse, c.etat, c.dateModification FROM PROFACE.dbo.Consignes C, PROFACE.dbo.Consignes_Secteurs S, PROFACE.dbo.Consignes_Effectifs e, PROFACE.dbo.Consignes_Effectifs ef WHERE S.id = C.secteurMachine AND e.id = c.idDemandeur AND ef.id = c.idDestinataire";

            if (secteur !== "null" || section !== "null" || machine !== "null" || reference !== "null" || origine !== "null" || action !== "null" || nom!== "null" || etat !== "null") {
                request = request + "  AND"

                if (secteur !== "null") {
                    request = request + " secteurMachine = \'" + secteur +"\'";

                    if (section !== "null" || machine !== "null" || reference !== "null" || origine !== "null" || action !== "null" || nom !== "null" || etat !== "null") {
                        request = request + " AND"
                    }
                }

                if (section !== "null") {
                    request = request + " sectionMachine = \'" + section +"\'";

                    if (machine !== "null" || reference !== "null" || origine !== "null" || action !== "null" || nom !== "null" || etat !== "null") {
                        request = request + " AND"
                    }
                }

                if (machine !== "null") {
                    request = request + " numMachine = \'" + machine +"\'";

                    if (reference !== "null" || origine !== "null" || action !== "null" || nom !== "null" || etat !== "null") {
                        request = request + " AND"
                    }
                }

                if (reference !== "null") {
                    request = request + " reference = \'" + reference +"\'";

                    if (origine !== "null" || action !== "null" || nom !== "null" || etat !== "null") {
                        request = request + " AND"
                    }
                }

                if (origine !== "null") {
                    request = request + " origine = \'" + origine +"\'";

                    if (action !== "null" || nom !== "null" || etat !== "null") {
                        request = request + " AND"
                    }
                }

                if (action !== "null") {
                    request = request + " typeAction = \'" + action +"\'";

                    if (nom!== "null" || etat !== "null") {
                        request = request + " AND"
                    }
                }

                if (nom !== "null") {
                    request = request + " idDemandeur = \'" + nom +"\'";

                    if (etat !== "null") {
                        request = request + " AND"
                    }
                }

                if (etat !== "null") {
                    request = request + " etat = \'" + etat +"\'";
                }

                request = request + " ORDER BY dateModification DESC;"

            } else {
                request = request + " ORDER BY dateModification DESC;"
            }

            let results = await sql.query(request);

            return results;
        } catch (e) {
            console.log(e);
        }
    }
    async updateReference(numMachine, oldReference, newReference) {
        try {
            let request = `UPDATE PROFACE.dbo.Consignes_Machines SET reference = '${newReference}' WHERE numMachine = '${numMachine}' AND reference = '${oldReference}';`;

            let results = await sql.query(request);

            return "OK";
        } catch (e) {
            return `ERROR, ${e.message}`;
        }
    }
}

module.exports = DAOProface

