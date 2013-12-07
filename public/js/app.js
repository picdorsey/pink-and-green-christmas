jQuery(function($){
	"use strict";

	// client side socket.io
	var socket = io.connect();
	
	// application client-side
	var app = {
		
		init: function(){
			this.actions();
			this.socketActions();
		},

		persist: function(new_wish){
			socket.emit('add', new_wish);
		},

		actions: function(){
			$('#wish-form').submit(function(){
				if(!$('#wish-form #message').val()){
					return false;
				}

				var new_wish = {
					name: $('#name').val(),
					message: $('#message').val(),
					email: $('#email').val(),
				}

				// clear values
				$('#name').val('');
				$('#message').val('');
				$('#email').val('');

				app.persist(new_wish);
				navigateTo();
				return false;
			}); 
		},

		socketActions: function(){
			 socket.on('added', function(data){
			 	app.addToList(data);
			 	newBulbAdded();
			 });
		},

		addToList: function(new_wish){
			$('#bulbs').append('<li id="' + new_wish._id + '" class="bulb"><span></span></li>');
		},
		
	};

	window.App = app.init();
});