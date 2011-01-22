

var NeuralNetwork = Class.extend({
	init: function(inputs, outputs, hiddenLayers, hiddenLayerWidth) {
		this.neuronLayers = [];
		
		this.inputLayer = new NeuronLayer(inputs, 0);
		this.neuronLayers.push(this.inputLayer);
		var previousNeurons = inputs;

		for(var i = 0; i < hiddenLayers; i++) {
			this.neuronLayers.push(new NeuronLayer(hiddenLayerWidth, previousNeurons));
			previousNeurons = hiddenLayerWidth;
		}
		
		this.outputLayer = new NeuronLayer(outputs, previousNeurons);
		this.neuronLayers.push(this.outputLayer);
	},
	
	outputs: function(inputs) {
		$.each(this.inputLayer.neurons, function(i, neuron){
			neuron.value = inputs[i];
		});
		
		
		for(var i = 1; i < this.neuronLayers.length; i++){
			var layer = this.neuronLayers[i];

			var outputs = layer.outputs(inputs);
			inputs = outputs;
		}
		
		return outputs;
	},

	getGenome: function(){
		return $.map(this.neuronLayers, function(layer) {
			return layer.getGenome();
		});
	},
	setGenome: function(genome){
		var start = 0;
		
		$.each(this.neuronLayers, function(i, layer) {
			var length = layer.genomeLength();
			var slice = genome.slice(start, start+length);
			
			layer.setGenome(slice);
			
			start += length;
		});
	}
});

var NeuronLayer = Class.extend({
	init: function(numNeurons, numInputs){
		this.neurons = [];
		
		for(var i = 0; i < numNeurons; i++){
			this.neurons.push(new Neuron(numInputs));
		}
	},
	
	outputs: function(inputs){
		return $.map(this.neurons, function(n) { return n.output(inputs); });
	},
	
	getGenome: function(){
		return $.map(this.neurons, function(neuron) {
			return neuron.getGenome();
		});
	},
	setGenome: function(genome){
		var start = 0;
		
		$.each(this.neurons, function(i, neuron) {
			var length = neuron.genomeLength();
			var slice = genome.slice(start, start+length);
			
			neuron.setGenome(slice);
			
			start += length;
		});
	},
	genomeLength: function(){
		var total = 0;
		
		$.each(this.neurons, function(i, neuron) {
			total += neuron.genomeLength();
		});
		
		return total;
	}
});

var Neuron = Class.extend({
	init: function(numInputs){
		this.weights = [];
		
		for(var i = 0; i < numInputs; i++){
			this.weights.push(2*Math.random() - 1);
		}
		
		this.threshold = Math.random();
	},
	
	output: function(inputs)
	{
		var sum = 0;
		
		$.each(this.weights, function(i, weight){
			sum += weight * inputs[i];
		});
		
		this.value = 1 / (1 + Math.exp(-sum / this.threshold));
		
		return this.value;
	},
	
	getGenome: function(){
		return this.weights.concat(this.threshold);
	},
	setGenome: function(genome){
		this.threshold = genome.pop();
		this.weights = genome;
	},
	genomeLength: function(){
		return this.weights.length + 1;
	}
});