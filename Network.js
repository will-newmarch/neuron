const Layer 	= require('./Layer.js');
const Neuron 	= require('./Neuron.js');
const Bias 		= require('./Bias.js');
const Synapse 	= require('./Synapse.js');

class Network {
	constructor(settings = {}) {
		this.settings = Object.assign({
			layers: [10,16,16,1],
			hiddenActivationType: 'sigmoid',
			outputActivationType: 'identity',
			bias: true
		},settings);
		this.layers = [];
		this.generate();
		this.connect();
	}
	generate() { // Generate the network...
		// Input layer...
		var inputLayer = new Layer('input');
		for(var i = 0; i < this.settings.layers[0]; i++) {
			let neuron = new Neuron('input-' + i)
			inputLayer.neurons.push(neuron);
		}
		if(this.settings.bias) {
			let bias = new Bias('input-bias');
			bias.activationType = this.settings.hiddenActivationType;
			inputLayer.neurons.push(bias);
		}
		this.layers.push(inputLayer);
		// Hidden layers...
		for (var i = 0; i < this.settings.layers.length - 2; i++) {
			var hiddenLayer = new Layer('hidden-'+i);
			for(var j = 0; j < this.settings.layers[i+1]; j++) {
				let neuron = new Neuron('hidden-'+j);
				neuron.activationType = this.settings.hiddenActivationType;
				hiddenLayer.neurons.push(neuron);
			}
			if(this.settings.bias) {
				let bias = new Bias('hidden-bias');
				bias.activationType = this.settings.hiddenActivationType;
				hiddenLayer.neurons.push(bias);
			}
			this.layers.push(hiddenLayer);
		}
		// Output layer...
		var outputLayer = new Layer('output');
		for(var i = 0; i < this.settings.layers[this.settings.layers.length-1]; i++) {
			let neuron = new Neuron('output-' + i);
			neuron.activationType = this.settings.outputActivationType;
			outputLayer.neurons.push(neuron);
		}
		this.layers.push(outputLayer);
	}
	connect() {
		for(var i = 0; i < this.layers.length; i++) {
			var currentLayer = this.layers[i];
			var nextLayer = this.layers[i+1];
			if(nextLayer) {
				for(var j = 0; j < currentLayer.neurons.length; j++) {
					var currentNeuron = currentLayer.neurons[j];
					for(var k = 0; k < nextLayer.neurons.length; k++) {
						var nextNeuron = nextLayer.neurons[k];
						if(nextNeuron.constructor.name == 'Bias') continue;
						let synapse = new Synapse(currentNeuron,nextNeuron);
						currentNeuron.outputs.push(synapse);
						nextNeuron.inputs.push(synapse);
					}
				}
			}
		}
	}
	fire(signals) {
		for (var i = 0; i < this.layers[0].neurons.length; i++) {
			this.layers[0].neurons[i].fire(signals[i]); // Fire the neurons on the first layer.
		}
		for (var i = 0; i < this.layers.length; i++) {
			this.layers[i].neurons.map(n => {
				if(n.constructor.name == 'Bias') n.fire(); // TODO - refactor; we shouldnt need to poke the bias's separately!
			});
		}
		return this;
	}
	backPropagate(errors) {
		for (var i = 0; i < errors.length; i++) {
			this.layers[this.layers.length-1].neurons[i].backPropagate(errors[i]);
		}
		return this;
	}
	applyError(learningRate) {
		this.layers.map(l => {
			l.neurons.map(n => {
				n.outputs.map(o => {
					o.applyError(learningRate);
				});
			});
		});
	}
	error() {
		let totalError = 0;
		for (var i = 1; i < this.layers.length; i++) {
			for (var j = 0; j < this.layers[i].neurons.length; j++) {
				totalError += this.layers[i].neurons[j].error;
			}
		}
		return totalError;
	}
	reset() {
		this.layers.map(l => {
			l.neurons.map(n => {
				n.reset();
				n.outputs.map(o => {
					o.reset();
				});
			});
		});
	}
	log(synapses = false) { // This could definitely be improved...
		this.layers.map(l => {
			if(synapses) l.neurons.map(n => console.log(n.label,n.outputs.map(s => s.weight)));
		});
	}
};

module.exports = Network;