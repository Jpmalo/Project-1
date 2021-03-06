var map;
    var infowindow;
    var request;
    var service;
    var markers = [];
    var lat = 33.683015;
    var lng = -117.755315;

//initial map function:
    function myMapx() {

        //specify the map location
        var center = new google.maps.LatLng(lat, lng);
        //create map and add it to the page
        var mapDiv = document.getElementById('googleMap');
        //set the map placement and zoom
        map = new google.maps.Map(mapDiv, {
            center: center,
            zoom: 12
        });

  //search for gyms within 5 miles or 8047 meters
        request = {
            location: center,
            radius: 8047,
            types: ['gym']
        }
        infowindow = new google.maps.InfoWindow();

        service = new google.maps.places.PlacesService(map);

        service.nearbySearch(request, callback);
///NEW NEW NEW BEGIN
        // Create the search box and link it to the UI element.
        var input = document.getElementById('pac-input');
        var searchBox = new google.maps.places.SearchBox(input);
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

        // Bias the SearchBox results towards current map's viewport.
        map.addListener('bounds_changed', function() {
          searchBox.setBounds(map.getBounds());
        });


        var markers = [];
        // Listen for the event fired when the user selects a prediction and retrieve
        // more details for that place.
        searchBox.addListener('places_changed', function() {
          var places = searchBox.getPlaces();

          if (places.length == 0) {
            return;
          }

          // Clear out the old markers.
          markers.forEach(function(marker) {
            marker.setMap(null);
          });
          markers = [];

          // For each place, get the icon, name and location.
          var bounds = new google.maps.LatLngBounds();
          places.forEach(function(place) {
            if (!place.geometry) {
              console.log("Returned place contains no geometry");
              return;
            }
            var icon = {
              url: place.icon,
              size: new google.maps.Size(71, 71),
              origin: new google.maps.Point(0, 0),
              anchor: new google.maps.Point(17, 34),
              scaledSize: new google.maps.Size(25, 25)
            };

            // Create a marker for each place.
            markers.push(new google.maps.Marker({
              map: map,
              icon: icon,
              title: place.name,
              position: place.geometry.location
            }));

            //find gyms within listener ------------------.
              request = {
                location: place.geometry.location,
                radius: 8047,
                types: ['gym']
              };
              service.nearbySearch(request, callback);
            //END find gyms withing addListener

            if (place.geometry.viewport) {
              // Only geocodes have viewport.
              bounds.union(place.geometry.viewport);
            } else {
              bounds.extend(place.geometry.location);
            }
          });
          map.fitBounds(bounds);
        });
   //   }
        ////new new new END

//listener to recenter map if right clicked
google.maps.event.addListener(map, 'rightclick', function(event) {
  map.setCenter(event.latLng)
  //clear existing markers
  clearResults(markers)

            //find gyms within listener ------------------.
              request = {
                location: event.latLng,
                radius: 8047,
                types: ['gym']
              };
              service.nearbySearch(request, callback);
            //END find gyms withing addListener

})  //END Listner---------

    }    //END initial map function


//BEGIN marker
//BEGIN create virtual marker begin -------------------

    function callback(results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 0; i < results.length; i++) {
                markers.push(createMarker(results[i]));
            }
        }
    }
//END create virtual marker  ------

//BEGIN place marker--------
    function createMarker(place) {
        var placeLoc = place.geometry.location;
        var marker = new google.maps.Marker({
            map: map,
            position: place.geometry.location,
            icon: './assets/icons/gym.png'
        });

//BEGIN add info tag to marker if clicked
        google.maps.event.addListener(marker, 'click', function() {
          var rating = place.rating;
          var ratingString = rating.toString();
          // var mapLink = "maps.google.com/maps/"+place.name
          infowindow.setContent('<div><strong>' + place.name + '</strong><br>' +
                 'Rating: ' + ratingString + ' / out of 5<br>' + place.vicinity + '</div>'+
                 '<div class="view link"><a target="_blank" href="https://google.com/maps/place/'+place.name+'"><span> View on Google Maps </span></a></div>');
          console.log(place)
          infowindow.open(map, this);
        });
//END add info tag to marker
        return marker;
    }
//END place marker 

    function clearResults(markers) {
      for (var m in markers) {
        markers[m].setMap(null)}
      }
      markers = []
    

//END marker



    // google.maps.event.addDomListener(window, 'load', myMap());

    /*
    //add a marker
      var marker = new google.maps.Marker({position:mapProp.center,
      // icon:'pinkball.png'
      // animation: google.maps.Animation.BOUNCE
      });
      marker.setMap(map);
    //add an infowindow
      var infowindow = new google.maps.InfoWindow({
        content: "I'm an infowindow!  Below me is a marker!"
      });
    // Zoom to 9 when clicking on marker
    google.maps.event.addListener(marker,'mouseover',function() {
      map.setCenter(marker.getPosition());
      //add infowindow when cliked
      infowindow.open(map,marker);
      });
    google.maps.event.addListener(marker,'dblclick',function() {
      map.setZoom(9);
      map.setCenter(marker.getPosition());
      //add infowindow when cliked
      infowindow.open(map,marker);
      });
     */
    // var infoWindow = new google.maps.InfoWindow;

    // Try HTML5 geolocation.
            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(function(position) {
                var pos = {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude
                };

                infowindow.setPosition(pos);
                infowindow.setContent('Location found.');
                infowindow.open(map);
                map.setCenter(pos);
            //find gyms within listener ------------------.
              var request = {
                location: pos,
                radius: 8047,
                types: ['gym']
              };
              service.nearbySearch(request, callback);
            //END find gyms withing addListener


              }, function() {
                handleLocationError(true, infowindow, map.getCenter());
              });
            


            } else {
              // Browser doesn't support Geolocation
              handleLocationError(false, infowindow, map.getCenter());
            }
      

          function handleLocationError(browserHasGeolocation, infoWindow, pos) {
            infowindow.setPosition(pos);
            infowindow.setContent(browserHasGeolocation ?
                                  'Error: The Geolocation service failed.' :
                                  'Error: Your browser doesn\'t support geolocation.');
            infowindow.open(map);

          }
    // END HTML5 geolocation....
