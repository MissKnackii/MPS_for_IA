<script setup>
const emit = defineEmits(['close'])
function emitClose() {
  emit('close')
}

</script>

<template>
  <div class="overlay" @click.self="emitClose">

    <div class="modal">
      <div id="close" @click="emitClose"><img src="../assets/x.png"></div>
      <main class="modal-body">
        <div class="container">
          <img src="../assets/alert-triangle.svg">
          <div>
            <h1><b>ERREUR POSITION_TYPE.</b></h1>
            <p><b>Contactez le service informatique</b></p>
          </div>

          <img src="../assets/alert-triangle.svg">
        </div>

      </main>

    </div>
  </div>
</template>

<style scoped>

.container {
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  align-content: center;
}
.container img{
  width: 20%;

}
h1{
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
  background: #ffb9b9;
  border-radius: 10px;
  border: 3px solid #ff2828;
  width: fit-content;
  min-width: 40%;
  max-width: 90%;
  height: 30%;
  font-family: 'Istok Web',serif;
  color: #ff2828;
  text-align: center;
}

#close {
  position: relative;
  top: 30px;
  right: -220px;
  transform: translateY(-50%);
}
#close img{
  width: 30px;
}
</style>