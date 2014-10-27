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
        $("#btn-classification-entrega").prop("disabled",true);
        $("#btn-classification-solicita").prop("disabled",true);
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

        function clearDisplay() {
            $("#entrega").hide();
            $("#solicita").hide();
            $("#botoncitos").show();
        }

        //Inicializamos
        init();
        clearDisplay();
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
    $('#btn-classification-entrega').click(function (event) {
    	event.preventDefault(); 
        var classTweet = {
            class1: {subclass1 : 0, subclass2 : 0, subclass3 : 0, subclass4 : 0, subclass5 : 0, subclass6 : 0, subclass7 : 0, subclass8 : 0, subclass9 : 0, subclass10 : 0 },
            class2: {subclass1 : 0, subclass2 : 0, subclass3 : 0, subclass4 : 0,subclass5 : 0, subclass6 : 0, subclass7 : 0, subclass8 : 0, subclass9 : 0, subclass10 : 0, subclass11: 0 }
        };

        //Realizar esto con For Each
        $("#checked-list-box-entrega li.active").each(function(idx, li) {
            if($(li).val() == 1){
                classTweet.class1.subclass1 = 1;
            }else if($(li).val() == 2){
                classTweet.class1.subclass2 = 1;
            }else if($(li).val() == 3){
                classTweet.class1.subclass3 = 1;
            }else if($(li).val() == 4){
                classTweet.class1.subclass4 = 1;
            }else if($(li).val() == 5){
                classTweet.class1.subclass5 = 1;
            }else if($(li).val() == 6){
                classTweet.class1.subclass6 = 1;
            }else if($(li).val() == 7){
                classTweet.class1.subclass7 = 1;
            }else if($(li).val() == 8){
                classTweet.class1.subclass8 = 1;
            }else if($(li).val() == 9){
                classTweet.class1.subclass9 = 1;
            }else if($(li).val() == 10){
                classTweet.class1.subclass10 = 1;
            }
        });

        //console.log(JSON.stringify(classTweet));
  
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

    $('#btn-classification-solicita').click(function (event) {
        event.preventDefault(); 
        var classTweet = {
            class1: {subclass1 : 0, subclass2 : 0, subclass3 : 0, subclass4 : 0, subclass5 : 0, subclass6 : 0, subclass7 : 0, subclass8 : 0, subclass9 : 0, subclass10 : 0 },
            class2: {subclass1 : 0, subclass2 : 0, subclass3 : 0, subclass4 : 0,subclass5 : 0, subclass6 : 0, subclass7 : 0, subclass8 : 0, subclass9 : 0, subclass10 : 0, subclass11: 0 }
        };

        //Realizar esto con For Each
        $("#checked-list-box-solicita li.active").each(function(idx, li) {
            if($(li).val() == 1){
                classTweet.class2.subclass1 = 1;
            }else if($(li).val() == 2){
                classTweet.class2.subclass2 = 1;
            }else if($(li).val() == 3){
                classTweet.class2.subclass3 = 1;
            }else if($(li).val() == 4){
                classTweet.class2.subclass4 = 1;
            }else if($(li).val() == 5){
                classTweet.class2.subclass5 = 1;
            }else if($(li).val() == 6){
                classTweet.class2.subclass6 = 1;
            }else if($(li).val() == 7){
                classTweet.class2.subclass7 = 1;
            }else if($(li).val() == 8){
                classTweet.class2.subclass8 = 1;
            }else if($(li).val() == 9){
                classTweet.class2.subclass9 = 1;
            }else if($(li).val() == 10){
                classTweet.class2.subclass10 = 1;
            }else if($(li).val() == 11){
                classTweet.class2.subclass11 = 1;
            }
        });

        //console.log(JSON.stringify(classTweet));
  
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

    $('#btn-back').click(function (event) {
        if($("#botoncitos").is(":visible")){
            window.location = "../index.html";
        } else {
            clearCheckList();
            $("#entrega").hide();
            $("#solicita").hide();
            $("#botoncitos").show();
        }
    });


    $('#btn-entrega').click(function (event) {
        $("#entrega").show();
        $("#botoncitos").hide();
    });


    $('#btn-solicita').click(function (event) {
        $("#solicita").show();
        $("#botoncitos").hide();
    });


    $('#btn-bug').click(function (event) {
        bootbox.confirm("¿Está seguro de eliminar este tweet <strong>" + document.getElementById("tweetText").innerHTML + "</strong> ?", function(result) {
            if(result){
                event.preventDefault(); 
  
                jQuery.support.cors = true;

               $.ajax({
                    url: "http://158.170.35.87/tweetMobile/language/",
                    type: "POST",
                    data: { tweet : document.getElementById("tweetText").innerHTML},
                    success: function(data) {
                        initTweet();
                    },
                    error: function(req,error) { 
                        console.log(req.responseText);
                    }
                });
            }  
        });
    });

    //$('#btn-help').click(function(event){

    //});
});


