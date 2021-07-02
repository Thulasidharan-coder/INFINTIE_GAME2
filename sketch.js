var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;
var gameOverImg,restartImg

var jumpSound , checkPointSound, dieSound,gunSound,monsterSound
function preload(){
  trex_running = loadAnimation("trex1.png","trex2.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")

  gunSound=loadSound("gunfire.mp3");
  monsterSound=loadSound("monster.mp3");
 // jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.wav")
}

function setup() {
  createCanvas(windowWidth,windowHeight);

  var message = "This is a message";
 console.log(message)
  
  trex = createSprite(50,500,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  

  trex.scale = 0.4;
  
  ground = createSprite(200,800,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  gameOver = createSprite(900,400);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(875,555);
  restart.addImage(restartImg);
  
 
  gameOver.scale = 1.5;
  restart.scale = 0.5;
  
  invisibleGround = createSprite(200,840,400,10);
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();

  
 trex.setCollider("rectangle",45,50,trex.width,trex.height);
  trex.debug = false
  
  score = 0;
  
}

function draw() {
  
  background("skyblue");
  //displaying score
  fill("red");
  textSize(30);
  text("Score: "+ score, 800,50);
  fill("BLUE");
  textSize(20);
  text("PRESS SPACE KEY FOR START YOUR GAME AND KILL ROBOT ENEMY",520,80);
  
  if(gameState === PLAY){

    gameOver.visible = false;
    restart.visible = false;
    
    ground.velocityX = -(20+ 3* score/200)
    //scoring
    score = score + Math.round(getFrameRate()/60);
    
    if(score>0 && score%100 === 0){
       checkPointSound.play() 
    }
    
    if (ground.x > 500){
      ground.x = ground.width/2;
    }
    
    //jump when the space key is pressed
    if(keyDown("space")&& trex.y >= 100) {
        //trex.velocityY = -14;
        monsterSound.play();
        gunSound.play();
        obstaclesGroup.destroyEach();
    }
    
    //add gravity
    trex.velocityY = trex.velocityY + 1
  
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex)){
        //trex.velocityY = -12;
        //jumpSound.play();
        gameState = END;
        dieSound.play()
      
    }
  }
   else if (gameState === END) {
      gameOver.visible = true;
      restart.visible = true;
     
     //change the trex animation
      trex.changeAnimation("collided", trex_collided);
    
     
     
      ground.velocityX = 0;
      trex.velocityY = 0
      
     //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     if(mousePressedOver(restart)){
       reset();
     }
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);    
   }
  
 
  //stop trex from falling down
  trex.collide(invisibleGround);
  

  drawSprites();
}
function reset(){
  gameState=PLAY;
  gameOver.visible=false;restart.visible=false;
  trex.changeAnimation("running",trex_running);
  score=0;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
}




function spawnObstacles(){
 if (frameCount % 40 === 0){
   var obstacle = createSprite(650,800,10,40);
   obstacle.velocityX = -(20 + score/100);
   
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(1650,170,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 500;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
}

