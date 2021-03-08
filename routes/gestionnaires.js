const express = require('express');
const router = new express.Router();

/* GET users listing. */

module.exports = params => {

  const { persistentServices } = params;
  
  router.get('/', (req, res, next) => {

    data_o = params.listAllCommandes();  



    var rest_preparer = 0;
    var rest_enlever = 0;
    var deja_enlever = 0;
    var deja_livrer = 0;
    var duree_moyenne_prep = 0;
    /**
     * Status des commandes
     * - '0' -- creer 
     * - '1' -- preparer
     * - '2' -- enlevee
     * - '3' -- livrer
     * - '4' -- annuler
     * */

    
    data_o.forEach(element => {

      switch (element.status) {
        case 0:
          rest_preparer++;
          element.statusString = "Crée";
          break;
        case 1:
          rest_enlever++;
          element.statusString = "Préparée";
          break;
        case 2:
          deja_enlever++;
          element.statusString = "enlevée";
          break;
        case 3:
          deja_livrer++;  
          element.statusString =  "livrée";
          break;
        case 4:  
          element.statusString =  "annulée";
          break;
        default:
          break;
      }

      // Lie l'object restaurant a l'object commande
      element.restaurant = params.getRestaurantById(element.restaurant_id);


      // Lie l'object livreur a l'object commande, renvoie undefined si aucun livreur ne corresponds
      element.livreur = params.getLivreurById(element.id_livreur);

      // Definie un livreur vide au cas ou une commande n'a pas encore été livrée
      if(element.livreur === undefined){
        element.livreur = {
          'prenom' : '',
          'nom' : ''
        };
      }
      console.log(typeof element.livreur)

    });

    obj_o = {};

    obj_o.rest_preparer = rest_preparer;
    obj_o.rest_enlever = rest_enlever;
    obj_o.deja_enlever = deja_enlever;
    obj_o.deja_livrer = deja_livrer;
    obj_o.heureMiseAjour = new Date();


    obj_o.data = data_o.slice().reverse();

    // res.render('loginLivreur', { data: data_o , title: 'Login Livreur' });
    console.log("Request got called for Livreurs");
    res.render('gestionnaires', { obj_o: obj_o, title: 'Preparation commandes' });
  });

  router.post('/annuler', (req, res, next) => {


    const obj = req.body;
    id = JSON.parse(obj.id);
    console.log(id)
    params.annulerCommandesById(id);
    //res.render('Commander', { data: params.getRestaurants(), title: 'Restaurant ' + JSON.stringify(req.body) });
    res.end("Done");
  });

  router.get('/vidercommandes', (req, res, next) => {

    res.render('alert', { title: 'Vider toutes les commandes' });
  });

  router.post('/vidercommandes', (req, res, next) => {
    
    params.viderPilesDeCommande();

    res.end("Done");
  });
  
  
  return router;
}