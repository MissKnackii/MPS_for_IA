<script>
import UploadDocument from '@/components/GestionDocumentaire/UploadDocument.vue'
import DocumentList from "@/vues/DocumentList.vue";
import Login from "@/components/Login.vue";
import { useAuthStore } from "@/store/index.js";
import MainPage from "@/components/MainPage/MainPage.vue";
import NavBarComp from "@/components/navBarComp.vue";

export default {
  name: 'App',
  components: {
    MainPage,
    Login,
    NavBarComp,
    DocumentList,
    UploadDocument,
  },
  data() {
    return {
      showPopUp: false,
      store:  useAuthStore(this.$pinia)
    };
  }
}
</script>
<template>
  <NavBarComp/>
  <RouterView />

  <!--  <MainPage/>
  <div>
      <UploadDocument/>
      <router-link :to="{ name: 'UploadDoc'}">Upload Document</router-link>
      <div id="routerContainer">
        <router-link v-show="!store.token" id="loginButton" class="loginLink" :to="{ name: 'Login'}">Se connecter</router-link>
        <button v-show="store.token" class="loginLink" @click="store.clearToken()">Se déconnecter</button>
      </div>
      <br>
   </div>
   <RouterView />
   <div>
    <DocumentList/>
    <Login/>
   </div>-->
</template>

<style>
body{
  background-color: #F8F8F8;
}
#routerContainer{
  display: flex;
  justify-content: right;
  position: relative;
  padding-right: 6%;
  top: -60px;
}
.loginLink {
  position: relative;
  /*margin-top: 0%;
  margin-right: 10%;*/
  color: #ffffff;
  background-color: #0452c8;
  font-size: 15px;
  font-weight: bold;
  color: #ffffff;
  border: 1px solid #0452c8;
  border-radius: 11px;
  padding: 6px 20px;
  cursor: pointer
}
.loginLink:hover {
  color: #0452c8;
  background-color: #ffffff;
}
</style>