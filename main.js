var cartesian = {
  last_coords: [0,0],

  /* Create the gird and scope for cartesian system */
  make: function (canvas, options) {
    // Default options
    default_options = {total_lines:20}
    options = $.extend(default_options, options)

    // Get context
    ctx = canvas.getContext("2d")
    
    // Draw grid
    ctx.beginPath()
    ctx.strokeStyle = '#f1f1f1'
    for (i = options.total_lines; i > 0; i--) {
      ctx.moveTo(i*canvas.width/options.total_lines, 0)
      ctx.lineTo(i*canvas.width/options.total_lines, canvas.width)
      ctx.moveTo(0, i*canvas.width/options.total_lines)
      ctx.lineTo(canvas.width, i*canvas.width/options.total_lines)
    }
    ctx.stroke()
    ctx.closePath()

    // Draw scope
    ctx.beginPath()
    ctx.strokeStyle = '#b4b4b4'
    ctx.moveTo(canvas.width/2,0)
    ctx.lineTo(canvas.width/2,canvas.width)
    ctx.moveTo(0,canvas.width/2)
    ctx.lineTo(canvas.width,canvas.width/2)
    ctx.stroke()
    ctx.closePath()
  },

  /* Coords function receives coordinates in a range of 100% and transforms into px by canvas width*/
  coords: function (canvas, x, y) {
    x = x==undefined?this.last_coords[0]:x
    y = y==undefined?this.last_coords[1]:y
    // Write last coords
    this.last_coords = [x,y]
    // Get coords as percent
    x = x/100*canvas.width/2
    y = y/100*canvas.width/2
    // Fix canvas coords to cartesian coords
    x = canvas.width/2+x
    y = canvas.width/2-y
    return {x:x,y:y}
  },

  /* Creates a point on the coords given */
  point: function (canvas, x, y) {
    cartesian_cords = this.coords(canvas, x, y)

    // Get context
    ctx = canvas.getContext("2d")
    
    ctx.beginPath()
    ctx.arc(cartesian_cords.x, cartesian_cords.y, 4, 0, Math.PI*2, true)
    ctx.fillStyle = "rgb(200,50,50)"
    ctx.fill()
    ctx.closePath()
    
    return {x:x, y:y}
  },

  /* Traces a line from the point to the scope in any direction given [x,y,c] */
  to: function (canvas, direction, x, y) {
    cartesian_cords = this.coords(canvas, x, y)

    // Get context
    ctx = canvas.getContext("2d")
    
    ctx.beginPath()
    ctx.setLineDash([8,5])
    ctx.strokeStyle = 'lightcoral'
    ctx.moveTo(cartesian_cords.x, cartesian_cords.y)
    if (direction == "x")
      ctx.lineTo(cartesian_cords.x, canvas.width/2)
    else if (direction == "y")
      ctx.lineTo(canvas.width/2, cartesian_cords.y)
    else
      ctx.lineTo(canvas.width/2, canvas.width/2)
    ctx.stroke()
    ctx.closePath()
  },

  text: function (canvas, string, x, y) {
    cartesian_cords = this.coords(canvas, x, y)

    // Get context
    ctx = canvas.getContext("2d")
    
    // Write text
    ctx.beginPath()
    ctx.font = "14px sans-serif"
    ctx.fillText(string, cartesian_cords.x, cartesian_cords.y)
    ctx.closePath()
  }
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


var canvas = document.getElementById("myCanvas");
cartesian.make(canvas)
cartesian.to(canvas, 'x', 40, -40)
cartesian.to(canvas, 'y')
cartesian.to(canvas, 'c')
cartesian.point(canvas)
cartesian.text(canvas, 'Cos(-5/13)')