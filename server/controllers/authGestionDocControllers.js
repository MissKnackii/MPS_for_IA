const ldap = require('ldapjs');
const jwt = require('jsonwebtoken');

// Fonction de connexion
const login = (req, res) => {
    //console.log(req.body)
    const { username, password } = req.body; // Récupération des ID deouis la requête

    const ldapOptions = {
        url: 'URL',
        baseDN: 'BASE',
        domain: 'DOMAINE',
        username: 'USERNAME',
        password: 'PASSWRD',
        group: 'CN=GestionDocumentsMPS,OU=Groupes,OU=Martin Joseph GPAO,DC=martin-gpao,DC=local',
        jwtSecret: 'JWT'
    }
    let groups;
    // Création du client LDAP
    const client = ldap.createClient({
        url: ldapOptions.url
    });

    const userDN = `${username}@${ldapOptions.domain}`;

    // 1: Connexion de l'utilisateur au serveur LDAP
    client.bind(userDN, password, (err) => {
        if (err) {
            return res.status(401).json({ message: "Authentification échouée." });
        }

        // 2: Recherche des informations de l'utilisateur
        const searchOptions = {
            scope: 'sub',
            filter: `(&(objectClass=user)(sAMAccountName=${username}))`,
            attributes: ['dn', 'memberOf']
        };

        client.search(ldapOptions.baseDN, searchOptions, (err, searchRes) => {
            if (err) {
                return res.status(500).json({ message: "Erreur lors de la recherche de l'utilisateur." });
            }

            // 3 : Vérifier si l'utilisateur est dans le bon groupe
            searchRes.on('searchEntry', (entry) => {
                groups = entry.attributes.find(attr => attr.type === 'memberOf')?.values || [];
                //isAuthorized = groups.includes(ldapOptions.group);
            });

            searchRes.on('end', () => {
                let isAuthorized = true;
                client.unbind(); //Fermer la connexion LDAP

                if (!isAuthorized) {
                    return res.status(403).json({ message: "Accès refusé : utilisateur non autorisé." });
                }
                let group = ldapOptions.group
                // 4: Génération du token JWT
                const token = jwt.sign({ username, group }, ldapOptions.jwtSecret, { expiresIn: '1h' });
                const decodedToken = jwt.decode(token)
                //console.log(token)
                // 5: Envoie du token au front
                res.json({ token, username, groups});
            });
        });
    });
};

module.exports = { login };
