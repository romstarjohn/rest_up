

/**
 * Define logic for object commande
 */
 class PersistentServices{

    /**
     * Constructor
     */
    constructor(){
        this.restaurants = this.getRestaurant();
        this.commandes = [];
        this.gestionnaires = {};
        this.livreurs = {};
    }


 }