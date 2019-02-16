class Neuron {
	constructor(label) {
		this.label = label;
    	this.inputs = [];
    	this.outputs = [];
    	this.signal = 0;
    	this.backSignal = 0;
    	this.activation = 0;
    	this.error = 0;
    	this.inputCount = 0;
    	this.outputCount = 0;
    	this.activationType = 'sigmoid';
	}
	activationFunction(derivative = false) {
		switch(this.activationType) {
			case 'leakyrelu':
				if(!derivative)
					return function(val) { return val > 0 ? parseFloat(val) : parseFloat(val * 0.01); };
				else 
					return function(val) { return val > 0 ? 1 : 0.01; };
			case 'relu':
				if(!derivative)
					return function(val) { return val > 0 ? val : 0; };
				else
					return function(val) { return val > 0 ? 1 : 0; };
			case 'tanh':
				if(!derivative)
					return function(val) { return Math.tanh(val); };
				else
					return function(val) { return 1 - Math.pow(Math.tanh(val),2); };
			case 'sigmoid':
				if(!derivative)
					return function(val) { return 1 / (1 + Math.exp(-val)); };
				else
					return function(val) { return val * (1 - val); };
			case 'linear':
			case 'identity':
				if(!derivative)
					return function(val) { return val; };
				else
					return function(val) { return val; };
			case 'heaviside':
				if(!derivative)
					return function(val) { return !!(val > 0) ? 1 : 0; };
				else
					return function(val) { return !!(val > 0) ? 1 : 0; };
		}
	}
	fire(signal) {
		this.signal += parseFloat(signal);
		this.inputCount++;
		if(this.isInput() || this.inputCount == this.inputs.length) {
			if(!this.isInput()) {
				this.activation = this.activationFunction()(this.signal);
			} else {
				this.activation = this.signal;
			}
			if(!this.isOutput()) {
				for (var i = 0; i < this.outputs.length; i++) {
					this.outputs[i].fire(this.activation);
				}
			}
		}
	}
	backPropagate(backSignal) {
		this.backSignal += parseFloat(backSignal);
		this.outputCount++;
		if(this.isOutput() || this.outputCount == this.outputs.length) {
			if(!this.isOutput()) {
				this.error = this.backSignal + this.activationFunction(true)(this.activation);

			} else {
				// This is because it is the amount the output layer activated minus the target values.
				this.error = this.activation - this.backSignal;
			}
			// THE NaN error was here
			if(!this.isInput()) {
				for (var i = 0; i < this.inputs.length; i++) {
					this.inputs[i].backPropagate(this.error);
				}
			}
		}
	}
	isInput() {
		return this.inputs.length == 0;
	}
	isHidden() {
		return this.inputs.length > 0 && this.outputs.length > 0;
	}
	isOutput() {
		return this.outputs.length == 0;
	}
	reset() {
    	this.inputCount = 0;
    	this.outputCount = 0;
    	this.activation = 0;
    	this.signal = 0;
    	this.backSignal = 0;
		this.error = 0;
	}
};

module.exports = Neuron;