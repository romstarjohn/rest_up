const express = require('express');
const router = new express.Router();

//Importing check from module express-validation for validation purpose
const {check , validationResult } = require('express-validator/check');
const { Session } = require('inspector');

const nodeGeocoder = require('node-geocoder');

let options = {
    provider: 'openstreetmap'
  };
   
let geoCoder = nodeGeocoder(options);

var globalErrorLogger = {};


module.exports = params => {




  

  /* GET users listing. */
  router.get('/', (req, res, next) => {

    var fs = require('fs');
    var obj = JSON.parse(fs.readFileSync('./restaurant.json', 'utf8'));

    console.log(obj);
      res.render('Commander', { data: obj, title: 'Restaurant' });

  });

  router.get('/commander/', (req, res, next) =>{
    var fs = require('fs');
    var obj = JSON.parse(fs.readFileSync('./restaurant.json', 'utf8'));

    console.log(obj);
      res.render('Commander', { data: obj, title: 'Restaurant' });
    
  });

  router.get('/commander/:id', (req, res, next) =>{
    const { id , name} = req.params;
    var fs = require('fs');
    var obj = JSON.parse(fs.readFileSync('./restaurant.json', 'utf8'));

    // fetching the error request from sessions in order to send to the templates
    
    if(Object.entries(globalErrorLogger).length === 0){
      errors = false
    }else{
      errors = globalErrorLogger;;
    }
    globalErrorLogger = {};

    console.log(errors);
    
    res.render('formule', { id_o: id, errors : errors, title: 'Restaurant' });
        
  });

  router.post('/enregistrer/', (req, res, next) =>{


    //res.writeHead(200, {"Content-Type": "application/json"});

    console.log(parseInt(req.body.restaurant_id));


    
    const obj = {};
    var date_debut = new Date(); 
    obj.idCommande = 0;
    obj["restaurant_id"]= parseInt(req.body.restaurant_id);
    obj["usernom"]= req.body.usernom;
    obj["user-nbrepas"]= parseInt(req.body["user-nbrepas"]);
    obj["user-rue"] = req.body["user-rue"];

    if(Number.isNaN(req.body["user-nbmaison"])){
      obj["user-nbmaison"] = '';
    }else{
      obj["user-nbboite"]= parseInt(req.body["user-nbmaison"]);
    }

    obj["user-Cp"]= parseInt(req.body["user-Cp"]);
    if(Number.isNaN(req.body["user-nbboite"])){
      obj["user-nbboite"] = "";
    }else{
      obj["user-nbboite"]= parseInt(req.body["user-nbboite"]);
    }
    obj["user-Commune"]= req.body["user-Commune"];
    obj["date_debut"] = date_debut;
    obj["status"] = 0;
    obj["date_prepararion"] = '';
    obj["date_enlevement"] = '';
    obj["date_livraison"]= '';
    obj["id_livreur"]=-1;
    obj.date_livraison = '';
    params.addNewCommandes(obj);

    console.log(obj);
    res.send("Done");
        
  });


  router.post('/commander/',[
    check('usernom')
      .trim()
      .not().isEmpty()
      .withMessage('Un nom est obligatoire'),
    check('user-nbrepas')
      .trim()
      .isInt({ min: 0, max: 20 })
      .withMessage('Un nombre de repas pouvant être commandé est entre 0 et 20'),
    check('user-rue')
      .trim()
      .isLength({min: 1})
      .escape()
      .withMessage('Ce chanps est obligatoire'),
    check('user-nbmaison')
      .trim()
      .escape(),
    check('user-nbboite')
      .trim()
      .escape(),
    check('user-Cp').isInt({ min: 1000, max: 9999 })
      .withMessage('Un Code postal valide est un nombre entre 1000 et 9999'),
    check('user-Commune')
      .trim()
      .isLength({min: 1})
      .escape()
      .withMessage('Ce chanps est obligatoire'),  

  ], async (req, res, next) =>{


    //Use validatorResult function provided by Access Validator to received error
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        globalErrorLogger = errors.array();
      return res.redirect("/order/commander/" + req.body.restaurant_id);
    }


    const obj = {};
    var coordonees = {};


    try {
      

      var date_debut = new Date(); 
      
      obj.idCommande = 0;
      obj["restaurant_id"]= parseInt(req.body.restaurant_id);
      obj["usernom"]= req.body.usernom;
      obj["user-nbrepas"]= parseInt(req.body["user-nbrepas"]);
      obj["user-rue"] = req.body["user-rue"];

      if(Number.isNaN(req.body["user-nbmaison"])){
        obj["user-nbmaison"] = '';
      }else{
        obj["user-nbboite"]= parseInt(req.body["user-nbmaison"]);
      }
  
      obj["user-Cp"]= parseInt(req.body["user-Cp"]);
      if(Number.isNaN(req.body["user-nbboite"])){
        obj["user-nbboite"] = "";
      }else{
        obj["user-nbboite"]= parseInt(req.body["user-nbboite"]);
      }

      
      obj["user-Commune"]= req.body["user-Commune"];
      obj["date_debut"] = date_debut;
      obj["status"] = 0;
      obj["date_prepararion"] = null;
      obj["date_enlevement"] = null;
      obj["date_livraison"]=null;
      obj["id_livreur"]=-1;
      obj.date_livraison = '';
      //params.addNewCommandes(obj);


      await geoCoder.geocode(obj["user-rue"] + " " 
      + obj["user-nbboite"] + " "
      + obj["user-Cp"] + " "
      + obj["user-Commune"])
        .then((res)=> {
          coordonees =  {"longitude" : res[0].longitude,"latitude" : res[0].latitude};
          console.log(coordonees);
      }).catch((err)=> {
        console.log(err);
      });

      console.log(coordonees);
    } catch (error) {
      console.log(error)
    }
    
    res.render('confirmationCommande', { data: obj, coordonees: coordonees, title: 'Restaurant' });
        
  });

  return router;
}




