﻿var express = require('express')
  , app = module.exports = express()
  , cors = require('cors')
  , http = require('http')
  , server = http.createServer(app)
  , io = require('socket.io').listen(server)
  , bodyParser = require('body-parser');
  server.listen(8080);

var databaseUrl = "Kudaw"; // "username:password@example.com/mydb"

//Use for Routing
app.use("/tweetMobile/function", express.static(__dirname + '/function'));
app.use("/tweetMobile/js", express.static(__dirname + '/js'));
app.use("/tweetMobile/css/", express.static(__dirname + '/css/'));
app.use("/tweetMobile/fonts/", express.static(__dirname + '/fonts/'));
app.use("/tweetMobile/img/", express.static(__dirname + '/img/'));
app.use("/tweetMobile/", express.static(__dirname + '/view/'));
app.use("/tweetMobile/", express.static(__dirname + '/'));
//Use for Post
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

console.log('Web Services Online in Port 8080');

//Routing view
app.get('/404', function(req, res){
	res.redirect("/404.html");
});

//Devuelve los los ultimos n tweets
app.get('/tweetMobile/tweets/:table/:number', function(req, res){
	console.log(req.params.table);
	if(req.params.number > 1000) req.params.number=1000;
	var collec = [req.params.table];
	var db = require("mongojs").connect(databaseUrl, collec);
	var collection = db.collection(req.params.table);
	collection.find({} ,{limit:req.params.number, sort: [['date',-1]]}).toArray(function(e, results){
	    if (e) return next(e)
	    res.send(results);
		db.close();
  	})
});

//Devuelve los los ultimos n tweets
app.get('/tweetMobile/tweetClassifierCount/', function(req, res){
	//console.log('tweetClassifier');
	var collec = ['tweetClassifier'];
	var db = require("mongojs").connect(databaseUrl, collec);
	var collection = db.collection('tweetClassifier');

	collection.count(function(error, numTweet) {
    	if(error) res.send('Error connection');
    	//console.log(numTweet);
    	res.send('{"numTweet":"'+numTweet+'"}');
	});
	
});

//Devuelve los los ultimos n tweets
app.get('/tweetMobile/tweetClassifier/:number', function(req, res){
	//console.log('Return tweets');
	var collec = ['tweetClassifier'];
	var db = require("mongojs").connect(databaseUrl, collec);
	var collection = db.collection('tweetClassifier');

	collection.count(function(error, numTweet) {
    	if(error) res.send('Error connection')
    	if(req.params.number >= numTweet){
    		res.send('Error length');
    	} else {
    		//console.log(req.params.number)
    		collection.find().skip(parseInt(req.params.number)).limit(1).toArray(function(e, results){
			    if (e) res.send('Error');
			    res.send('{"tweet":"'+results[0].tweet+'"}');
				db.close();
		  	})
    	}
	});
	
});

//Realiza el post del dato
app.post('/send', function(req, res){
	console.log('Send Post');
	var collec = ['tweetClassifier'];
	var db = require("mongojs").connect(databaseUrl, collec);
	//var collection = db.collection(collec);

	//console.log(req.body.tweet1);
	var text = req.body.tweet1;

	// Submit to the DB
    db.tweetClassifier.save(
    	{
    		tweet: text,
    		classifier: {class1: 0, class2: 0, class3: 0, class4: 0, class5: 0, class6: 0}
    	}, function(err, saved) {
		  if( err || !saved ){
		  	console.log("Tweet don't save");
		  	res.redirect("/*");
		  } else {
		  	console.log("Tweet save");
		  	res.redirect("/");
		  }
	});
});

//Realiza el post del dato
app.post('/classifier', function(req, res){
	console.log('Send Post Classifier');
	//console.log(req.body.tweet + ' | ' + req.body.classification);
	//console.log(req.body.classification.class1);
	
	var collec = ['tweetClassifier'];
	var db = require("mongojs").connect(databaseUrl, collec);
	
	var text = req.body.tweet;
	var classification = JSON.parse(req.body.classification);
	//console.log(classification);

	// Submit to the DB
	//CAMBIAR LA WEA
    db.tweetClassifier.update(
    	{tweet: text},
    	//{$inc: {classifier: classification
    	{$inc: {"classifier.class1": classification.class1,
    			"classifier.class2": classification.class2,
    			"classifier.class3": classification.class3,
    			"classifier.class4": classification.class4,
    			"classifier.class5": classification.class5,
    			"classifier.class6": classification.class6}
    	}, function(err, updated) {
		  if( err || !updated ){
		  	console.log("Tweet don't classifier");
		  	res.send(err);
		  } else {
		  	console.log("Tweet classifier");
		  	res.send('OK');
		  }
	});
});

//Realiza el post del dato
app.post('/language', function(req, res){
	console.log('Send Post Error Language');
	console.log(req.body.tweet);
	
	var collec = ['tweetClassifier'];
	var db = require("mongojs").connect(databaseUrl, collec);
	
	var text = req.body.tweet;
	var number = parseInt(req.body.classification);

	// Submit to the DB
    db.tweetClassifier.remove(
		{tweet: text},
		function(err, number) {
			if( err ){
				console.log("Tweet don't remove");
				res.send(err);
			} else {
				console.log("Tweet remove");
				res.send('OK');
			}
	});
});

/*
* Errores 404
*/

// handling 404 errors
app.get('*', function(req, res, next) {
  var err = new Error();
  err.status = 404;
  next(err);
});
 
// handling 404 errors
app.use(function(err, req, res, next) {
  if(err.status !== 404) {
    return next();
  }
  res.redirect("/404.html");
});