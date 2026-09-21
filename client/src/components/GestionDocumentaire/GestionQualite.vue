<script>
import axios from 'axios';
import FileComponent from './inputFileComponent.vue';
import SearchBarComponent from './SearchBarComponent.vue'
import {useAuthStore} from "@/store/index.js";
import UploadDocument from "@/components/GestionDocumentaire/UploadDocument.vue";


export default {
  components: {
    FileComponent,
    SearchBarComponent,
    UploadDocument,
  },
  data() {
    return {
      input: this.$refs.fileInput,
      documents: [],
      sectors: [],
      categories: [],
      fileToEdit: {
        name: "",
        index: "",
        category: "",
        sector: "",
        file: null,
      },
      editedFile: {},


      results: [],
      queryResult: [],
      searchResults: [],
      currentClickedId:"",
      currentclickedNom:"",
      currentclickedLien:null,
      currentclickedCategorie:"",
      currentclickedSecteur:"",

      editNom: "",
      editIndex: "",
      editLien: "",
      editCategorie: "",
      editSecteur: "",
      showPopup: false,
      showResults: false,
      sortByDate:false,
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
    this.getAllDocuments();
    this.getCategories();
    this.getSectors();
    //console.log(this.searchResults);
    this.checkAuth()
    //console.log(this.user)

  },
  methods: {
    checkAuth(){
      this.store.setDisplay('QualitéResp')
      //this.store.token = ""
      this.store.checkTokenExpiration()
      axios.post(`${import.meta.env.VITE_API_URL}/auth/check-access/qualite`, { token: this.store.token, groups: this.store.groups})
          .then(response => {
            //console.log(response.data)
            this.store.display = response.data
            this.$router.push({ name: 'Gestionqualite' })
          })
          .catch(error => {
            console.error(error);
            if (error.status === 401) {
              this.$router.push('/login');
              this.error = true;
            }
            if (error.status === 403) {
              window.alert("Vous n'avez pas les autorisations nessessaires pour acceder a cette page. ");
              this.$router.push('/uploadDoc');
              this.error = true;
            }
          })
    },
    onFileChange(event) {
      this.editedFile.path = event.target.files[0];
      //console.log(event.target.files[0]);
    },
    getAllDocuments(){
      axios.get(`${import.meta.env.VITE_API_URL}/api/documents`)
          .then((response) => {
            this.documents = response.data;
          })
          .catch((err) => {
            console.error(err);
          })
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
    affichageDatetime: function(date) {
      function pad(s) { return (s < 10) ? '0' + s : s; }
      var d = new Date(date);
      let dateFormed = [pad(d.getUTCDate()), pad(d.getUTCMonth()+1), d.getUTCFullYear()].join('-') + " " +[pad(d.getUTCHours()), pad(d.getUTCMinutes())].join(':');

      return dateFormed;
    },

    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }).replace(',', '');
    },
    deleteDocument(id, path, name) {
      if (confirm(`Êtes-vous sûr de vouloir supprimer le fichier ${name} ?`)) {
        axios.delete(`${import.meta.env.VITE_API_URL}/api/document`, {
          data: {
            id: id,
            path: path
          }
        })
            .then(response => {
              window.alert('Document supprimé avec succès: ', response.data);

              this.documents = this.documents.filter(doc => doc.id !== id);
            })
            .catch(error => {
              window.alert('Erreur lors de la suppression du document:', error);
            })
      }
    },
    updateBDD() {
      let categoryId = this.categories.find((element) => element.name === this.editedFile.category)
      let sectorId = this.sectors.find((element) => element.name === this.editedFile.sector)

      const formData = new FormData();
      formData.append('id', this.editedFile.id);
      formData.append('index', this.editedFile.index);
      formData.append('name', this.editedFile.name);
      formData.append('file', this.editedFile.path);
      formData.append('user', this.user);
      //console.log(this.editedFile.path);
      if (typeof this.editedFile.category === 'string') {
        formData.append('category', categoryId.id);
      } else {
        formData.append('category', this.editedFile.category);
      }

      if (typeof this.editedFile.sector === 'string') {
        formData.append('sector', sectorId.id);
      } else {
        formData.append('sector', this.editedFile.sector);
      }
      //console.log(formData);
      axios.put(`${import.meta.env.VITE_API_URL}/api/document`, formData)
          .then(response => {
            alert(response.data);
            window.location.reload();
          })
          .catch(error => {
            console.error(error);
          })
    },

    toggle() {
      this.showPopup = !this.showPopup
    },
    closePopUp(){
      this.showPopup = false
    },
    editDocument(result) {
      this.fileToEdit = result;
      this.editedFile = this.fileToEdit;
    },
    onSearchComplete(searchResults) {
      this.searchResults = searchResults;
      this.showResults = true;

    },
    sortAction(){
      const orderedQueryResults = this.documents.sort((a, b) => {
        const dateA = new Date(a.uploadDate);
        const dateB = new Date(b.uploadDate);
        if (dateA < dateB) {
          return 1;
        }
        if (dateA > dateB) {
          return -1;
        }
        return 0;
      });
      const orderedSearchResults = this.searchResults.sort((a, b) => {
        const dateA = new Date(a.uploadDate);
        const dateB = new Date(b.uploadDate);
        if (dateA < dateB) {
          return 1;
        }
        if (dateA > dateB) {
          return -1;
        }
        return 0;
      });
      if (this.sortByDate) {
        this.queryResult = orderedQueryResults
        this.searchResults = orderedSearchResults
      }else if (this.sortByDate === false){
        this.queryResult.sort((a, b) => {
          const valA = a.name;
          const valB = b.name;
          if (valA < valB) {
            return -1;
          }
          if (valA > valB) {
            return 1;
          }
          return 0;
        });
        this.searchResults.sort((a, b) => {
          const valA = a.name;
          const valB = b.name;
          if (valA < valB) {
            return -1;
          }
          if (valA > valB) {
            return 1;
          }
          return 0;
        });
      }
    },
    replaceStr(str){
      str.replace(/[&\/\\#,+()$~%.'":*?<>{}é]/g,'_');;
      return str;
    },
  },
}
</script>

<template>
  <br>
  <h1>Base documentaire</h1>
  <div id="searchBar">
    <SearchBarComponent @search-complete="onSearchComplete"/>
    <button class="showAll" @click="showResults = false">Afficher Tout</button>
    <button class="showAll" v-if="sortByDate === false" @click="() => {sortByDate = !sortByDate; sortAction()}"> Trier par date d'ajout</button>
    <button class="showAll" v-if="sortByDate" @click="() => {sortByDate = false; sortAction()}"> Trier par ordre alphabetique</button>
  </div>
  <UploadDocument/>
  <div id="searchResults" v-show="showResults">
    <div id="results">
      <table>
        <thead>
        <tr>
          <th>Nom document</th>
          <th>Indice</th>
          <th>Catégorie</th>
          <th>Secteur</th>
          <th>Date d'upload</th>
          <th></th>
          <th>Dernière modification</th>
          <th>Utilisateur</th>

        </tr>
        </thead>
        <tbody>
        <tr v-for="searchresult in searchResults" :key="searchresult.id">
          <td><a v-bind:href="''.concat(searchresult.path)" target="_blank" >{{ searchresult.name}}</a></td>
          <td>{{ searchresult.index }}</td>
          <td>{{ searchresult.category }}</td>
          <td>{{ searchresult.sector }}</td>
          <td>{{ affichageDatetime(searchresult.uploadDate) }}</td>
          <td><button class="butt" v-on:click="editDocument(searchresult); toggle();">Modifier</button><button class="butt" v-on:click="deleteDocument(searchresult.id, searchresult.path, searchresult.name);">Supprimer</button></td>
          <td>{{ affichageDatetime(searchresult.updateDate) }}</td>
          <td>{{ searchresult.nameuser }}</td>
        </tr>
        </tbody>
      </table>
    </div>
    <p v-show="searchResults.length == 0">Pas de résultat</p>
  </div>
  <div>
    <div v-show="!showResults" id="results">
      <table>
        <thead>
        <tr>
          <th>Nom document</th>
          <th>Indice</th>
          <th>Catégorie</th>
          <th>Secteur</th>
          <th>Date d'upload</th>
          <th></th>
          <th>Dernière modification</th>
          <th>Utilisateur</th>

        </tr>
        </thead>
        <tbody>
        <tr v-for="document in documents">
          <td><a v-bind:href="''.concat(document.path)" target="_blank" >{{ document.name }}</a></td>
          <td>{{ document.index }}</td>
          <td>{{ document.category }}</td>
          <td>{{ document.sector }}</td>
          <td>{{ affichageDatetime(document.uploadDate) }}</td>
          <td><button class="butt" v-on:click="editDocument(document); toggle();">Modifier</button><button class="butt" v-on:click="deleteDocument(document.id, document.path, document.name);">Supprimer</button></td>
          <td>{{ affichageDatetime(document.updateDate) }}</td>
          <td>{{ document.nameuser }}</td>

        </tr>
        </tbody>
      </table>
    </div>

    <div class="popUpUpdate" v-if="showPopup" @click.stop>
      <button id="close" @click="closePopUp">X</button>

      <h3>Modifier le fichier {{ fileToEdit.name }}</h3>
      <form @submit.prevent="updateBDD()" enctype="multipart/form-data">
        <p>Nom du document : </p>
        <input v-model="editedFile.name" placeholder="Nom du document" required/>
        <p>Indice : </p>
        <input v-model="editedFile.index" placeholder="Nom du document" required/>

        <p>Lien du document : {{fileToEdit.path}}</p>
        <input name="fileToUpload" type="file" @change="onFileChange" ref="fileInput" >

        <p>Catégorie : {{fileToEdit.category}}</p>
        <select name="selectCategory" v-model="editedFile.category">
          <option disabled value="">Choisir une catégorie</option>
          <option v-for="category in categories" :key="category.id" :value="category.id">{{category.name}}</option>
        </select>

        <p>Secteur : {{fileToEdit.sector}}</p>
        <select name="selectSector" v-model="editedFile.sector">
          <option disabled value="" >Choisir un secteur</option>
          <option v-for="sector in sectors" :value="sector.id">{{ sector.name }}</option>
        </select>

        <input id="button" type="submit" value="Enregistrer">
      </form>
    </div>

  </div>



</template>


<style scoped>
.butt{
  border: 1.5px solid #000000;
  color: #000000;
  background: #FFFFFF;
  border-radius: 3px;
}
.butt:hover{
  background: #d7d7d7;
  color: #000000;
  border: 1.5px solid #000000;
}
.showAll{
  background: #FFFFFF;
  border: 1.5px solid #000000;
  border-radius: 6px;
  margin-top: 0%;
  margin-right: 1%;
  color: #000000;
  font-size: 15px;
  font-weight: bold;
  padding: 6px 20px;
  cursor: pointer;
  font-family: "Istok Web",serif;
  height: fit-content;
}
.showAll:hover {
  background: #d7d7d7;
  color: #000000;
  border: 1.5px solid #000000;
}
h1 {
  position: relative;
  color: #000000;
  font-family: "Istok Web",serif;
font-weight: bold;
}
#results {
  margin-top: 3%;
}

table {
  border-collapse: collapse;
  width: 100%;
  text-align: center;
}

table, th, td {
  border: 1px solid #e6f0fe;
  padding: 8px;
}

tr:nth-child(even) {
  background-color: #e6f0fe;
}

tr:hover {
  background-color: #fff0e6;
}

th {
  padding-top: 12px;
  padding-bottom: 12px;
  background-color: #0452c8;
  color: white;
}

a:link {
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

.popUpUpdate {
  position: absolute;
  left: 35%;
  top: 5%;
  width: 30%;
  background: white;
  border-radius: 6px;
  border: #cde6fe solid 1px;
  text-align: left;
  padding: 16px;
  color: #0452c8;
  box-shadow: 10px 10px 30px 0.5px #949494;
  /* margin-top: 4px;
  padding: 16px;
  color: #0452c8;

  min-width: 200px;
  text-align: left; */
}
/*
button, select, textarea, #button {
  background-color: white;
  font: 95% "Istok Web";
  color: #045FB4;
  border: solid 1px #cde6fe;
  box-shadow: 1px 1px 2px #034f96;
}*/

#button {
  margin-left: 15%;
}

#close{
  margin: 0% 0%;
  padding: 4px 10px;
  left: 90%;
  position: absolute;
}

#close:hover{
  border: solid 1px #9bcefd;
  font: 85% Arial;
}

#button:hover{
  border: solid 1px #9bcefd;
  font: 85% Arial;
}

</style>