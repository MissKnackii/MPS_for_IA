const res = require('express/lib/response')
const sql = require('mssql')


var searchQuery = (secteur, categorie) => {
  const baseQuery = `SELECT d.id, d.nameuser, d.name, d.path, d.updateDate, d.uploadDate, s.name 'sector', c.name 'category' FROM dbo.Documents d JOIN dbo.Categories c ON (d.idCategory = c.id) JOIN dbo.Sectors s ON (d.idSector = s.id) ORDER BY d.name`
  const query1 = `SELECT d.id, d.nameuser, d.name, d.path, d.updateDate, d.uploadDate, s.name 'sector', c.name 'category', s.id 'idSector', c.id 'idCategory' FROM dbo.Documents d JOIN dbo.Categories c ON (d.idCategory = c.id) JOIN dbo.Sectors s ON (d.idSector = s.id) WHERE (c.id = '${categorie}') AND (s.id = '${secteur}') ORDER BY d.name`
  const query2 = `SELECT d.id, d.nameuser, d.name, d.path, d.updateDate, d.uploadDate, s.name 'sector', s.id 'idSector', c.id 'idCategory', c.name 'category'  FROM dbo.Documents d JOIN dbo.Sectors s ON (d.idSector = s.id) JOIN dbo.Categories c ON (d.idCategory = c.id) WHERE (s.id = '${secteur}') ORDER BY d.name`
  const query3 = `SELECT d.id ,d.nameuser, d.name, d.path, d.updateDate, d.uploadDate, c.name 'category', c.id 'idCategory', s.name 'sector', s.id 'idSector' FROM dbo.Documents d JOIN dbo.Categories c ON (d.idCategory = c.id) JOIN dbo.Sectors s ON (d.idSector = s.id) WHERE (c.id = '${categorie}') ORDER BY d.name`
  if (secteur && categorie) {
    // console.log(query1)
    return query1
  }else if (secteur && categorie === "") {
    // console.log(query2)
    return query2
  } else if (categorie && secteur === "") {
    //console.log(query3)
    return query3
  }else {
    // console.log(baseQuery)
    return baseQuery
  }
}

class DAO {
  constructor (){
    this.sqlConfig = {
      user: 'intranet',
      password: 'PWD',
      database: 'QUALITE',
      server: 'SRV-RH',
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

  async connect(){
    console.log("Connecting database ...");
    try {      
      await sql.connect(this.sqlConfig).then(() => { 
        console.log("Database connected !")
      })
    } catch (error) {
      console.log("Error, cannot run script : ", error)
    }
  }

  async getAllDocuments(){
    try {
      let query = `SELECT d.id, d.[index], d.nameuser, d.name, d.path, d.updateDate, d.uploadDate, s.name 'sector', c.name 'category'
                    FROM dbo.Documents d
                    JOIN dbo.Sectors s ON s.id = d.idSector
                    JOIN dbo.Categories c ON c.id = d.idCategory`
      const result = await sql.query(query);
      return result.recordset;
    } catch (err) {
      console.log("Error, cannot run script : ", err)
    }
  }

  async getCategories() {
    try {      
      const request = `SELECT * FROM dbo.Categories ORDER BY name;`
      const result = await sql.query(request);

      return result.recordset;
    } catch (error) {
      console.log("Error, cannot get categories", error);      
    }
  }

  async getSectors() {
    try {      
      const request = `SELECT * FROM dbo.Sectors ORDER BY name;`
      const result = await sql.query(request);
      
      return result.recordset;
    } catch (error) {
      console.log("Error, cannot get categories", error)
    }
  }

  async bddSearchQuery(secteur, categorie){
    try {
      const searchResult = await sql.query(searchQuery(secteur, categorie))

      return searchResult
    } catch (err) {
      console.log("Error, cannot run script : ", err)
    }
  }

  async uploadDocument(name,index, filePath, category, sector, user){
    console.log(user)
    try {
      if (name.includes("'")) {
        name = name.replace(/'/g, "''");
      }
      if (filePath.includes("'")) {
        filePath = filePath.replace(/[&\/\\#,+()$~%.'":*?<>{}é]/g,'_');
        //filePath.replace(/'/g, "''");

      }
      const request = `INSERT INTO dbo.Documents(name, path, idCategory, idSector, nameuser, [index]) VALUES ('${name}', '${filePath}', ${category}, ${sector}, '${user}','${index}');`
     
	 const res = await sql.query(request);
	 console.log(res);
	 
    } catch (err) {
      console.log("Error, cannot run script : ", err)
    }
  }

async deleteDocument(id) {
    try {
      const request = `DELETE dbo.Documents WHERE id = ${id}`;
      const result = await sql.query(request)

      return result;       
    } catch (err) {
      console.log("Impossible de supprimer le document dans la base : ", err)
    }
  }

  async getPathFromId(idDoc){
    try {
      let path;
      await sql.query`SELECT lienDoc FROM dbo.uploadDoc WHERE idDoc = ${idDoc}`
      .then((result) => {
        path = result 
      })
      return path
    } catch (err) {
      console.log("Error, cannot run script : ", err)
    }
  }

  async updateBDD (id, name, path, category, sector, user, index) {
    try {
      if (name.includes("'")) {
        name = name.replace(/'/g, "''");
      }
      
      if (path.includes("'")) {
        path = path.replace(/[&\/\\#,+()$~%.'":*?<>{}é]/g,'_');
      }
      const request = `UPDATE dbo.Documents SET name = '${name}', [index] = '${index}', nameuser = '${user}', path = '${path}', idCategory = '${category}', idSector = '${sector}', updateDate = GETDATE() WHERE id = '${id}'`

      await sql.query(request);
    } catch (err) {
      return err;
    }
  }
}

module.exports = DAO;
