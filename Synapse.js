class Synapse {
	constructor(input,output) {
		this.label = input.label + '--' + output.label;
		this.input = input;
		this.output = output;
		this.weight = (Math.random() * 2) - 1;
		this.signal = 0;
		this.error = 0;
	}
	fire(signal) {
		this.signal = signal;
		this.output.fire(signal * this.weight);
	}
	backPropagate(error) {
		this.error = error * this.signal;
		this.input.backPropagate(error * this.weight);
	}
	applyError(learningRate) {
		this.weight -= learningRate * this.error;
	}
	reset() {
		this.signal = 0;
		this.error = 0;
	}
};

module.exports = Synapse;