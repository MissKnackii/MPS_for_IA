<script setup>
import {computed, defineEmits, defineProps, ref} from 'vue'

const props = defineProps({
  data: Object,
  required: true,
})

let dataToExport = props.data

let machine = ref('')
let machines = ref([])

let reference = ref('')
let references = ref([])
let trg = ref('')
let trs = ref('')
let tre = ref('')
let pcsMinutes = ref('')
let tpsCycle = ref('')

let numMachine = ref('')
let libMachine = ref('')
let refPieces = ref('')
let newTpsCycle = ref('')
let newPcsMinutes = ref('')

let param = ref(true)
let newMachine = ref(false)

let typeRebut = ref({
  n1:'',
  n2:'',
  n3:'',
  n4:'',
  n5:'',
  n6:'',
  n7:'',
  n8:'',
  n9:'',
  n10:''
})
let typeArret = ref({
  n1:'',
  n2:'',
  n3:'',
  n4:'',
  n5:'',
  n6:'',
  n7:'',
  n8:'',
  n9:'',
  n10:''
})

const emit = defineEmits(['close', 'validate'])

function emitClose() {
  emit('close')
}

function validate() {
  dataToExport.action = action.value
  emit('validate', dataToExport)
}
let getMachines = async () => {

  await fetch(`${import.meta.env.VITE_API_URL}/consultation/allMachinesBonneville`, {
    method: 'GET',
  })
      .then(res => res.json())
      .then(data => {
        if (data.length > 0) {
          machines.value = data;
        } else {
          window.alert("Une erreur s'est produite, aucune référence de pièces n'est disponible. Veuillez réessayer plus tard.")
        }
      })
}

let getReferencesPieces = async (idMachine) => {
  await fetch(`${import.meta.env.VITE_API_URL}/consultation/idReferencePiecesMachine?idMachine=${idMachine}`, {
    method: 'GET',
  })
      .then(res => res.json())
      .then(data => {
        if (data.length > 0) {
          references.value = data;
        } else {
          window.alert("Une erreur s'est produite, aucune référence de pièces n'est disponible. Veuillez réessayer plus tard.")
        }
      })
}

let setObj = async () => {
  if (trg.value === null || trs.value === null || tre.value === null || machine.value === null || reference.value === null) {
    window.alert("Vous devez remplir tous les champs.")
  } else {
    await fetch(`${import.meta.env.VITE_API_URL}/consultation/updateObjectifs?trg=${trg.value}&trs=${trs.value}&tre=${tre.value}&piecesMinute=${pcsMinutes.value}&tpsCycle=${tpsCycle.value}&numMachine=${machine.value}&referencePiece=${reference.value}`, {
      method: 'GET',
    })
        .then(async res => {
          window.alert("Les objectifs ont été modifiés.");
        })
  }
}
let addMachine = async () => {
  if (trg.value === null || trs.value === null || tre.value === null || machine.value === null || reference.value === null) {
    window.alert("Vous devez remplir tous les champs.")
  } else {
    await fetch(`${import.meta.env.VITE_API_URL}/consultation/createMachine?trg=${trg.value}&trs=${trs.value}&tre=${tre.value}&piecesMinute=${pcsMinutes.value}&tpsCycle=${tpsCycle.value}&numMachine=${machine.value}&referencePiece=${reference.value}`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        idMachine: numMachine.value,
        libelleMachine: libMachine.value,
        referencePieces: refPieces.value,
        tempsCycle: newTpsCycle.value,
        piecesMinute: newPcsMinutes.value,
        libelleNC: typeRebut.value,
        libelleArret: typeArret.value
      })
    })
        .then(async res => {
          window.alert("La machine à été ajoutée.");
        })
  }
}
getMachines()
</script>

<template>
  <div class="overlay" @click.self="emitClose">
    <div class="modal">
      <header class="modal-header">
        <h2 v-if="param">Paramétrage des objectifs</h2>
        <h2 v-if="newMachine">Ajouter une nouvelle Machine</h2>
        <div id="close" @click="emitClose"><img src="../../assets/x.png"></div>
      </header>
      <hr>
      <main>
        <div class="modal-body" v-if="param === true">
          <div id="description-container">
            <div>
              <button class="buttons" @click.prevent="() => {param = !param; newMachine = !newMachine}">Ajouter une Machine</button>
            </div>
            <div id="description">
              <p>Vous pouvez paramétrer les objectifs qualité d'une machine préalablement inscrite dans le système.
                Si vous ne trouvez pas une machine, cliquez sur l'onglet Ajouter une nouvelle machine.</p>
              <h4>Détail des calculs</h4>
              <ul>
                <li>TRG : pcs bonnes / nb d’heures dans l’intervalle saisi * nb pièces / min * 60</li>
                <li>TRS : pcs bonnes / nb de minutes dans l’intervalle saisi * nb pièces / min</li>
                <li>TRE : pcs bonnes / nb de jour dans l’intervalle saisi * 24 * 60 * nb pièces / min (Tranche de 24h)</li>
              </ul>
            </div>
          </div>
          <form action="">
            <div>
              <label for="machine">Machine : </label>
              <br>
              <select @change="getReferencesPieces(machine)" v-model="machine" id="machine" name="machine">
                <option selected value="">--Choisissez une machine--</option>
                <option v-for="m in machines" :value="m.idMachine">{{ m.idMachine }}</option>
              </select>
            </div>
            <div>
              <label for="reference">Référence : </label>
              <br>
              <select v-model="reference" id="reference" name="reference">
                <option selected value="">--Choisissez une reference--</option>
                <option v-for="r in references" :value="r.idReferencePieces">{{ r.idReferencePieces }}</option>
              </select>
            </div>
            <div>
              <label for="trg">TRG (%) :</label>
              <br>
              <input type="text" id="trg" name="trg" v-model="trg" />
            </div>
            <div>
              <label for="trs">TRS (%) :</label>
              <br>
              <input type="text" id="trs" name="trs" v-model="trs" />
            </div>
            <div>
              <label for="tre">TRE (%) :</label>
              <br>
              <input type="text" id="tre" name="tre" v-model="tre" />
            </div>
            <div>
              <label for="pcsMinutes">Pièces par minutes :</label>
              <br>
              <input type="text" id="pcsMinutes" name="pcsMinutes" v-model="pcsMinutes" />
            </div>
            <div>
              <label for="tpsCycle">Temps de cycle :</label>
              <br>
              <input type="text" id="tpsCycle" name="tpsCycle" v-model="tpsCycle" />
            </div>
            <button id="valider" @click.prevent="setObj">Valider</button>
          </form>
        </div>
        <div id="main-content" v-if="newMachine === true">
          <div id="description">
            <p>Vous pouvez ajouter une nouvelle machine dans la base de données. Vous pouvez saisir les données d'une machine en cliquant ici.</p>
            <button class="buttons" @click.prevent="() => {param = !param; newMachine = !newMachine}">Paramétrages objectifs</button>
          </div>
          <div class="modal-body">
            <form id="form-container">
              <div class="form-element">
                <label for="numMachine">Numéro machine : </label>
                <br>
                <input type="text" id="numMachine" name="numMachine" v-model="numMachine" />
              </div>
              <div class="form-element">
                <label for="libMachine">Libellé machine :</label>
                <br>
                <input type="text" id="libMachine" name="libMachine" v-model="libMachine" />
              </div>
              <div class="form-element">
                <label for="refPieces">Références pièces :</label>
                <br>
                <input type="text" id="refPieces" name="refPieces" v-model="refPieces" />
              </div>
              <div class="form-element">
                <label for="newTpsCycle">Temps de cycle :</label>
                <br>
                <input type="text" id="newTpsCycle" name="newTpsCycle" v-model="newTpsCycle" />
              </div>
              <div class="form-element">
                <label for="newPcsMinutes">Pièces par minutes :</label>
                <br>
                <input type="text" id="newPcsMinutes" name="newPcsMinutes" v-model="newPcsMinutes" />
              </div>
            </form>
            <form action="">
              <div>
                <label for="typeRebut1">Type rebut 1 : </label>
                <input type="text" id="typeRebu1t" name="typeRebut1" v-model="typeRebut.n1" />
              </div>
              <div>
                <label for="typeRebut2">Type rebut 2 : </label>
                <input type="text" id="typeRebut2" name="typeRebut2" v-model="typeRebut.n2" />
              </div>
              <div>
                <label for="typeRebut3">Type rebut 3 : </label>
                <input type="text" id="typeRebut3" name="typeRebut3" v-model="typeRebut.n3" />
              </div>
              <div>
                <label for="typeRebut4">Type rebut 4 : </label>
                <input type="text" id="typeRebut4" name="typeRebut4" v-model="typeRebut.n4" />
              </div>
              <div>
                <label for="typeRebut5">Type rebut 5 : </label>
                <input type="text" id="typeRebut5" name="typeRebut5" v-model="typeRebut.n5" />
              </div>
              <div>
                <label for="typeRebut6">Type rebut 6 : </label>
                <input type="text" id="typeRebut6" name="typeRebut6" v-model="typeRebut.n6" />
              </div>
              <div>
                <label for="typeRebut7">Type rebut 7 : </label>
                <input type="text" id="typeRebut7" name="typeRebut7" v-model="typeRebut.n7" />
              </div>
              <div>
                <label for="typeRebut8">Type rebut 8 : </label>
                <input type="text" id="typeRebut8" name="typeRebut8" v-model="typeRebut.n8" />
              </div>
              <div>
                <label for="typeRebut9">Type rebut 9 : </label>
                <input type="text" id="typeRebut9" name="typeRebut9" v-model="typeRebut.n9" />
              </div>
              <div>
                <label for="typeRebut10">Type rebut 10: </label>
                <input type="text" id="typeRebut10" name="typeRebut10" v-model="typeRebut.n10" />
              </div>
            </form>
            <form action="">
              <div>
                <label for="typeArret1">Type arrêt 1 : </label>
                <input type="text" id="typeArret1" name="typeArret1" v-model="typeArret.n1" />
              </div>
              <div>
                <label for="typeArret2">Type arrêt 2 : </label>
                <input type="text" id="typeArret2" name="typeArret2" v-model="typeArret.n2" />
              </div>
              <div>
                <label for="typeArret3">Type arrêt 3 : </label>
                <input type="text" id="typeArret3" name="typeArret3" v-model="typeArret.n3" />
              </div>
              <div>
                <label for="typeArret4">Type arrêt 4 : </label>
                <input type="text" id="typeArret4" name="typeArret4" v-model="typeArret.n4" />
              </div>
              <div>
                <label for="typeArret5">Type arrêt 5 : </label>
                <input type="text" id="typeArret5" name="typeArret5" v-model="typeArret.n5" />
              </div>
              <div>
                <label for="typeArret6">Type arrêt 6 : </label>
                <input type="text" id="typeArret6" name="typeArret6" v-model="typeArret.n6" />
              </div>
              <div>
                <label for="typeArret7">Type arrêt 7 : </label>
                <input type="text" id="typeArret7" name="typeArret7" v-model="typeArret.n7" />
              </div>
              <div>
                <label for="typeArret8">Type arrêt 8 : </label>
                <input type="text" id="typeArret8" name="typeArret8" v-model="typeArret.n8" />
              </div>
              <div>
                <label for="typeArret9">Type arrêt 9 : </label>
                <input type="text" id="typeArret9" name="typeArret9" v-model="typeArret.n9" />
              </div>
              <div>
                <label for="typeArret10">Type arrêt 10: </label>
                <input type="text" id="typeArret10" name="typeArret10" v-model="typeArret.n10" />
              </div>
            </form>
          </div>
          <button id="valider" @click="addMachine">Valider</button>
        </div>
      </main>
      <footer class="modal-footer"></footer>
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
  padding: 10px;
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
.modal-body{
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  align-content: center;
}
/*#main-content{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
}*/
.buttons{
  background-color: white;
  color: black;
  padding: 7px 10px;
  margin: 5px;
  border-radius: 4px;
  border: black solid 1px;
}
.buttons:hover{
  background-color: #a8a8a8;
  color: black;
  border: black solid 1px;
}
#description-container{
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 5px;
  align-items: center;
  justify-content: center;
  align-content: center;
}
#description{
  width: 100%;
  border: 1px solid #000000;
  border-radius: 5px;
  padding: 0;
  margin: 0;
}
#description p{
  padding: 0;
  margin: 0;
}
#form-container{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  align-content: flex-start;
  width: 100%;
}

.form-element{
  width: 100%;
}
form{
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

#valider{
  margin-top: 15px;
  background-color: #66E0AF;
  border: 0.5px solid black;
  border-radius: 2px
}

#valider:hover{
  background-color: #9af1cd;
}
.modal p{
  margin: 10px;
}
.modal input, .modal textarea, .modal select {
  width: 60%;
  border: 0.5px solid black;
  border-radius: 3px
}
.modal input, .modal select {
  height: 25px;
}

</style>