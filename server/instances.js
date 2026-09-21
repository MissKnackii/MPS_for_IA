const DAO = require('./DAO');
const DAOProface = require('./DAOProface');
const DAO3D = require('./DAO3D');

const dao = new DAO();
const daoProface = new DAOProface();
const dao3D = new DAO3D();

dao.connect();
daoProface.connect();
dao3D.connect();

module.exports = { dao, daoProface, dao3D };