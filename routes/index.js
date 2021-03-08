const express = require('express');
const router = express.Router();

const nodeGeocoder = require('node-geocoder');

const customersRouter = require('./commander');
const restaurantsRouter = require('./restaurants');
const livreursRouter = require('./livreurs');
const gestionnairesRouter = require('./gestionnaires');
const usersRouter = require('./users');

let options = {
  provider: 'openstreetmap'
};
 
let geoCoder = nodeGeocoder(options);

/* GET home page. */



module.exports = params => {

  router.get('/', (req, res, next) => {
    console.log("Request got called for Homepage");
    res.render('index', { title: 'Restaurant' });
  });

  router.get('/api/restaurants', async (req, res, next) => {

    data_o = params.getRestaurants();
    var data = {};
    for( var element in data_o){
      var obj={};
      console.log(element);
      await geoCoder.geocode(data_o[element].adresse)
      .then((res)=> {
        obj = {
          "id" : data_o[element].id,
          "Name" : data_o[element].name,
          coordonnes:{
            "longitude" : res[0].longitude,
            "latitude" :res[0].latitude 
          }
        }
        console.log(obj);
      })
      .catch((err)=> {
        console.log(err);
      });
      data[element] = obj;
    }
    res.json(data);
  });


  router.get('/api/statisticsGestionnaires', async (req, res, next) => {

    data_o = params.listAllCommandes();  
    console.log("Restaurant Data" + JSON.stringify(data_o) );
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

      element.restaurant = params.getRestaurantById(element.restaurant_id);

      element.livreur = params.getLivreurById(element.id_livreur);
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

    console.log( "Data :: " + JSON.stringify(obj_o));
    
    res.json(obj_o);
  });

  router.get('/api/restaurantsWithCommande', async (req, res, next) => {

    data_o = params.listRestaurantsWithCommandes();
    var data = {};
    for( var element in data_o){
      var obj={};
      console.log(element);
      await geoCoder.geocode(data_o[element].data.adresse)
      .then((res)=> {
        obj = {
          "id" : data_o[element].id,
          "nbreCommande" : data_o[element].nbreCommande,
          "data" : data_o[element].data,
          coordonnes:{
            "longitude" : res[0].longitude,
            "latitude" :res[0].latitude 
          }
        }
        console.log(obj);
      })
      .catch((err)=> {
        console.log(err);
      });
      data[element] = obj;
    }
    res.json(data);
  });

  

  router.use('/restaurants', restaurantsRouter(params));
  router.use('/livreurs', livreursRouter(params));
  router.use('/gestionaires', gestionnairesRouter(params));
  router.use('/order', customersRouter(params));

  router.use('/users', usersRouter);
  //app.use('/validateform', indexRouter);


  // catch 404 and forward to error handler
  router.use((req, res, next) => {
    next(createError(404));
  });

  // error handler
  router.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    const status = err.status || 500;
    res.status(status);
    res.render('error', { title: `Error ${status}` });
  });
  
  
  return router;
}

