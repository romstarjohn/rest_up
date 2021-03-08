const express = require('express');
const router = new express.Router();



module.exports = params => {

  const { persistentServices } = params;
  
  

  router.get('/', (req, res, next) => {

    data_o = params.getRestaurants();
    res.render('loginRestaurant', { data: data_o , title: 'Login Restaurant' });
    console.log("Request got called for Livreurs  " + JSON.stringify(params.listAllCommandes()));
  });

  
  router.post('/', (req, res, next) => {

    
    id = req.body["id"];
    console.log(req.params);
    //const { id , name} = req.params;
    id_o = parseInt(id);

    console.log("Restaurant Id " + id_o );
    data_o = params.getCommandesByRestaurantId(id_o);
    
    
    
    console.log("Restaurant Data" + JSON.stringify(data_o) );
    var rest_preparer = 0;
    var rest_enlever = 0;
    var deja_enlever = 0;
    var duree_moyenne_prep = 0;
    /**
     * Status des commandes
     * - '0' -- creer 
     * - '1' -- preparer
     * - '2' -- enlevee
     * - '3' -- creer
     * - '4' -- annuler
     * */
    data_o.forEach(element => {
      switch (element.status) {
        case 0:
          rest_preparer++;
          break;
        case 1:
          duree_moyenne_prep = duree_moyenne_prep + (element.date_prepararion - element.date_debut);
          rest_enlever++;
          break;
        case 2:
          deja_enlever++;
          break;  
        default:
          break;
      }
    });
    obj_o = {};

    obj_o.rest_preparer = rest_preparer;
    obj_o.rest_enlever = rest_enlever;
    obj_o.deja_enlever = deja_enlever;
    obj_o.duree_moyenne_prep = duree_moyenne_prep;
    obj_o.heureMiseAjour = new Date();
    obj_o.data = data_o.slice().reverse();

    console.log( "Data :: " + JSON.stringify(obj_o.data));
    // res.render('loginLivreur', { data: data_o , title: 'Login Livreur' });
    console.log("Request got called for Livreurs");
    res.render('preparation', { obj_o: obj_o, id : id_o, title: 'Preparation commandes' + id_o });
  });


  router.get('/data/:id', (req, res, next) => {

    const { id , name} = req.params;
    id_o = parseInt(id);
    data_o = params.getCommandesByRestaurantId(id_o);
    var rest_preparer = 0;
    var rest_enlever = 0;
    var deja_enlever = 0;
    var duree_moyenne_prep = 0;


    /**
     * Status des commandes
     * - '0' -- creer 
     * - '1' -- preparer
     * - '2' -- enlevee
     * - '3' -- creer
     * - '4' -- annuler
     * */
    data_o.forEach(element => {
      switch (element.status) {
        case 0:
          rest_preparer++;
          break;
        case 1:
          duree_moyenne_prep = duree_moyenne_prep + (element.date_prepararion - element.date_debut);
          rest_enlever++;
          break;
        case 2:
          deja_enlever++;
          break;  
        default:
          break;
      }
    });



    obj_o = {};

    obj_o.rest_preparer = rest_preparer;
    obj_o.rest_enlever = rest_enlever;
    obj_o.deja_enlever = deja_enlever;
    obj_o.duree_moyenne_prep = new Date(duree_moyenne_prep).toISOString().slice(11, -1);
    obj_o.heureMiseAjour = new Date();
    obj_o.data = data_o.slice().reverse();

    console.log(JSON.stringify(obj_o));
    // res.render('loginLivreur', { data: data_o , title: 'Login Livreur' });
    console.log("Request got called for Livreurs");

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(obj_o));
  });
  
  router.post('/preparer/', (req, res, next) =>{

    const obj = req.body;
    id = JSON.parse(obj.id);
    console.log(id)
    params.prepareCommandesById(id);
    //res.render('Commander', { data: params.getRestaurants(), title: 'Restaurant ' + JSON.stringify(req.body) });
    res.end("Done");
        
  });
  
    
  return router;
}


