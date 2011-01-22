var GeneticAlgorithm = Class.extend({
	init: function(crossOver, mutations) {
		this.crossOver = crossOver;
		this.mutations = mutations;
		
		this.generations = 0;
				
		this.bestFitness = 0;
		this.worstFitness = 0;
		this.totalFitness = 0;
		this.averageFitness = 0;
	},
	
	epoch: function(boids) {
		boids.sort( function(a, b) { return b.fitness - a.fitness } );

		this.calcStats(boids);
		
		var newPop = [];
		
		var i = this.grabTopTenPercent(boids, newPop);
		
		while( i < boids.length ) {
			var parent1 = this.selectParent(boids);
			var parent2 = this.selectParent(boids);
			
			var children = this.breed(parent1, parent2);
			
			children = this.mutate(children);
			
			newPop.push(children[0]);
			if( i + 1 < boids.length )
				newPop.push(children[1]);
			
			i += 2;
		}
		
		for (i = 0; i < boids.length; i++) {
			boids[i].brain.setGenome(newPop[i]);
		}
		      this.generations++;
	},
	grabTopTenPercent: function(boids, newPop){
		var tenPercent = Math.round(boids.length * 0.1)

		for(var i = 0; i < tenPercent; i++) {
			newPop.push( boids[i].brain.getGenome() );
		}

		return tenPercent;
	},
	calcStats: function(boids){
		this.bestFitness = boids[0].fitness;
		this.worstFitness = boids[boids.length-1].fitness;
		this.totalFitness = 0;
		
		for(var i = 0; i < boids.length; i++){
			this.totalFitness += boids[i].fitness;
		}
		
		this.averageFitness = this.totalFitness / boids.length;
	},
	selectParent: function(boids){
//		var target = (this.totalFitness + boids.length - 1) * Math.random();
		var target = (this.totalFitness - 1) * Math.random();
		var sum = 0;
		
		for(var i = 0; i < boids.length; i++) {
			sum += boids[i].fitness;
			
			if(sum > target) break;
		}
		
		return boids[i].brain.getGenome();
	},
	
	breed: function(parent1, parent2) {
		if(Math.random() > this.crossOver)
			return [parent1, parent2];
		
		var pivot = Math.floor(Math.random() * parent1.length);
		
		var child1 = parent1.slice(0,pivot).concat(parent2.slice(pivot));
		var child2 = parent2.slice(0,pivot).concat(parent1.slice(pivot));
		
		return [child1, child2];
	},
	
	mutate: function(children) {
		for(var i = 0; i < children.length; i++) {
			var child = children[i];
			for(var j = 0; j < child.length; j++) {
				if(Math.random() < this.mutations) {
					child[j] += 2*Math.random() - 1;
				}
			}
		}
		return children;
	}
});
