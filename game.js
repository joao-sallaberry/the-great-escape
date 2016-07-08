var Game = {};

Game.fps = 30;


Game.initialize = function() {
  this.entities = [];
  this.context = document.getElementById("canvas").getContext("2d");

  // score
  this.score = 0
  if (!this.highScore)
    this.highScore = 0
  this.roadSpeed = 5
  this.speedTimer = 0

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
  this.player.isSlidingTimer = 0

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

  this.obsCar = {}
  this.obsCar.img = new Image()
  this.obsCar.img.src = './assets/obs_car1.png'
  this.obsCar.W = 50
  this.obsCar.H = 100

  this.obsOil = {}
  this.obsOil.R = 30

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

  // draw road
  for (var i = this.roadSection.length - 1; i >= 0; i--)
    this.context.drawImage(this.road, this.roadSection[i].x, this.roadSection[i].y, this.SCREEN_WIDTH, this.SCREEN_HEIGHT + 30)

  // draw car
  this.context.drawImage(this.player.img, this.player.x, this.player.y, this.player.W, this.player.H)
  if (this.player.isSlidingTimer) {
    makeLine(true)
    makeLine(false)
    function makeLine(leftWheel) {
      Game.context.beginPath();
      var x = Game.player.x + (leftWheel ? 15 : (Game.player.W - 15))
      var y = Game.player.y + Game.player.H + 10
      Game.context.moveTo(x, y);
      var x2 = x + (Game.player.slideSide ? -15 : 15)
      Game.context.lineTo(x2, y + 60);
      Game.context.lineWidth = 10;
      Game.context.stroke();
    }
  }

  // draw obstacles
  for (var i = this.obstacles.length - 1; i >= 0; i--) {
    switch (this.obstacles[i].type) {
      case 'car':
        this.context.drawImage(
          this.obsCar.img,
          this.obstacles[i].x, this.obstacles[i].y,
          this.obstacles[i].W, this.obstacles[i].H
        )
        break;
      case 'oil':
        this.context.beginPath();
        this.context.arc(this.obstacles[i].x, this.obstacles[i].y, this.obstacles[i].R, 0, 2 * Math.PI, false);
        this.context.fillStyle = 'gray';
        this.context.fill();
        this.context.lineWidth = 5;
        this.context.strokeStyle = '#000000';
        this.context.stroke();
        break;
    }
  }

  // draw explosion
  if (this.explosion.started) {
    this.context.drawImage(
      this.explosion.img,
      this.explosion.currSpriteX(), this.explosion.currSpriteY(), this.explosion.W, this.explosion.H,
      this.player.x - 50, this.player.y - 30, 1.5 * this.explosion.W, 1.5 * this.explosion.H
    )
  }

  // draw score
  this.context.fillStyle = 'black';
  this.context.font = '30pt Verdana, Geneva, sans-serif';
  this.context.fillText('Score: ' + this.score, 20, 50);
  this.context.fillText('High Score: ' + this.highScore, 20, 100);
};


Game.update = function() {
  //this.roadSpeed = 5
  
  // score
  this.score += this.roadSpeed
  this.speedTimer++
  if (this.speedTimer > 300) {
    this.speedTimer = 0
    this.roadSpeed += 1
    console.log('faster!')
  }

  // moves road
  for (var i = this.roadSection.length - 1; i >= 0; i--) {
    this.roadSection[i].y += this.roadSpeed
    if (this.roadSection[i].y >= this.SCREEN_HEIGHT)
      this.roadSection[i].y = - this.SCREEN_HEIGHT
  }

  // moves player
  var PLAYER_SIDE_SPEED = 5
  
  if (this.player.isSlidingTimer) {
    this.player.isSlidingTimer--

    if (this.player.slideSide == 0)
      this.player.x -= PLAYER_SIDE_SPEED / 2
    else
      this.player.x += PLAYER_SIDE_SPEED / 2

    checkBoundaries()
  }
  else {
    if (this.isLeftKeyPressed)
      this.player.x -= PLAYER_SIDE_SPEED
    if (this.isRightKeyPressed)
      this.player.x += PLAYER_SIDE_SPEED 
    checkBoundaries()
  }

  function checkBoundaries() {
    if (Game.player.x < Game.LEFT_BOUNDARY)
      Game.player.x = Game.LEFT_BOUNDARY
    if (Game.player.x > Game.RIGHT_BOUNDARY - Game.player.W)
      Game.player.x = Game.RIGHT_BOUNDARY - Game.player.W
  }

  // create obstacles
  this.obsTimeCounter += this.roadSpeed
  if (this.obsTimeCounter >= 15 * Game.fps) {
    newObstacle()
    this.obsTimeCounter = 0
  }

  function newObstacle() {
    var type = Math.floor((Math.random() * 2))

    if (type == 0)
      Game.obstacles.push(newCarObstacle())
    else if (type = 1)
      Game.obstacles.push(newOilObstacle())
    else
      console.error('unknown obstacle type')
  }

  function newCarObstacle() {
    return {
      type: 'car',
      W: Game.obsCar.W,
      H: Game.obsCar.H,
      x: Math.floor(
          (Math.random() * (Game.RIGHT_BOUNDARY - Game.LEFT_BOUNDARY - Game.obsCar.W))
          + Game.LEFT_BOUNDARY
      ),
      y: -Game.obsCar.H
    }
  }

  function newOilObstacle() {
    return {
      type: 'oil',
      R: Game.obsOil.R,
      x: Math.floor(
          (Math.random() * (Game.RIGHT_BOUNDARY - Game.LEFT_BOUNDARY - Game.obsOil.R))
          + Game.LEFT_BOUNDARY
      ),
      y: -Game.obsOil.R
    }
  }

  // move obstacles
  for (var i = this.obstacles.length - 1; i >= 0; i--) {
    switch (this.obstacles[i].type) {
      case 'car':
        this.obstacles[i].y += this.roadSpeed / 2
        break;
      default:
        this.obstacles[i].y += this.roadSpeed
    }
  }

  this.obstacles = this.obstacles.filter((obs) => { 
    return obs.y < Game.SCREEN_HEIGHT
  })

  // detect collision
  function collided(obs) {
    switch (obs.type) {
      case 'car':
        return rectCollision(obs)
        break;
      default:
        return circleCollision(obs)
    }
  }
  function rectCollision(obs) {
    return !(obs.x > (Game.player.x + Game.player.W) || 
             (obs.x + obs.W) < Game.player.x || 
             obs.y > (Game.player.y + Game.player.H) ||
             (obs.y + obs.H) < Game.player.y
            )
  }
  // http://stackoverflow.com/questions/20885297/collision-detection-in-html5-canvas
  function circleCollision(obs) {
    var distX = Math.abs(obs.x - Game.player.x-Game.player.W/2)
    var distY = Math.abs(obs.y - Game.player.y-Game.player.H/2)

    if (distX > (Game.player.W/2 + obs.R)) { return false }
    if (distY > (Game.player.H/2 + obs.R)) { return false }

    if (distX <= (Game.player.W/2)) { return true } 
    if (distY <= (Game.player.H/2)) { return true }

    var dx=distX-Game.player.W/2
    var dy=distY-Game.player.H/2
    return (dx*dx+dy*dy<=(obs.R*obs.R))
  }

  if (!this.explosion.started) {
    for (var i = this.obstacles.length - 1; i >= 0; i--) {
      switch (this.obstacles[i].type) {
        case 'car':
          if(rectCollision(this.obstacles[i]))
            this.explosion.started = true
          break;
        case 'oil':
          if (!this.player.isSlidingTimer && circleCollision(this.obstacles[i]))
            this.player.isSlidingTimer = 50
            this.player.slideSide = Math.floor((Math.random() * 2))
          break;
      }
    }
  }
  else { // game over
    if (this.explosion.timeOut++ >= this.fps / 15) {
      this.explosion.timeOut = 0
      if (this.explosion.currSprite++ == this.explosion.ROWS * this.explosion.COLS - 1) {
        if (this.score > this.highScore)
          this.highScore = this.score
        Game.initialize()
      }
    }
  }
  

};