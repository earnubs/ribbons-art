(function() {
    window.requestAnimationFrame = requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
})();

var Art = function(canvas, config) {

    this.width = canvas.width;
    this.height = canvas.height;

    this.radius = config.radius || 200;
    this.amplitude = config.amplitude || 100;
    this.cx = config.x || -this.width/2;
    this.cy = config.y || this.height/2;
    this.changeSpeed = config.changeSpeed || 0.0001;
    this.rotation = config.rotation || 0.0004;
    this.furr = config.furr || false;
    this.complexity = config.complexity || 5;

    this.points = this.createLine(this.complexity);


    this.TWO_PI = Math.PI * 2;

    this.yPhase = Math.random() * this.TWO_PI;

    this.drawCount = 0;
    this.param = 0;
    this.rotPhase = 0;

    this.ctx = canvas.getContext('2d');

    var grad = this.ctx.createRadialGradient(0,0,0,0,0,this.radius+50);
    grad.addColorStop(0,"rgba(0,0,255,0.1)");
    grad.addColorStop(1,"rgba(200,0,100,0.1)");

    this.ctx.strokeStyle = grad;

    this.ctx.setTransform(1,0,0,1,0,0)
    this.ctx.clearRect(0,0,this.width,this.height);

};

Art.prototype = {
    render: function() {
        // canvas width + radius

        var theta = 0,
        x0, y0,
        points = this.points;

        for (j = 0; j < 4; j++) {
            this.drawCount++;


            this.param += this.changeSpeed;
            this.cx += 2;
            this.cy += 0.004;
            this.rotPhase += this.rotation;

            //console.log(this.cx);

            var easeFactor = this.easeInOut(this.param),

            yOffset = this.amplitude * Math.sin( this.yPhase + this.drawCount/1000 * this.TWO_PI );

            this.ctx.setTransform(1,0,0,1,this.cx,this.cy + yOffset);

            this.ctx.beginPath();
            for (var i = points.length;i--;) {
                if (points[i-1]) {

                    var x = points[i].x,
                    y = points[i].y,
                    xn = points[i-1].x, // next point
                    yn = points[i-1].y;

                    theta = this.TWO_PI * (x + easeFactor * ( xn - x )) + this.rotPhase;

                    if (this.furr) {
                        rad = (y + easeFactor * ( yn - y )) *
                            (this.radius * Math.sin(this.drawCount/100 * Math.random()));
                    } else {
                        rad = (y + easeFactor * ( yn - y )) *
                            // pinches the curve
                            ((this.radius + (this.rotPhase * this.radius)) * Math.sin(this.drawCount/100)); // TODO param the 100 TODO double radius
                    }

                    x0 = this.radius + rad * Math.cos(theta);
                    y0 = rad * Math.sin(theta);

                    this.ctx.lineTo(x0,y0);
                }
            }
            this.ctx.closePath();
            this.ctx.stroke();
        }
        if (this.cx > this.width + this.radius || this.drawCount > 500) {
            return;
        } else {
            this.render();
        }
    },
    easeInOut: function(t) {
        return 0.5 - 0.5 * Math.cos( Math.PI * 2 * t); 
    },
    createLine: function(n) {
        // the initial point pair defining the line
        var line = [
            {x:0,y:1},
            {x:1,y:1}
        ];

        // split the line n times
        for (var j = n; j--;) {
            line = splitLine(line);
        }

        // the function to split between each point pair, starting
        // and ending at the same point as defined by the original
        // point pair
        function splitLine(arr) { 
            for (var dx, dy, x, y, c, i = arr.length;i--;) {
                if (arr[i-1]) {
                    dx = arr[i].x - arr[i-1].x;
                    dy = arr[i].y - arr[i-1].y;
                    x = arr[i-1].x + dx / 2;
                    y = (arr[i-1].y + dy / 2);
                    y += dx * ((Math.random() * 2) - 1);
                    c = {x: x, y: y};
                    arr.splice(i,0,c);
                }
            }
            return arr;
        }
        return line;
    }
};


//this.ctx.fillStyle = "rgba(0,0,0,0.5)";

// TODO pass in config object


//drawWave(400, 0);
//drawWave(50, 0);

/**
  function drawWave(r, furr) {
  var drawCount = 0,
  radius = r || 100,
  cx = -radius * 3,
  cy = 250,
  changeSpeed = 0.001,
  param = 0,
  rotPhase = 0,
  yPhase = Math.random() * TWO_PI,
  line = createLine(5);

  var grad = this.ctx.createRadialGradient(0,0,0,0,0,radius+50);
  grad.addColorStop(0,"rgba(0,0,255,0.1)");
  grad.addColorStop(1,"rgba(200,0,100,0.1)");

  this.ctx.strokeStyle = grad;
  draw(line);

  function draw(points) {

// canvas width + radius
if (cx > 1200 + 400) {
//this.ctx.setTransform(1,0,0,1,0,0);
//this.ctx.fillRect(0,0,800,300)

//requestAnimationFrame(drawWave);
return;
}

var theta = 0,
x0, y0;

for (j = 0; j < 4; j++) {
drawCount++;


param += changeSpeed;
cx += 2;
cy += 0.004;
rotPhase += 0.0004;

var easeFactor = easeInOut(param);

var yOffset = 30 * Math.sin( yPhase + drawCount/1000 * TWO_PI );
this.ctx.setTransform(1,0,0,1,cx,cy + yOffset);

this.ctx.beginPath();
for (var i = points.length;i--;) {
if (points[i-1]) {

var x = points[i].x,
y = points[i].y,
xn = points[i-1].x, // next point
yn = points[i-1].y;

theta = TWO_PI * (x + easeFactor * ( xn - x )) + rotPhase;

if (furr) {
rad = (y + easeFactor * ( yn - y )) *
(radius * Math.sin(drawCount/1000 * Math.random()));
} else {
rad = (y + easeFactor * ( yn - y )) *
// pinches the curve
((radius + (rotPhase * 100)) * Math.sin(drawCount/1000));
}

x0 = radius + rad * Math.cos(theta);
y0 = 0 + rad * Math.sin(theta);

this.ctx.lineTo(x0,y0);
}
}
this.ctx.closePath();
this.ctx.stroke();
}
requestAnimationFrame(draw(points));
}
}

function easeInOut(t) { return 0.5 - 0.5 * Math.cos( Math.PI * 2 * t); }


function createLine(n) {
    // the initial point pair defining the line
    var line = [
    {x:0,y:1},
    {x:1,y:1}
    ];

    // split the line n times
    for (var j = n; j--;) {
        line = splitLine(line);
    }

    // the function to split between each point pair, starting
    // and ending at the same point as defined by the original
    // point pair
    function splitLine(arr) { 
        for (var dx, dy, x, y, c, i = arr.length;i--;) {
            if (arr[i-1]) {
                dx = arr[i].x - arr[i-1].x;
                dy = arr[i].y - arr[i-1].y;
                x = arr[i-1].x + dx / 2;
                y = (arr[i-1].y + dy / 2);
                y += dx * ((Math.random() * 2) - 1);
                c = {x: x, y: y};
                arr.splice(i,0,c);
            }
        }

        return arr;
    }
    return line;

}
**/

