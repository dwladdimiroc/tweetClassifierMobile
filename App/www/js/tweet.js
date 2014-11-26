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
                class1: {subclass1 : 0, subclass2 : 0, subclass3 : 0, subclass4 : 0, subclass5 : 0, subclass6 : 0, subclass7 : 0, subclass8 : 0, subclass9 : 0, subclass10 : 0, subclass11 : 0, subclass12 : 0, subclass13 : 0, subclass14 : 0 },
                class2: {subclass1 : 0, subclass2 : 0, subclass3 : 0, subclass4 : 0,subclass5 : 0, subclass6 : 0, subclass7 : 0, subclass8 : 0, subclass9 : 0, subclass10 : 0, subclass11: 0, subclass12 : 0 },
                class3: 0,
                class4: 0
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
                    }else if($(div).attr("value") == 11){
                        classTweet.class1.subclass11 = 1;
                    }else if($(div).attr("value") == 12){
                        classTweet.class1.subclass12 = 1;
                    }else if($(div).attr("value") == 13){
                        classTweet.class1.subclass13 = 1;
                    }else if($(div).attr("value") == 14){
                        classTweet.class1.subclass14 = 1;
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
                        classTweet.class2.subclass11 = 1;
                    }else if($(div).attr("value") == 12){
                        classTweet.class2.subclass12 = 1;
                    }
                });
            }

            $(".btns").show();
            $("#footer").hide();
            $("#btn-prensa-head").hide();
            $("#btn-opinion-head").hide();
            $("#btn-lang-head").hide();
      
            jQuery.support.cors = true;

            $.blockUI({ 
                css: { 
                    border: 'none', 
                    padding: '15px', 
                    backgroundColor: '#000', 
                    '-webkit-border-radius': '10px', 
                    '-moz-border-radius': '10px', 
                    opacity: .5, 
                    color: '#fff' 
                },
                message:
                    "Clasificando..."
                
            });

           $.ajax({
    	        url: "http://158.170.35.87:8080/tweetMobile/classifier/",
    	        type: "POST",                
    	        data: { classification : JSON.stringify(classTweet) ,
    	        		tweet : document.getElementById("tweetText").innerHTML},
    	        success: function(data) {
                    $.unblockUI();
                    var idTweet = parseInt(document.getElementById("tweetNumber").innerHTML) - 1;
                    var arrayRandom = JSON.parse(window.localStorage.getItem("arrayRandom"));
                    arrayRandom.push(idTweet);
                    window.localStorage.setItem("arrayRandom", JSON.stringify(arrayRandom));
                    clearCheckList();
                    initTweet();
                },
                error: function(req,error) {
                    $.blockUI({ 
                        css: { 
                            border: 'none', 
                            padding: '15px', 
                            backgroundColor: '#000', 
                            '-webkit-border-radius': '10px', 
                            '-moz-border-radius': '10px', 
                            opacity: .5, 
                            color: '#fff' 
                        },
                        message:
                            "Error"
                        
                    });
                    setTimeout($.unblockUI, 2000);
                    console.log(req.responseText);
                    console.log(error);
                }
            });
        }
        else{
            //alert("Debe seleccionar por lo menos una categoría de clasificación");
            
            toastr.options = {
              "closeButton": false,
              "debug": false,
              "positionClass": "toast-top-right",
              "onclick": null,
              "showDuration": "300",
              "hideDuration": "1000",
              "timeOut": "1500",
              "extendedTimeOut": "1000",
              "showEasing": "swing",
              "hideEasing": "linear",
              "showMethod": "fadeIn",
              "hideMethod": "fadeOut"
            }

            toastr.warning('Debe seleccionar al menos una categoría');
        }
    });

    $('#btn-entrega-body').click(function (event) {
        $("#footer").show();
        $("#btn-clasificar").show();
        $("#entrega").show();
        $(".btns").hide();
        $("#btn-entrega-footer").show();
        $("#btn-solicita-footer").show();
        $("#btn-prensa-head").show();
        $("#btn-lang-head").show();
        $("#btn-opinion-head").show();
        $('#btn-entrega-footer').prop("disabled", true);
        $('#btn-clasificar').prop("disabled", false);
    });

    $('#btn-entrega-footer').click(function (event) {
        $("#solicita").hide();
        $("#entrega").show();
        $("#btn-solicita-head").hide();
        $('#btn-entrega-footer').prop("disabled", true);
        $('#btn-clasificar').prop("disabled", false);
        $('#btn-solicita-footer').prop("disabled",false);
    });


    $('#btn-solicita-body').click(function (event) {
        $("#footer").show();
        $("#solicita").show();
        $("#btn-clasificar").show();
        $(".btns").hide();
        $("#btn-solicita-footer").show();
        $("#btn-entrega-footer").show();
        $("#btn-prensa-head").show();
        $("#btn-lang-head").show();
        $("#btn-opinion-head").show();
        $('#btn-solicita-footer').prop("disabled", true);
        $('#btn-clasificar').prop("disabled", false);
    });

    $('#btn-solicita-footer').click(function (event) {
        $("#solicita").show();
        $("#entrega").hide();
        $("#btn-entrega-head").hide();
        $('#btn-entrega-footer').prop("disabled", false);
        $('#btn-clasificar').prop("disabled", false);
        $('#btn-solicita-footer').prop("disabled",true);
    });

    //Modal de ayuda//

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
        $("#info-text").hide();
    });

    $('#btn-pers-enc').click(function (event){
        $("#entrega-main").hide();
        $("#info-text").show();
        $("#info-text").empty();
        $("#info-text").append("Todo tweet que informe el hallazgo de una persona que estuvo desaparecida.");
    });


    $('#btn-est-pers').click(function (event){
        $("#entrega-main").hide();
        $("#info-text").show();
        $("#info-text").empty();
        $("#info-text").append("Todo tweet en que un individuo informa sobre su propio estado de salud.");
    });

    $('#btn-lugares').click(function (event){
        $("#entrega-main").hide();
        $("#info-text").show();
        $("#info-text").empty();
        $("#info-text").append("Todo tweet en que se ofrezca información sobre un lugar geográfico específico o que entregue información sobre aspectos relacionados a la infraestructura de un lugar puntual.");
    });

    $('#btn-inst').click(function (event){
        $("#entrega-main").hide();
        $("#info-text").show();
        $("#info-text").empty();
        $("#info-text").append("Todo tweet que entregue información sobre alguna institución. Tweets donde la gente entrega datos de contacto de una institución, por ejemplo, albergues u otros.");        
    });

    $('#btn-corte-agua').click(function (event){
        $("#entrega-main").hide();
        $("#info-text").show();
        $("#info-text").empty();
        $("#info-text").append("Todo tweet que entregue información sobre cortes de agua potable.");        
    });

    $('#btn-repo-agua').click(function (event){
        $("#entrega-main").hide();
        $("#info-text").show();
        $("#info-text").empty();
        $("#info-text").append("Todo tweet que entregue información sobre la reposición del agua potable.");
    });

    $('#btn-repo-luz').click(function (event){
        $("#entrega-main").hide();
        $("#info-text").show();
        $("#info-text").empty();
        $("#info-text").append("Todo tweet que entregue información sobre la reposición de luz.");
    });

    $('#btn-corte-luz').click(function (event){
        $("#entrega-main").hide();
        $("#info-text").show();
        $("#info-text").empty();
        $("#info-text").append("Todo tweet que entregue información sobre cortes de luz.");
    });

    $('#btn-aler-natu').click(function (event){
        $("#entrega-main").hide();
        $("#info-text").show();
        $("#info-text").empty();
        $("#info-text").append("Todo tweet que entregue información respecto a una emergencia producida por causas naturales (tsunamis, incendios…).");
    });

    $('#btn-otro-entrega').click(function (event){
        $("#entrega-main").hide();
        $("#info-text").show();
        $("#info-text").empty();
        $("#info-text").append("Todo tweet en que se entregue información sobre un evento en curso, no relacionado a las categorías anteriores.");
    });

    $('#btn-pers-perd').click(function (event){
        $("#solicita-main").hide();  
        $("#info-text").show();
        $("#info-text").empty();
        $("#info-text").append("Todo tweet cuyo contenido sea solicitar información respecto de alguien específico o un grupo familiar específico. Necesidad de encontrar a alguien.");     
    });

    $('#btn-trans').click(function (event){
        $("#solicita-main").hide();
        $("#info-text").show();
        $("#info-text").empty();
        $("#info-text").append("Todo tweet en que se manifieste la necesidad de contar con un medio de transporte o alguna necesidad urgente de movilidad urgente.");
    });
    
    $('#btn-ayu-damn').click(function (event){
        $("#solicita-main").hide();
        $("#info-text").show();
        $("#info-text").empty();
        $("#info-text").append("Todo tweet que manifieste la necesidad de contar con alimentos, ropa o medicamentos en función de entregárselos a alguien más. Cabrían todos los tweets en que se requieren objetos puntuales para entregar ayuda.");
    });

    $('#btn-volun').click(function (event){
        $("#solicita-main").hide();
        $("#info-text").show();
        $("#info-text").empty();
        $("#info-text").append("Todo tweet que indique la necesidad de contar con personal voluntario. Un tweet en esta categoría debe centrarse en el requisito de mano de obra para alguna labora de ayuda.");
    });

    $('#btn-seg-ciud').click(function (event){
        $("#solicita-main").hide();
        $("#info-text").show();
        $("#info-text").empty();
        $("#info-text").append("Todo tweet donde se indique una amenaza para la seguridad de algún grupo o población, de origen no natural. Cabrían todos los tweets en que se mencionen saqueos o se denuncien hechos delictivos de diversa índole");
    });

    $('#btn-places').click(function (event){
        $("#solicita-main").hide();
        $("#info-text").show();
        $("#info-text").empty();
        $("#info-text").append("Todo tweet en que se solicite información sobre un lugar geográfico específico o de un lugar puntual");
    });

    $('#btn-institu').click(function (event){
        $("#solicita-main").hide(); 
        $("#info-text").show();
        $("#info-text").empty();
        $("#info-text").append("Todo tweet que solicite información sobre alguna institución. Tweets donde la gente pide datos de contacto de una institución, por ejemplo, albergues u otros.");
    });

    $('#btn-agua').click(function (event){
        $("#solicita-main").hide();
        $("#info-text").show();
        $("#info-text").empty();
        $("#info-text").append("Todo tweet que solicite información sobre el estado del servicio de agua potable (corte o reposición).");
    });

    $('#btn-luz').click(function (event){
        $("#solicita-main").hide();
        $("#info-text").show();
        $("#info-text").empty();
        $("#info-text").append("Todo tweet que solicite información sobre el estado del suministro eléctrico (corte o reposición).");
    });

    $('#btn-natu-alert').click(function (event){
        $("#solicita-main").hide();
        $("#info-text").show();
        $("#info-text").empty();
        $("#info-text").append("Todo tweet que solicite información respecto a una emergencia producida por causas naturales (tsunamis, incendios…).");
    });

    $('#btn-otro-solicita').click(function (event){
        $("#solicita-main").hide(); 
        $("#info-text").show();
        $("#info-text").empty();
        $("#info-text").append("Todo tweet en que se solicite información sobre un evento en curso, no relacionado a las categorías anteriores.");
    });

    //FIN MODAL AYUDA

    $('#btn-prensa-body').click(function (event) {
        var classTweet = {
                class1: {subclass1 : 0, subclass2 : 0, subclass3 : 0, subclass4 : 0, subclass5 : 0, subclass6 : 0, subclass7 : 0, subclass8 : 0, subclass9 : 0, subclass10 : 0, subclass11 : 0, subclass12 : 0, subclass13 : 0, subclass14 : 0 },
                class2: {subclass1 : 0, subclass2 : 0, subclass3 : 0, subclass4 : 0,subclass5 : 0, subclass6 : 0, subclass7 : 0, subclass8 : 0, subclass9 : 0, subclass10 : 0, subclass11: 0, subclass12 : 0 },
                class3: 0,
                class4: 1
            };

        event.preventDefault(); 

        jQuery.support.cors = true;

        $.blockUI({ 
            css: { 
                border: 'none', 
                padding: '15px', 
                backgroundColor: '#000', 
                '-webkit-border-radius': '10px', 
                '-moz-border-radius': '10px', 
                opacity: .5, 
                color: '#fff' 
            },
            message:
                "Clasificando..." 
        });

        $.ajax({
            url: "http://158.170.35.87:8080/tweetMobile/classifier/",
            type: "POST",                
            data: { classification : JSON.stringify(classTweet) ,
                    tweet : document.getElementById("tweetText").innerHTML},
            success: function(data) {
                $.unblockUI();
                var idTweet = parseInt(document.getElementById("tweetNumber").innerHTML) - 1;
                var arrayRandom = JSON.parse(window.localStorage.getItem("arrayRandom"));
                arrayRandom.push(idTweet);
                window.localStorage.setItem("arrayRandom", JSON.stringify(arrayRandom));
                clearCheckList();
                initTweet();
            },
            error: function(req,error) {
                $.blockUI({ 
                    css: { 
                        border: 'none', 
                        padding: '15px', 
                        backgroundColor: '#000', 
                        '-webkit-border-radius': '10px', 
                        '-moz-border-radius': '10px', 
                        opacity: .5, 
                        color: '#fff' 
                    },
                    message:
                        "Error"
                    
                });
                setTimeout($.unblockUI, 2000);
                console.log(req.responseText);
                console.log(error);
            }
        });
    });

    $('#btn-prensa-head').click(function (event) {
        var classTweet = {
                class1: {subclass1 : 0, subclass2 : 0, subclass3 : 0, subclass4 : 0, subclass5 : 0, subclass6 : 0, subclass7 : 0, subclass8 : 0, subclass9 : 0, subclass10 : 0, subclass11 : 0, subclass12 : 0, subclass13 : 0, subclass14 : 0 },
                class2: {subclass1 : 0, subclass2 : 0, subclass3 : 0, subclass4 : 0,subclass5 : 0, subclass6 : 0, subclass7 : 0, subclass8 : 0, subclass9 : 0, subclass10 : 0, subclass11: 0, subclass12 : 0 },
                class3: 0,
                class4: 1
            };

        event.preventDefault(); 

        jQuery.support.cors = true;

        $.blockUI({ 
            css: { 
                border: 'none', 
                padding: '15px', 
                backgroundColor: '#000', 
                '-webkit-border-radius': '10px', 
                '-moz-border-radius': '10px', 
                opacity: .5, 
                color: '#fff' 
            },
            message:
                "Clasificando..." 
        });

        $.ajax({
            url: "http://158.170.35.87:8080/tweetMobile/classifier/",
            type: "POST",                
            data: { classification : JSON.stringify(classTweet) ,
                    tweet : document.getElementById("tweetText").innerHTML},
            success: function(data) {
                $.unblockUI();
                var idTweet = parseInt(document.getElementById("tweetNumber").innerHTML) - 1;
                var arrayRandom = JSON.parse(window.localStorage.getItem("arrayRandom"));
                arrayRandom.push(idTweet);
                window.localStorage.setItem("arrayRandom", JSON.stringify(arrayRandom));
                clearCheckList();
                initTweet();
            },
            error: function(req,error) {
                $.blockUI({ 
                    css: { 
                        border: 'none', 
                        padding: '15px', 
                        backgroundColor: '#000', 
                        '-webkit-border-radius': '10px', 
                        '-moz-border-radius': '10px', 
                        opacity: .5, 
                        color: '#fff' 
                    },
                    message:
                        "Error"
                    
                });
                setTimeout($.unblockUI, 2000);
                console.log(req.responseText);
                console.log(error);
            }
        });

        $("#entrega").hide();
        $("#solicita").hide();
        $("#btn-prensa-head").hide();
        $("#btn-opinion-head").hide();
        $("#btn-lang-head").hide();
        $("#footer").hide();
        $(".btns").show();
    });

    $('#btn-opinion-body').click(function (event) {
        var classTweet = {
                class1: {subclass1 : 0, subclass2 : 0, subclass3 : 0, subclass4 : 0, subclass5 : 0, subclass6 : 0, subclass7 : 0, subclass8 : 0, subclass9 : 0, subclass10 : 0, subclass11 : 0, subclass12 : 0, subclass13 : 0, subclass14 : 0 },
                class2: {subclass1 : 0, subclass2 : 0, subclass3 : 0, subclass4 : 0,subclass5 : 0, subclass6 : 0, subclass7 : 0, subclass8 : 0, subclass9 : 0, subclass10 : 0, subclass11: 0, subclass12 : 0 },
                class3: 1,
                class4: 0
            };

        event.preventDefault(); 

        jQuery.support.cors = true;

        $.blockUI({ 
            css: { 
                border: 'none', 
                padding: '15px', 
                backgroundColor: '#000', 
                '-webkit-border-radius': '10px', 
                '-moz-border-radius': '10px', 
                opacity: .5, 
                color: '#fff' 
            },
            message:
                "Clasificando..." 
        });

        $.ajax({
            url: "http://158.170.35.87:8080/tweetMobile/classifier/",
            type: "POST",                
            data: { classification : JSON.stringify(classTweet) ,
                    tweet : document.getElementById("tweetText").innerHTML},
            success: function(data) {
                $.unblockUI();
                var idTweet = parseInt(document.getElementById("tweetNumber").innerHTML) - 1;
                var arrayRandom = JSON.parse(window.localStorage.getItem("arrayRandom"));
                arrayRandom.push(idTweet);
                window.localStorage.setItem("arrayRandom", JSON.stringify(arrayRandom));
                clearCheckList();
                initTweet();
            },
            error: function(req,error) {
                $.blockUI({ 
                    css: { 
                        border: 'none', 
                        padding: '15px', 
                        backgroundColor: '#000', 
                        '-webkit-border-radius': '10px', 
                        '-moz-border-radius': '10px', 
                        opacity: .5, 
                        color: '#fff' 
                    },
                    message:
                        "Error"
                    
                });
                setTimeout($.unblockUI, 2000);
                console.log(req.responseText);
                console.log(error);
            }
        });
    });

    $('#btn-opinion-head').click(function (event) {
        var classTweet = {
                class1: {subclass1 : 0, subclass2 : 0, subclass3 : 0, subclass4 : 0, subclass5 : 0, subclass6 : 0, subclass7 : 0, subclass8 : 0, subclass9 : 0, subclass10 : 0, subclass11 : 0, subclass12 : 0, subclass13 : 0, subclass14 : 0 },
                class2: {subclass1 : 0, subclass2 : 0, subclass3 : 0, subclass4 : 0,subclass5 : 0, subclass6 : 0, subclass7 : 0, subclass8 : 0, subclass9 : 0, subclass10 : 0, subclass11: 0, subclass12 : 0 },
                class3: 1,
                class4: 0
            };

        event.preventDefault(); 

        jQuery.support.cors = true;

        $.blockUI({ 
            css: { 
                border: 'none', 
                padding: '15px', 
                backgroundColor: '#000', 
                '-webkit-border-radius': '10px', 
                '-moz-border-radius': '10px', 
                opacity: .5, 
                color: '#fff' 
            },
            message:
                "Clasificando..." 
        });

        $.ajax({
            url: "http://158.170.35.87:8080/tweetMobile/classifier/",
            type: "POST",                
            data: { classification : JSON.stringify(classTweet) ,
                    tweet : document.getElementById("tweetText").innerHTML},
            success: function(data) {
                $.unblockUI();
                var idTweet = parseInt(document.getElementById("tweetNumber").innerHTML) - 1;
                var arrayRandom = JSON.parse(window.localStorage.getItem("arrayRandom"));
                arrayRandom.push(idTweet);
                window.localStorage.setItem("arrayRandom", JSON.stringify(arrayRandom));
                clearCheckList();
                initTweet();
            },
            error: function(req,error) {
                $.blockUI({ 
                    css: { 
                        border: 'none', 
                        padding: '15px', 
                        backgroundColor: '#000', 
                        '-webkit-border-radius': '10px', 
                        '-moz-border-radius': '10px', 
                        opacity: .5, 
                        color: '#fff' 
                    },
                    message:
                        "Error"
                    
                });
                setTimeout($.unblockUI, 2000);
                console.log(req.responseText);
                console.log(error);
            }
        });

        $("#entrega").hide();
        $("#solicita").hide();
        $("#btn-prensa-head").hide();
        $("#btn-opinion-head").hide();
        $("#btn-lang-head").hide();
        $("#footer").hide();
        $(".btns").show();
    });

    $('#btn-bug-body').click(function (event) {
        bootbox.confirm("¿Está seguro de eliminar este tweet <strong>" + document.getElementById("tweetText").innerHTML + "</strong> ?", function(result) {
            if(result){
                event.preventDefault(); 
  
                jQuery.support.cors = true;

                $.blockUI({ 
                    css: { 
                        border: 'none', 
                        padding: '15px', 
                        backgroundColor: '#000', 
                        '-webkit-border-radius': '10px', 
                        '-moz-border-radius': '10px', 
                        opacity: .5, 
                        color: '#fff' 
                    },
                    message:
                        "Borrando..."
                    
                });
               $.ajax({
                    url: "http://158.170.35.87:8080/tweetMobile/language/",
                    type: "POST",
                    data: { tweet : document.getElementById("tweetText").innerHTML},
                    success: function(data) {
                        $.unblockUI();
                        var idTweet = parseInt(document.getElementById("tweetNumber").innerHTML) - 1;
                        var arrayRandom = JSON.parse(window.localStorage.getItem("arrayRandom"));
                        arrayRandom.push(idTweet);
                        window.localStorage.setItem("arrayRandom", JSON.stringify(arrayRandom));
                        clearCheckList();
                        initTweet();
                    },
                    error: function(req,error) { 
                    $.blockUI({ 
                        css: { 
                            border: 'none', 
                            padding: '15px', 
                            backgroundColor: '#000', 
                            '-webkit-border-radius': '10px', 
                            '-moz-border-radius': '10px', 
                            opacity: .5, 
                            color: '#fff' 
                        },
                        message:
                            "Error"
                        
                    });
                    setTimeout($.unblockUI, 2000);
                    console.log(req.responseText);
                    }
                });
            }  
        });
    });


    $('#btn-lang-head').click(function (event) {
        bootbox.confirm("¿Está seguro de eliminar este tweet <strong>" + document.getElementById("tweetText").innerHTML + "</strong> ?", function(result) {
            if(result){
                event.preventDefault(); 
  
                jQuery.support.cors = true;

                $.blockUI({ 
                    css: { 
                        border: 'none', 
                        padding: '15px', 
                        backgroundColor: '#000', 
                        '-webkit-border-radius': '10px', 
                        '-moz-border-radius': '10px', 
                        opacity: .5, 
                        color: '#fff' 
                    },
                    message:
                        "Borrando..."
                    
                });
               $.ajax({
                    url: "http://158.170.35.87:8080/tweetMobile/language/",
                    type: "POST",
                    data: { tweet : document.getElementById("tweetText").innerHTML},
                    success: function(data) {
                        $.unblockUI();
                        var idTweet = parseInt(document.getElementById("tweetNumber").innerHTML) - 1;
                        var arrayRandom = JSON.parse(window.localStorage.getItem("arrayRandom"));
                        arrayRandom.push(idTweet);
                        window.localStorage.setItem("arrayRandom", JSON.stringify(arrayRandom));
                        clearCheckList();
                        initTweet();
                    },
                    error: function(req,error) { 
                    $.blockUI({ 
                        css: { 
                            border: 'none', 
                            padding: '15px', 
                            backgroundColor: '#000', 
                            '-webkit-border-radius': '10px', 
                            '-moz-border-radius': '10px', 
                            opacity: .5, 
                            color: '#fff' 
                        },
                        message:
                            "Error"
                        
                    });
                    setTimeout($.unblockUI, 2000);
                        console.log(req.responseText);
                    }
                });
            $("#entrega").hide();
            $("#solicita").hide();
            $("#btn-prensa-head").hide();
            $("#btn-opinion-head").hide();
            $("#btn-lang-head").hide();
            $("#footer").hide();
            $(".btns").show();
            }  
        });
    });
});


