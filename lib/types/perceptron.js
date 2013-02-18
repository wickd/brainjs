var sylvester = require('sylvester');
var _         = require('underscore');
var utils     = require('../utils');

var Matrix = sylvester.Matrix;
var Vector = sylvester.Vector;

/**
 * Multilayer Perceptron
 * @param {Array} layers  Description of layers
 * @param {Array} weights Array of matrices used as weights
 */
var Perceptron = function (layers, weights) {
  this.layers  = layers;

  if (weights) this.setWeights(weights);
  this.setActivationFunction(utils.sigmoid);
};

/**
 * Propagates the set up perceptron and returns the output vector
 * @param {Vector}   inputs   Input vector
 * @param {Function} callback Callback
 */
Perceptron.prototype.run = function (inputs, callback) {
  this.propagate(inputs, function (err, output) {
    callback(null, output[output.length - 1]);
  });
};

/**
 * Propagates the set up perceptron and returns a vector of outputs for each layer as an array
 * @param {Vector}   inputs   Input vector
 * @param {Function} callback Callback
 */
Perceptron.prototype.propagate = function (inputs, callback) {
  var outputs = [];
  var z, a, lastOutput, lastBiasedOutput;

  // add input vector to the outputs
  outputs.push(inputs);

  // iterate over layers and compute values
  for (var i = 0, l = this.layers.length; i < l - 1; i++) {
    // add bias unit
    lastOutput = _.clone(outputs[i].elements);
    lastOutput.unshift(1);
    lastBiasedOutput = Vector.create(lastOutput);

    // compute weighted sum
    z = this.weights[i].multiply(lastBiasedOutput);
    a = z.map(this.activation);

    outputs.push(a);
  }

  callback(null, outputs);
};

/**
 * Set weights
 * @param {Array} weights Array of matrices used as weights
 */
Perceptron.prototype.setWeights = function (weights) {
  if (!this.validateWeights(weights)) throw new Error('Dimension mismatch of given weights');

  this.weights = weights;

  return this;
};

/**
 * Set activation function
 * @param {Function} activation Activation function
 */
Perceptron.prototype.setActivationFunction = function (activation) {
  this.activation = activation || this.activation;

  return this;
};

/**
 * Validate the given weights
 * @param  {Array}   weights Array of matrices
 * @return {Boolean}         Valid
 */
Perceptron.prototype.validateWeights = function (weights) {
  var layer, previousLayer, layerWeights;

  for (var i = 1, l = this.layers.length; i < l; i++) {
    layer         = this.layers[i];
    previousLayer = this.layers[i - 1];
    layerWeights  = weights[i - 1];

    if (!(
      layerWeights instanceof Matrix &&
      layerWeights.rows() === layer &&
      layerWeights.cols() === previousLayer + 1
    )) return false;
  }

  return true;
};

exports = module.exports = Perceptron;