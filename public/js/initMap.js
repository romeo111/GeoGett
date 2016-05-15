var map, pos, currentPositionMarker, foodName, food, foodLatlng, Address;
var markersArray = [];
var venuesArray = [];
var foodInfowindowArray = [];

function clearOverlays() {
  for (var i = 0; i < markersArray.length; i++ ) {
    markersArray[i].setMap(null);
  }  markersArray.length = 0;

  for (var i = 0; i < venuesArray.length; i++ ) {
    venuesArray[i].setMap(null);
  }  venuesArray.length = 0;
}

function initMap() {
	var styles = [
    {
      stylers: [
        { hue: "#00ffe6" },
        { saturation: -10 }
      ]
    },{
      featureType: "road",
      elementType: "geometry",
      stylers: [
        { lightness: 70 },
        { visibility: "simplified" }
      ]
    },{
      featureType: "road",
      elementType: "labels",
      stylers: [
        { visibility: "off" }
      ]
    }
  ];

  var styledMap = new google.maps.StyledMapType(styles,
    {name: "Styled Map"});

  map = new google.maps.Map(document.getElementById('map'), {
    disableDefaultUI: true,
    zoom: 14,
		mapTypeControlOptions: {
    mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
    }
	 });

  map.mapTypes.set('map_style', styledMap);
  map.setMapTypeId('map_style');

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      pos = {
        lng: position.coords.longitude,
				lat: position.coords.latitude
      };
var	currentPositionMarker = new google.maps.Marker({
    position: pos,
    title:"Уточните свое местоположение перетягиванием маркера",
	   draggable: true,
     icon: {
        url: 'images/location.svg',
        scaledSize: new google.maps.Size(40, 40) // pixels
      }
});
google.maps.event.addListener(currentPositionMarker, 'dragend', function() {
  pos.lat = currentPositionMarker.getPosition().lat();
  pos.lng = currentPositionMarker.getPosition().lng();
  map.setCenter(pos);
   });
currentPositionMarker.setMap(map);
map.setCenter(pos);
    }, function() {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {
    handleLocationError(false, infoWindow, map.getCenter());
  }

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
                        'Error: The Geolocation service failed.' :
                        'Error: Your browser doesn\'t support geolocation.');
}
};


function getfood(maxdist) {
  var infoWindow = new google.maps.InfoWindow({ });
  var geocoder = new google.maps.Geocoder;
  var sendData = {};
    sendData.pos = pos;
    sendData.maxdist = maxdist;
    console.log(JSON.stringify(sendData));

    $.get('./foods', sendData, function (data) {
			clearOverlays();
      data.forEach(function(item, i, arr) {
         foodLatlng = new google.maps.LatLng(data[i].location[1].toString(), data[i].location[0].toString());
         geocoder.geocode({'location': foodLatlng}, function(results, status) {
           data[i].foodAddress = JSON.stringify(results[0].formatted_address);
           console.log(data[i].foodAddress);
         });

         var foodName = data[i].foodname.toString();
         var ownerPhone =  JSON.stringify(data[i].owner.phone);
         var ownerName = JSON.stringify(data[i].owner.username);

        ownerName = ownerName.replace(/^"(.*)"$/, '$1');
        ownerPhone = ownerPhone.replace(/^"(.*)"$/, '$1');
         food = new google.maps.Marker({
              position: foodLatlng,
              title: foodName,
    					map: map
          });

        var popupContent = '<div id="iw-container">' +
                            '<div class="iw-title">' + foodName + '</div>' +
                            '<div>' + ' Продавец: '+ ownerName + '<br>' + 'Телефон: '+ ownerPhone +'</div>' +
                            '<div  id="foodAddress">' +  '</div>' +
                            '<div><img width="400" src="' + data[i].photoURL.toString() + '" /></div>' +
                            '<div>' + 'Комментарий продавца: ' + data[i].comment.toString()  + '</div>' +
                            '</div>';

      createInfoWindow(food, popupContent);
			markersArray.push(food);
    });
  });

function createInfoWindow(marker, popupContent) {
        google.maps.event.addListener(food, 'click', function () {
            infoWindow.setContent(popupContent);
            infoWindow.open(map, this);
            map.setCenter(foodLatlng);
  });

}
};

function getfromFSQ () {
  var infoWindow = new google.maps.InfoWindow({ });
  var sendDataFSQ = {};
    sendDataFSQ.pos = pos;
    sendDataFSQ.limit = '20';
  var getFSQ = $.getJSON('./getFSQ', sendDataFSQ);
  getFSQ.done(function (res_data) {
    res_data = JSON.parse(res_data);
    clearOverlays();
    $.each(res_data.response.venues,  function( i, venues) {
        var venueLatLng = new google.maps.LatLng(venues.location.lat.toString(), venues.location.lng.toString());
        var venueName = venues.name;
        var venueAddress = venues.location.address;
        var contentVenues = '<p>Name: ' + venues.name +
            ' Address: ' + venues.location.address +
            ' Lat/long: ' + venues.location.lat + ', ' + venues.location.lng + '</p>';

        venue = new google.maps.Marker({
             position: venueLatLng,
             title: venueName,
             map: map,
             icon: {
                 size: new google.maps.Size(32, 32),
                 url: 'https://foursquare.com/img/categories/food/default.png'
                  }
         });

        venuesArray.push(venue);
        map.setZoom(18);
        map.setCenter(pos);
        google.maps.event.addListener(venue, 'click', function () {
            infoWindow.setContent(contentVenues);
            infoWindow.open(map, this);
            map.setCenter(venueLatLng);
        });
    });
  });
  getFSQ.fail( function(data) { console.log('fail' + JSON.stringify(data))})
}

initMap();
