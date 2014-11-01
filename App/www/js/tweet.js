//Reconocimiento de los datos en la BD
function checkTweet(id){
    var urlTweet = 'http://158.170.35.87:8080/tweetMobile/tweetClassifier/' + id;

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
    var urlTweet = 'http://158.170.35.87:8080/tweetMobile/tweetClassifierCount/';
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

function checkTweetEmpty(){
    if($('.list-group-item.active').length == 0){
        return false;
    } else {
        return true;
    }
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
    $("#btn-clasificar").prop("disabled", true);
    $('#btn-entrega-footer').prop("disabled", false);
    $('#btn-solicita-footer').prop("disabled", false);

    $('#btn-modal-entrega').click(function(event){
        
    });

    $('#btn-clasificar').click(function (event) {
        if(checkTweetEmpty()){
        	event.preventDefault(); 
            var classTweet = {
                class1: {subclass1 : 0, subclass2 : 0, subclass3 : 0, subclass4 : 0, subclass5 : 0, subclass6 : 0, subclass7 : 0, subclass8 : 0, subclass9 : 0, subclass10 : 0 },
                class2: {subclass1 : 0, subclass2 : 0, subclass3 : 0, subclass4 : 0,subclass5 : 0, subclass6 : 0, subclass7 : 0, subclass8 : 0, subclass9 : 0, subclass10 : 0, subclass11: 0 }
            };

            //Realizar esto con For Each en la parte del class
            if($('#btn-entrega-footer').attr('disabled')){
                $('.list-group-item.active').each(function(idx, div) {
                    if($(div).attr("value") == 1){
                        classTweet.class1.subclass1 = 1;
                    }else if($(div).attr("value") == 2){
                        classTweet.class1.subclass2 = 1;
                    }else if($(div).attr("value") == 3){
                        classTweet.class1.subclass3 = 1;
                    }else if($(div).attr("value") == 4){
                        classTweet.class1.subclass4 = 1;
                    }else if($(div).attr("value") == 5){
                        classTweet.class1.subclass5 = 1;
                    }else if($(div).attr("value") == 6){
                        classTweet.class1.subclass6 = 1;
                    }else if($(div).attr("value") == 7){
                        classTweet.class1.subclass7 = 1;
                    }else if($(div).attr("value") == 8){
                        classTweet.class1.subclass8 = 1;
                    }else if($(div).attr("value") == 9){
                        classTweet.class1.subclass9 = 1;
                    }else if($(div).attr("value") == 10){
                        classTweet.class1.subclass10 = 1;
                    }
                });
            } else {
                $('.list-group-item.active').each(function(idx, div) {
                    if($(div).attr("value") == 1){
                        classTweet.class2.subclass1 = 1;
                    }else if($(div).attr("value") == 2){
                        classTweet.class2.subclass2 = 1;
                    }else if($(div).attr("value") == 3){
                        classTweet.class2.subclass3 = 1;
                    }else if($(div).attr("value") == 4){
                        classTweet.class2.subclass4 = 1;
                    }else if($(div).attr("value") == 5){
                        classTweet.class2.subclass5 = 1;
                    }else if($(div).attr("value") == 6){
                        classTweet.class2.subclass6 = 1;
                    }else if($(div).attr("value") == 7){
                        classTweet.class2.subclass7 = 1;
                    }else if($(div).attr("value") == 8){
                        classTweet.class2.subclass8 = 1;
                    }else if($(div).attr("value") == 9){
                        classTweet.class2.subclass9 = 1;
                    }else if($(div).attr("value") == 10){
                        classTweet.class2.subclass10 = 1;
                    }else if($(div).attr("value") == 11){
                        classTweet.class2.subclass10 = 1;
                    }
                });
            }

            $(".btns").show();
            $('#btn-entrega-footer').hide();
            $("#btn-solicita-footer").hide();
            $('#btn-entrega-footer').prop("disabled", false);
            $('#btn-solicita-footer').prop("disabled", false);
            $('#btn-clasificar').prop("disabled", true);
      
            jQuery.support.cors = true;

           $.ajax({
    	        url: "http://158.170.35.87:8080/tweetMobile/classifier/",
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
        }
    });

    $('#btn-entrega-body').click(function (event) {
        $("#entrega").show();
        $(".btns").hide();
        $('#btn-entrega-footer').show();
        $("#btn-solicita-footer").show();
        $("#btn-bug-footer").show();
        $('#btn-entrega-footer').prop("disabled", true);
        $('#btn-clasificar').prop("disabled", false);
    });


    $('#btn-solicita-body').click(function (event) {
        $("#solicita").show();
        $(".btns").hide();
        $('#btn-entrega-footer').show();
        $("#btn-solicita-footer").show();
        $("#btn-bug-footer").show();
        $('#btn-solicita-footer').prop("disabled", true);
        $('#btn-clasificar').prop("disabled", false);
    });

    $('#btn-entrega-footer').click(function (event) {
        clearCheckList();
       $("#solicita").hide();
        $("#entrega").show();
        $('#btn-entrega-footer').prop("disabled", true);
        $("#btn-solicita-footer").prop("disabled", false);
    });


    $('#btn-solicita-footer').click(function (event) {
        clearCheckList();
        $("#solicita").show();
        $("#entrega").hide();
        $('#btn-entrega-footer').prop("disabled", false);
        $("#btn-solicita-footer").prop("disabled", true);
    });


    //modal ayuda
    
    $('#btn-entrega-help').click(function (event){
        $("#ayuda-main").hide();
        $("#entrega-main").show();
        $("#volver-footer").show();
    });

    $('#btn-solicita-help').click(function (event){
        $("#ayuda-main").hide();
        $("#solicita-main").show();
        $("#volver-footer").show();
    });

    $('#volver-footer').click(function (event){
        $("#ayuda-main").show();
        $("#entrega-main").hide();
        $("#solicita-main").hide();
        $("#volver-footer").hide();
    });

    $('#btn-pers-enc').click(function (event){
        $("#entrega-main").hide();
    });


    $('#btn-est-pers').click(function (event){
        $("#entrega-main").hide();
    });

    $('#btn-lugares').click(function (event){
        $("#entrega-main").hide();
    });

    $('#btn-inst').click(function (event){
        $("#entrega-main").hide();
    });

    $('#btn-corte-agua').click(function (event){
        $("#entrega-main").hide();
    });

    $('#btn-repo-agua').click(function (event){
        $("#entrega-main").hide();
    });

    $('#btn-repo-luz').click(function (event){
        $("#entrega-main").hide();
    });

    $('#btn-corte-luz').click(function (event){
        $("#entrega-main").hide();
    });

    $('#btn-aler-natu').click(function (event){
        $("#entrega-main").hide();
    });

    $('#btn-otro-entrega').click(function (event){
        $("#entrega-main").hide();
    });

    $('#btn-pers-perd').click(function (event){
        $("#solicita-main").hide();       
    });

    $('#btn-trans').click(function (event){
        $("#solicita-main").hide();
    });
    
    $('#btn-ayu-damn').click(function (event){
        $("#solicita-main").hide();
    });

    $('#btn-volun').click(function (event){
        $("#solicita-main").hide();
    });

    $('#btn-seg-ciud').click(function (event){
        $("#solicita-main").hide();
    });

    $('#btn-places').click(function (event){
        $("#solicita-main").hide();
    });

    $('#btn-institu').click(function (event){
        $("#solicita-main").hide(); 
    });

    $('#btn-agua').click(function (event){
        $("#solicita-main").hide();
    });

    $('#btn-luz').click(function (event){
        $("#solicita-main").hide();
    });

    $('#btn-natu-alert').click(function (event){
        $("#solicita-main").hide();
    });

    $('#btn-otro-solicita').click(function (event){
        $("#solicita-main").hide(); 
    });

    //FIN MODAL AYUDA

    $('#btn-bug-body').click(function (event) {
        bootbox.confirm("¿Está seguro de eliminar este tweet <strong>" + document.getElementById("tweetText").innerHTML + "</strong> ?", function(result) {
            if(result){
                event.preventDefault(); 
  
                jQuery.support.cors = true;

               $.ajax({
                    url: "http://158.170.35.87:8080/tweetMobile/language/",
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

    $('#btn-bug-footer').click(function (event) {
        bootbox.confirm("¿Está seguro de eliminar este tweet <strong>" + document.getElementById("tweetText").innerHTML + "</strong> ?", function(result) {
            if(result){
                event.preventDefault(); 
  
                jQuery.support.cors = true;

               $.ajax({
                    url: "http://158.170.35.87:8080/tweetMobile/language/",
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

    // $('#btn-help').click(function(event){

    //});
});


