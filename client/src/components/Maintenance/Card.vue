<template>
  <div
      class="card"
      @click="$emit('open', maintenance)"
  >
    <div id="card-header" :style="cardClass">
      <div id="card-status">
        <img id="statusimg" :src="cardNiv" alt="">
        <span id="status">{{ statusLabel }} - {{maintenance.periodicite}}</span>
        <img id="chevron" src="../../assets/maximize.svg" alt="">
      </div>
    </div>
    <div class="card-body">
      <div class="chevron-container"># Machine {{ maintenance.moyenCode }}</div>

      <div> <b>{{ maintenance.libelle }}</b></div>
      <div id="dates">{{ formatedDate(maintenance.dateDebut)  }} → {{ formatedDate(maintenance.dateFin) }}</div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  maintenance: {
    type: Object,
    required: true,
  }
})

const capitalize = (str, lowerRest = false) => {
  const [first, ...rest] = str;
  return (
      first.toUpperCase() +
      (lowerRest ? rest.join("").toLowerCase() : rest.join(""))
  );
};

const cardClass = computed(() => {
  switch (props.maintenance.etatOperation) {
    case 'en retard':
      return 'background-color: #FF7466'
    case 'validée':
      return 'background-color: #66E0AF'
    case 'annulée':
      return 'background-color: #D1D1D1'
    default:
      return 'background-color: #87B6FD'
  }
})

const formatedDate = (date) => {
  let date1 = new Date(date)
  return `${date1.getDate()}-${date1.getMonth() + 1}-${date1.getFullYear()}`
}

const statusLabel = computed(() => {
  switch (props.maintenance.etatOperation) {
    case 'en retard':
      return ' EN RETARD'
    case 'validée':
      return ' VALIDÉE'
    case 'annulée':
      return ' ANNULÉE'
    default:
      return ' A FAIRE'
  }
})

const cardNiv = computed(() => {
  switch (props.maintenance.niveau) {
    case 2:
      return new URL(`../../assets/niv2-icon.svg`, import.meta.url).href
    default:
      return new URL(`../../assets/niv1-icon.svg`, import.meta.url).href
  }
})
</script>

<style scoped>

.card{
  width: 20%;
  height: 138px;
  background: #FFFFFF;
  border-radius: 9px;
  font-family: 'Istok Web',serif;
  color: black;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
}

#card-header {
  position: relative;
  width: 100%;
  height: 35px;
  border-radius: 9px 9px 0 0;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 5px;
}

b{
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

#card-status{
  display: flex;
  margin-left: 20px;
  color: white;
  width: 100%;
}

#card-status span{
  /* border: black solid 1px; */
  margin-left: 20px;
  font-size: 13px;
  width: 75%;
}

#card-header img{
  width: 22px;
  height: 22px;
}

.card-body{
  display: flex;
  flex-direction: column;
  padding: 5px;
  font-size: 14px;
}

#chevron{
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 22px;
  height: 22px;
}
#statusimg{
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
}

#dates{
  margin-top: 10px;
}

.chevron-container{
  display: flex;
  justify-content: space-between;
}
</style>