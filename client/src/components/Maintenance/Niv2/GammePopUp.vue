<script setup>
import {computed, defineEmits, defineProps, onMounted, ref} from 'vue'

const props = defineProps({
  moyens: Object,
  required: true,
})

const emit = defineEmits(['close','analytique'])

function emitClose() {
  emit('close')
}
function emitAnalytique(analytique) {
  emit('analytique', analytique)
}
let machines = props.moyens
let moyen = ref(null)
let operationsMaintenance = ref(null)
let operation = ref(null)
let periodicite = ref(null)
let periodicites = ["quotidienne","hebdomadaire", "mensuelle", "trimestrielle", "bisemestrielle", "semestrielle", "annuelle", "personnalisée"]
let debut = ref(null)
let periode = ref(null)
let periodesExecution = ["jour", "semaine", "mois"]
let operationsMoyen = ref(null)
let operationsGamme = ref([])


function getOperationsMaintenance () {
  //console.log('niveau', niveau.value)
  fetch(`${import.meta.env.VITE_API_URL}/maintenance/allOperationsMaintenance?niveau=1`, {
    method: 'GET',
  })
      .then(res => res.json())
      .then(data => {
        operationsMaintenance.value = data;
        //console.log(data);
      })
      .catch(err => console.error(err));
}
function getOperationsMoyen(moyenCode) {
  fetch(`${import.meta.env.VITE_API_URL}/maintenance/allOperationsFromMoyen?code=${moyenCode}`, {
    method: 'GET',
  })
      .then(res => res.json())
      .then(data => {
        if (data) {
          operationsMoyen.value = data;
          console.log(operationsMoyen.value);
          if (operationsMoyen.length <= 0) {
            console.log("hello");
            fetch(`${import.meta.env.VITE_API_URL}/maintenance/deleteOperationsGammeFromMoyen?code=${moyenCode}`, {
              method: 'GET',
            })
                .then(res => res.json())
                .then(data => {
                  console.log(data);
                })
                .catch(err => console.error(err));
          }
        } else {
          console.log("Problem");
        }
      })
      .catch(err => console.error(err));
}

function addOperation(libelle, periodicite, debut, execution) {
  let ope = new Object();
  if (libelle && periodicite && debut && execution) {
    ope.libelle = libelle;
    ope.periodicite = periodicite;
    ope.debut = debut;
    ope.execution = execution;
    fetch(`${import.meta.env.VITE_API_URL}/maintenance/infoGamme?libelleOpe=${libelle}`, {
      method: 'GET',
    })
        .then(res => res.json())
        .then(data => {
          ope.id = data[0].id;
          operationsGamme.value.push(ope);
          console.log(data);
        })
        .catch(err => console.error(err));
  }
}

function creerGamme() {
  if (moyen != null && operationsGamme != null) {
    console.log(operationsGamme.value.length);
    if (operationsGamme.value.length > 0) {
      //console.log(moyen)
      let toSend = new Object();
      toSend.moyenCode = moyen.code;
      toSend.operationGamme = operationsGamme.value;
      fetch(`${import.meta.env.VITE_API_URL}/maintenance/createGamme`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body:JSON.stringify({
          moyenCode: moyen.value.code,
          operationGamme: operationsGamme.value,
        })
      })
          .then(res => res.json())
          .then(data => {
            if (data) {
              if (data === "Problem") {
                window.alert("Une erreur s'est produite")
              } else {
                window.alert('La gamme a bien été ajoutée')
              }
            }
            //console.log(data);
          })
          .catch(err => console.error(err));
    }
  }
}

onMounted(() =>{
  getOperationsMaintenance()
})
</script>

<template>
  <div class="overlay" @click.self="emitClose">
    <div class="modal">
      <header class="modal-header">
        <h2>Nouvelle Gamme</h2>
        <div id="close" @click="emitClose"><img src="../../../assets/x.png"></div>
      </header>
      <hr>
      <main class="modal-body">
        <br>
        <form>
          <div class="container">
            <label for="machine">Machine :</label>
            <select name="machine" id="machine" v-model="moyen" @change="getOperationsMoyen(moyen.code)" required>
              <option value="">--Please choose an option--</option>
              <option v-for="m in machines" :value="m" >{{m.code}}</option>
            </select>
            <b v-if="moyen">Libellé : </b>
            <p v-if="moyen">{{moyen.libelle}}</p>
            <b v-if="moyen">Type : </b>
            <p v-if="moyen">{{moyen.type}}</p>
            <b v-if="moyen">Famille : </b>
            <p v-if="moyen">{{moyen.famille}}</p>
            <b v-if="moyen">Code Analytique : </b>
            <p v-if="moyen">{{moyen.codeAnalytique}}</p>
          </div>
          <br>
          <div class="container">
            <label for="operation">Opération :</label>
            <select name="operation" id="operation" v-model="operation" required>
              <option value="">--Please choose an option--</option>
              <option v-for="op in operationsMaintenance" :value="op.libelle">{{op.libelle}}</option>
            </select>
            <label for="periodicite">Périodicité :</label>
            <select name="periodicite" id="periodicite" v-model="periodicite" required>
              <option value="">--Please choose an option--</option>
              <option v-for="p in periodicites" :value="p">{{p}}</option>
            </select>
            <label for="debut">Début : </label>
            <input name="debut" type="date" v-model="debut" required/>
            <label for="periode">Période d'exécution : </label>
            <select name="periode" id="periode" v-model="periode" required>
              <option value="">--Please choose an option--</option>
              <option v-for="periodeExecution in periodesExecution" :value="periodeExecution">{{periodeExecution}}</option>
            </select>
          </div>
          <br>
          <div class="container">
            <h2>Gamme</h2>
            <p v-if="moyen">Moyen : {{moyen.code}}</p>
            <div id="operation" v-for="(operationGamme, index) in operationsGamme">
              <p>{{index+1}}</p>
              <p>{{operationGamme.id}}</p>
              <p>{{operationGamme.libelle}}</p>
              <p>{{operationGamme.periodicite}}</p>
              <p>{{operationGamme.dateDebut}}</p>
              <p>{{operationGamme.execution}}</p>
              <p v-on:click="operationsGamme.splice(index,1)">X</p>
            </div>
          </div>
          <br>
          <div id="validate-buttons">
            <button @click.prevent="addOperation(operation, periodicite, debut, periode)" id="valider" >+ Ajouter Opération</button>
            <button v-if="operationsGamme.length > 0" @click.prevent="creerGamme()" id="valider">+ Ajouter Gamme</button>
          </div>
        </form>
        <br>
        <div id="tableau">
          <table v-if="operationsMoyen" >
            <thead>
              <tr>
                <th>Référence</th>
                <th>Libellé opération</th>
                <th>Date début</th>
                <th>Date fin</th>
                <th>Etat</th>
                <th>Date action</th>
                <th>Visa</th>
                <th>Commentaire</th>
                <th>Supprimer ?</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="op in operationsMoyen">
                <td>{{op.refOperation}}</td>
                <td>{{op.libelle}}</td>
                <td>{{op.dateDebut}}</td>
                <td>{{op.dateFin}}</td>
                <td>{{op.etatOperation}}</td>
                <td>{{op.dateAction}}</td>
                <td>{{op.visa}}</td>
                <td>{{op.commentaire}}</td>
                <td>{{}}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
hr {
  color: #333333;
  width: 90%;
}
#tableau {
  height: 150px;
  overflow-y: scroll;
}
table{
  justify-self: center;
  width: 95%;
  border-collapse: collapse;
  border: 1px solid #D9D9D9;
  overflow: scroll;
}
thead{
  background-color: #87B6FD;
}
thead th{
  border: 1px solid #D9D9D9;
}
tbody th, td{
  border: 1px solid #D9D9D9;
}
tbody{
  border: 1px solid rgba(0, 0, 0, 0.55);
  position: relative;
  width: 100%;
}
.container {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  width: 100%;
}
#operation{
  display: flex;
  border: 1px solid #D9D9D9;
}
h2{
  margin-bottom: 0px;
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
  width: 90%;
  height: 95%;
  font-family: 'Istok Web',serif;
  color: #000000;
  text-align: center;
}

.modal-header{
  position: relative;
  margin-left: 20px;
  margin-right: 20px;
  justify-content: center;
}

.modal-header h2{
  width: 90%;
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
.modal p{
  margin: 10px;
  font-size: 17px;
}
.modal input, .modal textarea, .modal select {
  width: 13%;
  border: 0.5px solid black;
  border-radius: 3px
}
.modal input, .modal select {
  height: 25px;
}
#validate-buttons{
  width: 100%;
  display: flex;
  justify-content:center;
  gap: 10px;
}
#valider{
  width: 20%;
  background-color: #66E0AF;
  border: 0.5px solid black;
  border-radius: 2px
}
#valider:hover{
  background-color: #9af1cd;
}

</style>