/*
VOICE MESSAGE HANDLING


!!!!!!!!!!!!!!!!!!!
IMPORTANT: za lažje testiranje se trenutno voice msg zacne on key down in ustavi on key up
DRŽI SPACE == IGRAJ MSG!
!!!!!!!!!!!!!!!!!!!


startVoiceMsg -> zance igrati sound. location doloci kasken sound bo igral
  - "start" -> navodila za uporabo govorilnice
  - "near" -> slovenski voice messagi
  - "far" -> angleški voice messagi

stopVoiceMsg -> ce poslusalec odlozi slusalko prehitro se pauzira voice msg z fadom

TODO:
- [ ] pogruntaj če bi kam dala voice messege, ki niso v slovenscini? ali jih sploh hocema?
- [ ] naredi array selection 0-exclusive in naj se potem shuffla zadnji selected thing vedno v 0-position
- [x] fadaj zvok, ko pauziras voice message //done ampak kinda shady
- [ ] testiraj performance na tablici
- [ ] vizualizacija/risanje vsakega zvocnega efekta
- [ ] menjaj space up/down tako kot mora bit
- [x] menjaj voice message na podlagi tega kje smo
*/

// VOICE STUFF
//#region SOUND
var voicePlaying = false;
var currentSound;
let graphics;
var stroke_col = "#" + Math.floor(Math.random()*16777215).toString(16);
var stroke_width;
var perturbation;

function startVoiceMsg() {


  if (voicePlaying == false) {

    console.log("voice msg was started")
    voicePlaying = true;
    stroke_width = map(Math.random(), 0, 1, 1, 8);
    stroke_col = "#" + Math.floor(Math.random()*16777215).toString(16);
    perturbation =  (Math.random() < 0.5 ? -1 : 1) * map(Math.random(), 0, 1, 30, 75);
    pdy = map(Math.random(), 0, 1, 0, 0.1);

    console.log("Location is ", location)

    //zberi pravilen sound
    if (distance < 0) {
      currentSound = startSound
    } else if (distance < 2)
      currentSound = random(sloArray)
    else if (distance < 3)
      currentSound = random(engArray)


    // začni igrait current sound
    currentSound.setVolume(1);
    currentSound.play();
  }
}

function stopVoiceMsg() {
  voicePlaying = false;
  currentSound.setVolume(0, 0.5);
  setTimeout(() => {
    currentSound.pause()
  }, 500);
}

let startSound;
let slo1, slo2, slo3, slo4, slo5, slo6, slo7;
let sloArray;
let eng1, eng2, eng3, eng4, eng5, eng6, eng7, eng8, eng9, eng10, eng11, eng12;
let engArray;

var amp;

function preload() {
  console.log("preloading")
  worldPreload();

  soundFormats('mp3');
  startSound = loadSound('assets/start', onSoundLoadSuccess, onSoundLoadError, onSoundLoadProgress);
  //load slo sounds
  slo1 = loadSound('assets/slo/eva1', onSoundLoadSuccess, onSoundLoadError, onSoundLoadProgress);
  slo2 = loadSound('assets/slo/eva2', onSoundLoadSuccess, onSoundLoadError, onSoundLoadProgress);
  slo3 = loadSound('assets/slo/eva3', onSoundLoadSuccess, onSoundLoadError, onSoundLoadProgress);
  slo4 = loadSound('assets/slo/luka1', onSoundLoadSuccess, onSoundLoadError, onSoundLoadProgress);
  slo5 = loadSound('assets/slo/luka2', onSoundLoadSuccess, onSoundLoadError, onSoundLoadProgress);
  sloArray = [slo1, slo2, slo3, slo4, slo5]
  //load eng sounds

  //load eng sounds
  eng1 = loadSound('assets/eng/fer', onSoundLoadSuccess, onSoundLoadError, onSoundLoadProgress);
  eng2 = loadSound('assets/eng/lucas1', onSoundLoadSuccess, onSoundLoadError, onSoundLoadProgress);
  eng3 = loadSound('assets/eng/marie1', onSoundLoadSuccess, onSoundLoadError, onSoundLoadProgress);
  eng4 = loadSound('assets/eng/marie2', onSoundLoadSuccess, onSoundLoadError, onSoundLoadProgress);
  eng5 = loadSound('assets/eng/mathias1', onSoundLoadSuccess, onSoundLoadError, onSoundLoadProgress);
  eng6 = loadSound('assets/eng/rebecca', onSoundLoadSuccess, onSoundLoadError, onSoundLoadProgress);
  eng7 = loadSound('assets/eng/sarah1', onSoundLoadSuccess, onSoundLoadError, onSoundLoadProgress);
  eng8 = loadSound('assets/eng/sarah2', onSoundLoadSuccess, onSoundLoadError, onSoundLoadProgress);
  eng9 = loadSound('assets/eng/sarah3', onSoundLoadSuccess, onSoundLoadError, onSoundLoadProgress);
  eng10 = loadSound('assets/eng/simo1', onSoundLoadSuccess, onSoundLoadError, onSoundLoadProgress);

  engArray = [eng1, eng2, eng3, eng4, eng5, eng6, eng7, eng8, eng9, eng10]
}

function onSoundLoadSuccess(e) {
  //console.log("load sound success", e);
}
function onSoundLoadError(e) {
  console.log("load sound error", e);
}
function onSoundLoadProgress(e) {
  //console.log("load sound progress", e);
}
//#endregion


// PROCESSING STUFF
//#region processing
var canv_side = 512;
function setup() {
  console.log("blabla")
  frameRate(20);
  //angleMode(DEGREES);
  createCanvas(canv_side, canv_side);
  pixelDensity(1);
  graphics = createGraphics(canv_side, canv_side);

  s = min(width, height);

  strokeWeight(5);
  //stroke(lineColor);
  stroke(255, 255, 0, 50);

  amp = new p5.Amplitude();


  worldSetup();
  //startVoiceMsg()

  //sound playing stuff
}

var prev_vol;
var prev_x;
var prev_y;
let pdy=0;
var curr_x;
var curr_y;
var dx;
var dy;
var prev_dx;
var prev_dy;

let angle = 0;
var r;

var amps = [];

function draw() {
  clear();
  worldDraw();

  //linije
  graphics.stroke(stroke_col);
  graphics.strokeWeight(stroke_width);
  graphics.noFill();
  var curr_vol = amp.getLevel();

  if(voicePlaying){
    r = map(curr_vol, 0, 1, 100, 250) + noise(curr_vol) * 50;
    //graphics.translate(width/3, height/3);
    if(prev_vol == null){
      prev_vol = 10*noise(sin(TWO_PI/(Math.random()*10)),cos(TWO_PI/(Math.random()*5)),pdy);
      //prev_y = map(noise(cos(prev_vol*TWO_PI)),0,1,0,100);
      prev_y = prev_vol*sin(pdy) + Math.random() * 5 + height/2 + perturbation;
      prev_x = prev_vol*cos(pdy) + width/2 + perturbation;
  
      //curr_y = map(noise(curr_vol), 0, 1, height/2, 0);
      //curr_x = 100*noise(pdy) + Math.random()*50;
      curr_y = r * sin(pdy+0.01) + height/2 + r*noise(pdy) + perturbation;
      curr_x = r * cos(pdy+0.01) + width/2 + r*noise(pdy) + perturbation;
      //graphics.line(prev_x, prev_y, curr_x, curr_y);
      prev_vol = curr_vol;
      prev_x = curr_x;
      prev_y = curr_y;
    }
    else{
      //curr_y = map(noise(curr_vol), 0, 1, height/2, 0) + Math.random()*50;
      //curr_x = 100*noise(pdy) + Math.random() * 100;
      curr_y = r * sin(pdy) + height/2 + r*noise(pdy) + perturbation;
      curr_x = r * cos(pdy) + width/2 + r*noise(pdy) + perturbation;
      graphics.line(prev_x, prev_y, curr_x, curr_y);
      prev_vol = curr_vol;
      prev_x = curr_x;
      prev_y = curr_y;
    }
    pdy+=0.05;
  }
  
  console.log(curr_vol);
  image(graphics, 0, 0);

  if (keyWentDown("space")) {
    console.log("space down!")
    startVoiceMsg()
  }
  if (keyWentUp("space"))
    stopVoiceMsg();
  


}



//second experiment - lines
function drawStream() {
  nx = 0;
  var loc_i = 0;
  for (let i = 0; i < canv_side / 3; i += fldSize) {
    ny = 0;
    var loc_j = 0;
    for (let j = 0; j < canv_side / 3; j += fldSize) {
      var angle = map(noise(nx, ny, nz), 0, 2.0, 0, piMult * PI);
      var x = ampMultX * cos(angle);
      var y = ampMultY * sin(angle);
      line(loc_i + 55, loc_j + 55, loc_i + 55 + x, loc_j + 55 + y);
      ny += 0.03;

      //gradient
      //var c = map(angle, 0, PI, 0, TWO_PI)
      //stroke(c,50,80);
      loc_j += fldSize + 15;
    }
    nx += 0.02;
    loc_i += fldSize + 15;
  }
  nz += oscTempo; //tempo
}
//#endregion

// BRINOV WORKSPACE DONT TOUCH
let imgTwo, imgFour, imgSix, imgEight;
let sLeft, sUp, sRight, sDown;
function worldPreload() {
  imgTwo = loadImage("assets/sprites/two.png")
  imgFour = loadImage("assets/sprites/four.png")
  imgSix = loadImage("assets/sprites/six.png")
  imgEight = loadImage("assets/sprites/eight.png")
}

var pos;
var startPos;
var distance = 0; //distance from start pos


var wWidth = 3;
var wHeight = 3;
function worldSetup() {
  pos = createVector(1, 1)
  console.log(pos.x)

  sLeft = createSprite(32, 256)
  sLeft.addImage(imgFour)
  sLeft.scale = 3
  sUp = createSprite(256, 32)
  sUp.addImage(imgTwo)
  sUp.scale = 3
  sRight = createSprite(480, 256)
  sRight.addImage(imgSix)
  sRight.scale = 3
  sDown = createSprite(256, 480)
  sDown.addImage(imgEight)
  sDown.scale = 3

  setVideoOpacities();
}


function worldDraw() {
  fill(0, 30)
  square(0, 0, 512)
  fill(255)
  //noStroke()
  text("X: " + pos.x, 10, 20)
  text("Y: " + pos.y, 10, 40)
  text("Dist: " + distance, 10, 60)
  // image(imgwto)
  noSmooth()
  drawWorldRoom()
  worldMovement();

}

function worldMovement() {
  if (keyWentDown(37)) //left
    worldMove(-1, 0)
  else if (keyWentDown(38)) //up
    worldMove(0, -1)
  else if (keyWentDown(39)) //right
    worldMove(1, 0)
  else if (keyWentDown(40)) //down
    worldMove(0, 1)
}



function worldMove(xx = 0, yy = 0) {
  var moveVector = createVector(xx, yy)
  pos.add(moveVector)

  pos.x = Math.max(pos.x, 1)
  pos.x = Math.min(pos.x, wWidth)
  pos.y = Math.max(pos.y, 1)
  pos.y = Math.min(pos.y, wHeight)

  distance = dist(pos.x, pos.y, 1, 1)

  setVideoOpacities();

}


function drawWorldRoom() {
  if (pos.x == 1) sLeft.visible = false;
  else sLeft.visible = true;

  if (pos.x == wWidth) sRight.visible = false;
  else sRight.visible = true;

  if (pos.y == 1) sUp.visible = false;
  else sUp.visible = true;

  if (pos.y == wHeight) sDown.visible = false;
  else sDown.visible = true;

  drawSprites()
}



//background video opacity manamgnet

var vClouds = document.getElementById("clouds");
var vMoon = document.getElementById("moon")
function setVideoOpacities() {
  var distNorm = map(distance, 0, wWidth - 0.5, 0, 1, true)
  var inverted = 1 - distNorm
  console.log("Noramlised distance is ", distNorm, "\nInverted dist is: ", inverted)
  vMoon.style.opacity = distNorm;
  vClouds.style.opacity = inverted
}