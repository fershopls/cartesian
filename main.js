var cartesian = {
  // Last time used
  last_coords: [0,0],
  /* Ereases all canvas content */
  clear: function (canvas) {
    // Get context
    ctx = canvas.getContext("2d")
    // Reset canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  },
  /* Create the gird and scope for cartesian system */
  make: function (canvas, options) {
    // Default options
    default_options = {total_lines:20}
    options = $.extend(default_options, options)
    // Get context
    ctx = canvas.getContext("2d")
    // Draw grid
    ctx.beginPath()
    ctx.lineWidth = 1
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
  /* Coords function receives coordinates in a range of 100% and transforms into px based on canvas width*/
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
    // Draw
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
    // Config
    ctx.save()
    ctx.beginPath()
    ctx.setLineDash([8,5])
    ctx.strokeStyle = 'lightcoral'
    ctx.moveTo(cartesian_cords.x, cartesian_cords.y)
    // Set direction
    if (direction == "x")
      ctx.lineTo(cartesian_cords.x, canvas.width/2)
    else if (direction == "y")
      ctx.lineTo(canvas.width/2, cartesian_cords.y)
    else
      ctx.lineTo(canvas.width/2, canvas.width/2)
    // Draw
    ctx.stroke()
    ctx.closePath()
    ctx.restore()
  },
  /* Prints a string on given coords*/
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

var pyte = {
  make: function (canvas, triangle_obj) {
    x = triangle_obj.a_side
    y = triangle_obj.o_side
    // Get max size and extra padding
    max = Math.abs(x)>=Math.abs(y)?x:y
    max = Math.abs(max)*1.20
    // Scale triangle
    if (Math.abs(x) > 85 || Math.abs(y) > 85 || Math.abs(x) < 20 || Math.abs(y) < 20) {
      _x = x/max*100
      _y = y/max*100
    } else {
      _x = x
      _y = y
    }
    // Draw triangle
    cartesian.to(canvas, 'x', _x, _y)
    cartesian.to(canvas, 'y')
    cartesian.to(canvas, 'c')
    cartesian.point(canvas)
    cartesian.text(canvas, '('+x+'/'+y+')')
    
    return triangle_obj
  },
  /* Calculate triangle side and hypotenuse by two facts */
  _getSides: function (triangle_obj) {
    if (triangle_obj.a_side && triangle_obj.o_side)
      triangle_obj.hypotenuse = Math.sqrt(Math.pow(triangle_obj.a_side,2)+Math.pow(triangle_obj.o_side,2))
    else if (triangle_obj.hypotenuse && triangle_obj.a_side)
      triangle_obj.o_side = Math.sqrt(Math.pow(triangle_obj.hypotenuse,2)-Math.pow(triangle_obj.a_side,2))
    else if (triangle_obj.hypotenuse && triangle_obj.o_side)
      triangle_obj.a_side = Math.sqrt(Math.pow(triangle_obj.hypotenuse,2)-Math.pow(triangle_obj.o_side,2))
    return {a_side:triangle_obj.a_side, o_side:triangle_obj.o_side, hypotenuse:triangle_obj.hypotenuse}
  },
  /* Create triangle object */
  create: function (a_side, o_side, hypotenuse) {
    triangle_obj = {a_side: a_side, o_side:o_side, hypotenuse:hypotenuse}
    return this._getSides(triangle_obj)
  }
}

var dyge = {
  colors: ["magenta","brown","blue","green","yellow","purple"],
  /* Draw an arc from degrees */
  make: function (canvas, deg_start, deg_end, radius) {
    color = this.colors[Math.floor(Math.random()*this.colors.length)]
    
    ctx.beginPath();
    ctx.lineWidth = 5
    ctx.strokeStyle = color
    clockwise = deg_end>=0?true:false;
    this.arc(canvas, deg_start, deg_end, radius, clockwise);
    ctx.stroke();
    ctx.closePath();

    return {deg_start:deg_start,deg_end:deg_end,ref_end:this.ref_deg(deg_end),color:color}
  },
  /* Draw an arc in the center of canvas in degrees */
  arc: function (canvas, deg_start, deg_end, radius, clockwise) {
    center = cartesian.coords(canvas, 0, 0)
    ctx.arc(center.x,center.y,radius,this.deg(deg_start),this.deg(deg_end),clockwise);
  },
  /* Transform degrees to radians */
  deg: function (deg) {
    return (Math.PI*2*(360-(deg%360)/360))
  },
  /* Get the reference angle from a given deg */
  ref_deg: function (deg) {
    _d = Math.abs(deg)%360
    _d = Math.abs(deg>270?360-_d:180-_d)
    _d = Math.abs(deg<0&&deg>-90?deg:_d)
    return _d
  }
}


var canvas = document.getElementById("canvas_plane")
// Set up canvas
_screen_min_width = ($(window).height()<$(window).width()?$(window).height():$(window).width())*0.95
$(canvas).attr('width', _screen_min_width); $(canvas).attr('height', _screen_min_width)
cartesian.make(canvas)

// Draw
dyge.make(canvas, 0, -90, 50)



$('#form').on('submit', function(){
  post = {
    fun: $('#fun').val(),
    num: $('#num').val(),
    den: $('#den').val(),
  }

  a_side = null
  o_side = null
  hypotenuse = null
  plus_minus = null

  if (post.fun == 'point') {
    // AO ! H
    a_side = post.num
    o_side = post.den
  } else if (post.fun == 'sen') {
    // OH ! A
    o_side = post.num
    hypotenuse = post.den
    plus_minus = 'a'
  } else if (post.fun == 'cos') {
    // AH ! O
    a_side = post.num
    hypotenuse = post.den
    plus_minus = 'o'
  } else if (post.fun == 'tan') {
    // OA ! H
    o_side = post.num
    a_side = post.den
  }

  cartesian.clear(canvas)
  cartesian.make(canvas)
  
  triangle_obj = pyte.create(a_side, o_side, hypotenuse)
  pyte.make(canvas, triangle_obj)

  $('.a_side').html(triangle_obj.a_side)
  $('.o_side').html(triangle_obj.o_side)
  _hypotenuse = (triangle_obj.hypotenuse % 1 != 0)?'sqrt('+Math.pow(triangle_obj.hypotenuse,2)+') = '+triangle_obj.hypotenuse:triangle_obj.hypotenuse
  $('.hypotenuse').html(_hypotenuse)
  $('.info').addClass('show')

  if (plus_minus != null) {
    triangle_obj = pyte.create(a_side, o_side, hypotenuse)
    
    triangle_obj.a_side = plus_minus=='a'?triangle_obj.a_side*-1:triangle_obj.a_side
    triangle_obj.o_side = plus_minus=='o'?triangle_obj.o_side*-1:triangle_obj.o_side
    
    pyte.make(canvas, triangle_obj)
  }
  
  return false;
});