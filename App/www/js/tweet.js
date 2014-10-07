
function checkTweet(id){  

    $.ajax({ url: 'http://192.168.2.40:8080/tweetClassifier/', type: 'GET',
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
    
});
$(document).ready(function(){
    $('#btn-classification').click(function (event) {
    	event.preventDefault(); 
        var checkedItems = [], counter = 0;
        $("#checked-list-box li.active").each(function(idx, li) {
            checkedItems[counter] = $(li).val();
            counter++;
        });
        console.log(checkedItems);
  
        jQuery.support.cors = true;

       $.ajax({
	        url: "http://192.168.2.40:8080/classifier/",
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