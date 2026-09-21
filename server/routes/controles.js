const express = require('express');
const router = express.Router();

const { daoProface } = require('../instances');


router.get('/getAllControles', async(req, res) => {
    let machine = req.query.machine
    let dateDebut = req.query.dateDebut
    let dateFin = req.query.dateFin
    let operateur = req.query.operateur || null;
    let contexte = req.query.contexte || null;
    try {
        const result = await daoProface.getAllControles(machine, dateDebut, dateFin, operateur, contexte).then((value) => {
            // console.log(value)
            res.json(value);
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occured !")
    }
});
router.get('/getEvenementsMachines', async(req, res) => {
    let machine = req.query.machine
    let dateDebut = req.query.dateDebut
    let dateFin = req.query.dateFin
    //console.log("body : ",req.query)
    try {
        const result = await daoProface.getEvenementsMachines(machine, dateDebut, dateFin).then((value) => {
            //console.log(value)
            res.json(value);
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occured !")
    }
});

module.exports = router;