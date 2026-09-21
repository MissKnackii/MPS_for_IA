<script setup>
import {ref, computed, onMounted, defineEmits, defineProps, watch} from 'vue'
import { useAuthStore } from '@/store/index.js'
import MachinesArretModal from "@/components/Maintenance/Niv2/MachinesArretModal.vue";

const store = useAuthStore()
const user = computed(() => store.user)

const props = defineProps({
  moyens: {
    type: Object,
    required: true,
  },
  analytique: {
    type: String,
    default: null
  },
})

const emit = defineEmits(['filter', 'reset', 'period-change', 'closeHeuresMachines', 'closeGammes'])

const openArret = ref(false)
const selectedAnalytique = computed(() => props.analytique)
const analytique = ref('')
//console.log('analytique',selectedAnalytique)
const  sousSecteurs = ref('')
const  sousSecteur= ref('')
const machines = ref('')
const machine = ref('')
const operation = ref('')
const etat = ref('')
const niveau = ref(1)
const operationsMaintenance = ref('')
const tauxAvancement = ref('')

const months = ["Janvier","Février","Mars","Avril","Mai","Juin", "Juillet","Août","Septembre","Octobre","Novembre","Décembre"]
const days = ["Dimanche","Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi"]

const currentDate = ref(new Date())

const month = ref(currentDate.value.getMonth())
const day = ref(currentDate.value.getDay())
const year = ref(currentDate.value.getFullYear())
const date = ref(currentDate.value.getDate())
const week = ref(getWeek(currentDate.value))

const displayedDate = ref("")
const currentView = ref('year')
let retard = ref();

function getWeekRange(date = new Date()) {
  const day = date.getDay()
  const diffToMonday = day === 0 ? -6 : 1 - day
  const monday = new Date(date)
  monday.setDate(date.getDate() + diffToMonday)

  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)

  return {
    firstday: monday.toISOString().split('T')[0],
    lastday: sunday.toISOString().split('T')[0],
  }
}
function applyFilters() {
  emit('filter', {
    analytique: analytique.value,
    sousSecteur: sousSecteur.value,
    moyen: machine.value,
    idOperationMaintenance: operation.value,
    etat: etat.value,
    niveau: niveau.value,
    date: currentDate.value,
    view: currentView.value,
    year: year.value,
    month: month.value,
    week: week.value,
  })
  getAvancement()
  /*console.log({
    analytique: analytique.value,
    sousSecteur: sousSecteur.value,
    moyen: machine.value,
    idOperationMaintenance: operation.value,
    etat: etat.value,
    niveau: niveau.value,
    date: currentDate.value,
    view: currentView.value,
    year: year.value,
    month: month.value,
    week: week.value,
  })*/
}
function applyFiltersRetard() {
  emit('filter', {
    analytique: analytique.value,
    sousSecteur: sousSecteur.value,
    moyen: machine.value,
    idOperationMaintenance: operation.value,
    etat: "en retard",
    niveau: niveau.value,
    date: currentDate.value,
    view: 'year',
    year: year.value,
    month: month.value,
    week: week.value,
  })
  getAvancement()
  displayDate('year')
}


const periodChange = () => {
  emit('period-change', {
    view: currentView.value,
    year: year.value,
    month: month.value,
    week: week.value,
    //weekStart: weekStart,
    //weekEnd: weekEnd
  })
}
const closeHeuresMachines = () => {
  emit('closeHeuresMachines')
}
const closeGammes = () => {
  emit('closeGammes')
}

function resetFilters() {
  analytique.value = ''
  sousSecteur.value = ''
  machine.value = ''
  operation.value = ''
  etat.value = ''
  niveau.value = ''
  currentDate.value = new Date()
  currentView.value = 'week'
  year.value = ref(currentDate.value.getFullYear())
  month.value = ref(currentDate.value.getDate())
  week.value = ref(getWeek(currentDate.value))
  sousSecteurs.value = ''
  getRetard(analytique)
  getAvancement()
  emit('filter', {
    analytique: 'null',
    sousSecteur: '',
    moyen: '',
    idOperationMaintenance: '',
    etat: '',
    niveau: '',
    date: new Date(),
    view: 'week',
    year: year.value,
    month: month.value,
    week: week.value,
  })
}

function getWeek(d = new Date()) {
  const date = new Date(d)
  date.setHours(0, 0, 0, 0)
  date.setDate(date.getDate() + 4 - (date.getDay() || 7))
  const yearStart = new Date(date.getFullYear(), 0, 1)
  return Math.ceil((((date - yearStart) / 86400000) + 1) / 7)
}

function getSousSecteurs(analytique) {
  fetch(`${import.meta.env.VITE_API_URL}/maintenance/allSousSecteurs?analytique=${analytique}`, {
    method: 'GET',
  })
    .then(res => res.json())
    .then(data => {
      const filteredData = data.filter(el => el.sousSecteurs !== null);
      sousSecteurs.value = filteredData;
    })
    .catch(err => console.error(err));
}
function getMoyens(analytique, sousSecteur) {
  console.log(analytique, sousSecteur)
  if (!analytique) {
    analytique = null
  }
  if (!sousSecteur) {
    sousSecteur = null
  }
  console.log(analytique, sousSecteur)

  fetch(`${import.meta.env.VITE_API_URL}/maintenance/allMoyens?analytique=${analytique}&sousSecteur=${sousSecteur}`, {
    method: 'GET',
  })
    .then(res => res.json())
      .then(data => {
        //const filteredData = data.filter(el => el.sousSecteur !== null);
        machines.value = data;
        console.log(machines.value);
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

function syncFromCurrentDate() {
  const cd = currentDate.value
  day.value = cd.getDay()
  date.value = cd.getDate()
  month.value = cd.getMonth()
  year.value = cd.getFullYear()
  week.value = getWeek(cd)
}

function displayDate(unit) {
  currentView.value = unit
  if (unit === 'year') {
    displayedDate.value = year.value
  } else if (unit === 'month') {
    displayedDate.value = `${months[month.value]} ${year.value}`
  } else if (unit === 'week') {
    const cd = currentDate.value
    displayedDate.value = `Semaine ${week.value} | ${getWeekRange().firstday} - ${getWeekRange().lastday}`  }
}

function changeDate(direction) {
  if (currentView.value === 'year') {

    year.value += direction
    displayedDate.value = year.value
    currentDate.value.setFullYear(year.value)

  } else if (currentView.value === 'month') {

    month.value += direction
    if (month.value < 0) { month.value = 11; year.value-- }
    else if (month.value > 11) { month.value = 0; year.value++ }
    currentDate.value.setMonth(month.value)
    currentDate.value.setFullYear(year.value)
    displayedDate.value = `${months[month.value]} ${year.value}`
    syncFromCurrentDate()

  } else if (currentView.value === 'week') {
    currentDate.value.setDate(currentDate.value.getDate() + direction * 7)
    console.log(currentDate.value)
    syncFromCurrentDate()
    const cd = currentDate.value
    displayedDate.value = `Semaine ${week.value} | ${getWeekRange(currentDate.value).firstday} - ${getWeekRange(currentDate.value).lastday}`
  }
}

function getRetard(analytique) {
  //console.log(analytique.value)
  if (analytique.value === ''|| analytique.value === null) {
    analytique = null
  }
  fetch(`${import.meta.env.VITE_API_URL}/maintenance/allRetards?codeAnalytique=${analytique}`, {
    method: 'GET',
  })
  .then(res => res.json())
  .then(data => {
    // console.log(data)
    retard.value = data[0].retard;
    // console.log("retard :", retard.value)
  })
  .catch(err => console.error(err));
}

function getAvancement() {
  let firstday = getWeekRange().firstday
  let lastday = getWeekRange().lastday

  //console.log(firstday, lastday, analytique.value, sousSecteur.value, machine.value, month.value, year.value)
  if (currentView.value === 'week') {
    fetch(`${import.meta.env.VITE_API_URL}/maintenance/tauxAvancement?periode=semaine&firstday=${firstday}&lastday=${lastday}&codeAnalytique=${analytique.value}&sousSecteur=${sousSecteur.value}&codeMoyen=${machine.value}`, {
      method: 'GET',
    })
      .then(res => res.json())
      .then(data => {
        tauxAvancement.value = data[0].tauxAvancement;
      })
      .catch(err => console.error(err));
  } else if (currentView.value === 'month'){
    fetch(`${import.meta.env.VITE_API_URL}/maintenance/tauxAvancement?periode=mois&mois=${month.value+1}&annee=${year.value}&codeAnalytique=${analytique.value}&sousSecteur=${sousSecteur.value}&codeMoyen=${machine.value}`, {
      method: 'GET',
    })
      .then(res => res.json())
      .then(data => {
        tauxAvancement.value = data[0].tauxAvancement;
      })
      .catch(err => console.error(err));
  } else if (currentView.value === 'year') {
    fetch(`${import.meta.env.VITE_API_URL}/maintenance/tauxAvancement?periode=annee&annee=${year.value}&codeAnalytique=${analytique.value}&sousSecteur=${sousSecteur.value}&codeMoyen=${machine.value}`, {
      method: 'GET',
    })
      .then(res => res.json())
      .then(data => {
        tauxAvancement.value = data[0].tauxAvancement;
      })
      .catch(err => console.error(err));
  }
}

onMounted(() => {
  syncFromCurrentDate()
  displayDate('week')
  getOperationsMaintenance ()
  applyFilters()
  getRetard(analytique)
  getAvancement()
})
watch(selectedAnalytique, (newVal) => {
  analytique.value = newVal;
  getRetard(newVal)
})
</script>

<template>
<!--  <pre>{{ analytique }}</pre>-->
  <div id="filtersContainer">
    <div id="top-filters">
      <button class="time-filters" @click="() => {displayDate('year'); periodChange(); applyFilters(); getAvancement()}">Années</button>
      <button class="time-filters" @click="() => {displayDate('month'); periodChange(); applyFilters(); getAvancement()}">Mois</button>
      <button class="time-filters" @click="() => {displayDate('week'); periodChange(); applyFilters(); getAvancement()}">Semaines</button>

      <div id="week-selector">
        <div @click="() => {changeDate(-1); periodChange(); applyFilters()}" class="triangle-code" id="triangle-left"></div>

        <div id="date">
          <p>{{ displayedDate }}</p>
        </div>

        <div @click="() => {changeDate(1); periodChange(); applyFilters()}" class="triangle-code" id="triangle-right"></div>
      </div>

      <div id="retards">
        <div class="retard">
          <p @click="applyFiltersRetard()"><b>Nombre de retards : </b><b id="red">{{ retard }}</b></p>
          <p class="subtitle">Objectif : 0</p>
        </div>
        <div class="retard">
          <p><b>Taux avancement : </b><b id="red">{{ tauxAvancement }} %</b></p>
          <p class="subtitle">Objectif : 100%</p>
        </div>
      </div>
      <div id="greenButtonContainer">
        <button class="green-button" @click="closeHeuresMachines">
          <img src="@/assets/plus-circle.svg" alt="">
          Maintenance heures machine
        </button>
      </div>

    </div>
    <div id="filters">
      <div class="container">
        <label for="analytique" >Section analytique :</label>
        <select name="analytique" id="analytique" v-model="analytique" @change="() => {getSousSecteurs(analytique); getMoyens(analytique.value, sousSecteur.value); getRetard(analytique)}">
          <option value="">--Please choose an option--</option>
          <option value="Assemblage/Tri">Assemblage/Tri</option>
          <option value="Decolletage Monobroche">Décolletage monobroche</option>
          <option value="Essorage">Essorage</option>
          <option value="Lavage">Lavage</option>
          <option value="Multi CN">Multi CN</option>
          <option value="Multi trad JLT">Multi Trad JLT</option>
          <option value="Multi trad PG">Multi Trad PG</option>
          <option value="Polissage">Polissage</option>
          <option value="Propreté">Propreté</option>
          <option value="Reprise">Reprise</option>
        </select>
      </div>

      <div class="container">
        <label for="sous-secteur">Sous-secteur :</label>
        <select name="sous-secteur" id="sous-secteur" v-model="sousSecteur" @change="() => {getMoyens(analytique, sousSecteur)}">
          <option value="">--Please choose an option--</option>
          <option v-for="ss in sousSecteurs" :value="ss.sousSecteur">{{ss.sousSecteur}}</option>
        </select>
      </div>

      <div class="container" @click="getMoyens(analytique, sousSecteur)">
        <label for="machine">Machine :</label>
        <select name="machine" id="machine" v-model="machine">
          <option value="">--Please choose an option--</option>
          <option v-for="m in machines" :value="m.code">{{m.code}}</option>
        </select>
      </div>

      <div class="container">
        <label for="operation">Opération :</label>
        <select name="operation" id="operation" v-model="operation" >
          <option value="">--Please choose an option--</option>
          <option v-for="op in operationsMaintenance" :value="op.libelle">{{op.libelle}}</option>
        </select>
      </div>

      <div class="container">
        <label for="etat">État :</label>
        <select name="etat" id="etat" v-model="etat">
          <option value="">--Please choose an option--</option>
          <option value="à faire">À faire</option>
          <option value="validée">Validée</option>
          <option value="en retard">En retard</option>
          <option value="annulée">Annulée</option>
        </select>
      </div>

      <div class="container">
        <label for="niveau">Niveau :</label>
        <select name="niveau" id="niveau" v-model="niveau">
          <option value="">--Please choose an option--</option>
          <option value="1">Niveau 1</option>
        </select>
      </div>
    </div>

    <button class="filters-buttons" @click="applyFilters">Filtrer</button>
    <button class="filters-buttons" @click="resetFilters">Effacer les filtres</button>

  </div>

</template>


<style scoped>

.retard{
  margin-left: 10px;
}
#red{
  color: red;
}
#greenButtonContainer{
  display: flex;
  align-items: center;
  flex-direction: column;
  position: relative;
  left: 3%;
}

.time-filters{
  font-family: 'Istok Web',serif;
  font-weight: bold;
  margin: 5px;
  position: relative;
  width: 7%;
  height: 35px;
  background: #0B5CD6;
  border-radius: 5px;
  border: none;
  color: #FFFFFF;
  font-size: 12px;
}
.time-filters:hover{
  background: #FFFFFF;
  color: #0B5CD6;
  border: 1.5px solid #0B5CD6;
}
p{
  font-family: 'Istok Web',serif;
  color: #000000
}
#week-selector{
  display: flex;
  align-items: center;
  width: 30%;
}
.triangle-code{
  display : inline-block;
  height : 0;
  width : 0;
  border-right : 10px solid transparent;
  border-bottom : 15px solid black;
  border-left : 10px solid transparent;
}
.triangle-code:hover{
  border-bottom : 15px solid #a8a8a8;
}
#triangle-left{
  rotate: -90deg;
}
#triangle-right{
  rotate: 90deg;
}

#date{
  width : 100%;
  height : 25px;
  border : 1.5px solid black;
  border-radius : 3px;
  margin-left : 5px;
  margin-right : 5px;
  text-align: center;
}

#date p {
  margin-top : 4px;
}
#retards{
  display: flex;
  font-size: 14px;
}
#retards p{
  margin: 0;
}
#top-filters{
  display: flex;
  width: 100%;
}
.subtitle{
  font-size: 11px;
  font-weight: bold;
}
.green-button{
  height: fit-content;
  background-color: #66E0AF;
  border: 0.5px solid black;
  border-radius: 2px;
  font-size: 12px;
  margin: 5px;
  text-align: center;
  display: flex;

}
.green-button img{
  width: 13px;
  height: 13px;
  margin: 0 0;
}
.green-button:hover{
  background-color: #9af1cd;
}
select{
  font-family: 'Istok Web',serif;
  margin: 5px;
  position: relative;
  height: 25px;
  background: #FFFFFF;
  border-radius: 5px;
  border: solid 1px #000000;
  color: #000000;
  font-size: 12px;

}
label{
  font-family: 'Istok Web',serif;
  font-weight: bold;
  margin: 5px;
  color: #000000;
  font-size: 14px;
}

.container{
  display: flex;
  flex-direction: column;
  width: 95%;
}
#operation{
  width: 95%;
}
#filters{
  display: flex;
}
.filters-buttons{
  font-family: 'Istok Web',serif;
  font-weight: bold;
  border: solid 1px #000000;
  color: #000000;
  background: #FFFFFF;
  height: 30px;
  padding: 0 10px;
  margin: 5px;
  border-radius: 5px;
}
.filters-buttons:hover{
  background: #dfdfdf;
}
</style>