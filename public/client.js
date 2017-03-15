// shorthand for $(document).ready(...)
$(function() {
    var socket = io();

    $('form').submit(function(){
		socket.emit('chat', $('#m').val());
		$('#m').val('');

        var $list = $('#messages li');

        if($list.length >= 200) {
            $('#messages').first().remove();
        }

		return false;
    });

    socket.on('connect', function() {
        socket.emit('newuser');
    });

    socket.on('newuser', function(name) {
        $('#messages').append($('<li>').text("You are connected as: " + name));
        $('#chat-user-lbl').text("You are: " + name);
    });

    socket.on('someoneconnected', function(name) {
        $('#messages').append($('<li>').text(name + " has connected to the chat."));
    });

    socket.on('updateusers', function(userlist) {
        $('#userlist').text("");

        for(let i in userlist) {
            $('#userlist').append($('<li>').html('<span style="color: '+ userlist[i].color + '">' 
            + userlist[i].nickname+ '</span>'));
        }
    });

    socket.on('chat', function(time, msg, name, color){
		$('#messages').append($('<li>').html(time + ' <span style="color: '+ color + '">' 
            + name + ': </span> ' + msg));
    });

    socket.on('boldedchat', function(time, msg, name, color) {
        $('#messages').append($('<li>').html(time + ' <b><span style="color: '+ color + '">' 
            + name + ': </span> ' + msg + '</b>'));
    });

    socket.on('someonerenamed', function(oldName, name, color) {
        $('#messages').append($('<li>').html('<span style="color: '+ color + '">' 
            + oldName + '</span>' + " has changed their name to: " + '<span style="color: '+ color + '">' 
            + name + '</span>'));
    });

    socket.on('namechange', function(name, color) {
        $('#messages').append($('<li>').html("Your name has been changed to: " + '<b><span style="color: '+ color + '">' 
            + name + '</span></b>'));
    });

    socket.on('fetchconversation', function(convo) {
        for(let i in convo) {
            $('#messages').append($('<li>').html('<span style="color: '+ convo[i].color + '">' 
            + convo[i].who + ': </span> ' + convo[i].msg));
        }
    });
});
