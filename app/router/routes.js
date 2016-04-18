
const fs = require("fs");
const User = require('../model/user').User;
const Food = require('../model/food').Food;
// authenticate
module.exports = function(app) {




	// food routes
	app.get('/foods', function(req, res){
        var query = Food.find({});
        query.exec(function(err, foods){
            if(err) {res.send(err); return;}
            console.log(res.headersSent);
			res.json(foods);
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

	});
	});


};
