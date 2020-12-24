//Create variables here
var dog, dogImg, happyDogImg, database, foodS, foodStock, feedButton, addButton, fedTime, lastFed, foodObj, bedroomImg, gardenImg, washroomImg, gameState, readState;

function preload(){
  //load images here
  dogImg = loadImage("images/Dog.png");
  happyDogImg = loadImage("images/happy dog.png");
  bedroomImg = loadImage("images/Bed Room.png");
  gardenImg = loadImage("images/Garden.png");
  washroomImg = loadImage("images/Wash Room.png");
}

function setup() {
  database = firebase.database();
  createCanvas(500, 500);
  foodStock = database.ref('Food');
  foodStock.on('value', readStock);
  dog = createSprite(250,200,50,50);
  dog.addImage(dogImg);
  //dog.addImage(happyDogImg);
  dog.scale = 0.35;
  foodObj = new Food();
  feedButton = createButton("Feed the dog");
  feedButton.position(600,95);
  feedButton.mousePressed(feedDog);

  addButton = createButton("Add food");
  addButton.position(700,95);
  addButton.mousePressed(addFoods);

  readState = database.ref('gameState');
  readState.on("value", function(data){
    gameState = data.val();
  });
}


function draw() {
  //add styles here
  foodObj.display();
  dog.display();

  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });
 
  fill(255,255,254);
  textSize(15)

  currentTime = hour();
  if(currentTime === (lastFed)){
    update("Playing");
    foodObj.garden();
  }
  else if(currentTime === (lastFed + 2)){
    update("Sleeping");
    foodObj.garden();
  }
  else if(currentTime>(lastFed + 2) && currentTime <= (lastFed + 4)){
    update("Bathing");
    foodObj.washroom();
  }
  else{
    update("Hungry");
    foodObj.display();
  }
  drawSprites();
  text(foodS, 250, 330, fill(255));
}

function readStock(data){
  foodS = data.val();
}

function writeStock(x){
  if(x<0){
    x=0;
  }
  else{
    x=x-1;
    }
    database.ref('/').update({Food:x});
  }

  function feedDog(){
    dog.addImage(happyDogImg);
    foodObj.updateFoodStock(foodObj.getFoodStock()-1);
    database.ref('/').update({
      Food:foodObj.getFoodStock(),
      FeedTime:hour()
    })
  }

  function addFoods(){
    foodS++;
    database.ref('/').update({
      Food:foodS
    })
  }

  function update(state){
    database.ref('/').update({
      gamesState:state
    });
  }