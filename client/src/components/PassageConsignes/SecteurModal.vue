<script setup>
import {computed, defineEmits, defineProps, ref} from 'vue'

const emit = defineEmits(['close','secteur'])

function emitClose() {
  emit('close')
}
function emitSecteur(secteur) {
  emit('secteur', secteur)
}

function secteurSeleted(secteur) {
  emitSecteur(secteur)
  emitClose()
}
</script>

<template>
  <div class="overlay" @click.self="emitClose">
    <div class="modal">
      <header class="modal-header">
        <h2>Choisissez un secteur</h2>
        <div id="close" @click="emitClose"><img src="../../assets/x.png"></div>
      </header>
      <hr>
      <main class="modal-body">
        <p @click="secteurSeleted('1')" class="secteur"><b>MultiCN</b></p>
        <p @click="secteurSeleted('2')" class="secteur"><b>Assemblage/Tri</b></p>
        <p @click="secteurSeleted('3')" class="secteur"><b>Lavage Bonneville</b></p>
      </main>

    </div>
  </div>
</template>

<style scoped>
hr {
  color: #333333;
  width: 90%;
}
.secteur{
  margin: 0;
  padding: 4px 0;
  font-size: 14px;
}
.secteur:hover {
  background: rgba(0,0,0,0.03);
  border-radius: 4px;
  cursor: default;
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
  height: 70%;
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
.modal-body{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  align-content: center;
  height: 70%;
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
.modal p{
  margin: 10px;
  font-size: 17px;
}

</style>