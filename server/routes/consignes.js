const express = require('express');
const router = express.Router();
const multer = require('multer');

const upload = multer(); // pas de storage nécessaire

const { daoProface } = require('../instances');


router.get("/getData", function(req, res) {
    try {
        daoProface.getConsignes().then((value) => {
            res.json(value.recordset);
        })
    } catch (e) {
        console.log(e);
    }
})

router.get("/solderConsigne", function(req, res) {
    try {
        let id = req.query.id;
        let demande = req.query.demande;
        let reponse = req.query.reponse;

        daoProface.solderConsigne(id, demande, reponse).then((value) => {
            if (value == 'ERROR') {
                res.json('ERROR');
            } else {
                res.json(value.rowsAffected);
            }
        });
    } catch (e) {
        console.log(e);
    }
})

router.get("/passerEnCoursConsigne", function(req, res) {
    try {
        let id = req.query.id;
        let demande = req.query.demande;
        let reponse = req.query.reponse;

        daoProface.passerEnCoursConsigne(id, demande, reponse).then((value) => {
            if (value == 'ERROR') {
                res.json('ERROR');
            } else {
                res.json(value.rowsAffected);
            }
        });
    } catch (e) {
        console.log(e);
    }
});

router.get("/enregistrerConsigne", function(req, res) {
    try {
        let id = req.query.id;
        let demande = req.query.demande;
        let destinataire = req.query.destinataire;
        let reponse = req.query.reponse;

        daoProface.enregistrerConsigne(id, demande, destinataire, reponse).then((value) => {
            if (value === 'ERROR') {
                res.json('ERROR');
            } else {
                res.json(value.rowsAffected);
            }
        });
    } catch (e) {
        console.log(e);
    }
})

router.get("/supprimerConsigne", function(req, res) {
    try {
        let id = req.query.id;

        daoProface.supprimerConsigne(id).then((value) => {
            if (value == 'ERROR') {
                res.json('ERROR');
            } else {
                res.json(value.rowsAffected);
            }
        });
    } catch (e) {
        console.log(e);
    }
})

router.get("/getSecteurs", function(req, res) {
    try {
        daoProface.getS().then((value) => {
            res.json(value.recordset);
        })
    } catch (e) {
        console.log(e);
    }
});

router.get("/getSections", function(req, res) {
    try {
        let secteur = req.query.secteur;
        daoProface.getSections(secteur).then((value) => {
            res.json(value.recordset);
        })
    } catch (e) {
        console.log(e);
    }
});

router.get("/getMachines", function(req, res) {
    try {
        let secteur = req.query.secteur;
        let section = req.query.section;

        daoProface.getM(secteur, section).then((value) => {
            res.json(value.recordset);
        })
    } catch (e) {
        console.log(e);
    }
});

router.get("/getReference", function(req, res) {
    let secteur = req.query.secteur;
    let section = req.query.section;
    let machine = req.query.machine;
    try {
        daoProface.getR(secteur, section, machine).then((value) => {
            res.json(value.recordset);
        });
    } catch (e) {
        console.log(e);
    }
});

router.get("/getEffectifs", function(req, res) {
    let secteur = req.query.secteur;
    try {
        daoProface.getEffectifs(secteur).then((value) => {
            res.json(value.recordset);
        })
    } catch (e) {
        console.log(e);
    }
});

router.post("/sendData", function(req, res) {
    let secteur = req.body.secteur.id;
    let section = req.body.section;
    let machine = req.body.machine;
    let reference = req.body.reference.reference;
    let origine = req.body.origine;
    let action = req.body.typeAction;
    let nom = req.body.nom.id;
    let detail = req.body.demande;
    let destinataire = req.body.destinataire.id;
    let reponse = req.body.reponse;
    let etat = req.body.etat;
    try {
        daoProface.newConsigne(secteur, section, machine, reference, origine, action, nom, detail, destinataire, reponse, etat).then(function(value) {
            if (value.rowsAffected[0] === 1) {
                res.json("OK");
            } else {
                res.json("ERROR")
            }
        })
    } catch (e) {
        console.log(e);
    }
});

router.get("/filtrer", function(req, res) {
    try {
        let secteur = req.query.secteur ;
        let section = req.query.section ;
        let machine = req.query.machine ;
        let reference = req.query.reference ;
        let origine = req.query.origine ;
        let action = req.query.action ;
        let nom = req.query.nom ;
        let etat = req.query.etat ;

        daoProface.filtrerConsignes(secteur, section, machine, reference, origine, action, nom, etat).then((value) => {
            res.json(value.recordset);
        });
    } catch (e) {
        console.log(e);
    }
})

router.get("/updateReference", function(req, res) {
    let numMachine = req.query.numMachine;
    let oldReference = req.query.oldReference;
    let newReference = req.query.newReference;

    daoProface.updateReference(numMachine, oldReference, newReference).then((value) => {
        res.json(value);
    })
})

module.exports = router;