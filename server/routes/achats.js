const express = require('express');
const router = express.Router();
const multer = require('multer');

const upload = multer(); // pas de storage nécessaire

const { daoProface } = require('../instances');


router.post("/createDemande", upload.none(), function(req, res) {
    //console.log('BODY reçu:', req.body);

    const {
        nom, service, nature, marque, categorie,
        commentaire, refe, delai, urgent, livraison, justificatif
    } = req.body;
    const demande1 = req.body.demande1;
    const demande2 = req.body.demande2;
    const demande3 = req.body.demande3;
    const demande4 = req.body.demande4;
    const demande5 = req.body.demande5;
    console.log('Test erreur achats.js')
    daoProface.sendDemande(nom, service, nature, marque, categorie,demande1.refe, demande1.unite, demande1.piece, demande2.refe, demande2.unite, demande2.piece, demande3.refe, demande3.unite, demande3.piece, demande4.refe, demande4.unite, demande4.piece, demande5.refe, demande5.unite, demande5.piece, commentaire, refe, delai, urgent, livraison, justificatif)
    res.json({ success: true, message: 'Requête bien reçue', debug: req.body });
});

router.get("/allCategories", function(req, res) {
    try {
        daoProface.getCategories().then((value) => {
            res.json(value.recordset);
        })
    } catch (e) {
        console.log(e);
    }
});
router.get("/allDemandes", function(req, res) {
    try {
        daoProface.getAllDemandes().then(value => {
            res.json(value.recordset);
        })
    } catch (e) {
        console.log(e);
    }
});
router.get("/allDemandesEnCours", function(req, res) {
    try {
        daoProface.getAllDemandesEnCours().then(value => {
            res.json(value.recordset);
        })
    } catch (e) {
        console.log(e);
    }
});
router.post("/filtrer", function(req, res) {
    console.log(req.body)
    const { ordreDateDemande, salarie, service, codeCategories, nomFournisseur, urgent, numCommande, etat} = req.body;
    try {
        daoProface.filtrer(ordreDateDemande, salarie, service, codeCategories, nomFournisseur, numCommande, urgent, etat).then(value => {
            console.log(value.recordset);
            res.json(value.recordset)

        })
    } catch (e) {
        console.log(e);
    }
});
router.post("/enregistrer", function(req, res) {
    console.log(req.body)
    const demande = req.body;
    try {
        daoProface.updateDemande(demande.numDemande, demande.nomFournisseur, demande.delaiAttribue, demande.etatDemande, demande.numCommande, demande.commentaires, demande.lieuEnlevement).then(value => {
            console.log(value.recordset);
            res.json(value.recordset)

        })
    } catch (e) {
        console.log(e);
    }
});
module.exports = router;