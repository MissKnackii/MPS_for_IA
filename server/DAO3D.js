const sql = require("mssql");

class DAO3D {
    constructor() {
        this.sqlConfig = {
            user: 'intranet',
			password: 'PWDS',
			server: 'SRV-RH',
			port:1433,
			database: 'PROFACE',
            pool: {
                max: 10,
                min: 0,
                idleTimeoutMillis: 30000
            },
            options: {
                encrypt: false,
                enableArithAbort: false
            }
        }
    }

    async connect() {
        console.log("Connecting 3D database ...");
        try {
            await sql.connect(this.sqlConfig).then(() => {
                console.log("Database 3D connected !")
            })
        } catch (error) {
            console.log("Error, cannot run script : ", error)
        }
    }
    async get3DData() {
        try {
            const request = 'SELECT pos.id, pos.timestamp, pos.position_type, pos.position_index, pos.palette_number, pos.derniereModification, ref.piece_reference FROM PROFACE.dbo.PalettesPositions pos LEFT JOIN PROFACE.dbo.PalettesReferences ref ON pos.palette_number = ref.palette_number'
            const result = await sql.query(request);
            return result;
        } catch (error) {
            console.log("Error, cannot get data", error);
        }
    }
    async get3DReferences() {
        try {
            const request = 'SELECT * FROM PROFACE.dbo.PalettesReferences'
            const result = await sql.query(request);
            return result;
        } catch (error) {
            console.log("Error, cannot get data", error);
        }
    }
    async add3DReferences(tag, reference) {
        try {
            const request = `INSERT INTO PROFACE.dbo.PalettesReferences VALUES (${tag}, '${reference}');`
            console.log(request);
            const result = await sql.query(request);
            return result;
        } catch (error) {
            console.log("Error, cannot get data", error);
        }
    }
}

module.exports = DAO3D;