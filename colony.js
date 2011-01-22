
var Colony = Class.extend({
	init: function(boidType, numBoids, width, height) {
		this.boids = [];
		
		this.width = width;
		this.height = height;
		
		for(var i = 0; i < numBoids; i++){
			var boid = new boidType(Math.random() * width, Math.random() * height);
			this.boids.push(boid)
		}
		
		this.ticks = 0;
		this.interval = 30;
	},
	
	setInterval: function(interval) {
		this.interval = interval;

		if(this.timer)
			this.run();
	},
	
	draw: function(ctx){
		$.each(this.boids, function(i, boid){
			boid.draw(ctx)
		});
	},
	
	run: function(callback){
		if(!this._run || callback)
			this._run = $.bind(this, this.update, callback)

		if(this.timer) this.stop();
		
		this.timer = window.setInterval(this._run, this.interval);
	},
	stop: function(){
		window.clearInterval(this.timer);
		
		this.timer = 0;
	},
	update: function(callback){
		this.ticks++;
		
		for(var i = 0; i < this.boids.length; i++) {
			this.updateBoid(this.boids[i]);
		}
		
		callback();
	},
	updateBoid: function(boid){
		boid.update();
	}
});

var AntFarm = Colony.extend({
	init: function(numBoids, numFood, width, height){
		this._super(Ant, numBoids, width, height);
		
		this.geneticAlgorithm = new GeneticAlgorithm(0.01, 0.05);
		
		this.food = [];
		for(var i = 0; i < numFood; i++) {
			this.food.push(this.generateFood());
		}
	},
	
	generateFood: function() {
		return {x: Math.random() * this.width, y: Math.random() * this.height};	
	},
	
	draw: function(ctx){
		this._super(ctx);
		
		$.each(this.food, function(i, food){
			ctx.save();
			ctx.translate(food.x, food.y);
			ctx.fillStyle = "lime";
			ctx.fillRect(-1, -1, 3, 3);
			ctx.restore();
		});
	},
	
	update: function(callback){
		this._super(callback);
		
		if(this.ticks == 1000){
			this.geneticAlgorithm.epoch(this.boids);
			this.ticks = 0;
		}
	},
	
	updateBoid: function(ant){
		ant.update(this.food);

		this.antEatsFood(ant);

		this.antWrapsAround(ant);
	},
	
	antEatsFood: function(ant){
		var hit = ant.touchingFood();
		if(hit != null) {
			ant.fitness++;
			this.food[hit] = this.generateFood();
		}
	},
	
	antWrapsAround: function(ant){
		if(ant.x < 0)
			ant.x = this.width;
		if(ant.x > this.width)
			ant.x = 0;
		if(ant.y < 0)
			ant.y = this.height;
		if(ant.y > this.height)
			ant.y = 0;
	}
});




