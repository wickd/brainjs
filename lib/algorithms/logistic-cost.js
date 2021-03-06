var Algorithm = require('../algorithm');

/**
 * Computes logistic cost
 * @param  {Object} network  Neural network
 * @param  {Array}  examples Array of examples (1)
 * @param  {Object} options  Options           (2)
 *
 * (1) [
 *   {
 *     input: Vector,
 *     output: Vector
 *   }
 * ]
 *
 * (2) {}
 */
var LogisticCost = function (network, examples, options) {
  Algorithm.call(this, network, examples, options);

  this.setOptions(options);
};

LogisticCost.prototype = new Algorithm();

LogisticCost.prototype.clone = function () {
  return Algorithm.clone(LogisticCost, this);
};

/**
 * Compute logitstic cost
 * @return {Number} Cost
 */
LogisticCost.prototype.run = function () {
  var example
   , input
   , hypothesis
   , output
   , expectedOutput
   , cost
   , i
   , l
   , j
   , m;

  cost = 0;

  // iterate over examples and calculate cost
  for (i = 0, l = this.examples.length; i < l; i++) {
    example    = this.examples[i];
    input      = example.input;
    hypothesis = this.network.run(input);

    for (j = 1, m = example.output.dimensions().cols; j <= m; j++) {
      expectedOutput = example.output.e(j);
      output         = hypothesis.e(j);

      cost += expectedOutput * Math.log(output) + (1 - expectedOutput) * Math.log(1 - output);
    }

    if (i % this.options.reportFrequency === 0) {
      this.report('computation', {
        iterations: i + 1
      });
    }
  }

  this.report('finished-computation', {
    iterations : i + 1
  });

  return -1 * cost / this.examples.length;
};

exports = module.exports = LogisticCost;
