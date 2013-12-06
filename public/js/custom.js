/*
 * Custom JS
*/

var i = 1;
$(document).ready(function () {

    reSizeTree();
    
    $('#see-more').click(function(e) {
        e.preventDefault();
        $('#wish-form').slideToggle('fast', function() {
            //change direction of arrow
        });
    });
    
    $('.bulb').each(function() {
        $(this).bulbify(i);
        i++;
    });
    
    $('.bulb span').hover(function() {
        $(this).removeClass('animated bounceIn'); 
    });
    
    $('#bulbs').on( "click", ".bulb span", function() {
        
        $.magnificPopup.open({
            items: {
                src: '<div id="bulb-popup" class="animated bounceIn fast" style="background-position: ' + ($(this).css('background-position').split('px ')[0] * 5) + 'px' + '"></div>',
                type: 'inline',
            },
            mainClass: 'mfp-with-zoom',
            zoom: {
                enabled: true,
                duration: 300,
                easing: 'ease-in-out',
            }
        });
        
    });
    
    $('#wish-submit').click(function(e) {
        e.preventDefault();
        $('#wish-form').slideToggle('fast', function() {
            //change direction of arrow
        });
        
        $('body').scrollTo($('.bulb').last()); // Scroll Screen to new bulb just added
        
        // Scroll Browser to new li just added
        
    });
});

function reSizeTree()
{
    var treeBodyOrigHeight = 220; /* Original height of tree-body div */
    var numBublbsTreeTop = 8; /* # of bulbs that fit on tree-top */  
    var bulbsPerRow = 4; /* ~# of bulbs that fit horizontally */
    var bulbsPerCol = 2 /* Math.ceil($('#tree-body').height() / $('.bulb').height()); /* ~# of bulbs that fit vertically */
    
    var bodyCount = Math.ceil((($('.bulb').length / bulbsPerRow ) - numBublbsTreeTop)/ bulbsPerCol) + 1; /* Amount of repeated limbs needed */
    $('#tree-body').height(treeBodyOrigHeight * bodyCount);
}

function getRandom()
{
    var spreadOffset = 7;
    var e = Math.floor((Math.random() * 3))
    if (e == 0 ) return Math.floor((Math.random() * spreadOffset + spreadOffset )); // Positive
    else if (e == 1) return Math.floor((Math.random() * (spreadOffset * -1) - spreadOffset )); // Negative
    else return 0;
    
}

function newBulbAdded()
{
    reSizeTree(); // check if more tree-body is needed
    $newBulb = $('.bulb').last(); // isolates most recent bulb added
    $newBulb.bulbify(i);
    i++;
}


jQuery.fn.bulbify = function(index) {
    $ele = $(this); // li
    $bulb = $ele.children(':first'); // span
    
    $ele.css('top', getRandom());
    $ele.css('left', getRandom());
    $ele.scaleRotate(Math.random() * .2 + .9, Math.random() * 40 - 20);
    $ele.css({
        '-webkit-animation-delay' : Math.random() * 3 + 's',
        '-moz-animation-delay' :  Math.random() * 3 + 's',
        '-ms-animation-delay' : Math.random() * 3 + 's' 
    });
    $ele.addClass('sway');

    $bulb.css('background-position', Math.floor((Math.random() * 12)) * 100);
    $bulb.addClass('animated bounceIn');
    $bulb.css({'-webkit-animation-duration' : '.5s',
               '-moz-animation-duration' : '.5s',
               '-ms-animation-duration' : '.5s',
               '-webkit-animation-delay' : 2.5 * Math.pow(.95, index) + 's',
               '-moz-animation-delay' : 2.5 * Math.pow(.95, index) + 's',
               '-ms-animation-delay' : 2.5 * Math.pow(.95, index) + 's'
    });
    
    if (index == 1 || index == 3 || index == 6 || index == 10 || (index > 10 && index % 5 == 0)) $(this).after('<br>');
};

jQuery.fn.scaleRotate = function(offset, degrees) {
    $(this).css({'-webkit-transform' : 'scale('+ offset + ', ' + offset + ') ' + 'rotate('+ degrees +'deg)',
                 '-moz-transform' : 'scale('+ offset + ', ' + offset + ') ' + 'rotate('+ degrees +'deg)',
                 '-ms-transform' : 'scale('+ offset + ', ' + offset +') ' + 'rotate('+ degrees +'deg)',
                 'transform' : 'scale('+ offset + ', ' + offset +') ' + 'rotate('+ degrees +'deg)'});
};