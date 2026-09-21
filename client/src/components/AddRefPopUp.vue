<script setup>
import {onMounted, ref} from "vue";
import axios from "axios";

const emit = defineEmits(['close', 'validate'])
function emitClose() {
  emit('close')
}
function validate() {
  emit('validate', {reference, tag})
}

let reference = ref(null)
let tag = ref(null)
let existingReferences = ref(null)

async function getRef() {
  await axios.get(`${import.meta.env.VITE_API_URL}/3D/3D-references`)
      .then((response) => {
        existingReferences.value = response.data.recordset;
        console.log(existingReferences);
      })
      .catch((err) => {
        console.error(err);
      })
}

getRef()
</script>

<template>
  <div class="overlay" @click.self="emitClose">

    <div class="modal">
      <div id="close" @click="emitClose"><img src="../assets/x.png"></div>
      <h1><b>Ajouter une référence</b></h1>
      <main class="modal-body">
        <div class="container">
          <form id="form" @submit.prevent="validate">
            <div class="form-group">
              <label for="tag">Tag RFID : </label>
              <input name="tag" type="text" v-model="tag" required/>
            </div>
            <div class="form-group">
              <label for="ref">Référence : </label>
              <input name="ref" type="text" v-model="reference" required />
            </div>
            <input id="valider" type="submit" value="Enregistrer"/>
          </form>
        </div>
        <div class="existing">
          <h3>Références existantes</h3>
          <ul>
            <li v-for="ref in existingReferences">{{ref.palette_number}} | {{ref.piece_reference}} </li>
          </ul>
        </div>
      </main>

    </div>
  </div>
</template>

<style scoped>

.existing {
  width: 59%;
  height: 100%;
  background: #f9fafb;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.existing h3 {
  margin: 0;
  padding: 12px;
  background: #eef4ff;
  border-bottom: 1px solid #ddd;
  font-size: 18px;
  font-weight: 600;
}
.existing ul {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px 20px;

  padding: 10px 20px;
  margin: 0;

  overflow-y: auto;
}
.existing li {
  margin: 0;
  padding: 4px 0;
  font-size: 14px;
}
.existing li:hover {
  background: rgba(0,0,0,0.03);
  border-radius: 4px;
  cursor: default;
}
.modal-body {
  height: 80%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.form-group {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
}
.form-group label {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 5px;
  color: #333;
}
#form {
  display: flex;
  flex-direction: column;
  gap: 20px;

  width: 100%;
  max-width: 300px;
}
.container {
  width: 40%;
  display: flex;
  justify-content: center;
  align-items: center;
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
  background: #ffffff;
  border-radius: 10px;
  width: 80%;
  min-width: 40%;
  max-width: 90%;
  height: 80%;
  font-family: 'Istok Web',serif;
  text-align: center;
}

#close {
  /*border: black solid 1px;*/
  position: relative;
  width: fit-content;
  height: fit-content;
  top: 10%;
  left: 90%;
  transform: translateY(-50%);
}
#close img{
  width: 30px;
}
.modal input, .modal textarea, .modal select {
  width: 100%;
  border: 0.5px solid black;
  border-radius: 3px
}
.modal input, .modal select {
  height: 25px;
}
.modal input:focus {
  outline: none;
  border-color: #0452c8;
  box-shadow: 0 0 0 2px rgba(74,144,226,0.2);
}
input.error {
  border-color: red;
}
input.success {
  border-color: green;
}
.modal p{
  margin: 10px;
}
#valider {
  margin-top: 10px;
  padding: 10px 15px;
  height: fit-content;

  background: #0452c8;
  color: white;

  border: none;
  border-radius: 6px;

  font-weight: 600;
  cursor: pointer;

  transition: 0.2s;
}
#valider:hover {
  background: #357abd;
}

</style>