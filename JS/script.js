//Canvas related variables. Their values will be assigned once the document is ready//
var $can, can, ctx;


//Trignometric Functions
window.sin = Math.sin;
window.cos = Math.cos;
window.tan = Math.tan;
window.cosec = function(x){return 1/Math.sin(x)};
window.sec = function(x){return 1/Math.cos(x)};
window.cot = function(x){return 1/Math.tan(x)};

//General Mathematical Functions
window.mod = Math.abs;
window.sqrt = Math.sqrt;
window.pow = Math.pow;
window.exp = Math.exp;
window.log = Math.log;


//General constants
window.pi = Math.PI;
window.e = Math.E;

//Object to hold configurations
window.conf = {
	graphColor: "#ff5155",
	gridColor: "#fff",
	screenColor: "#223",
	lineWidth: 3,
	range: {
		start:-10,
		end: 10
	},
}

//Object to hold working objects and methods//
window.graph = {
	x: 0,	
	initX: 0,
	increment: 0.03,
	scale: 0,
	lastPoint: {x: 0, y: 0},
	eq: function(x){
		return x; //Identity Function by default//
	},
	setSize: function(){		
		can.width = $(window).width();			
		can.height = $(window).height();
	},
	getUserData: function(){

		this.eq = function(x){		
			return eval($("#equation-inp").val());
		}

		var range = [];
		
		range[0] = Number($("#x-start-inp").val());
		range[1] = Number($("#x-end-inp").val());		
		
		if(!isNaN(range[0]) && !isNaN(range[1]) && range[0] < range[1]){
			conf.range.start = range[0];
			conf.range.end = range[1];			
		}else{
			conf.range.end = -10;
			conf.range.start = -10;
			$("#x-start-inp").val(-10);
			$("#x-end-inp").val(10);			
		}

	},
	drawGrid: function(){		
		ctx.strokeStyle = conf.gridColor;
		ctx.globalAlpha = 0.1;
		for(var i = 0; i < conf.range.end - conf.range.start; i++){			
			ctx.beginPath();
			ctx.moveTo((conf.range.start + i)*graph.scale, can.height/2);
			ctx.lineTo((conf.range.start + i)*graph.scale, -can.height/2);
			ctx.stroke();
			ctx.closePath();
		}
		//To draw the x axis again boldly//
		ctx.strokeWidth = 3;
		ctx.globalAlpha = 1;
		ctx.beginPath();
		ctx.moveTo(0, can.height/2);
		ctx.lineTo(0, -can.height/2);
		
		ctx.stroke();
		ctx.closePath();

		//Reset to opacity to draw horizontal lines//
		ctx.globalAlpha = 0.1;

		i = 0;

		//xStart and xEnd are variables so that their values aren't calculated everytime the loop runs//
		var y = 0, xStart = conf.range.start * graph.scale, xEnd = conf.range.end * graph.scale;

		while(y <= can.height/2){
			y = i * graph.scale;
			ctx.beginPath();
			ctx.moveTo(xStart, y);
			ctx.lineTo(xEnd, y);
			ctx.stroke();
			ctx.closePath();
			
			//Drawing two grid lines at a time//
			ctx.beginPath();
			ctx.moveTo(xStart, -y);
			ctx.lineTo(xEnd, -y);
			ctx.stroke();
			ctx.closePath();
			i++;
		}
		ctx.globalAlpha = 1;

		ctx.beginPath();
		ctx.moveTo(xStart, 0);
		ctx.lineTo(xEnd, 0);
		ctx.stroke();
		ctx.closePath();

		ctx.strokeStyle = conf.graphColor;
	},
	setup: function(){
		this.setSize();
		ctx.fillStyle = conf.screenColor;
		ctx.fillRect(0, 0, can.width, can.height);		
		this.initX = conf.range.start;
		this.x = this.initX;
		this.scale = can.width/(conf.range.end - conf.range.start);
		this.lastPoint.x = this.initX;
		this.lastPoint.y = this.eq(this.initX);
		ctx.translate(-conf.range.start * this.scale, can.height/2);
	},
	init: function(complete){
		$can = $("#graph");			
		can = $can[0];			
		ctx = can.getContext("2d");
	},
	draw: function(){		
		var y = graph.eq(graph.x);
		ctx.beginPath();
		ctx.moveTo(graph.lastPoint.x * graph.scale, -graph.lastPoint.y * graph.scale);
		ctx.lineTo(graph.x * graph.scale, -y * graph.scale);
		ctx.lineWidth = conf.lineWidth;
		ctx.stroke();
		ctx.closePath();
		graph.lastPoint.x = graph.x;
		graph.lastPoint.y = y;		
		graph.x += graph.increment;
		if(graph.x <= conf.range.end){
			requestAnimationFrame(graph.draw);
		}

	}
}


$(document).ready(function(){

	var sidePane = {
		status: true,
		open: function(){
			this.status = true;
			$("#side-pane").css("display", "block").stop().animate({
				"opacity": "1",
				"left": "0px"
			}, 200);
		},
		close: function(){
			this.status = false
			$("#side-pane").stop().animate({
				"opacity": "0",
				"left": "-"+$("#side-pane").width()+"px"
			}, 200);			
			setTimeout(function(){			
				if(!this.status){
					$("#side-pane").css("display", "none");
				}
			}, 200);
		}
	}

	graph.init();
	graph.setup();
	graph.drawGrid();

	$("#draw").click(function(){
		sidePane.close();
		graph.getUserData();
		graph.setup();
		graph.drawGrid();
		graph.draw();
	});

	$("#side-pane-open").click(function(){
		if(!sidePane.status){
			sidePane.open();
		}
	});

		$("#close").click(function(){
		if(sidePane.status){
			sidePane.close();
		}
	});

	$(window).resize(function(){
		graph.init(false);	
	});

});