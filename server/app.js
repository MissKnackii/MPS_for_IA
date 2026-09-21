/* Import des modules */
const express = require('express');
const app = express();
const Server = require('./Server');
const DAO = require('./DAO');
const DAOProface = require('./DAOProface');
const routes = require('./routes/routes');
const DAO3D = require('./DAO3D');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const getData = require('./interface_controles/script.js')
const {CronJob} = require("cron");

/*Utilisation des middlewares*/
app.use(cors());
app.use(bodyParser.json());

/* Servir le FRONT */
const clientDistPath = path.join(__dirname, '..', 'client', 'dist');
app.use(express.static(clientDistPath));

/* Application des routes API */
app.use('/api', routes);
app.use('/auth', require('./routes/authRoutes'));
app.use('/achats', require('./routes/achats.js'));
app.use('/rebuts', require('./routes/rebuts.js'));
app.use('/3D', require('./routes/interface3D.js'));
app.use('/consultation', require('./routes/cycleProdBonneville.js'));
app.use('/controles', require('./routes/controles.js'));
app.use('/maintenance', require('./routes/maintenance.js'));
app.use('/consignes', require('./routes/consignes'));

/*Routes pour servir les fichiers statiques*/
//app.use('/', express.static(__dirname + '/client'));
app.use('/pdf', express.static(__dirname + '/pdf'));

/* Route fallback → renvoie index.html pour Vue Router */
app.get('*', (req,res) => {
	res.sendFile(path.join(clientDistPath, 'index.html'));
});

/* Initialisation et connexion à la BDD */
const { dao, daoProface, dao3D } = require('./instances');


/* Initialisation et démarrage du server */
const server = new Server(app);
server.start();

