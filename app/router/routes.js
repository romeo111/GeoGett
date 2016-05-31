
var fs = require('fs-extra');
var path = require('path');
const User = require('../model/user');
const Food = require('../model/food');
const utils = require('../auth/utils');
var http = require('http');
var https = require("https");
module.exports = function(app) {
	var photoURL;
	app.route('/upload')
    .post(function (req, res, next) {

        var fstream;
        req.pipe(req.busboy);
        req.busboy.on('file', function (fieldname, file, filename) {
            console.log("Uploading: " + filename);
						var randomName = utils.randomString(12);
            //Path where image will be uploaded
            fstream = fs.createWriteStream('./app/img/' + filename + randomName);
            file.pipe(fstream);
            fstream.on('close', function () {
                console.log("Upload Finished of " + filename + randomName);
                filename += randomName;
								photoURL = '/img/' + filename;

						});
        });
				return;
    });


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
			})
			.populate('owner')
			.exec(function(err, foods) {
			res.status(200).json(foods);
			res.end();
			console.log('answer for GET' + JSON.stringify(foods));
		});
	});

	app.get('/img/*', function (req, res, next) {
			res.sendFile(path.join(__dirname,  '../' + req.url));
			return;
	});

	var clientFSQ = 'client_id=3LRKSJWBD3IGVOVDTYAFTG4P4PZQPDEKKEQG5HNJCXBXTCCS&client_secret=3V4BYVOQOMGRFLGXBOU4DWGHJVHMZW0FUXPMPOYOAYLRMLTM&v=20160101';

	app.get('/getFSQ', function (req, res) {
			//console.log('catch getFSQ from client: ' + JSON.stringify(req.query));
			var pos = '&ll='+req.query.pos.lat.toString() +','+ req.query.pos.lng.toString();
			var limit ='&limit='+req.query.limit.toString();
			var categories = '&categoryId=4d4b7105d754a06374d81259';
			var radius = '&radius=800'; //food
			var options = {
			  host: 'api.foursquare.com',
			  path: '/v2/venues/search?'+ clientFSQ+pos+limit+categories+radius+'&intent=browse',
				method : 'GET',
			};
			var res_data = '';
			var req = https.get(options, function(response) {
			  response.on('data', function(chunk) {	res_data += chunk; });
			  response.on('end', function() {
					//console.log('send data' + res_data);
					res.json(res_data);  });
			});
			req.on('error', function(e) {
			  console.log("Got error: " + e.message);
			});
	});

	app.get('/getID', function (req, res) {
			//console.log('catch getID: ' + JSON.stringify(req.query) + " body: " + JSON.stringify(req.body)  );
			var ID = req.query.id.toString();
			var optionsID = {
			  host: 'api.foursquare.com',
			  path: '/v2/venues/'+ID+'?'+clientFSQ,
				method : 'GET',
			};
			var res_ID ='';
			var reqID = https.get(optionsID, function(response) {
			  response.on('data', function(chunk2) {	res_ID += chunk2; });
			  response.on('end', function() {
					//console.log(res_ID);
					res.json(res_ID);
					});
			});
			reqID.on('error', function(e) {
			  console.log("Got error: " + e.message);
			});
	});

	app.get('/getID/photos', function (req, res) {
			//console.log('catch getIDphotos: ' + JSON.stringify(req.query) + " body: " + JSON.stringify(req.body)  );
			var ID = req.query.id.toString();
			var optionsIDphotos = {
			  host: 'api.foursquare.com',
			  path: '/v2/venues/'+ID+'/photos/'+ '?'+clientFSQ,
				method : 'GET',
				dataType: 'json'
			};
			var res_IDphotos ='';
			var reqIDphotos = https.get(optionsIDphotos, function(response) {
			  response.on('data', function(photos) {	res_IDphotos += photos; });
			  response.on('end', function() {
					res.json(res_IDphotos);
					});
			});
			req.on('error', function(e) {
			  console.log("Got error: " + e.message);
			});
	});

	app.post('/addfood', function(req, res){
		console.log('take POST query: ' + "req.query: " + JSON.stringify(req.query) + "req.body: " + JSON.stringify(req.body));
    var newfood = new Food();

			newfood.name = req.body.foodname;
			newfood.location = req.body.location;
			newfood.serving = req.body.serving;
			newfood.delivery = req.body.delivery;
			newfood.comment = req.body.comment;
			newfood.owner = req.body.ownerId;
			newfood.photoURL = photoURL;
    	newfood.save(function(err){
      if(err) {
				console.log('cant save: ' + err );

				res.send(err); return;}

			console.log("SAVED: " + JSON.stringify(newfood.name));
			res.json(newfood);
			});
		});



};
