//declaracion de variables
var rocket, rocketlit, rocketoff;
var meteor, meteorGroup;
var meteor1Img, meteor2Img, meteor3Img;
var planet, planetGroup;
var planet1Img, planet2Img;
var bcg, bcgImg;
var gamestate= "PLAY";
var score= 0;
var pd= 0;
var invbarrier1, invbarrier2;
var restartbutton, restartImg;
var planetcollsound, gameoversound, ambiencesound;

function preload(){
 //carga de imagenes 
 rocketoff=loadImage("images/rocketstaticv2.png");
 rocketlit= loadImage("images/rocketflyingv2.png"); 
 bcgImg= loadImage("images/spacebcg4.png"); 
 meteor1Img= loadImage("images/meteor1.2.png");
 meteor2Img= loadImage("images/meteor2.2.png"); 
 meteor3Img= loadImage("images/meteor3.2.png");
 planet1Img= loadImage("images/planet1.2.png");
 planet2Img= loadImage("images/planet2.2.png"); 
 restartImg= loadImage("images/resetbutton1.png"); 
  
 //cargo los sonidos del juego
 planetcollsound= loadSound("sound/mixkit-arcade-retro-jump-223.wav"); 
 gameoversound= loadSound("sound/mixkit-ominous-drums-227.wav"); 
 ambiencesound= loadSound("sound/Ambiencesound2.wav"); 
}

function setup() {
 createCanvas(displayWidth,displayHeight); //640,640

 //sprite del fondo
 bcg= createSprite(displayWidth/2,displayHeight);//320,220
 bcg.addImage("space", bcgImg);
 bcg.velocityY=(3 +score/500); 
  
 console.log; 
  
 //sprite del cohete 
 rocket= createSprite(displayWidth/2,displayHeight-400,10,10);//320,320
 rocket.addImage("rocket", rocketoff);
 rocket.scale= 0.2;  
  
 //AUN POR ARREGLAR Y CONFIGURAR 
 rocket.setCollider("rectangle",0,0,15,40);
 rocket.debug= false;
  
 //barreras invisibles
 invbarrier1= createSprite(displayWidth/2-320,320,20,640);//10,320
 invbarrier1.visible= false;
 invbarrier1.depth= rocket.depth; 
 
 invbarrier2= createSprite(displayWidth/2+320,320,20,640);//630,320
 invbarrier2.visible= false;
 invbarrier2.depth= rocket.depth; 
  
 //boton de reinicio
 restartbutton= createSprite(displayWidth/2,displayHeight/2);//320,320
 restartbutton.addImage(restartImg); 
 restartbutton.scale= 0.1; 

 //creacion de grupos 
 meteorGroup= new Group();
 planetGroup= new Group();  
}

function draw() {
 background("white");
  
 if(gamestate== "PLAY"){ 
   //si activas el sonido continuo, el juego se traba
   //ambiencesound.loop();
   
   //repeticion del fondo de acuerdo a su posicion
   if(bcg.y>640){
      bcg.y= bcg.width/100;
      //bcg.y= displayHeight/100; 
   }
   
   //configuracion del puntaje numero 1
   score = score + Math.round(getFrameRate()/10);
   
   restartbutton.visible= false;
   
   
   //condiciono movimiento y animacion del cohete
   if(keyDown("left_arrow")){
     rocket.x= rocket.x-9.5;
     //if(frameCount%150 == 0){
       //rocket.x= rocket.x-2; //0.2
     //}
     rocket.addImage("rocket", rocketlit);
   }
   if(keyWentUp("left_arrow")){
     rocket.addImage("rocket", rocketoff);
   }
   if(keyDown("right_arrow")){
     rocket.x= rocket.x+9.5;
     //if(frameCount%150 == 0){
      //rocket.x= rocket.x+2; //0.2
     //}
     rocket.addImage("rocket", rocketlit);
   } 
   if(keyWentUp("right_arrow")){
     rocket.addImage("rocket", rocketoff)
   } 
     
   //aparezco planetas y meteoros
   spawnmeteors();
   spawnplanets(); 
   
   drawSprites();  

   console.log(displayWidth+","+displayHeight);
   text(mouseX+","+mouseY,mouseX,mouseY);
   
   //configuracion de puntaje numero dos
   if(planetGroup.isTouching(rocket)){
     planetGroup.destroyEach();
     pd= pd +1;
     planetcollsound.play();
   }
   
   //condicion del final del juego
   if(meteorGroup.isTouching(rocket)){
     //no quitar de comentarios a menos que hayas quitado la line 76 tambien
     //ambiencesound.stop();
     meteorGroup.destroyEach(); 
     gameoversound.play();
     gamestate= "END";
   }   
}  else if(gamestate== "END"){
     rocket.velocityY= 0;
     bcg.velocityY=0;
     meteorGroup.setVelocityYEach(0);
     planetGroup.setVelocityYEach(0);
     meteorGroup.setLifetimeEach(-1);
     planetGroup.setLifetimeEach(-1);
     restartbutton.visible= true;
  
     drawSprites();
   
     //texto de sistema de puntaje final 
     fill("lightgrey");
     textFont("fantasy");
     textSize(40);   
     text("GAME OVER", displayWidth/2-90,270);  //230,220
     text("Score: "+score*pd/2, displayWidth/2-90,305);  //230,255
   
     //presiona el mouse sobre el boton para reiniciar
     if(mousePressedOver(restartbutton)){
       reset();
     }   
}
  
   
 //colision del cohete con las barreras invisibles
   rocket.collide(invbarrier1);
   rocket.collide(invbarrier2);   

 //textos de score
 textFont("classic"); 
 fill("white"); 
 textSize(20); 
 text("Distance traveled:  "+score, displayWidth/2-300, 30);//----------------------
 text("Planets discovered:  "+pd, displayWidth/2-300,60);  //-----------------------
}

//funcion de los meteoros
function spawnmeteors(){
  if(frameCount%50 == 0){
   meteor= createSprite(Math.round(random(453,933)),-100);
   meteor.scale= 0.2; 
   meteor.velocityY= (5+ score/500);
   meteor.lifetime=200;
   
   var rand= Math.round(random(1,3));
   if(rand== 1){
     meteor.addImage(meteor1Img);
   } else if(rand== 2){
     meteor.addImage(meteor2Img);
   } else {
     meteor.addImage(meteor3Img);
   }
   meteorGroup.add(meteor);   
  }
}

//funcion de los planetas
function spawnplanets(){
 if(frameCount%130 == 0){ 
   planet= createSprite(Math.round(random(453,933)),-100);  //Math.round(random(50,590))
   planet.scale=0.2;
   planet.velocityY= (4+score/500);  
   planet.lifetime= 200;  
   planet.depth= +1;
  
   var rand2= Math.round(random(1,2));
   if(rand2== 1) {
      planet.addImage(planet1Img);
   } else{
      planet.addImage(planet2Img);
   }
   planetGroup.add(planet);
  }
}

//funcion de reinicio
function reset(){
  //visibilidad del boton de reinicio
  restartbutton.visible= false;
  
  //reinicio del sistema de puntaje
  score= 0;
  pd= 0;
  
  //reinicio de la velocidad del fondo
  bcg.velocityY= (3+score/500);
  
  //reinicio de la posicion del cohete
  rocket.x=displayWidth/2; //320
  rocket.y=displayHeight-400; //320

  
  planetGroup.destroyEach();
  
  gamestate="PLAY";
}