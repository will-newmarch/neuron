class Layer {
	constructor(label) {
		this.label = label;
		this.neurons = [];
	}
	error() {
		let totalError = 0;
		for (var j = 0; j < this.neurons.length; j++) {
			totalError += this.neurons[j].error;
		}
		return totalError;
	}
};

module.exports = Layer;