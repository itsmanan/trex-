var PLAY = 1;
var END = 0;
var gamestate = PLAY;

var trex, trex_running,ground;
var ground, groundimage;
var trex_collided;

var invisibleground;
var cloud,cloudsgroup;
var cloudImage;
var obstaclegroup,obstacle1,obstacle2,obstacle3,obstacle4,obstacle5,obstacle6;
var score;
var gameover,gameoverimage;
var restart,restartimage;
var jumpsound,diesound;

function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  groundimage = loadImage("ground2.png");
  cloudImage = loadImage("cloud.png");
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  trex_collided = loadAnimation("trex_collided.png");
  gameoverimage = loadImage("gameOver.png");
  restartimage = loadImage("restart.png");
  jumpsound = loadSound("jump.mp3");
  diesound = loadSound("die.mp3");
  
}


function setup() {
  createCanvas(600,200);
  //creating a sprite for trex
  trex = createSprite(50,160,20,50);
  
  //adding scale and position to trex
  trex.scale = 0.5;
  trex.x = 50;
  
  trex.addAnimation("running",trex_running);
  trex.addAnimation("collided",trex_collided);
  //creating ground sprite
  
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundimage);
  ground.x=ground.width/2;
  
  
  //creating invsible ground
  
  invisibleground = createSprite(200,190,400,10);
  invisibleground.visible=false;
  
  
  gameover = createSprite(300,100);
  gameover.addImage(gameoverimage);
  restart  = createSprite(300,140);
  restart.addImage(restartimage); 
  gameover.scale = 0.5;
  restart.scale = 0.5;
  
  
  //create obstacles and cloud group
  obstaclegroup = new Group();
  cloudsgroup = new Group();
  
  //trex.debug = true;
  //trex.setCollider("rectangle",0,0,400,trex.height);
  trex.debug = true;
  trex.setCollider("circle",0,0,40);
  score = 0;
  
  
  
  
  
  }




function draw() {
  background(180);
  
  
  text("Score: " +score,500,50);
  
  
  if (gamestate === PLAY){
     //move the ground
     ground.velocityX = -(6+score/100);
    //scoring
    score = score + Math.round(frameCount/100);
    //reseting the ground
      if (ground.x<0){
      ground.x = ground.width/2;
      }
       // to make him jump
    if (keyDown("space") && trex.y >= 150){
    trex.velocityY = -10;
    jumpsound.play();
  }
  
  
    // to create gravity
    trex.velocityY = trex.velocityY + 0.8;
    
    spawnClouds();
  
    spawnobstacles();
    
    if (obstaclegroup.isTouching(trex)){
    //trex.velocityY = -10;
    diesound.play();
    gamestate = END;
    }
    gameover.visible = false;
    restart.visible = false;
  
  }
    
    
    else if(gamestate === END){
      //to stop the ground
      ground.velocityX = 0;
      //to stop trex 
      trex.velocityY = 0;
      //to stop the obstacles and  make them not dissapear
      obstaclegroup.setVelocityXEach(0);
      cloudsgroup.setVelocityXEach(0);
      obstaclegroup.setLifetimeEach(-1);
      cloudsgroup.setLifetimeEach(-1);
      //to change the trex animation
      trex.changeAnimation("collided",trex_collided);
      gameover.visible = true;
      restart.visible = true;
      
      if (mousePressedOver(restart)){
        reset();
      }
     
    }
    
  
  
  
  

  
 
  // to stop trex from falling down
  trex.collide(invisibleground);
  
  
  drawSprites();
}

function spawnClouds(){
  
  if(frameCount%60 === 0){
    cloud = createSprite(600,100,40,10);
    cloud.addImage(cloudImage)
    cloud.velocityX = -(6+score/100);
    cloud.y = Math.round(random(80,120));
    cloud.scale = 0.5;
    
    cloud.depth = trex.depth;
    trex.depth = trex.depth+1;
    
    
    //assigning liffetime to the clouds
    cloud.lifetime = 200;
    
    //adding group to clouds
    cloudsgroup.add(cloud);
    
  }
}

function spawnobstacles(){
 if(frameCount%60 === 0){
   var obstacle = createSprite(600,165,10,40);
   obstacle.velocityX = -(6+score/100);
   //generate random numbers
   var rand = Math.round(random(1,6));
   switch (rand){
       case 1 : obstacle.addImage(obstacle1); 
      break;
       case 2 : obstacle.addImage(obstacle2); 
       break;
       case 3:   obstacle.addImage(obstacle3);
       break;
       case 4 : obstacle.addImage(obstacle4); 
       break;
       case 5 : obstacle.addImage(obstacle5); 
       break;
       case 6 : obstacle.addImage(obstacle6);
       break;
       default:break;
       
   
   }
   obstacle.scale = 0.5;
   obstacle.lifetime = 200;
   
   
   //to make it seem as the trex is going over the cactus
   obstacle.depth = trex.depth;
   trex.depth = trex.depth+1;
   
   //add each obstacle to the group
   
   obstaclegroup.add(obstacle);
 }
}
function reset(){
  gamestate = PLAY;
  gameover.visible = false;
  restart.visible = false;
  obstaclegroup.destroyEach();
  cloudsgroup.destroyEach();
  trex.changeAnimation("running",trex_running);
  score = 0;
}

