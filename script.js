var touchingGround;
var touchingRoof;
var touchingSlope;
var slopeSteepness;
var ground = [];
var particles = [];
var background = [];
var foreground = [];
var objects = [];
var players = [];
var alive = false;
var doubleJump = false;
var keyHold = false;
var teleportAllowed = false;
var portalCooldown = 0;
var platformAllowed = false;
var level = 1;
var activeButtons;
var activeTags = [];
var timeFlow = 1;
var timeSlowFogAlpha = 0;
var editing = false;
var deleting = false;
var selectedObject = null;
var hitboxX = -1000
var hitboxY = -1000
var hitboxWidth = 0
var hitboxHeight = 0
var fade = new component(1000, 500, 'white', 0, 0, 1, 'rect')
var fading = false

function arrayRemove(array, item) {
  var index = array.indexOf(item);
  if (index !== -1) array.splice(index, 1);
}

function countInArray(array, what) {
  var count = 0;
  for (var i = 0; i < array.length; i++) {
    if (array[i] === what) {
      count++;
    }
  }
  return count;
}



function grow(){
  players[0].width += 1
  players[0].height += 1
}

function teleportTest(event) {
  if (teleportAllowed == true){
    players[0].x = event.clientX;
    players[0].y = event.clientY;
  }
}

function checkForMouseSelect(event){
  var mouseX = event.clientX - 8;
  var mouseY = event.clientY - 8;
  var mouse = {
    width: 1,
    height: 1,
    x: mouseX,
    y: mouseY,
    positionShift: 0
  }

  if(editing){
    for(var i = 0; i < objects.length; i++){
      if(crash(mouse, objects[i]) || crash(objects[i], mouse)){
        setSelectedObject(i)
        break;
      }
    }
  }
}

var myGameArea = {
  canvas : document.getElementById("canvas"),
  start : function() {
    myGameBG.start()
    myGameFG.start()
    myGameFG.clear()
    myGameGUI.start()
    this.canvas.width = 1000;
    this.canvas.height = 500;
    this.frameNo = 0
    this.context = this.canvas.getContext("2d");
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    this.interval = setInterval(updateGameArea,20)
    window.addEventListener('keydown', function (e) {
      myGameArea.keys = (myGameArea.keys || []);
      myGameArea.keys[e.keyCode] = true;
    })
    window.addEventListener('keyup', function (e) {
      myGameArea.keys[e.keyCode] = false;
    })
  },
  clear : function() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },
}

var myGameBG = {
  canvas : document.getElementById("background"),
  start : function() {
    this.canvas.width = 1000;
    this.canvas.height = 500;
    this.canvas.style.filter = 'blur(0px);'
    this.context = this.canvas.getContext("2d");
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
  },
  clear : function() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },
}

var myGameFG = {
  canvas : document.getElementById("foreground"),
  start : function() {
    this.canvas.width = 1000;
    this.canvas.height = 500;
    this.context = this.canvas.getContext("2d");
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
  },
  clear : function() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },
}
var myGameGUI = {
  canvas : document.getElementById("GUI"),
  start : function() {
    this.canvas.width = 1000;
    this.canvas.height = 500;
    this.context = this.canvas.getContext("2d");
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
  },
  clear : function() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },
}

function fadeToWhite() {
  fading = true
}

function fadeToClear() {
  fading = false
}

function sin(x) {
  return Math.sin(x / 180 * Math.PI);
}

function cos(x) {
  return Math.cos(x / 180 * Math.PI);
}

function tan(x) {
  return Math.tan(x / 180 * Math.PI);
}

function getVectorLength(x, y, width, height){
  var center = {
    x: x + width / 2,
    y: y + height / 2
  };
  //console.log('center: ',center);
  var vector = {
    x: (x - center.x),
    y: (y - center.y)
  };
  return Math.sqrt(vector.x*vector.x+vector.y*vector.y);
}

function getRotatedTopLeftCornerOfRect(x, y, width, height, angle) {
  var center = {
    x: x + width / 2,
    y: y + height / 2
  };
  //console.log('center: ',center);
  var vector = {
    x: (x - center.x),
    y: (y - center.y)
  };
  //console.log('vector: ',vector);
  var rotationMatrix = [[cos(angle), -sin(angle)],[sin(angle), cos(angle)]];
  //console.log('rotationMatrix: ',rotationMatrix);
  var rotatedVector = {
    x: vector.x * rotationMatrix[0][0] + vector.y * rotationMatrix[0][1],
    y: vector.x * rotationMatrix[1][0] + vector.y * rotationMatrix[1][1]
  };
  //console.log('rotatedVector: ',rotatedVector);
  return {
    x: (center.x + rotatedVector.x),
    y: (center.y + rotatedVector.y)
  };
}


function pointInPoly(verties, testx, testy) {
  var i,j,c = 0
  nvert = verties.length;
  for (i = 0, j = nvert - 1; i < nvert; j = i++) {
    if (((verties[i].y > testy) != (verties[j].y > testy)) && (testx < (verties[j].x - verties[i].x) * (testy - verties[i].y) / (verties[j].y - verties[i].y) + verties[i].x))
      c = !c;
  }

  return c;
}

function Rectangle(x, y, width, height, angle) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.rotation = angle;
  setCorners(this, this.rotation);
}

function testCollision(rect, rect2) {
  var collision = false;
  getCorners(rect).forEach(function (corner) {
    var isCollided = pointInPoly(getCorners(rect2), corner.x, corner.y);
    if (isCollided) collision = true;
  });
  return collision;
}

function testCollisionAdvanced(rect, rect2) {
  var collisionMap = []
  getCorners(rect).forEach(function (corner) {
    collisionMap.push(pointInPoly(getCorners(rect2), corner.x, corner.y));
  });
  return collisionMap;
}

function checkRectangleCollision(rect, rect2) {
  if (testCollision(rect, rect2)) return true;
  else if (testCollision(rect2, rect)) return true;
  return false;
}

function getAngleForNextCorner(anc,vectorLength) {
  var alpha = Math.acos(anc/vectorLength)*(180 / Math.PI);
  return 180 - alpha*2;
}

function setCorners(rect, angle) {
  // rect.originalPos = getOffset(rect.htmlElement);
  rect.originalPos = {
    top: rect.y,
    left: rect.x
  };
  rect.leftTopCorner = getRotatedTopLeftCornerOfRect(rect.originalPos.left, rect.originalPos.top, rect.width, rect.height, angle);

  var vecLength = getVectorLength(rect.originalPos.left, rect.originalPos.top, rect.width, rect.height);
  //console.log('vecLength: ',vecLength);

  angle = angle+getAngleForNextCorner(rect.width/2, vecLength);
  //console.log('angle: ',angle);
  rect.rightTopCorner = getRotatedTopLeftCornerOfRect(rect.originalPos.left, rect.originalPos.top, rect.width, rect.height, angle);

  angle = angle+getAngleForNextCorner(rect.height/2, vecLength);
  //console.log('angle: ',angle);
  rect.rightBottomCorner = getRotatedTopLeftCornerOfRect(rect.originalPos.left, rect.originalPos.top, rect.width, rect.height, angle);

  angle = angle+getAngleForNextCorner(rect.width/2, vecLength);
  //console.log('angle: ',angle);
  rect.leftBottomCorner = getRotatedTopLeftCornerOfRect(rect.originalPos.left, rect.originalPos.top, rect.width, rect.height, angle);

  //console.log(this);
};

function getCorners(rect) {
  return [rect.leftTopCorner,
    rect.rightTopCorner,
    rect.rightBottomCorner,
    rect.leftBottomCorner];
};

function angledCrash(rect1, rect2) {
  return checkRectangleCollision(rect1, rect2);
};

function directionalAngledCrash(rect1, rect2) {
  var collisionMap = testCollisionAdvanced(rect1, rect2);
  // if(collisionMap[0] && collisionMap[1]){
  //   return 2;
  // }else if(collisionMap[1] && collisionMap[2]){
  //   return 4;
  // }
  // else if(collisionMap[2] && collisionMap[3]){
  //   return 6;
  // }else if(collisionMap[3] && collisionMap[0]){
  //   return 8;
  // }
  if(collisionMap[2]){
    return 5;
  }else if(collisionMap[3]){
    return 7;
  }else if(collisionMap[0]){
    return 1;
  }else if(collisionMap[1]){
    return 3;
  }else{
    return 0;
  }
};

function crash(firstObj, secondObj) {
  var mytop = firstObj.y;
  var mybottom = firstObj.y + (firstObj.height);
  var othertop = secondObj.y;
  var otherbottom = secondObj.y + (secondObj.height);
  var myleft = firstObj.x + firstObj.positionShift;
  var myright = firstObj.x + firstObj.positionShift + (firstObj.width);
  var otherleft = secondObj.x + secondObj.positionShift;
  var otherright = secondObj.x + secondObj.positionShift + (secondObj.width);

  if (
  
  ((mytop <= otherbottom) && (mybottom >= otherbottom) && (myright > otherleft) && (myleft < otherright))
  ||
  ((mybottom >= othertop) && !(mytop >= othertop) && (myright > otherleft) && (myleft < otherright))
  ||
  ((myleft <= otherright) && (myright >= otherright) && (mytop < otherbottom) && (mybottom > othertop))
  ||
  ((myright >= otherleft) && !(myleft >= otherleft) && (mytop < otherbottom) && (mybottom > othertop))
  
  ) {
    return true;
  }else{
    return false;
  }
  
}

function crashTop(firstObj, secondObj) {
  var mytop = firstObj.y;
  var mybottom = firstObj.y + (firstObj.height);
  var othertop = secondObj.y;
  var otherbottom = secondObj.y + (secondObj.height);
  var myleft = firstObj.x + firstObj.positionShift;
  var myright = firstObj.x + firstObj.positionShift + (firstObj.width);
  var otherleft = secondObj.x + secondObj.positionShift;
  var otherright = secondObj.x + secondObj.positionShift + (secondObj.width);

  if ((mytop <= otherbottom) && (mybottom >= otherbottom) && (myright > otherleft) && (myleft < otherright)) {
    return true;
  }else{
    return false;
  }
  
}
function crashBottom(firstObj, secondObj) {
  var mytop = firstObj.y;
  var mybottom = firstObj.y + (firstObj.height);
  var othertop = secondObj.y;
  var otherbottom = secondObj.y + (secondObj.height);
  var myleft = firstObj.x + firstObj.positionShift;
  var myright = firstObj.x + firstObj.positionShift + (firstObj.width);
  if(firstObj.type == 'box'){
    var myleft = firstObj.x + 1;
    var myright = firstObj.x + (firstObj.width) - 1;
  }
  var otherleft = secondObj.x + secondObj.positionShift;
  var otherright = secondObj.x + secondObj.positionShift + (secondObj.width);


  if ((mybottom >= othertop) && !(mytop >= othertop) && (myright > otherleft) && (myleft < otherright)) {
    return true;
  }else{
    return false;
  }
}
function crashLeft(firstObj, secondObj, data) {
  var mytop = firstObj.y;
  var mybottom = firstObj.y + (firstObj.height);
  var othertop = secondObj.y;
  var otherbottom = secondObj.y + (secondObj.height);
  var myleft = firstObj.x + firstObj.positionShift;
  var myright = firstObj.x + firstObj.positionShift + (firstObj.width);
  var otherleft = secondObj.x + secondObj.positionShift;
  var otherright = secondObj.x + secondObj.positionShift + (secondObj.width);
  
  if(data == 'margin'){
    if ((myleft <= otherright) && (myright >= otherright) && (mytop < otherbottom) && (mybottom > othertop)) {
      return otherright - myleft;
    }else{
      return -1;
    }
  }else{
    if ((myleft <= otherright) && (myright >= otherright) && (mytop < otherbottom) && (mybottom > othertop)) {
      return true;
    }else{
      return false;
    }
  }
  
    
}
function crashRight(firstObj, secondObj) {
  var mytop = firstObj.y;
  var mybottom = firstObj.y + (firstObj.height);
  var othertop = secondObj.y;
  var otherbottom = secondObj.y + (secondObj.height);
  var myleft = firstObj.x + firstObj.positionShift;
  var myright = firstObj.x + firstObj.positionShift + (firstObj.width);
  var otherleft = secondObj.x + secondObj.positionShift;
  var otherright = secondObj.x + secondObj.positionShift + (secondObj.width);
  
  if ((myright >= otherleft) && !(myleft >= otherleft) && (mytop < otherbottom) && (mybottom > othertop)) {
    return true;
  }else{
    return false;
  }
    
}

function objectInArray(obj, list) {
  var i;
  for (i = 0; i < list.length; i++) {
    if (list[i] == obj) {
      return true;
    }
  }

  return false;
}

function component(width, height, color, x, y, lifetime, type) {

  this.layer = 'myGameArea'
  this.width = width;
  this.height = height;
  this.momentumY = 0;
  this.momentumX = 0;
  this.speedY = 0;
  this.speedX = 0;
  this.type = type;
  this.rotation = 0;
  if (this.type == 'particle'){
    this.speedX_save = (Math.random() - 0.5)*0.5
    this.speedX = this.speedX_save
    this.speedY = 2
    this.momentumY = -3
  }
  if (this.type == 'particle4'){
    this.speedX = 0
    this.speedY = 0
    this.momentumY = 6
  }
  if (this.type == 'particle5'){
    this.speedX = (Math.random() - 0.5)*2
    this.speedY = 0
  }
  if (this.type == 'particle6'){
    this.speedX = 0
    this.speedY = 0
    this.momentumY = (Math.random()-0.5)*2
  }
  if (this.type == 'particle7'){
    this.speedX_save = (Math.random() - 0.5)*1
    this.speedX = this.speedX_save
    this.speedY = 2
    this.momentumY = (Math.random() * -1.5) - 0.5
  }
  if (this.type == 'particle8'){
    x = Math.random() * 1000
    y = Math.random() * 400
    lifetime = Math.random()
  }
  if(this.type == 'particle9'){
    x += (Math.random() - 0.5) * 15
    y += (Math.random() - 0.5) * 15
  }
  if (this.type == 'particle2' || this.type == 'particle3'){
    this.speedY = 0
    this.speedX = 0
  }
  if (this.type == 'platform'){
    this.speedY = 0
    this.speedX = 0
    this.motion = 1
  }
  if(this.type == 'button'){
    this.pushed = false
  }
  if(this.type == 'holdButton'){
    this.pushed = false
    this.letUp = 0
  }
  if(this.type == 'stickyButton'){
    this.pushed = false
    this.letUp = 0
  }
  if(this.type == 'rotatePlatform'){
    this.rotation = lifetime
  }
  this.speedY += this.momentumY
  this.x += this.speedX;
  this.y += this.speedY;
  this.x = x;
  this.y = y;
  this.saveX = this.x;
  this.saveY = this.y;   
  if(this.type != 'particle' && this.type != 'particle2' && this.type != 'particle7'){
    this.positionShift = 0;
    this.skew = 0;
  }
  this.lifetime = lifetime;
  this.color = color;

  if(this.type == 'mountains'){
    while(this.x < 1000){
      this.y = (Math.random() * 200) + 250
      var mountainFillColor = (Math.random() * 20) + 30
      background.push(new component(400, 400, 'rgb('+mountainFillColor+','+mountainFillColor+','+mountainFillColor * 1.5+')', this.x, this.y, 45, 'rotatePlatform'))
      this.x += Math.random() * 150
    }
    while(this.x > -300){
      this.y = (Math.random() * 200) + 300
      var mountainFillColor = (Math.random() * 20) + 30
      background.push(new component(400, 400, 'rgb('+mountainFillColor+','+mountainFillColor+','+mountainFillColor * 1.5+')', this.x, this.y, 45, 'rotatePlatform'))
      this.x += Math.random() * -120
    }
    while(this.x < 1000){
      this.y = (Math.random() * 200) + 350
      var mountainFillColor = (Math.random() * 20) + 30
      background.push(new component(400, 400, 'rgb('+mountainFillColor+','+mountainFillColor+','+mountainFillColor * 1.5+')', this.x, this.y, 45, 'rotatePlatform'))
      this.x += Math.random() * 150
    }
  }

  if(this.type == 'clouds'){
    while(this.x < 1000){
      this.y = (Math.random() * 150)
      background.push(new component(60 + Math.random() * 50, 30 + Math.random() * 40, 'rgb(255, 255, 255)', this.x, this.y, ((Math.random() * 0.5) + (Math.random() * 0.5)), 'cloud'))
      this.x += Math.random() * 30
    }
  }

  if(this.type == 'ground' && editing == false){
    foreground.push(new component(this.width, 4, 'darkgreen', this.x, this.y, 'foreground', 'rect'))
    var parseX = this.x
    while(parseX < this.x + this.width - 3){
      foreground.push(new component(3, (Math.random() * 5) + 3, 'darkgreen', parseX, this.y, 'foreground', 'rect'))
      parseX += Math.random() * 3
      foreground = []
    }
    parseX = this.x
    while(parseX < this.x + this.width - 4){
      foreground.push(new component(4, (Math.random() * 3), this.color, parseX, this.y + this.height - 1, 'foreground', 'rect'))
      parseX += Math.floor(Math.random() * 4)
      foreground = []
    }
  }

  if(this.lifetime == 'foreground'){
    ctx = myGameFG.context;
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  if(this.type == 'spawnpoint'){
    players[0].x = this.x + this.width/2 - players[0].width/2;
    players[0].y = this.y + this.height - players[0].height;
    players[0].width = 18
    players[0].height = 18
    alive = true
  }

  if(this.type == 'rect' || this.type == 'box' || this.type == 'easterEgg' || this.type == 'easterCube' || this.type == 'ground' || this.type == 'enemy' || this.type == 'cloud' || this.type == 'fallingPlatform'){
    this.update = function(){
      // if(this.type = 'enemy'){
      //   particles.push(new component(2, 2, 'red', this.x + this.width/2, this.y + this.height / 2, 50, 'particle8'))
      // }
      ctx = eval(this.layer + '.context');
      ctx.save()

      ctx.translate( Math.floor(this.x+this.width/2), Math.floor(this.y+this.height/2 ));
      ctx.rotate(this.rotation * Math.PI / 180);
      ctx.globalAlpha = 1

      
      
      if(this.lifetime <= 0){
        arrayRemove(objects, this)
      }
      if(this.type == 'cloud'){
        ctx.globalAlpha = this.lifetime
      }
      ctx.fillStyle = this.color;
      ctx.fillRect((this.width/2)*-1, (this.height/2)*-1 + this.skew, this.width, this.height);

      // if(players.includes(this)){
      //   ctx.fillStyle = 'black'
      //   ctx.fillRect(((this.width/2)*-1) + 3, ((this.height/2)*-1 + this.skew) + 2, 4, 8);
      //   ctx.fillRect(((this.width/2)*-1) + this.width - 6, ((this.height/2)*-1 + this.skew) + 2, 4, 8);
      //   ctx.fillStyle = 'white'
      //   if(this.momentumX > 0){
      //     ctx.fillRect(((this.width/2)*-1) + 5, ((this.height/2)*-1 + this.skew) + 6, 2, 4);
      //     ctx.fillRect(((this.width/2)*-1) + this.width - 4, ((this.height/2)*-1 + this.skew) + 6, 2, 4);
      //   }else if(this.momentumX < 0){
      //     ctx.fillRect(((this.width/2)*-1) + 3, ((this.height/2)*-1 + this.skew) + 6, 2, 4);
      //     ctx.fillRect(((this.width/2)*-1) + this.width - 6, ((this.height/2)*-1 + this.skew) + 6, 2, 4);
      //   }else{
      //     ctx.fillRect(((this.width/2)*-1) + 5, ((this.height/2)*-1 + this.skew) + 6, 2, 4);
      //     ctx.fillRect(((this.width/2)*-1) + this.width - 6, ((this.height/2)*-1 + this.skew) + 6, 2, 4);
      //   }
      // }
      
      ctx.restore()
      if(this.type != 'cloud' && this.type != 'fallingPlatform'){this.lifetime -= 1 * timeFlow;}

      if(this.type == 'box' && this.y > 550){
        this.y = this.saveY
        this.x = this.saveX
      }
      if(this.type == 'box' || this.type == 'enemy'){
        if(editing){
          this.x = this.saveX
          this.y = this.saveY
        }
      }
      if(this.type == 'cloud'){
        this.x -= this.lifetime * 0.6
        if(this.x < -100){
          this.x += 1100
        }
      }
      
    }

  }else if(this.type == 'rotatePlatform'){
    this.update = function(){
      ctx = eval(this.layer + '.context');
      ctx.save()
      if(this.rotation > 90){
        this.rotation -= 180
      }
      if(this.rotation < -90){
        this.rotation += 180
      }

      ctx.translate( this.x+this.width/2, this.y+this.height/2 );
      ctx.rotate(this.rotation * Math.PI / 180);
      ctx.globalAlpha = 1
      
      ctx.fillStyle = this.color;
      ctx.fillRect((this.width/2)*-1, (this.height/2)*-1, this.width, this.height);
      ctx.restore()

      if(this.type == 'box' && this.y > 550){
        this.y = this.saveY
        this.x = this.saveX
      }
      
    }

  }else if(this.type == 'fountain'){
    this.update = function(){
      if(Math.random() + timeFlow >= 1){
        particles.push(new component(2, 2, this.color, this.x + this.width/2, this.y + this.height, 75, 'particle'))
      }
    }

  }else if(this.type == 'rain'){
    this.update = function(){
      ctx = myGameArea.context
      if(Math.random() + timeFlow >= 1){  
        particles.push(new component(2, 5, this.color, this.x + Math.random()*this.width, this.y, 150, 'particle4'))
      }
      ctx.globalAlpha = 0.8
      ctx.globalCompositeOperation = "destination-over"
      ctx.fillStyle = this.lifetime;
      ctx.fillRect(this.x, this.y, this.width, this.height);
      ctx.globalCompositeOperation = "source-over"
      ctx.globalAlpha = 1
    }

  }else if(this.type == 'night'){
    this.update = function(){
      // ctx.globalCompositeOperation = "destination-over";
      ctx.fillStyle = this.color;
      ctx.globalAlpha = 1
      ctx.fillRect(this.x, this.y, this.width, this.height);
      // ctx.globalCompositeOperation = "source-over";
    }

  }
  else if(this.type == 'portal'){
    this.update = function(){ 
      for (var i = 0; i < 8; i++){
        if(Math.random() + timeFlow >= 1){ 
          if(this.height >= this.width){  
            particles.push(new component(2, 2, this.color, this.x + Math.random() * this.width, this.y + Math.random()*this.height, 8, 'particle5'))
          }else{
            particles.push(new component(2, 2, this.color, this.x + Math.random()*this.width, this.y, 8, 'particle6'))
          }
        }
      }
      
      ctx.globalAlpha = 0.9
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }

  }else if(this.type == 'spawnpoint'){
    this.update = function(){  
      var blueGotten = false;
      for(var i = 0; i < players.length; i++){
        if(players[i].color == 'blue'){
          blueGotten = true;
        }
      }

      if(blueGotten == true){
        if(Math.random() + timeFlow >= 1){  
          particles.push(new component(2, 2, 'yellow', this.x + Math.floor((Math.random())*30), this.y + this.height, 150, 'particle2'))
        }
        
        for(var i = 0; i < 3; i++){
          if(Math.random() + timeFlow >= 1.2){
            particles.push(new component(4, 4, 'lightgoldenrod', this.x + Math.floor((Math.random() - 0.1)*34), this.y + this.height, 75, 'particle2'))
          }
        }
        for(var i = 0; i < 2; i++){
          if(Math.random() + timeFlow >= 1.2){
            particles.push(new component(3, 3, 'gold', this.x + Math.floor((Math.random() - 0.1)*34), this.y + this.height, 100, 'particle2'))
          }
        }
      }else{
        if(Math.random() + timeFlow >= 1){  
          particles.push(new component(2, 2, 'yellow', this.x + Math.floor((Math.random())*30), this.y + this.height, 150, 'particle2'))
        }
      }
      if(alive == false && editing == false){
        if(level == 'edit'){
          var currentData = ''
          for(var i = 0; i < objects.length; i++){
            currentData += 'objects.push(new component('+objects[i].width+','+objects[i].height+',\''+objects[i].color+'\','+objects[i].x+','+objects[i].y+','
            
            if(objects[i].type == 'text' || objects[i].type == 'loadZone'){
              currentData += '\''+objects[i].lifetime+'\','
            }else{
              currentData += objects[i].lifetime+','
            }
            
            currentData += '\''+objects[i].type+'\'));\n'
          }
          objects = []
          eval(currentData)
        }else{
          if(players[0].y < 500){  
            for(var q = 0; q < 30; q++){
              particles.push(new component(2, 2, players[0].color, players[0].x, players[0].y, 75, 'particle7'))
            }
            players[0].y = 550
          }

          if(fade.lifetime >= 1.4){
            for (var k = 0; k < players.length; k++){
              loadLevel(level)
              fadeToClear()
              doubleJump = false
              players[0].color = 'red'
            }
          }else{
            fadeToWhite()
          }
        }
      }
    }
  }else if(this.type == "fog"){
    this.update = function(){
      ctx = myGameArea.context;
      var grd = ctx.createRadialGradient(500, 250, 600 - this.lifetime * 2, 500, 250, 1600);
      grd.addColorStop(0, "transparent");
      grd.addColorStop(1, this.color);

      // arrayRemove(particles, this)

      ctx.fillStyle = grd;
      ctx.fillRect(-100, -50, 1200, 600);
    }
  }else if(this.type == 'particle' || this.type == 'particle7'){
    this.update = function(){
      ctx = myGameArea.context;
      ctx.globalAlpha = 1
      if (this.lifetime != Infinity){
        ctx.globalAlpha = this.lifetime/50;
      }else{
        ctx.globalAlpha = 1
      }
      if(this.lifetime <= 0){
        arrayRemove(particles, this)
      }
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x, this.y, this.width, this.height);
      this.speedX = this.speedX_save * timeFlow
      this.lifetime -= 1 * timeFlow;
      if(this.momentumY <= 2)
      this.momentumY += 0.1 * timeFlow;
    }
    
  }else if(this.type == 'particle2'){
    this.update = function(){
      ctx = myGameArea.context;
      ctx.globalAlpha = 1
      if (this.lifetime != Infinity){
        if(this.lifetime >= 1){  
          ctx.globalAlpha = this.lifetime/50;
        }else{
          ctx.globalAlpha = 0
        }

      }else{
        ctx.globalAlpha = 1
      }
      if(this.lifetime <= 0){
        arrayRemove(particles, this)
      }
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x, this.y, this.width, this.height);
      this.lifetime -= 3 * timeFlow;
      if(this.momentumY >= -2)
      this.momentumY -= 0.1 * timeFlow;
    }
    
  }else if(this.type == 'particle9'){
    this.update = function(){
      ctx = myGameArea.context;
      ctx.save()
      ctx.globalCompositeOperation = "destination-over";
      this.rotation += (Math.random() - 0.5) * 4
      this.x += (Math.random() - 0.5) * 2
      this.y += (Math.random() - 0.5) * 2
      ctx.translate( Math.floor(this.x+this.width/2), Math.floor(this.y+this.height/2 ));
      ctx.rotate(this.rotation * Math.PI / 180);
      ctx.globalAlpha = 1

      if (this.lifetime != Infinity){
        if(this.lifetime >= 1){  
          ctx.globalAlpha = this.lifetime/25;
        }else{
          ctx.globalAlpha = 0
        }

      }else{
        ctx.globalAlpha = 1
      }
      
      if(this.lifetime <= 0){
        arrayRemove(particles, this)
      }

      ctx.fillStyle = this.color;
      ctx.fillRect((this.width/2)*-1, (this.height/2)*-1 + this.skew, this.width, this.height);
      ctx.restore()
      this.lifetime -= 2 * timeFlow;
    }
    
  }else if(this.type == 'particle3'){
    this.update = function(){
      ctx = myGameArea.context;
      ctx.globalAlpha = 1
      if (this.lifetime != Infinity){
        ctx.globalAlpha = this.lifetime/75;
      }else{
        ctx.globalAlpha = 1
      }
      if(this.lifetime <= 0){
        arrayRemove(particles, this)
      }
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x, this.y, this.width * this.lifetime/75, this.height * this.lifetime/75);
      this.lifetime -= 3 * timeFlow;
    }
    
  }else if(this.type == 'particle4'){
    this.update = function(){
      ctx = myGameArea.context;
      ctx.globalAlpha = 1
      if (this.lifetime != Infinity){
        ctx.globalAlpha = this.lifetime/50;
      }else{
        ctx.globalAlpha = 1
      }
      if(this.lifetime <= 0){
        arrayRemove(particles, this)
      }
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x, this.y, this.width, this.height);
      this.lifetime -= 1 * timeFlow;
    }
    
  }else if(this.type == 'particle5' || this.type == 'particle6'){
    this.update = function(){
      ctx = myGameArea.context;
      ctx.globalAlpha = 1
      if (this.lifetime != Infinity){
        ctx.globalAlpha = this.lifetime/6;
      }else{
        ctx.globalAlpha = 1
      }
      if(this.lifetime <= 0){
        arrayRemove(particles, this)
      }
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x, this.y, this.width, this.height);
      this.lifetime -= 1 * timeFlow;
    }
    
  }else if(this.type == 'particle8'){
    this.update = function(){
      // ctx.globalCompositeOperation = "destination-over";
      ctx = myGameBG.context;
      ctx.globalAlpha = this.lifetime
      
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x, this.y, this.width, this.height);
      // ctx.globalCompositeOperation = "source-over";
    }
    
  }else if(this.type == 'button'){
    this.update = function(){
      if(this.pushed == true){
        ctx = myGameArea.context;
        ctx.fillStyle = 'white';
        ctx.fillRect(this.x, this.y + (this.height/2), this.width, this.height/2);
        ctx.fillStyle = this.color
        ctx.fillRect(this.x, this.y + (this.height/2), this.width, 2);
      }else{
        ctx = myGameArea.context;
        ctx.fillStyle = 'white';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = this.color
        ctx.fillRect(this.x, this.y, this.width, 2);
      }
    }

  }else if(this.type == 'holdButton'){
    
    this.update = function(){
      if(this.pushed == true){
        ctx = myGameArea.context;
        ctx.fillStyle = 'lightgrey';
        ctx.fillRect(this.x, this.y + (this.height/2), this.width, this.height/2);
        ctx.fillStyle = this.color
        ctx.fillRect(this.x, this.y + (this.height/2), this.width, 2);
      }else{
        ctx = myGameArea.context;
        ctx.fillStyle = 'lightgrey';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = this.color
        ctx.fillRect(this.x, this.y, this.width, 2);
      }

      // ctx = myGameArea.context;
      // ctx.fillStyle = 'gray';
      // ctx.fillRect(this.x, this.y, this.width, this.height);
      // ctx.fillStyle = this.color
      // ctx.fillRect(this.x, this.y, this.width, 2);
    }

    

  }else if(this.type == 'stickyButton'){
    
    this.update = function(){
      if(this.pushed == true){
        ctx = myGameArea.context;
        ctx.fillStyle = 'brown';
        ctx.fillRect(this.x, this.y + (this.height/2), this.width, this.height/2);
        ctx.fillStyle = this.color
        ctx.fillRect(this.x, this.y + (this.height/2), this.width, 2);
      }else{
        ctx = myGameArea.context;
        ctx.fillStyle = 'brown';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = this.color
        ctx.fillRect(this.x, this.y, this.width, 2);
      }
    }

  }else if(this.type == 'barrier'){
    this.update = function(){
      ctx = myGameArea.context;
      if (this.lifetime != Infinity){
        ctx.globalAlpha = this.lifetime/50;
      }else{
        ctx.globalAlpha = 1
      }
      if(this.lifetime <= 0 && this.x != 12000){
        this.saveX = this.x
        this.x = 12000
      }else if(this.lifetime == Infinity){
        this.x = this.saveX
      }
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x, this.y, this.width, this.height);
      this.lifetime -= 1 * timeFlow
    }

  }else if(this.type == 'antiBarrier'){
    this.update = function(){
      ctx = myGameArea.context;
      
      ctx.globalAlpha = 1

      if(this.lifetime == Infinity && this.x != 12000){
        this.saveX = this.x
        this.x = 12000
      }else if(this.lifetime == 50){
        this.x = this.saveX
      }
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x, this.y, this.width, this.height);

      if(editing){
        ctx.fillRect(this.saveX, this.saveY, this.width, this.height);
      }
    }

  }else if(this.type == 'platform'){
    this.update = function(){
      ctx = myGameArea.context;
      if (this.x + this.positionShift <= this.x){
        this.motion = 1
      }
      if (this.x + this.positionShift >= this.x + this.lifetime){
        this.motion = -1
      }

      if(editing){
        this.positionShift = 0
        this.motion = 1
      }

      this.positionShift += this.motion * timeFlow
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x + this.positionShift, this.y, this.width, this.height);
    }

  }else if(this.type == "text"){
    this.update = function(){
      ctx = myGameArea.context;
      if (lifetime != Infinity){
        ctx.globalAlpha = this.lifetime/50;
      }else{
        ctx.globalAlpha = 1
      }
      if(this.lifetime <= 0){
        arrayRemove(objects, this)
      }
      ctx.font = '20px Arial';
      ctx.fillStyle = this.color;
      ctx.textAlign = 'center';
      ctx.fillText(this.lifetime, 500, 250);
    }
  }else{
    this.update = function(){
      //This is to prevent Loading Zones and other special objects from throwing errors
    }
  }

  if(this.type == 'rect'){
    this.newPos = function() {
      if(this.color == 'purple'){
        this.speedX += this.momentumX;
        this.speedY += this.momentumY;
        this.x += this.speedX;
        this.y += this.speedY;
      }else{
        this.speedX += this.momentumX * timeFlow;
        this.speedY += this.momentumY * timeFlow;
        this.x += this.speedX;
        this.y += this.speedY;
      }
    }
  }else{
    this.newPos = function() {
      this.speedX += this.momentumX * timeFlow;
      this.speedY += this.momentumY * timeFlow;
      this.x += this.speedX;
      this.y += this.speedY;
    }
  }
}

players = []
players.push(new component(18, 18, "red", 30, 360, Infinity, 'rect'));




function updateGameArea() {
  myGameArea.clear()
  myGameGUI.clear()
  
  if(myGameArea.frameNo % 2 == 0){
    myGameBG.clear()
    for(var i = 0; i < background.length; i++){
      background[i].update()
      background[i].layer = 'myGameBG'
    }
  }
  for(var i = 0; i < objects.length; i++){
    if(objects[i].type == 'holdButton'){  
      objects[i].letUp = 0;
    }
    if(objects[i].type == 'stickyButton'){
      objects[i].letUp -= 1
    }
  }
  activeTags = []
  for (var k = 0; k < players.length; k++){ 
    players[k].speedX = 0;
    try{
      players[k].speedY = 0;
    }catch{
      // console.log(players[k])
      // myGameArea.interval = clearInterval(updateGameArea)
      break
    }
    touchingGround = false
    touchingSlope = false
    slopeSteepness = 0
    touchingRoof = false
    jumpAllowed = false
    if(players[k].rotation >= 1){
      players[k].rotation -= 1
    }
    if(players[k].rotation <= -1){
      players[k].rotation += 1
    }
    players[k].skew = 0;
    var portalCollision = []
    var portals = []
    var warping = false;
    for (i = 0; i < objects.length; i += 1) {
      if (objects[i].type == 'platform'){
        if (crashTop(players[k], objects[i])){
          players[k].momentumY = 1
          players[k].y = objects[i].y + objects[i].height + 1
        }
        if (crashBottom(players[k], objects[i])){
          touchingGround = true
          players[k].y = objects[i].y - players[k].height
          players[k].x += objects[i].motion
        }
        if (crashLeft(players[k], objects[i])){
          players[k].x = objects[i].x + objects[i].positionShift + objects[i].width
        }
        if (crashRight(players[k], objects[i])){
          players[k].x = objects[i].x + objects[i].positionShift - players[k].width
        }
      }else if (objects[i].type == 'easterCube'){
        if (crashTop(players[k], objects[i])){
          objects.pop(objects.indexOf(objects[i]))
          platformAllowed = true;
        }
        if (crashBottom(players[k], objects[i])){
          objects.pop(objects.indexOf(objects[i]))
          platformAllowed = true;
        }
        if (crashLeft(players[k], objects[i])){
          objects.pop(objects.indexOf(objects[i]))
          platformAllowed = true;
        }
        if (crashRight(players[k], objects[i])){
          objects.pop(objects.indexOf(objects[i]))
          platformAllowed = true;
        }
      }else if (objects[i].type == 'rotatePlatform'){
        setCorners(players[k], 0);
        setCorners(objects[i], objects[i].rotation);
        var crashAngle = directionalAngledCrash(players[k], objects[i])

        if(crashAngle == 5 || crashAngle == 6){
          slopeSteepness = objects[i].rotation
          touchingGround = true
          touchingSlope = true;
          players[k].rotation = objects[i].rotation
          players[k].y = ((players[k].x - (objects[i].x + objects[i].width/2)) * tan(objects[i].rotation)) + objects[i].y - players[k].height + (tan(objects[i].rotation) * players[k].height)
          players[k].momentumY = 0
          players[k].skew = -2
          // console.log(players[k].y)
        }else if(crashAngle == 7){
          slopeSteepness = objects[i].rotation
          touchingGround = true
          touchingSlope = true;
          players[k].rotation = objects[i].rotation
          players[k].y = ((players[k].x - (objects[i].x + objects[i].width/2)) * tan(objects[i].rotation)) + objects[i].y - players[k].height
          players[k].momentumY = 0
          players[k].skew = -2
          // console.log(players[k].y)
        }else if(crashAngle == 1 || crashAngle == 2){
          
          players[k].y = ((players[k].x - (objects[i].x + objects[i].width/2)) * tan(objects[i].rotation + 1.49)) + objects[i].y + players[k].height
          players[k].momentumY = 2
          players[k].momentumX = 1
          while(angledCrash(players[k], objects[i])){
            players[k].y += 1
            players[k].x += 1
            setCorners(players[k], 0);
            setCorners(objects[i], objects[i].rotation);
          }
        }else if(crashAngle == 3){
          
          players[k].y = ((players[k].x - (objects[i].x + objects[i].width/2)) * tan(objects[i].rotation + 1.49)) + objects[i].y + players[k].height + (tan(objects[i].rotation) * players[k].height) + 1
          players[k].momentumY = 2
          players[k].momentumX = -1
          while(angledCrash(players[k], objects[i])){
            players[k].y += 1
            players[k].x -= 1
            setCorners(players[k], 0);
            setCorners(objects[i], objects[i].rotation);
          }
        }
      }else if(objects[i].type == 'ground' || objects[i].type == 'barrier' || objects[i].type == 'antiBarrier' || objects[i].type == 'fallingPlatform'){
        if(objects[i].lifetime == Infinity && objects[i].type == 'fallingPlatform'){
          objects[i].y += 4 * timeFlow
          if(objects[i].y > 620){
            objects[i].lifetime = NaN
            objects[i].y = objects[i].saveY
          }
        }
        if (crashTop(players[k], objects[i])){
          touchingRoof = true
          players[k].momentumY = 1
          players[k].y = objects[i].y + objects[i].height
        }
        if (crashBottom(players[k], objects[i])){
          players[k].rotation = 0
          touchingGround = true
          players[k].y = objects[i].y - players[k].height
          if(objects[i].type == 'fallingPlatform'){
            touchingGround = false
            jumpAllowed = true
            players[k].momentumY = 4
            objects[i].lifetime = Infinity
          }
        }
        if (crashLeft(players[k], objects[i])){
          players[k].rotation = 0
          players[k].x = objects[i].x + objects[i].width
          if(players[k].momentumX <= -5.4){  
            players[k].momentumX *= -1
            players[k].momentumY -= Math.abs(players[k].momentumX)/4
          }else{
            players[k].momentumX = 0
          }
        }
        if (crashRight(players[k], objects[i])){
          players[k].rotation = 0
          players[k].x = objects[i].x - players[k].width
          if(players[k].momentumX >= 5.4){ 
            players[k].momentumX *= -1
            players[k].momentumY -= Math.abs(players[k].momentumX)/4
          }else{
            players[k].momentumX = 0
          }
        }
        
        
        
      }if(objects[i].type == 'box' && editing == false){
        

        var playerOnBox = false
        
        
        
        var boxTouchingGround = false

        // if (objects[i].crashBottom(players[k])){
        //   boxTouchingGround = true
        //   objects[i].momentumY = 0
        //   objects[i].y = players[k].y - objects[i].height
        // }
        
        

        for (var ii = 0; ii < objects.length; ii += 1) {
          


          if(objects[ii].type == 'ground' || objects[ii].type == 'platform' || objects[ii].type == 'barrier' || objects[ii].type == 'antiBarrier'){
            if (crashTop(objects[i], objects[ii])){
              objects[i].momentumY = 1
              objects[i].y = objects[ii].y + objects[ii].height + 1
            }
            if (crashBottom(objects[i], objects[ii])){
              boxTouchingGround = true
              objects[i].momentumY = 0
              objects[i].y = objects[ii].y - objects[i].height
            }
            
            if (crashLeft(objects[i], objects[ii])){
              objects[i].x = objects[ii].x + objects[ii].width
            }
            if (crashRight(objects[i], objects[ii])){
              objects[i].x = objects[ii].x - objects[ii].width
            }
          }
          if (crashBottom(objects[i], objects[ii]) && objects[ii].type == 'holdButton' && objects[i].type == 'box'){
          objects[ii].pushed = true
          objects[ii].letUp = 1 
          }
          if (crashBottom(players[k], objects[ii]) && objects[ii].type == 'holdButton'){
            objects[ii].pushed = true
            objects[ii].letUp = 1 
          }

          if (crashBottom(objects[i], objects[ii]) && objects[ii].type == 'stickyButton' && objects[i].type == 'box'){
            objects[ii].pushed = true
            objects[ii].letUp = 150
          }
          if (crashBottom(players[k], objects[ii]) && objects[ii].type == 'stickyButton'){
            objects[ii].pushed = true
            objects[ii].letUp = objects[ii].lifetime
          }

          if (crashBottom(objects[i], objects[ii]) && objects[ii].type == 'button'){
            objects[ii].pushed = true
          }else if (crashBottom(players[k], objects[ii]) &&objects[ii].type == 'button'){
            objects[ii].pushed = true
          }else if(editing == true){
            objects[ii].pushed = false
          }

          

        }

        if(boxTouchingGround){
          if (crashBottom(players[k], objects[i])){
            touchingGround = true
            players[k].y = objects[i].y - players[k].height
            playerOnBox = true
          }
          if (crashLeft(objects[i], players[k])){
            objects[i].x = players[k].x + players[k].width
          }
          if (crashRight(objects[i], players[k])){
            objects[i].x = players[k].x - objects[i].width
          }
          if (crashTop(players[k], objects[i])){
            players[k].y = objects[i].y + objects[i].height
          }
        }else{
          if (crashBottom(players[k], objects[i])){
            touchingGround = true
            players[k].y = objects[i].y - players[k].height
            playerOnBox = true
          }
          if (crashTop(players[k], objects[i])){
            players[k].y = objects[i].y + objects[i].height
          }
          if (crashLeft(objects[i], players[k])){
            objects[i].x = players[k].x + players[k].width
          }
          if (crashRight(objects[i], players[k])){
            objects[i].x = players[k].x - objects[i].width
          }
        }

        if(!boxTouchingGround){
          objects[i].momentumY += 1/players.length * timeFlow
          
        }

        if(objects[i].momentumY >= 10) {
          objects[i].momentumY = 10;
        }

        
        

        objects[i].speedY = objects[i].momentumY * timeFlow
        objects[i].y += objects[i].speedY/players.length

        if(playerOnBox){
          players[k].speedY = objects[i].speedY
          players[k].y = objects[i].y - players[k].height
        }

        

      }
      if(objects[i].type == 'enemy' && editing == false){
        var enemyTouchingGround = false
        for (var ii = 0; ii < objects.length; ii += 1) {
          if(objects[ii].type == 'ground' || objects[ii].type == 'platform' || objects[ii].type == 'barrier' || objects[ii].type == 'antiBarrier'){
            if (crashTop(objects[i], objects[ii])){
              objects[i].momentumY = 1
              objects[i].y = objects[ii].y + objects[ii].height + 1
            }
            if (crashBottom(objects[i], objects[ii])){
              enemyTouchingGround = true
              objects[i].momentumY = 0
              objects[i].y = objects[ii].y - objects[i].height
            }
            
            if (crashLeft(objects[i], objects[ii])){
              objects[i].x = objects[ii].x + objects[ii].width
            }
            if (crashRight(objects[i], objects[ii])){
              objects[i].x = objects[ii].x - objects[i].width
            }
          }else if(objects[ii].type == 'enemy' && objects[ii] != objects[i]){
            if (crashLeft(objects[i], objects[ii])){
              objects[i].momentumX = 4 
            }
            if (crashRight(objects[i], objects[ii])){
              objects[i].momentumX = -4 
            }
          }

          

        }

        if(!enemyTouchingGround){
          objects[i].momentumY += 0.7/players.length * timeFlow
          
        }
        if(enemyTouchingGround){
          objects[i].momentumY = -8
          
        }
        if(objects[i].momentumY >= 10) {
          objects[i].momentumY = 10;
        }

        if(players[0].x > objects[i].x){
          objects[i].momentumX += 0.1
        }
        if(players[0].x < objects[i].x){
          objects[i].momentumX -= 0.1
        }

        if(players[0].x <= objects[i].x + objects[i].width && players[0].x >= objects[i].x){
          if(objects[i].x > 0.5){
            objects[i].x -= 0.3
          }
          if(objects[i].x < -0.5){
            objects[i].x += 0.3
          }
        }

        if(objects[i].momentumX > 4){
          objects[i].momentumX = 4
        }
        if(objects[i].momentumX < -4){
          objects[i].momentumX = -4
        }

        if(crash(objects[i], players[k])){
          
          alive = false
        }

        
        
        objects[i].speedX = objects[i].momentumX * timeFlow
        objects[i].speedY = objects[i].momentumY * timeFlow
        objects[i].y += objects[i].speedY/players.length
        objects[i].x += objects[i].speedX/players.length

        for(var b = 0; b < 8; b++){  
          particles.push(new component(8, 8, objects[i].color, objects[i].x + objects[i].width/2 - 4, objects[i].y + objects[i].height / 2 - 4, 20, 'particle9'))
        }
      
      }
      

      if(objects[i].type == 'holdButton' && objects[i].pushed == true){
        activeTags.push(objects[i].color)
      }else if(objects[i].type == 'holdButton'){
        if(activeTags.includes(objects[i].color)){
          arrayRemove(activeTags, objects[i].color)
        }
      }

      if(objects[i].type == 'stickyButton' && objects[i].pushed == true){
        activeTags.push(objects[i].color)
      }else if(objects[i].type == 'stickyButton'){
        if(activeTags.includes(objects[i].color)){
          arrayRemove(activeTags, objects[i].color)
        }
      }
      if(objects[i].type == 'button' && objects[i].pushed == true){
        activeTags.push(objects[i].color)
      }

      if (crashBottom(players[k], objects[i]) && objects[i].type == 'button'){
        objects[i].pushed = true
      }
      if (crashBottom(players[k], objects[i]) && objects[i].type == 'holdButton'){
        objects[i].pushed = true
        objects[i].letUp = 1 
      }
      if (crashRight(players[k], objects[i]) && objects[i].type == 'loadZone'){
        if (countInArray(objects[i].color, players[k].color) >= 1){
          loadLevel(objects[i].lifetime)
        }
      }
      if (crashLeft(players[k], objects[i]) && objects[i].type == 'loadZone'){
        if (countInArray(objects[i].color, players[k].color) >= 1){
          loadLevel(objects[i].lifetime)
        }
      }
      if(objects[i].type == 'portal'){
        var collidingThisLoop = false
        if (crashTop(objects[i], players[k])){
          portalCollision = [objects[i].color, 'top', ((players[k].x - objects[i].x)/objects[i].width)]
          collidingThisLoop = true
        }
        if (crashBottom(objects[i], players[k])){
          portalCollision = [objects[i].color, 'bottom', ((players[k].x - objects[i].x)/objects[i].width)]
          collidingThisLoop = true
        }
        if (crashLeft(objects[i], players[k])){
          portalCollision = [objects[i].color, 'left', ((players[k].y - objects[i].y)/objects[i].height)]
          collidingThisLoop = true
        }
        if (crashRight(objects[i], players[k])){
          portalCollision = [objects[i].color, 'right', ((players[k].y - objects[i].y)/objects[i].height)]
          collidingThisLoop = true
        }

        if(countInArray(portalCollision, objects[i].color) >= 1 && collidingThisLoop == false){
          warping == true
          if (portalCollision[1] == 'top' && objects[i].width >= objects[i].height){
            players[k].y = objects[i].y + objects[i].height + 1
            players[k].x = objects[i].x + ((objects[i].width/2) - players[k].width/2)
          }
          if (portalCollision[1] == 'bottom' && objects[i].width >= objects[i].height){
            players[k].y = objects[i].y - players[k].height - 1
            players[k].x = objects[i].x + ((objects[i].width/2) - players[k].width/2)
          }
          if (portalCollision[1] == 'left' && objects[i].width <= objects[i].height){
            players[k].x = objects[i].x + objects[i].width + 1
            players[k].y = objects[i].y + (portalCollision[2]*objects[i].height)
          }
          if (portalCollision[1] == 'right' && objects[i].width <= objects[i].height){
            players[k].x = objects[i].x - players[k].width - 1
            players[k].y = objects[i].y + (portalCollision[2]*objects[i].height)
          }
          portalCooldown = 2
          var portalCollision = [];
        }else if(collidingThisLoop == false){
          portals.push(objects[i])
        }
        
        

      }
      // console.log(activeTags)
      // if(objects[i].type == "barrier"){
      //   console.log(objects[i].lifetime)
      // }
      if(objects[i].type == 'barrier' && activeTags.includes(objects[i].color) && objects[i].lifetime == Infinity){
        objects[i].lifetime = 50
      }else if(objects[i].type == 'barrier' && !(activeTags.includes(objects[i].color))){
        objects[i].lifetime = Infinity
      }

      if(objects[i].type == 'antiBarrier' && activeTags.includes(objects[i].color) && objects[i].lifetime == Infinity){
        objects[i].lifetime = 50
      }else if(objects[i].type == 'antiBarrier' && !activeTags.includes(objects[i].color)){
        objects[i].lifetime = Infinity
      }
      if(objects[i].type == 'fountain' || objects[i].type == 'spawnpoint'){
        if(crash(objects[i], players[k])){
          if(objects[i].color == 'blue'){
            players[k].color = 'blue'
            doubleJump = false
          }
          if(objects[i].color == 'forestgreen'){
            players[k].color = 'forestgreen'
          }
          if(objects[i].color == 'purple' && objects[i].type == 'fountain'){
            players[k].color = 'purple'
          }
          if(objects[i].color == 'hotpink' && objects[i].type == 'fountain' && k == 0){
            players[k].color = 'hotpink'
          }
          if(objects[i].color == 'orange' && objects[i].type == 'fountain'){
            players[k].color = 'orange'
          }
          if(objects[i].color == 'black' && objects[i].type == 'fountain'){
            players[k].color = 'black'
            teleportAllowed = true
            level = 13
            loadLevel(13)
          }
          if(objects[i].color == 'yellow' && objects[i].type == 'spawnpoint' && players[k].color == 'blue'){
            players[k].color = 'red'
            level++
            alive = false
          }
        }
      }

      
      
      if (k == 0){
        objects[i].update();
        // }catch{
        //   console.log(objects[i])
        //   objects = []
        // }
      }
    }

    for (i = 0; i < players.length; i += 1) {
      if (k != i){  
        if (crashBottom(players[k], players[i])){
          players[k].momentumY = -7
        }
      }
    }

    if(warping == false && portalCollision.length != 0 && portalCooldown <= 0){
      for(var i = 0; i < portals.length; i++){
        if(portals[i].color == portalCollision[0]){
          warping == true
          if (portalCollision[1] == 'top' && portals[i].width >= portals[i].height){
            players[k].y = portals[i].y + portals[i].height + 1
            players[k].x = portals[i].x + ((portals[i].width/2) - players[k].width/2)
          }
          if (portalCollision[1] == 'bottom' && portals[i].width >= portals[i].height){
            players[k].y = portals[i].y - players[k].height - 1
            players[k].x = portals[i].x + ((portals[i].width/2) - players[k].width/2)
          }
          if (portalCollision[1] == 'left' && portals[i].width <= portals[i].height){
            players[k].x = portals[i].x + portals[i].width + 1
            players[k].y = portals[i].y + (portalCollision[2]*portals[i].height)
          }
          if (portalCollision[1] == 'right' && portals[i].width <= portals[i].height){
            players[k].x = portals[i].x - players[k].width - 1
            players[k].y = portals[i].y + (portalCollision[2]*portals[i].height)
          }
          portalCooldown = 2
          var portalCollision = [];
          break;
        }
      }
    }else{
      portals = []
    }




    myGameArea.frameNo += 1;
    players[k].update();

    portalCooldown -= 1


    if(touchingGround){
      jumpAllowed = true
      if(players[k].color == 'forestgreen'){
        doubleJump = true
      }
      players[k].momentumY = 0
    }else{
      // jumpAllowed = false
      if(players[k].color == 'purple'){
        players[k].momentumY += 0.5
      }else{
        players[k].momentumY += 0.5 * timeFlow
      }
    }

    

    
    

    
    
    if (players[k].color == 'purple' && myGameArea.keys[90]){  
      timeFlow = 0.25
      particles.push(new component(1, 1, 'white', 500, 400, timeSlowFogAlpha, 'fog'));

      if(timeSlowFogAlpha < 0){
        timeSlowFogAlpha = 0
      }else if(timeSlowFogAlpha > 200){
        timeSlowFogAlpha = 200
      }
      timeSlowFogAlpha += 13
    }else{
      timeFlow = 1
      timeSlowFogAlpha -= 13
      if(timeSlowFogAlpha > 0){
        particles.push(new component(1, 1, 'white', 500, 400, timeSlowFogAlpha, 'fog'));
      }
    }
    if (players[k].color == 'hotpink' && players.length <= 1){  
      try{
        if (myGameArea.keys[40] || myGameArea.keys[83]){
          
          players.push(new component(12, 12, "violet", players[k].x + (players[k].width/2) - 6, players[k].y, Infinity, 'rect'));
          players[0].momentumY = 1
          players[1].momentumY = -1
          previouskey = false;
        }

      }catch{
        
      }
    }
    if (players[k].color == 'orange'){  
      try{
        if (myGameArea.keys[90] && players[k].width <= 50  && !touchingRoof){
          players[k].width += 0.4
          players[k].height += 0.4
          players[k].x -= 0.2
        }

      }catch{
        
      }

      try{
        if (myGameArea.keys[88] && players[k].width >= 10){
          players[k].width -= 0.4
          players[k].height -= 0.4
          players[k].x += 0.2
        }

      }catch{
        
      }
    }

    if(players[k].color != 'orange' && players[k].width > 18 && k == 0){
      players[k].width -= 2
      players[k].height -= 2
      players[k].x += 1
      players[k].y += 2
      players[k].width = Math.floor(players[k].width)
      players[k].height = Math.floor(players[k].height)
    }
    if(players[k].color != 'orange' && players[k].width < 18 && k == 0){
      players[k].width += 1
      players[k].height += 1
      players[k].x -= 0.5
      players[k].width = Math.floor(players[k].width)
      players[k].height = Math.floor(players[k].height)
    }

    
  
    // for (i = 0; i < objects.length; i++) {
    //   if(objects[i].type == 'barrier' && activeTags.includes(objects[i].color) && objects[i].lifetime == Infinity){
    //     objects[i].lifetime = 50
    //   }else if(objects[i].type == 'barrier' && !activeTags.includes(objects[i].color)){
    //     objects[i].lifetime = Infinity
    //   }

    //   if(objects[i].type == 'antiBarrier' && activeTags.includes(objects[i].color) && objects[i].lifetime == Infinity){
    //     objects[i].lifetime = 50
    //   }else if(objects[i].type == 'antiBarrier' && !activeTags.includes(objects[i].color)){
    //     objects[i].lifetime = Infinity
    //   }
    //   if((objects[i].type == 'fountain' || objects[i].type == 'spawnpoint')){
    //     if(crash(objects[i], players[k])){
    //       if(objects[i].color == 'blue'){
    //         players[k].color = 'blue'
    //         doubleJump = false
    //       }
    //       if(objects[i].color == 'forestgreen'){
    //         players[k].color = 'forestgreen'
    //       }
    //       if(objects[i].color == 'purple' && objects[i].type == 'fountain'){
    //         players[k].color = 'purple'
    //       }
    //       if(objects[i].color == 'hotpink' && objects[i].type == 'fountain' && k == 0){
    //         players[k].color = 'hotpink'
    //       }
    //       if(objects[i].color == 'orange' && objects[i].type == 'fountain'){
    //         players[k].color = 'orange'
    //       }
    //       if(objects[i].color == 'black' && objects[i].type == 'fountain'){
    //         players[k].color = 'black'
    //         teleportAllowed = true
    //         level = 13
    //         loadLevel(13)
    //       }
    //       if(objects[i].color == 'yellow' && objects[i].type == 'spawnpoint' && players[k].color == 'blue'){
    //         players[k].color = 'red'
    //         level++
    //         alive = false
    //       }
    //     }
    //   }

      
    // }

    

    for (i = 0; i < particles.length; i++) {
      if(k == 0){
        particles[i].speedY = 0
        particles[i].newPos();
        particles[i].update();
        try{  
          if(particles[i].type == 'fog'){
            arrayRemove(particles, particles[i])
            continue;
          }
        }catch{}
      }
      
    }

   
    
    if(players.length == 1){
      keyHold = false
      if (myGameArea.keys && (myGameArea.keys[37] || myGameArea.keys[65])) {
        players[k].momentumX += -0.7; keyHold = true;
      }
      if (myGameArea.keys && (myGameArea.keys[39] || myGameArea.keys[68])) {
        players[k].momentumX += 0.7; keyHold = true;
      }

      if(myGameArea.keys && myGameArea.keys[13] && fading == false && fade.lifetime == 0){
        level++
        alive = false
      }

      

      if (players[k].momentumX >= 0.1){
        if(touchingGround){
          players[k].momentumX -= 0.2 + slopeSteepness/100
        }else{
          players[k].momentumX -= 0.1
        }
      }else if (players[k].momentumX <= -0.1){
        if(touchingGround){
          players[k].momentumX += 0.2 
        }else{
          players[k].momentumX += 0.1
        }
      }else{
        players[k].momentumX = 0
      }

      if (myGameArea.keys && (myGameArea.keys[38] || myGameArea.keys[87]) && jumpAllowed == true) {
        players[k].momentumY = -8 - Math.abs(players[k].momentumX/3);
        touchingSlope = false;
        if(players[k].momentumX > 0){
          players[k].momentumX += 0.5
        }
        if(players[k].momentumX < 0){
          players[k].momentumX -= 0.5
        }
      }else if(myGameArea.keys && (myGameArea.keys[38] || myGameArea.keys[87]) &&doubleJump == true && players[k].momentumY >= 0) {
        doubleJump = false;
        players[k].momentumY = -7;
      }else if(myGameArea.keys && (myGameArea.keys[38] || myGameArea.keys[87])){
        if(players[k].momentumY < 0){  
          players[k].momentumY -= 0.15
        }else{
          players[k].momentumY -= 0.05
        }
      }

      try{
        if (!myGameArea.keys[40] && platformAllowed == true && previouskey == true) {
          objects.push(new component(80, 18, 'gray', players[k].x - 30, players[k].y + players[k].height, 150, 'rect'));
          previouskey = false;
        }else{
          previouskey = myGameArea.keys[40]
        }

      }catch{
        
      }
    }else if(k == 0){
      keyHold = false
      if (myGameArea.keys && myGameArea.keys[37]) {
        players[k].momentumX += -0.7; keyHold = true;
      }
      if (myGameArea.keys && myGameArea.keys[39]) {
        players[k].momentumX += 0.7; keyHold = true;
      }

      if (players[k].momentumX >= 0.1){
        if(touchingGround){
          players[k].momentumX -= 0.2
        }else{
          players[k].momentumX -= 0.1
        }
      }else if (players[k].momentumX <= -0.1){
        if(touchingGround){
          players[k].momentumX += 0.2
        }else{
          players[k].momentumX += 0.1
        }
      }else{
        players[k].momentumX = 0
      }

      if (myGameArea.keys && myGameArea.keys[38] && jumpAllowed == true) {
        players[k].momentumY = -8 - Math.abs(players[k].momentumX/3);
        touchingSlope = false;
        if(players[k].momentumX > 0){
          players[k].momentumX += 0.5
        }
        if(players[k].momentumX < 0){
          players[k].momentumX -= 0.5
        }
      }else if(myGameArea.keys && myGameArea.keys[38] &&doubleJump == true && players[k].momentumY >= 0) {
        doubleJump = false;
        players[k].momentumY = -7;
      }else if(myGameArea.keys && myGameArea.keys[38]){
        if(players[k].momentumY < 0){  
          players[k].momentumY -= 0.15
        }else{
          players[k].momentumY -= 0.05
        }
      }

      try{
        if (!myGameArea.keys[40] && platformAllowed == true && previouskey == true) {
          objects.push(new component(80, 18, 'gray', players[k].x - 30, players[k].y + players[k].height, 150, 'rect'));
          previouskey = false;
        }else{
          previouskey = myGameArea.keys[40]
        }

      }catch{
        
      }

    }else{
      keyHold = false
      if (myGameArea.keys && myGameArea.keys[65]) {players[k].momentumX += -0.5; keyHold = true;}
      if (myGameArea.keys && myGameArea.keys[68]) {players[k].momentumX += 0.5; keyHold = true;}

      if (players[k].momentumX >= 0.1){
        if(touchingGround){
          players[k].momentumX -= 0.2
        }else{
          players[k].momentumX -= 0.1
        }
      }else if (players[k].momentumX <= -0.1){
        if(touchingGround){
          players[k].momentumX += 0.2
        }else{
          players[k].momentumX += 0.1
        }
      }else{
        players[k].momentumX = 0
      }

      if (myGameArea.keys && myGameArea.keys[87] && jumpAllowed == true) {players[k].momentumY = -9 - Math.abs(players[k].momentumX/3); touchingSlope = false;}else if(myGameArea.keys && myGameArea.keys[87] &&doubleJump == true && players[k].momentumY >= 0) {doubleJump = false; players[k].momentumY = -8;}

      try{
        if (!myGameArea.keys[83] && platformAllowed == true && previouskey == true) {objects.push(new component(80, 18, 'gray', players[k].x - 30, players[k].y + players[k].height, 150, 'rect')); previouskey = false;}else{
          previouskey = myGameArea.keys[83]
        }

      }catch{
        
      }

    }
    
    if(players[k].momentumY >= 10) {
      players[k].momentumY = 10;
    }

    if(touchingSlope){
      players[k].momentumY += 3
    }


    
    if(touchingGround && players[k].momentumX >= 4) {
      players[k].momentumX -= 0.585;
    }else if(players[k].momentumX >= 5){
      players[k].momentumX -= 0.595;
    }

    if(touchingGround && players[k].momentumX <= -4) {
      players[k].momentumX += 0.585;
    }else if(players[k].momentumX <= -5){
      players[k].momentumX += 0.595;
    }

    document.getElementById("momentumX").innerHTML = players[k].momentumX.toFixed(2)
    
    players[k].newPos();

    if(players[k].y >= 550){

      players[k].momentumX = 0
      
      if (k == 0){
        alive = k
      }else{
        players.pop(k)
      }
    }
    
    if(players.length > 1){
      if(players[0].color != 'hotpink'){
        for(var i = 0; i < 15; i++){
          particles.push(new component(2, 2, players[1].color, players[1].x, players[1].y, 75, 'particle7'))
        }
        players.pop(1)
      }
    }

  }

  

  for (var ii = 0; ii < objects.length; ii++){
     
    if (objects[ii].type == 'holdButton' && objects[ii].letUp == 0){
      objects[ii].pushed = false
    }
    if (objects[ii].type == 'stickyButton' && objects[ii].letUp <= 0){
      objects[ii].letUp = 0
      objects[ii].pushed = false
    }
  }

  ctx = myGameArea.context;
  ctx.globalAlpha = 1
  
  ctx.fillStyle = 'khaki';
  ctx.fillRect(hitboxX, hitboxY, hitboxWidth, 2);
  ctx.fillRect(hitboxX, hitboxY, 2, hitboxHeight);
  ctx.fillRect(hitboxX + hitboxWidth - 2, hitboxY, 2, hitboxHeight);
  ctx.fillRect(hitboxX, hitboxY + hitboxHeight - 2, hitboxWidth, 2);
  

  if(editing){

    


    if(players.length > 1){  
      players = players[0]
    }

    players[0].color = 'red'
    players[0].y = 4200

    if(selectedObject != null){
      if(objects[selectedObject].type == 'antiBarrier'){
        objects[selectedObject].saveX = parseInt(document.getElementById("objectX").value)
        objects[selectedObject].saveY = parseInt(document.getElementById("objectY").value)
        objects[selectedObject].x = parseInt(document.getElementById("objectX").value)
        objects[selectedObject].y = parseInt(document.getElementById("objectY").value)
      }else{
        objects[selectedObject].x = parseInt(document.getElementById("objectX").value)
        objects[selectedObject].y = parseInt(document.getElementById("objectY").value)
      }
      objects[selectedObject].width = parseInt(document.getElementById("objectWidth").value)
      objects[selectedObject].height = parseInt(document.getElementById("objectHeight").value)
      objects[selectedObject].color = document.getElementById("objectColor").value

      if(objects[selectedObject].type == 'text' || objects[selectedObject].type == 'loadZone' || objects[selectedObject].type == 'rain'){
        objects[selectedObject].lifetime = document.getElementById("objectLifetime").value
      }else{
        objects[selectedObject].lifetime = parseInt(document.getElementById("objectLifetime").value)
      }

      if(myGameArea.keys && myGameArea.keys[16]){
        if(myGameArea.keys && myGameArea.keys[38]){
          document.getElementById("objectY").value -= 0.5
        }
        if(myGameArea.keys && myGameArea.keys[37]){
          document.getElementById("objectX").value -= 0.5
        }
        if(myGameArea.keys && myGameArea.keys[40]){
          document.getElementById("objectY").value -= -0.5
        }
        if(myGameArea.keys && myGameArea.keys[39]){
          document.getElementById("objectX").value -= -0.5
        }
        if(myGameArea.keys && myGameArea.keys[87]){
          document.getElementById("objectHeight").value -= 0.5
        }
        if(myGameArea.keys && myGameArea.keys[65]){
          document.getElementById("objectWidth").value -= 0.5
        }
        if(myGameArea.keys && myGameArea.keys[83]){
          document.getElementById("objectHeight").value -= -0.5
        }
        if(myGameArea.keys && myGameArea.keys[68]){
          document.getElementById("objectWidth").value -= -0.5
        }
      }else{
        if(myGameArea.keys && myGameArea.keys[38]){
          document.getElementById("objectY").value -= 3
        }
        if(myGameArea.keys && myGameArea.keys[37]){
          document.getElementById("objectX").value -= 3
        }
        if(myGameArea.keys && myGameArea.keys[40]){
          document.getElementById("objectY").value -= -3
        }
        if(myGameArea.keys && myGameArea.keys[39]){
          document.getElementById("objectX").value -= -3
        }
        if(myGameArea.keys && myGameArea.keys[87]){
          document.getElementById("objectHeight").value -= 3
        }
        if(myGameArea.keys && myGameArea.keys[65]){
          document.getElementById("objectWidth").value -= 3
        }
        if(myGameArea.keys && myGameArea.keys[83]){
          document.getElementById("objectHeight").value -= -3
        }
        if(myGameArea.keys && myGameArea.keys[68]){
          document.getElementById("objectWidth").value -= -3
        }
      }

      hitboxX = objects[selectedObject].x
      hitboxY = objects[selectedObject].y
      hitboxWidth = objects[selectedObject].width
      hitboxHeight = objects[selectedObject].height
    }
    
  }else{
    hitboxX = -1200
    hitboxY = -1200
  }

  if(fading){
    fade.lifetime += 0.1
    if(fade.lifetime > 1.5) fade.lifetime = 1.5
  }else{
    fade.lifetime -= 0.1
    if(fade.lifetime < 0) fade.lifetime = 0
  }

  ctx = myGameGUI.context
  ctx.globalAlpha = fade.lifetime
  ctx.fillStyle = fade.color
  ctx.fillRect(fade.x, fade.y, fade.width, fade.height)

  document.getElementById("audio").playbackRate = 1 - Math.abs(1 - timeFlow)/2

  
  

}



function refreshObjectsList() {
  document.getElementById('gameEditList').innerHTML = '<li><button id="gamemodeSwitchButton" class="guiButton" onclick=\"gamemodeSwitch()\"><strong>Play</strong></button></li>'
  if(editing){
    document.getElementById('gameEditList').innerHTML += '<li><button class="guiButton" onclick=\"showAddObjectMenu()\"><strong>Add Object</strong></button></li>'
    if(deleting){
      document.getElementById('gameEditList').innerHTML += '<li><button class="guiButton" onclick=\"deleteMode()\"><strong>Cancel Delete</strong></button></li>'
    }else{
      document.getElementById('gameEditList').innerHTML += '<li><button class="guiButton" onclick=\"deleteMode()\"><strong>Delete Object</strong></button></li>'
    }
  }
  for(var i = 0; i < objects.length; i++){
    if(deleting){
      document.getElementById('gameEditList').innerHTML += '<li><button class=\"objectButtonDeleteMode\" onclick=\"setSelectedObject('+ i +')\">' + objects[i].type + '</button></li>'
    }else{
      document.getElementById('gameEditList').innerHTML += '<li><button class=\"objectButton\" onclick=\"setSelectedObject('+ i +')\">' + objects[i].type + '</button></li>'
    }
  }
}

function deleteMode(){
  if(deleting){
    deleting = false
  }else{
    deleting = true
  }
  refreshObjectsList()
}

function gamemodeSwitch() {
  if(editing){
    editing = false
    var currentData = ''
    for(var i = 0; i < objects.length; i++){
      currentData += 'objects.push(new component('+objects[i].width+','+objects[i].height+',\''+objects[i].color+'\','+objects[i].x+','+objects[i].y+','
      
      if(objects[i].type == 'text' || objects[i].type == 'loadZone'){
        currentData += '\''+objects[i].lifetime+'\','
      }else{
        currentData += objects[i].lifetime+','
      }
      
      currentData += '\''+objects[i].type+'\'));\n'

      if(objects[i].type == 'enemy' || objects[i].type == 'box'){
        objects[i].saveX = objects[i].x
        objects[i].saveY = objects[i].y
      }
    }
    objects = []
    eval(currentData)
    deleting = false
    refreshObjectsList()
    document.getElementById('gamemodeSwitchButton').innerHTML = '<strong>Edit</strong>'
    document.getElementById("addObjectDiv").style.display = 'none'
  }else{
    for(var i = 0; i < objects.length; i++){
      if(objects[i].type == 'button'){
        objects[i].pushed = false
      }
    }
    myGameFG.clear()
    editing = true
    document.getElementById('gamemodeSwitchButton').innerHTML = '<strong>Play</strong>'
    refreshObjectsList()
  }

  setSelectedObject(selectedObject)
}

function setSelectedObject(num){

  for(var i = 0; i < objects.length; i++){
    if(objects[i].type == 'enemy' || objects[i].type == 'box'){
      objects[i].saveX = objects[i].x
      objects[i].saveY = objects[i].y
    }
  }

  selectedObject = num
  document.getElementById('objectPropertiesMenu').innerHTML = ''

  

  

  if(deleting == true){
    arrayRemove(objects, objects[num])
    selectedObject = null
    deleting = false
    refreshObjectsList()
    hitboxX = -1200
  }
  
  

  if(editing){
    if(selectedObject != null){
      document.getElementById('objectPropertiesMenu').innerHTML += '<h2>'+objects[num].type+'</h2>'
      if(objects[num].type == 'antiBarrier'){
        document.getElementById('objectPropertiesMenu').innerHTML += '<p>X Position: <input id=\"objectX\" type=\"number\" value=\"'+objects[num].saveX+'\"></input></p>'
        document.getElementById('objectPropertiesMenu').innerHTML += '<p>Y Position: <input id=\"objectY\" type=\"number\" value=\"'+objects[num].saveY+'\"></input></p>'
      }else{
        document.getElementById('objectPropertiesMenu').innerHTML += '<p>X Position: <input id=\"objectX\" type=\"number\" value=\"'+objects[num].x+'\"></input></p>'
        document.getElementById('objectPropertiesMenu').innerHTML += '<p>Y Position: <input id=\"objectY\" type=\"number\" value=\"'+objects[num].y+'\"></input></p>'
      }

      
      
      document.getElementById('objectPropertiesMenu').innerHTML += '<p>Width: <input id=\"objectWidth\" type=\"number\" value=\"'+objects[num].width+'\"></input></p>'
      document.getElementById('objectPropertiesMenu').innerHTML += '<p>Height: <input id=\"objectHeight\" type=\"number\" value=\"'+objects[num].height+'\"></input></p>'
      document.getElementById('objectPropertiesMenu').innerHTML += '<p>Color: <input id=\"objectColor\" type=\"text\" value=\"'+objects[num].color+'\"></input></p>'
      
      var lifetimeAttribute = 'none'

      if(objects[num].type == 'text'){
        lifetimeAttribute = 'String'
      }else if(objects[num].type == 'loadZone'){
        lifetimeAttribute = 'Warp'
      }else if(objects[num].type == 'paltform'){
        lifetimeAttribute = 'Range'
      }else if(objects[num].type == 'rain'){
        lifetimeAttribute = 'Background'
      }else if(objects[num].type == 'stickyButton'){
        lifetimeAttribute = 'Unstick Delay(frames)'
      }

      document.getElementById('objectPropertiesMenu').innerHTML += '<p id="lifetimeDisplay">'+lifetimeAttribute+': <input id=\"objectLifetime\" type=\"text\" value=\"'+objects[num].lifetime+'\"></input></p>'

      if(lifetimeAttribute != 'none'){  
        document.getElementById('lifetimeDisplay').style.display = 'block'
      }else{
        document.getElementById('lifetimeDisplay').style.display = 'none'
      }
    }else{
      
      if(objects[num].type == 'antiBarrier'){
      document.getElementById('objectPropertiesMenu').innerHTML += '<p>X Position: '+objects[num].saveX+'</p>'
      document.getElementById('objectPropertiesMenu').innerHTML += '<p>Y Position: '+objects[num].saveY+'</p>'
      }else{
        document.getElementById('objectPropertiesMenu').innerHTML += '<p>X Position: '+objects[num].x+'</p>'
        document.getElementById('objectPropertiesMenu').innerHTML += '<p>Y Position: '+objects[num].y+'</p>'
      }

      document.getElementById('objectPropertiesMenu').innerHTML += '<p>Width: '+objects[num].width+'</p>'
      document.getElementById('objectPropertiesMenu').innerHTML += '<p>Height: '+objects[num].height+'</p>'
      document.getElementById('objectPropertiesMenu').innerHTML += '<p>Color: '+objects[num].color+'</p>'

      var lifetimeAttribute = 'none'

      if(objects[num].type == 'text'){
        lifetimeAttribute = 'String'
      }else if(objects[num].type == 'loadZone'){
        lifetimeAttribute = 'Warp'
      }else if(objects[num].type == 'paltform'){
        lifetimeAttribute = 'Range'
      }else if(objects[num].type == 'rain'){
        lifetimeAttribute = 'Background'
      }else if(objects[num].type == 'stickyButton'){
        lifetimeAttribute = 'Unstick Delay'
      }else if(objects[num].type == 'rotatePlatform'){
        lifetimeAttribute = 'Angle'
      }

      document.getElementById('objectPropertiesMenu').innerHTML += '<p id="lifetimeDisplayStatic">'+lifetimeAttribute+': '+objects[num].lifetime+'</p>'

      if(lifetimeAttribute != 'none'){  
        document.getElementById('lifetimeDisplayStatic').style.display = 'block'
      }else{
        document.getElementById('lifetimeDisplayStatic').style.display = 'none'
      }
    }
  }
  
  
  
  
}

function showAddObjectMenu() {
  document.getElementById("addObjectDiv").style.display = 'block'
}

function addObject(type) {
  if(type == 'ground'){
    objects.push(new component(40, 20, 'saddlebrown', 480, 240, Infinity, 'ground'))
  }
  if(type == 'fountain'){
    objects.push(new component(1, 1, 'blue', 500, 250, Infinity, 'fountain'))
  }
  if(type == 'barrier'){
    objects.push(new component(10, 40, 'orange', 495, 230, Infinity, 'barrier'))
  }
  if(type == 'antiBarrier'){
    objects.push(new component(10, 40, 'orange', 495, 230, Infinity, 'antiBarrier'))
  }
  if(type == 'button'){
    objects.push(new component(40, 10, 'orange', 480, 245, Infinity, 'button'))
  }
  if(type == 'holdButton'){
    objects.push(new component(40, 10, 'orange', 480, 245, Infinity, 'holdButton'))
  }
  if(type == 'stickyButton'){
    objects.push(new component(40, 10, 'orange', 480, 245, 3, 'stickyButton'))
  }
  if(type == 'box'){
    objects.push(new component(20, 20, 'chocolate', 490, 240, Infinity, 'box'))
  }
  if(type == 'portal'){
    objects.push(new component(8, 40, 'purple', 480, 240, Infinity, 'portal'))
    objects.push(new component(8, 40, 'purple', 512, 240, Infinity, 'portal'))
  }
  if(type == 'rotatePlatform'){
    objects.push(new component(80, 20, 'black', 480, 240, 10, 'rotatePlatform'))
  }
  if(type == 'enemy'){
    objects.push(new component(16, 16, 'maroon', 492, 242, Infinity, 'enemy'))
  }

  
  setSelectedObject(objects.length - 1)

  document.getElementById("addObjectDiv").style.display = 'none'

  refreshObjectsList()
}

document.getElementById("output").style.display = 'none'

function outputLevelData() {
  document.getElementById("output").style.display = 'block'
  document.getElementById('importButton').style.display = 'none'
  document.getElementById("outputBox").value = ''
  for(var i = 0; i < objects.length; i++){
    // document.getElementById("outputBox").value += 'objects.push(new component('+objects[i].width+','+objects[i].height+',\''+objects[i].color+'\','+objects[i].x+','+objects[i].y+',\''+objects[i].type+'\','
    
    // if(objects[i].type == 'text' || objects[i].type == 'loadZone'){
    //   document.getElementById("outputBox").value += '\''+objects[i].lifetime+'\'));\n'
    // }else{
    //   document.getElementById("outputBox").value += objects[i].lifetime+'));\n'
    // }
    document.getElementById("outputBox").value += 'objects.push(new component('+Math.floor(objects[i].width)+','+Math.floor(objects[i].height)+',\''+objects[i].color+'\','+Math.floor(objects[i].x)+','+Math.floor(objects[i].y)+','
      
    if(objects[i].type == 'text' || objects[i].type == 'loadZone'){
      document.getElementById("outputBox").value += '\''+objects[i].lifetime+'\','
    }else{
      document.getElementById("outputBox").value += Math.floor(objects[i].lifetime)+','
    }
    
    document.getElementById("outputBox").value += '\''+objects[i].type+'\'));\n'
  }
}

function importLevelData(){
  objects = []
  eval(document.getElementById("outputBox").value)
  document.getElementById('output').style.display = 'none'
}

function openImportPage() {
  document.getElementById("output").style.display = 'block'
  document.getElementById('importButton').style.display = 'block'
  document.getElementById("outputBox").value = ''
}

document.getElementById("addObjectDiv").style.display = 'none'


function everyinterval(n) {
  if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
  return false;
}




window.onload = function() {
  document.getElementById("audio").play();
  document.getElementById("audio").volume = "0.2"
}
myGameArea.start();
loadLevel(level)


if(editing) {
  level = 'edit'
  objects = [new component(30, 50, 'yellow', 485, 200, Infinity, 'spawnpoint')]
  refreshObjectsList()
}else{
  document.getElementById('objectPropertiesMenu').style.display = 'none'
  document.getElementById('dataButtons').style.display = 'none'
}

