function makeCartesian(ctx) {
  max = 20
  ctx.beginPath();
  ctx.strokeStyle = '#f1f1f1'
  ctx.lineWidth = 1
  for (i = max; i > 0; i--) {
    ctx.moveTo(i*400/max, 0)
    ctx.lineTo(i*400/max, 400)
    ctx.stroke()
    ctx.moveTo(0, i*400/max)
    ctx.lineTo(400, i*400/max)
    ctx.stroke()
  }
  ctx.closePath();

  ctx.beginPath();
  ctx.strokeStyle = '#b4b4b4'
  ctx.moveTo(200,0);
  ctx.lineTo(200,400);
  ctx.moveTo(0,200);
  ctx.lineTo(400,200);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(200, 200, 2, 0, Math.PI*2, true); 
  ctx.fillStyle = "red";
  ctx.fill();
  ctx.closePath();
}

function dd(obj) {
  $(".status").html(JSON.stringify(obj,null,2))
}

function getCoords (coords) {
  return {'x': 200+coords.x*2, 'y': 200-coords.y*2};
}

function point (coords) {
  px = getCoords(coords)
  ctx.beginPath();
  ctx.arc(px.x, px.y, 4, 0, Math.PI*2, true); 
  ctx.fillStyle = "red";
  ctx.fill();
  ctx.font = "18px serif";
  ctx.fillText("  "+coords.name, px.x, px.y);
  ctx.closePath();
  return coords
}

function tox (coords) {
  px = getCoords(coords)
  ctx.beginPath();
  ctx.setLineDash([8,5])
  ctx.strokeStyle = 'lightcoral'
  ctx.moveTo(px.x, px.y);
  ctx.lineTo(px.x, 200);
  ctx.stroke();
  ctx.closePath();
  
  return {x:0, y:coords.y}
}
function toy (coords) {
  px = getCoords(coords)
  ctx.beginPath();
  ctx.setLineDash([8,5])
  ctx.strokeStyle = 'lightcoral'
  ctx.moveTo(px.x, px.y);
  ctx.lineTo(200, px.y);
  ctx.stroke();
  return {x:0, y:coords.y}
}
function toc (coords) {
  px = getCoords(coords)
  ctx.beginPath();
  ctx.setLineDash([8,5])
  ctx.strokeStyle = 'lightcoral'
  ctx.moveTo(px.x, px.y);
  ctx.lineTo(200, 200);
  ctx.stroke();
  ctx.closePath();
  
  return {x:0, y:coords.y}
}
function getTriangleSizes (coords){
  if (coords.x && coords.y)
    coords.h = Math.sqrt(Math.pow(coords.x,2)+Math.pow(coords.y,2))
  else if (coords.h && coords.x)
    coords.y = Math.sqrt(Math.pow(coords.h,2)-Math.pow(coords.x,2))
  else if (coords.h && coords.y)
    coords.x = Math.sqrt(Math.pow(coords.h,2)-Math.pow(coords.y,2))
  return coords
}

function triangle (coords) {
  max = Math.abs(coords.x)>=Math.abs(coords.y)?coords.x:coords.y
  max = Math.abs(max)*1.25
  x = coords.x
  y = coords.y
  coords.x = x/max*100
  coords.y = y/max*100
  p = point(coords)
  toc(p)
  toy(p)
  tox(p)
  return {x:x,y:y,h:Math.sqrt(Math.pow(x,2)+Math.pow(y,2))}
}
function dumpTriangleInfo(coords){
  x = coords.x
  y = coords.y
  h = coords.h
  coords.x = x/max*100
  coords.y = y/max*100
  
  ctx.font = "13px serif";
  
  px = getCoords({x:coords.x,y:coords.y/2})
  ctx.fillText(y, px.x, px.y);
  px = getCoords({x:coords.x/2,y:coords.y/2})
  ctx.fillText(h, px.x, px.y);
  px = getCoords({x:coords.x/2,y:0})
  ctx.fillText(x, px.x, px.y);
}



// canvas.width canvas.height
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

makeCartesian(ctx)

t = getTriangleSizes({x:-5, h:13})
t.name = 'Cos(-5/13)'
t = triangle (t)
dumpTriangleInfo(t)

t = getTriangleSizes({y:-35, h:37})
t.name = 'Sen(-5/13)'
t = triangle (t)
dumpTriangleInfo(t)
