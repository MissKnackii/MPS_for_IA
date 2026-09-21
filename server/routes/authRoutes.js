const express = require('express');
const router = express.Router();
const { login } = require('../controllers/authGestionDocControllers');
const jwt = require('jsonwebtoken');
const jwtSecret = 'Mzc1MDM0ODExNzM4MTA4MQaz';

router.post('/loginGestionDoc',(req, res, next) =>{
    //console.log(req.body)
    next()
}, login);

router.post('/check-access/qualite',(req, res, next) =>{
    const { token, groups } = req.body;
    if (!token) {
        //console.log('token is missing');
        res.status(401).send('User is not authenticated');
    }else{
        const decodedToken = jwt.verify(token, jwtSecret);
        const {username, group, iat, exp} = decodedToken;
        if (groups.includes('CN=GestionDocumentsMPS,OU=Groupes,OU=Martin Joseph GPAO,DC=martin-gpao,DC=local')){
            //console.log("check-access",decodedToken)
            res.send("Qualité")
            next()
        }else{
            //console.log('User is not authorised')
            res.status(403).send('User is not authorised');
        }

    }
})
router.post('/check-access/maintenance',(req, res, next) =>{
    const { token, groups } = req.body;
    if (!token) {
        //console.log('token is missing');
        res.status(401).send('User is not authenticated');
    }else{
        const decodedToken = jwt.verify(token, jwtSecret);
        const {username, group, iat, exp} = decodedToken;
        if (groups.includes('CN=Intranet-saisies,OU=Groupes,OU=Martin Joseph GPAO,DC=martin-gpao,DC=local')){
            //console.log("check-access",decodedToken)
            res.send("Maintenance")
            next()
        }else{
            //console.log('User is not authorised')
            res.status(403).send('User is not authorised');
        }

    }
})
router.post('/check-access/achats',(req, res, next) =>{
    const { token, groups } = req.body;
    if (!token) {
        //console.log('token is missing');
        res.status(401).send('User is not authenticated');
    }else{
        const decodedToken = jwt.verify(token, jwtSecret);
        const {username, group, iat, exp} = decodedToken;
        if (groups.includes('CN=Intranet-achats,OU=Groupes,OU=Martin Joseph GPAO,DC=martin-gpao,DC=local')){
            //console.log("check-access",decodedToken)
            res.send("GestionAchats")
            next()
        }else{
            //console.log('User is not authorised')
            res.status(403).send('User is not authorised');
        }

    }
})
router.post('/check-access/maintenanceNiv2',(req, res, next) =>{
    const { token, groups } = req.body;
    if (!token) {
        //console.log('token is missing');
        res.status(401).send('User is not authenticated');
    }else{
        const decodedToken = jwt.verify(token, jwtSecret);
        const {username, group, iat, exp} = decodedToken;
        if (groups.includes('CN=Intranet-Maintenance,OU=Groupes,OU=Martin Joseph GPAO,DC=martin-gpao,DC=local')){
            res.send("Maintenance")
            next()
        }else{
            //console.log('User is not authorised')
            res.status(403).send('User is not authorised');
        }

    }
})
router.post('/check-access/rebuts',(req, res, next) =>{
    const { token, groups } = req.body;
    if (!token) {
        console.log('token is missing');
        res.status(401).send('User is not authenticated');
    }else{
        const decodedToken = jwt.verify(token, jwtSecret);
        const {username, group, iat, exp} = decodedToken;
        if (groups.includes('CN=Intranet_Gestion_Rebuts,OU=Groupes,OU=Martin Joseph GPAO,DC=martin-gpao,DC=local')){
            //console.log("check-access",decodedToken)
            res.send("GestionRebuts")
            next()
        }else{
            console.log('User is not authorised')
            res.status(403).send('User is not authorised');
        }

    }
})
router.post('/check-access/CycleBonneville',(req, res, next) =>{
    const { token, groups } = req.body;
    if (!token) {
        console.log('token is missing');
        res.status(401).send('User is not authenticated');
    }else{
        console.log('hello')
        const decodedToken = jwt.verify(token, jwtSecret);
        const {username, group, iat, exp} = decodedToken;
        if (groups.includes('CN=Intranet-CycleProd,OU=Groupes,OU=Martin Joseph GPAO,DC=martin-gpao,DC=local')){
            console.log("check-access",decodedToken)
            res.send("CycleBonneville")
            next()
        }else{
            console.log('User is not authorised')
            res.status(403).send('User is not authorised');
        }

    }
})

router.post('/check-access/3D',(req, res, next) =>{
    const { token, groups } = req.body;
    if (!token) {
        console.log('token is missing');
        res.status(401).send('User is not authenticated');
    }else{
        console.log('hello')
        const decodedToken = jwt.verify(token, jwtSecret);
        const {username, group, iat, exp} = decodedToken;
        if (groups.includes('CN=Intranet-3D,OU=Groupes,OU=Martin Joseph GPAO,DC=martin-gpao,DC=local')){
            console.log("check-access",decodedToken)
            res.send("3D")
            next()
        }else{
            console.log('User is not authorised')
            res.status(403).send('User is not authorised');
        }

    }
})

router.post('/check-access/consignes',(req, res, next) =>{
    const { token, groups } = req.body;
    if (!token) {
        console.log('token is missing');
        res.status(401).send('User is not authenticated');
    }else{
        const decodedToken = jwt.verify(token, jwtSecret);
        const {username, group, iat, exp} = decodedToken;
        if (groups.includes('CN=Intranet-Consignes,OU=Groupes,OU=Martin Joseph GPAO,DC=martin-gpao,DC=local')){
            console.log("check-access",decodedToken)
            res.send("Consignes<")
            next()
        }else{
            console.log('User is not authorised')
            res.status(403).send('User is not authorised');
        }

    }
})

// Créer une route par page d'authentification.
module.exports = router;