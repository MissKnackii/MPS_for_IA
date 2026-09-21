<template>
  <div id="routes">
    <button class="links"><router-link :to="{ name: 'GestionMaintenance'}">NIVEAU 2</router-link></button>
<!--
    <button class="links"><router-link :to="{ name: 'Gestionachats'}">GERER LES DEMANDES</router-link></button>
-->
  </div>
  <AffichageMaintenance/>
</template>
<script>
import AffichageMaintenance from "@/components/Maintenance/AffichageMaintenance.vue";
import {defineComponent} from "vue";

export default defineComponent({
  components: {AffichageMaintenance}
})

</script>
<style scoped>
body{
  overflow: hidden;
}
#routes{
  display: flex;
  position: absolute;
  top: 15%;
  left: 85%;
  width: 70%;
  z-index: 40;
}
.router-link-active,
.router-link-exact-active {
  text-decoration: none;
  color: inherit;
  font-weight: normal;
}
a {
  text-decoration: none;
  color: inherit;
}

h1{
  position: absolute;
  font-family: 'Istok Web',serif;
  font-style: normal;
  font-weight: 700;
  font-size: 25px;
  line-height: 60px;
  color: #000000;
}
.links{
  font-family: 'Istok Web',serif;
  font-weight: bold;
  margin: 5px;
  position: relative;
  width: 15%;
  height: 35px;
  background: #0B5CD6;
  border-radius: 5px;
  border: none;
  color: #FFFFFF;
  font-size: 12px;
}

.links:hover{
  background: #FFFFFF;
  color: #0B5CD6;
  border: 1.5px solid #0B5CD6;
}
</style>






















<!--
<template>
</template>
<script>
import {useAuthStore} from "@/store/index.js";
import axios from 'axios';

export default {
  data() {
    return {
      store: useAuthStore(this.$pinia),
    }
  },
  created() {
    //this.checkAuth()
  },
  methods:{
    checkAuth(){
      this.store.setDisplay('Maintenance')
      this.store.checkTokenExpiration()
      //this.store.token = ""
      axios.post(`${import.meta.env.VITE_API_URL}/auth/check-access/achats`, { token: this.store.token})
          .then(response => {
            console.log(response)
          })
          .catch(error => {
            console.error(error);
            if (error.status === 401) {
              this.$router.push('/login');
              this.error = true;
            }
            if (error.status === 403) {
              window.alert("Vous n'avez pas les autorisations nessessaires pour acceder a cette page. ");
              this.$router.push('/');
              this.error = true;
            }
          })
    },
  }
}
</script>
<style scoped></style>-->
