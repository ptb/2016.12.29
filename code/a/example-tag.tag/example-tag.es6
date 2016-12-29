/* eslint-disable no-invalid-this, no-magic-numbers, no-undef */

this.opts = opts

if (!this.opts.sum) {
  this.opts.sum = 0
}

/**
 * Add two numbers.
 * @param {number} a The first number.
 * @param {number} b The second number.
 * @returns {number} The sum of the two numbers.
 */
this.add = function () {
  this.opts.sum = parseInt(this.opts.sum, 10) + 1
  this.update()
}.bind(this)
