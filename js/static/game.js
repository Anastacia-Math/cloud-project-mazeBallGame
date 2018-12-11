var socket = io();
var time = document.getElementById('timer');
var overlayLose = document.getElementById('overlay-lose');
var overlayWin = document.getElementById('overlay-win');
var winnerText = document.getElementById('winnerText');
// socket.on('message', function(data) {
//     console.log(data);
// });

// Отправление клиентом состояний клавиатуры
var movement = {
  up: false,
  down: false,
  left: false,
  right: false
}
var maze = {};
var finish = {
  x: 280,
  y: 305,
  width: 75,
  height: 35
};


// Обратный отсчёт
// function gameTime() {
//   time.innerHTML--;
//   if(time.innerHTML < 10 && time.innerHTML > 0) {
//     time.innerHTML = "0" + time.innerHTML;
//   }
//   if(time.innerHTML == 0) {
//     time.innerHTML = 59;
//     reloadGame();
//   }
//   setTimeout(gameTime, 1000);
// }
// setTimeout(gameTime, 1000);


// Скрываем всплывашку поражения
function hideOverlayLose() {
  overlayLose.style.display = "none";
}
// Скрываем победную всплывашку
function hideOverlayWin() {
  overlayWin.style.display = "none";
}
// Составляем лабиринт из линий
function addMaze(xx, yy, wid, hei, i) {
  maze[i] = {
    x: xx,
    y: yy,
    width: wid,
    height: hei
  };
}
// Проверка коллизии
function checkCollision(obj1,obj2) {
  var XColl=false;
  var YColl=false;
  //console.log(obj1.x + " " + obj1.y + " " + obj1.width + " " + obj1.height);

  if ((obj1.x + obj1.width >= obj2.x) && (obj1.x <= obj2.x + obj2.width)) XColl = true;
  if ((obj1.y + obj1.height >= obj2.y) && (obj1.y <= obj2.y + obj2.height)) YColl = true;

  if (XColl&YColl) {
    return true;
  }
  return false;
}
// Заполняем массив линий, из которых состоит лабиринт
function startMaze() {
  addMaze(639, 0, 10, 490, 0);
  addMaze(6, 490, 643, 10, 1);
  addMaze(6, 0, 10, 490, 2);
  addMaze(6, 0, 640, 10, 3);
  addMaze(520, 55, 10, 390, 4);
  addMaze(110, 60, 10, 380, 5);
  addMaze(195, 200, 10, 300, 6);
  addMaze(110, 435, 90, 10, 7);
  addMaze(240, 435, 220, 10, 8);
  addMaze(110, 55, 420, 10, 9);
  addMaze(355, 140, 10, 210, 10);
  addMaze(280, 340, 140, 10, 11);
  addMaze(200, 140, 160, 10, 12);
  addMaze(270, 230, 10, 150, 13);
}

// Отслеживаем нажатие клавиш
document.addEventListener('keydown', function (event) {
  switch (event.keyCode) {
    case 65: // A
      movement.left = true;
      break;
    case 87: // W
      movement.up = true;
      break;
    case 68: // D
      movement.right = true;
      break;
    case 83: // S
      movement.down = true;
      break;
  }
});
// Отслеживаем отпускание клавиш
document.addEventListener('keyup', function (event) {
  switch (event.keyCode) {
    case 65: // A
      movement.left = false;
      break;
    case 87: // W
      movement.up = false;
      break;
    case 68: // D
      movement.right = false;
      break;
    case 83: // S
      movement.down = false;
      break;
  }
});

personName = window.prompt("Введите ваше имя");

var nickname = socket.emit('new player', personName);

startMaze();
setInterval(function () {
  socket.emit('movement', movement);
}, 1000 / 50);

socket.on('timer', function (t) {  
  time.innerHTML = t;
  if(t == 0) {
    t = 59;
    socket.emit('restartGame');
  }
  if(t< 10 && t >= 0) {
    time.innerHTML = "0" + t;
  }
}); 

var canvas = document.getElementsByClassName('canvas')[0];
canvas.width = 670;
canvas.height = 500;
var context = canvas.getContext('2d');
socket.on('state', function (players) {
  context.clearRect(0, 0, 670, 500); //Очищает холст, чтобы заново отрисовать модели
  // отрисовываем ЛАБИРИНТ
  context.beginPath();
  context.fillStyle = 'black';

  // Рисуем лабиринт
  for (let lin in maze) {
    let line = maze[lin];
    context.rect(line.x, line.y, line.width, line.height);
  }
  context.fill();

  context.beginPath();
  context.fillStyle = 'green';
  context.rect(280, 305, 75, 35);
  context.fill();

  
  context.beginPath();
  context.fillStyle = 'red';
  context.rect(110, 445, 85, 45);
  context.fill();

  let player;
  // РИСУЕМ ИГРОКОВ
  for (var id in players) {
    player = players[id];
    // Если это кружок не пользователя, то прозрачность 0.7
    if (player.id == nickname.id) {
      context.fillStyle = "rgba(0,0,250, 1)";
      for (lin in maze) {
        let line = maze[lin];
        if (checkCollision(player, line)) {
          console.log("Вы проиграли, " + player.name);
          overlayLose.style.display = "block";
        }
        if (checkCollision(player, finish)) {
          let res = 59 - timer.innerHTML;
          if (res < 10) {
            res = "0" + res;
          }
          overlayWin.style.display = "block";
          winnerText.innerHTML = player.name + "!\n Ваш результат 0:" + res;
          winnerText.style.textTransform = "none";
          console.log(player.name + ", вы прошли лабиринт за 0:" + res);
         }
      } 
    } else {
      context.fillStyle = "rgba(0,0,250, 0.7)";
    }
    context.beginPath();
    context.rect(player.x, player.y, player.width, player.height); // Рисуем квадратик
    //context.arc(player.x, player.y, 10, 0, 2 * Math.PI); // Рисуем кружок
    // Позиционирование текста с никнеймом
    context.textAlign = "center";
    context.textBaseline = "bottom";
    context.font="16px Georgia";
    context.fillText(player.name, player.x + 7, player.y - 2);
    context.fill();

  }

});