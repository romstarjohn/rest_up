

var map;
var marker;



var data_obj = {
    'restaurant_id' : $("#restaurant_id").html(),
    'usernom' : $("#usernom").html(),
    'user-nbrepas' : $("#user-nbrepas").html(),
    'user-rue' : $("#user-rue").html(),
    'user-nbmaison' : $("#user-nbmaison").html(),
    'user-nbboite' : $("#user-nbboite").html(),
    'user-Cp' : $("#user-Cp").html(),
    'user-Commune' : $("#user-Commune").html(),
}

console.log(JSON.stringify(data_obj));



$(document).on('click','#confirmer',function(){
      
    $.ajax({
        type: "POST",
        url: "http://localhost:3000/order/enregistrer",
        data : JSON.stringify(data_obj),
        contentType: "application/json; charset=utf-8",
        dataType: "text",
        success : (function(response){
            console.log("Votre commande a été enrégistrer");
            alert("Votre commande a été enrégistrer, vous etes rediriger");
            window.location.replace("/order");
        return true;
        }),
        error: function(data){
            alert("fail" + JSON.stringify(data));
        }
    });
   
  
  });





  $(document).on('click','#livrerCommande',function(){
    


    var id_o = {
        "id" : $("#idCommande").html(),
    }

    console.log(id_o)
    
    $.ajax({
        type: "POST",
        url: "http://localhost:3000/livreurs/livrer",
        data : id_o,
        //contentType: "application/json; charset=utf-8",
        dataType: "text",
        success : (function(response){

            id_l = $('#idLivreur').html()
            window.location.replace("/livreurs/" + id_l);
        return true;
        }),
        error: function(data){
            console.log("fail" + JSON.stringify(data));
        }
    });
   
  
  });




  


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



   var latitude = parseFloat($.trim($("#latitude").html()));
   var longitude = parseFloat($.trim($("#longitude").html()));

   console.log( typeof latitude  + "  l . " + typeof longitude);
    
    addMarker({lat : latitude , lng: longitude});

    // Add Marker function
    function addMarker(coords,content){

        console.log(JSON.stringify(coords));
        var marker = new google.maps.Marker({
            position: coords,
            map: map,
        });

        if(content){
            var infowindow = new google.maps.InfoWindow();
            infowindow.setContent(" " + content);
            infowindow.open(map, marker);
        }

    }
    

    var infoWindow = new google.maps.InfoWindow({
        content:'<h1>Mes restaurants</h1>'
    });   
}
