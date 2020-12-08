var elephant, elephant_running;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage, restartImage, gameOver, gameOverImage, restart;

var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score, gameState;

var health, h1;


function preload(){
  elephant_running = loadImage("elephant.png");
  
  groundImage = loadImage("grass.png");
  
  cloudImage = loadImage("clipart-cloud-6.png");
  
  restartImage = loadImage("restart.png");
  gameOverImage = loadImage("gameOver.png");
  
  obstacle1 = loadImage("tree1.png");
  obstacle2 = loadImage("tree2.png");
  obstacle3 = loadImage("tree3.png");
}

function setup() {
  createCanvas(600, 200);
  
  elephant = createSprite(width/2,180,20,50);
  elephant.addImage(elephant_running)
  elephant.scale = 0.15;
  elephant.velocityX = 14;
  
  ground = createSprite(200,350,400,20);
  ground.addImage(groundImage);
  ground.scale = 5
  ground.x = ground.width /2;
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  gameOver = createSprite(300, 100);
  gameOver.addImage("gameOver", gameOverImage);
  gameOver.scale = 0.7;
  gameOver.visible = false;
  
  restart = createSprite(300, 140);
  restart.addImage("restart", restartImage);
  restart.scale = 0.6;
  restart.visible = false;


  
 
  
  score = 0;
  
  gameState = "play";

  health = 100;
}

function draw() {
  background(255);
  

  gameOver.x = camera.x;
  restart.x = camera.x;





  if (gameState === "play"){
    score = score + Math.round(getFrameRate()/60);
    elephant.velocityY = elephant.velocityY + 1;



    elephant.depth = ground.depth +1;
    
    if((keyDown("space") || keyDown(UP_ARROW)) && elephant.y >= 150) {
    elephant.velocityY = -14;
    }
      
    invisibleGround.x = camera.x
    
    if (frameCount % 80 === 0 && frameCount >= 50){
    ground.x = camera.x + width/2;
  }
      
    spawnClouds();
    spawnObstacles();
      
    if (elephant.isTouching(obstaclesGroup)){
      health -= 10;
    }

    if (health <= 0){
      gameState = "end";
    }
      
    camera.x = elephant.x;
  
    
  } else if (gameState ==="end"){
    elephant.velocityX = 0;
    elephant.velocityY = 0;
    
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    elephant.changeAnimation("collided");
    
    gameOver.visible = true;
    restart.visible = true;
    
    restart.depth = obstaclesGroup.maxDepth() + 1;
    
    if (mousePressedOver(restart)){
      reset(); 
    }
    
  }
  
  textSize(20)
  var textLocation = camera.x + 150;
  
  text("Score: "+ score, textLocation, 20);
  
  
  
  
  
  
  
  elephant.collide(invisibleGround);
  
  drawSprites();

  text("Health: " + health, camera.x - 280, 20);
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 30 === 0) {
    var cloud = createSprite(camera.x + width/2,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.05;
    cloud.velocityX = 3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = elephant.depth;
    cloud.depth = ground.depth - 1;
    elephant.depth = elephant.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  randCount = Math.round(random(55, 60));
  if(frameCount % randCount === 0) {
    var obstacle = createSprite(camera.x + width/2,165,10,40);
    //obstacle.velocityX = -4;
    
    //generate random obstacles
    var rand = Math.round(random(1,3));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.05;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = "play";
  elephant.velocityX = 14;
  elephant.x = width/2
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach(); 
  
  gameOver.visible = false;
  restart.visible = false;
  
  score = 0;
  
  elephant.changeAnimation("running");

  ground.x = 200;

  health = 100;
}

function mousePressed(){
  elephant.velocityY = -14;
}