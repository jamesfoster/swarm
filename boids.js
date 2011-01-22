
var Boid = Class.extend({
	init: function(x, y) {
		this.x = x;
		this.y = y;
	},
	
	draw: function(ctx) {
		ctx.save();
		ctx.translate(this.x, this.y);
		ctx.fillStyle = "blue";
		ctx.fillRect(-1, -1, 3, 3);
		ctx.restore();
	},
	
	update: function(){}
});


var Ant = Boid.extend({
	init: function(x, y){
		this._super(x, y);
		
		this.brain = new NeuralNetwork(1, 2, 1, 4);
		this.rotation = 0;
		this.lookAt = {x: 1, y: 0};
		this.fitness = 0;
	},
	
	draw: function(ctx) {
//		this._super(ctx);
//		return;
		ctx.save();

		ctx.translate(this.x, this.y);
		ctx.rotate(this.rotation);
		ctx.fillStyle = "blue";
		
		ctx.beginPath();
		ctx.moveTo(0, 6);
		ctx.lineTo(-3, -3);
		ctx.lineTo(3, -3);
		ctx.lineTo(0, 6);
		ctx.fill();
		
		ctx.restore();
	},
	
	update: function(food){
		var closestFood = this.findClosestFood(food);
		
		var foodAngle = Math.atan2(closestFood.y, closestFood.x);
		var lookAngle = Math.atan2(this.lookAt.y, this.lookAt.x);
		
		var angle = foodAngle - lookAngle;
		angle = $normalizeAngle(angle);
		
		var inputs = [angle];
		
		var outputs = this.brain.outputs(inputs);
		
		var leftTrack = 2*outputs[0] - 1;
		var rightTrack = 2*outputs[1] - 1;
		
		var speed = leftTrack + rightTrack;
		var rotForce = leftTrack - rightTrack;
		
		this.rotation += rotForce;
		
		this.rotation = $normalizeAngle(this.rotation);
		
		this.lookAt.x = -1 * Math.sin(this.rotation);
		this.lookAt.y = Math.cos(this.rotation);
		
		this.x += speed * this.lookAt.x;
		this.y += speed * this.lookAt.y;
	},
	
	findClosestFood: function(food){
		var closestDist = 99999999.0;
		var closestVector = null;
		
		for(var i = 0; i < food.length; i++) {
			var vector = {x: food[i].x - this.x, y: food[i].y - this.y};
			var dist = vector.x*vector.x + vector.y*vector.y;
			
			if(dist < closestDist){
				closestDist = dist;
				closestVector = vector;
				this.closestFood = {index: i, vector: vector};
			}
		}
		
		return closestVector;
	},
	
	touchingFood: function(){
		var v = this.closestFood.vector;
		
		if(v.x*v.x + v.y*v.y < 25)
			return this.closestFood.index;
		
		return null;
	}
});

var $normalizeAngle = function(angle) {	
	if(angle > Math.PI)
		return angle - 2*Math.PI;
		
	if(angle < -Math.PI)
		return angle + 2*Math.PI;
	
	return angle;
}

