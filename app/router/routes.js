
const fs = require("fs");
const User = require('../model/user');
const Food = require('../model/food');
// authenticate
module.exports = function(app) {


	// food routes
	app.get('/foods', function(req, res){
		console.log('START answer for GET= ' + "req.query: " + JSON.stringify(req.query) + "req.body: " + JSON.stringify(req.body));
		var coords = [];
    coords[0] = req.query.pos.lng;
    coords[1] = req.query.pos.lat;
		var maxDistance = req.query.maxdist/111.12;
		Food.find({
			location: {
         $near: coords,
         $maxDistance: maxDistance
       }
		}, function(err, foods) {
			res.status(200).json(foods);
			res.end();
			console.log('answer for GET' + JSON.stringify(foods));
		});
	});



	app.post('/addfood', function(req, res){
		console.log('take POST query: ' + "req.query: " + JSON.stringify(req.query) + "req.body: " + JSON.stringify(req.body));
    var newfood = new Food();

			newfood.name = req.body.foodname;
			newfood.location = req.body.location;
			newfood.serving = req.body.serving;
			newfood.grocery = req.body.grocery;
			newfood.delivery = req.body.delivery;
			newfood.comment = req.body.comment;

    newfood.save(function(err){
      if(err) {
				console.log('cant save' );
				throw err;
				res.send(err); return;}

			console.log("SAVED: " + JSON.stringify(newfood.name));
			res.json(newfood);
			});
		});



};
