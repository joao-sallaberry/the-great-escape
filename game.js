var Game = {};

Game.fps = 30;


Game.initialize = function() {
  this.entities = [];
  this.context = document.getElementById("canvas").getContext("2d");

  this.screenWidth = 800
  this.screenHeight = 600

  this.road1_x = 0
  this.road1_y = 0
  this.road2_x = 0
  this.road2_y = -this.screenHeight

  this.road = new Image()
  this.road.src = './assets/road.png'
};


Game.draw = function() {
  var rect = this.context.clearRect(0, 0, this.screenWidth, this.screenHeight);

  // var ctx = this.context
  // this.road.onload = function() {
  //   console.log('imagem carregou')
  // };
  this.context.drawImage(this.road, this.road1_x, this.road1_y)
  this.context.drawImage(this.road, this.road2_x, this.road2_y)

};


Game.update = function() {
  // moves road
  var road_speed = 5
  this.road1_y += road_speed
  if (this.road1_y >= this.screenHeight)
    this.road1_y = -this.screenHeight
  this.road2_y += road_speed
  if (this.road2_y >= this.screenHeight)
    this.road2_y = -this.screenHeight

};


