<script setup>
import {computed, defineEmits, defineProps, ref} from 'vue'

const props = defineProps({
  maintenance: Object,
  required: true,
})

let maintenanceToEdit = props.maintenance
//maintenanceToEdit.action = 'hello'
//console.log(maintenanceToEdit)

const action = ref()
const visa = ref()
const commentaire = ref()

maintenanceToEdit.dateDebut = maintenanceToEdit.dateDebut.split('T')[0]
maintenanceToEdit.dateFin = maintenanceToEdit.dateFin.split('T')[0]

const emit = defineEmits(['close', 'validate'])

function emitClose() {
  emit('close')
}

function validate() {
  maintenanceToEdit.action = action.value
  maintenanceToEdit.commentaire = props.maintenance.commentaire
  maintenanceToEdit.visa = props.maintenance.visa
  emit('validate', maintenanceToEdit)
}
console.log("Open Modal")
console.log(maintenanceToEdit)

const cardNiv = computed(() => {
  switch (props.maintenance.niveau) {
    case 2:
      return "Niveau 2"
    default:
      return "Niveau 1"
  }
})
</script>

<template>
  <div class="overlay" @click.self="emitClose">
    <!--<transition name="popup">-->
      <div class="modal">
        <header class="modal-header">
          <h2>Machine {{maintenance.moyenCode}} - {{maintenance.libelle}}</h2>
          <div id="close" @click="emitClose"><img src="../../assets/x.png"></div>
        </header>
        <hr>

        <main class="modal-body">
          <p>A effectuer avant le <b>{{maintenance.dateFin.split('-')[2] + '-' + maintenance.dateFin.split('-')[1] + '-' + maintenance.dateFin.split('-')[0] }}</b></p>
          <div id="dates">
            <div>
              <label for="dateDebut">Date début : </label>
              <br>
              <input class="date" name="dateDebut" type="date" v-model="maintenanceToEdit.dateDebut"/>
            </div>
            <div>
              <label for="dateFin">Date fin : </label>
              <br>
              <input class="date" name="dateFin" type="date" v-model="maintenanceToEdit.dateFin"/>
            </div>
          </div>

          <p>{{cardNiv}}</p>
          <p id="nonFait" v-if="maintenance.dateAction === null"><b>Non effectuée</b></p>
          <p v-if="maintenance.dateAction">Effectuée le : {{maintenance.dateAction.split('T')[0]}}</p>
          <p># Machine {{maintenance.moyenCode}} - {{maintenance.moyLibelle}}</p>
          <label for="action">Action : </label>
          <br>
          <select name="action" id="action" v-model="action">
            <option value="null">---Please choose an option---</option>
            <option value="valider">Valider</option>
<!--            <option value="reinitialiser">Reinitialiser carte</option>-->
          </select>
          <br>
          <label for="visa">Visa : </label>
          <br>
          <input name="visa" type="text" v-model="maintenanceToEdit.visa"/>
          <br>
          <label for="commentaire">Commentaire : </label>
          <br>
          <textarea name="commentaire" id="" cols="30" rows="3" v-model="maintenanceToEdit.commentaire"></textarea>
        </main>

        <footer class="modal-footer">
          <button id="valider" @click="validate">Terminer</button>
        </footer>
      </div>
    <!--</transition>-->
  </div>
</template>

<style scoped>
hr {
  color: #333333;
  width: 90%;
}

/*
.popup-enter-active,
.popup-leave-active {
  transition: all 0.25s ease-out;
}

.popup-enter-from,
.popup-leave-to {
  opacity: 0;
  transform: scale(0.8);
}*/

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
#dates{
  display:flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

#dates div{
  width: 25%;
}
#dates input{
  width: 90%;
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