var map, pos, currentPositionMarker, foodName, food, foodLatlng;
var markersArray = [];
var foodInfowindowArray = [];


function clearOverlays() {
  for (var i = 0; i < markersArray.length; i++ ) {
    markersArray[i].setMap(null);
  }
  markersArray.length = 0;
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

    var sendData = {};
    sendData.pos = pos;
    sendData.maxdist = maxdist;
    console.log(JSON.stringify(sendData));

    $.get('./foods', sendData, function (data) {
			clearOverlays();
      data.forEach(function(item, i, arr) {
         foodLatlng = new google.maps.LatLng(data[i].location[1].toString(), data[i].location[0].toString());
         foodName = data[i].name.toString();
         food = new google.maps.Marker({
          position: foodLatlng,
          title: foodName,
					map: map
          });
      var popupContent = '<div id="locationContent">' +
                            '<div>' + foodName + '</div>' +
                            '<div>' + foodLatlng + '</div>' +
                            '<div>' + data[i].comment.toString() + '</div>' +
                            // '<div><a href="' + data[i].owner + '">See This Story >></a></div>' +
                            // '<div><img width="250" src="' + data[i].photoURL.toString() + '" /></div>' +
                        '</div>';
      createInfoWindow(food, popupContent);
			markersArray.push(food);

    });

  });
  var infoWindow = new google.maps.InfoWindow();
  function createInfoWindow(marker, popupContent) {
        google.maps.event.addListener(food, 'click', function () {
            infoWindow.setContent(popupContent);
            infoWindow.open(map, this);
  });
}


};
initMap();
