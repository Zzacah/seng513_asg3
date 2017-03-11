var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

var userCounter = 0;
var users = [];

http.listen( port, function () {
    console.log('listening on port', port);
});

app.use(express.static(__dirname + '/public'));

// listen to 'chat' messages
io.on('connection', function(socket){
	var nickname = "User " + userCounter;
	var color = '#'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6);
	var currentUser = new person(nickname, color)
	userCounter++;

	users.push(currentUser);

	console.log(JSON.stringify(users, null, 2));

  socket.on('chat', function(msg){
		io.emit('who', JSON.stringify(currentUser, null, 2));
		socket.broadcast.emit('chat', msg);
		socket.emit('boldedchat', msg);
  });

  socket.on('disconnect', function() {
    var whoLeftName = person.nickname;

    var indexOfDisconnected = users.indexOf(person.nickname);
    users.splice(indexOfDisconnected, 1);

    io.emit('disconnected', whoLeftName + " disconnected.");
  });
});

function person(name, color) {
	this.nickname = name;
	this.color = color;
}
