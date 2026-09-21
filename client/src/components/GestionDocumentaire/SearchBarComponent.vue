<script>
  import axios from 'axios';
export default {
    data() {
        return {
            searchResults:"",
            searchSecteur:"",
            searchCategorie:"",
            categories: [],
            sectors: [],
        }
    },
  created() {
    this.getCategories();
    this.getSectors();
  },
  methods:{
    sendSearchRequest() {
        axios.get(`${import.meta.env.VITE_API_URL}/api/data/search`, {
            params: {
                searchCategorie: this.searchCategorie,
                searchSecteur: this.searchSecteur,
            }
        })
        .then(response => {
            this.searchResults = response.data.recordset;
            this.$emit('search-complete', this.searchResults);
        })
        .catch(error => {
            console.error(error);
        });
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
  },
}
</script>
<template>
    <form @submit.prevent="sendSearchRequest">
      <select class="select" v-model="searchCategorie">
        <option value="" >Choisir une catégorie</option>
        <option v-for="category in categories" :value="category.id">{{category.name}}</option>
      </select>
      <select class="select" v-model="searchSecteur">
        <option value="" >Choisir un secteur</option>
        <option v-for="sector in sectors" :value="sector.id">{{ sector.name }}</option>
      </select>
      <input class="button" type="submit" value="Rechercher">
    </form>
</template>
<style scoped>
form{
    z-index: 2;
    width: 700px;
}
.select {
  box-sizing: border-box;
  position: relative;
  width: 30%;
  height: 30px;
  background: #FFFFFF;
  border: 1.5px solid #000000;
  border-radius: 6px;
  margin-bottom: 15px;
  margin-right: 10px;
  display: inline-block;
  font-family: "Istok Web",serif;
}
.button {
  background: #FFFFFF;
  border: 1.5px solid #000000;
  border-radius: 6px;
  height: 35px;
  margin-top: 0%;
  margin-right: 10%;
  color: #000000;
  font-size: 15px;
  font-weight: bold;
  padding: 6px 20px;
  cursor: pointer;
  font-family: "Istok Web",serif;
}
.button:hover {
  background: #d7d7d7;
  color: #000000;
  border: 1.5px solid #000000;
}
</style>
