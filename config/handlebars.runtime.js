// Import Handlebars runtime lib
const Handlebars = require('handlebars/runtime');

// Register extra helpers
Handlebars.registerHelper({
  eq(v1, v2) {
    return v1 === v2;
  },
  ne(v1, v2) {
    return v1 !== v2;
  },
  lt(v1, v2) {
    return v1 < v2;
  },
  gt(v1, v2) {
    return v1 > v2;
  },
  lte(v1, v2) {
    return v1 <= v2;
  },
  gte(v1, v2) {
    return v1 >= v2;
  },
  and() {
    // eslint-disable-next-line prefer-rest-params
    return Array.prototype.slice.call(arguments).every(Boolean);
  },
  or() {
    // eslint-disable-next-line prefer-rest-params
    return Array.prototype.slice.call(arguments, 0, -1).some(Boolean);
  },
});

/**
 * Handlebars runtime with custom helpers.
 * Used by handlebars-loader.
 */
module.exports = Handlebars;
