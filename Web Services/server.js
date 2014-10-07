var express = require('express')
  , app = module.exports = express()
  , cors = require('cors')
  , http = require('http')
  , server = http.createServer(app)
  , io = require('socket.io').listen(server)
  , bodyParser = require('body-parser');
  server.listen(8080);

var databaseUrl = "Kudaw"; // "username:password@example.com/mydb"

//Use for Routing
app.use("/function", express.static(__dirname + '/function'));
app.use("/js", express.static(__dirname + '/js'));
app.use("/css/", express.static(__dirname + '/css/'));
app.use("/fonts/", express.static(__dirname + '/fonts/'));
app.use("/img/", express.static(__dirname + '/img/'));
app.use("/", express.static(__dirname + '/view/'));
app.use("/", express.static(__dirname + '/'));
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
app.get('/tweets/:table/:number', function(req, res){
	console.log(req.params.table);
	if(req.params.number > 1000) req.params.number=1000;
	var collec = [req.params.table];
	var db = require("mongojs").connect(databaseUrl, collec);
	var collection = db.collection(req.params.table);
	collection.find({} ,{limit:req.params.number, sort: [['date',-1]]}).toArray(function(e, results){
	    if (e) return next(e)
	    res.send(results)
		db.close();
  	})
});

//Devuelve los los ultimos n tweets
app.get('/tweetClassifier/:number', function(req, res){
	console.log('tweetClassifier');
	var collec = ['tweetClassifier'];
	var db = require("mongojs").connect(databaseUrl, collec);
	var collection = db.collection('tweetClassifier');
	collection.find({}).toArray(function(e, results){
	    if (e) return next(e)
	    res.send('{"tweet": "'+results[req.params.number].tweet+'"}');
		db.close();
  	})
});

//Realiza el post del dato
app.post('/send', function(req, res){
	console.log('Send Post');
	var collec = ['tweetClassifier'];
	var db = require("mongojs").connect(databaseUrl, collec);
	//var collection = db.collection(collec);

	console.log(req.body.tweet1);
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
	console.log(req.body.tweet + ' | ' + req.body.classification);
	
	var collec = ['tweetClassifier'];
	var db = require("mongojs").connect(databaseUrl, collec);
	
	var text = req.body.tweet;
	var number = parseInt(req.body.classification);

	// Submit to the DB
	//CAMBIAR LA WEA
    db.tweetClassifier.update(
    	{tweet: text},
    	{$set: {classifier: number}
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
				console.log("Tweet classifier");
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
  res.redirect('** No elephants here **');
});