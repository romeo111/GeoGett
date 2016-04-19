
const fs = require("fs");
const User = require('../model/user');
const Food = require('../model/food');
// authenticate
module.exports = function(app) {




	// food routes
	app.get('/foods', function(req, res){

			console.log(JSON.stringify(req.body));
      var query = Food.find({
		     		location:
		       	{ $near :
		          {
		            $geometry: { type: "Point",  coordinates: [ -73.9667, 40.78 ] },
		            $minDistance: 1,
		            $maxDistance: 1000
		          }
		       }
		   });






        query.exec(function(err, foods){
            if(err) {res.send(err); return;}
      	res.json(foods);
				console.log(res.headersSent + ": res.headersSent ");
			res.end();
        });
    });

	app.post('/foods', function(req, res){
		console.log(req.body);
        var newfood = new Food(req.body);
        newfood.save(function(err){
            if(err) {res.send(err); return;}
            console.log(res.headersSent);
			res.json(req.body);
        });
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
