<template>
  <div id="routes">
    <button class="links"><router-link :to="{ name: 'Gestionqualite'}">GERER LES DOCUMENTS</router-link></button>
  </div>
  <DocumentList/>
</template>
<script>
import {defineComponent} from "vue";
import DocumentList from "@/vues/DocumentList.vue";

export default defineComponent({
  components: {DocumentList}
})

</script>
<style scoped>

body{
  overflow: hidden;
}
#routes{
  display: flex;
  position: absolute;
  top: 18%;
  left: 80%;
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
  font-size: 27px;
  line-height: 60px;
  color: #000000;
}
.links{
  font-family: 'Istok Web',serif;
  font-weight: bold;
  margin: 5px;
  position: relative;
  width: 14%;
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