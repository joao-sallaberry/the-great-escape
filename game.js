var Game = {};

Game.fps = 30;


Game.initialize = function() {
  this.entities = [];
  this.context = document.getElementById("canvas").getContext("2d");

  this.screenWidth = 800
  this.screenHeight = 600

  this.roadSection = [
    { x: 0, y: 0 },
    { x: 0, y: -this.screenHeight }
  ]

  this.road = new Image()
  this.road.src = './assets/road.png'

  // car control
  this.carW = 50
  this.carH = 90
  this.carX = (this.screenWidth - this.carW) / 2
  this.carY = this.screenHeight - this.carH - 50

  this.isLeftKeyPressed = false
  this.isRightKeyPressed = false

  function setKey(e, isPressed) {
    var LEFT_KEY = 37
    var RIGHT_KEY = 39
    
    if (e.which == LEFT_KEY)
      Game.isLeftKeyPressed = isPressed
    else if (e.which == RIGHT_KEY)
      Game.isRightKeyPressed = isPressed
  }
  window.onkeydown = function(e) { setKey(e, true) }
  window.onkeyup = function(e) { setKey(e, false) }
};


Game.draw = function() {
  var rect = this.context.clearRect(0, 0, this.screenWidth, this.screenHeight);

  // var ctx = this.context
  // this.road.onload = function() {
  //   console.log('imagem carregou')
  // };

  // draw road
  for (var i = this.roadSection.length - 1; i >= 0; i--)
    this.context.drawImage(this.road, this.roadSection[i].x, this.roadSection[i].y)

  // draw car
  this.context.fillRect(this.carX, this.carY, this.carW, this.carH)

};


Game.update = function() {
  // moves road
  var ROAD_SPEED = 5
  for (var i = this.roadSection.length - 1; i >= 0; i--) {
    this.roadSection[i].y += ROAD_SPEED
    if (this.roadSection[i].y >= this.screenHeight)
      this.roadSection[i].y = - this.screenHeight
  }

  // moves car
  var CAR_SIDE_SPEED = 5
  if (this.isLeftKeyPressed)
    this.carX -= CAR_SIDE_SPEED
  if (this.isRightKeyPressed)
    this.carX += CAR_SIDE_SPEED

};


