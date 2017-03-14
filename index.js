var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

var userCounter = 0;
var users = [];
var messages = [];

http.listen( port, function () {
    console.log('listening on port', port);
});

app.use(express.static(__dirname + '/public'));

// listen to 'chat' messages
io.on('connection', function(socket){
	var nickname = "User " + userCounter;
	var color = '#'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6);
	var currentUser = new person(nickname, color);
	userCounter++;

	users.push(currentUser);

  socket.on('chat', function(msg){

  	var msgLength = msg.length;

  	if (msg.substring(0,6) == "/nick ") {
  		// change nickname, don't send a message
  		var newName = msg.substring(6,msgLength);

  		if(users.indexOf(newName) >= 0) {
  			socket.emit('newNameError', newName + " is already taken.");
  		} else {
  			io.emit('nickchange', nickname + " has changed their name to " + newName);
  			person.nickname = newName;
  			users[users.indexOf(nickname)] = newName;
  			console.log(users[users.indexOf(nickname)]);
  		}

  	} else if (msg.substring(0,13) == "/nickcolor ") {
  		// change nickname color, don't send a message

  	} else {
  		//don't change anything and just send a normal message
		messages.push({who: person.nickname, color: person.color, text: msg});
		io.emit('who', JSON.stringify(users[users.indexOf(nickname)], null, 2));
		socket.broadcast.emit('chat', msg);
		socket.emit('boldedchat', msg);
	}
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
