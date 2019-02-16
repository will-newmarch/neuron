const Neuron = require('./Neuron.js');
class Bias extends Neuron {
	constructor(label) {
		super(label)
		this.activation = 1;
	}
	fire() {
		for (var i = 0; i < this.outputs.length; i++) {
			this.outputs[i].fire(this.activation);
		}
	}
	backPropagate(backSignal) {
		this.backSignal += parseFloat(backSignal);
		this.outputCount++;
		if(this.outputCount == this.outputs.length) {
			this.error = this.backSignal + this.activationFunction(true)(this.activation);
		}
	}
};

module.exports = Bias;