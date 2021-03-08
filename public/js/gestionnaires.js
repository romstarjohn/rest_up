window.onload = function() {
    /* your stuff */
  
    var data = {};
  
    $(document).on('click','.prep_btn',function(){
      
      var id = this.getAttribute("attrib_id");
      console.log("Commande : " + id);
      var retVal = confirm("La commande seras annuler : Confirmer ?");
        if( retVal == true ) {
          $.ajax({
            type: "POST",
            url: "http://localhost:3000/gestionaires/annuler/",
            data : {id : id},
            success : (function(response){
              location.reload()
              return true;
            })
          });
        } else {
          return false;
        }
    
    });
  
  
  
    const doAjaxWithDelay = (delay)=>{
      setTimeout(()=>{

        $.ajax({
          type: "GET",
          url: "http://localhost:3000/api/statisticsGestionnaires",
        }).done(function(response){
          data = response;
          console.log("Data was fetched" + JSON.stringify(data));
    
          
    

          $("rest_preparer").empty().append(rest_preparer);
          $("rest_enlever").empty().append(data.rest_enlever);
          $("deja_enlever").empty().append(data.deja_enlever);
          $("deja_livrer").empty().append(data.duree_moyenne_prep);
          $("heureMiseAjour").empty().append(data.heureMiseAjour);
          
          
         
        if (data.data.length == 0) { 
          $('#error').html("Aucune nouvelle commande pour ce restaurants")
        } else { 
          tableau = "";
          for(var attributename in data.data){
            tableau += `<tr>`;
            
            tableau += `<td class="date_debut" scope="row">` + data.data[attributename].date_debut+ `</td>`;
            tableau += `<td class="adresse">` + data.data[attributename]["user-rue"] + ` ` + data.data[attributename]["user-nbboite"] + ` ` + data.data[attributename]["user-Cp"] + ` ` + data.data[attributename]["user-Commune"] + `</td>`;
            tableau += `<td class="user-nbrepas">` +  data.data[attributename].restaurant["name"] + `</td>`
            tableau += `<td class="user-nbrepas">` +  data.data[attributename]["date_prepararion"] + `</td>`;
            tableau += `<td class="user-nbrepas">` +  data.data[attributename].livreur["nom"] + ` ` +  data.data[attributename].livreur["prenom"] + `</td>`;
            tableau += `<td class="user-nbrepas">` +  data.data[attributename]["date_enlevement"] + `</td>`;
            tableau += `<td class="user-nbrepas">` +  data.data[attributename]["date_livraison"] + `</td>`;
            tableau += `<td class="user-nbrepas">` +  data.data[attributename]["statusString"] + `</td>`;
            tableau += `<td><a class="prep_btn" attrib_id = "`+ data.data[attributename].idCommande  + `">Annuler</a></td>`;    
            tableau += `</tr>`;    
          }
          $('#table-body').empty().append(tableau);
        } 
        
            doAjaxWithDelay(10000)
          //$("#contenue").empty().append(content);          
        })
      },delay)
    }
    doAjaxWithDelay(0);
  
  
  
  
    
  
  
    
  
  
  
  
  }
  