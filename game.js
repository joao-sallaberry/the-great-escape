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

  // player car
  this.player = {}
  this.player.img = new Image()
  this.player.img.src = './assets/player.png'
  this.player.W = 50
  this.player.H = 100
  this.player.x = (this.SCREEN_WIDTH - this.player.W) / 2
  this.player.y = this.SCREEN_HEIGHT - this.player.H - 50

  // car control
  this.isLeftKeyPressed = false
  this.isRightKeyPressed = false

  window.onkeydown = function(e) { setKey(e, true) }
  window.onkeyup = function(e) { setKey(e, false) }
  function setKey(e, isPressed) {
    var LEFT_KEY = 37
    var RIGHT_KEY = 39
    
    if (e.which == LEFT_KEY)
      Game.isLeftKeyPressed = isPressed
    else if (e.which == RIGHT_KEY)
      Game.isRightKeyPressed = isPressed
  }

  // obstacles
  this.obstacles = []
  this.obsTimeCounter = 0

  // explosion
  this.explosion = {}
  this.explosion.img = new Image()
  this.explosion.img.src = './assets/explosion-sprite.png'
  this.explosion.SPRITE_W = 480
  this.explosion.SPRITE_H = 288
  this.explosion.ROWS = 3
  this.explosion.COLS = 5
  this.explosion.W = this.explosion.SPRITE_W / this.explosion.COLS
  this.explosion.H = this.explosion.SPRITE_H / this.explosion.ROWS
  this.explosion.currSprite = 0
  this.explosion.currSpriteX = function() { return (this.currSprite % this.COLS) * this.W }
  this.explosion.currSpriteY = function() { return Math.floor(this.currSprite / this.COLS) * this.H }
  this.explosion.started = false
  this.explosion.timeOut = 0

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
  this.context.drawImage(this.player.img, this.player.x, this.player.y, this.player.W, this.player.H)

  // draw obstacles
  for (var i = this.obstacles.length - 1; i >= 0; i--) {
    this.context.fillRect(
      this.obstacles[i].x, this.obstacles[i].y,
      this.obstacles[i].W, this.obstacles[i].H
    )
  }

  // draw explosion
  if (this.explosion.started) {
    this.context.drawImage(
      this.explosion.img,
      this.explosion.currSpriteX(), this.explosion.currSpriteY(), this.explosion.W, this.explosion.H,
      this.player.x - 50, this.player.y - 30, 1.5 * this.explosion.W, 1.5 * this.explosion.H
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
    this.player.x -= CAR_SIDE_SPEED
  if (this.isRightKeyPressed)
    this.player.x += CAR_SIDE_SPEED

  if (this.player.x < this.LEFT_BOUNDARY)
    this.player.x = this.LEFT_BOUNDARY
  if (this.player.x > this.RIGHT_BOUNDARY - this.player.W)
    this.player.x = this.RIGHT_BOUNDARY - this.player.W

  // create obstacles
  this.obsTimeCounter++
  if (this.obsTimeCounter >= 90) {
    newObstacle()
    this.obsTimeCounter = 0
  }

  function newObstacle() {
    var h = 80, w = 30
    Game.obstacles.push({
      W: w,
      H: h,
      x: Math.floor(
          (Math.random() * (Game.RIGHT_BOUNDARY - Game.LEFT_BOUNDARY - w))
          + Game.LEFT_BOUNDARY
      ),
      y: -h
    })
  }

  // move obstacles
  for (var i = this.obstacles.length - 1; i >= 0; i--)
    this.obstacles[i].y += ROAD_SPEED
  this.obstacles = this.obstacles.filter((obs) => { 
    return obs.y < Game.SCREEN_HEIGHT
  })

  // detect collision
  function rectCollision(obs) {
    return !(obs.x > (Game.player.x + Game.player.W) || 
             (obs.x + obs.W) < Game.player.x || 
             obs.y > (Game.player.y + Game.player.H) ||
             (obs.y + obs.H) < Game.player.y
            )
  }

  if (this.explosion.started) {
    this.explosion.timeOut++
    if (this.explosion.timeOut >= this.fps / 15) {
      this.explosion.currSprite++
      if (this.explosion.currSprite == this.explosion.ROWS * this.explosion.COLS - 1)
        Game.initialize()
      this.explosion.timeOut = 0
    }
  }
  else {
    for (var i = this.obstacles.length - 1; i >= 0; i--) {
      if (rectCollision(this.obstacles[i]))
        this.explosion.started = true
    }
  }

};