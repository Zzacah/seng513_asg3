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
		$('#messages').append($('<li>').text(person.nickname + ": " + msg));
    });

    socket.on('who', function(msg){
    	person = JSON.parse(msg);
    });
});
