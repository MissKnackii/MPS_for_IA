const express = require('express');
const router = express.Router();
const multer = require('multer');

const upload = multer(); // pas de storage nécessaire

const DAOProface = require('../DAOProface');
const daoProface = new DAOProface()

router.get("/allOperations", function(req, res) {
    try {
        daoProface.getOperations().then(value => {
            res.json(value.recordset);
        });
    } catch (e) {
        console.log(e);
    }
});

router.get("/filtrer", function(req, res) {
    try {
        let periode = req.query.periode?req.query.periode:null;
        let firstday = req.query.firstday?req.query.firstday:null;
        let lastday = req.query.lastday?req.query.lastday:null;
        let mois = req.query.mois?req.query.mois:null;
        console.log(mois);
        
        let annee = req.query.annee?req.query.annee:null;
        let analytique = req.query.analytique?req.query.analytique:null;
        let sousSecteur = req.query.sousSecteur?req.query.sousSecteur:null;
        let site = req.query.site?req.query.site:null;
        let moyen = req.query.moyen?req.query.moyen:null;
        let idOperationMaintenance = req.query.idOperationMaintenance?req.query.idOperationMaintenance:null;
        let etat = req.query.etat?req.query.etat:null;
        let niveau = req.query.niveau?req.query.niveau:null;
        //console.log(periode, firstday, lastday, mois, annee, analytique, sousSecteur, site, moyen, idOperationMaintenance, etat, niveau);
        daoProface.filtrerMaintenance(periode, firstday, lastday, mois, annee, analytique, sousSecteur, site, moyen, idOperationMaintenance, etat, niveau).then(value => {
            res.json(value.recordset)
        })
    } catch (e) {
        console.log(e);
    }
});

router.get("/allSousSecteurs", function(req, res) {
    try {
        daoProface.getSousSecteurs(req.query.analytique).then(value => {
            res.json(value.recordset);
        });
    } catch (e) {
        console.log(e);
    }
});

router.get("/allMoyens", function(req, res) {
    try {
        let analytique = req.query.analytique;
        let sousSecteur = req.query.sousSecteur;
        //console.log(analytique, sousSecteur);
        daoProface.getMoyens(analytique, sousSecteur).then(value => {
            res.json(value.recordset);
        });
    } catch (e) {
        console.log(e);
    }
});

router.get("/allOperationsMaintenance", function(req, res) {
    try {
        let niveau = req.query.niveau;
        daoProface.getOperationsMaintenance(niveau).then(value => {
            if (value == null) {
                res.json(null);
            } else {
                res.json(value.recordset);
            }
        });
    } catch (e) {
        console.log(e);
    }
});

router.get("/allMoyensStopped", function(req, res) {
    try {
        daoProface.getMoyensStopped().then(value => {
            res.json(value.recordset);
        });
    } catch (e) {
        console.log(e);
    }
});

router.get("/declareMoyenStopped", function (req,res) {
    try {
        let code = req.query.code?req.query.code:null;
        daoProface.declareMoyenStopped(code).then(value => {
            //console.log(res.json)
            if (value == 'ERROR') {
                res.json('ERROR');
            } else {
                //console.log(res.json(value.rowsAffected))
                res.json(value.rowsAffected);
            }
        });
    } catch (e) {
        console.log("Error in /declareMoyenStopped : " + e);
    }
})

router.get("/restartMoyenStopped", function (req,res) {
    try {
        let code = req.query.code?req.query.code:null;
        daoProface.restartMoyenStopped(code).then(value => {
            if (value == 'ERROR') {
                res.json('ERROR');
            } else {
                res.json('OK');
            }
        });
    } catch (e) {
        console.log("Error in /restartMoyenStopped : " + e);
    }
})

router.get("/allRetards", function(req, res) {
    try {
        let codeAnalytique = req.query.codeAnalytique;
        //console.log("code : ",codeAnalytique)
        daoProface.getRetards(codeAnalytique).then(value => {
            //console.log(value.recordset);
            res.json(value.recordset);
        })
    } catch (e) {
        console.log(e);
    }
});

router.get("/tauxAvancement", function (req,res) {
    try {
        let codeAnalytique = req.query.codeAnalytique?req.query.codeAnalytique:'null';
        let sousSecteur = req.query.sousSecteur?req.query.sousSecteur:'null';
        let niveau = req.query.niveau?req.query.niveau:'null';
        let codeMoyen = req.query.codeMoyen?req.query.codeMoyen:'null';
        let periode = req.query.periode?req.query.periode:'null';
        let firstday = req.query.firstday?req.query.firstday:'null';
        let lastday = req.query.lastday?req.query.lastday:'null';
        let mois = req.query.mois?req.query.mois:'null';
        let annee = req.query.annee?req.query.annee:'null';

        //console.log("Code Analytique",codeAnalytique, "Sous Secteur",sousSecteur, "Niveau", niveau, "Machine",codeMoyen, "Periode",periode, "First Day",firstday, "Last day",lastday, "Mois ",mois, "Annee", annee);

        daoProface.getTauxAvancement(periode, firstday, lastday, mois, annee, codeAnalytique, sousSecteur, niveau, codeMoyen).then(value => {
            //console.log(value.recordset);
            res.json(value.recordset);
        });
    } catch (e) {
        console.log(e);
    }
})

router.get("/updateOperation", function(req, res) {
    try {
        //console.log(req.query.commentaire)
        let refOperation = req.query.refOperation?req.query.refOperation:null;
        let action = req.query.action?req.query.action:null;
        let visa = req.query.visa?req.query.visa:null;
        let commentaires = req.query.commentaires?req.query.commentaires:null;
        let dateDebut = req.query.dateDebut;
        let dateFin = req.query.dateFin;
        //console.log(refOperation, action, visa, commentaires, dateDebut, dateFin)

        daoProface.updateOperation(refOperation, action, visa, commentaires, dateDebut, dateFin).then(value => {
            //console.log(value.rowsAffected);
            res.json(value.rowsAffected);
        });
    } catch (e) {
        console.log(e);
    }
});

router.get('/createOperationMultiSwiss', function(req, res) {
    try {
        let moyen = req.query.moyen;
        let id = req.query.id;
        let visa = req.query.visa;
        let heure = req.query.heuresMachine;
        daoProface.createOperationMultiSwiss(moyen, id, visa, heure).then(value => {
            //console.log(value);
            if (value) {
                if (value == "RequestError") {
                    res.json("RequestError");
                } else {
                    res.json("OK");
                }
            } else {
                res.json("Problem");
            }
        })
    } catch (e) {
        console.log(e);
    }
});

router.get('/operationsMultiswiss', function(req, res) {
    try {
        daoProface.getOperationsMultiswiss().then(value => {
            res.json(value.recordset);
        })
    } catch (e) {
        console.log(e);
    }
});

router.get('/allOperationsFromMoyen', function(req, res) {
    try {
        let code = req.query.code;
        daoProface.getOperationsMoyen(code).then(value => {
            res.json(value.recordset);
        })
    } catch (e) {
        console.log(e);
    }
});

router.get('/deleteOperationsGammeFromMoyen', function(req, res) {
    try {
        let code = req.query.code;
        daoProface.deleteOperationsGammeFromMoyen(code).then(value => {
            res.json(value);
        })
    } catch (e) {
        console.log(e);
    }
})
router.get("/infoGamme", function(req, res) {
    try {
        let libelleOpe = req.query.libelleOpe;
        daoProface.getIdOpe(libelleOpe).then(value => {
            res.json(value.recordset);
        });
    } catch (e) {
        console.log(e);
    }
});

router.post("/createGamme", function(req, res) {
    try {
        //console.log(req.body);
        let moyenCode = req.body.moyenCode;
        let operationsGamme = req.body.operationGamme;

        daoProface.getIdGamme(moyenCode).then(value => {
            //console.log(value.recordset[0])
            let idGamme = value.recordset[0].idGamme;
            daoProface.addGamme(moyenCode, idGamme, operationsGamme).then(value => {
                if (value) {
                    if (value.rowsAffected) {
                        res.json(value.recordset);
                    } else {
                        res.json("Problem");
                    }
                }
            })
        })
    } catch (e) {
        console.log(e);
        res.json("Problem");
    }
});

router.get("/allMoyensStoppedFromSecteur", function(req, res) {
    try {
        let code = req.query.code?req.query.code:null;

        daoProface.getMoyensStoppedFromSecteur(code).then(value => {
            res.json(value.recordset);
        });
    } catch (e) {
        console.log(e);
    }
});
module.exports = router;