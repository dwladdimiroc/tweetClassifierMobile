var express = require('express')
  , app = express()
  , http = require('http')
  , server = http.createServer(app)
  , io = require('socket.io').listen(server);
  server.listen(8080);

var databaseUrl = "Kudaw"; // "username:password@example.com/mydb"

app.use("/function", express.static(__dirname + '/function'));
app.use("/js", express.static(__dirname + '/js'));
app.use("/css/", express.static(__dirname + '/css/'));
app.use("/fonts/", express.static(__dirname + '/fonts/'));
app.use("/img/", express.static(__dirname + '/img/'));
app.use("/", express.static(__dirname + '/'));

console.log('Web Services Online in Port 8080')

/*
*	Consultas con tweets
*/

//Devuelve los los ultimos n tweets
app.get('/retrieve/tweets/:table/:number', function(req, res){
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

//Realiza el post del dato
app.post('/send', function(req, res){
	console.log('Send Post');
	//var collec = ['tweetClassifier'];
	//var db = require("mongojs").connect(databaseUrl, collec);
	//var collection = db.collection(collec);

	console.log(req.body.tweet1);

	res.send('hola');

	// Submit to the DB
    /*collection.insert({
        "tweet" : req.tweet,
        "need" : userEmail
    }, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
        }
        else {
            // If it worked, set the header so the address bar doesn't still say /adduser
            res.location("userlist");
            // And forward to success page
            res.redirect("userlist");
        }
    });*/
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
  res.send(err.message || '** No elephants here **');
});



io.sockets.on('connection', function (socket) {

	//Creo el Json de la pagina web lo copio a la carpeta de S4.
	socket.on('outputJson', function(data){

		//console.log("Creo el Json de la pagina web lo copio a la carpeta de S4");

		//Escribo en disco el config
		//var fs = require('fs');
		//var outputFilename = 'compilation/json/config.json';


		//Guardar en Mongo DB
	 	//JSON.stringify(data, null, 4)

	 	//Guardo la topologia en Mongo.
		var collec = "kudawTopologias";
		var db = require("mongojs").connect(databaseUrl, [collec]);
		var collection = db.collection(collec);

		var d = new Date();
		var f = d.getDate() + "/" + (d.getMonth() +1) + "/" + d.getFullYear();
	  	
	  	var document = {nombre:data[data.length-1]["tableMongoDB"], hora: d.toLocaleTimeString() ,fecha:f , config: data};

			
			collection.insert(document, {w: 1}, function(err, records){
  				console.log("Topología guardada en: " + collec);
			});

		db.close();
	});


	socket.on('execute', function(data){

		var spawn = require('child_process').spawn;
		var _ = require('underscore'); // for some utility goodness
		var deploySh = spawn('sh', [ 'killAll.sh' ], {
  		cwd: process.env.HOME + '/ApacheS4/myApp',
  		env:_.extend(process.env, { PATH: process.env.PATH + ':/usr/local/bin' })
  		});

		//Evitar que se ejecute seguido y staure el sistema.
		if(executeTime ==0){ 
			executeTime = +new Date(); 
			console.log("executeTime: " +executeTime);

		}else{
			var time = +new Date();
			if(time - executeTime < 10000 ){

			console.log("time - executeTime : " + time - executeTime);
			console.log("barrera");
			 var start = new Date().getTime();
			  for (var i = 0; i < 1e7; i++) {
			    if ((new Date().getTime() - start) > 5000){
			      break;
			    }
			  }
			}
		}


		console.log("Función Exuecute | id: " + data);

		//Obtengo el Json de la topologia
		var collec = "kudawTopologias";
		var db = require("mongojs").connect(databaseUrl, [collec]);
		var collection = db.collection(collec);

		var mongojs = require('mongojs');
		var ObjectId = mongojs.ObjectId;

		collection.find({ _id: ObjectId(data) }, function(e, results) {
			if (e) return next(e)

			db.close();

			var fs = require('fs');
			var outputFilename = 'compilation/json/config.json';

			fs.writeFile(outputFilename, JSON.stringify(results[0].config, null, 4), function(err){

				if(err){
					console.log("Error al crear el archivo");

				}else{
					console.log("Creación Json");
					
					//Ejecuto el jar
		      	var spawn = require('child_process').spawn;
				var _ = require('underscore'); // for some utility goodness
				
				var deploySh = spawn('sh', [ 'compilation.sh' ], {
		  		cwd: process.env.HOME + '/node/compilation',
		  		env:_.extend(process.env, { PATH: process.env.PATH + ':/usr/local/bin' })
		  		});

				deploySh.stdout.on('data', function (data) {
				  console.log('stdout: ' + data);
				});

				deploySh.stderr.on('data', function (data) {
				  console.log("Error al crear el archivo");
				});

					deploySh.on('close', function (code) {

					  if(code == 0){

					  		console.log("Se parseo el archivo con exito. Creado el archivo 'FrameWorkApp.java'")
						
							var spawn = require('child_process').spawn;
							var _ = require('underscore'); // for some utility goodness
							var deploySh = spawn('sh', [ 'copy.sh' ], {
					  		cwd: process.env.HOME + '/node/compilation/json',
					  		env:_.extend(process.env, { PATH: process.env.PATH + ':/usr/local/bin' })
					  		});

							deploySh.stdout.on('data', function (data) {
							  //console.log('stdout: ' + data);
							});

							deploySh.stderr.on('data', function (data) {
							  //console.log('stderr: ' + data);
							});

							deploySh.on('close', function (code) {
								
								//Ocurrio bien la ejecucion, en caso contrario no se guarda la configuracion
								if(code == 0){
									console.log("Se copio el archivo con exito.");
								}else{
									console.log("Error al copiar al directorio de ApacheS4.");
								}
							});

						}else{
							console.log("Error al parsear los archivos.");
						}

					});//deploySh.on('close', function (code) {

				}//}else{

			}); //fs.writeFile(outputFilename, JSON.stringify

		 }); //collection.find({ _id: ObjectId(data) }, function(e, results) {


		var spawn = require('child_process').spawn;
		var _ = require('underscore'); // for some utility goodness
		var deploySh = spawn('sh', [ 'compi.sh' ], {
  		cwd: process.env.HOME + '/ApacheS4/apache-s4',
  		env:_.extend(process.env, { PATH: process.env.PATH + ':/usr/local/bin' })
  		});


  		var spawn = require('child_process').spawn;
		var _ = require('underscore'); // for some utility goodness
		var deploySh1 = spawn('sh', [ 'compi.sh' ], {
		  cwd: process.env.HOME + '/ApacheS4/myApp',
		  env:_.extend(process.env, { PATH: process.env.PATH + ':/usr/local/bin' })
		});

	});


	socket.on('stop', function(data){

		console.log("Stop function");
		var spawn = require('child_process').spawn;
		var _ = require('underscore'); // for some utility goodness
		var deploySh = spawn('sh', [ 'killAll.sh' ], {
  		cwd: process.env.HOME + '/ApacheS4/myApp',
  		env:_.extend(process.env, { PATH: process.env.PATH + ':/usr/local/bin' })
  		});

	});

});