<script setup>
import {computed, defineEmits, defineProps, ref} from 'vue'

const emit = defineEmits(['close','secteur'])

function emitClose() {
  emit('close')
}
function emitSecteur(secteur) {
  emit('secteur', secteur)
}

let secteurs = ref([])
let sections = ref([])
let machines = ref([])
let references = ref([])
let newRef = ref({
  secteur: '',
  section: '',
  machine: '',
  reference: '',
  nouvelleReference: '',
})

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

let updateReferences = () => {
  if (newRef.value.machine === '' || newRef.value.reference === '' || newRef.value.nouvelleReference === '') {
    alert('Veuillez renseigner un numéro de machine, une référence à modifier et une nouvelle référence.');
  } else {
    if (confirm(`Êtes-vous sûr de vouloir modifier la référence de la machine ${newRef.value.machine}?`)) {
      const params = new URLSearchParams();
      params.append("numMachine", newRef.value.machine);
      params.append("oldReference", newRef.value.reference);
      params.append("newReference", newRef.value.nouvelleReference);
      fetch(`${import.meta.env.VITE_API_URL}/consignes/updateReference?${params}`, {
        method: 'GET',
      })
          .then(res => res.json())
          .then(data => {
            if (data === "OK") {
              alert("La référence a bien été modifiée.")
              emitClose();
              //document.location.href = "/ChangementReference";
            } else {
              alert(`Une erreur s'est produite : ${data.body} \nVeuillez contacter le responsable système.`);
            }
          })
          .catch(err => console.error(err));
    }
  }
}

getSecteurs()
</script>

<template>
  <div class="overlay" @click.self="emitClose">
    <div class="modal">
      <header class="modal-header">
        <h2>Modifier une référence</h2>
        <div id="close" @click="emitClose"><img src="../../assets/x.png"></div>
      </header>
      <hr>
      <main class="modal-body">
        <div class="filters">
          <div class="form-group">
            <label for="secteur">Secteur : </label>
            <br>
            <select @change="() => {getSections(newRef.secteur)}" v-model="newRef.secteur" id="secteur" name="secteur">
              <option selected value="">--Choisissez un secteur--</option>
              <option :value="se.id" v-for="se in secteurs">{{ se.libelle }}</option>
            </select>
          </div>
          <div class="form-group">
            <label for="section">Section : </label>
            <br>
            <select @change="getMachines(newRef.secteur, newRef.section)" v-model="newRef.section" id="section" name="section">
              <option selected value="">--Choisissez une section--</option>
              <option :value="s.section" v-for="s in sections">{{ s.section }}</option>
            </select>
          </div>
          <div class="form-group">
            <label for="machine">Machine : </label>
            <br>
            <select @change="getReferencesFromMachines(newRef.machine, newRef.secteur, newRef.section)" v-model="newRef.machine" id="machine" name="machine">
              <option selected value="">--Choisissez une machine--</option>
              <option :value="m.numMachine" v-for="m in machines">{{ m.numMachine }}</option>
            </select>
          </div>
          <div class="form-group">
            <label for="reference">Référence : </label>
            <br>
            <select @change="" v-model="newRef.reference" id="reference" name="reference">
              <option selected value="">--Choisissez une référence--</option>
              <option :value="r.reference" v-for="r in references">{{ r.reference }}</option>
            </select>
          </div>
          <div class="form-group">
            <label for="reference">Nouvelle référence : </label>
            <br>
            <input type="text" id="newReference" name="newReference" v-model="newRef.nouvelleReference"/>
          </div>
          <button id="valider" @click="updateReferences">Enregistrer</button>
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
  height: 90%;
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
.filters{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  align-content: center;
  height: 100%;
  width: 100%;
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
.form-group{
  width: 50%;
}
.modal input, .modal textarea, .modal select {
  width: 100%;
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