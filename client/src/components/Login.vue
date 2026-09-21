<template>
  <div class="popUp" v-show="showPopup">
    <!--<button id="close" @click="closePopUp">X</button>-->
    <h1>LOGIN</h1>
    <form @submit.prevent="login()">
      <input v-model="username" placeholder="Nom d'utilisateur" />
      <br />
      <br />
      <input v-model="password" placeholder="Mot de passe" type="password" />
      <br />
      <br />
      <button type="submit">Login</button>
      <h3 v-show="this.error" id="error">Erreur : Utilisateur non autorisé</h3>
    </form>
  </div>
</template>
<script>
import axios from "axios";
import { useAuthStore } from "@/store/index.js";

//import { getters } from 'pinia'
import { defineStore } from 'pinia'
//const main = useMainStore()

export default {
  name: "Login",
  data() {
    return {
      username: '',
      password: '',
      showPopup: true,
      error: false
    }
  },
  methods: {
    async login() {
      axios.post(`${import.meta.env.VITE_API_URL}/auth/loginGestionDoc`, {
        username: this.username,
        password: this.password
      })
          .then(response => {
            console.log(response)
            const store = useAuthStore(this.$pinia)
            let token = response.data.token;
            let user = response.data.username;
            let groups = response.data.groups;
            console.log(response.data)
            store.setToken(token)
            store.setUser(user)
            store.setGroups(groups)
            console.log(store.display)
            if (store.display === 'QualitéResp') {
              this.$router.push({name: 'Gestionqualite'})
            } else if (store.display === 'Maintenance') {
              this.$router.push({name: 'Maintenance'})
            } else if (store.display === 'Achats') {
              this.$router.push({name: 'Gestionachats'})
            } else if (store.display === 'Rebuts') {
              //console.log(store.display, store.groups)
              this.$router.push({name: 'AuthRebuts'})
            } else if (store.display === 'CycleBonneville') {
              store.setIsAuthorized(true)
              //console.log(store.display, store.groups)
              this.$router.push({name: 'CycleProdBonneville'})
            }else if (store.display === 'Consignes') {
              store.setIsAuthorized(true)
              //console.log(store.display, store.groups)
              this.$router.push({name: 'Consignes'})
            }

          })
          .catch(error => {
            console.error(error);
            if (error.status === 401) {
              this.error = true;
            }
          })
      axios.post(`${import.meta.env.VITE_API_URL}/auth/loginGestionDoc`, { username: this.username, password: this.password})
        .then(response => {
          //console.log(response.data)
          const store = useAuthStore(this.$pinia)
          let token = response.data.token;
          let user = response.data.username;
          let groups = response.data.groups;
          console.log(response.data)
          store.setToken(token)
          store.setUser(user)
          store.setGroups(groups)
          console.log(store.display)
          if (store.display === 'QualitéResp') {
            this.$router.push({ name: 'Gestionqualite' })
          }else if (store.display === 'Maintenance') {
            this.$router.push({ name: 'GestionMaintenance' })
          }else if (store.display === 'Achats') {
            this.$router.push({ name: 'Gestionachats' })
          }else if (store.display === 'Rebuts') {
            //console.log(store.display, store.groups)
            this.$router.push({ name: 'AuthRebuts' })
          }else if (store.display === '3D') {
            store.setIsAuthorized(true)
            //console.log(store.display, store.groups)
            this.$router.push({ name: '3D' })
          }else if (store.display === 'CycleBonneville') {
            store.setIsAuthorized(true)
            //console.log(store.display, store.groups)
            this.$router.push({ name: 'CycleProdBonneville' })
          }


        })
        .catch(error => {
          console.error(error);
          if (error.status === 401) {
            this.error = true;
          }
        })
    },
    closePopUp() {
      this.showPopup = false
    },
  }
}
</script>
<style scoped>
#error {
  color: red;
}

.popUp {
  z-index: 1;
  position: absolute;
  left: 30%;
  top: 20%;
  width: 40%;
  background: white;
  border-radius: 6px;
  /*border: #cde6fe solid 1px;*/
  text-align: center;
  padding: 16px;
  color: #0452c8;
  /*box-shadow: 10px 10px 30px 0.5px #949494;*/
}

button, select, textarea {
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

#close {
  margin: 0% 0%;
  padding: 4px 10px;
  left: 90%;
  position: absolute;
}
</style>

