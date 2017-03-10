// shorthand for $(document).ready(...)
$(function() {
    var socket = io();
    var person = {};

    $('form').submit(function(){
		socket.emit('chat', $('#m').val());
		$('#m').val('');
		return false;
    });

    socket.on('chat', function(msg){
		$('#messages').append($('<li>').html('<span style="color: '+ person.color + '">' 
			+ person.nickname + ': </span> ' + msg));
    });

    socket.on('who', function(msg){
    	person = JSON.parse(msg);
    });
});
