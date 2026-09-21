<script setup>
import {computed, defineEmits, defineProps, ref} from 'vue'

const props = defineProps({
  maintenance: Object,
  required: true,
})

let machinesArret = ref(null)
let analytiqueArret = ref()
const emit = defineEmits(['close','analytique'])

function emitClose() {
  emit('close')
}
function emitAnalytique(analytique) {
  emit('analytique', analytique)
}

function getMoyensArret(analytique) {
  fetch(`${import.meta.env.VITE_API_URL}/maintenance/allMoyensStoppedFromSecteur?code=${analytique}`, {
    method: 'GET',
  })
      .then(res => res.json())
      .then(data => {
        machinesArret.value = data;
        //console.log(machinesArret);
        emitAnalytique(analytique);

      })
      .catch(err => console.error(err));
}
</script>

<template>
  <div class="overlay" @click.self="emitClose">
    <div class="modal">
      <header class="modal-header">
        <h2>Choisissez un secteur</h2>
        <div id="close" @click="emitClose"><img src="../../assets/x.png"></div>
      </header>
      <hr>
      <main v-if="!machinesArret" class="modal-body">
        <p @click="getMoyensArret('Assemblage/Tri')" class="secteur"><b>Assemblage/Tri</b></p>
        <p @click="getMoyensArret('Decolletage Monobroche')" class="secteur"><b>Décolletage monobroche</b></p>
        <p @click="getMoyensArret('Essorage')" class="secteur"><b>Essorage</b></p>
        <p @click="getMoyensArret('Lavage')" class="secteur"><b>Lavage</b></p>
        <p @click="getMoyensArret('Multi CN')" class="secteur"><b>Multi CN</b></p>
        <p @click="getMoyensArret('Multi trad JLT')" class="secteur"><b>Multi Trad JLT</b></p>
        <p @click="getMoyensArret('Multi trad P')" class="secteur"><b>Multi Trad PG</b></p>
        <p @click="getMoyensArret('Polissage')" class="secteur"><b>Polissage</b></p>
        <p @click="getMoyensArret('Propreté')" class="secteur"><b>Propreté</b></p>
        <p @click="getMoyensArret('Reprise')" class="secteur"><b>Reprise</b></p>
      </main>
      <main v-if="machinesArret" class="modal-body">
        <h3>Rappel : ces machines sont arrêtées</h3>

        <p v-for="m in machinesArret"><b>{{ m.code }}</b></p>
        <b>Veuillez prévenir votre responsable </b>
        <br>
        <b>de secteur pour redémarrer une machine.</b><br><br>
        <button id="valider" @click="emitClose"> Fermer </button>
      </main>

    </div>
  </div>
</template>

<style scoped>
hr {
  color: #333333;
  width: 90%;
}
.secteur{
  margin: 0;
  padding: 4px 0;
  font-size: 14px;
}
.secteur:hover {
  background: rgba(0,0,0,0.03);
  border-radius: 4px;
  cursor: default;
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