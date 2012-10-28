var Art = function(canvas, config) {

    config = config || {};

    this.WIDTH = canvas.width;
    this.HEIGHT = canvas.height;

    this.RADIUS = config.radius || 200;
    this.AMPLITUDE = config.amplitude || 100;
    this.ROC = config.ROC || 0.0003;
    this.ROTATION = config.rotation || 0.0004;
    this.COMPLEXITY = config.complexity || 5;

    this.points = this.getPoints(this.COMPLEXITY);

    this.count = 0;
    this.PINCH = 5000;
    this.GRAD_RADIUS0 = 0;
    this.GRAD_RADIUS1= this.RADIUS;

    this.ctx = canvas.getContext('2d');

    this.init(true, -800);

};

Art.prototype = {

    init: function (render, start) {
        // clear canvas, reset transform
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.clearRect(0,0,this.WIDTH,this.HEIGHT);
        // set styles
        this.setStyle();
        // call render
        if (render && isNumber(start)) {
            this._render(start);
        } else if (!render) {
            console.log("initialised, call render() to draw");
        } else if (!isNumber(start)) {
            console.log("start must be a valid x coord");
        }

        function isNumber(n) {
            return !isNaN(parseFloat(n)) && isFinite(n);
        }
    },

    setStyle:function() {
        var grad = this.ctx.createRadialGradient(0,0,this.GRAD_RADIUS0,0,0,this.GRAD_RADIUS1);
        grad.addColorStop(0,"rgba(200,0,0,0.1)");
        grad.addColorStop(1,"rgba(0,0,255,0.1)");

        this.ctx.strokeStyle = grad;
    },

    _drawPath: function(p, r) {
        var x, y,
        xnext, ynext,
        x0,y0,
        rad,
        theta,
        points = this.points,
        easeFactor = this.easeInOut(p);

        this.ctx.beginPath();
        for (i = points.length; i-- && points[i-1];) {

            x = points[i].x,
            y = points[i].y,
            xnext = points[i-1].x, // next point
            ynext = points[i-1].y;

            theta = (Math.PI * 2) * (x + easeFactor * ( xnext - x )) + r;

            rad = (y + easeFactor * ( ynext - y )) *
                // pinches the curve
                ((this.RADIUS + (r * this.RADIUS)) * Math.sin(this.count/this.PINCH)); 

            x0 = this.RADIUS + rad * Math.cos(theta);
            y0 = rad * Math.sin(theta);

            this.ctx.lineTo(x0,y0);
        }
        this.ctx.closePath();
        this.ctx.stroke();
    },

    _render: function(dx, p, r) {

        dy = 400;

        p = p || 0;
        r = r || 0;

        this._drawPath(p, r);
        this.count++;

        dy += ~~(this.AMPLITUDE * Math.sin( this.count * this.ROC * (Math.PI * 2) ));

        p += this.ROC;
        r += this.ROTATION;

        dx += 1; // TODO add RTL option


        if (dx > (this.WIDTH)) {
            this.reset();
            return;
        } else {
            this.ctx.setTransform(1,0,0,1,dx, dy);
            this._render(dx, p, r);
        }
    },

    reset: function() {
        this.count = 0;
    },

    easeInOut: function(t) {
        return 0.5 - 0.5 * Math.cos( Math.PI * 2 * t); 
    },
    getPoints: function(n) {
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
