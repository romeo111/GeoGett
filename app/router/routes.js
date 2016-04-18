
const fs = require("fs");
const User = require('../model/user');
const Food = require('../model/food');
// authenticate
module.exports = function(app) {




	// food routes
	app.get('/foods', function(req, res){

			console.log('params: ' + JSON.stringify(req.params));
			console.log('body: ' + JSON.stringify(req.body));
			console.log('query: ' + JSON.stringify(req.query));

      var query = Food.location.find(
			   {
			     location:
			       { $near :
			          {
			            $geometry: { type: "Point",  coordinates: req.query.position },
			            $minDistance: 1,
			            $maxDistance: 5000
			          }
			       }
			   });

				 res.end();

  });





	// map.geojson routes
	app.get('/data', function(req, res) {
		var obj;
		fs.readFile('./app/data/map.geojson', 'utf8', function (err, data) {
			if (err) throw err;
			obj = JSON.parse(data);
			res.send(obj);
			var now = new Date();
			console.log('send map.geojson to HTTP get request ' + now);
			res.end();
		});
	});


};
