const express = require('express');
const router = express.Router();
const cors = require('cors');
const bodyParser = require('body-parser');
const multer  = require('multer');
const path = require('path');
const fs = require('fs');
const authMiddleware = require('../middleware/authMiddleware');


//Initialisation à la base de données
const { dao } = require('../instances');

/* Configuration de Multer pour conserver l'extension du fichier */
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'pdf/');
    },
    filename: (req, file, cb) => {
        //Extraire l'extension
        const originalExtension = path.extname(file.originalname);
        file.originalname = file.originalname.replace(/[&\/\\#,+()$~%.'":*?<>{}é]/g,'_');
        //Ajouter l'extension au nom
        cb(null, file.originalname + '-' + originalExtension);
    }
})

//Initialisation du Multer
const upload = multer({ storage: storage })

/* Configuration middlewares */
//Traiter les requêtes entrantes contenant des JSON
router.use(bodyParser.json());
//Traiter les requêtes entrantes avec des données encodées en URL
router.use(bodyParser.urlencoded({ extended: true }));


router.get('/categories', async(req, res) => {
    try {
        const result = await dao.getCategories().then((value) => {
            res.json(value);
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occured !")
    }
});

router.get('/sectors', async(req, res) => {
    try {
        const result = await dao.getSectors().then((value) => {
            res.json(value);
        });

    } catch (error) {
        console.error(error);
        res.status(500).send("An error occured !")
    }
});

router.get('/documents', cors(), async (req, res) => {
    try {
        await dao.getAllDocuments().then((value) => {
            res.json(value);
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred' });
    }
});

router.post('/documents', upload.single('file'), (req, res, next) => {
    const name = req.body.name;
    const category = req.body.category;
    const sector = req.body.sector;
    let filePath = req.file.path;
    let user = req.body.user;
    let index = req.body.index;
    console.log(req.body)
    //Pour retirer la partie 'server/' du lien
    let basePath = 'server\\';
    if (filePath.startsWith(basePath)) {
        filePath = filePath.slice(basePath.length);
        filePath = filePath.replace(/[&\/\\#,+()$~%.'":*?<>{}é]/g,'_');
    }

    dao.uploadDocument(name, index, filePath, category, sector, user);
    res.status(200).send('Document uploadé !');
});

router.get('/data/search', cors(), async (req, res) => {
    try {
        const categorie = req.query.searchCategorie;
        const secteur = req.query.searchSecteur;

        const result = await dao.bddSearchQuery(secteur, categorie);
        res.json(result);
        // console.log(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred' });
    }
});

//Modification d'un document
router.put('/document', upload.single('file'), (req, res) => {
    const id = req.body.id;
    const index = req.body.index;
    const name = req.body.name;
    let filePath = req.file.path;
    const category = req.body.category;
    const sector = req.body.sector;
    const user = req.body.user;
    let basePath = 'server\\';
    if (filePath.startsWith(basePath)) {
        filePath = filePath.slice(basePath.length);
    }

    dao.updateBDD(id, name, filePath, category, sector, user, index).then(value => {
        if (!value) {
            res.status(200).send('Le document a bien été modifié.');
        } else {
            res.send('Une erreur s\'est produite : ' + value.message);
        }
    });

});

router.delete('/document', (req, res) => {
    const { id, path: filePath } = req.body;

    try {
        dao.deleteDocument(id)
            .then(result => {
                if (result.rowsAffected > 0) {
                    const absolutePath = path.join(__dirname, filePath);

                    fs.unlink(absolutePath, (err) => {
                        /*if (err) {
                            return res.status(500).json({ error: 'Erreur lors de la suppression du fichier' });
                        }*/

                        res.status(200).json({ message: 'Document supprimé avec succès' });
                    })
                }
            })
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;
