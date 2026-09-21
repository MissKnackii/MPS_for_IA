<script setup>
import {computed, defineEmits, defineProps, onMounted, ref} from 'vue'

const props = defineProps({
  maintenance: Object,
  required: true,
})

const emit = defineEmits(['close','analytique'])

function emitClose() {
  emit('close')
}
function emitAnalytique(analytique) {
  emit('analytique', analytique)
}
let machines = [
  {id: "98", "secteur": "Lavage"},
  {id: "99", "secteur": "Lavage"},
  {id: "104", "secteur": "Lavage"},
  {id: "110", "secteur": "Lavage"},
  {id: "115", "secteur": "Lavage"},
  {id: "141", "secteur": "Décolletage Monobroche"},
  {id: "150", "secteur": "Décolletage Monobroche"},
  {id: "170", "secteur": "Décolletage Monobroche"},
  {id: "177", "secteur": "Décolletage Monobroche"},
  {id: "191", "secteur": "Lavage"}
]
//let machines = ref(null)
let moyen = ref('')
let operationsMaintenance = ref(null)
let operation = ref('')
let visa = ref('')
let heure = ref('')
function getMoyens(analytique, sousSecteur) {
  if (!analytique) {
    analytique = null
  }
  if (!sousSecteur) {
    sousSecteur = null
  }
  fetch(`${import.meta.env.VITE_API_URL}/maintenance/allMoyens?analytique=${analytique}&sousSecteur=${sousSecteur}`, {
    method: 'GET',
  })
      .then(res => res.json())
      .then(data => {
        machines.value = data;
        //console.log(data);
      })
      .catch(err => console.error(err));
}

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

function createNewOperation() {
  console.log(moyen.value, operation.value, visa.value, heure.value)
  fetch(`${import.meta.env.VITE_API_URL}/maintenance/createOperationMultiSwiss?moyen=${moyen.value}&id=${operation.value}&visa=${visa.value}&heuresMachine=${heure.value}`, {
    method: 'GET',
  })
    .then(res => res.json())
    .then(data => {
      if (data) {
        if (data == "OK") {
          window.alert("Opération ajoutée!");
          emitClose()
        } else if (data == "Problem") {
          window.alert("L'opération n'a pas pu être ajoutée, veuillez réessayer ultérieurement.");
        } else if (data == "RequestError") {
          window.alert("Cette opération n'est pas dans la gamme de la machine. Ajoutez la avant de créer une opération.\n L'opération n'a pas été ajoutée.");
        }
      }
    })
    .catch(err => console.error(err));
}
function getOperationsMultiSwiss() {
  fetch(`${import.meta.env.VITE_API_URL}/maintenance/operationsMultiswiss`, {
    method: 'GET',
  })
      .then(res => res.json())
      .then(data => {
        operationsMaintenance.value = data;
      })
      .catch(err => console.error(err));
}

onMounted(() =>{
  //getMoyens();
  //getOperationsMaintenance()
  getOperationsMultiSwiss()
})
</script>

<template>
  <div class="overlay" @click.self="emitClose">
    <div class="modal">
      <header class="modal-header">
        <h2>Maintenance heures machines</h2>
        <div id="close" @click="emitClose"><img src="../../assets/x.png"></div>
      </header>
      <hr>
      <main class="modal-body">
        <br>
        <form @submit.prevent="createNewOperation()">
          <div class="container">
            <label for="machine">Machine :</label>
            <select name="machine" id="machine" v-model="moyen" required>
              <option value="">--Please choose an option--</option>
              <option v-for="m in machines" :value="m.id">{{m.id}}</option>
            </select>
          </div>
          <br>
          <div class="container">
            <label for="operation">Opération :</label>
            <select name="operation" id="operation" v-model="operation" required>
              <option value="">--Please choose an option--</option>
              <option v-for="op in operationsMaintenance" :value="op.id">{{op.libelle}}</option>
            </select>
          </div>
          <br>
          <div class="container">
            <label for="visa">Visa : </label>
            <input name="visa" type="text" v-model="visa" required/>
          </div>
          <br>
          <div class="container">
            <label for="heure">Heure machine : </label>
            <input name="heure" type="text" v-model="heure" required/>
          </div>
          <br>
          <input type="submit" id="valider" value="Terminer">
        </form>
      </main>

    </div>
  </div>
</template>

<style scoped>
hr {
  color: #333333;
  width: 90%;
}

.container {
  display: flex;
  justify-content: space-evenly;
  width: 100%;
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
  width: fit-content;
  min-width: 40%;
  max-width: 90%;
  height: 60%;
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
  width: 40%;
  border: 0.5px solid black;
  border-radius: 3px
}
.modal input, .modal select {
  height: 25px;
}
#valider{
  background-color: #66E0AF;
  border: 0.5px solid black;
  border-radius: 2px
}
#valider:hover{
  background-color: #9af1cd;
}

</style>