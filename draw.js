function loadCanvasById(id) {
	var canvas= document.getElementById(id);
	var context= canvas.getContext("2d");
	return {canvas:canvas, context:context};
}


function scale(num, in_min, in_max, out_min, out_max) {
  var v = (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
	return v > out_max ? out_max : v < out_min ? out_min : v;

}

function clearCanvas(context, canvas) {
	context.clearRect(0, 0, canvas.width, canvas.height);  
}


function myNoise3d(x,y,z,l) {
	var v = noise.simplex3(x/l, y/l, z/l);
	return 0.5*(v+1);
}

function myNoise3dx(x,y,z,l) {
	var il = l;
	var pe = 0.5;			
	var re = 0;
	for(var i=0 ; i < 7; ++i) {
		re += pe*myNoise3d(x,y,z,il);
		il*= 0.5;
		pe*= 0.5;
	}
	return re;
}


noise.seed(Math.random());

function getPoint(canvas,cx,cy,cr,perc, t0, time,dataArray,freqArray,isPlaying) {
	var i0 = scale(perc,0,1,0, freqArray.length-1);
	var i0p = i0 - Math.floor(i0);
	var i0i = parseInt(i0);
	var f0 = freqArray[i0i]*(1-i0p)+freqArray[(i0i+1)%freqArray.length]*(i0p);



	var f = f0*0.4;
	if (isNaN(f)) {
		f = 0.0;
	}


	var sx = 0.5*perc+t0;
	var sy = 0.5*perc;
	var sr = myNoise3dx(sx, sy, (time+f/256), 1.0);


	return {
		x: perc * canvas.width,			
		y: canvas.height/2-(2*sr*cr+f)
	};
}

function drawPerlinCircleToCanvas(context, canvas, t0, time,dataArray,freqArray,isPlaying) {
		var colorR = parseInt(myNoise3dx(time,0,0,1.0)*255);
		var colorG = parseInt(myNoise3dx(0,time,0,1.0)*255);
		var colorB = parseInt(myNoise3dx(0,0,time,1.0)*255);		

		context.strokeStyle = 'rgba('+colorR+','+ colorG +','+colorB+',0.2)';
		context.beginPath();

		var cx = canvas.width/2; 
		var cy = canvas.height/2;
		var cr = Math.min(cx, cy)*0.25;

		var init = true;
		for(var perc = 0 ; perc < 1.000001 ; perc += 0.005) {
			var point = getPoint(canvas, cx,cy,cr, perc, t0, time, dataArray,freqArray,isPlaying);	
			init ? context.moveTo(point.x, point.y) : context.lineTo(point.x, point.y);
			init = false;		
		}

		context.stroke();
}
