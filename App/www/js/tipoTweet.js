//Reconocimiento de los datos en la BD
function checkTweet(id){
    var urlTweet = 'http://158.170.35.87/tweetMobile/tweetClassifier/' + id;

    jQuery.support.cors = true;

    $.ajax({ url: urlTweet, type: 'GET', dataType: "json",
    success: function(resultData) {
		document.getElementById("tweetText").innerHTML = resultData.tweet;
		document.getElementById("tweetNumber").innerHTML = parseInt(id) + 1;  
    },
    error: function(xhr, status, error){
        console.log(xhr)
        console.log(status)
        console.log(error)
        console.log('Error text tweet');
    }
  });
}

//Reconocimiento del tamaño de la BD
function totalTweet(){
    var urlTweet = 'http://158.170.35.87/tweetMobile/tweetClassifierCount/';
    var numTweet;

    jQuery.support.cors = true;

    $.ajax({ url: urlTweet, type: 'GET', dataType: "json",
    success: function(resultData) {
         //console.log('Result Data: '+resultData.numTweet);
         window.localStorage.setItem("numTweet", resultData.numTweet);
    },
    error: function(xhr, status, error){
        console.log(xhr)
        console.log(status)
        console.log(error)
        console.log('Error total Tweet');
    }
  });
}



//Tweet a analizar
function initTweet() {
    totalTweet();
    var randomID = randomTweet();
    if(randomID != -1){
        window.localStorage.setItem("idTweet", randomID);
        //console.log('RandomID: ' + randomID);
        checkTweet(randomID);
    } else {
        document.getElementById("tweetText").innerHTML = 'No hay más tweet que analizar';
        document.getElementById("tweetNumber").innerHTML = '#';
        $("#btn-classification").prop("disabled",true);
        $("#btn-bug").prop("disabled",true);
    }
}

function randomTweet() {
    var random = Math.floor((Math.random() * parseInt(window.localStorage.getItem("numTweet"))))
    var arrayRandom = JSON.parse(window.localStorage.getItem("arrayRandom"));

    //console.log(arrayRandom);

    if(window.localStorage.getItem("numTweet") == arrayRandom.length)
        return -1    
    
    if($.inArray(random, arrayRandom) != -1)
        random = randomTweet();
    
    return random;
}

function clearCheckList(){
    $('.list-group.checked-list-box .list-group-item').each(function () {
        // Settings
        var $widget = $(this),
            $checkbox = $('<input type="checkbox" class="hidden" />'),
            color = ($widget.data('color') ? $widget.data('color') : "primary"),
            style = ($widget.data('style') == "button" ? "btn-" : "list-group-item-"),
            settings = {
                on: {
                    icon: 'glyphicon glyphicon-check'
                },
                off: {
                    icon: 'glyphicon glyphicon-unchecked'
                }
            };          

        // Actions
        function updateDisplay() {
            var isChecked = $checkbox.is(':checked');

            // Set the button's state
            $widget.data('state', (isChecked) ? "on" : "off");

            // Set the button's icon
            $widget.find('.state-icon')
                .removeClass()
                .addClass('state-icon ' + settings[$widget.data('state')].icon);

            // Update the button's color
            if (isChecked) {
                $widget.addClass(style + color + ' active');
            } else {
                $widget.removeClass(style + color + ' active');
            }
        }

        // Initialization
        function init() {
            
            if ($widget.data('checked') == true) {
                $checkbox.prop('checked', !$checkbox.is(':checked'));
            }
            
            updateDisplay();

            // Inject the icon if applicable
            if ($widget.find('.state-icon').length == 0) {
                $widget.prepend('<span class="state-icon ' + settings[$widget.data('state')].icon + '"></span>');
            }
        }

        init();
    });
}

//Check list de la clasificación de cada tweet
$(function () {
    $('.list-group.checked-list-box .list-group-item').each(function () {
        
        // Settings
        var $widget = $(this),
            $checkbox = $('<input type="checkbox" class="hidden" />'),
            color = ($widget.data('color') ? $widget.data('color') : "primary"),
            style = ($widget.data('style') == "button" ? "btn-" : "list-group-item-"),
            settings = {
                on: {
                    icon: 'glyphicon glyphicon-check'
                },
                off: {
                    icon: 'glyphicon glyphicon-unchecked'
                }
            };
            
        $widget.css('cursor', 'pointer')
        $widget.append($checkbox);

        // Event Handlers
        $widget.on('click', function () {
            $checkbox.prop('checked', !$checkbox.is(':checked'));
            $checkbox.triggerHandler('change');
            updateDisplay();
        });

        $checkbox.on('change', function () {
            updateDisplay();
        });
          
        // Actions
        function updateDisplay() {
            var isChecked = $checkbox.is(':checked');

            // Set the button's state
            $widget.data('state', (isChecked) ? "on" : "off");

            // Set the button's icon
            $widget.find('.state-icon')
                .removeClass()
                .addClass('state-icon ' + settings[$widget.data('state')].icon);

            // Update the button's color
            if (isChecked) {
                $widget.addClass(style + color + ' active');
            } else {
                $widget.removeClass(style + color + ' active');
            }
        }

        // Initialization
        function initChecklist() {
            
            if ($widget.data('checked') == true) {
                $checkbox.prop('checked', !$checkbox.is(':checked'));
            }
            
            updateDisplay();

            // Inject the icon if applicable
            if ($widget.find('.state-icon').length == 0) {
                $widget.prepend('<span class="state-icon ' + settings[$widget.data('state')].icon + '"></span>');
            }
        }

        initChecklist();
    }); 
});

//Envío de los datos para actualizar la página
$(document).ready(function(){
    $('#btn-classification').click(function (event) {
    	event.preventDefault(); 
        var classTweet = {
            class1:0,
            class2:0,
        };

        //SOLUCION KUMA - PIENSE ALGO MEJOR
        $("#checked-list-box li.active").each(function(idx, li) {
            if($(li).val() == 1){
                classTweet.class1 = 1;
                window.location.href = "../view/tweetSolicita.html"
            }else {
                classTweet.class2 = 1;
                window.location.href = "../view/tweetEntrega.html"
            }
        });
  
        jQuery.support.cors = true;

       $.ajax({
	        url: "http://158.170.35.87/tweetMobile/classifier/",
	        type: "POST",
	        data: { classification : JSON.stringify(classTweet) ,
	        		tweet : document.getElementById("tweetText").innerHTML},
	        success: function(data) {
                var idTweet = parseInt(document.getElementById("tweetNumber").innerHTML) - 1;
                var arrayRandom = JSON.parse(window.localStorage.getItem("arrayRandom"));
                arrayRandom.push(idTweet);
                window.localStorage.setItem("arrayRandom", JSON.stringify(arrayRandom));
                clearCheckList();
                initTweet();
            },
            error: function(req,error) { 
                console.log(req.responseText);
                //console.log(error);
            }
        });
    });


    $('#btn-classification-entrega').click(function (event) {
        $("#entrega").show();
        $("#botoncitos").hide();
    });


    $('#btn-classification-solicita').click(function (event) {
        $("#solicita").show();
        $("#botoncitos").hide();
    });


    $('#btn-bug').click(function (event) {
        event.preventDefault(); 
  
        jQuery.support.cors = true;

       $.ajax({
            url: "http://localhost:8080/language/",
            type: "POST",
            data: { tweet : document.getElementById("tweetText").innerHTML},
            success: function(data) {
                initTweet();
            },
            error: function(req,error) { 
                console.log(req.responseText);
            }
        });
    });
});


