<template>
  <analytique-modal
      v-if="showAnalytique"
      @close="showAnalytique = false"
      @analytique="onSelectAnalytique"
  />
  <HeuremachinesModal
        v-if="showHeuresMachines"
        @close="showHeuresMachines = false"
  />

  <div id="filters">
    <h1>Maintenance Préventive</h1>
    <Filters
        v-if="this.moyens"
        :moyens="this.moyens"
        :analytique="this.selectedAnalytique"
        @filter="filtrer"
        @period-change="updatePeriode"
        @close-heures-machines="showHeuresMachines = true"
        @close-gammes="showGammes = true"
    />
  </div>
  <div id="cards">
    <Card
        v-for="item in maintenance"
        :key="item.id"
        :maintenance="item"
        @open="openModal"
    />
    <!--<transition name="popup">-->
    <DetailModal
        v-if="selectedMaintenance"
        :maintenance="selectedMaintenance"
        @close="selectedMaintenance = null"
        @validate="updateOperation($event)"
        :maintenanceToEdit="editedMaintenance"
    />

    <!--</transition>-->
  </div>
</template>
<script>

import {useAuthStore} from "@/store/index.js";
import Filters from "@/components/Maintenance/Filters.vue";
import Card from "@/components/Maintenance/Card.vue";
import {ref} from "vue";
import DetailModal from "@/components/Maintenance/DetailModal.vue";
import axios from "axios";
import MachinesArretModal from "@/components/Maintenance/Niv2/MachinesArretModal.vue";
import router from "@/router/index.js";
import AnalytiqueModal from "@/components/Maintenance/AnalytiqueModal.vue";
import HeuremachinesModal from "@/components/Maintenance/HeuremachinesModal.vue";
import GammePopUp from "@/components/Maintenance/Niv2/GammePopUp.vue";

export default {
  components: {
    GammePopUp,
    HeuremachinesModal,
    AnalytiqueModal,
    MachinesArretModal,
    DetailModal,
    Card,
    Filters
  },
  data() {
    return {
      currentDate: new Date(),
      currentView: 'week',
      year: null,
      month: null,
      week: null,
      selectedMaintenance: null,
      editedMaintenance: null,
      maintenance: [],
      showAnalytique:true,
      showHeuresMachines:false,
      showGammes:false,
      analytique:null,
      moyens:null,
      selectedAnalytique:null,
      lastFiltres: null
    }
  },

  computed: {
    store() {
      return useAuthStore()
    },
    user() {
      return this.store.user
    }
  },

  created() {
    this.getMoyens()
  },

  methods: {
    onSelectAnalytique(codeAnalytique) {
      //console.log(codeAnalytique)
      this.selectedAnalytique = codeAnalytique
      this.filtrer({}, codeAnalytique)
      //console.log(codeAnalytique)
    },
    getMoyens(analytique, sousSecteur) {
      if (!analytique) {
        analytique = null
      }
      if (!sousSecteur) {
        sousSecteur = null
      }
      fetch(`${import.meta.env.VITE_API_URL}/maintenance/allMoyens?analytique=${analytique}&sousSecteur=${sousSecteur}`, {
        method: 'GET',
      })
          .then(res => res.json())
          .then(data => {
            this.moyens = data;
            //console.log(data);
          })
          .catch(err => console.error(err));
    },
    updateOperation(data) {
      const isReset = data.action === "reinitialiser"

      if (isReset && !data.refOperation) return
      if (!isReset && (data.action === null || data.visa === null)) {
        if (data.action === null) {
          window.alert("Vous devez choisir une action.")
        } else {
          window.alert("Veuillez renseigner un visa.")
        }
        return
      }
      if (!data.refOperation) return

      fetch(`${import.meta.env.VITE_API_URL}/maintenance/updateOperation?refOperation=${data.refOperation}&action=${data.action}&visa=${data.visa}&commentaires=${data.commentaire}&dateDebut=${data.dateDebut}&dateFin=${data.dateFin}`, {
        method: 'GET',
      })
          .then(res => res.json())
          .then(() => {
            // On ferme la carte
            this.selectedMaintenance = null
            // On recharge UNIQUEMENT les données, avec les filtres déjà en place
            if (this.lastFiltres) {
              this.filtrer({ ...this.lastFiltres })
            } else {
              this.filtrer()
            }
          })
          .catch(err => console.error(err))
    },
    // updateOperation(data) {
    //   // console.log(data.commentaire)
    //   if (data.action === "reinitialiser") {
    //     if (data.refOperation) {
    //       fetch(`${import.meta.env.VITE_API_URL}/maintenance/updateOperation?refOperation=${data.refOperation}&action=${data.action}&visa=${data.visa}&commentaires=${data.commentaire}&dateDebut=${data.dateDebut}&dateFin=${data.dateFin}`, {
    //         method: 'GET',
    //       })
    //           .then(res => res.json())
    //           .then(data => {
    //             console.log('close popup')
    //             this.selectedMaintenance = null
    //             window.location.reload();
    //           })
    //           .catch(err => console.error(err));
    //     }
    //   } else {
    //     if (data.action === null || data.visa === null) {
    //       if (data.action === null) {
    //         window.alert("Vous devez choisir une action.");
    //         //this.seenPopup = true;
    //       } else if (data.visa === null) {
    //         window.alert("Veuillez renseigner un visa.");
    //         //this.seenPopup = true;
    //       } else if (data.action === null || data.visa === null) {
    //         window.alert("Veuillez remplir le formulaire.");
    //         //this.seenPopup = true;
    //       }
    //     } else {
    //       if (data.refOperation) {
    //         fetch(`${import.meta.env.VITE_API_URL}/maintenance/updateOperation?refOperation=${data.refOperation}&action=${data.action}&visa=${data.visa}&commentaires=${data.commentaire}&dateDebut=${data.dateDebut}&dateFin=${data.dateFin}`, {
    //           method: 'GET',
    //         })
    //             .then(res => res.json())
    //             .then(data => {
    //               console.log('close popup')
    //               this.selectedMaintenance = null
    //               window.location.reload();
    //             })
    //             .catch(err => console.error(err));
    //       }
    //     }
    //   }
    // },
    updatePeriode(info) {
      this.currentView = info.view
      this.year = info.year
      this.month = info.month
      this.weekStart = info.weekStart
      this.weekEnd = info.weekEnd
    },
    openModal(item) {
      this.selectedMaintenance = item
      //console.log(this.selectedMaintenance)
    },

    getWeekRange(date = new Date()) {
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
    },

    filtrer(filtres = {}, codeAnalytique = null) {
      // console.log(filtres)
      filtres.niveau = 1
      if (codeAnalytique) {
        this.analytique = codeAnalytique
        filtres.analytique = codeAnalytique
        filtres.view = 'week'
      }
      //console.log("VIEW =", filtres)

      if (filtres.view === 'week') {
        const { firstday, lastday } = this.getWeekRange(filtres.date)
        filtres.periode = 'semaine'
        filtres.firstday = firstday
        filtres.lastday = lastday
      }
      else if (filtres.view === 'month') {
        filtres.periode = 'mois'
        filtres.annee = filtres.year
        filtres.mois = filtres.month + 1
      }
      else if (filtres.view === 'year') {
        filtres.periode = 'annee'
        filtres.annee = filtres.year
      }
      else {
        const today = new Date()
        filtres.periode = 'semaine'
        filtres.date = today.toISOString().split('T')[0]
      }
      Object.keys(filtres).forEach(key => {
        if (
            filtres[key] === null ||
            filtres[key] === undefined ||
            filtres[key] === '' ||
            filtres[key] === 'null'
        ) {
          delete filtres[key]
        }
      })

      this.lastFiltres = { ...filtres }

      //console.log("FILTRES =", JSON.stringify(filtres))
      const params = new URLSearchParams(filtres).toString()
      //console.log(params)
      // 4️⃣ Appeler le backend
      /**/
      fetch(`${import.meta.env.VITE_API_URL}/maintenance/filtrer?${params}`)
        .then(res => {
          if (!res.ok) throw new Error(`Erreur HTTP ${res.status}`)
          return res.json()
        })
        .then(data => {
          //console.log('🔍 Résultat du filtrage :', data)
          this.maintenance = data
        })
        .catch(err => console.error('Erreur filtrer() :', err))
    },
  },
}

</script>
<style scoped>

h1{
  margin-top: 10px;
  font-family: 'Istok Web',serif;
  font-weight: bold;
  color: #000000;
}

#cards{
  display: flex;
  flex-direction: row;
  align-items: center;
  align-content: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 20px;
}
#filters{
    position: sticky;
    top: 0;
    z-index: 30;
    z-index: 29;
    background: #F8F8F8;
}
</style>
