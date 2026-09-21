const express = require('express');
const router = express.Router();
const multer = require('multer');

const upload = multer(); // pas de storage nécessaire

const { daoProface } = require('../instances');

router.get("/allrebuts", function(req, res) {
    try {
        daoProface.getAllRebuts().then((value) => {
            res.json(value.recordset);
        })
    } catch (e) {
        console.log(e);
    }
});
router.get("/top5", function(req, res) {
    try {
        daoProface.getTop5().then((value) => {
            res.json(value.recordset);
        })
    } catch (e) {
        console.log(e);
    }
});
router.get("/allref", function(req, res) {
    try {
        daoProface.getAllRef().then((value) => {
            res.json(value.recordset);
        })
    } catch (e) {
        console.log(e);
    }
});
router.post("/addrebuts", upload.none(), function(req, res) {
    const {
        of, secteur, reference, commentaire, quantite, visa
    } = req.body;
    //console.log(of, secteur, reference, commentaire, quantite, visa)
    try {
        daoProface.addRebuts(of, secteur, reference, commentaire, quantite, visa).then((value) => {
            res.json('ok');
        })
    } catch (e) {
        console.log(e);
    }
});
router.post("/addref", upload.none(), function(req, res) {
    const {ref, des} = req.body;
    console.log(ref, des)
    try {
        daoProface.addRef(ref, des).then((value) => {
            res.status(200);
        })
    } catch (e) {
        console.log(e);
    }
});

module.exports = router;