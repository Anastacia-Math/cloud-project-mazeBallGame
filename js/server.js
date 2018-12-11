// Зависимости
var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');
var app = express();
var server = http.Server(app);
var io = socketIO(server);

//app.set('port', 5000); - локально
app.set('port', '3000');
app.use('/static', express.static(__dirname + '/static'));

// Маршруты
app.get('/', function(request, response) {
    response.sendFile(path.join(__dirname, 'index.html'));
});

// Запуск сервера локально
server.listen(3000, function() {
    console.log('Запускаю сервер на порте 3000');
});

// Обработчик веб-сокетов
io.on('connection', function(socket) {
});

// Отслеживаем движение клиентов
var players = {};
var timer = 59;
io.on('connection', function(socket) {
  socket.on('new player', function(personName) {
    players[socket.id] = {
      id: socket.id,
      name: personName,  
      x: 150,
      y: 460,
      width: 14,
      height: 14
    };
    return players[socket.id];
  });
  // Вернуть игроков на позиции по окончанию таймера
  socket.on('restartGame', function() {
    for (let id in players) {
      players[id].x = 150;
      players[id].y = 460;
    }
  });
  socket.on('movement', function(data) {
    var player = players[socket.id] || {};
    if (data.left) {
      player.x -= 2;
    }
    if (data.up) {
      player.y -= 2;
    }
    if (data.right) {
      player.x += 2;
    }
    if (data.down) {
      player.y += 2;
    }
  });
  socket.on('disconnect', function() {
      delete players[socket.id];
  });
});
setInterval(function() {
  io.sockets.emit('state', players);
}, 1000 / 50);
setInterval(function() {
  io.sockets.emit('timer', --timer);
  if (timer < 1) {
    timer = 60;
  }
}, 1000);