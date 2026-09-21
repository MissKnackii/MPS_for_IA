<template>
  <div
      class="card"
      @click="$emit('open', consigne)"
  >
    <div id="card-header" :style="cardClass">
      <div id="card-status">
        <span id="status">{{ statusLabel }} | {{consigne.typeAction}} | {{formatedDate(consigne.dateCreation)}}</span>
        <img id="chevron" src="../../assets/maximize.svg" alt="">
      </div>
    </div>
    <div class="card-body">
      <div class="chevron-container"># Machine {{ consigne.numMachine }} - {{consigne.origine}} - {{consigne.sectionMachine}}</div>
      <div><b>Référence : </b>{{ consigne.reference }}</div>
      <div><b>Origine : </b><span>{{ consigne.origine }}</span></div>
      <div>Demande de <b>{{ consigne.demandeur }}</b> à <b>{{ consigne.destinataire }}</b></div>
      <div class="chat-container" id="demande">
        <div class="container">
          <img src="../../assets/edit-3.svg" alt="">
          <b>Demande : </b>
        </div>
        <p>{{consigne.demande}}</p>
      </div>
      <div class="chat-container" id="reponse">
        <div class="container">
          <img src="../../assets/message-square.svg" alt="">
          <b>Réponse : </b>
        </div>
        <p v-if="consigne.reponse === 'null'">Pas encore de réponse</p>
        <p v-else>{{consigne.reponse}}</p>

      </div>
  <!--
      <div id="dates">{{ formatedDate(consigne.dateDebut)  }} → {{ formatedDate(consigne.dateFin) }}</div>
-->
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  consigne: {
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
  switch (props.consigne.etat) {
    case 'En cours':
      return 'background-color: #FFB020'
    case 'Soldée':
      return 'background-color: #66E0AF'
  }
})

const formatedDate = (date) => {
  let date1 = new Date(date)
  return `${date1.getDate()}-${date1.getMonth() + 1}-${date1.getFullYear()}`
}

const statusLabel = computed(() => {
  switch (props.consigne.etat) {
    case 'En cours':
      return ' EN COURS'
    case 'Soldée':
      return ' SOLDÉE'

  }
})
</script>

<style scoped>

.card{
  width: 30%;
  min-height: 300px;
  background: #FFFFFF;
  border-radius: 9px;
  font-family: 'Istok Web',serif;
  color: black;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
}
#demande{
  border-radius: 15px 15px 0 15px;
}
#reponse{
  border-radius: 15px 15px 15px 0;
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

#card-status{
  display: flex;
  margin-left: 20px;
  color: white;
  width: 100%;
}

#card-status span{
  //border: black solid 1px;
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

.container{
  display: flex;
  flex-direction: row;
  align-items: center;
  align-content: center;
  gap: 10px;
}

.chat-container{
  border: 1px solid #000000;
  border-radius: 6px;
  margin: 5px;
  padding: 5px;
  background-color: #F8F8F8;


}.chat-container p{
  margin: 0;
  padding:0;
}
</style>