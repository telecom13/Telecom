//----------------------------------VARIABLES-------------------------------------------------//

var lat;   //variable correspond à la longitude
var lng;   //variable correspond à la latitude
var note = new Array();	////tableau contient la liste des notes
var directionsDisplay;
var directionsService;
var map;

	
//Fonction pour le géolocalisation	
	function Geolocalisation(){
			var div = document.getElementById("map_canvas");
    if (!navigator.geolocation) {
        div.innerHTML = 'Erreur : votre navigateur ne supporte pas l\'API de Géolocalisation HTML 5';
        return;
    }
    div.innerHTML = 'Demande en cours...';
	navigator.geolocation.getCurrentPosition(function(position) {

		lat = position.coords.latitude;
        lng = position.coords.longitude;
            div.innerHTML = 'Lat: '+lat+'  Lng: '+lng;
            div.style.height = '500px';
			div.style.width = '100%'
            var options = {
                zoom: 17,
                center: new google.maps.LatLng(lat, lng),
                mapTypeId: google.maps.MapTypeId.HYBRID
            };
            map = new google.maps.Map(div, options);
            var marker = new google.maps.Marker({ position: options.center });
            marker.setMap(map);
        },{maximumAge: 60000, timeout: 2000}
	);
}

//Fonction pour créer une note géolocalisé, et de la stocker en local
function Creer_note(){
	var t=localStorage.getItem("nbr_notes");
	t++;
	var notes=new Array();
	var nom =$("#nom_de_note").val();
	var commentaire=$("#commentaire_note").val();
	var dateactuel=new Date();
	dateactuel=dateactuel.toLocaleDateString()+' - '+dateactuel.toLocaleTimeString();
	notes.push("Nom :",nom);
	notes.push("Commentaire :",commentaire);
	notes.push("Longitude :", lng);
    notes.push("Latitude :",lat);
	notes.push("Date d'enregistrement :",dateactuel);
	localStorage.setItem("une_note"+t, notes);
	localStorage.setItem("nbr_notes", t);
	document.getElementById('nom_de_note').value = '';
	document.getElementById('commentaire_note').value = '';
	alert("Note cree avec succee.");
	
	}
 // Fonction permet d'afficher la liste des notes de manière dynamique, dans des composants démontables «Collapse Bootstrap » . 	
	function Liste_notes(){
		var j=1;
		var t=localStorage.getItem("nbr_notes");
		while(j<=t){
			var note = localStorage.getItem("une_note"+j);
			var a=new Array();
			a=note.split(",");
			var i=0;
		
			$("#liste_notes").append("<div class='accordion-group'><div class='accordion-heading'><a class='accordion-toggle' data-toggle='collapse' data-parent='#liste_notes' href='#collapse"+j+"'>Note "+j+"</a></div><div id='collapse"+j+"' class='accordion-body collapse'><div class='accordion-inner'><div class='controls'><div class='span2'>"+a[i]+"</div> <div class='span3'>"+a[++i]+"</div></div><br/><div class='controls'><div class='span2'>"+a[++i]+"</div> <div class='span3'>"+a[++i]+"</div></div><br/><div class='controls'><div class='span2'>"+a[++i]+"</div> <div class='span3'>"+a[++i]+"</div></div><br/><div class='controls'><div class='span2'>"+a[++i]+"</div> <div class='span3'>"+a[++i]+"</div></div><br/><div class='controls'><div class='span2'>"+a[++i]+"</div> <div class='span3'>"+a[++i]+"</div></div><br/></div></div>	</div>");
			j++;
		}
	}

// Fonction permet de supprimer toutes les notes enregistrés(variable initialisé à 0 ==> les nouvelles notes vont écraser les enciennes)
	function supprimer_notes(){
			localStorage.setItem("nbr_notes",0);
			alert("les notes sont supprimees avec succees ");
		}

//Fonction permet d'afficher l'ensemble des notes à choisir pour créer un parcours
	function parcours_notes(){
		var j=1;
		var t=localStorage.getItem("nbr_notes");
		while(j<=t){
			var note = localStorage.getItem("une_note"+j);
			var a=new Array();
			a=note.split(",");
			var i=0;
		
			$("#notes").append("<div class='bs-docs-example tooltip-demo'><ul class='bs-docs-tooltip-examples'><div data-toggle='tooltip' data-placement='top' title='"+a[i+3]+"'><label class='checkbox inline'><input type='checkbox' id='inlineCheckbox1' value='"+j+"'>"+a[i+1]+"</div></ul></label></div>");
			i+=11;
			j++;
			
			}
		}
//Fonction permet de créer un parcours, et de le stocker en local		
		function Creer_parcours(){
			var t=localStorage.getItem("nbr_parcours");
			t++;
			var notes = new Array();
			var j=0;
			var c = document.getElementById('accordion2').getElementsByTagName('input');
			for (var i = 0; i < c.length; i++) {
				if (c[i].type == 'checkbox' && c[i].checked == true) {
					notes[j++]=c[i].value;
				}
			}
			var parcours=new Array();
			var nom =$("#nom_de_parcours").val();
			var commentaire=$("#commantaire_parcours").val();
			var dateactuel=new Date();
			dateactuel=dateactuel.toLocaleDateString()+' - '+dateactuel.toLocaleTimeString();
			parcours.push("Nom :",nom);
			parcours.push("Commentaire :",commentaire);
			parcours.push("Date d'enregistrement :",dateactuel);
			parcours.push("La liste des notes :");
			parcours.push(j);
			parcours[8]=new Array();
			for(var i=0;i<j;i++){
				var note = localStorage.getItem("une_note"+notes[i]);
				var a=new Array();
				a=note.split(",");
				parcours[8][i]=a[1];
			}
			for(var i=0;i<j;i++){
			parcours.push(notes[i]);
			}
			parcours.push(0);
			localStorage.setItem("parcours"+t, parcours);
			localStorage.setItem("nbr_parcours", t);
			var r=localStorage.getItem("parcours"+t);
			location.reload(true);		
	
		}
	//Fonction permet d'afficher la liste des parcours pour l'admin, avec la possibilité de visualiser un parcours sur une carte	
		function Liste_parcours_admin(){
			var j=1;
			var t=localStorage.getItem("nbr_parcours");
			while(j<=t){
				var parcours = localStorage.getItem("parcours"+j);
				var a=new Array();
				a=parcours.split(",");
				var i=0;
				var qlq="";
				qlq+=a[8];
				for(var k=1;k<a[7];k++){
					qlq+=", ";
					qlq+=a[8+k];
				}
				$("#liste_parcours").append("<div class='accordion-group'><div class='accordion-heading'><a class='accordion-toggle' data-toggle='collapse' data-parent='#liste_parcours' href='#collapse"+j+"'>Parcours "+j+"</a></div><div id='collapse"+j+"' class='accordion-body collapse'><div class='accordion-inner'><div class='controls'><div class='span2'>"+a[i]+"</div> <div class='span4'>"+a[++i]+"</div></div><br/><div class='controls'><div class='span2'>"+a[++i]+"</div> <div class='span4'>"+a[++i]+"</div></div><br/><div class='controls'><div class='span2'>"+a[++i]+"</div> <div class='span4'>"+a[++i]+"</div></div><br/><div class='controls'><div class='span2'>"+a[++i]+"</div><div class='span4'>"+qlq+"</div><div class='span8'><button type='button' class='btn btn-primary' onclick='Afficher_parcours_admin(this.id)' id='"+j+"' data-loading-text='Loading...'>Visualiser parcours</button></div></div><br/></div></div>	</div>");
				j++;
				
			}
			Initializer_carte();
		}
	//Fonction permet d'afficher la liste des parcours pour l'admin, avec la possibilité de lancer un parcours sur une carte. 		
		function Liste_parcours_user(){
			var j=1;
			var t=localStorage.getItem("nbr_parcours");
			while(j<=t){
				var parcours = localStorage.getItem("parcours"+j);
				var a=new Array();
				a=parcours.split(",");
				var i=0;
				var qlq="";
				qlq+=a[8];
				for(var k=1;k<a[7];k++){
					qlq+=", ";
					qlq+=a[8+k];
				}
				$("#liste_parcours").append("<div class='accordion-group'><div class='accordion-heading'><a class='accordion-toggle' data-toggle='collapse' data-parent='#liste_parcours' href='#collapse"+j+"'>Parcours "+j+"</a></div><div id='collapse"+j+"' class='accordion-body collapse'><div class='accordion-inner'><div class='controls'><div class='span2'>"+a[i]+"</div> <div class='span4'>"+a[++i]+"</div></div><br/><div class='controls'><div class='span2'>"+a[++i]+"</div> <div class='span4'>"+a[++i]+"</div></div><br/><div class='controls'><div class='span2'>"+a[++i]+"</div> <div class='span4'>"+a[++i]+"</div></div><br/><div class='controls'><div class='span2'>"+a[++i]+"</div><div class='span4'>"+qlq+"</div><div class='span8'><button type='button' class='btn btn-primary' onclick='Afficher_parcours_user(this.id)' id='"+j+"' data-loading-text='Loading...'>Lancer parcours</button></div></div><br/></div></div>	</div>");
				j++;
				
			}
			Initializer_carte();
		}
	//Fonction qui permet de supprimer tous les parcours, (variable initialisé à 0 ==> les nouveaux parcours vont écraser les enciens)	
		function supprimer_parcours(){
			localStorage.setItem("nbr_parcours",0);
			alert("les parcours sont supprime avec succees ");
		}
		
   //Fonction permet de créer le parcours sur une carte. Elle prend en considération le nombre de visualisation de chaque parcours pour des raisons de statistiques (nous sommes en mode utilisateur)		
		function Afficher_parcours_user(id){
			 var a=new Array();
			 var pos; var depart; var arrivee;
			 var parcours = localStorage.getItem("parcours"+id);
			 a=parcours.split(",");
			var k = 8 + parseInt(a[7]);
			var waypts=new Array();
			for(var j=0;j<a[7];j++){
				var note=localStorage.getItem("une_note"+a[k]);
				var b=new Array();
				b=note.split(",");
				pos=new google.maps.LatLng(b[7],b[5]);
				if(j==0) 
					depart=pos;
				else{ 
					if (j==(a[7]-1))
						arrivee=pos;
					else{	
						waypts.push({
								location:pos,
								stopover:true
							});
						}
					}	
			}		
			Tracer_parcours(depart,waypts,arrivee);
			var i=k +parseInt(a[7]);
			j=1+parseInt(a[i]);
			a[i]=j; 
			parcours='';
			var parcours=new Array();
			for(j=0;j<=i;j++) parcours.push(a[j]);
			localStorage.setItem("parcours"+id, parcours);
			
	}
 //Fonction permet de créer le parcours sur une carte. Elle ne prend pas en considération le nombre de visualisation de chaque parcours (Mode utilisateur)	
	function Afficher_parcours_admin(id){
			 var a=new Array();
			 var pos; var depart; var arrivee;
			 var parcours = localStorage.getItem("parcours"+id);
			 a=parcours.split(",");
			var k = 8 + parseInt(a[7]);
			var waypts=new Array();
			for(var j=0;j<a[7];j++){
				var note=localStorage.getItem("une_note"+a[k]);
				var b=new Array();
				b=note.split(",");
				pos=new google.maps.LatLng(b[7],b[5]);
				if(j==0) 
					depart=pos;
				else{ 
					if (j==(a[7]-1))
						arrivee=pos;
					else{	
						waypts.push({
								location:pos,
								stopover:true
							});
						}
					}	
			}		
			Tracer_parcours(depart,waypts,arrivee);
			/*var i=k +parseInt(a[7]);
			j=1+parseInt(a[i]);
			a[i]=j; 
			parcours='';
			var parcours=new Array();
			for(j=0;j<=i;j++) parcours.push(a[j]);
			localStorage.setItem("parcours"+id, parcours);*/
			
	}
	
	
		
	//Permet d'initialiser la carte sur le ville SAINT ETIENNE
		function Initializer_carte() {
		  directionsDisplay = new google.maps.DirectionsRenderer();
		  var sainte = new google.maps.LatLng(45.4476531, 4.3848662);
		  var div=document.getElementById("parcours_carte");
		  div.innerHTML = 'Lat: '+lat+'  Lng: '+lng;
          div.style.height = '350px';
		  div.style.width = '100%'
		  var mapOptions = {
			zoom:14,
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			center: sainte
		  }
		  map = new google.maps.Map(div, mapOptions);
		  directionsDisplay.setMap(map);
		  directionsDisplay.setPanel(document.getElementById("directionsPanel"));
		}
  // Permet de tracer le parcours sur la carte
		function Tracer_parcours(depart,waypts,arrivee) {
			directionsService = new google.maps.DirectionsService();
			var request = {
			origin:depart,
			destination:arrivee,
			waypoints :waypts ,
			optimizeWaypoints: true,
			travelMode: google.maps.TravelMode.DRIVING,
		  };
		  directionsService.route(request, function(result, status) {
			if (status == google.maps.DirectionsStatus.OK) {
			  directionsDisplay.setDirections(result);
			}
		  });
}		
  //Permet de créer et de visualiser des courbres de statistiques en 3D, d'utilisation des parcours par les ustilisateur 
		function statistiques(){
			var chart; var chartData =new Array();
			var j=1; var k;
			var t=localStorage.getItem("nbr_parcours");
			while(j<=t){
				var parcours = localStorage.getItem("parcours"+j);
				var a=new Array();
				a=parcours.split(",");
				k = 8 + parseInt(a[7])+parseInt(a[7]);
				chartData.push({
                parcours: a[1],
                nombre: a[k],
                color: "#FF0F00"
				});
				j++;
			}
                // SERIAL CHART
                chart = new AmCharts.AmSerialChart();
                chart.dataProvider = chartData;
                chart.categoryField = "parcours";
                // the following two lines makes chart 3D
                chart.depth3D = 20;
                chart.angle = 30;

                // AXES
                // category
                var categoryAxis = chart.categoryAxis;
                categoryAxis.labelRotation = 90;
                categoryAxis.dashLength = 5;
                categoryAxis.gridPosition = "start";

                // value
                var valueAxis = new AmCharts.ValueAxis();
                valueAxis.title = "Nombre de visualisarion";
                valueAxis.dashLength = 5;
                chart.addValueAxis(valueAxis);

                // GRAPH            
                var graph = new AmCharts.AmGraph();
                graph.valueField = "nombre";
                graph.colorField = "color";
                graph.balloonText = "[[category]]: [[value]]";
                graph.type = "column";
                graph.lineAlpha = 0;
                graph.fillAlphas = 1;
                chart.addGraph(graph);

                // WRITE
                chart.write("chartdiv");
  
		}	
				