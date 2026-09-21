<script setup>
import CardComp from './CardComp.vue'
import {ref} from "vue";
import DetailModal from "@/components/PassageConsignes/DetailModal.vue";
import SecteurModal from "@/components/PassageConsignes/SecteurModal.vue";
import NewRefModal from "@/components/PassageConsignes/NewRefModal.vue";
import {useAuthStore} from "@/store/index.js";
import axios from "axios";
let store = useAuthStore()
import { useRouter } from 'vue-router'
const router = useRouter()

let consignes = ref([])
let selectedConsigne = ref()
let showSecteurModal = ref(true)
let showRefPopUp = ref(false)

let secteurs = ref([])
let sections = ref([])
let machines = ref([])
let references = ref([])
let noms = ref([])
let filtresConsignes = ref({
  secteur: '',
  section: '',
  machine: '',
  reference: '',
  origine: '',
  typeAction: '',
  nom: '',
  etat: '',
})
let getConsignes = () => {
  fetch(`${import.meta.env.VITE_API_URL}/consignes/getdata`, {
    method: 'GET',
  })
      .then(res => res.json())
      .then(data => {
        consignes.value = data;
      })
      .catch(err => console.error(err));

}

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
let getEffectifs = (secteur) => {
  fetch(`${import.meta.env.VITE_API_URL}/consignes/getEffectifs?secteur=${secteur}`, {
    method: 'GET',
  })
      .then(res => res.json())
      .then(data => {
        noms.value = data
      })
      .catch(err => console.error(err));
}
let openModal = (consigne) => {
  selectedConsigne.value = consigne;
}

let filtrer = () => {
  if (!filtresConsignes.value.secteur) filtresConsignes.value.secteur = 'null'
  if (!filtresConsignes.value.section) filtresConsignes.value.section = 'null'
  if (!filtresConsignes.value.machine) filtresConsignes.value.machine = 'null'
  if (!filtresConsignes.value.origine) filtresConsignes.value.origine = 'null'
  if (!filtresConsignes.value.typeAction) filtresConsignes.value.typeAction = 'null'
  if (!filtresConsignes.value.nom) filtresConsignes.value.nom = 'null'
  if (!filtresConsignes.value.reference) filtresConsignes.value.reference = 'null'
  if (!filtresConsignes.value.etat) filtresConsignes.value.etat = 'null'
  const params = new URLSearchParams();
  params.append("secteur", filtresConsignes.value.secteur);
  params.append("section", filtresConsignes.value.section);
  params.append("machine", filtresConsignes.value.machine);
  params.append("origine", filtresConsignes.value.origine);
  params.append("action", filtresConsignes.value.typeAction);
  params.append("nom", filtresConsignes.value.nom);
  params.append("reference", filtresConsignes.value.reference);
  params.append("etat", filtresConsignes.value.etat);
  fetch(`${import.meta.env.VITE_API_URL}/consignes/filtrer?${params}`, {
    method: 'GET',
  })
      .then(res => res.json())
      .then(data => {
        consignes.value = data
      })
      .catch(err => console.error(err));
}

let effacerFiltres = () =>{
  filtresConsignes.value ={
    secteur:'',
    section: '',
    machine: '',
    reference:'',
    origine: '',
    typeAction: '',
    nom: '',
    etat: '',
  }
  secteurs.value = []
  sections.value = []
  machines.value = []
  references.value = []
  noms.value = []
  getSecteurs()
  getConsignes()

}
let onSelectSecteur = (secteur) =>{
  filtresConsignes.value.secteur = secteur
  getSections(secteur)
  filtrer()
}

let checkAuth = () => {
  store.setDisplay('Consignes')
  store.checkTokenExpiration()
  //store.token = ""
  axios.post(`${import.meta.env.VITE_API_URL}/auth/check-access/Consignes`, {
    token: store.token,
    groups: store.groups
  })
      .then(response => {
        store.setIsAuthorized(true)
        router.push('/consignes');
        store.display = 'Consignes'
      })
      .catch(error => {
        console.error(error);
        if (error.status === 401) {
          router.push('/login');
        }
        if (error.status === 403) {
          store.setIsAuthorized(false)
          router.push('/consignes');
          window.alert("Vous n'avez pas les autorisations nessessaires pour administrer cette page. Vous pouvez quand même acceder aux données.");
        }
      })
}
let checkAuthorised = () => {
  store.setDisplay('Consignes')
  store.checkTokenExpiration()
  axios.post(`${import.meta.env.VITE_API_URL}/auth/check-access/consignes`, {
    token: store.token,
    groups: store.groups
  })
      .then(response => {
        store.setIsAuthorized(true)
        router.push('/consignes');
        store.display = 'Consignes';

      })
      .catch(error => {
        console.error(error);
        if (error.status === 403) {
          router.push('/consignes');
          store.setIsAuthorized(false);
          window.alert("Vous n'avez pas les autorisations nessessaires pour administrer cette page. Vous pouvez quand même acceder aux données.");
        }
      })
}
checkAuthorised()
getSecteurs()
getConsignes()
</script>

<template>
  <SecteurModal
      v-if="showSecteurModal"
      @close="showSecteurModal = false"
      @secteur="onSelectSecteur"

  />
  <NewRefModal
    v-if="showRefPopUp"
    @close="showRefPopUp = false"
  />
 <RouterLink to="/new-consigne"><button class="auth">Nouvelle Consigne</button></RouterLink>
  <button class="auth" v-if="store.isAuthorized" @click="showRefPopUp = true">Changer une référence</button>
  <button class="auth" v-if="store.token" @click="() =>{store.clearToken();router.go(0)}">Deconnnexion</button>
  <button class="auth" v-if="store.token === null" @click="checkAuth()">Connexion</button>

  <div class="filters">
    <div class="form-group">
      <label for="secteur">Secteur : </label>
      <br>
      <select @change="() => {getSections(filtresConsignes.secteur); getEffectifs(filtresConsignes.secteur)}" v-model="filtresConsignes.secteur" id="secteur" name="secteur">
        <option selected value="">--Choisissez un secteur--</option>
        <option :value="se.id" v-for="se in secteurs">{{ se.libelle }}</option>
      </select>
    </div>
    <div class="form-group">
      <label for="section">Section : </label>
      <br>
      <select @change="getMachines(filtresConsignes.secteur, filtresConsignes.section)" v-model="filtresConsignes.section" id="section" name="section">
        <option selected value="">--Choisissez une section--</option>
        <option :value="s.section" v-for="s in sections">{{ s.section }}</option>
      </select>
    </div>
    <div class="form-group">
      <label for="machine">Machine : </label>
      <br>
      <select @change="getReferencesFromMachines(filtresConsignes.machine, filtresConsignes.secteur, filtresConsignes.section)" v-model="filtresConsignes.machine" id="machine" name="machine">
        <option selected value="">--Choisissez une machine--</option>
        <option :value="m.numMachine" v-for="m in machines">{{ m.numMachine }}</option>
      </select>
    </div>
    <div class="form-group">
      <label for="reference">Référence : </label>
      <br>
      <select @change="" v-model="filtresConsignes.reference" id="reference" name="reference">
        <option selected value="">--Choisissez une référence--</option>
        <option :value="r.reference" v-for="r in references">{{ r.reference }}</option>
      </select>
    </div>
    <div class="form-group">
    <label for="origine">Origine : </label>
    <br>
    <select @change="" v-model="filtresConsignes.origine" id="origine" name="origine">
      <option selected value="">--Choisissez une origine--</option>
      <option value="Opérateur">Opérateur</option>
      <option value="Méthode">Méthode</option>
      <option value="Analyse Production">Analyse Production</option>
      <option value="Maintenance">Maintenance</option>
    </select>
    </div>
      <div class="form-group">
      <label for="typeAction">Type d'action : </label>
      <br>
      <select @change="" v-model="filtresConsignes.typeAction" id="typeAction" name="origine">
        <option selected value="">--Choisissez une action--</option>
        <option value="Montage">Montage</option>
        <option value="Dépanage">Dépannage</option>
        <option value="Réglage">Réglage</option>
        <option value="Instruction">Instruction</option>
      </select>
    </div>
      <div class="form-group">
        <label for="nom">Demandeur : </label>
        <br>
        <select @change="" v-model="filtresConsignes.nom" id="nom" name="nom">
          <option selected value="">--Choisissez un nom--</option>
          <option :value="n.id" v-for="n in noms">{{ n.nom }}</option>
        </select>
      </div>
      <div class="form-group">
        <label for="etat">Etat : </label>
        <br>
        <select @change="" v-model="filtresConsignes.etat" id="etat" name="etat">
          <option selected value="">--Choisissez une action--</option>
          <option value="En cours">En cours</option>
          <option value="Soldée">Soldée</option>
        </select>
      </div>
      <button @click.prevent="filtrer">Envoyer</button>
      <button @click.prevent="effacerFiltres">Effacer les filtres</button>

  </div>


  <div id="cards">
    <CardComp
        v-for="item in consignes"
        :key="item.id"
        :consigne="item"
        @open="openModal(item)"
    />
  </div>
  <DetailModal
      v-if="selectedConsigne"
      :consigne="selectedConsigne"
      @close="selectedConsigne = null"
  />



</template>

<style scoped>
#cards{
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  align-content: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 20px;
}
.auth {
  margin-top: 0%;
  margin-right: 1%;
  color: #ffffff;
  background-color: #0452c8;
  font-size: 15px;
  font-weight: bold;
  border: 1px solid #0452c8;
  border-radius: 6px;
  padding: 10px 20px;
  cursor: pointer
}
.auth a{
  color: #ffffff;
  font-size: 15px;
  font-weight: bold;
  text-decoration: none;
}
.auth:hover {
  color: #0452c8;
  background-color: #ffffff;
  .auth a {
    color: #0452c8;
  }
}
.auth a:hover {
  color: #0452c8;
}
.filters{
  display: flex;
  flex-direction: row;
  width: 100%;
  flex-wrap: wrap;
  align-items: flex-end;
  align-content: center;
  gap: 10px;
}
.filters button{
  height: 30px;
}
select{
  font-family: 'Istok Web',serif;
  position: relative;
  height: 30px;
  background: #FFFFFF;
  border-radius: 5px;
  border: solid 1px #000000;
  color: #000000;
  font-size: 12px;

}
label{
  font-family: 'Istok Web',serif;
  font-weight: bold;
  margin: 0 0 10px 0;
  color: #000000;
  font-size: 14px;
}


</style>