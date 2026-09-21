<script setup>
import axios from 'axios';
import FileComponent from './inputFileComponent.vue';

</script>

<script>
import {useAuthStore} from "@/store/index.js";
import {useRoute} from "vue-router";

export default {
  data() {
    return {
      categories: [],
      sectors: [],
      fileToUpload: {
        name: "",
        index: "",
        category: "",
        sector: "",
        file: null,
      },
      showPopup: false,
      store:  useAuthStore(this.$pinia)
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
    const store = useAuthStore(this.$pinia)
    this.getCategories();
    this.getSectors();
  },
  methods: {
    onFileChange(event) {
      this.fileToUpload.file = event.target.files[0];

    },
    getCategories() {
      axios.get(`${import.meta.env.VITE_API_URL}/api/categories`)
          .then((response) => {
            this.categories = response.data;
          })
          .catch((err) => {
            console.error(err);
          })
    },
    getSectors() {
      axios.get(`${import.meta.env.VITE_API_URL}/api/sectors`)
          .then((response) => {
            this.sectors = response.data;
          })
          .catch((err) => {
            console.error(err);
          })
    },
    replaceStr(str){
      str.replace(/[&\/\\#,+()$~%.'":*?<>{}é]/g,'_');
      return str;
    },
    sendData() {
      const formData = new FormData();
      //console.log(this.fileToUpload.file);
      formData.append('name', this.fileToUpload.name);
      formData.append('index', this.fileToUpload.index);
      formData.append('file', this.fileToUpload.file);
      formData.append('category', this.fileToUpload.category);
      formData.append('sector', this.fileToUpload.sector);
      formData.append('user', this.user);
      //console.log(this.user)

      axios.post(`${import.meta.env.VITE_API_URL}/api/documents`, formData)
          .then(response => {
            //this.$router.push("/")
            window.location.reload()
          })
          .catch(error => {
            console.error(error);
          });
    },
    toggle() {
      this.showPopup = !this.showPopup
      //console.log(this.user)
    },
    closePopUp() {
      this.showPopup = false
    },
  },
}
</script>

<template>
  <button class="showAll" id="upload" @click="toggle()">Uploader un document</button>

  <div class="popUp" v-if="showPopup">
    <button id="close" @click="closePopUp">X</button>

    <h2>Uploader un fichier</h2>

    <form id="uploadForm" @submit.prevent="sendData" enctype="multipart/form-data">
      <p>Nom du document : </p>
      <input v-model="fileToUpload.name" placeholder="Nom du document" required/>

      <p>Indice : </p>
      <input v-model="fileToUpload.index" placeholder="Indice du document" required/>
      <br>
      <div>
        <input type="file" @change="onFileChange" required>
      </div>

      <p>Catégorie : </p>
      <select v-model="fileToUpload.category">
        <option disabled value="" required>Choisir une catégorie</option>
        <option v-for="category in categories" :value="category.id">{{ category.name }}</option>
      </select>

      <p>Secteur : </p>
      <select v-model="fileToUpload.sector">
        <option disabled value="" required>Choisir une catégorie</option>
        <option v-for="sector in sectors" :value="sector.id">{{ sector.name }}</option>
      </select>

      <div>
        <input class="showAll" type="submit" value="Uploader ! ">
      </div>
    </form>
  </div>

</template>

<style scoped>
.showAll{
  background: #0452c8;
  border: 1.5px solid #0452c8;
  border-radius: 6px;
  height: fit-content;
  margin-top: 0%;
  margin-right: 1%;
  color: #FFFFFF;
  font-size: 15px;
  font-weight: bold;
  padding: 6px 20px;
  cursor: pointer;
  font-family: "Istok Web",serif;
}
.showAll:hover {
  background: #FFFFFF;
  color: #0452c8;
  border: 1.5px solid #0452c8;
}
#upload {
  position: absolute;
  left: 80%;
  top: 15%
}

body{
  display: flex;
  justify-content: center;
}

.popUp {
  display: flex;
  flex-direction: column;
  justify-content: center;
  z-index: 1;
  position: absolute;
  left: 30%;
  width: 35%;
  background: white;
  border-radius: 6px;
  top: 5%;
  border: #cde6fe solid 1px;
  box-shadow: 10px 10px 30px 0.5px #949494;
  text-align: center;
  padding: 16px;
  color: #000000;
}

select, textarea {
  box-sizing: border-box;
  position: relative;
  height: 30px;
  background: #FFFFFF;
  border: 1.5px solid #000000;
  border-radius: 6px;
  margin-bottom: 15px;
  margin-right: 10px;
  display: inline-block;
  font-family: "Istok Web",serif;
}

#uploadButton {
  position: relative;
  /*left: 80%;
  top: 4%;*/
  background-color: white;
  font: 95% Arial;
  color: #045FB4;
  border: solid 1px #cde6fe;
  box-shadow: 1px 1px 2px #034f96;
}

button:hover {
  color: white;
  background-color: #0452c8;
}

#uploadButton:hover {
  color: white;
  background-color: #0452c8;
}

#close {
  margin: 0% 0%;
  padding: 4px 10px;
  left: 90%;
  top: 5%;
  position: absolute;
}

#upload {
  z-index: 10;
}

#uploadForm {
  display: flex;
  flex-direction: column;
  align-content: space-between;
  justify-content: center;
}
</style>
