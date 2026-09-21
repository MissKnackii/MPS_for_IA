<script setup>

import axios from "axios";
import {computed, ref} from "vue";

let machine = ref(208);
let dateDebut = ref('');
let dateFin = ref('');
let operateur = ref('');
let contexte = ref('');
let controles = ref([])
let controles30min = ref([])
let controles2h = ref([])
let controles8h = ref([])
let controlesQualite = ref([])
let evenements = ref([])
let controlesMatin = ref([])
let controlesAP = ref([])
let controlesNuit = ref([])
let operateurs = ref([])
let contextes = ref([])
let showLoading = ref(false)
let matinP = ref()
let apP = ref()
let nuitP = ref()
let controlesTheorique = ref(0)
let controlesTheoriqueMatin = ref(0)
let controlesTheoriqueAP = ref(0)
let controlesTheoriqueNuit = ref(0)

let getAllControles = async () => {
  controlesMatin.value = [];
  controlesAP.value = [];
  controlesNuit.value = [];
  controles30min.value = [];
  controles2h.value = [];
  controles8h.value = [];
  controlesQualite.value = [];
  await axios.get(`${import.meta.env.VITE_API_URL}/controles/getAllControles`,{
    params:{
      machine: machine.value,
      dateDebut: dateDebut.value.replace('T', ' '),
      dateFin: dateFin.value.replace('T', ' '),
      operateur: operateur.value,
      contexte: contexte.value,
    }
  }).then((response) => {
    console.log(response.data.recordset);
    controles.value = response.data.recordset;
    response.data.recordset.forEach((c) => {
      c.date = new Date(c.date)
      if (getEquipe(c.date) === "matin") {
        controlesMatin.value.push(c);
      } else if (getEquipe(c.date) === "ap") {
        controlesAP.value.push(c);
      } else if (getEquipe(c.date) === "nuit") {
        controlesNuit.value.push(c);
      }
    })
    if (contexte.value === ''){
      response.data.recordset.forEach((c) => {
        if (c.contexteId === 'APC 30 MN'){
          controles30min.value.push(c);
        }
        if (c.contexteId === 'APC 2H'){
          controles2h.value.push(c);
        }
        if (c.contexteId === '1 pièce / Réglage - Affûtage'){
          controles8h.value.push(c);
        }
        if (c.contexteId === '44816200-959a-4e99-b2da-02ecaa4a3f57'){
          controlesQualite.value.push(c);
        }
      })
    }
  })
}

let getAllControleurs = async () => {
  operateurs.value = [];
  await axios.get(`${import.meta.env.VITE_API_URL}/controles/getAllControles`,{
    params:{
      machine: machine.value,
      dateDebut: dateDebut.value.replace('T', ' '),
      dateFin: dateFin.value.replace('T', ' ')
    }
  }).then((response) => {
    response.data.recordset.forEach(element => {
      if (operateurs.value.indexOf(element.username) === -1) {
        operateurs.value.push(element.username)
      }
    })
  })
}
let getAllContextes = async () => {
  contextes.value = [];
  await axios.get(`${import.meta.env.VITE_API_URL}/controles/getAllControles`,{
    params:{
      machine: machine.value,
      dateDebut: dateDebut.value.replace('T', ' '),
      dateFin: dateFin.value.replace('T', ' ')
    }
  }).then((response) => {
    response.data.recordset.forEach(element => {
      if (contextes.value.indexOf(element.contexteId) === -1) {
        contextes.value.push(element.contexteId)
        console.log(element.contexteId)
      }
    })
  })
}
const getEquipe = (date) => {
  const h = date.getHours();

  if (h >= 5 && h < 13) return "matin";
  if (h >= 13 && h < 21) return "ap";
  return "nuit";
};

let getEvenementsMachine = async () => {
  showLoading.value = true;
  console.log(machine.value, dateDebut.value, dateFin.value);
  await axios.get(`${import.meta.env.VITE_API_URL}/controles/getEvenementsMachines`, {
    params:{
      machine: machine.value,
      dateDebut: dateDebut.value.replace('T', ' '),
      dateFin: dateFin.value.replace('T', ' '),
    }
  }).then((response) => {
    response.data.recordset.forEach(element => {
      element.timestamp = new Date(element.timestamp);
    });
    console.log(response.data.recordset);
    evenements.value = response.data.recordset;
  });
}
const tempsParEquipe = (evenements) => {
  let matin = 0;
  let ap = 0;
  let nuit = 0;
  let total = 0;

  const events = [...evenements].sort(
      (a,b) => a.timestamp - b.timestamp
  );

  for (let i = 0; i < events.length - 1; i++) {

    const actuel = events[i];
    const suivant = events[i + 1];

    if (!estEnMarche(actuel)) continue;

    let debut = new Date(actuel.timestamp);
    let fin = new Date(suivant.timestamp);

    while (debut < fin) {

      let limite = new Date(debut);

      const h = debut.getHours();

      if (h >= 5 && h < 13) {
        limite.setHours(13,0,0,0);
      }
      else if (h >= 13 && h < 21) {
        limite.setHours(21,0,0,0);
      }
      else {
        if (h >= 21) {
          limite.setDate(limite.getDate() + 1);
        }
        limite.setHours(5,0,0,0);
      }

      const segmentFin = limite < fin ? limite : fin;
      const diff = segmentFin - debut;
      total += diff;
      switch(getEquipe(debut)) {
        case "matin":
          matin += diff;
          break;
        case "ap":
          ap += diff;
          break;
        case "nuit":
          nuit += diff;
          break;
      }
      debut = segmentFin;
    }
  }

  return { matin, ap, nuit, total };
};

const estEnMarche = (e) => {
  return e.productionEnCours === true && e.programmeEnCours === true && e.piecesEnCoursUsinage === true;
};

const tempsEquipe = computed(() => {
  return tempsParEquipe(evenements.value);
});

const formatMs = (ms) => {

  const totalSecondes = Math.floor(ms / 1000);

  const heures = Math.floor(totalSecondes / 3600);
  const minutes = Math.floor((totalSecondes % 3600) / 60);
  const secondes = totalSecondes % 60;

  return {heures, minutes, secondes};
};

const calculControlesTheoriques = (heures, minutes, secondes, contexte) => {
  let theoriques = 0;
  //console.log(contexte);
  if (contexte === 'APC 30 MN'){
    theoriques = Math.floor((heures * 60 + minutes) / 30);
  }
  if (contexte === 'APC 2H'){
    theoriques = Math.floor(heures / 2);
  }
  if (contexte === '1 pièce / Réglage - Affûtage'){
    theoriques = Math.floor(heures / 8);
  }
  if(contexte === ''){
    theoriques = {
      apc30min: Math.floor((heures * 60 + minutes) / 30),
      apc2H: Math.floor(heures / 2),
      apc8H: Math.floor(heures / 8),
      apcQualite: Math.floor(heures / 8),

    };
  }
  showLoading.value = false;
  return theoriques;
}
const pourcentageMatin = computed(() => {
  return Math.floor(
      (controlesMatin.value.length /
          calculControlesTheoriques(
              formatMs(tempsEquipe.value.matin).heures,
              formatMs(tempsEquipe.value.matin).minutes,
              formatMs(tempsEquipe.value.matin).secondes,
              contexte.value
          )
      ) * 100
  );
});
const pourcentageAP = computed(() => {
  return  Math.floor(
      (controlesAP.value.length /
          calculControlesTheoriques(
              formatMs(tempsEquipe.value.ap).heures,
              formatMs(tempsEquipe.value.ap).minutes,
              formatMs(tempsEquipe.value.ap).secondes,
              contexte.value
          )
      ) * 100
  );
});
const pourcentageNuit = computed(() => {
  return Math.floor(
      (controlesNuit.value.length /
          calculControlesTheoriques(
              formatMs(tempsEquipe.value.nuit).heures,
              formatMs(tempsEquipe.value.nuit).minutes,
              formatMs(tempsEquipe.value.nuit).secondes,
              contexte.value
          )
      ) * 100
  );
});

const pourcentage30min = computed(() => {
  return Math.floor(
      (controles30min.value.length /
          calculControlesTheoriques(
              productionTotal.value.heures,
              productionTotal.value.minutes,
              productionTotal.value.secondes,
              contexte.value).apc30min
      ) * 100
  );
});
const pourcentage2h = computed(() => {
  return Math.floor(
      (controles2h.value.length /
          calculControlesTheoriques(
              productionTotal.value.heures,
              productionTotal.value.minutes,
              productionTotal.value.secondes,
              contexte.value).apc2H
      ) * 100
  );
});
const pourcentage8h = computed(() => {
  return Math.floor(
      (controles8h.value.length /
          calculControlesTheoriques(
              productionTotal.value.heures,
              productionTotal.value.minutes,
              productionTotal.value.secondes,
              contexte.value).apc8H
      ) * 100
  );
});
const pourcentageQualite = computed(() => {
  return Math.floor(
      (controlesQualite.value.length /
          calculControlesTheoriques(
              productionTotal.value.heures,
              productionTotal.value.minutes,
              productionTotal.value.secondes,
              contexte.value).apcQualite
      ) * 100
  );
});

const productionMatin = computed(() => {
  return formatMs(tempsEquipe.value.matin)
})
const productionAP = computed(() => {
  return formatMs(tempsEquipe.value.ap)
})
const productionNuit = computed(() => {
  return formatMs(tempsEquipe.value.nuit)
})
const productionTotal = computed(() => {
  return formatMs(tempsEquipe.value.total)
})
const color = (number) => {
  if (number >= 75) {
    return 'green';
  }
  else {
    return 'red';
  }
}

const formatDate = (date) => {
  if (!date) return ''

  return `${date.getDate()}/${
      date.getMonth() + 1
  }/${date.getFullYear()} ${
      date.getHours()
  }:${date.getMinutes()}:${date.getSeconds()}`
}
</script>
<template>
  <h1>Suivi des contrôles</h1>
  <div>
    <form id="" @submit.prevent="() => {getEvenementsMachine(); getAllControles(); getAllControleurs()}">
      <div class="form-input">
        <div id="filters-container">
          <div>
            <label for="dateDebut">Date début :</label>
            <br>
            <input type="datetime-local" id="dateDebut" name="dateDebut" v-model="dateDebut"/>
          </div>
          <div>
            <label for="dateFin">Date Fin</label>
            <br>
            <input type="datetime-local" id="dateFin" name="dateFin" v-model="dateFin" @change="() => {getEvenementsMachine(); getAllControles();}"/>
          </div>
          <div>
            <label for="operateur">Opérateur</label>
            <br>
            <select @click="getAllControleurs()" v-model="operateur" id="operateur" name="operateur">
              <option selected value="">--Choisissez une option--</option>
              <option v-for="o in operateurs" :value="o">{{o}}</option>
            </select>
          </div>
          <div>
            <label for="contexte">Contexte</label>
            <br>
            <select @click="getAllContextes()" v-model="contexte" id="contexte" name="contexte">
              <option selected value="">--Choisissez une option--</option>
              <option v-for="c in contextes" :value="c">{{c}}</option>
            </select>
          </div>
        </div>
        <input type="submit" value="Chercher"/>
      </div>
    </form>
  </div>
  <div class="stats">
    <div id="prodTime" :class="color(100)" v-if="productionTotal.heures !== 0 && productionTotal.minutes !== 0 &&  productionTotal.secondes !== 0">
      <p>Temps de production: <b>{{productionTotal.heures}}h {{productionTotal.minutes}}min {{productionTotal.secondes}}s </b></p>
    </div>
    <div id="theorique-container">
      <div id="theorique" :class="color(pourcentageMatin)" v-if="Number.isFinite(pourcentageMatin) && pourcentageMatin !== 0">
        <p><b id="theorique-stat">{{ controlesMatin.length }}</b> contrôles réalisés /<b id="theorique-stat">{{ calculControlesTheoriques(productionMatin.heures, productionMatin.minutes, productionMatin.secondes, contexte) }}</b>théoriques</p>
        <p><b id="theorique-stat">{{pourcentageMatin}}%</b> réalisés</p>
        <p>Temps de production Matin : <b>{{productionMatin.heures}}h {{productionMatin.minutes}}min {{productionMatin.secondes}}s </b></p>
      </div>
      <div id="theorique" :class="color(pourcentageAP)" v-if="Number.isFinite(pourcentageAP) && pourcentageAP !== 0">
        <p><b id="theorique-stat">{{ controlesAP.length }}</b> contrôles réalisés /<b id="theorique-stat">{{ calculControlesTheoriques(productionAP.heures, productionAP.minutes, productionAP.secondes, contexte) }}</b>théoriques</p>
        <p><b id="theorique-stat">{{pourcentageAP}}%</b> réalisés</p>
        <p>Temps de production Après-Midi : <b>{{productionAP.heures}}h {{productionAP.minutes}}min {{productionAP.secondes}}s </b></p>
      </div>
      <div id="theorique" :class="color(pourcentageNuit)" v-if="Number.isFinite(pourcentageNuit) && pourcentageNuit !== 0">
        <p><b id="theorique-stat">{{ controlesNuit.length }}</b> contrôles réalisés /<b id="theorique-stat">{{ calculControlesTheoriques(productionNuit.heures, productionNuit.minutes, productionNuit.secondes, contexte) }}</b>théoriques</p>
        <p><b id="theorique-stat">{{pourcentageNuit}}%</b> réalisés</p>
        <p>Temps de production Nuit : <b>{{productionNuit.heures}}h {{productionNuit.minutes}}min {{productionNuit.secondes}}s </b></p>
      </div>
    </div>
    <div id="theorique-container">
      <div id="theorique" :class="color(pourcentage30min)" v-if="Number.isFinite(pourcentage30min) && pourcentage30min !== 0">
        <p><b>APC 30min</b></p>
        <p><b id="theorique-stat">{{pourcentage30min}}%</b> réalisés</p>
        <p><b id="theorique-stat">{{ controles30min.length }}</b> contrôles réalisés /<b id="theorique-stat">{{ calculControlesTheoriques(productionTotal.heures, productionTotal.minutes, productionTotal.secondes, contexte).apc30min }}</b>théoriques</p>
      </div>
      <div id="theorique" :class="color(pourcentage2h)" v-if="Number.isFinite(pourcentage2h) && pourcentage2h !== 0" >
        <p><b>APC 2h</b></p>
        <p><b id="theorique-stat">{{pourcentage2h}}%</b> réalisés</p>
        <p><b id="theorique-stat">{{ controles2h.length }}</b> contrôles réalisés /<b id="theorique-stat">{{ calculControlesTheoriques(productionTotal.heures, productionTotal.minutes, productionTotal.secondes, contexte).apc2H }}</b>théoriques</p>
      </div>
      <div id="theorique" :class="color(pourcentage8h)" v-if="Number.isFinite(pourcentage8h) && pourcentage8h !== 0">
        <p><b>1 pièce / Réglage - Affûtage</b></p>
        <p><b id="theorique-stat">{{pourcentage8h}}%</b> réalisés</p>
        <p><b id="theorique-stat">{{ controles8h.length }}</b> contrôles réalisés /<b id="theorique-stat">{{ calculControlesTheoriques(productionTotal.heures, productionTotal.minutes, productionTotal.secondes, contexte).apc8H }}</b>théoriques</p>
      </div>
      <div id="theorique" :class="color(pourcentageQualite)" v-if="Number.isFinite(pourcentageQualite) && pourcentageQualite !== 0">
        <p><b>Mesures Qulité</b></p>
        <p><b id="theorique-stat">{{pourcentageQualite}}%</b> réalisés</p>
        <p><b id="theorique-stat">{{ controlesQualite.length }}</b> contrôles réalisés /<b id="theorique-stat">{{ calculControlesTheoriques(productionTotal.heures, productionTotal.minutes, productionTotal.secondes, contexte).apcQualite }}</b>théoriques</p>
      </div>
    </div>
  </div>
  <p v-if="showLoading">Calcul du temps de production...</p>
  <table>
    <thead>
    <tr>
      <th scope="col">Matin</th>
      <th scope="col">Après-midi</th>
      <th scope="col">Nuit</th>
    </tr>
    </thead>
    <tbody>
    <tr
        v-for="index in Math.max(
          controlesMatin.length,
          controlesAP.length,
          controlesNuit.length
        )"
        :key="index"
    >
      <td>
        <b>{{ controlesMatin[index - 1]?.username || '' }}</b>
        - {{ formatDate(controlesMatin[index - 1]?.date) }}
        - {{ controlesMatin[index - 1]?.pieceId || '' }}
        <p>{{ controlesMatin[index - 1]?.contexteId || '' }}</p>
      </td>

      <td>
        <b>{{ controlesAP[index - 1]?.username || '' }}</b>
        - {{ formatDate(controlesAP[index - 1]?.date) }}
        - {{ controlesAP[index - 1]?.pieceId || '' }}
        <p>{{ controlesAP[index - 1]?.contexteId || '' }}</p>
      </td>

      <td>
        <b>{{ controlesNuit[index - 1]?.username || '' }}</b>
        - {{ formatDate(controlesNuit[index - 1]?.date) }}
        - {{ controlesNuit[index - 1]?.pieceId || '' }}
        <p>{{ controlesNuit[index - 1]?.contexteId || '' }}</p>
      </td>
    </tr>
    </tbody>
  </table>
<!--  <ul>
    <li v-for="c in controles">
    <p><b>{{c.pieceId}}</b></p>
    <p>{{c.machineId}}</p>
    <p>{{c.contexteId}}</p>
    <p>{{new Date(c.date).toUTCString()}}</p>
    <p>{{c.username}}</p>
    </li>
  </ul>-->
</template>
<style scoped>
p{
  color: black;
}
#filters-container{
  display: flex;
  flex-direction: row;
  gap: 1rem;
}
.form-input{
  width: 100%;
  gap: 10px;
  display: flex;
  align-items: center;
}
label{
  color: black;
}
input select{
  border: black solid 1px;
  border-radius: 3px;
  width: 100%;
  height: 25px;
}
.stats{
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
}
#theorique{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}
#prodTime{
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.green{
  border: 2px solid #56dca7;
  background-color: #e3fff7;
}

.red{
  border: 2px solid #ff6b6b;
  background-color: #ffe3e3;
}

#theorique-stat{
  font-size: 25px;
  margin: 5px;
}
#theorique, p{
  font-size: 14px;
  margin: 5px;
}
#theorique-container{
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  width: 100%;
  height: 50%;
}

table {
  border-collapse: collapse;
  border: 2px solid rgb(140 140 140);
  font-family: sans-serif;
  font-size: 0.8rem;
  letter-spacing: 1px;
  justify-self: center;
  width: 100%;
  color: black;
}

thead{
  background-color: white;
}

th,
td {
  border: 1px solid rgb(160 160 160);
  padding: 8px 10px;
  text-align: center;
}

tbody > tr:nth-of-type(even) {
  background-color: white;
}

select, textarea, input {
  background-color: white;
  color: rgba(0, 0, 0, 1);
  border: solid 1px #000000;
  border-radius: 3px;
  height: 30px;
}
</style>