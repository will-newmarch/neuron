const Network = require('./Network.js');

// Various settings...
var learningRate = 0.01;
var epochs = 100000;
var activation = 'sigmoid';

// Build the network...
var network = new Network({
	layers: [2,2,1],
	hiddenActivationType: activation,
	outputActivationType: 'identity',
	bias: false
});

var data = [
	{x: [0,0], y: [0]},
	{x: [0,1], y: [1]},
	{x: [1,0], y: [1]},
	{x: [1,1], y: [0]}
];

console.log('Training...');

for (var h = 0; h < epochs; h++) {

	for (var i = 0; i < data.length; i++) {

		let index = Math.floor(Math.random() * data.length);
		
		network.fire(data[index].x);

		network.backPropagate(data[index].y);

		network.applyError(learningRate);

		network.reset();

	}
}

console.log('Done.');

console.log('Testing...');

for(var i = 0; i < data.length; i++) {

	network.fire(data[i].x);

	var activation = network.layers[network.layers.length-1].neurons[0].activation;

	console.log(data[i].x, 'is', activation, 'and should be', data[i].y);

	network.reset();

}

console.log('Done.');



