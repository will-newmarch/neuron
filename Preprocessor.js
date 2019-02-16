class Preprocessor {
	constructor(data) {
		this.data = data;
	}
	normalise() { // TODO - Improve this to handle arrays of n dimensions.
		let normalisedData = [];
		for (var r = 0; r < this.data.length; r++) {
			let row = this.data[r];
			let rowMin = Math.min(...row.map(c => c));
			let rowMax = Math.max(...row.map(c => c));
			let normalisedRow = [];
			for (var c = 0; c < row.length; c++) {
				let normalisedCell = (this.data[r][c] - rowMin) / (rowMax - rowMin);
				normalisedRow.push(normalisedCell - 0.5); // Mean of 0
			}
			normalisedData.push(normalisedRow);
		}
		return normalisedData;
	}
};

module.exports = Preprocessor;