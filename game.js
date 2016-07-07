var Game = {};

Game.fps = 30;


Game.initialize = function() {
  this.entities = [];
  this.context = document.getElementById("canvas").getContext("2d");

  this.SCREEN_WIDTH = 800
  this.SCREEN_HEIGHT = 600

  // road boundaries
  this.LEFT_BOUNDARY = 200
  this.RIGHT_BOUNDARY = this.SCREEN_WIDTH - this.LEFT_BOUNDARY

  this.roadSection = [
    { x: 0, y: 0 },
    { x: 0, y: -this.SCREEN_HEIGHT }
  ]

  this.road = new Image()
  this.road.src = './assets/road.png'

  // car control
  this.carW = 50
  this.carH = 90
  this.carX = (this.SCREEN_WIDTH - this.carW) / 2
  this.carY = this.SCREEN_HEIGHT - this.carH - 50

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

  // obstacles
  this.obstacles = []
  this.obsCnt = 0
};


Game.draw = function() {
  var rect = this.context.clearRect(0, 0, this.SCREEN_WIDTH, this.SCREEN_HEIGHT);

  // var ctx = this.context
  // this.road.onload = function() {
  //   console.log('imagem carregou')
  // };

  // draw road
  for (var i = this.roadSection.length - 1; i >= 0; i--)
    this.context.drawImage(this.road, this.roadSection[i].x, this.roadSection[i].y)

  // draw car
  this.context.fillRect(this.carX, this.carY, this.carW, this.carH)

  // draw obstacles
  for (var i = this.obstacles.length - 1; i >= 0; i--) {
    this.context.fillRect(
      this.obstacles[i].x, this.obstacles[i].y,
      this.obstacles[i].width, this.obstacles[i].height
    )
  }

};


Game.update = function() {
  // moves road
  var ROAD_SPEED = 5
  for (var i = this.roadSection.length - 1; i >= 0; i--) {
    this.roadSection[i].y += ROAD_SPEED
    if (this.roadSection[i].y >= this.SCREEN_HEIGHT)
      this.roadSection[i].y = - this.SCREEN_HEIGHT
  }

  // moves car
  var CAR_SIDE_SPEED = 5
  
  if (this.isLeftKeyPressed)
    this.carX -= CAR_SIDE_SPEED
  if (this.isRightKeyPressed)
    this.carX += CAR_SIDE_SPEED

  if (this.carX < this.LEFT_BOUNDARY)
    this.carX = this.LEFT_BOUNDARY
  if (this.carX > this.RIGHT_BOUNDARY)
    this.carX = this.RIGHT_BOUNDARY

  // obstacles
  function newObstacle() {
    var h = 80
    Game.obstacles.push({
      width: 30,
      height: h,
      x: Math.floor(
          (Math.random() * (Game.RIGHT_BOUNDARY - Game.LEFT_BOUNDARY))
          + Game.LEFT_BOUNDARY
      ),
      y: -h
    })
  }

  this.obsCnt++
  if (this.obsCnt >= 90) {
    newObstacle()
    this.obsCnt = 0
  }

  for (var i = this.obstacles.length - 1; i >= 0; i--)
    this.obstacles[i].y += ROAD_SPEED
  this.obstacles = this.obstacles.filter((obs) => { 
    return obs.y < Game.SCREEN_HEIGHT
  })
};