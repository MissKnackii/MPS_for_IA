<template>
  <div id="navBar">
<!--    <router-link :to="{ name: 'Home'}"></router-link>-->
    <img id="logo" src="../assets/LogoMPS.png" alt="Logo">
    <div id="links">
<!--      <a id="img" href="/"><img id="logo" src="../assets/LogoMPS.png" alt="Logo"></a>-->
      <ul id="navLinks">
        <li><p><router-link :to="{ name: 'Achats'}">Achats</router-link></p></li>
        <li class="deroulant">
          <p>▼ Maintenance</p>
          <ul class="sous">
            <li><a href="http://srv-erp/webdi">Demande d'intervention</a><p></p></li>
            <li><p><router-link :to="{ name: 'Maintenance'}">Maintenance Préventive</router-link></p></li>
          </ul>
        </li>
        <li>
          <p>▼ Suivi de Production</p>
          <ul class="sous">
            <li><p><router-link :to="{ name: 'Consignes'}">Passage de consignes</router-link></p></li>
            <li><p><router-link :to="{ name: 'ConsultationMachines'}">Consultation Machines</router-link></p></li>
            <li><p><router-link :to="{ name: 'CycleProdVougy'}">Cycle production Vougy</router-link></p></li>
            <li><p><router-link :to="{ name: 'CycleProdBonneville'}">Cycle production Bonneville</router-link></p></li>
            <li><p><router-link :to="{ name: 'InsertionDonnees'}">Insertion données Machine</router-link></p></li>
            <li><p><router-link :to="{ name: 'GestionRebuts'}">Gestion rebuts </router-link></p></li>
            <li><p><router-link :to="{ name: 'Controles'}">Controles </router-link></p></li>
          </ul></li>
        <li><p><router-link :to="{ name: 'UploadDoc'}">Base documentaire</router-link></p></li>
        <li><p><router-link :to="{ name: '3D'}">3D</router-link></p></li>
        <li><p><a href="http://srv-rh:8080/res/RepertoireTelephonique.pdf">Répertoire</a></p></li>
        <li><p><a href="http://srv-horoquartz/webquartz/ux/login">Horoquartz</a></p></li>
      </ul>
    </div>
  </div>
</template>
<script>
import UploadDocument from '@/components/GestionDocumentaire/UploadDocument.vue'
import { useAuthStore } from "@/store/index.js";

export default {
  name: 'NavBar',
  components: {
    UploadDocument,
  },
  data() {
    return {
      store:  useAuthStore(this.$pinia)
    };
  }
}
</script>
<style scoped>
  .istok-web-bold {
    font-family: "Istok Web", sans-serif;
    font-weight: 700;
    font-style: normal;
  }
  #google{
    margin-top: 15px;
    width:15px;
    height: 15px;
    overflow: hidden;
  }
  #google img{
    width:100%;
    height: 100%;
    overflow: hidden;
  }
  p{
    font-family: "Istok Web", sans-serif;
    font-weight: bold;
  }
  #navBar {
    display: flex;
    flex-direction: row;
 /*   align-content: center;
    justify-content: center;
    align-items: baseline;*/
  }
  #navLinks{
    width: 100%;
  }
  #logo{
    width: 10%;
    height: 10%;
  }
  #links{
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    align-content: space-evenly;
  }
  #links ul{
    list-style-type: none;
  }
  #links ul li{
    float: left;
    margin-left: 3%;
    position: relative;
  }
  #links ul::after{
    content: "";
    display: table;
    clear: both;
  }
  #links p{
    display: block;
    text-decoration: none;
    border-bottom: 2px solid transparent;
    margin: 0px;
    padding: 10px 0px;
    width: fit-content;
    overflow: hidden;
  }

  #links p:hover{
    color: #FFB020;
  }
  .sous{
    display: none;
    box-shadow: 0px 1px 2px #CCC;
    background-color: white;
    position: absolute;
    width: 100%;
    z-index: 1000;
  }
  #links > ul li:hover .sous{
    display: block;
  }
  .sous li{
    float: none;
    width: 100%;
    text-align: left;
  }
  .sous p:hover{
    border-bottom: none;
    background-color: RGBa(200,200,200,0.1);
  }
  .deroulant > a::after{
    content:" ▼";
    font-size: 12px;
  }

</style>