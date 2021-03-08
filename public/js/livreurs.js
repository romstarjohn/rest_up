//const livreurs = require("../../routes/livreurs");

var map;
var marker;



function initMap() {
  
    const uluru = { lat: 50.846230, lng: 4.353010 };

    element = document.getElementById("map");
    // Defining the maps options
    var options = {
        center: { 
            lat: 50.85, 
            lng: 4.34 
        },
        zoom: 12,
    }


    map = new google.maps.Map(element, options);



    $.ajax({
        type: "GET",
        url: "http://localhost:3000/api/restaurantsWithCommande",
        dataType: "json",
      }).done(function(data){


        console.log(JSON.stringify(data));
        for(var element in data){

            console.log(JSON.stringify(data[element].coordonnes.latitude));
            console.log("long : " + data[element].coordonnes.longitude  + " , lat : " + data[element].coordonnes.latitude);
            
            addMarker({lat : data[element].coordonnes.latitude , lng: (data[element].coordonnes.longitude)},{"id": data[element].data.id, "nbreCommande": data[element].nbreCommande});
            
        }  
    
    });

    
    // Add Marker function
    function addMarker(coords,content){

        console.log(JSON.stringify(coords));
        var marker = new google.maps.Marker({
            position: coords,
            map: map,
        });

        if(content){
            var infowindow = new google.maps.InfoWindow();
            infowindow.setContent(`<p> ` + content.nbreCommande + ` Commande  <a href="/livreurs/enlevercommande/`+content.id + `">Ouvrir</a></p>`);
            infowindow.open(map, marker);
        }

    }
    

    var infoWindow = new google.maps.InfoWindow({
        content:'<h1>Mes restaurants</h1>'
    });




   
}
