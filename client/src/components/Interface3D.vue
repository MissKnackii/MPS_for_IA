<template>
  <error3-d-pop-u-p
  v-if="this.error"
  @close="this.error = false"
  />
  <add-ref-pop-up
  v-if="this.showAddRef"
  @close="this.showAddRef = false"
  :reference="this.ref"
  :tag="this.tag"
  @validate="addRef($event)"
  />

  <header>
    <h1>Interface contôle 3D</h1>
  </header>
  <button v-if="this.store.token" @click="() =>{this.store.clearToken();}">Deconnnexion</button>
  <button v-if="this.store.token === null" @click="checkAuth()">Connexion</button>
  <button v-if="this.store.isAuthorized" @click="this.showAddRef = true">Ajouter une référence</button>
  <div id="en-cours">
    <div class="en-controle" id="robot">
      <div class="head">
        <img src="../assets/robot.png" alt="">
        <h3>Robot</h3>
      </div>
      <ul>
        <li v-for="item in this.robotList" key="">{{ item.piece_reference ? item.piece_reference : "Vide" }}</li>
      </ul>
    </div>
    <div class="en-controle" id="3D1">
      <div class="head">
        <img src="../assets/3D.png" alt="">
        <h3>3D1</h3>
      </div>
      <ul>
        <li v-for="item in this.troisD1List" key="">{{ item.piece_reference ? item.piece_reference : "Vide" }}</li>
      </ul>
    </div>
    <div class="en-controle" id="3D2">
      <div class="head">
        <img src="../assets/3D.png" alt="">
        <h3>3D2</h3>
      </div>
      <ul>
        <li v-for="item in this.troisD2List" key="">{{ item.piece_reference ? item.piece_reference : "Vide" }}</li>
      </ul>
    </div>
  </div>
  <div id="content">
    <div class="pile" id="production">
      <div class="head">
        <img class="tapis" src="../assets/download.png" alt="">
        <h3>Production</h3>
      </div>
      <ol>
        <li v-for="item in this.prodList" key="">{{ item.piece_reference ? item.piece_reference : "Vide" }}</li>
      </ol>
    </div>
    <div class="pile" id="reglage">
      <div class="head">
        <img src="../assets/download.png" alt="">
        <h3>Réglage</h3>
      </div>
      <ol>
        <li v-for="item in this.reglList" key="">{{ item.piece_reference ? item.piece_reference : "Vide" }}</li>
      </ol>
    </div>
    <div class="pile" id="controlees">
      <div class="head">
        <img src="../assets/download.png" alt="">
        <h3>Controlées</h3>
      </div>
      <ol>
        <li v-for="item in this.contList" key="">{{ item.piece_reference ? item.piece_reference : "Vide" }}</li>
      </ol>
    </div>
    <div class="pile" id="defaut">
      <div class="head">
        <img src="../assets/download.png" alt="">
        <h3>Non controlées</h3>
      </div>
      <ol>
        <li v-for="item in this.defList" key="">{{ item.piece_reference ? item.piece_reference : "Vide" }}</li>
      </ol>
    </div>
  </div>

</template>
<script>
import axios from "axios";
import Error3DPopUP from "@/components/error3DPopUP.vue";
import AddRefPopUp from "@/components/AddRefPopUp.vue";
import {useAuthStore} from "@/store/index.js";


export default {
  components: {AddRefPopUp, Error3DPopUP},
  data(){
    return{
      data: '',
      prodList: [],
      reglList: [],
      contList: [],
      defList: [],
      robotList: [],
      troisD1List: [],
      troisD2List: [],
      error: false,
      showAddRef: false,
      ref: null,
      tag: null,
      store: useAuthStore(this.$pinia),
      isAuth: false,

    }
  },
  created(){
    this.getAllData()
    const intervalID = setInterval(this.getAllData, 10000, );
    this.checkAuthorised()
    console.log(this.store.isAuthorized);
  },
  methods:{
    checkAuth() {
      this.store.setDisplay('3D')
      this.store.checkTokenExpiration()
      //this.store.token = ""
      axios.post(`${import.meta.env.VITE_API_URL}/auth/check-access/3D`, {
        token: this.store.token,
        groups: this.store.groups
      })
          .then(response => {
            console.log(response)
            this.store.setIsAuthorized(true)
            this.$router.push('/3D');
            this.store.display = '3D'
          })
          .catch(error => {
            console.error(error);
            if (error.status === 401) {
              this.$router.push('/login');
            }
            if (error.status === 403) {
              this.store.setIsAuthorized(false)
              this.$router.push('/3D');
              window.alert("Vous n'avez pas les autorisations nessessaires pour administrer cette page. Vous pouvez quand même acceder aux données.");
            }
          })
    },
    checkAuthorised() {
      this.store.setDisplay('3D')
      this.store.checkTokenExpiration()
      axios.post(`${import.meta.env.VITE_API_URL}/auth/check-access/3D`, {
        token: this.store.token,
        groups: this.store.groups
      })
          .then(response => {
            console.log(response)
            this.store.setIsAuthorized(true)
            this.$router.push('/3D');
            this.store.display = '3D';

          })
          .catch(error => {
            console.error(error);
            if (error.status === 403) {
              this.$router.push('/3D');
              this.store.setIsAuthorized(false);
              window.alert("Vous n'avez pas les autorisations nessessaires pour administrer cette page. Vous pouvez quand même acceder aux données.");
            }
          })
    },
    getAllData(){
      console.log ("New Refresh")
      this.data = []
      this.defList = []
      this.robotList = []
      this.troisD1List = []
      this.troisD2List = []
      this.prodList = []
      this.reglList = []
      this.contList = []
      axios.get(`${import.meta.env.VITE_API_URL}/3D/3D`)
          .then((response) => {
            this.data = response.data.recordset;
            //console.log(this.data);
            this.data.forEach(element => {
              if(element.position_type === "File_Production"){
                this.prodList.push(element);
                this.prodList.sort((a, b) => {return a.position_index - b.position_index})

              }else if (element.position_type === "File_Reglage"){
                this.reglList.push(element);
                this.reglList.sort((a, b) => {return a.position_index - b.position_index})

              }else if (element.position_type === "Piece_Controlee"){
                this.contList.push(element);
                this.contList.sort((a, b) => {return a.position_index - b.position_index})

              }else if (element.position_type === "Piece_Non_Controlee"){
                this.defList.push(element);
                this.defList.sort((a, b) => {return a.position_index - b.position_index})

              }else if (element.position_type === "Robot"){
                this.robotList.push(element);
                this.robotList.sort((a, b) => {return a.position_index - b.position_index})

              }else if (element.position_type === "3D1"){
                this.troisD1List.push(element);
                this.troisD1List.sort((a, b) => {return a.position_index - b.position_index})

              }else if (element.position_type === "3D2"){
                this.troisD2List.push(element);
                this.troisD2List.sort((a, b) => {return a.position_index - b.position_index})

              }else if (element.position_type === null || element.position_type === "" || element.position_type === "null"){
                this.error = true;

              }
              /*console.log("Production",this.prodList)
              console.log("Reglage",this.reglList)
              console.log("Controlées",this.contList)
              console.log("Non controlées",this.defList)
              console.log("Robot",this.robotList)
              console.log("3D1",this.troisD1List)
              console.log("3D2",this.troisD2List)*/
            })
          })
          .catch((err) => {
            console.error(err);
          })
    },
    async addRef(data) {
      let toSend = {
            'tag': data.tag.value,
            'reference': data.reference.value
      }
      console.log(toSend.tag.value);
      console.log(toSend.reference.value);
      fetch(`${import.meta.env.VITE_API_URL}/3D/3D-add-reference`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(toSend),
      })
          .then(res => res.json())
          .then(data => {
            console.log('close popup')
            this.selectedMaintenance = null
            window.location.reload();
          })
          .catch(err => console.error(err));
    },
  }
}
</script>
<style scoped>
button {
  margin-top: 0%;
  margin-right: 10%;
  color: #ffffff;
  background-color: #0452c8;
  font-size: 15px;
  font-weight: bold;
  color: #ffffff;
  border: 1px solid #0452c8;
  border-radius: 11px;
  padding: 10px 20px;
  cursor: pointer
}
button:hover {
  color: #0452c8;
  background-color: #ffffff;
}
.head{
  display: flex;
}
.tapis{
  height: 20px;
}
.head img{
  width: 50px;
  height: 50px;
}
#en-cours{
  display: flex;
  justify-content: center;
}
.en-controle{
  display: flex;
  flex-direction: column;
  width: 300px;
  height: fit-content;
  border: 1px solid #ccc;
  margin: 10px;
}
.en-controle h3{
  justify-content: center;
}
#content {
  display: flex;
  justify-content: center;
  align-content: space-evenly;
}
.pile{
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 300px;
  height: fit-content;
  border: 1px solid #ccc;
  margin: 10px;
}
header {
  display: flex;
  align-items: center;
  align-content: center;
}
</style>
