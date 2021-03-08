const { Console } = require('console');


const nodeGeocoder = require('node-geocoder');

let options = {
    provider: 'openstreetmap'
  };
   
let geoCoder = nodeGeocoder(options);

/**
 * This object is use for consistently saved data through the application. It contains the logic for
 * reading and writing data in the app
 */
class PersistentServices{

    /**
     * Constructor
     */
    constructor(a,b,c,d,e){
        this.restaurants = this.getRestaurants();
        this.commandes = [];
        this.gestionnaires = {};
        this.livreurs = [];
        this.commande_id = 0;
        this.livreur_id = 0;
    }

    getRestaurants(){
        var fs = require('fs');
        var obj = JSON.parse(fs.readFileSync('./restaurant.json', 'utf8'));
        
        return obj;
    }

    getRestaurantById(id){
        
        return this.restaurants[id];
    }


    listRestaurant() {
        return this.restaurants;
    }

    listRestaurantsWithCommandes() {
        
        var length = Object.keys(this.restaurants).length;
        var obj = {};
        if (this.commandes.length === 0 ){
            return obj;
        }

        this.commandes.forEach(( commande, index) => {
            for(var attributename in this.restaurants){
                if(commande.status == 1 && parseInt(commande["restaurant_id"]) == parseInt(attributename)){
                    if (typeof obj[attributename] === 'undefined'){
                        obj[attributename] = {};
                    }
                    if(typeof obj[attributename].nbreCommande === 'undefined'){
                        obj[attributename].nbreCommande = 0;
                        console.log("Attribute is not defined");
                    }
                    console.log("Got called ");
                    obj[attributename].data = this.restaurants[attributename];
                    obj[attributename].nbreCommande ++;
                }
            }
        });
        return obj;
    }

    listAllCommandes(){
        return this.commandes;
    }

    addNewCommandes(params){
        this.commande_id++;
        if(JSON.stringify(params) === '{}'){
            return;
        }

        params["idCommande"] = this.commande_id;
        this.commandes.push(params);
        //console.log("La Commandes " + JSON.stringify(params) + " à été ajouté");
    }

    getCommandesByRestaurantId(id){
        var obj = [];
        if (this.commandes.length === 0 ){
            return obj;
        }
        this.commandes.forEach(( commande, index) => {
            if(parseInt(commande["restaurant_id"]) == id){
                obj.push(commande); 
            }
        });
        return obj;
    }

    getCommandesById(id){
        var obj = {};
        if (this.commandes.length === 0 ){
            return obj;
        }
        this.commandes.forEach(( commande, index) => {
            if(parseInt(commande.idCommande) == id){

                console.log("GetcommandebyID : " + JSON.stringify(commande));
                obj = commande;  
            }
        });

        return obj;
    }


    prepareCommandesById(id){
        var obj = [];
        if (this.commandes.length === 0 ){
            return obj;
        }
        this.commandes.forEach(( commande, index) => {
            if(parseInt(commande.idCommande) == id){
                commande.status = 1;
                commande.date_prepararion = new Date();  
            }
        });
    }

    enleverCommandesById(id, idLivreur){
        var obj = [];
        if (this.commandes.length === 0 ){
            return obj;
        }
        this.commandes.forEach(( commande, index) => {
            if(parseInt(commande.idCommande) == id){
                commande.status = 2;
                commande.date_enlevement = new Date();
                commande['id_livreur'] = idLivreur;
            }
        });
    }

    livrerCommandesById(id){
        var obj = [];
        if (this.commandes.length === 0 ){
            return obj;
        }
        this.commandes.forEach(( commande, index) => {
            if(parseInt(commande.idCommande) == id){
                commande.status = 3;
                commande.date_livraison = new Date(); 
            }
        });
    }

    annulerCommandesById(id){
        var obj = [];
        if (this.commandes.length === 0 ){
            return obj;
        }
        this.commandes.forEach(( commande, index) => {
            if(parseInt(commande.idCommande) == id){
                commande.status = 4;  
            }
        });
    }

    registerLivreur(livreur){


        this.livreur_id++;
        var skip = false;
        var id_o = 0; 
        if (this.livreurs.length === 0 ){
            livreur.id = this.livreur_id;
            this.livreurs.push(livreur);
            id_o = livreur.id;
        }else{
            this.livreurs.forEach(( livreur_e, index) => {
                if(livreur_e.prenom.localeCompare(livreur.prenom) == 0 && livreur_e.nom.localeCompare(livreur.nom) ==  0){
                    console.log("Bereits registrered"  + JSON.stringify(livreur_e["id"]));
                    skip = true;
                    id_o = livreur_e["id"]; 
                }
            });

            if(!skip){
                console.log("Call again");
                livreur.id = this.livreur_id;
                this.livreurs.push(livreur);
                id_o = livreur.id;
            }
        }
        return id_o;
    }


    listLivreurs(){
        return this.livreurs;
    }

    getLivreurById(id){
        console.log("Persistant data id = 0 ->  \n" + JSON.stringify(this.livreurs[id - 1]));
        return this.livreurs[id-1];
    }

    async getGeoCode(adresse){

        var obj = {};
        geoCoder.geocode(adresse)
        .then((res)=> {
            obj =  {"longitude" : res[0].longitude,"latitude" : res[0].latitude};
      }).catch((err)=> {
        console.log(err);
      });

      return obj;
    }

    viderPilesDeCommande(){
        this.commandes = [];
        this.commande_id = 0;
    }

}

module.exports = PersistentServices;