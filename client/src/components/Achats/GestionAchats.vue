<template>
  <router-link to="/achats"><button id="back">Retour</button></router-link>
  <h1>Gestion demandes d'achats</h1>
  <div id="filtres-cont">
    <form>
      <div id="filtres">
        <div>
          <label for="tri" class="form-label">Ordre de tri de demandes par date :</label>
          <br>
          <select v-model="triDate" id="" class="form-input-text" name="triDate" required>
            <option value="chronologique">Chronologique</option>
            <option value="antechronologique">Antéchronologique</option>
          </select>
        </div>
        <div>
          <label for="salarié" class="form-label">Salarié :</label>
          <br>
          <select v-model="salarie" id="" class="form-input-text" name="salarie" required>
            <option v-for="sa in this.salaries" :value="sa">{{sa}}</option>
          </select>
        </div>
        <div>
          <label for="service" class="form-label">Service :</label>
          <br>
          <select v-model="service" id="" class="form-input-text" name="service" required>
            <option v-for="se in this.services" :value="se">{{se}}</option>
          </select>
        </div>
        <div id="categorie">
          <label for="categorie" class="form-label">Catégorie :</label>
          <br>
          <select v-model="categorie" id="" class="form-input-text" name="categorie" required>
            <option v-for="c in this.categories" :value="c">{{c}}</option>
          </select>
        </div>
        <div>
          <label for="fournisseur" class="form-label">Fournisseur :</label>
          <br>
          <select v-model="fournisseur" id="" class="form-input-text" name="fournisseur" required>
            <option v-for="f in this.fournisseurs" :value="f">{{f}}</option>
          </select>
        </div>
        <div>
          <label for="fournisseur" class="form-label">N° commande :</label>
          <br>
          <input v-model="commande" class="form-input-text"  type="text">
        </div>
        <div>
          <label for="urgent" class="form-label">Urgent : </label>
          <br>
          <input v-model="urgent"  class="form-input-text" type="checkbox">
        </div>
        <div>
          <label for="etat" class="form-label">Etat demande  :</label>
          <br>
          <select v-model="etat" id="" class="form-input-text" name="etat" required>
            <option v-for="e in this.etats" :value="e">{{e}}</option>
          </select>
        </div>
      </div>
    </form>


    <div id="validate">
      <button class="val-input" @click="this.showAllData()">Toutes les demandes </button>
      <button class="val-input" @click="this.filtrer()">Filtrer</button>
      <button class="val-input" @click="this.resetFilters()">Effacer les filtres</button>
    </div>
  </div>
  <div id="content">
    <table>
      <thead>
      <tr id="head">
        <td id="statut"><p>Statut</p></td>
        <td></td>
        <td>Date Validation</td>
        <td><p>Références produit </p></td>
        <td></td>
        <td><p>Salarié</p></td>
        <td><p>Commentaire</p> </td>
        <td><p>Numéro de commande</p> </td>
        <td></td>
      </tr>
      </thead>
      <tbody>
      <tr :class="{ selected: selectedRow === index }" id="statut" v-for="(demande, index) in this.contents" :key="index">
        <td :class="getCellClass(demande.etatDemande)"  @click="() =>{getDetailsDemande(demande); this.showPopUp = true;}">
          <img id="circle-arrow" v-if="demande.etatDemande === 'En attente de traitement'" src="../../assets/arrow-right-circle.svg" alt="">
          <img id="circle-arrow" v-if="demande.etatDemande === 'En cours de traitement'" src="../../assets/refresh-cw.svg" alt="">
          <img id="circle-arrow" v-if="demande.etatDemande === 'Refusée'" src="../../assets/slash.svg" alt="">
          <img id="circle-arrow" v-if="demande.etatDemande === 'Validée'" src="../../assets/check.svg" alt="">
          <img id="circle-arrow" v-if="demande.etatDemande === 'Réceptionnée'" src="../../assets/package.svg" alt="">
        </td>
        <td :class="getCellClassPrix(demande.natureDemande)"><img id="urgent" v-if="demande.urgent === 'oui'" src="../../assets/Exclamation--Streamline-Bootstrap.png" alt=""></td>
        <td :class="getCellClassPrix(demande.natureDemande)">{{ demande.dateValidation }}</td>
        <td id="refe" :class="getCellClassPrix(demande.natureDemande)" @click="() =>{getDetailsDemande(demande); this.showPopUp = true;}">
          <ul>
            <li>{{demande.referenceProduit1 }}</li>
            <li v-if="demande.referenceProduit2 !== '-' && demande.referenceProduit2 !== ''">{{demande.referenceProduit2}}</li>
            <li v-if="demande.referenceProduit3 !== '-' && demande.referenceProduit3 !== ''">{{demande.referenceProduit3}}</li>
            <li v-if="demande.referenceProduit4 !== '-' && demande.referenceProduit4 !== ''">{{demande.referenceProduit4}}</li>
            <li v-if="demande.referenceProduit5 !== '-' && demande.referenceProduit5 !== ''">{{demande.referenceProduit5}}</li>
          </ul>
        </td>
        <td @click="() =>{getDetailsDemande(demande); this.showPopUp = true;}" :class="getCellClassPrix(demande.natureDemande)">
          <p><img id="arrow" src="../../assets/arrow-right.png" alt="">{{demande.qteProduit1}}{{demande.uniteProduit1}}</p>
          <p v-if="demande.qteProduit2"><img id="arrow" src="../../assets/arrow-right.png" alt="">{{demande.qteProduit2}}{{demande.uniteProduit2}}</p>
          <p v-if="demande.qteProduit3"><img id="arrow" src="../../assets/arrow-right.png" alt="">{{demande.qteProduit3}}{{demande.uniteProduit3}}</p>
          <p v-if="demande.qteProduit4"><img id="arrow" src="../../assets/arrow-right.png" alt="">{{demande.qteProduit4}}{{demande.uniteProduit4}}</p>
          <p v-if="demande.qteProduit5"><img id="arrow" src="../../assets/arrow-right.png" alt="">{{demande.qteProduit5}}{{demande.uniteProduit5}}</p>
        </td>
        <td :class="getCellClassPrix(demande.natureDemande)" @click="() =>{getDetailsDemande(demande); this.showPopUp = true;}">{{ demande.nomSalarie }}</td>
        <td :class="getCellClassPrix(demande.natureDemande)" ><input v-model="demande.commentaires" class="form-input-text" >{{  }}</td>
        <td :class="getCellClassPrix(demande.natureDemande)" ><input v-model="demande.numCommande" class="form-input-text" >{{ }}</td>
        <td :class="getCellClassPrix(demande.natureDemande)" id="buttons-val">
          <button id="button-save" @click="this.changeStatus(demande, 'En cours de traitement')"><img id="circle-arrow"  src="../../assets/save-black.svg" alt=""></button>
          <button id="button-check" @click="this.changeStatus(demande, 'Validée')"><img id="circle-arrow"  src="../../assets/check-black.svg" alt="" ></button>
          <button id="button-slash" @click="this.changeStatus(demande, 'Refusée')"><img id="circle-arrow"  src="../../assets/slash-black.svg" alt=""></button>
          <button id="button-pack" @click="this.changeStatus(demande, 'Réceptionnée')"><img id="circle-arrow"  src="../../assets/package-black.svg" alt=""></button>
        </td>
      </tr>
      </tbody>
    </table>
    <div v-if="this.showPopUp" id="overlay" @click="this.showPopUp = false"></div>

    <div v-if="showPopUp" id="popup">
      <h1>Demande n°{{this.selectedDemande.numDemande}}</h1>
      <img @click="this.showPopUp = false" id="cross" src="../../assets/x.png" alt="">
      <div id="line"></div>
      <div id="popup-content">
        <div id="service">
          <p><b>Service : </b>{{ this.selectedDemande.service}}</p>
          <p id="date"><b>Date de demande : </b>{{ this.selectedDemande.dateDemande}}</p>
        </div>
        <p><b>Salarié demandeur : </b>{{ this.selectedDemande.nomSalarie}}</p>
        <p><b>Catégorie produit : </b>{{ this.selectedDemande.codeCategorie}}</p>
        <p><b>Références demandées :</b></p>
        <ul>
          <div><li> {{this.selectedDemande.referenceProduit1}} <img id="arrow-popup" src="../../assets/arrow-right.png" alt="">{{this.selectedDemande.qteProduit1}} {{this.selectedDemande.uniteProduit1}}</li></div>
          <div v-if="this.selectedDemande.referenceProduit2 !== '-' && this.selectedDemande.referenceProduit2 !== ''"><li> {{this.selectedDemande.referenceProduit2}} <img id="arrow-popup" src="../../assets/arrow-right.png" alt="">{{this.selectedDemande.qteProduit2}} {{this.selectedDemande.uniteProduit2}}</li></div>
          <div v-if="this.selectedDemande.referenceProduit3 !== '-' && this.selectedDemande.referenceProduit3 !== ''"><li> {{this.selectedDemande.referenceProduit3}} <img id="arrow-popup" src="../../assets/arrow-right.png" alt="">{{this.selectedDemande.qteProduit3}} {{this.selectedDemande.uniteProduit3}}</li></div>
          <div v-if="this.selectedDemande.referenceProduit4 !== '-' && this.selectedDemande.referenceProduit4 !== ''"><li> {{this.selectedDemande.referenceProduit4}} <img id="arrow-popup" src="../../assets/arrow-right.png" alt="">{{this.selectedDemande.qteProduit4}} {{this.selectedDemande.uniteProduit4}}</li></div>
          <div v-if="this.selectedDemande.referenceProduit5 !== '-' && this.selectedDemande.referenceProduit5 !== ''"><li> {{this.selectedDemande.referenceProduit5}} <img id="arrow-popup" src="../../assets/arrow-right.png" alt="">{{this.selectedDemande.qteProduit5}} {{this.selectedDemande.uniteProduit5}}</li></div>
        </ul>
        <p><b>Informations complémentaires : </b>{{ this.selectedDemande.infosComplementaires}}</p>
        <p><b>Référence pièce : </b>{{ this.selectedDemande.referencePiece}}</p>
        <p><b>Justificatif demande : </b>{{ this.selectedDemande.justificatifDemande}}</p>
        <p><b>Délai demandé : </b>{{ this.selectedDemande.delaiDemande}}</p>
        <p><b>Urgent : </b><input type="checkbox" v-model="this.selectedDemande.urgent"></p>
        <p><b>Fournisseur : </b> <input type="text" v-model="this.selectedDemande.nomFournisseur"></p>
        <p><b>Délai attribué : </b> <input type="date" v-model="this.selectedDemande.delaiAttribue">{{ this.selectedDemande.delaiAttribue}}</p>
        <p><b>Etat : </b>{{ this.selectedDemande.etatDemande}}</p>
        <p><b>N° commande  : </b> <input type="text" v-model="this.selectedDemande.numCommande"></p>
        <p><b>Commentaire  : </b> <input type="text" v-model="this.selectedDemande.commentaires"></p>
        <p><b>Lieu d’enlèvement  : </b>{{ this.selectedDemande.lieuEnlevement}}</p>
        <button id="button-save"  @click="this.changeStatus(this.selectedDemande, 'En cours de traitement')"><img id="circle-arrow"  src="../../assets/save-black.svg" alt="">Enregistrer</button>
        <button id="button-check" @click="this.changeStatus(this.selectedDemande, 'Validée')"><img id="circle-arrow"  src="../../assets/check-black.svg" alt="">Valider </button>
        <button id="button-slash" @click="this.changeStatus(this.selectedDemande, 'Refusée')"><img id="circle-arrow"  src="../../assets/slash-black.svg" alt="">Refuser</button>
        <button id="button-pack" @click="this.changeStatus(this.selectedDemande, 'Réceptionnée')"><img id="circle-arrow"  src="../../assets/package-black.svg" alt="">Reception</button>
      </div>
    </div>

  </div>
</template>
<script>
import { ref } from 'vue'
import {useAuthStore} from "@/store/index.js";
import axios from "axios";

export default {
  data() {
    return {
      allData:'',
      allDataEnCours: [],
      salaries: [],
      categories: [],
      fournisseurs: [],
      etats: ["En attente de traitement", "En cours de traitement", "Refusée", "Validée", "Réceptionnée"],
      services: [],
      selectedDemande: '',
      showPopUp: false,
      selectedRow: ref(null),
      triDate: 'null',
      salarie: 'null',
      service: 'null',
      categorie: 'null',
      fournisseur: 'null',
      commande: 'null',
      etat: 'null',
      urgent: 0,
      filtres : {
        ordreDateDemande: "",
        salarie: "",
        service: "",
        codeCategories: "",
        nomFournisseur: "",
        numCommande: "",
        urgent: 0,
        etat: "",
      },
      filterResult:[],
      contents: '',
      selectedCommentaire:'',
      selectedNumCommande:'',
      store: useAuthStore(this.$pinia),
    }
  },
  methods: {
    checkAuth(){
      this.store.setDisplay('Achats')
      this.store.checkTokenExpiration()
      //this.store.token = ""
      axios.post(`${import.meta.env.VITE_API_URL}/auth/check-access/achats`, { token: this.store.token, groups: this.store.groups})
          .then(response => {
            console.log(response)
            this.$router.push('/gestion-achats');
            this.store.display = 'Achats'
          })
          .catch(error => {
            console.error(error);
            if (error.status === 401) {
              this.$router.push('/login');
              this.error = true;
            }
            if (error.status === 403) {
              window.alert("Vous n'avez pas les autorisations nessessaires pour acceder a cette page. ");
              this.$router.push('/achats');
              this.error = true;
            }
          })
    },
    async getDemandes() {
      await fetch(`${import.meta.env.VITE_API_URL}/achats/allDemandes`, {
        method: 'GET',
      })
          .then(res => res.json())
          .then(data => {
            console.log(data)
            data.forEach((demande) => {
              if (this.salaries.includes(demande.nomSalarie) === false) {
                this.salaries.push(demande.nomSalarie)
              }
              if (this.services.includes(demande.service) === false) {
                this.services.push(demande.service)
              }
              if (this.categories.includes(demande.codeCategorie) === false) {
                this.categories.push(demande.codeCategorie)
              }
              if (this.fournisseurs.includes(demande.nomFournisseur) === false) {
                this.fournisseurs.push(demande.nomFournisseur)
              }
              if (demande.dateValidation !== null){
                let formatVal = demande.dateValidation.split('T')
                demande.dateValidation = formatVal[0]
              }
              if (demande.delaiDemande !== null){
                let formatVal = demande.delaiDemande.split('T')
                demande.delaiDemande = formatVal[0]
              }
              if (demande.referencePiece === 'null' || demande.referencePiece === null){
                demande.referencePiece = ''
              }
              let formatDate = demande.dateDemande.split('T')
              let formatheure = formatDate[1].split('Z')
              demande.dateDemande = formatDate[0] + '-' + formatheure[0]
              if (demande.urgent === true){
                demande.urgent = 'oui'
              }else {
                demande.urgent = 'non'
              }
            })
            this.allData = data

          })
          .catch(err => console.error(err));
    },
    async getAllDataEnCours() {
      await fetch(`${import.meta.env.VITE_API_URL}/achats/allDemandesEnCours`, {
        method: 'GET',
      })
          .then(res => res.json())
          .then(data => {
            console.log(data)
            this.allDataEnCours = data
            data.forEach((demande) => {
              if (demande.dateValidation !== null){
                let formatVal = demande.dateValidation.split('T')
                demande.dateValidation = formatVal[0]
              }
              if (demande.delaiDemande !== null){
                let formatVal = demande.delaiDemande.split('T')
                demande.delaiDemande = formatVal[0]
              }
              if (demande.referencePiece === 'null' || demande.referencePiece === null){
                demande.referencePiece = ''
              }
              let formatDate = demande.dateDemande.split('T')
              let formatheure = formatDate[1].split('Z')
              demande.dateDemande = formatDate[0] + '-' + formatheure[0]
              if (demande.urgent === true){
                demande.urgent = 'oui'
              }else {
                demande.urgent = 'non'
              }
            })
            this.contents = data
            /*data.forEach((demande) => {
              if (this.salaries.includes(demande.nomSalarie) === false) {
                this.salaries.push(demande.nomSalarie)
              }
              if (this.services.includes(demande.service) === false) {
                this.services.push(demande.service)
              }
              if (this.categories.includes(demande.codeCategorie) === false) {
                this.categories.push(demande.codeCategorie)
              }
              if (this.fournisseurs.includes(demande.nomFournisseur) === false) {
                this.fournisseurs.push(demande.nomFournisseur)
              }

            })*/
          })
          .catch(err => console.error(err));
    },
    async filtrer () {
      this.filtres.ordreDateDemande = this.triDate
      this.filtres.salarie = this.salarie
      this.filtres.service = this.service
      this.filtres.codeCategories = this.categorie
      this.filtres.nomFournisseur = this.fournisseur
      this.filtres.etat = this.etat
      if (this.urgent === true){
        this.filtres.urgent = 1
      }else{
        this.filtres.urgent = 0
      }
      let filtres = this.filtres
      console.log(filtres)
      await fetch(`${import.meta.env.VITE_API_URL}/achats/filtrer`, {
        method: 'POST',
        body: JSON.stringify(this.filtres),
        headers: {
          'Content-Type': 'application/json'
        },

      })
          .then(res => res.json())
          .then(data => {
            console.log(data)
            data.forEach((demande) => {
              if (demande.dateValidation !== null){
                let formatVal = demande.dateValidation.split('T')
                demande.dateValidation = formatVal[0]
              }
              if (demande.delaiDemande !== null){
                let formatVal = demande.delaiDemande.split('T')
                demande.delaiDemande = formatVal[0]
              }
              if (demande.referencePiece === 'null' || demande.referencePiece === null){
                demande.referencePiece = ''
              }
              let formatDate = demande.dateDemande.split('T')
              let formatheure = formatDate[1].split('Z')
              demande.dateDemande = formatDate[0] + '-' + formatheure[0]
              if (demande.urgent === true){
                demande.urgent = 'oui'
              }else {
                demande.urgent = 'non'
              }
            })
            this.filterResult = data
            this.contents = data
          })
          .catch(err => console.error(err));
    },
    showAllData(){
      this.contents = this.allData
    },
    resetFilters(){
      this.triDate = 'null'
      this.salarie = 'null'
      this.service = 'null'
      this.categorie = 'null'
      this.fournisseur = 'null'
      this.commande = 'null'
      this.etat = 'null'
      this.urgent = 0
      this.filtres.ordreDateDemande = ''
      this.filtres.salarie = ''
      this.filtres.service = ''
      this.filtres.codeCategories = ''
      this.filtres.nomFournisseur = ''
      this.filtres.etat = ''
      this.filtres.urgent = 0
      this.contents = this.allDataEnCours

    },
    getCellClass(value) {
      if (value === 'En attente de traitement') return 'blue-cell'
      if (value === 'En cours de traitement') return 'orange-cell'
      if (value === 'Validée') return 'green-cell'
      if (value === 'Refusée') return 'red-cell'
      if (value === 'Réceptionnée') return 'yellow-cell'
      return ''
    },
    getCellClassPrix(value) {
      if (value === 'Demande de prix') return 'grey-cell'
      return ''
    },
    getDetailsDemande(result) {
      this.selectedDemande = result;
      this.selectedCommentaire = result.commentaire;
      this.selectedNumCommande = result.numCommande;
      console.log(this.selectedDemande)
      /*this.editedFile = this.fileToEdit;*/
    },
    async changeStatus(demande, etat){
      if (demande.numCommande !== '-' || demande.numCommande !== '' && etat !== "Validée") {
        demande.etatDemande = etat
        console.log(demande)
        await fetch(`${import.meta.env.VITE_API_URL}/achats/enregistrer`, {
          method: 'POST',
          body: JSON.stringify(demande),
          headers: {
            'Content-Type': 'application/json'
          },

        })
            .then(res => res.json())
            .then(data => {
              console.log(data)
            })
            .catch(err => console.error(err));
      }else{
        window.alert('Veuillez renseigner un numéro de commande pour valider la demande.')
      }
    },
  },
  created() {
    this.checkAuth()
    this.getAllDataEnCours()
    this.getDemandes()
  },
}
</script>
<style>
#back{
  background-color: white;
  border: 1.5px solid #0B5CD6;
  border-radius: 5px;
  color: #0B5CD6;
  padding: 5px;
}
.val-input{
  box-sizing: border-box;
  position: relative;
  width: 90%;
  height: 30px;
  background: #FFFFFF;
  border: 1.5px solid #000000;
  border-radius: 6px;
}
.val-input:hover{
  background: #d7d7d7;
  color: #000000;
  border: 1.5px solid #000000;
}
#buttons-val{
display: flex;
  margin: 0 auto;
}
#button-save{
  background-color: #FFB020;
  margin-right: 5px;
  border-radius: 3px;
  margin-top: 5px;
  border: 1.5px solid black ;
}
#button-save:hover{
  background-color: #fed283;
}
#button-check{
  background-color: #7EFF2E;
  margin-right: 5px;
  border-radius: 3px;
  margin-top: 5px;
  border: 1.5px solid black ;
}
#button-check:hover{
  background-color: #b2ff83;
}
#button-slash{
  background-color: #FF3C3C;
  margin-right: 5px;
  border-radius: 3px;
  margin-top: 5px;
  border: 1.5px solid black ;
}
#button-slash:hover{
  background-color: #ff8383;
}
#button-pack{
  background-color: #FFEB3B;
  margin-right: 5px;
  border-radius: 3px;
  margin-top: 5px;
  border: 1.5px solid black ;
}
#button-pack:hover{
  background-color: #fff6ae;
}
h1{
  margin: 0;
  position: relative;
  font-family: 'Istok Web',serif;
  font-style: normal;
  font-weight: 700;
  font-size: 27px;
  line-height: 60px;
  color: #000000;
}
#filtres-cont{
  display: flex;
  flex-direction: column;
}
#filtres{
  display: flex;

}
#categorie{
  width: 15%;
}
#validate{
  display: flex;
  width: 50%;
  margin-bottom: 20px;
  margin-top: 10px;
}
.form-label{
  font-family: 'Istok Web',serif;
  font-style: normal;
  color: #000000;
  font-size: 12px;
}

.form-input-text{
  box-sizing: border-box;
  position: relative;
  width: 90%;
  height: 30px;
  background: #FFFFFF;
  border: 1.5px solid #000000;
  border-radius: 6px;

}
.form-input-val{
  box-sizing: border-box;
  position: relative;
  width: 30%;
  height: 30px;
  background: #FFFFFF;
  border: 1.5px solid #000000;
  border-radius: 6px;
  font-weight: bold;
  margin-right: 10px;

}
#overlay{
  width: 100%;
  height: 100%;
  position: fixed;
  background-color: rgba(0, 0, 0, 0.55);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
table{
  border: 1px solid #ddd;
  border-collapse: collapse;
  color: black;
  margin: 0 auto;
  background-color: #FFFFFF;
}
tr td{
  /*
  border: 1px solid #ddd;
  */
  margin: 0 auto;
  text-align: center;
  vertical-align: middle;
}
tbody tr:hover {
  background-color: #c9c9c9;
}
tbody tr.selected {
  background-color: #d0e7ff;
  transition: background-color 0.3s;
  cursor: pointer;
}


#arrow{
  width:12px;
}
#arrow-popup{
  width:13px;
}
#circle-arrow{
  justify-content: center;
  text-align: center;
  width:20px;
}
.blue-cell {
  background-color: #0B5CD6;
}

.orange-cell {
  background-color: #FFB020;
}
.green-cell {
  background-color: #7EFF2E;
}
.red-cell {
  background-color: #FF3C3C;
}
.yellow-cell {
  background-color: #FFEB3B;
}
.grey-cell {
  background-color: #D9D9D9;
}
#statut{
  border: 1px solid #ddd;
}
#urgent{
  width: 30px;
}
#refe{
  width: 40%;
  text-align: left;

}
#refe p{
  text-align: center;
  vertical-align: middle;

}
#refe li{
  margin-top: 10px;
  margin-bottom: 10px;
}
#refe ul{
  margin: 0;
}
thead{
  margin: 20%;
  font-size: 20px;
  font-weight: bold;
}

tbody{
  font-size: 12px;
  margin: 0 auto;

}
#popup{
  justify-content: center;
  position: fixed;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 5px;
  width: 50%;
  height: fit-content;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: black;
  font-size: 12px;
  margin: 0;
  scroll-behavior: unset;
}
#popup p{
  margin: 4px;

}
#popup h1{
  padding-left: 10px;
}
#cross{
  position: absolute;
  right: 20px;
  top: 5px;
}
#line{
  position: relative;
  width: 95%;
  height: 0;
  left: 12px;
  top: 10%;
  margin-bottom: 40px;
  border: 1px solid #D7D7D7;
}
#popup-content{
  padding: 10px;
  position: relative;
}
#date{
  text-align: right;
  padding-left: 30%;
}
#service{
  margin-top: 20px;
  position: relative;
  display: flex;
  align-content: space-evenly;
}


</style>