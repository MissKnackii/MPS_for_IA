const express = require('express');
const router = express.Router();

const { dao3D } = require('../instances');


router.get('/3D', async(req, res) => {
    try {
        const result = await dao3D.get3DData().then((value) => {
            console.log(value)
            res.json(value);
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occured !")
    }
});
router.get('/3D-references', async(req, res) => {
    try {
        const result = await dao3D.get3DReferences().then((value) => {
            console.log(value)
            res.json(value);
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occured !")
    }
});
router.post('/3D-add-reference', async(req, res) => {
    let tag = req.body.tag;
    let reference = req.body.reference;
    try {
        const result = await dao3D.add3DReferences(tag, reference).then((value) => {
            console.log(value)
            res.json(value);
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occured !")
    }
});

module.exports = router;