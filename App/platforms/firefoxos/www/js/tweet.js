function checkTweet(id){  

    $.ajax({ url: 'http://192.168.2.4:8080/tweetClassifier/', type: 'GET',
    success: function(resultData) { 
    	//console.log('Lectura de los datos');
		document.getElementById("tweetText").innerHTML = resultData[id].tweet;
		//var idTweet = parseInt(id) + 1;
		document.getElementById("tweetNumber").innerHTML = parseInt(id) + 1;  
    },
    error: function(xhr, status, error){
    	console('Error' + error);
    }
  });
}

$(document).ready(function(){
    $('#btn-classification').click(function () {
        jQuery.support.cors = true;

       $.ajax({
	        url: "http://192.168.2.4:8080/classifier/",
	        type: "POST",
	        data: { classification : document.getElementById("tweetClassification").value ,
	        		tweet : document.getElementById("tweetText").innerHTML},
	        success: function(data) {
	        	console.log('Clasificacion realizada');
	        	var idTweet = parseInt(window.localStorage.getItem("idTweet")) + 1;
	        	/*console.log(idTweet);*/
	        	window.localStorage.setItem("idTweet", idTweet);
	        	checkTweet(idTweet);
	        },
	        error: function(req,error) 
	        { 
		        console.log(req.responseText);
		        console.log(error);
	        }
    	});

        //alert('button click');

    });
});