const express = require('express');
const router = new express.Router();

const nodeGeocoder = require('node-geocoder');
const {check , validationResult } = require('express-validator/check');
const { Session } = require('inspector');

let actuelleLivreur = -1;

let options = {
  provider: 'openstreetmap'
};
 
let geoCoder = nodeGeocoder(options);

/* GET users listing. */
var globalErrorLogger = {};

module.exports = params => {

  const { persistentServices } = params;

  router.get('/', (req, res, next) => {


    if(Object.entries(globalErrorLogger).length === 0){
      errors = false
    }else{
      errors = globalErrorLogger;;
    }
    globalErrorLogger = {};

    console.log(errors);

    data_o = params.getRestaurants();
    res.render('loginLivreur', { data: data_o , errors: errors, title: 'Login Livreur' });
    console.log("Request got called for Livreurs  " + JSON.stringify(params.listAllCommandes()));
  });

  router.get('/:id', (req, res, next) => {

    data_o = params.listRestaurantsWithCommandes();
  
    console.log("Livreurs " + JSON.stringify(data_o));
    res.render('restaurantLivreur', { data: data_o,  title: 'Preparation commandes' });
  });


  router.post('/',[
    check('fname')
      .trim()
      .not().isEmpty()
      .escape()
      .isLength({min:3})
      .withMessage('Un nom est obligatoire'),
    check('lname')
      .trim()
      .not().isEmpty()
      .escape()
      .isLength({min:3})
      .withMessage('Le prenom est obligatoire'),], (req, res, next) => {



    const errors = validationResult(req);
    if(!errors.isEmpty()){
        globalErrorLogger = errors.array();
      return res.redirect("/livreurs/");
    }
    const { id , name} = req.params;

    
    var livreur = {};
    livreur.prenom= req.body.fname;
    livreur.nom= req.body.lname;

    idLivreur = params.registerLivreur(livreur);
 
    actuelleLivreur = idLivreur;

    return res.redirect("/livreurs/" + idLivreur);
   
  });



  

  router.get('/enlevercommande/:id', async (req, res, next) => {
    
    try {

      const { id , name} = req.params;

      id_o = parseInt(id);

      data_o = params.getCommandesByRestaurantId(id_o);
      restaurant = params.getRestaurantById(id_o);
      var coordonees = {};
      
      await geoCoder.geocode(restaurant.adresse)
        .then((res)=> {   
          coordonees["longitude"] = res[0].longitude;
          coordonees["latitude"] = res[0].latitude;
        })
        .catch((err)=> {
          console.log(err);
        }); 
      } catch (error) {
        console.log(error);
      }

     console.log(JSON.stringify(restaurant.adresse));

     res.render('enlevementCommande', {data: data_o, coordonees: coordonees, title: 'Restaurant' });
  });


  router.post('/enlevercommande/',[
    check('idCommande')
      .trim()
      .isLength({min:0})
      .custom( (value, { req}) => {
        if (params.getCommandesById(parseInt(req.body.idCommande))){
            throw new Error('Le numero de commande entrer ne corresponds a aucune commande ');
        }
        return true;
      })
      .withMessage('Un Identifiant est obligatoire'),], async (req, res, next) => {
    
    try {

      //const { id , name} = req.params;

      id_o = parseInt(req.body.idCommande);

      commande = {};

      params.enleverCommandesById(id , idLivreur);

      commande = params.getCommandesById(id_o);

      console.log(JSON.stringify(commande));
      var coordonees = {};
      
      await geoCoder.geocode(commande["user-rue"] + " " 
        + commande["user-nbboite"] + " "
        + commande["user-Cp"] + " "
        + commande["user-Commune"])
        .then((res)=> {   
          coordonees["longitude"] = res[0].longitude;
          coordonees["latitude"] = res[0].latitude;
        })
        .catch((err)=> {
          console.log(err);
        }); 
      } catch (error) {
        console.log(error);
      }


     res.render('livrerCommande', {data: commande,id_l : idLivreur,  coordonees: coordonees, title: 'Restaurant' });
  });






  router.post('/livrer/', (req, res, next) =>{

    const obj = req.body;
    id = JSON.parse(obj.id);
    console.log(id)
    params.livrerCommandesById(id);
    //res.render('Commander', { data: params.getRestaurants(), title: 'Restaurant ' + JSON.stringify(req.body) });
    return res.send("Done");
        
  });
  
  return router;
}

