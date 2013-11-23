jQuery(function($){
	"use strict";

	//client side socket.io
	var socket = io.connect();
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
				console.log(new_wish);

				// clear values
				$('#name').val('');
				$('#message').val('');
				$('#email').val('');

				app.persist(new_wish);

				return false;
			}); 
		},

		socketActions: function(){
			 socket.on('added', function(data){
			 	app.addToList(data);
			 });
		},

		addToList: function(new_wish){
			$('#wishes').append('<li id="' + new_wish._id + '">' + new_wish.message +  '</li>');
		},
		
	};

	window.App = app.init();
});