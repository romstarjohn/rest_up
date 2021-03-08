window.onload = function() {
    /* your stuff */
  
    var data = {};
  
    $(document).on('click','.prep_btn',function(){
      
      var id = this.getAttribute("attrib_id");
      var nbreRepas = this.getAttribute("attrib_nbreRepas");
      var retVal = confirm("La commande préparé contient telle " +  nbreRepas + " répas ?");
        if( retVal == true ) {
          $.ajax({
            type: "POST",
            url: "http://localhost:3000/restaurants/preparer",
            data : {id : id},
            success : (function(response){

              if(data.success == true){ // if true (1)
                
                location.reload(); // then reload the page.(3)
               
             }
              window.location.reload();
            return true;
            })
          });
        } else {
          return false;
        }
    
    });
  
  
  
    const doAjaxWithDelay = (delay)=>{
      setTimeout(()=>{

        restaurant_id = $('#id_restaurant').html();
        console.log("AJAX CALL "+ restaurant_id);
        $.ajax({
          type: "GET",
          url: "http://localhost:3000/restaurants/data/"+restaurant_id,
        }).done(function(response){
          data = response;
          console.log("Data was fetched" + JSON.stringify(data));
    
          
    

          $("#rest_preparer").empty().append(data.rest_preparer);
          $("#rest_enlever").empty().append(data.rest_enlever);
          $("#deja_enlever").empty().append(data.deja_enlever);
          $("#duree_moyenne_prep").empty().append(data.duree_moyenne_prep);
          $("#heureMiseAjour").empty().append(data.heureMiseAjour);
          
         
        var tableau;

        if (data.data.length == 0) {

          $('#table-body').empty().append(`<tr><td id="">Aucune Commande n'a encore été enregistré pour ce restaurant</td></tr>`);
        } else { 
          //content += `<table>`;
          tableau = "";
          for(var attributename in data.data){
              if (data.data[attributename].status == 0){

                tableau += `<tr>`;
                tableau += `<td class="date_debut">` + data.data[attributename].date_debut + `</td>`;
                tableau += `<td class="idCommande" scope="row">` + data.data[attributename].idCommande + `</td>`;
                tableau += `<td class="user-nbrepas">` + data.data[attributename]["user-nbrepas"] + `</td>`;
                tableau += `<td><a class="prep_btn" attrib_id = "`+ data.data[attributename].idCommande +`" attrib_nbreRepas="` +data.data[attributename]["user-nbrepas"] + `">Preparer</a></td>`;
                tableau += `</tr>`;

                

            }
          }
          $('#table-body').empty().append(tableau);
          
         } 
        
            doAjaxWithDelay(10000)
               
        })
      },delay)
    }
    doAjaxWithDelay(0);
  
  
  
  
    
  
  
    
  
  
  
  
  }
  