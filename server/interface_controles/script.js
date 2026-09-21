// Executer depuis la racine du server "node interface_controles/script.js"

const fs = require('fs');
const sql = require("mssql");
const axios = require("axios")
const { CronJob } = require("cron")
require('dotenv').config();


const config = {
    user: process.env.DB_USERNAME,
    password: process.env.BD_PASSWORD,
    database: process.env.DB_NAME,
    server: process.env.DB_SERVER,
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    },
    options: {
        encrypt: false,
        enableArithAbort: false
    }
};


let getData = async () => {
    const dateYesterday = new Date();

    dateYesterday.setDate(dateYesterday.getDate() - 1);
    dateYesterday.setHours(0, 0, 0, 0);

    const pad = n => String(n).padStart(2, '0');

    const yesterday =
        dateYesterday.getFullYear() + '-' +
        pad(dateYesterday.getMonth() + 1) + '-' +
        pad(dateYesterday.getDate()) +
        'T00:00:00.000';

    const dateToday = new Date();
    dateToday.setHours(0, 0, 0, 0);

    const today = new Date(dateToday.getTime() - dateToday.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, -1);

    console.log(yesterday);
    console.log(today);
    await axios({
        method: 'get',
        url: `http://192.168.101.9:5127/api/pilotagehistoriqueids?q={"$and":[{"date": {"$gte":"${yesterday}"}},{"date": {"$lte":"${today}"}},{"machineId":"p2gbf53hYwJTWQWDR"}]}`,
        headers: {
            username: process.env.API_USERNAME,
            APIkey: process.env.API_KEY
        },
        responseType: 'json'
    })
        .then((response) => {
            let body = response.data;
            //console.log(body);
            body.forEach(element => {
                if (element.machineId === 'p2gbf53hYwJTWQWDR'){
                    element.machineId = '208'
                }
                if (element.contexteId === '6Q2oC3dpBuyvmxf8m'){
                    element.contexteId = '1 pièce / Réglage - Affûtage'
                }else if (element.contexteId === 'RnnHEwsK4jXuhAKGC'){
                    element.contexteId = 'APC 30 MN'
                }else if (element.contexteId === 'pQEvL8wjpx6giMSeW'){
                    element.contexteId = 'APC 2H'
                }else if (element.contexteId === 'juuDrEPWXZZHisB5a'){
                    element.contexteId = 'Ebauche SK1'
                }else if (element.contexteId === '44816200-959a-4e99-b2da-02ecaa4a3f57'){
                    element.contexteId = 'Mesures qualité'
                }
                if (element.pieceId === 'sCbsq8JvjKk9MEvYv'){
                    element.pieceId = 'POLE PIECE'
                }
            })
            //console.log(body)
            let toSend = [];
            body.forEach((item) => {
                let obj = new Object();
                obj.pieceId = item.pieceId;
                obj.machineId = item.machineId;
                obj.contexteId = item.contexteId;
                obj.date = item.date;
                obj.username = item.user_name;
                toSend.push(obj);
                //console.log(obj);
            })
            bulkInsert(toSend).then(r => {
                console.log('Successfully inserted');
            })
        });
}

async function bulkInsert(data) {
    let pool;

    try {
        pool = await sql.connect(config);

        const table = new sql.Table("PROFACE.dbo.Controles");

        table.create = false;

        table.columns.add("pieceId", sql.VarChar(100));
        table.columns.add("machineId", sql.Int);
        table.columns.add("contexteId", sql.VarChar(100));
        table.columns.add("date", sql.DateTime2);
        table.columns.add("username", sql.VarChar(100));

        for (const row of data) {
            table.rows.add(row.pieceId, row.machineId, row.contexteId, row.date, row.username);
        }

        await pool.request().bulk(table);

        console.log("Bulk insert terminé");
    } catch (err) {
        console.error("Erreur :", err);
    } finally {
        if (pool) await pool.close();
    }
}
// Pour un usage sur serveur, commenter 'getData();' et décommenter le bloc ci-dessous.
/*const job = new CronJob(
    '0 0 1 * * *',
    function () {
        getData();
    },
    null,
    true,
    'Europe/Paris'
);*/
module.exports = getData;
// getData();
