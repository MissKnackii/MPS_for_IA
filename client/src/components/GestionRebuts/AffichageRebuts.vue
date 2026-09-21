<template>
  <h1>Gestion des rebuts</h1>
  <div id="info">
      <div id="top5">
        <h4>Top 5 {{ this.currentMonth }}</h4>
        <ul>
          <li v-for="top in this.top5.slice(0, 5)"><b>{{ top.reference}}</b> : {{ top.quantite}}</li>
        </ul>
      </div>
      <div id="total">
        <h4>Total secteurs {{this.year}}</h4>
        <ul>
          <li>Salle blanche : <b>{{this.totalSalleBlanche}}</b></li>
          <li>Contrôle/Assemblage/tri : <b>{{this.totalTri}}</b></li>
          <li>Reprise/rectification : <b>{{this.totalReprise}}</b></li>
          <li>Prison : <b>{{this.totalPrison}}</b></li>
        </ul>
      </div>

      <button id="formRebuts" class="rebuts" @click="this.showPopupUpload = true">ENREGISTREMENT DES REBUTS BONNEVILLE</button>
      <div id="buttons">
        <button id="export" @click="this.showPopupExport = true" class="rebuts">EXPORT</button>
      </div>
  </div>

  <div id="results">
    <table>
      <thead>
        <tr id="head">
          <td id="grey"><p>Date</p></td>
          <td class="blue"><p>OF</p></td>
          <td class="blue"><p>Secteur</p></td>
          <td class="blue"><p>Référence</p></td>
          <td class="blue"><p>Quantité</p> </td>
          <td class="blue"><p>Initiales</p> </td>
          <td class="blue"><p>Commentaires</p> </td>
        </tr>
      </thead>
      <tbody>
      <tr v-for="(demande, index) in this.currentDayData" :key="index">
        <td><p>{{ this.formatDate(new Date(demande.date)) }}</p></td>
        <td><p>{{ demande.ordre_fabrication }}</p></td>
        <td><p>{{ demande.secteur }}</p></td>
        <td><p>{{ demande.reference }}</p></td>
        <td><p>{{ demande.quantite }}</p></td>
        <td><p>{{ demande.visa }}</p></td>
        <td><p>{{ demande.commentaire }}</p></td>
      </tr>
      </tbody>
    </table>
  </div>

  <div v-if="this.showPopupRef" id="overlay" @click="this.showPopupRef = false"></div>
  <div class="popup" v-if="showPopupRef" @click.stop>
    <button id="close" @click="showPopupRef = false">X</button>

    <h3>Ajouter une référence</h3>
    <form @submit="addRef()">
      <p>Référence : </p>
      <input v-model="uploadRef" placeholder="Référence" required/>
      <br>
      <p>Désignation : </p>
      <input v-model="desRef" placeholder="désignation" required/>
      <br>
      <br>
      <input id="button" type="submit" value="Enregistrer">
    </form>
  </div>

  <div v-if="this.showPopupExport" id="overlay" @click="this.showPopupExport = false"></div>
  <div class="popup" v-if="showPopupExport" @click.stop>
    <button id="close" @click="showPopupExport = false">X</button>

    <h3>Exporter des données</h3>
    <form @submit.prevent="exportToCsv()">
      <p>Date de début : </p>
      <input type="date" v-model="exportDateDebut" placeholder="Référence" required/>
      <br>
      <p>Date de fin : </p>
      <input type="date" v-model="exportDateFin" placeholder="Référence" required/>
      <br>
      <br>
      <input id="button" type="submit" value="Enregistrer">
    </form>
  </div>

  <div v-if="this.showPopupUpload" id="overlay" @click="this.showPopupUpload = false"></div>
  <div class="popup" v-if="showPopupUpload" @click.stop>
    <button id="close" @click="showPopupUpload = false">X</button>

    <h2>Enregistrement rebuts</h2>
    <p><b>N'enregistrer un rebut que si la quantité est supérieure a 5 !</b></p>
    <form @submit.prevent="addRebut()">
      <label>OF : </label>
      <br>
      <input v-model="rebut.of" placeholder="Ordre de fabrication"/>
      <br>
      <label><b>*</b> Secteur : </label>
      <br>
      <select v-model="rebut.secteur" name="secteur" required>
        <option selected value="5">--Choisissez une option--</option>
        <option value="2">Salle blanche</option>
        <option value="3">Contrôle/Assemblage/tri</option>
        <option value="4">Reprise rectification</option>
        <option value="1">Prison</option>
        <option value="6">Lavage Bonneville</option>
      </select>
      <br>
      <label><b>*</b> Référence : </label>
      <br>
      <select v-model="rebut.reference" id="" name="secteur" required>
        <option selected value="default">--Choisissez une option--</option>
        <option v-for="reference in this.allRef" :value="reference.id">{{reference.reference}}</option>
      </select>
      <br>
      <label for="">Commentaires : </label>
      <br>
      <textarea v-model="rebut.commentaire" rows="5" cols="33"></textarea>
      <br>
      <div id="buttons-popup">
        <div>
          <label><b>*</b> Quantité : </label>
          <br>
          <input v-model="rebut.quantite" placeholder="Quantité" required/>
        </div>

        <div>
          <label><b>*</b> Visa : </label>
          <br>
          <input v-model="rebut.visa" placeholder="Visa" required/>
          <br>
        </div>

      </div>
      <input id="button" type="submit" value="Enregistrer">
    </form>
  </div>
</template>
<script>

export default {
  data() {
    return {
      allData:'',
      showPopupRef: false,
      showPopupExport: false,
      showPopupUpload: false,
      uploadRef: '',
      exportDateDebut: '',
      exportDateFin: '',
      desRef: '',
      rebut: {
        of:'',
        secteur:'',
        reference: 'null',
        commentaire: 'null',
        quantite:'',
        visa:'',
      },
      toSend: new FormData,
      refToSend: new FormData,
      allRef: '',
      noResult: false,
      date:'',
      totalSalleBlanche:'',
      totalTri:'',
      totalReprise:'',
      totalPrison:'',
      months: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"],
      month: (new Date).getMonth(),
      currentMonth: '',
      currentDayData:'',
      todayDate: new Date(),
      day: '',
      yesterdayDate: new Date(),
      top5: '',
      year: new Date().getFullYear(),
    }
  },
  methods: {
    async getRebuts() {
      await fetch(`${import.meta.env.VITE_API_URL}/rebuts/allrebuts`, {
        method: 'GET',
      })
          .then(res => res.json())
          .then(data => {
            this.allData = data
            console.log(this.allData)
            const currentYear = new Date().getFullYear();
            this.totalSalleBlanche = this.makeTotalSecteur(this.allData.filter(element => {const elementYear = new Date(element.date).getFullYear();return element.secteur === 'Salle blanche' && elementYear === currentYear;}))
            this.totalTri = this.makeTotalSecteur(this.allData.filter(element => {const elementYear = new Date(element.date).getFullYear();return element.secteur === 'Contrôle/Assemblage/tri' && elementYear === currentYear;}))
            this.totalReprise = this.makeTotalSecteur(this.allData.filter(element => {const elementYear = new Date(element.date).getFullYear();return element.secteur === 'Reprise rectification' && elementYear === currentYear;}))
            this.totalPrison = this.makeTotalSecteur(this.allData.filter(element => {const elementYear = new Date(element.date).getFullYear();return element.secteur === 'prison' && elementYear === currentYear;}))
            //this.resetTotal()
            this.currentDayData = this.allData.filter((element) => this.formatDate(new Date(element.date)) === this.formatDate(this.yesterdayDate) || this.formatDate(new Date(element.date)) === this.formatDate(this.todayDate))
          })
          .catch(err => console.error(err));
    },
    async getTop5() {
      await fetch(`${import.meta.env.VITE_API_URL}/rebuts/top5`, {
        method: 'GET',
      })
          .then(res => res.json())
          .then(data => {
            this.top5 = data.filter((e) => e.date ===  this.currentMonth).sort((a, b) => b.quantite - a.quantite);

          })
          .catch(err => console.error(err));
    },
    formatDate(date) {
      const formatedDate = date.getUTCDate() + '/' + (date.getUTCMonth() + 1) + '/' + date.getUTCFullYear();
      return formatedDate.toLocaleString('fr-FR');
    },
    makeTotalSecteur(obj){
      //console.log(obj)
      let total = 0;
      obj.forEach(element => {
        total = total + element.quantite
      })
      return total
    },
    async getRef() {
      await fetch(`${import.meta.env.VITE_API_URL}/rebuts/allref`, {
        method: 'GET',
      })
          .then(res => res.json())
          .then(data => {
            this.allRef = data
          })
          .catch(err => console.error(err));
    },
    async addRebut() {
      if (this.rebut.quantite < 5){
        window.alert('La quantité doit être supérieure a 5')
      }else if ((this.rebut.reference === 'null' || this.rebut.reference ===  187)
          && this.rebut.commentaire === 'null') {
        window.alert("Si la référence n'est pas dans la liste déroulante veuillez la noter en commentaire")
      } else {
        this.toSend.append('of', this.rebut.of);
        this.toSend.append('secteur', this.rebut.secteur);
        this.toSend.append('reference', this.rebut.reference);
        this.toSend.append('commentaire', this.rebut.commentaire);
        this.toSend.append('quantite', this.rebut.quantite);
        this.toSend.append('visa', this.rebut.visa);


        await fetch(`${import.meta.env.VITE_API_URL}/rebuts/addrebuts`, {
          method: 'POST',
          body: this.toSend,
        })
            .then(res => {
              console.log("Status :", res.status);
              if (!res.ok) throw new Error("Erreur serveur");
              return res.text();
            })
            .then( data =>{
              console.log(data);
              window.alert("Votre enregistrement a bien été validé")
              location.reload()
            })
            .catch(err => console.error(err));
      }
    },
    async addRef() {
      this.refToSend.append('ref', this.uploadRef);
      this.refToSend.append('des', this.desRef);

      await fetch('${import.meta.env.VITE_API_URL}/rebuts/addref', {
        method: 'POST',
        body: this.refToSend,
      })
          .then(res => res.json())
          //.then(data => console.log(data))
          .catch(err => console.error(err));
    },
    exportToCsv(){
      let result;
      if (this.exportDateDebut !== "" && this.exportDateFin !== "") {
        result = this.allData.filter(obj => {
          return this.exportDateDebut<= obj.date && obj.date <= this.exportDateFin;
        });
      }
      if(result.length >= 1){
        result.forEach(element => {
          element.date = this.formatDate(new Date(element.date))
        })
        this.getDataToCSV(result)
      }else {
        this.noResult = true
      }
    },
    writeCSVFile(file, key){
      const data = file;
      const blob = new Blob([data], {type: 'text/csv'});
      const e = document.createEvent('MouseEvents');
      const a = document.createElement('a');
      a.download = "export" + "-" + 'Rebuts' + "-" + this.date + ".csv";
      a.href = window.URL.createObjectURL(blob);
      a.dataset.downloadurl = ['text/csv', a.download, a.href].join(':');
      e.initEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
      a.dispatchEvent(e);
    },
    getDataToCSV(results){
      const items = results
      const replacer = (key, value) => value === null ? '' : value
      const header = Object.keys(items[0])
      const csv = [
        header.join(';'),
        ...items.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(';'))
      ].join('\r\n')
      this.writeCSVFile(csv);
    },
    resetTotal(){
      let day = new Date().getDate()
      let month = new Date().getMonth()
      if (day == 1 && month == 0){
        this.totalSalleBlanche = 0
        this.totalTri = 0
        this.totalReprise = 0
        this.totalPrison = 0
      }
    }
  },
  created() {
    this.getRebuts()
    this.getRef()
    this.getTop5()

    this.date = new Date();
    this.date =  this.date.getDay() + '-' + this.date.getMonth() + '-' + this.date.getFullYear()
    this.currentMonth =  this.months[this.month]
    this.day = (this.todayDate.getDate())-1
    this.yesterdayDate.setDate(this.day);
  },
}
</script>
<style scoped>
#buttons-popup{
  width: 100%;
  display: flex;
  align-content: center;
  justify-content: center;
}
h2{
  text-align: center;
}
#overlay{
  width: 100%;
  height: 100%;
  position: fixed;
  background-color: rgba(0, 0, 0, 0.55);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 3;
}
.popup b{
  color:red;
}
#total li{
  font-family: 'Istok Web',serif;
  font-style: normal;
  font-size: 15px;
  line-height: 20px;
  color: #000000;
}
.popup {
  position: fixed;
  left: 30%;
  top: 10%;
  width: 40%;
  background: white;
  border-radius: 6px;
  border: #cde6fe solid 1px;
  text-align: center;
  padding: 16px;
  font-family: 'Istok Web',serif;
  color: #000000;
  z-index: 3;

}

#close{
  width: fit-content;
  margin: 0 auto;
  padding: 4px 10px;
  left: 90%;
  position: absolute;
}

#close:hover{
  border: solid 1px #9bcefd;
  font: 85% Arial;
}

/*#info{
  display: flex;
  flex-direction: row;
}*/
h1{
  margin: 0;
  position: relative;
  font-family: 'Istok Web',serif;
  font-style: normal;
  font-weight: 700;
  font-size: 25px;
  line-height: 60px;
  color: #000000;
}
h4{
/*
  position: relative;
  font-family: 'Istok Web',serif;
  font-style: normal;
  font-weight: 300;
  font-size: 20px;
  line-height: 60px;*/
  margin-top: 5px;
  color: #000000;
  text-align: center;
}
#top5{
  width: 290px;
  height: 150px;
  border: 1.5px solid black;
  border-radius: 5px;
  margin: 20px;
  color: black;
}
#total{
  width: 290px;
  height: 150px;
  border: 1.5px solid black;
  border-radius: 5px;
  margin: 20px;
}
#info{
  display: flex;
  align-items: center;
}
button{
  font-family: 'Istok Web',serif;
  font-weight: bold;
  margin: 5px;
  padding: 10px;
  position: relative;
  width: 160%;
  height: 35px;
  background: #0B5CD6;
  border-radius: 5px;
  border: none;
  color: #FFFFFF;
  font-size: 12px;
}
#formRebuts{
  width: 11%;
  height: 30%;
}
button:hover{
  background: #FFFFFF;
  color: #0B5CD6;
  border: 1.5px solid #0B5CD6;
}
table{
  border: 1px solid #D7D7D7;
  border-collapse: collapse;
  color: black;
  margin: 0 auto;
  background-color: #FFFFFF;
}
tr td{
  border: 1px solid #D7D7D7;
  margin: 0 auto;
  text-align: center;
  vertical-align: middle;
}
thead{
  margin: 20%;
  font-size: 20px;
  font-weight: bold;
}
thead p{
  margin-left: 20px;
  margin-right: 20px;
}

#grey{
  background-color: #F2F2F2;
}
.blue{
  background-color: #94B7ED;
}
</style>