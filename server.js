var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var serialPort = require('serialport').SerialPort;

var PORT = 3000;
var portName = '/dev/ttyACM0';
var sp = new serialPort(portName, {
    baudRate: 57600,
    dataBits: 8,
    parity: 'none',
    stopBits: 1,
    flowControl: false,
});

app.use(express.static(__dirname + '/public'));

io.sockets.on('connection', function (socket, debug) {
    if (debug == false) {
        socket.set('log level', 1);
    }
    socket.on('button', function (data) {
        var status = data.lampstatus;
        console.log("[Client] " + status);

        sp.open(function () {
            sp.on('data', function(data) {
                console.log('[Received] ' + data);
            });

            sp.write(status, function(err, result){
                if(err) console.log('[ERROR] '+err);
            });
        });
    })
});

app.get('/', function (req, res) {
    res.sendfile(__dirname + '/public/index.html');
});

server.listen(PORT, function(){
    console.log('Listen on port '+PORT);    
});