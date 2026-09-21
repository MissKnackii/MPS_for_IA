<script setup>
import {computed, defineEmits, defineProps, ref} from 'vue'

const props = defineProps({
  data: Object,
  required: true,
})

let dataToExport = props.data


const allData = ref(false)
let machine = ref('')
let machines = ref([])

let reference = ref('')
let references = ref([])
let dateDebut = ref('')
let dateFin = ref('')

let passage2 = ref(false)

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

let exportData = async () => {
  await fetch(`${import.meta.env.VITE_API_URL}/consultation/exportData`, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      allData: allData.value,
      idMachine: machine.value,
      idReferencePieces: reference.value,
      passage2: passage2.value,
      startDate: dateDebut.value,
      endDate: dateFin.value
    })
  })
      .then(async res => {

        if (!res.ok) {
          throw new Error("Erreur lors de l'export");
        }

        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "export.csv";
        a.click();

        URL.revokeObjectURL(url);
      })

      .catch(err => console.log(err))
}
let exportLibelles = async () => {

  await fetch(`${import.meta.env.VITE_API_URL}/consultation/exportLibelles`, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
    },
    body: ''
  })
      .then(async res => {

        if (!res.ok) {
          throw new Error("Erreur lors de l'export");
        }

        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "exportLibelles.csv";
        a.click();

        URL.revokeObjectURL(url);
      })

      .catch(err => console.log(err))
}
getMachines()
</script>

<template>
  <div class="overlay" @click.self="emitClose">
    <div class="modal">
      <header class="modal-header">
        <h2>Exporter des données</h2>
        <div id="close" @click="emitClose"><img src="../../assets/x.png"></div>
      </header>
      <hr>
      <main class="modal-body">
        <form action="">
          <div>
            <label for="allData">Toutes les données :</label>
            <br>
            <input type="checkbox" id="allData" name="allData" v-model="allData" />
          </div>
          <div v-if="!allData">
            <label for="machine">Machine : </label>
            <br>
            <select @change="getReferencesPieces(machine)" v-model="machine" id="machine" name="machine">
              <option selected value="">--Choisissez une machine--</option>
              <option v-for="m in machines" :value="m.idMachine">{{ m.idMachine }}</option>
            </select>
          </div>
          <div v-if="!allData">
            <label for="reference">Référence : </label>
            <br>
            <select v-model="reference" id="reference" name="reference">
              <option selected value="">--Choisissez une reference--</option>
              <option v-for="r in references" :value="r.idReferencePieces">{{ r.idReferencePieces }}</option>
            </select>
          </div>
          <div>
            <label for="deuxieme">Deuxième passage :</label>
            <br>
            <input type="checkbox" id="deuxieme" name="deuxieme" v-model="passage2" />
          </div>
          <div>
            <label for="dateDebut">Date début :</label>
            <br>
            <input type="datetime-local" id="dateDebut" name="dateDebut" v-model="dateDebut"/>
          </div>
          <div>
            <label for="dateFin">Date Fin</label>
            <br>
            <input type="datetime-local" id="dateFin" name="dateFin" v-model="dateFin"/>
          </div>
        </form>
      </main>

      <footer class="modal-footer">
        <button id="valider" @click="exportData">Terminer</button>
        <br>
        <button id="valider" @click="exportLibelles">Exporter les libellés</button>
      </footer>
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

#close {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
}
#close img{
  width: 30px;
}
.form-group{
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  align-content: center;
}




#valider{
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
  width: 40%;
  border: 0.5px solid black;
  border-radius: 3px
}
.modal input, .modal select {
  height: 25px;
}

</style>