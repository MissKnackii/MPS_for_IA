<script setup>
import {computed, defineEmits, defineProps, ref} from 'vue'
import router from "@/router/index.js";

const props = defineProps({
  consigne: Object,
  required: true,
})
let consigne = props.consigne
let consigneToEdit = ref({
  id: consigne.id,
  demande: consigne.demande,
  reponse: consigne.reponse,
  idDestinataire: consigne.idDestinataire,
  etat: consigne.etat,
})
const emit = defineEmits(['close'])

function emitClose() {
  emit('close')
}


const formatedDate = (date) => {
  let date1 = new Date(date)
  return `${date1.getDate()}-${date1.getMonth() + 1}-${date1.getFullYear()}`
}

let statusColor = computed(() =>{
  switch (consigneToEdit.value.etat) {
    case 'En cours':
      return 'background-color: #FFB020'
    case 'Soldée':
      return 'background-color: #66E0AF'
    default:
      return 'background-color: #FFB020'
  }
})

let updateConsigne = (action, item) => {
  if (action === "Solder") {
    fetch(`${import.meta.env.VITE_API_URL}/consignes/solderConsigne?id=${item.id}&demande=${encodeURIComponent(item.demande)}&reponse=${encodeURIComponent(item.reponse)}\``, {
      method: 'GET',
    })
        .then(res => res.json())
        .then(data => {
          if (data.body === 'ERROR') {
            alert("Une erreur s'est produite, veuillez retenter ultérieurement.")
          } else {
            alert("La consigne a bien été soldée.");
            emit('close');
            router.go(0)
          }
        })
        .catch(err => console.error(err));

  } else if (action === "EnCours") {
    fetch(`${import.meta.env.VITE_API_URL}/consignes/passerEnCoursConsigne?id=${item.id}&demande=${encodeURIComponent(item.demande)}&reponse=${encodeURIComponent(item.reponse)}`, {
      method: 'GET',
    })
        .then(res => res.json())
        .then(data => {
          if (data.body === 'ERROR') {
            alert("Une erreur s'est produite, veuillez retenter ultérieurement.")
          } else {
            alert("La consigne a bien été passée En cours.");
            emit('close');
            router.go(0)
          }
        })
        .catch(err => console.error(err));

  } else if (action === "Enregistrer") {
    fetch(`${import.meta.env.VITE_API_URL}/consignes/enregistrerConsigne?id=${item.id}&demande=${encodeURIComponent(item.demande)}&destinataire=${item.idDestinataire}&reponse=${encodeURIComponent(item.reponse)}`, {
      method: 'GET',
    })
        .then(res => res.json())
        .then(data => {
          if (data.body === 'ERROR') {
            alert("Une erreur s'est produite, veuillez retenter ultérieurement.")
          } else {
            alert("La consigne a bien été sauvegardée.");
            emit('close');
            router.go(0)
          }
        })
        .catch(err => console.error(err));


  } else if (action === "Supprimer") {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette consigne ?")){
      fetch(`${import.meta.env.VITE_API_URL}/consignes/supprimerConsigne?id=${item.id}`, {
        method: 'GET',
      })
          .then(res => res.json())
          .then(data => {
            if (data.body === 'ERROR') {
              alert("Une erreur s'est produite, veuillez retenter ultérieurement.")
            } else {
              alert("La consigne a bien été supprimée.");
              emit('close');
              router.go(0)
            }
          })
          .catch(err => console.error(err));
    }
  }
}
</script>

<template>
  <div class="overlay" @click.self="emitClose">
    <div class="modal">
      <header class="modal-header">
        <div id="banner">
          <h2>{{formatedDate(consigne.dateCreation)}} | {{consigne.sectionMachine}}</h2>
          <div id="status-circle" :style="statusColor"></div>
        </div>
        <div id="close" @click="emitClose"><img src="../../assets/x.svg"></div>
      </header>
      <hr>
      <main class="modal-body">
        <div class="chevron-container"># Machine {{ consigne.numMachine }} - {{consigne.origine}} - {{consigne.sectionMachine}}</div>
        <div><b>Référence : </b>{{ consigne.reference }}</div>
        <div><b>Origine : </b><span>{{ consigne.origine }}</span></div>
        <div>Demande de <b>{{ consigne.demandeur }}</b> à <b>{{ consigne.destinataire }}</b></div>
        <div class="chat-container" id="demande">
          <div class="container">
            <img src="../../assets/edit-3.svg" alt="">
            <label for="demande">Demande : </label>
          </div>
          <textarea  class="demande" cols="10" rows="4" name="demande"  v-model="consigneToEdit.demande"/>
        </div>
        <div class="chat-container" id="reponse">
          <div class="container">
            <img src="../../assets/message-square.svg" alt="">
            <b>Réponse : </b>
          </div>
          <textarea class="demande" cols="10" rows="4" name="demande"  v-model="consigneToEdit.reponse"/>
        </div>
      </main>
      <footer class="modal-footer">
        <button id="valider" @click="updateConsigne('Solder', consigneToEdit)">Solder</button>
        <button id="supprimer" @click="updateConsigne('Supprimer', consigneToEdit)">Supprimer</button>
        <button id="enCours" @click="updateConsigne('EnCours', consigneToEdit)">Passer En Cours</button>
        <button id="enregistrer" @click="updateConsigne('Enregistrer', consigneToEdit)">Enregistrer</button>
      </footer>
    </div>
  </div>
</template>

<style scoped>
hr {
  color: #333333;
  width: 90%;
}
#status-circle{
  width: 20px;
  height: 25px;
  border-radius: 500px;
  border: 1px solid #000000;
}
#banner{
  width: 80%;
  display: flex;
  flex-direction: row;
  align-content: center;
  align-items: center;
  margin: 10px;
  padding: 10px;
}
h2{
  margin-bottom: 0px;
}
#nonFait{
  color: red;
}
.overlay {
  position: fixed;
  top: 0; left: 0;
  width: 100vw; height: 100vh;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 50;
}

.modal {
  background: white;
  border-radius: 10px;
  width: fit-content;
  min-width: 40%;
  max-width: 90%;
  height: 90%;
  font-family: 'Istok Web',serif;
  color: #000000;
  text-align: left;
  padding: 0 15px;
}

.modal-header{
  position: relative;
  margin-left: 20px;
  margin-right: 20px;
  justify-content: center;
}

#banner h2{
  width: 100%;
  margin: 0;
  padding: 0;
}

#close {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
}
#close img{
  width: 30px;
}

#valider, #supprimer, #enCours, #enregistrer{
  border: 0.5px solid black;
  border-radius: 2px;
  padding: 5px;
  margin-left: 10px;
}
#valider{
  background-color: #66E0AF;
}
#supprimer{
  background-color: #FF7466;
}
#enCours{
  background-color: #FFB020;
}
#enregistrer{
  background-color: #87B6FD;
}
#valider:hover{
  background-color: #b6ffe2;
}
#supprimer:hover{
  background-color: #ffb8b2;
}
#enCours:hover{
  background-color: #fce0a8;
}
#enregistrer:hover{
  background-color: #c8deff;
}
.modal p{
  margin: 10px;
}
.modal input, .modal textarea, .modal select {
  width: 100%;
  border: 0.5px solid black;
  border-radius: 3px
}
.modal input, .modal select {
  height: 25px;
}

.container{
  display: flex;
  flex-direction: row;
  align-items: center;
  align-content: center;
  gap: 10px;
}

.chat-container{
  border: 1px solid #000000;
  border-radius: 6px;
  margin: 5px;
  padding: 10px;
  background-color: #F8F8F8;

}.chat-container p{
   margin: 0;
   padding:0;
 }

#demande{
  border-radius: 20px 20px 0 20px;
}
#reponse{
  border-radius: 20px 20px 20px 0;
}
</style>