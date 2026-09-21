<script setup>

import {computed, ref} from "vue";
import router from "@/router/index.js";

let secteurs = ref([])
let sections = ref([])
let machines = ref([])
let references = ref([])
let noms = ref([])
let newConsigne = ref({
  secteur: '',
  section: '',
  machine: '',
  reference: '',
  origine: '',
  typeAction: '',
  nom: '',
  demande: '',
  destinataire: '',
  reponse: '',
  etat: '',
})
fetch(`${import.meta.env.VITE_API_URL}/consignes/getdata`, {
  method: 'GET',
})
    .then(res => res.json())
    .then(data => {})
    .catch(err => console.error(err));
let getSecteurs = () => {
  fetch(`${import.meta.env.VITE_API_URL}/consignes/getSecteurs`, {
    method: 'GET',
  })
      .then(res => res.json())
      .then(data => {
        secteurs.value = data
      })
      .catch(err => console.error(err));

}
let getSections = (secteur) => {
  fetch(`${import.meta.env.VITE_API_URL}/consignes/getSections?secteur=${secteur}`, {
    method: 'GET',
  })
      .then(res => res.json())
      .then(data => {
        sections.value = data
      })
      .catch(err => console.error(err));
}
let getMachines = (secteur, section) => {
  fetch(`${import.meta.env.VITE_API_URL}/consignes/getMachines?secteur=${secteur}&section=${section}`, {
    method: 'GET',
  })
      .then(res => res.json())
      .then(data => {
        machines.value = data
      })
      .catch(err => console.error(err));
}
let getReferencesFromMachines = (machine, secteur, section) => {
  fetch(`${import.meta.env.VITE_API_URL}/consignes/getReference?machine=${machine}&secteur=${secteur}&section=${section}`, {
    method: 'GET',
  })
      .then(res => res.json())
      .then(data => {
        references.value = data
      })
      .catch(err => console.error(err));
}
let getEffectifs = (secteur) => {
  fetch(`${import.meta.env.VITE_API_URL}/consignes/getEffectifs?secteur=${secteur}`, {
    method: 'GET',
  })
      .then(res => res.json())
      .then(data => {
        noms.value = data
      })
      .catch(err => console.error(err));
}

let sendData = () => {
    if (newConsigne.value.secteur === '' || newConsigne.value.section === '' || newConsigne.value.machine === '' || newConsigne.value.reference === '' || newConsigne.value.origine === '' || newConsigne.value.typeAction === '' || newConsigne.value.nom === '' || newConsigne.value.destinataire === '' || newConsigne.value.etat === '') {
      alert("Vous devez remplir tous les champs marqués d'une '*'");
    } else if (newConsigne.value.demande === '' & newConsigne.value.reponse === '') {
      alert("Vous devez remplir le détail OU la réponse de la consigne");
    } else {
      fetch(`${import.meta.env.VITE_API_URL}/consignes/sendData?secteur=${newConsigne.value.secteur}&section=${newConsigne.value.section}&machine=${newConsigne.value.machine}&reference=${newConsigne.value.reference}&origine=${newConsigne.value.origine}&action=${newConsigne.value.typeAction}&nom=${newConsigne.value.nom}&detail=${encodeURIComponent(newConsigne.value.demande)}&destinataire=${newConsigne.value.destinataire}&reponse=${encodeURIComponent(newConsigne.value.reponse)}&etat=${newConsigne.value.etat}`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(newConsigne.value)
      })
          .then(res => res.json())
          .then(data => {
            if (data === "OK") {
              alert("La consigne a bien été ajouté !");
              document.location.href = "/consignes";
            } else {
              alert("Une erreur s'est produite, veuiller recommencer ultérieurement.")
            }
          })
          .catch(err => console.error(err));
    }
}

let statusColor = computed(() =>{
  switch (newConsigne.value.etat) {
    case 'En cours':
      return 'background-color: #FFB020'
    case 'Soldée':
      return 'background-color: #66E0AF'
    default:
      return 'background-color: #FFB020'
  }
})
getSecteurs()
</script>
<template>
<h2>Ajouter une nouvelle consigne</h2>
  <main>
    <form action="">
      <div class="form_line">
        <div class="form-group">
          <label for="secteur">Secteur * : </label>
          <br>
          <select @change="() => {getSections(newConsigne.secteur.id); getEffectifs(newConsigne.secteur.id)}" v-model="newConsigne.secteur" id="secteur" name="secteur">
            <option selected value="">--Choisissez un secteur--</option>
            <option :value="se" v-for="se in secteurs">{{ se.libelle }}</option>
          </select>
        </div>
        <div class="form-group">
          <label for="section">Section * : </label>
          <br>
          <select @change="getMachines(newConsigne.secteur.id, newConsigne.section)" v-model="newConsigne.section" id="section" name="section">
            <option selected value="">--Choisissez une section--</option>
            <option :value="s.section" v-for="s in sections">{{ s.section }}</option>
          </select>
        </div>
      </div>
      <div class="form_line">
        <div class="form-group">
          <label for="machine">Machine * : </label>
          <br>
          <select @change="getReferencesFromMachines(newConsigne.machine, newConsigne.secteur.id, newConsigne.section)" v-model="newConsigne.machine" id="machine" name="machine">
            <option selected value="">--Choisissez une machine--</option>
            <option :value="m.numMachine" v-for="m in machines">{{ m.numMachine }}</option>
          </select>
        </div>
        <div class="form-group">
          <label for="reference">Référence * : </label>
          <br>
          <select @change="" v-model="newConsigne.reference" id="reference" name="reference">
            <option selected value="">--Choisissez une référence--</option>
            <option :value="r" v-for="r in references">{{ r.reference }}</option>
          </select>
        </div>
      </div>
      <div class="form_line">
        <div class="form-group">
          <label for="origine">Origine * : </label>
          <br>
          <select @change="" v-model="newConsigne.origine" id="origine" name="origine">
            <option selected value="">--Choisissez une origine--</option>
            <option value="Opérateur">Opérateur</option>
            <option value="Méthode">Méthode</option>
            <option value="Analyse Production">Analyse Production</option>
            <option value="Maintenance">Maintenance</option>
          </select>
        </div>
        <div class="form-group">
          <label for="typeAction">Type d'action * : </label>
          <br>
          <select @change="" v-model="newConsigne.typeAction" id="typeAction" name="origine">
            <option selected value="">--Choisissez une action--</option>
            <option value="Montage">Montage</option>
            <option value="Dépanage">Dépannage</option>
            <option value="Réglage">Réglage</option>
            <option value="Instruction">Instruction</option>
          </select>
        </div>
      </div>
      <div class="form_line">
        <div class="form-group">
          <label for="nom">Demandeur * : </label>
          <br>
          <select @change="" v-model="newConsigne.nom" id="nom" name="nom">
            <option selected value="">--Choisissez un nom--</option>
            <option :value="n" v-for="n in noms">{{ n.nom }}</option>
          </select>
        </div>
        <div class="form-group">
          <label for="destinataire">Destinataire * : </label>
          <br>
          <select @change="" v-model="newConsigne.destinataire" id="destinataire" name="destinataire">
            <option selected value="">--Choisissez un nom--</option>
            <option :value="n" v-for="n in noms">{{ n.nom }}</option>
          </select>
        </div>
      </div>
      <div class="form_line">
        <div class="form-group">
          <label for="demande">Détail de la demande : </label>
          <br>
          <textarea cols="30" rows="3" name="demande"  v-model="newConsigne.demande"/>
        </div>

        <div class="form-group">
          <label for="reponse">Réponse : </label>
          <br>
          <textarea cols="30" rows="3" name="reponse"  v-model="newConsigne.reponse"/>
        </div>
      </div>
      <div class="form-group">
        <label for="etat">Etat * : </label>
        <br>
        <select @change="" v-model="newConsigne.etat" id="etat" name="etat">
          <option selected value="">--Choisissez une action--</option>
          <option value="En cours">En cours</option>
          <option value="Soldée">Soldée</option>
        </select>
      </div>
    </form>
    <div id="consigne">
      <h3>Aperçu de ma consigne</h3>
      <div id="content">
        <div id="head">
          <div id="status">
            <div id="status-circle" :style="statusColor"></div>
<!--        <p><b>{{ newConsigne.etat}}</b></p>-->
            <div class="chevron-container"># Machine {{ newConsigne.machine }} - {{newConsigne.secteur.libelle}} - {{newConsigne.section}}</div>
          </div>
        </div>
        <div><b>Référence : </b>{{ newConsigne.reference.reference }}</div>
        <div><b>Origine : </b><span>{{ newConsigne.origine }}</span></div>
        <div><b>Type d'action : </b><span>{{ newConsigne.typeAction }}</span></div>
        <div id="profils">
          <div class="profil">
            <img src="../../assets/user-white.svg" alt="">
            <p><b>{{ newConsigne.nom.nom }}</b></p>
          </div>
          <img id="arrow" src="../../assets/arrow-right.svg">
          <div class="profil">
            <img src="../../assets/user-white.svg" alt="">
            <p><b>{{ newConsigne.destinataire.nom }}</b></p>
          </div>
        </div>
        <div class="chat-container" id="demande">
          <div class="container">
            <img src="../../assets/edit-3.svg" alt="">
            <b>Demande : </b>
          </div>
          <p>{{newConsigne.demande}}</p>
        </div>
        <div class="chat-container" id="reponse">
          <div class="container">
            <img src="../../assets/message-square.svg" alt="">
            <b>Réponse : </b>
          </div>
          <p>{{newConsigne.reponse}}</p>
        </div>
      </div>
    <button id="valider" @click.prevent="sendData">Valider ma consigne</button>
    </div>

  </main>
</template>

<style scoped>
#status-circle{
  width: 20px;
  height: 20px;
  border-radius: 500px;
  border: 1px solid #000000;
}
#status{
  display: flex;
  flex-direction: row;
  align-items: center;
  align-content: center;
  gap: 5px;
}
#status p{
  padding: 0;
  margin: 0;
}
main{
  display: flex;
  flex-direction: row;
  width: 100%;
  gap: 20px;
}
#consigne{
  width: 40%;
  padding: 5px;
  color: black;
  display: flex;
  flex-direction: column;

}
#content{
  border: black solid 1px;
  border-radius: 6px;
  padding: 5px;
  background-color: white;
  color: black;
}
label{
  color: black;
  font-weight: bold;
}
input, textarea, select {
  width: 100%;
  border: 0.5px solid black;
  border-radius: 3px
}
input, select {
  height: 30px;
}
form{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 60%;
  gap: 10px;
}
.form_line{
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  align-content: center;
  width: 100%;
  gap: 30px;
}
.form-group{
  width: 100%;
}
.chat-container{
  border: 1px solid #000000;
  margin: 5px;
  padding: 10px;
  background-color: #F8F8F8;

}
#demande{
  border-radius: 15px 15px 0 15px;
}
#reponse{
  border-radius: 15px 15px 15px 0;
}
.chat-container p{
  width: 100%;
 margin: 0;
 padding:0;
  text-wrap:wrap;
  hyphens: auto;
}
.chat-container img{
   width: 20px;
  height: auto;
}
.container{
  display: flex;
  flex-direction: row;
  align-items: center;
  align-content: center;
  gap: 10px;
}
.profil{
  display: flex;
  flex-direction: row;
  align-items: center;
  align-content: center;
  gap: 10px;
  /*border: black solid 1px;*/
  border-radius: 6px;
  padding: 5px;
  background-color: #0B5CD6;
  color: #FFFFFF;
}
.profil img{
  width:25px;
  height: auto;
}
.profil p{
  margin: 0;
  padding:0;
}
#arrow{
  width:20px;
  height: auto;
}
#profils{
  display: flex;
  flex-direction: row;
  align-items: center;
  align-content: center;
  gap: 10px;
}
#valider{
  margin-top: 10px;
  padding: 10px 15px;
  border-radius: 5px;
  border: 1px solid #0B5CD6;
  background-color: #0B5CD6;
  color: white;
  font-weight: bold;
}
#valider:hover{
  background-color: white;
  color: #0B5CD6;
  font-weight: bold;
}
</style>