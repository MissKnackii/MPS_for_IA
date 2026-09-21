<template>
  <div id="routes">
    <button class="links"><router-link :to="{ name: 'Demandedachats'}">EFFECTUER UNE DEMANDE </router-link></button>
    <button class="links"><router-link :to="{ name: 'Gestionachats'}">GERER LES DEMANDES</router-link></button>
  </div>
  <AffichageAchats/>
</template>
<script>
import AffichageAchats from "@/components/Achats/AffichageAchats.vue";
import {defineComponent} from "vue";

export default defineComponent({
  components: {AffichageAchats}
})

</script>
<style scoped>
body{
  overflow: hidden;
}
#routes{
  display: flex;
  position: absolute;
  top: 5%;
  left: 65%;
  width: 100%;
  z-index: 2;
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