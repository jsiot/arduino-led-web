var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var serialPort = require('serialport').SerialPort;

var portName = '/dev/ttyACM0';
var readData = "";
var sp = new serialPort(portName, {
    baudRate: 57600,
    dataBits: 8,
    parity: 'none',
    stopBits: 1,
    flowControl: false,
});
var PORT = 3000;

io.sockets.on('connection', function (socket, debug) {
    if (debug == false) {
        socketServer.set('log level', 1);
    }
    socket.on('button', function (data) {
        var status = data.lampstatus;
        console.log("data from client: " + status);

        sp.open(function () {
            console.log('open');
            sp.on('data', function(data) {
                console.log('data received: ' + data);
            });

            sp.write(status, function(err, result){
                if(err) console.log('[ERROR] '+err);
                console.log(result);
            });
        });
    })
});

app.configure(function () {
    app.use(express.static(__dirname + '/public'));
});

app.get('/', function (req, res) {
    res.sendfile(__dirname + '/public/index.html');
});

server.listen(PORT, function(){
    console.log('listen on port '+PORT);    
});
