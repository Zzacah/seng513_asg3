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

	socket.on('newuser', function() {
		var nickname = "User " + userCounter;
		var color = '#'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6);
		userCounter++;
		socket.nick = nickname;
		socket.color = color;
		users.push({nickname: nickname, color: color});
		socket.emit('newuser', nickname);
		socket.broadcast.emit('someoneconnected', nickname);
		socket.emit('fetchconversation', messages);
		console.log(users);
		io.emit('updateusers', users);
	});

	socket.on('chat', function(msg){

		timestamp = new Date();
		time = timestamp.getHours() + ":" + timestamp.getMinutes();

		if(msg.startsWith("/nick ")) {
			let oldName = socket.nick;
			socket.nick = msg.slice(6);
			changeName(oldName, socket.nick);
			io.emit('updateusers', users);
			socket.broadcast.emit('someonerenamed', oldName, socket.nick, socket.color);
			socket.emit('namechange', socket.nick, socket.color);
		} else if (msg.startsWith("/nickcolor ")) {
			socket.color = msg.slice(11);
			changeColor(socket.nick, socket.color);
			io.emit('updateusers', users);
		} else {
			//don't change anything and just send a normal message
			socket.broadcast.emit('chat', time, msg, socket.nick, socket.color);
			socket.emit('boldedchat', time, msg, socket.nick, socket.color);
			if(messages.length >= 200) {
				messages.shift();
			} 
			messages.push({who: socket.nick, color: socket.color, msg: msg});
		}
	});

	socket.on('disconnect', function() {
		findIndex(socket.nick);
		io.emit('updateusers', users);
	});
});

function changeName(name, newName) {
	for(let i in users) {
		if (users[i].nickname === name) {
			users[i].nickname = newName;
		}
	}
}

function changeColor(name, color) {
	for(let i in users) {
		if (users[i].nickname === name) {
			users[i].color = color;
		}
	}
}

function findIndex(name) {
	for(let i in users) {
		if (users[i].nickname === name) {
			users.splice(i, 1);
		}
	}
}
