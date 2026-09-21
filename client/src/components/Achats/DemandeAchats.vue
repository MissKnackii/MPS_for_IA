<template>
  <router-link to="/achats"><button id="back">Retour</button></router-link>
  <h1>Demande d'achats</h1>
  <p>Faites vos demandes d'achats simplement et suivez leur évolution en cliquant <a href="/achats">ici</a>.</p>

  <button @click="verif()" id="verif">Vérifier</button>
  <form>
    <div id="line"></div>
    <div id="form-content">
      <div id="column1" class="form-column">
        <label for="name" class="form-label">*Nom du demandeur : </label>
        <select v-model="this.nom" class="form-input-text" type="text" required>
          <option selected value="default" >Choisissez un nom</option>
          <option value="Ali GOUNICH">Ali GOUNICH</option>
          <option value="ANDRE MARTIN">ANDRE MARTIN</option>
          <option value="Andreia GONCALVES">Andreia GONCALVES</option>
          <option value="Camille CHAULAIC">Camille CHAULAIC</option>
          <option value="Candice CHEVRIAU">Candice CHEVRIAU</option>
          <option value="Charline MAGNIN">Charline MAGNIN</option>
          <option value="Christophe CECCHI">Christophe CECCHI</option>
          <option value="Cyril RASSIAT">Cyril RASSIAT</option>
          <option value="Denis PERES">Denis PERES</option>
          <option value="Denis PERROLLAZ">Denis PERROLLAZ</option>
          <option value="Derya BASARAN">Derya BASARAN</option>
          <option value="Didier MICHALOT">Didier MICHALOT</option>
          <option value="Elisa LOPEZ">Elisa LOPEZ</option>
          <option value="Elisabeth VERNAZ">Elisabeth VERNAZ</option>
          <option value="Eric RETHORE">Eric RETHORE</option>
          <option value="Fabrice GRANGER">Fabrice GRANGER</option>
          <option value="Franz PORTAS">Franz PORTAS</option>
          <option value="Frederic MARTIN">Frederic MARTIN</option>
          <option value="Hérold TRAVERS">Hérold TRAVERS</option>
          <option value="Hervé LABOUREY">Hervé LABOUREY</option>
          <option value="Jean-Louis TAVELLA">Jean-Louis TAVELLA</option>
          <option value="Jeremy PELLET-LANGE">Jeremy PELLET-LANGE</option>
          <option value="Jérôme DECOTTIGNIES">Jérôme DECOTTIGNIES</option>
          <option value="Jérôme MARQUIS">Jérôme MARQUISZ</option>
          <option value="Julien ROCH">Julien ROCH</option>
          <option value="Léane RODRIGUEZ">Léane RODRIGUEZ</option>
          <option value="Maros TAKAC">Maros TAKAC</option>
          <option value="Merhezia ROUISSI">Merhezia ROUISSI</option>
          <option value="Michel MARTIN">Michel MARTINS</option>
          <option value="Najib BELHI">Najib BELHI</option>
          <option value="Nicolas GRANGERAT">Nicolas GRANGERAT</option>
          <option value="Nicolas LE FRANCOIS">Nicolas LE FRANCOIS</option>
          <option value="Olivier DEAGE">Olivier DEAGE</option>
          <option value="Omrane FKIRI">Omrane FKIRI</option>
          <option value="Oussama TERGHINI">Oussama TERGHINI</option>
          <option value="Patrice LONG">Patrice LONG</option>
          <option value="P-E LAPOTRE">P-E LAPOTRE</option>
          <option value="Philippe DUPENLOUP">Philippe DUPENLOUP</option>
          <option value="Philippe GUIBERT">Philippe GUIBERT</option>
          <option value="Philippe NOWAK">Philippe NOWAK</option>
          <option value="Raphael BLANCHARD">Raphael BLANCHARD</option>
          <option value="Romain MEUNIER">Romain MEUNIER</option>
          <option value="Samir LEBCIR">Samir LEBCIR</option>
          <option value="Somsanouk KHOMMANIVONG">Somsanouk KHOMMANIVONG</option>
          <option value="Stéphane LEGRAND">Stéphane LEGRANDI</option>
          <option value="Steven ROUGELIN">Steven ROUGELING</option>
          <option value="Sylvain BURDET">Sylvain BURDET</option>
          <option value="Théophane TABARD">Théophane TABARD</option>
          <option value="Tony NONG">Tony NONG</option>
          <option value="Aloïs AHR" disabled>Aloïs AHR</option>
          <option value="Bonnavion" disabled>BonnavionN</option>
          <option value="Commandeur" disabled>Commandeur</option>
          <option value="contat" disabled>contat</option>
          <option value="Cory" disabled>Cory</option>
          <option value="Daniel BLANCHARD" disabled>Daniel BLANCHARDN</option>
          <option value="Denis BUISSON" disabled>Denis BUISSON</option>
          <option value="Foussier Romain" disabled>Foussier Romain</option>
          <option value="Inthiphab " disabled>Inthiphab S</option>
          <option value="Joe" disabled>Joe</option>
          <option value="Joé" disabled>Joé</option>
          <option value="LAFARGE ROMARIC" disabled>LAFARGE ROMARICT</option>
          <option value="LEBRETTON" disabled>LEBRETTONZ</option>
          <option value="Matthieu" disabled>Matthieu</option>
          <option value="MENANTEAU Joé" disabled>MENANTEAU JoéRE</option>
          <option value="null" disabled>null</option>
          <option value="PASCALINE" disabled>PASCALINES</option>
          <option value="Pasquier" disabled>Pasquier</option>
          <option value="PASQUIER Matthieu" disabled>PASQUIER Matthieu</option>
          <option value="PESSEY" disabled>PESSEY</option>
          <option value="PESSEY-GIROD" disabled>PESSEY-GIROD</option>
          <option value="Pierre CHALLAMEL" disabled>Pierre CHALLAMEL</option>
          <option value="Pilippe" disabled>Pilippe</option>
          <option value="RAMBAUD" disabled>RAMBAUDZ</option>
          <option value="ROLLUX" disabled>ROLLUXH</option>
          <option value="Romain" disabled>RomainZ</option>
          <option value="romain foussier" disabled>romain foussierC</option>
          <option value="romaric" disabled>romaric</option>
          <option value="Saint-Genis" disabled>Saint-Genis</option>
          <option value="tungaloy" disabled>tungaloy</option>
        </select>
        <br>
        <label for="service" class="form-label">*Service : </label>
        <select v-model="this.service" id="" class="form-input-text" name="service" required>
          <option selected value="default">Choisissez un secteur</option>
          <option v-for="service in this.services" >{{service}}</option>
        </select>
        <br>
        <label for="nature" class="form-label">*Nature demande : </label>
        <select required v-model="this.nature" id="" class="form-input-text" name="nature">
          <option selected value="default">Choisissez une nature</option>
          <option value="Demande d achat"> Demande d'achat</option>
          <option value="Demande de prix">Demande de prix</option>
        </select>
        <br>
        <label for="name" class="form-label"> Nom fournisseur/ marque : </label>
        <input v-model="this.marque" class="form-input-text" type="text">
        <br>
        <label for="service" class="form-label">*Catégorie : </label>
        <select required v-model="this.categorie" id="" class="form-input-text" name="categorie">
          <option selected value="default">Choisissez une nature</option>
          <option v-for="categorie in this.categories">{{categorie.code}}</option><!-- Auto from DB-->
        </select>
        <br>
        <label for="name" class="form-label">Référence pièce client : </label>
        <input v-model="this.refe" class="form-input-text" type="text">
        <br>
        <label for="name" class="form-label">*Délai : </label>
        <input required v-model="this.delai" class="form-input-text" type="date">
        <br>
        <label for="name" class="form-label">Urgent : </label>
        <input v-model="this.urgent" class="form-input-text" type="checkbox">
        <br>
        <label for="service" class="form-label">*Livraison : </label>
        <select required v-model="this.livraison" id="" class="form-input-text" name="cars">
          <option selected value="volvo">Choisissez un site</option>
          <option value="vougy">Vougy</option>
          <option value="bonneville">Bonneville</option>
        </select>
        <br>
      </div>
      <div id="column2" class="form-column">
        <div>
          <label for="name" class="form-label">*Référence demandée : </label>
          <input required v-model="this.demande1.refe" id="refe" class="form-input-text" type="text">
          <label for="unit" class="form-label">*Unité : </label>
          <select required v-model="this.demande1.unite" id="unit" class="form-input-text" name="unite">
            <option v-for="unite in this.unites" >{{unite}}</option>
          </select>
          <label for="piece" class="form-label">*Pièces : </label>
          <input required v-model="this.demande1.piece" id="piece" class="form-input-text" type="text">
        </div>
        <div>
          <label for="name" class="form-label">Référence demandée : </label>
          <input v-model="this.demande2.refe" id="refe" class="form-input-text" type="text">
          <label for="name" class="form-label">Unité : </label>
          <select v-model="this.demande2.unite" id="unit" class="form-input-text" name="unite">
            <option v-for="unite in this.unites" >{{unite}}</option>
          </select>
          <label for="name" class="form-label">Pièces : </label>
          <input v-model="this.demande2.piece" id="piece" class="form-input-text" type="text">
        </div>
        <div>
          <label for="name" class="form-label">Référence demandée : </label>
          <input v-model="this.demande3.refe" id="refe" class="form-input-text" type="text">
          <label for="name" class="form-label">Unité : </label>
          <select  v-model="this.demande3.unite"id="unit" class="form-input-text" name="unite">
            <option v-for="unite in this.unites" >{{unite}}</option>
          </select>
          <label for="name" class="form-label">Pièces : </label>
          <input  v-model="this.demande3.piece" id="piece" class="form-input-text" type="text">
        </div>
        <div>
          <label for="name" class="form-label">Référence demandée : </label>
          <input v-model="this.demande4.refe" id="refe" class="form-input-text" type="text">
          <label for="name" class="form-label">Unité : </label>
          <select v-model="this.demande4.unite" id="unit" class="form-input-text" name="unite">
            <option v-for="unite in this.unites" >{{unite}}</option>
          </select>
          <label for="name" class="form-label">Pièces : </label>
          <input  v-model="this.demande4.piece" id="piece" class="form-input-text" type="text">
        </div>
        <div>
          <label for="name" class="form-label">Référence demandée : </label>
          <input v-model="this.demande5.refe" id="refe" class="form-input-text" type="text">
          <label for="name" class="form-label">Unité : </label>
          <select v-model="this.demande5.unite" id="unit" class="form-input-text" name="unite">
            <option v-for="unite in this.unites" >{{unite}}</option>
          </select>
          <label for="name" class="form-label">Pièces : </label>
          <input  v-model="this.demande5.piece" id="piece" class="form-input-text" type="text">
        </div>
        <label for="name" class="form-label">Informations complémentaires : </label>
        <br>
        <textarea  v-model="this.commentaire" name="info" rows="5" cols="70"></textarea>
        <br>
        <label for="name" class="form-label">Justificatif demande : </label>
        <br>
        <textarea  v-model="this.justificatif" name="info" rows="5" cols="70"> </textarea>
        <br>
      </div>
    </div>
    <div v-if="this.showVerif" id="overlay" @click="() => {this.showVerif = false}"></div>
    <div id="verifPopUp" v-show="this.showVerif">
      <div v-if="okay === false">
        <h1>Recapitulatif de la demande </h1>
        <img @click="this.showVerif = false" id="cross" src="../../assets/x.png" alt="">
        <p><b>Nom du demandeur :</b> {{this.nom}}</p>
        <p><b>Service :</b> {{this.service}}</p>
        <p><b>Nature demande :</b> {{this.nature}}</p>
        <p><b>Nom fournisseur/ marque :</b> {{this.marque}}</p>
        <p><b>Catégorie :</b> {{this.categorie}}</p>
        <p><b>Référence pièce client  :</b> {{this.refe}}</p>
        <p><b>Délai :</b> {{this.delai}}</p>
        <p><b>Urgent :</b> {{this.urgent}}</p>
        <p><b>Livraison  :</b> {{this.livraison}}</p>
        <p><b>Référence demandée 1  :</b> {{this.demande1.refe}} {{this.demande1.piece}} {{this.demande1.unite}}</p>
        <p><b>Référence demandée 2  :</b> {{this.demande2.refe}} {{this.demande2.piece}} {{this.demande2.unite}}</p>
        <p><b>Référence demandée 3  :</b> {{this.demande3.refe}} {{this.demande3.piece}} {{this.demande3.unite}}</p>
        <p><b>Référence demandée 4  :</b> {{this.demande4.refe}} {{this.demande4.piece}} {{this.demande4.unite}}</p>
        <p><b>Référence demandée 5  :</b> {{this.demande5.refe}} {{this.demande5.piece}} {{this.demande5.unite}}</p>
        <p><b>Information complémentaires :</b> {{this.commentaire}}</p>
        <p><b>Justificatif :</b> {{this.justificatif}}</p>
        <input @click.prevent="submit" id="submit" type="submit" value="Valider" />
      </div>
      <div id="okay" v-if="okay">
        <img @click="this.showVerif = false" id="cross" src="../../assets/x.png" alt="">
        <p>Votre demande a bien été enregistrée !</p>
        <button @click="this.showVerif = false" id="submit">Fermer</button>
      </div>
    </div>
  </form>
</template>
<script>
export default {
  data() {
    return {
      showVerif: false,
      unites: ['PCE', 'MTR', 'LTR', 'LOT', 'KGM', 'BTE', 'CAR'],
      services: ["Achats", "Assemblage", "Commercial", "Comptabilité", "Decolletage monobroche", "Informatique", "Lavage", "Logistique", "Maintenance", "Méthodes", "Multibroche Deco CN", "Multitrad PG", "Multitrad JLT", "Outillage", "Polissage", "Propreté", "Qualité", "Rectification", "Reprise", "RH", "Technique", "Tri"],
      categories: [],
      nom:'',
      okay: false,
      service:'',
      nature:'',
      marque:'',
      categorie:'',
      refe:'',
      delai:'',
      urgent: 0,
      livraison:'',
      demande1: {
        refe:'',
        unite:'',
        piece: 0,
      },
      demande2: {
        refe:'',
        unite:'',
        piece: 0,
      },
      demande3: {
        refe:'',
        unite:'',
        piece: 0,
      },
      demande4: {
        refe:'',
        unite:'',
        piece: 0,
      },
      demande5: {
        refe:'',
        unite:'',
        piece: 0,
      },
      commentaire:'',
      justificatif:'',
      toSend: new FormData(),

    }
  },
  methods: {
    async verif(){
      this.okay = false
      if (this.nom && this.service && this.nature && this.categorie && this.delai && this.livraison && this.demande1.refe && this.demande1.piece && this.demande1.unite){
        this.showVerif = true;
      }else {
        window.alert('Veuillez remplir les champs obligatoires')
      }

    },
    async submit(){
      this.okay = true;
      console.log("Unites:", this.unites);
      console.log("Services:", this.services);
      console.log("Nom:", this.nom);
      console.log("Service:", this.service);
      console.log("Nature:", this.nature);
      console.log("Marque:", this.marque);
      console.log("Categorie:", this.categorie);
      console.log("Reférence:", this.refe);
      console.log("Délai:", this.delai);
      console.log("Urgent:", this.urgent);
      console.log("Livraison:", this.livraison);
      console.log("Commentaire:", this.commentaire);
      console.log("Justificatif:", this.justificatif);

      for (let i = 1; i <= 5; i++) {
        console.log(`Demande${i} - Reférence:`, this[`demande${i}`].refe);
        console.log(`Demande${i} - Unité:`, this[`demande${i}`].unite);
        console.log(`Demande${i} - Pièce:`, this[`demande${i}`].piece);
      }
        if (this.urgent === true) {
          this.urgent = 1
        }else if( this.urgent === false ) {
          this.urgent = 0
        }
        this.toSend.append('nom', this.nom);
        this.toSend.append('service', this.service);
        this.toSend.append('nature', this.nature);
        this.toSend.append('marque', this.marque);
        this.toSend.append('categorie', this.categorie);
        this.toSend.append('refe', this.refe);
        this.toSend.append('delai', this.delai);
        this.toSend.append('urgent', this.urgent);
        this.toSend.append('livraison', this.livraison);
        this.toSend.append('commentaire', this.commentaire);
        this.toSend.append('justificatif', this.justificatif);
        for (let i = 1; i <= 5; i++) {
          const demande = this[`demande${i}`];
          this.toSend.append(`demande${i}[refe]`, demande.refe);
          this.toSend.append(`demande${i}[unite]`, demande.unite);
          this.toSend.append(`demande${i}[piece]`, demande.piece);
        }

        console.log(this.toSend);
      await fetch(`${import.meta.env.VITE_API_URL}/achats/createDemande`, {
        method: 'POST',
        body: this.toSend,
      })
          .then(res => res.json())
          .then(data => console.log(data))
          .catch(err => console.error(err));
    },
    async getCategories() {

      await fetch(`${import.meta.env.VITE_API_URL}/achats/allCategories`, {
        method: 'GET',
      })
          .then(res => res.json())
          .then(data => {
            console.log(data)
            this.categories = data
          })
          .catch(err => console.error(err));
    },
  },
  created() {
    this.getCategories()
  },
}
</script>
<style scoped>
#okay{
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  text-align: center;
}
#okay p{
  font-size: 20px;
  margin-bottom: 20px;
}
#back{
  background-color: white;
  border: 1.5px solid #0B5CD6;
  border-radius: 5px;
  color: #0B5CD6;
  padding: 5px;
}
#verifPopUp{
  text-align: center;
  justify-content: center;
  position: fixed;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 5px;
  width: 50%;
  height: fit-content;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: black;
  font-size: 12px;
  margin: 0;
  scroll-behavior: unset;
}

#cross{
  position: absolute;
  right: 20px;
  top: 5px;
}
#overlay{
  width: 100%;
  height: 100%;
  position: fixed;
  background-color: rgba(0, 0, 0, 0.55);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
#verifPopUp p{
  margin: 5px;
}
h1{
  margin: 0;
  position: relative;
  font-family: 'Istok Web',serif;
  font-style: normal;
  font-weight: 700;
  font-size: 27px;
  line-height: 60px;
  color: #000000;
}
p{
  margin: 0;
  color: #000000;
}
#line{
  position: relative;
  width: 95%;
  height: 0;
  left: 27px;
  /*top: 33%;*/

  margin-bottom: 40px;
  border: 1px solid #D7D7D7;
}
#form-content{
  display: flex;
}

#column1{
  padding-left: 20px;
  width: 40%;
}
#column2{
  width: 60%;
}
#column2 #refe{
  width: 30%;
}
#column2 .form-input-text{
  margin-right: 7px;
}
.form-label{
  font-family: 'Istok Web',serif;
  font-style: normal;
  color: #000000;
}

.form-input-text{
  box-sizing: border-box;
  position: relative;
  width: 30%;
  height: 30px;
  background: #FFFFFF;
  border: 1px solid #000000;
  border-radius: 6px;
  margin-bottom: 15px;

}
#unit, #piece{
  width: 10%;
}
#submit{
  position: relative;
  width: 12%;
  height: 40px;
  background: #0B5CD6;
  border-radius: 3px;
  border: none;
  color: #FFFFFF;
  font-size: 15px;
}
#submit:hover{
  background: #FFFFFF;
  color: #0B5CD6;
  border: 1px solid #0B5CD6;
}
#verif{
  position: relative;
  width: 9%;
  height: 40px;
  background: #0B5CD6;
  border-radius: 3px;
  top: -30px;
  left: 90%;
  border: none;
  color: #FFFFFF;
  font-size: 15px;
}
#verif:hover{
  background: #FFFFFF;
  color: #0B5CD6;
  border: 1px solid #0B5CD6;
}
</style>