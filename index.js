'use strict';

var jquery = require('./src/js/lib/jquery/jquery-1.8.2.js');
var d3 = require('./src/js/lib/d3/d3.v3.js');
var sprintf = require('sprintf');
var epiviz = require('epiviz');

module.exports = {
    sprintf: sprintf,
    d3: d3,
    epiviz : epiviz
};
// console.log(sprintf);
// window.d3 = d3;
// window.sprintf = sprintf;
// module.exports = epiviz;