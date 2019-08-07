const express = require('express');
const app = express();
var http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use('/', express.static(__dirname + '/public/mobile/record/'));

io.on('connection', async function(socket){
    socket.on('mouse', function(data){
        console.log(data)
    })
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});