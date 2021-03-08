$(document).on('click','.prep_btn',function(){
      

    var retVal = confirm("Cette action supprimera toutes les commandes de la plateforme : Confirmer ?");
      if( retVal == true ) {
        $.ajax({
          type: "POST",
          url: "http://localhost:3000/gestionaires/vidercommandes/",
          success : (function(response){

            alert("Les données ont été supprimé");
            window.location.replace("/");
            return true;
          })
        });
      } else {
        return false;
      }
  
  });