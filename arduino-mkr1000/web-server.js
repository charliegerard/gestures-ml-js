var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/examples/sprite-test'))

io.on('connection', function(socket){
  console.log('a user connected');

  socket.emit('gesture', 'hadoken');
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});