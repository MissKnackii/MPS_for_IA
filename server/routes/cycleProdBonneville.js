const express = require('express');
const router = express.Router();

const { daoProface } = require('../instances');


router.get("/indicateurs", function(req, res) {
    let start = new Date(req.query.startDate);
    let end = new Date(req.query.endDate);
    let machine = req.query.machine?req.query.machine:null;
    let reference = req.query.machine?req.query.reference:null;
    let startDate = start?start:null;
    let endDate = end?end:null;
    let deuxiemePassage = req.query.deuxiemePassage?req.query.deuxiemePassage:null;
    daoProface.getIndicators(machine, reference, startDate, endDate, deuxiemePassage).then( value => {
        if (value === "RequestError") {
            res.json("RequestError");
        } else {
            res.json(value.recordset);
        }
    });
});

//Récupération des paramètres d'une machine selon son id et une référence de pièce
router.get("/parametresMachine", function(req, res) {
    let idMachine = req.query.idMachine?req.query.idMachine:null;
    let idReferencePieces = req.query.idReferencePieces?req.query.idReferencePieces:null;
    try {
        daoProface.getParam(idMachine, idReferencePieces).then(function(value) {
            res.json(value.recordset);
        })
    } catch (e) {
        console.log(e);
    }
});

router.get("/nc", function(req, res) {
    let start = new Date(req.query.startDate);
    let end = new Date(req.query.endDate);

    let machine = req.query.machine?req.query.machine:null;
    let reference = req.query.machine?req.query.reference:null;
    let startDate = start?start:null;
    let endDate = end?end:null;
    let deuxiemePassage = req.query.deuxiemePassage?req.query.deuxiemePassage:null;
    daoProface.getNC(machine, reference, startDate, endDate, deuxiemePassage).then( function(value) {
        res.json(value.recordset);
    });
});

router.get("/nbArrets", function(req, res) {
    let start = new Date(req.query.startDate);
    let end = new Date(req.query.endDate);

    let machine = req.query.machine?req.query.machine:null;
    let reference = req.query.machine?req.query.reference:null;
    let startDate = start?start:null;
    let endDate = end?end:null;
    let deuxiemePassage = req.query.deuxiemePassage?req.query.deuxiemePassage:null;
    daoProface.getNbArrets(machine, reference, startDate, endDate, deuxiemePassage).then( function(value) {
        res.json(value.recordset);
    });
});

router.get("/tempsArrets", function(req, res) {
    let start = new Date(req.query.startDate);
    let end = new Date(req.query.endDate);

    let machine = req.query.machine?req.query.machine:null;
    let reference = req.query.machine?req.query.reference:null;
    let startDate = start?start:null;
    let endDate = end?end:null;
    let deuxiemePassage = req.query.deuxiemePassage?req.query.deuxiemePassage:null;
    daoProface.getTempsArrets(machine, reference, startDate, endDate, deuxiemePassage).then( function(value) {
        res.json(value.recordset);
    });
});

router.get("/allMachinesBonneville", function(req, res) {
    try {
        daoProface.getMachinesBonneville().then(function(value) {
            res.json(value.recordset);
        })
    } catch (e) {
        console.log(e);
    }
});

//Récupération des références selon l'id d'une machine donné
router.get("/idReferencePiecesMachine", function(req, res) {
    let idMachine = req.query.idMachine?req.query.idMachine:null;
    try {
        daoProface.getReferencePieces(idMachine).then(function(value) {
            res.json(value.recordset);
        })
    } catch (e) {
        console.log(e);
    }
});

router.post("/exportData", function(req, res) {
    try {
        let allData = req.body.allData;
        let machine = req.body.idMachine;
        let reference = req.body.idReferencePieces;
        let passage2 = req.body.passage2;
        let startDatetime = req.body.startDate;
        let endDatetime = req.body.endDate;
        daoProface.exportData(allData, machine, reference, passage2, startDatetime, endDatetime).then((value) => {
            res.attachment(__dirname+'/ExportData.csv');
            res.status(200).send(value);
        })

    } catch (e) {
        console.log(e);
    }
})
router.get("/updateObjectifs", function(req, res) {
    try {
        let trg = req.query.trg?req.query.trg:'null';
        let trs = req.query.trs?req.query.trs:'null';
        let tre = req.query.tre?req.query.tre:'null';
        let piecesMinute = req.query.piecesMinute?req.query.piecesMinute:'null';
        let tpsCycle = req.query.tpsCycle?req.query.tpsCycle:'null';
        let numMachine = req.query.numMachine?req.query.numMachine:'null';
        let referencePiece = req.query.referencePiece?req.query.referencePiece:'null';

        daoProface.setObjectives(trg, trs, tre, piecesMinute, tpsCycle, numMachine, referencePiece).then( function(value) {
            if (value === "RequestError") {
                res.json("RequestError");
            } else if (value.rowsAffected > 0) {
                res.json("OK");
            }
        });

    } catch (e) {
        res.json(e)
    }
});

router.post("/createMachine", function(req, res) {
    try {
        daoProface.insertNewMachine(req.body.idMachine, req.body.libelleMachine, req.body.referencePieces, req.body.tempsCycle, req.body.piecesMinute, 90, 80, 45, 10, req.body.libelleNC.n1, req.body.libelleNC.n2, req.body.libelleNC.n3, req.body.libelleNC.n4, req.body.libelleNC.n5, req.body.libelleNC.n6, req.body.libelleNC.n7, req.body.libelleNC.n8, req.body.libelleNC.n9, req.body.libelleNC.n10, req.body.libelleArret.n1, req.body.libelleArret.n2, req.body.libelleArret.n3, req.body.libelleArret.n4, req.body.libelleArret.n5, req.body.libelleArret.n6, req.body.libelleArret.n7, req.body.libelleArret.n8, req.body.libelleArret.n9, req.body.libelleArret.n10)
            .then(function(value) {
                res.redirect('/Parametrage');
            });
    } catch (e) {
        console.log(e);
    }
})

router.post("/exportLibelles", function(req, res) {
    try {
        daoProface.exportLibelle().then((value) =>  {
            res.attachment(__dirname+'/ExportLibelle.csv');
            res.status(200).send(value);
        })

    } catch (e) {
        console.log(e);
    }
})

module.exports = router
