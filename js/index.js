var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
ctx.canvas.width = window.innerWidth;
ctx.canvas.height = window.innerHeight;
var container = {
  x: 0,
  y: 0,
  width: canvas.width,
  height: canvas.height
};
var gravity = 0.05;
var starSize = 6;
var spawnRate = 1 //new stars added each cycle
var xSpawn = container.width * 0.5;
var ySpawn = 0;
var VxStart = 0;
var VyStart = 0;
var color = "black"
var spread = 0.3;
var fastCalc = 2;
var steep = 1;
var mouseDown = true;
var stars = [];

function pushStar() { //adds a new star objects to array stars
  stars.push({
    x: xSpawn + Math.random() * spread * 2 - 2,
    y: ySpawn,
    r: Math.round(starSize * Math.random()),
    Vx: 2 * spread * (Math.random() - 0.5) + VxStart,
    Vy: 2 * spread * (Math.random() - 0.5) + VyStart,
  });
}

window.onresize = function(event) {
  ctx.canvas.width = window.innerWidth;
  ctx.canvas.height = window.innerHeight;
  container.height = window.innerHeight;
  container.width = window.innerWidth;
};
//gets mouse position
function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}
// waits for mousemove event
document.addEventListener('mousemove', function(evt) {
  mousePos = getMousePos(canvas, evt);
  xSpawn = mousePos.x
  ySpawn = mousePos.y
}, false);

//populate array ground to width of screen
var ground = [];
for (var i = 0; i < container.width; i++) {
  ground.push(0);
}

//main loop
//recursive draw function
function draw() {
  if (mouseDown) { //makes the setting sliders respond while mouse is down
    updateOutPut()
  }
  //screen wipe
  ctx.fillStyle = "black";
  ctx.fillRect(container.x, container.y, container.width, container.height);
   
  //ctx.fillText(mouseDown,200,100);  //variable feedback for testing
  ctx.fillStyle = color;
  //add sand 
  pushStar();
  i = stars.length;
  while (i--) {
    //draw a pixel
    ctx.fillRect(stars[i].x, stars[i].y, stars[i].r, stars[i].r);
    //gravity
    stars[i].Vy += gravity;

    //change position, velocity, size of object elements for each location in array
    stars[i].x += stars[i].Vx;
    stars[i].y += stars[i].Vy;

    //wall collision
    if (stars[i].x > container.width) {
      stars[i].x = container.width;
      stars[i].Vx = -1 * Math.abs(stars[i].Vx);
    } else if (stars[i].x < 0) {
      stars[i].x = 0;
      stars[i].Vx = Math.abs(stars[i].Vx);
    }
    if (stars[i].y > container.height - ground[Math.round(stars[i].x)]) {
      //add to ground, subtract from pixels
      for (var j = 0; j < stars[i].r; j++) {
        ground[Math.round(stars[i].x + j)] = ground[Math.round(stars[i].x + j)] + stars[i].r
      }
      stars.splice(i, 1);
    } else if (stars[i].y < 0) {
      stars[i].y = 0;
      stars[i].Vy = Math.abs(stars[i].Vy);
    } else if (stars[i].y > container.height) {
      stars.splice(i, 1);
    }
  }
  //ground loop
  for (var i = 0; i < container.width; i++) {
    //draw ground
    ctx.fillRect(i, container.height - ground[i], 1, ground[i]);
    //randomly check left and right to see if the array location is taller, if it is move one to left or right.
    if (Math.random() > 0.5) {
      if (ground[i] - steep > ground[i - 1]) {
        ground[i - 1] = ground[i - 1] + 1;
        ground[i] = ground[i] - 1;
        i -= fastCalc;
      } else if (ground[i] - steep > ground[i + 1]) {
        ground[i + 1] = ground[i + 1] + 1;
        ground[i] = ground[i] - 1;
        i -= fastCalc;
      };
    } else {
      if (ground[i] - steep > ground[i + 1]) {
        ground[i + 1] = ground[i + 1] + 1;
        ground[i] = ground[i] - 1;
        i -= fastCalc;
      } else if (ground[i] - steep > ground[i - 1]) {
        ground[i - 1] = ground[i - 1] + 1;
        ground[i] = ground[i] - 1;
        i -= fastCalc;
      };
    }
  }
  requestAnimationFrame(draw);
}

document.getElementById('particlecolor').onchange = function() {
  color = particlecolor.value;
}
document.getElementById('clear').onclick = function() {
  //populate array ground to width of screen
  ground = [];
  for (var i = 0; i < container.width; i++) {
    ground.push(0);
  }
}
document.getElementById('calc').onchange = function() {
  if (calc.checked == true) {
    fastCalc = 2
  } else {
    fastCalc = 1
  }
}
document.addEventListener("mousedown", function() {
  mouseDown = true;
  for (var i = 0; i < stars.length; i++) {
    stars[i].Vx += 3 * Math.cos(Math.atan2(stars[i].y - mousePos.y, stars[i].x - mousePos.x));
    stars[i].Vy += 3 * Math.sin(Math.atan2(stars[i].y - mousePos.y, stars[i].x - mousePos.x));
  }
});
document.addEventListener("mouseup", function() {
  mouseDown = false;
});
document.getElementById('size').onchange = function() {
  updateOutPut()
}
document.getElementById('grav').onchange = function() {
  updateOutPut()
}
document.getElementById('steepness').onchange = function() {
  updateOutPut()
}
document.getElementById('xdir').onchange = function() {
  updateOutPut()
}
document.getElementById('ydir').onchange = function() {
  updateOutPut()
}

function updateOutPut() {
  starSize = Math.ceil(size.value * 0.1);
  document.getElementById("sizeoutput").innerHTML = "max size = " + starSize.toFixed(0) + " x " + starSize.toFixed(0);
  gravity = grav.value * 0.002;
  document.getElementById("gravoutput").innerHTML = "gravity = " + gravity.toFixed(3);
  VxStart = (xdir.value - 50) * 0.2;
  document.getElementById("xdiroutput").innerHTML = "x-velocity = " + VxStart.toFixed(1);
  VyStart = (ydir.value - 50) * 0.2;
  document.getElementById("ydiroutput").innerHTML = "y-velocity = " + VyStart.toFixed(1);
  steep = 1 + Math.floor(steepness.value * 0.1);
  document.getElementById("steepnessoutput").innerHTML = "steepness = " + steep.toFixed(0);
  color = particlecolor.value;
}