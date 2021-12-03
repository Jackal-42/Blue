function loadLevel(levelNum){  
  objects = []
  particles = []
  background = []
  foreground = []
  players[0].color = 'red'
  myGameFG.clear()
  if (levelNum != 'easterEgg2' && levelNum != 'easterEgg1' && levelNum != 'easterEgg' && levelNum != 'return'){
    alive = false
    players = [players[0]]
    players[0].y = 1600
    players[0].width = 18
    players[0].height = 18
  }else if(levelNum == 'easterEgg'){
    players[0].x = 30
  }else if(levelNum == 'easterEgg1'){
    players[0].x = 950
  }else if(levelNum == 'easterEgg2'){
    players[0].x = 30
  }else if(levelNum == 'return'){
    players[0].x = 970
    levelNum = level
  }

  if(levelNum == 1){
    objects.push(new component(30, 50, 'yellow', 100, 350, Infinity, 'spawnpoint'));
    objects.push(new component(1000, 20, 'saddlebrown', 0, 0, Infinity, 'ground'));
    objects.push(new component(1000, 100, 'saddlebrown', 0, 400, Infinity, 'ground'));
    objects.push(new component(20, 500, 'saddlebrown', 0, 0, Infinity, 'ground'));
    objects.push(new component(20, 500, 'saddlebrown', 980, 0, Infinity, 'ground'));
    objects.push(new component(30, 50, 'blue', 900, 350, Infinity, 'fountain'));
    // objects.push(new component(1, 1, 'purple', 500, 400, Infinity, 'fountain'));
    objects.push(new component(1, 1, ['blue', 'purple'], 22, 398, 'easterEgg1', 'loadZone'));
    background.push(new component(1000, 500, 'lightBlue', 0, 0, Infinity, 'rect'))
    background.push(new component(0, 0, 'lightgray', -300, 0, Infinity, 'clouds'));
    background.push(new component(0, 0, 'lightgray', -300, 0, Infinity, 'mountains'));
    
    objects.push(new component(15, 15, 'maroon', 680, 50, Infinity, 'enemy'))
    
    // objects.push(new component(200, 40, 'saddlebrown', 600, 250, -45, 'rotatePlatform'));
  }

  if(levelNum == 2){
    objects.push(new component(30, 50, 'yellow', 100, 350, Infinity, 'spawnpoint'));
    objects.push(new component(400, 100, 'saddlebrown', 0, 400, Infinity, 'ground'));
    objects.push(new component(75, 20, 'saddlebrown', 500, 320, Infinity, 'ground'));
    objects.push(new component(75, 20, 'saddlebrown', 650, 260, Infinity, 'ground'));
    objects.push(new component(100, 20, 'saddlebrown', 800, 200, Infinity, 'ground'));
    objects.push(new component(20, 500, 'saddlebrown', 980, 0, Infinity, 'ground'));
    objects.push(new component(30, 50, 'blue', 850, 150, Infinity, 'fountain'));
    background.push(new component(1000, 500, 'lightBlue', 0, 0, Infinity, 'rect'))
    background.push(new component(0, 0, 'lightgray', -300, 0, Infinity, 'clouds'));
    background.push(new component(0, 0, 'lightgray', -300, 0, Infinity, 'mountains'));
    // objects.push(new component(20, 500, ['blue', 'purple'], 1000, 0, 'easterEgg2', 'loadZone'));
  }

  if(levelNum == 3){
    objects.push(new component(30, 50, 'yellow', 500, 350, Infinity, 'spawnpoint'));
    objects.unshift(new component(40, 10, 'orange', 100, 390, Infinity, 'button'));
    objects.push(new component(10, 101, 'orange', 800, 300, Infinity, 'barrier'))
    objects.push(new component(1000, 100, 'saddlebrown', 0, 400, Infinity, 'ground'));
    objects.push(new component(200, 10, 'saddlebrown', 800, 300, Infinity, 'ground'));
    
    objects.push(new component(30, 50, 'blue', 900, 350, Infinity, 'fountain'));
    background.push(new component(1000, 500, 'lightBlue', 0, 0, Infinity, 'rect'))
    background.push(new component(0, 0, 'lightgray', -300, 0, Infinity, 'clouds'));
    background.push(new component(0, 0, 'lightgray', -300, 0, Infinity, 'mountains'));
  }

  if(levelNum == 4){
    objects.push(new component(30, 50, 'yellow', 500, 350, Infinity, 'spawnpoint'));
    objects.push(new component(1000, 100, 'saddlebrown', 0, 400, Infinity, 'ground'));
    objects.push(new component(100, 50, 'saddlebrown', 50, 250, Infinity, 'ground'));
    objects.push(new component(30, 50, 'forestgreen', 900, 350, Infinity, 'fountain'));
    objects.push(new component(30, 50, 'blue', 100, 200, Infinity, 'fountain'));
    background.push(new component(1000, 500, 'lightBlue', 0, 0, Infinity, 'rect'))
    background.push(new component(0, 0, 'lightgray', -300, 0, Infinity, 'clouds'));
    background.push(new component(0, 0, 'lightgray', -300, 0, Infinity, 'mountains'));
  }

  if(levelNum == 5){
    objects.push(new component(10, 120, 'orange', 800, 300, Infinity, 'barrier'))
    objects.push(new component(100, 20, 'green', 650, 100, Infinity, 'barrier'))
    objects.push(new component(200, 10, 'saddlebrown', 800, 300, Infinity, 'ground'));
    objects.push(new component(1000, 100, 'saddlebrown', 0, 400, Infinity, 'ground'));
    objects.push(new component(25, 25, 'chocolate', 680, 50, Infinity, 'box'))
    objects.unshift(new component(40, 10, 'orange', 100, 390, Infinity, 'holdButton'));
    objects.unshift(new component(40, 10, 'green', 900, 290, Infinity, 'button'));
    objects.push(new component(30, 50, 'yellow', 500, 350, Infinity, 'spawnpoint'));
    objects.push(new component(30, 50, 'blue', 900, 350, Infinity, 'fountain'));
    background.push(new component(1000, 500, 'lightBlue', 0, 0, Infinity, 'rect'))
    background.push(new component(0, 0, 'lightgray', -300, 0, Infinity, 'clouds'));
    background.push(new component(0, 0, 'lightgray', -300, 0, Infinity, 'mountains'));
  }

  if(levelNum == 6){
    objects.push(new component(80, 10, 'black', 300, 350, 100, 'platform'));
    objects.push(new component(80, 10, 'black', 150, 280, 150, 'platform'));
    objects.push(new component(80, 10, 'black', 100, 200, 130, 'platform'));
    objects.push(new component(500, 100, 'saddlebrown', 500, 400, Infinity, 'ground'));
    objects.push(new component(200, 400, 'saddlebrown', 0, 150, Infinity, 'ground'));
    objects.push(new component(30, 50, 'yellow', 800, 350, Infinity, 'spawnpoint'));
    objects.push(new component(30, 50, 'blue', 150, 100, Infinity, 'fountain'));
    objects.push(new component(20, 500, ['blue', 'purple'], 1000, 0, 'easterEgg', 'loadZone'));
    background.push(new component(1000, 500, 'lightBlue', 0, 0, Infinity, 'rect'))
    background.push(new component(0, 0, 'lightgray', -300, 0, Infinity, 'clouds'));
    background.push(new component(0, 0, 'lightgray', -300, 0, Infinity, 'mountains'));
  }

  if(levelNum == 7){
    objects.push(new component(1000, 500, 'lightblue', 1, 1, 'gray', 'rain'));
    objects.push(new component(30, 50, 'yellow', 500, 50, Infinity, 'spawnpoint'));
    objects.push(new component(30, 50, 'blue', 500, 400, Infinity, 'fountain'));
    objects.push(new component(200, 40, 'saddlebrown', 400, 100, Infinity, 'ground'));
    objects.push(new component(200, 40, 'saddlebrown', 400, 450, Infinity, 'ground'));
    objects.push(new component(80, 10, 'black', 500, 180, 130, 'platform'));
    objects.push(new component(80, 10, 'black', 300, 250, 100, 'platform'));
    objects.push(new component(80, 10, 'black', 150, 320, 130, 'platform'));
    objects.push(new component(80, 10, 'black', 300, 400, 80, 'platform'));
    background.push(new component(0, 0, 'lightgray', -300, 0, Infinity, 'clouds'));
    background.push(new component(0, 0, 'lightgray', -300, 0, Infinity, 'mountains'));
  }

  if(levelNum == 8){
    objects.push(new component(1000, 500, 'lightblue', 1, 1, 'grey', 'rain'));
    objects.push(new component(30, 50, 'yellow', 100, 310, Infinity, 'spawnpoint'));
    objects.push(new component(5, 62, 'purple', 600, 299, Infinity, 'portal'))
    objects.push(new component(1000, 200, 'saddlebrown', 0, 360, Infinity, 'ground'));
    objects.push(new component(5, 62, 'purple', 198, 199, Infinity, 'portal'))
    objects.push(new component(1000, 40, 'saddlebrown', 0, 260, Infinity, 'ground'));
    objects.push(new component(1000, 200, 'saddlebrown', 0, 0, Infinity, 'ground'));
    objects.push(new component(200, 70, 'saddlebrown', 0, 200, Infinity, 'ground'));
    objects.push(new component(400, 70, 'saddlebrown', 603, 300, Infinity, 'ground'));
    objects.push(new component(100, 70, 'saddlebrown', 900, 200, Infinity, 'ground'));
    objects.push(new component(50, 70, 'saddlebrown', 0, 300, Infinity, 'ground'));
    objects.push(new component(30, 50, 'blue', 800, 210, Infinity, 'fountain'));
    background.push(new component(0, 0, 'lightgray', -300, 0, Infinity, 'clouds'));
    background.push(new component(0, 0, 'lightgray', -300, 0, Infinity, 'mountains'));
    
  }

  if(levelNum == 9){
    objects.push(new component(1000, 500, 'lightblue', 1, 1, 'grey', 'rain'));
    objects.push(new component(10, 80, 'orange', 700, 290, Infinity, 'barrier'))
    objects.push(new component(30, 50, 'yellow', 250, 310, Infinity, 'spawnpoint'));
    objects.push(new component(1000, 200, 'saddlebrown', 0, 360, Infinity, 'ground'));
    objects.push(new component(550, 20, 'saddlebrown', 200, 280, Infinity, 'ground'));
    objects.push(new component(20, 200, 'saddlebrown', 750, 100, Infinity, 'ground'));
    objects.push(new component(200, 300, 'saddlebrown', 900, 0, Infinity, 'ground'));
    objects.push(new component(50, 20, 'saddlebrown', 770, 210, Infinity, 'ground'));
    objects.push(new component(50, 20, 'saddlebrown', 850, 270, Infinity, 'ground'));
    objects.push(new component(50, 20, 'saddlebrown', 850, 150, Infinity, 'ground'));
    objects.push(new component(100, 100, 'saddlebrown', 900, 280, Infinity, 'ground'));
    objects.unshift(new component(40, 10, 'orange', 600, 270, Infinity, 'holdButton'));
    objects.push(new component(30, 50, 'blue', 800, 310, Infinity, 'fountain'));
    objects.push(new component(30, 50, 'hotpink', 50, 310, Infinity, 'fountain'));
    background.push(new component(0, 0, 'lightgray', -300, 0, Infinity, 'clouds'));
    background.push(new component(0, 0, 'lightgray', -300, 0, Infinity, 'mountains'));
  }

  if(levelNum == 10){
    objects.push(new component(1000, 500, 'lightblue', 1, 1, 'grey', 'rain'));
    objects.push(new component(30, 50, 'yellow', 150, 350, Infinity, 'spawnpoint'));
    objects.push(new component(400, 100, 'saddlebrown', 0, 400, Infinity, 'ground'));
    objects.unshift(new component(40, 10, 'green', 500, 190, Infinity, 'holdButton'));
    objects.unshift(new component(40, 10, 'orange', 560, 190, Infinity, 'holdButton'));
    objects.unshift(new component(40, 10, 'teal', 620, 190, Infinity, 'holdButton'));
    objects.push(new component(800, 20, 'saddlebrown', 200, 200, Infinity, 'ground'));
    objects.push(new component(75, 20, 'green', 500, 380, Infinity, 'antiBarrier'));
    objects.push(new component(75, 20, 'orange', 650, 340, Infinity, 'antiBarrier'));
    objects.push(new component(100, 20, 'teal', 800, 320, Infinity, 'antiBarrier'));
    objects.push(new component(50, 20, 'saddlebrown', 950, 300, Infinity, 'ground'));
    objects.push(new component(20, 120, 'saddlebrown', 990, 200, Infinity, 'ground'));
    objects.push(new component(80, 10, 'black', 150, 350, 130, 'platform'));
    objects.push(new component(80, 10, 'black', 50, 260, 130, 'platform'));
    objects.push(new component(30, 50, 'blue', 950, 250, Infinity, 'fountain'));
    objects.push(new component(30, 50, 'hotpink', 50, 350, Infinity, 'fountain'));
    background.push(new component(0, 0, 'lightgray', -300, 0, Infinity, 'clouds'));
    background.push(new component(0, 0, 'lightgray', -300, 0, Infinity, 'mountains'));
  }

  if(levelNum == 11){
    objects.push(new component(1000, 500, 'lightblue', 1, 1, 'grey', 'rain'));
    objects.push(new component(30, 50, 'yellow', 850, 350, Infinity, 'spawnpoint'));
    objects.push(new component(400, 100, 'saddlebrown', 600, 400, Infinity, 'ground'));
    objects.unshift(new component(40, 10, 'teal', 620, 390, 200, 'stickyButton'));
    objects.push(new component(100, 20, 'teal', 400, 380, Infinity, 'antiBarrier'));
    objects.push(new component(100, 300, 'saddlebrown', 200, 360, Infinity, 'ground'));
    objects.push(new component(30, 50, 'blue', 250, 310, Infinity, 'fountain'));
    objects.push(new component(30, 50, 'forestgreen', 950, 350, Infinity, 'fountain'));
    background.push(new component(0, 0, 'lightgray', -300, 0, Infinity, 'clouds'));
    background.push(new component(0, 0, 'lightgray', -300, 0, Infinity, 'mountains'));
  }

  if(levelNum == 12){
    objects.push(new component(1000, 500, 'lightblue', 1, 1, 'grey', 'rain'));
    objects.push(new component(30, 50, 'yellow', 850, 350, Infinity, 'spawnpoint'));
    objects.push(new component(15, 15, 'chocolate', 544, 90, Infinity, 'box'))
    objects.unshift(new component(40, 10, 'green', 200, 390, Infinity, 'holdButton'));
    objects.unshift(new component(40, 10, 'orange', 270, 390, Infinity, 'holdButton'));
    objects.unshift(new component(40, 10, 'teal', 30, 390, Infinity, 'holdButton'));
    objects.push(new component(25, 25, 'saddlebrown', 0, 380, Infinity, 'ground'));
    objects.push(new component(50, 10, 'green', 500, 100, Infinity, 'barrier'));
    objects.push(new component(50, 10, 'orange', 550, 100, Infinity, 'barrier'));
    objects.push(new component(15, 150, 'teal', 85, 215, Infinity, 'barrier'));
    objects.push(new component(100, 20, 'saddlebrown', 0, 215, Infinity, 'ground'));
    objects.push(new component(30, 50, 'orange', 500, 350, Infinity, 'fountain'));
    objects.push(new component(30, 50, 'blue', 50, 305, Infinity, 'fountain'));
    objects.push(new component(1000, 20, 'saddlebrown', 0, 400, Infinity, 'ground'));
    objects.push(new component(100, 30, 'saddlebrown', 0, 355, Infinity, 'ground'));
    background.push(new component(0, 0, 'lightgray', -300, 0, Infinity, 'clouds'));
    background.push(new component(0, 0, 'lightgray', -300, 0, Infinity, 'mountains'));
  }

  if(levelNum == 13){
    // objects.push(new component(1000, 500, 'rgb(30, 0, 30)', 1, 1, Infinity, 'night'));
    
    
    objects.push(new component(1000, 30, 'gray', 0, 480, Infinity, 'ground'));
    objects.push(new component(80, 10, 'gray', 50, 390, 130, 'platform'));
    objects.push(new component(80, 10, 'gray', 800, 340, 100, 'platform'));
    objects.push(new component(80, 10, 'gray', 600, 280, 120, 'platform'));
    objects.push(new component(100, 20, 'gray', 450, 220, Infinity, 'ground'));
    objects.push(new component(30, 50, 'yellow', 850, 430, Infinity, 'spawnpoint'));
    objects.push(new component(20, 500, 'purple', -15, 0, Infinity, 'portal'))
    objects.push(new component(20, 500, 'purple', 995, 0, Infinity, 'portal'))
    objects.push(new component(30, 50, 'blue', 500, 170, Infinity, 'fountain'));
    background.push(new component(1000, 500, 'rgb(30, 0, 30', 0, 0, Infinity, 'rect'))
    for(var i = 0; i < 500; i++){
      background.push(new component(2, 2, 'white', 1, 1, Infinity, 'particle8'))
    }
    background.push(new component(0, 0, 'lightgray', -300, 0, Infinity, 'mountains'));
    
  }

  if(levelNum == 14){
    objects.push(new component(0,40,'purple',8,42,NaN,'portal'));
    objects.push(new component(8,42,'purple',993,229,NaN,'portal'));
    objects.push(new component(500,20,'brown',330,300,NaN,'fallingPlatform'));
    objects.push(new component(300,200,'gray',6,400,NaN,'ground'));
    objects.push(new component(150,400,'gray',850,270,NaN,'ground'));
    objects.push(new component(30,50,'yellow',50,350,Infinity,'spawnpoint'));
    objects.push(new component(30,50,'purple',200,350,Infinity,'fountain'));
    objects.push(new component(30,50,'blue',900,220,Infinity,'fountain'));
    objects.push(new component(10,233,'gray',990,-3,NaN,'ground'));
    objects.push(new component(7,533,'gray',0,-3,NaN,'ground'));
    background.push(new component(1000, 500, 'rgb(30, 0, 30', 0, 0, Infinity, 'rect'))
    for(var i = 0; i < 500; i++){
      background.push(new component(2, 2, 'white', 1, 1, Infinity, 'particle8'))
    }
    background.push(new component(0, 0, 'lightgray', -300, 0, Infinity, 'mountains'));

    
  }

  if(levelNum == 15){

    objects.push(new component(30,50,'yellow',35,269,Infinity,'spawnpoint'));
    objects.push(new component(16,16,'maroon',522,351,NaN,'enemy'));
    objects.push(new component(784,92,'saddlebrown',105,408,NaN,'ground'));
    objects.push(new component(108,191,'saddlebrown',-2,319,NaN,'ground'));
    objects.push(new component(110,209,'saddlebrown',889,299,NaN,'ground'));
    objects.push(new component(1,1,'blue',945,298,NaN,'fountain'));
    objects.push(new component(16,16,'maroon',220,351,NaN,'enemy'));
    objects.push(new component(16,16,'maroon',801,353,NaN,'enemy'));
    background.push(new component(1000, 500, 'rgb(30, 0, 30', 0, 0, Infinity, 'rect'))
    for(var i = 0; i < 500; i++){
      background.push(new component(2, 2, 'white', 1, 1, Infinity, 'particle8'))
    }
    background.push(new component(0, 0, 'lightgray', -300, 0, Infinity, 'mountains'));

  }
  
  if(levelNum == 'easterEgg'){
    document.getElementById("audio").pause();
    document.getElementById("audioEgg").play();
    objects.push(new component(1, 1, 'purple', 400, 200, 'BENJAMIN ROCKS', 'text'))
    objects.push(new component(1000, 100, 'saddlebrown', 0, 400, Infinity, 'ground'));
    objects.push(new component(30, 50, 'purple', 500, 400, Infinity, 'fountain'));
    objects.push(new component(20, 500, ['blue','purple','red'], -20, 0, 'return', 'loadZone'));

  }

  if(levelNum == 'easterEgg1'){
    document.getElementById("audio").pause();
    document.getElementById("audioEgg2").play();
    objects.push(new component(1000, 20, 'saddlebrown', 0, 0, Infinity, 'ground'));
    objects.push(new component(1000, 100, 'saddlebrown', 0, 400, Infinity, 'ground'));
    objects.push(new component(20, 500, 'saddlebrown', 0, 0, Infinity, 'ground'));
    objects.push(new component(20, 500, 'saddlebrown', 980, 0, Infinity, 'ground'));
    objects.push(new component(30, 50, 'black', 500, 400, Infinity, 'fountain'));
    objects.push(new component(5, 500, ['blue','purple','red', 'black'], 970, 0, 1, 'loadZone'));

  }

  if(levelNum == 'easterEgg2'){
    document.getElementById("audio").pause();
    document.getElementById("audioEgg3").play();
    objects.push(new component(1000, 20, 'saddlebrown', 0, 0, Infinity, 'ground'));
    objects.push(new component(1000, 20, 'saddlebrown', 0, 400, Infinity, 'ground'));
    objects.push(new component(20, 500, 'saddlebrown', 0, 100, Infinity, 'ground'));
    objects.push(new component(20, 500, 'saddlebrown', 980, 0, Infinity, 'ground'));
    objects.push(new component(10, 10, 'tan', 500, 300, Infinity, 'easterCube'));
    objects.push(new component(5, 500, ['blue','purple','red', 'black'], 0, 0, 'return', 'loadZone'));

  }

  
}




