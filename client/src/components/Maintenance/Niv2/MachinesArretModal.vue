<script setup>
import {defineEmits, onMounted, ref} from 'vue'

const emit = defineEmits(['close'])

function emitClose() {
  emit('close')
}

let machinesArret = ref([]);
let machineToStop = ref();
let machinesToStop = ref([]);

function declareMoyenStopped(moyen) {
  if (moyen) {
    if (confirm(`Êtes-vous sûr de vouloir déclarer la machine ${moyen.code} en arret ?`)) {
      fetch(`${import.meta.env.VITE_API_URL}/maintenance/declareMoyenStopped?code=${moyen.code}`, {
        method: 'GET',
      })
      .then((data) => {
        //console.log(data)
        if (data > 0) {
          getMoyensArret()
        } else if (data == 'ERROR') {
          alert('Une erreur s\'est produite, veuillez réessayer ultérieurement.');
        } else {
          console.log(`erreur, la machine ${moyen.code} n'a pas pu être déclaré en arrêt.`);
        }
      })
    }
  } else {
    alert('Veuillez renseigner une machine.');
  }
}

function restartMoyenStopped(code) {
  if (code) {
    if (confirm(`La machine ${code} va être déclarer en marche. Voulez-vous continuer ?`)) {
      fetch(`${import.meta.env.VITE_API_URL}/maintenance/restartMoyenStopped?code=${code}`, {
        method: 'GET',
      })
      .then((data) => {
        console.log(data)
        if (data) {
          getMoyensArret()
          getMoyens(null, null)
          // console.log(data)
        } else if (data === 'ERROR') {
          alert("Une erreur s'est produite, veuillez réessayer ultérieurement.")
        }
      })
    }
  } else {
    alert(`Erreur, la machine ${code} n'a pas pu être rallumé.`)
  }
}

function getMoyensArret() {
  fetch(`${import.meta.env.VITE_API_URL}/maintenance/allMoyensStopped`, {
    method: 'GET',
  })
      .then(res => res.json())
      .then(data => {
        machinesArret.value = data;
        //console.log(machinesArret);
      })
      .catch(err => console.error(err));
}

function getMoyens(analytique, sousSecteur) {
  fetch(`${import.meta.env.VITE_API_URL}/maintenance/allMoyens?analytique=${analytique}&sousSecteur=${sousSecteur}`, {
    method: 'GET',
  })
      .then(res => res.json())
      .then(data => {
        const filteredData = data.filter(item =>
            !machinesArret.value.some(m => m.code === item.code)
        );
        machinesToStop.value = filteredData;
      })
      .catch(err => console.error(err));
}
getMoyensArret()
getMoyens(null, null)
</script>

<template>
  <div class="overlay" @openArrets="" @click.self="emitClose">
    <div class="modal">
      <header class="modal-header">
        <div id="close" @click="emitClose">X</div>
        <h2>Machine arrêtées</h2>
      </header>
      <form action="">
        <select name="declareMoyenStopped" id="declareMoyenStopped" v-model="machineToStop">
          <option selected value="--- Selectionnez une machine ---" >--- Selectionnez une machine ---</option>
          <option :value="machine" v-for="machine in machinesToStop">{{ machine.code }}</option>
        </select>
        <button id="submit" @click="declareMoyenStopped(machineToStop)"><img id="plus" src="../../../assets/plus-circle.svg" alt="">Ajouter une machine </button>
      </form>
      <main class="modal-body">
        <div id="stoppedContainer">
          <div id="stoppedCard" v-for="machine in machinesArret">
            {{machine.code}}
            <button id="cross" @click="restartMoyenStopped(machine.code)">X</button>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
form{
  position : relative;
  left: 0px;
}
#cross{
  background-color: red;
  border: black 0.5px solid;
  border-radius: 3px;
}
#stoppedContainer{
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
  flex-wrap: wrap;
  justify-content: center;
}
#plus{
  width: 15px;
  height: 15px;
  margin: 0 0;
}
#declareMoyenStopped{
  width: 20%;
  border: black 1.5px solid;
  height: 30px;
  border-radius: 4px;
  margin-right: 10px;
}
#submit{
  width: 20%;
  border: black 1.5px solid;
  height: 23px;
  background-color: #9af1cd;
  border-radius: 4px;
  justify-content: center;
  align-content:center;
}
#stoppedCard{
  border: black solid 1px;
  width: fit-content;
  padding: 10px;
  margin: 10px;
  border-radius: 5px;
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
  width: 70%;
  max-width: 90%;
  height: 90%;
  font-family: 'Istok Web',serif;
  color: #000000;
  text-align: center;
  overflow-x: scroll;

}

header{
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: center;
}

#close {
  position: fixed;
  left: 80%;
}

.modal p{
  margin: 10px;
}
.modal input, .modal textarea, .modal select {
  width: 45%;
  border: 0.5px solid black;
  border-radius: 3px
}
.modal input, .modal select {
  height: 25px;
}

</style>