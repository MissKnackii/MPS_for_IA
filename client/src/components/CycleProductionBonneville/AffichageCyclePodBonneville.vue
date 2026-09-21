<script setup>
import {computed, ref} from "vue";
import axios from "axios";
import ExportModal from "@/components/CycleProductionBonneville/ExportModal.vue";
import ParametrageModal from "@/components/CycleProductionBonneville/ParametrageModal.vue";
import {useAuthStore} from "@/store/index.js";
import { useRouter } from 'vue-router'
import Loader from "@/components/CycleProductionBonneville/loader.vue";
const router = useRouter()

let store = useAuthStore()
let machine = ref('')
let machines = ref([])

let reference = ref('')
let references = ref([])

let dateDebut = ref('')
let dateFin = ref('')

let passage2 = ref(false)
let exportOpen = ref(false)
let paramOpen = ref(false)
let showLoader = ref(false)

let indicateurs = ref({
  TRS: '',
  TRG: '',
  TRE: '',
})
let maxTime = new Date()
let message = ref('')

let pcsMinute = ref('')
let objectifs = ref({
  TRS: '',
  TR: '',
  TRE: '',
  TRG: '',
  txRebuts: '',
  nbRebuts: '',
})
let libellesNC = ref([])
let libellesArrets = ref([])
let NC = ref([])
let deuxiemePassage_NC = ref([])
let nbArrets = ref([])
let tempsArrets = ref([])

let imgTRG = ref('')
let imgTRE = ref('')
let imgTRS = ref('')

let getMachines = async () => {

  await fetch(`${import.meta.env.VITE_API_URL}/consultation/allMachinesBonneville`, {
    method: 'GET',
  })
      .then(res => res.json())
      .then(data => {
        if (data.length > 0) {
          machines.value = data;
        } else {
          message.value = "Une erreur s'est produite, aucune machine n'est disponible. Veuillez réessayer plus tard.";
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
          message.value = "Une erreur s'est produite, aucune référence de pièces n'est disponible. Veuillez réessayer plus tard.";
        }
      })
}

let loadData = () => {
    if (!machine.value || !reference.value || !dateDebut.value || !dateFin.value ) {
      message.value = "Veuillez remplir les champs vides";

    } else if (dateDebut.value > dateFin.value) {
      message.value = "La date de départ est supérieur à la date de fin";

    } else if (dateDebut.value === maxTime) {
      if (dateDebut.value > maxTime || dateFin.value > maxTime) {
        message.value = "L'heure indiquée est supérieur à l'heure actuelle";
      } else {
        showLoader.value = true;
        getConsultationData();
      }
    } else {
      showLoader.value = true;
      getConsultationData();
    }
}

let getConsultationData = async () => {
      if (passage2.value === false) {
        passage2.value = 0;
      } else {
        passage2.value = 1;
      };
        await fetch(`${import.meta.env.VITE_API_URL}/consultation/indicateurs?machine=${machine.value}&reference=${reference.value}&startDate=${new Date(dateDebut.value)}&endDate=${new Date(dateFin.value)}`, {
          method: 'GET',
        })
            .then(res => res.json())
            .then(data => {
              if (data.length <= 0) {
                message.value = "La requête n'a pas pu aboutir, veuillez réessayer plus tard.";
              } else {
                if (data === "RequestError") {
                  message.value = "La requête n'a pas pu aboutir, vérifiez les informations transmises ou réessayez plus tard.";
                } else {
                  indicateurs.value = data[0];
                }
              }
            }).then(() => {
              getParameters();
            }).then(() => {
              getNC();
            }).then(() => {
              getNbArrets();
            }).then(() => {
              getTempsArrets();
            }).then(() => {
              if (showLoader.value === true) {
                showLoader.value = false;
              }
            })
            .catch(err => console.error(err));
}
let getParameters = async () => {
  await fetch(`${import.meta.env.VITE_API_URL}/consultation/parametresMachine?idMachine=${machine.value}&idReferencePieces=${reference.value}`, {
    method: 'GET',
  })
      .then(res => res.json())
      .then(data => {
        if (data.length < 0) {
          message.value = "La requête n'a pas pu aboutir, veuillez réessayer plus tard.";
        } else {
          pcsMinute.value = data[0].piecesMinute;
          objectifs.value.TRS = data[0].objectifTRS;
          objectifs.value.TRG = data[0].objectifTRG;
          objectifs.value.TRE = data[0].objectifTRE;
          objectifs.value.txRebuts = data[0].objectifRebuts;
          objectifs.value.nbRebuts = (objectifs.value.txRebuts * indicateurs.value.nbPieces)/100;
          libellesNC.value = [];
          libellesNC.value.push(data[0].libelleNC1);
          libellesNC.value.push(data[0].libelleNC2);
          libellesNC.value.push(data[0].libelleNC3);
          libellesNC.value.push(data[0].libelleNC4);
          libellesNC.value.push(data[0].libelleNC5);
          libellesNC.value.push(data[0].libelleNC6);
          libellesNC.value.push(data[0].libelleNC7);
          libellesNC.value.push(data[0].libelleNC8);
          libellesNC.value.push(data[0].libelleNC9);
          libellesNC.value.push(data[0].libelleNC10);
          libellesArrets.value = [];
          libellesArrets.value.push(data[0].libelleArret1);
          libellesArrets.value.push(data[0].libelleArret2);
          libellesArrets.value.push(data[0].libelleArret3);
          libellesArrets.value.push(data[0].libelleArret4);
          libellesArrets.value.push(data[0].libelleArret5);
          libellesArrets.value.push(data[0].libelleArret6);
          libellesArrets.value.push(data[0].libelleArret7);
          libellesArrets.value.push(data[0].libelleArret8);
          libellesArrets.value.push(data[0].libelleArret9);
          libellesArrets.value.push(data[0].libelleArret10);
        }
      }).then(() => {
        imgTRG.value = setMeteo(indicateurs.value.TRG,objectifs.value.TRG);
        imgTRE.value = setMeteo(indicateurs.value.TRE,objectifs.value.TRE);
        imgTRS.value = setMeteo(indicateurs.value.TRS,objectifs.value.TRS);
      })
}
let setMeteo = (indicateurs, objectif) => {
  if (indicateurs < objectif) {
    return 'nuage'
  } else {
    return 'soleil'
  }
}
let getNC = async () => {
  await fetch(`${import.meta.env.VITE_API_URL}/consultation/nc?machine=${machine.value}&reference=${reference.value}&startDate=${new Date(dateDebut.value)}&endDate=${new Date(dateFin.value)}`, {
    method: 'GET',
  })
      .then(res => res.json())
      .then(data => {
        if (data.length < 0) {
          message.value = "La requête n'a pas pu aboutir, veuillez réessayer plus tard.";
        } else {
          NC.value = [];
          NC.value.push(data[0].NC1);
          NC.value.push(data[0].NC2);
          NC.value.push(data[0].NC3);
          NC.value.push(data[0].NC4);
          NC.value.push(data[0].NC5);
          NC.value.push(data[0].NC6);
          NC.value.push(data[0].NC7);
          NC.value.push(data[0].NC8);
          NC.value.push(data[0].NC9);
          NC.value.push(data[0].NC10);
          deuxiemePassage_NC.value = [];
          deuxiemePassage_NC.value.push(data[0].deuxiemePassage_NC1);
          deuxiemePassage_NC.value.push(data[0].deuxiemePassage_NC2);
          deuxiemePassage_NC.value.push(data[0].deuxiemePassage_NC3);
          deuxiemePassage_NC.value.push(data[0].deuxiemePassage_NC4);
          deuxiemePassage_NC.value.push(data[0].deuxiemePassage_NC5);
          deuxiemePassage_NC.value.push(data[0].deuxiemePassage_NC6);
          deuxiemePassage_NC.value.push(data[0].deuxiemePassage_NC7);
          deuxiemePassage_NC.value.push(data[0].deuxiemePassage_NC8);
          deuxiemePassage_NC.value.push(data[0].deuxiemePassage_NC9);
          deuxiemePassage_NC.value.push(data[0].deuxiemePassage_NC10);
        }
      })
}
let getNbArrets = async () => {
  await fetch(`${import.meta.env.VITE_API_URL}/consultation/nbArrets?machine=${machine.value}&reference=${reference.value}&startDate=${new Date(dateDebut.value)}&endDate=${new Date(dateFin.value)}&deuxiemePassage=${passage2.value}`, {
    method: 'GET',
  })
      .then(res => res.json())
      .then(data => {
        if (data.length < 0) {
          message.value = "La requête n'a pas pu aboutir, veuillez réessayer plus tard.";
        } else {
          nbArrets.value = [];
          nbArrets.value.push(data[0].Arret1);
          nbArrets.value.push(data[0].Arret2);
          nbArrets.value.push(data[0].Arret3);
          nbArrets.value.push(data[0].Arret4);
          nbArrets.value.push(data[0].Arret5);
          nbArrets.value.push(data[0].Arret6);
          nbArrets.value.push(data[0].Arret7);
          nbArrets.value.push(data[0].Arret8);
          nbArrets.value.push(data[0].Arret9);
          nbArrets.value.push(data[0].Arret10);
        }
      })
}
let getTempsArrets = async () => {
  await fetch(`${import.meta.env.VITE_API_URL}/consultation/tempsArrets?machine=${machine.value}&reference=${reference.value}&startDate=${new Date(dateDebut.value)}&endDate=${new Date(dateFin.value)}&deuxiemePassage=${passage2.value}`, {
    method: 'GET',
  })
      .then(res => res.json())
      .then(data => {
        if (data.length < 0) {
          message.value = "La requête n'a pas pu aboutir, veuillez réessayer plus tard.";
        } else {
          //('tempsArrets', data)
          tempsArrets.value = []
          tempsArrets.value.push(data[0].Arret1);
          tempsArrets.value.push(data[0].Arret2);
          tempsArrets.value.push(data[0].Arret3);
          tempsArrets.value.push(data[0].Arret4);
          tempsArrets.value.push(data[0].Arret5);
          tempsArrets.value.push(data[0].Arret6);
          tempsArrets.value.push(data[0].Arret7);
          tempsArrets.value.push(data[0].Arret8);
          tempsArrets.value.push(data[0].Arret9);
          tempsArrets.value.push(data[0].Arret10);
          //this.$forceUpdate();
        }
      })
}

let affichageNull = (value) => {
  if (value || value != null) {
    return value;
  } else {
    return '-';
  }
}

let computedLibellesArrets = computed(() => {
  let array = []
  libellesArrets.value.forEach((item) => {
    if (item == 'null') {
      array.push(null)
    } else {
      array.push(item);
    }
  });
  return array;
})

let computedLibellesRebuts = computed(() => {
  let array = []
  libellesNC.value.forEach((item) => {
    if (item === 'null') {
      array.push(null)
    } else {
      array.push(item);
    }
  });
  return array;
})

let secondToMinutes = (time) => {
  return (time/60).toFixed(0);
}
let startLimit = computed(() => {
  return new Date(dateDebut.value);
})
let endLimit = computed(() => {
  return new Date(dateFin.value);
})

let interval = computed(() => {
  if (!endLimit.value && !startLimit.value) {
    return 0
  } else {
    return Math.round((endLimit.value - startLimit.value) / 3600000)
  }
})

let nbPiecesTheo = computed(() => {
  return interval.value*60*pcsMinute.value
})

let diversArret = computed(() => {
  let diversArret;
  diversArret = (((nbPiecesTheo.value-indicateurs.value.nbPieces)/pcsMinute.value)-secondToMinutes(tempsArretsTotal.value)).toFixed(0);

  if (diversArret < 0) {
    diversArret = 0;
  }
  return diversArret;
})

let nbArretsTotal = computed(() => {
  const reducer = (accumulator, currentValue) => accumulator + currentValue;
  if (nbArrets.value[0] !== undefined){
    if (nbArrets.value[0].length === 0) {
      return null;
    } else {
      return nbArrets.value.reduce(reducer);
    }
  }
  else return null
})

let tempsArretsTotal = computed(() => {
  const reducer = (accumulator, currentValue) => accumulator + currentValue;
  if (tempsArrets.value.length === 0) {
    return 0;
  } else {
    return tempsArrets.value.reduce(reducer)
  }
})

let computedTotal = computed(() => {
  const reducer = (accumulator, currentValue) => accumulator + currentValue;
  if (NC.value.length === 0) {
    return null;
  } else {
    return NC.value.reduce(reducer)
  }
})

let resetFilters = () => {
  machine.value = '';
  dateDebut.value = '';
  dateFin.value = '';
  passage2.value = false
}
let resetData = () => {
  indicateurs.value.TRS = '';
  indicateurs.value.TRE = '';
  indicateurs.value.TRG = '';
  indicateurs.value.nbPieces = '';
  indicateurs.value.nbRebuts = '';
  objectifs.value.TRS = '';
  objectifs.value.TRG = '';
  objectifs.value.TRE = '';
  objectifs.value.txRebuts = '';
  objectifs.value.nbRebuts = '';
  libellesArrets.value = [];
  libellesNC.value = [];
  nbArrets.value = [];
  NC.value = [];
  imgTRE.value = '';
  imgTRG.value = '';
  imgTRS.value = '';
  //styleRebuts.color = '#045FB4';
}

let checkAuth = () => {
  store.setDisplay('CycleBonneville')
  store.checkTokenExpiration()
  //store.token = ""
  axios.post(`${import.meta.env.VITE_API_URL}/auth/check-access/CycleBonneville`, {
    token: store.token,
    groups: store.groups
  })
      .then(response => {
        store.setIsAuthorized(true)
        router.push('/cycle-prod-bonneville');
        store.display = 'CycleBonneville'
      })
      .catch(error => {
        console.error(error);
        if (error.status === 401) {
          router.push('/login');
        }
        if (error.status === 403) {
          store.setIsAuthorized(false)
          router.push('/cycle-prod-bonneville');
          window.alert("Vous n'avez pas les autorisations nessessaires pour administrer cette page. Vous pouvez quand même acceder aux données.");
        }
      })
}
let checkAuthorised = () => {
  store.setDisplay('CycleBonneville')
  store.checkTokenExpiration()
  axios.post(`${import.meta.env.VITE_API_URL}/auth/check-access/CycleBonneville`, {
    token: store.token,
    groups: store.groups
  })
      .then(response => {
        store.setIsAuthorized(true)
        router.push('/cycle-prod-bonneville');
        store.display = 'CycleBonneville';

      })
      .catch(error => {
        console.error(error);
        if (error.status === 403) {
          router.push('/cycle-prod-bonneville');
          store.setIsAuthorized(false);
          window.alert("Vous n'avez pas les autorisations nessessaires pour administrer cette page. Vous pouvez quand même acceder aux données.");
        }
      })
}


getMachines()
checkAuthorised()

</script>

<template>
  <loader
    v-if="showLoader"
    @close="showLoader = false"
  />
  <ExportModal
      v-if="exportOpen"
      @close="exportOpen = false"
  />
  <ParametrageModal
      v-if="paramOpen"
      @close="paramOpen = false"
  />
  <!--:data=""
        :dataToExport=""-->
  <header>
    <h1>Cycle de production Bonneville</h1>
    <div id="buttons-container">
      <button class="auth" v-if="store.token" @click="() =>{store.clearToken();router.go(0)}">Deconnnexion</button>
      <button class="auth" v-if="store.token === null" @click="checkAuth()">Connexion</button>
      <button class="param" v-if="store.isAuthorized" @click="paramOpen = true">Paramétrage</button>
    </div>
  </header>
  <form id="" @submit.prevent="() => {loadData()}">
    <div id="filters-container">
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
        <label for="dateDebut">Date début :</label>
        <br>
        <input type="datetime-local" id="dateDebut" name="dateDebut" v-model="dateDebut"/>
      </div>
      <div>
        <label for="dateFin">Date Fin</label>
        <br>
        <input type="datetime-local" id="dateFin" name="dateFin" v-model="dateFin"/>
      </div>
      <div>
        <label for="deuxieme">Deuxième passage :</label>
        <br>
        <input type="checkbox" id="deuxieme" name="deuxieme" v-model="passage2"/>
      </div>
    </div>
    <button class="buttons" type="submit">Filtrer</button>
    <button class="buttons" @click="() => {resetFilters(); resetData()}">Effacer</button>
    <button class="buttons" @click="exportOpen = true">Exporter</button>
  </form>

  <section>
    <div class="card-container" id="indicators">
      <div id="trs" class="card">
        <h3>TRS : </h3>
        <div class="pourcentage">
          <p id="indicateurs" v-if="passage2 === true">
            <b class="nodata" v-if="affichageNull(indicateurs.TRS2passage) === 0 || affichageNull(indicateurs.TRS2passage) === '-'">Pas de données</b>
            <b v-else>{{ affichageNull(indicateurs.TRS2passage)}} %</b>
          </p>
          <p id="indicateurs" v-else>
            <b class="nodata" v-if="affichageNull(indicateurs.TRS) === 0 || affichageNull(indicateurs.TRS) === ''">Pas de données</b>
            <b v-else>{{ affichageNull(indicateurs.TRS) }} %</b>
          </p>
          <img src="../../assets/rain.gif" alt="-" v-if="indicateurs.TRS != null && imgTRS === 'nuage'">
          <img src="../../assets/sun.gif" alt="-" v-if="indicateurs.TRS != null && imgTRS === 'soleil'">
          <p id="objectifs" v-if="objectifs.TRS != null">{{ objectifs.TRS }} %</p>
        </div>
      </div>

      <div id="trg" class="card">
        <h3>TRG : </h3>
        <div class="pourcentage">
          <p id="indicateurs" v-if="passage2 === true">
            <b class="nodata" v-if="affichageNull(indicateurs.TRG2passage) === 0 || affichageNull(indicateurs.TRG2passage) === '-'">Pas de données</b>
            <b v-else>{{ affichageNull(indicateurs.TRG2passage)}} %</b>
          </p>
          <p id="indicateurs" v-else>
            <b class="nodata" v-if="affichageNull(indicateurs.TRG) === 0 || affichageNull(indicateurs.TRG) === ''">Pas de données</b>
            <b v-else>{{ affichageNull(indicateurs.TRG) }} %</b>
          </p>
          <img src="../../assets/rain.gif" alt="-" v-if="indicateurs.TRG != null && imgTRG === 'nuage'">
          <img src="../../assets/sun.gif" alt="-" v-if="indicateurs.TRG != null && imgTRG === 'soleil'">
          <p id="objectifs" v-if="objectifs.TRG != null">{{ objectifs.TRG }} %</p>
        </div>

      </div>

      <div id="tre" class="card">
        <h3>TRE : </h3>
        <div class="pourcentage">
          <p id="indicateurs" v-if="passage2 === true">
            <b class="nodata" v-if="affichageNull(indicateurs.TRE2passage) === 0 || affichageNull(indicateurs.TRE2passage) === '-'">Pas de données</b>
            <b v-else>{{ affichageNull(indicateurs.TRE2passage)}} %</b>
          </p>
          <p id="indicateurs" v-else>
            <b class="nodata" v-if="affichageNull(indicateurs.TRE) === 0 || affichageNull(indicateurs.TRE) === ''">Pas de données</b>
            <b v-else>{{ affichageNull(indicateurs.TRE) }} %</b>
          </p>
          <img src="../../assets/rain.gif" alt="-" v-if="indicateurs.TRE != null && imgTRE === 'nuage'">
          <img src="../../assets/sun.gif" alt="-" v-if="indicateurs.TRE != null  && imgTRE === 'soleil'">
          <p id="objectifs" v-if="objectifs.TRE != null">{{ objectifs.TRE }} %</p>
        </div>

      </div>
      <div id="pcs" class="card">
        <h3>Total pièces produites : </h3>
        <p id="indicateurs" v-if="passage2 === true">
          <b v-if="affichageNull(indicateurs.nbDeuxiemePassage) === 0 || affichageNull(indicateurs.nbDeuxiemePassage) === '-'">Pas de pièces</b>
          <span v-else>{{ affichageNull(indicateurs.nbDeuxiemePassage) }} pcs</span>
        </p>
        <p id="indicateurs" v-else>
          <b class="nodata" v-if="affichageNull(indicateurs.nbPieces) === 0 || affichageNull(indicateurs.nbPieces) === '-'">Pas de pièces</b>
          <span v-else>{{ affichageNull(indicateurs.nbPieces) }} pcs</span>
        </p>
      </div>
    </div>

    <div class="card-container" id="rebuts-arrets-container">
      <div id="rebuts" class="card">
        <h3>Répartition rebuts</h3>
        <div class="content">
          <div  v-for="i in 9" :key="i">
            <div id="val" v-if="computedLibellesRebuts[i-1]">
              <p id="libelle"><b>{{computedLibellesRebuts[i-1]}} : </b></p>
              <p v-if="passage2 === true" id="value"><span>{{deuxiemePassage_NC[i-1]}} pcs</span></p>
              <p v-else id="value"><span>{{NC[i-1]}} pcs</span></p>
              <p v-if="passage2 === true" id="pourcent"><span>{{Number(((100 * deuxiemePassage_NC[i-1]) / indicateurs.nbPieces).toFixed(2))}} %</span></p>
              <p v-else id="pourcent"><span>{{Number(((100 * NC[i-1]) / indicateurs.nbPieces).toFixed(2))}} %</span></p>
            </div>
          </div>
          <div id="val" class="total" v-if="computedTotal != null">
            <p id="libelle"><b>Total rebuts : </b></p>
            <p v-if="passage2 === true" id="value">{{indicateurs.nbRebutsDeuxiemePassage}} pcs</p>
            <p v-else id="value">{{indicateurs.nbRebuts}} pcs</p>
            <p v-if="passage2 === true" id="pourcent">{{Number(((100 * indicateurs.nbRebutsDeuxiemePassage) / indicateurs.nbPieces).toFixed(2))}} %</p>
            <p v-else id="pourcent">{{Number(((100 * indicateurs.nbRebuts) / indicateurs.nbPieces).toFixed(2))}} %</p>
          </div>
        </div>
      </div>
      <div id="arret" class="card">
        <h3>Répartition arrêts</h3>
        <div class="content">
          <div v-for="i in 9" :key="i">
            <div id="val" v-if="computedLibellesArrets[i-1]">
              <p id="libelle"><b>{{libellesArrets[i-1]}} : </b></p>
              <p id="nombre">{{nbArrets[i-1]}} arrêts</p>
              <p id="temps">{{secondToMinutes(tempsArrets[i-1])}} min</p>
            </div>
          </div>
          <div id="val" v-if="nbPiecesTheo">
            <p id="libelle"><b>Divers : </b></p>
            <p id="nombre"></p>
            <p id="temps">{{ diversArret }} min</p>
          </div>
          <div id="val" class="total" v-if="nbArretsTotal">
            <p id="libelle"><b>Total arrêts : </b></p>
            <p id="nombre">{{ nbArretsTotal }} arrêts</p>
            <p id="temps">{{ tempsArretsTotal }} min</p>
          </div>
        </div>
      </div>
    </div>
  </section>


</template>

<style scoped>
.nodata{
  color: #FF3C3C;
}
#filters-container{
  display: flex;
  flex-direction: row;
  gap: 1rem;
}

label {
  color: black;
}

input, select {
  border: black solid 1px;
  border-radius: 3px;
  width: 100%;
  height: 30px;
}

.buttons {
  background-color: white;
  color: black;
  padding: 7px 10px;
  margin: 5px;
  border-radius: 4px;
  border: black solid 1px;
}

.buttons:hover {
  background-color: #a8a8a8;
  color: black;
  border: black solid 1px;
}

.card-container {
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
  align-items: stretch;
  align-content: center;
  justify-content: center;
  gap: 10px;
  margin: 10px 0;
}

.card {
  border: black solid 1px;
  color: black;
  background-color: white;
  border-radius: 5px;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  align-content: center;
}

.card img {
  width: 15%;
  height: auto;
  margin: 0;
  padding: 0;
}

#indicators .card h3, #indicators .card p {
  margin: 5px;
  padding: 0;
}


#rebuts-arrets-container .card h3, #rebuts-arrets-container .card p {
  margin: 10px;
  padding: 0;
}

.content {
  width: 100%;
}

#val {
  display: grid;
  grid-template-columns: 60% 20% 20%;
  gap: 15px;
  padding: 0 0 0 10px;
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

.auth:hover {
  color: #0452c8;
  background-color: #ffffff;
}

.param {
  margin-top: 0%;
  margin-right: 1%;
  color: #000000;
  background-color: #ffffff;
  font-size: 15px;
  font-weight: bold;
  border: 1px solid #000000;
  border-radius: 6px;
  padding: 10px 20px;
  cursor: pointer
}

.param:hover {
  color: #000000;
  background-color: #a8a8a8;
}

#buttons-container {
  display: flex;
}

header {
  display: flex;
  flex-direction: row;
  align-items: center;
  align-content: center;
  justify-content: space-between;
}

.pourcentage {
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  align-content: center;
  gap: 30px;
}
</style>
