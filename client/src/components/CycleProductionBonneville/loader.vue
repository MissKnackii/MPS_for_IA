<script setup>
import {defineEmits} from 'vue'

const emit = defineEmits(['close'])

function emitClose() {
  emit('close')
}

</script>

<template>
  <div class="overlay">
    <img src="../../assets/forklift-nobg.gif" alt="">
    <h2>Chargement...</h2>
  </div>
</template>

<style scoped>
.overlay {
  position: fixed;
  top: 0; left: 0;
  width: 100vw; height: 100vh;
  background: rgba(0,0,0,0.5);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 50;
}

.overlay img{
  width: 10%;
}
.overlay h2{
  margin: 0;
  padding: 0;
  color: #FFB020;
}
</style>