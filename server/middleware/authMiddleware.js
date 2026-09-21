const jwt = require('jsonwebtoken');

const jwtSecret = 'Mzc1MDM0ODExNzM4MTA4MQaz';

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    //console.log("token", token);
    if (!token) {
        return res.status(401).json({message: "Accès refusé. Token manquant."});
    }

    try {
        const decoded = jwt.verify(token, jwtSecret);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({message: "Token invalide."});
    }
};

module.exports = authMiddleware;