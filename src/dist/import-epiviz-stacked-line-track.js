/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

/**
 * Created by Florin Chelaru ( florinc [at] umd [dot] edu )
 * Date: 12/8/2014
 * Time: 1:32 PM
 */


goog.provide('epiviz.plugins.charts.StackedLineTrackType');

goog.require('epiviz.ui.charts.Chart');

/**
 * @param {epiviz.Config} config
 * @extends {epiviz.ui.charts.TrackType}
 * @constructor
 */
epiviz.plugins.charts.StackedLineTrackType = function(config) {
  // Call superclass constructor
  epiviz.ui.charts.TrackType.call(this, config);
};

/*
 * Copy methods from upper class
 */
epiviz.plugins.charts.StackedLineTrackType.prototype = epiviz.utils.mapCopy(epiviz.ui.charts.TrackType.prototype);
epiviz.plugins.charts.StackedLineTrackType.constructor = epiviz.plugins.charts.StackedLineTrackType;

/**
 * @param {string} id
 * @param {jQuery} container The div where the chart will be drawn
 * @param {epiviz.ui.charts.VisualizationProperties} properties
 * @returns {epiviz.plugins.charts.StackedLineTrack}
 */
epiviz.plugins.charts.StackedLineTrackType.prototype.createNew = function(id, container, properties) {
  return new epiviz.plugins.charts.StackedLineTrack(id, container, properties);
};

/**
 * @returns {string}
 */
epiviz.plugins.charts.StackedLineTrackType.prototype.typeName = function() {
  return 'epiviz.plugins.charts.StackedLineTrack';
};

/**
 * @returns {string}
 */
epiviz.plugins.charts.StackedLineTrackType.prototype.chartName = function() {
  return 'Stacked Track';
};

/**
 * @returns {string}
 */
epiviz.plugins.charts.StackedLineTrackType.prototype.chartHtmlAttributeName = function() {
  return 'stacked-lines';
};

/**
 * @returns {function(epiviz.measurements.Measurement): boolean}
 */
epiviz.plugins.charts.StackedLineTrackType.prototype.measurementsFilter = function() { return function(m) { return m.type() == epiviz.measurements.Measurement.Type.FEATURE; }; };

/**
 * If true, this flag indicates that the corresponding chart can only show measurements that belong to the same
 * data source group
 * @returns {boolean}
 */
epiviz.plugins.charts.StackedLineTrackType.prototype.isRestrictedToSameDatasourceGroup = function() { return true; };

/**
 * @returns {Array.<epiviz.ui.charts.CustomSetting>}
 */
epiviz.plugins.charts.StackedLineTrackType.prototype.customSettingsDefs = function() {
  return epiviz.ui.charts.TrackType.prototype.customSettingsDefs.call(this).concat([
    new epiviz.ui.charts.CustomSetting(
      epiviz.plugins.charts.StackedLineTrackType.CustomSettings.STEP,
      epiviz.ui.charts.CustomSetting.Type.NUMBER,
      1,
      'Step'),

    new epiviz.ui.charts.CustomSetting(
      epiviz.plugins.charts.StackedLineTrackType.CustomSettings.OFFSET,
      epiviz.ui.charts.CustomSetting.Type.CATEGORICAL,
      'zero',
      'Offset',
      ['zero', 'wiggle']),

    new epiviz.ui.charts.CustomSetting(
      epiviz.plugins.charts.StackedLineTrackType.CustomSettings.INTERPOLATION,
      epiviz.ui.charts.CustomSetting.Type.CATEGORICAL,
      'basis',
      'Interpolation',
      ['linear', 'step-before', 'step-after', 'basis', 'basis-open', 'basis-closed', 'bundle', 'cardinal', 'cardinal-open', 'monotone'])
  ]);
};

/**
 * @enum {string}
 */
epiviz.plugins.charts.StackedLineTrackType.CustomSettings = {
  STEP: 'step',
  OFFSET: 'offset',
  INTERPOLATION: 'interpolation'
};



/***/ }),
/* 1 */
/***/ (function(module, exports) {

/**
 * Created by Florin Chelaru ( florinc [at] umd [dot] edu )
 * Date: 12/8/2014
 * Time: 1:32 PM
 */


goog.provide('epiviz.plugins.charts.StackedLineTrack');

/**
 * @param {string} id
 * @param {jQuery} container
 * @param {epiviz.ui.charts.VisualizationProperties} properties
 * @extends {epiviz.ui.charts.Track}
 * @constructor
 */
epiviz.plugins.charts.StackedLineTrack = function(id, container, properties) {
  // Call superclass constructor
  epiviz.ui.charts.Track.call(this, id, container, properties);
  this._dispatch = d3.dispatch("hover", "click");
  this._initialize();
};

/*
 * Copy methods from upper class
 */
epiviz.plugins.charts.StackedLineTrack.prototype = epiviz.utils.mapCopy(epiviz.ui.charts.Track.prototype);
epiviz.plugins.charts.StackedLineTrack.constructor = epiviz.plugins.charts.StackedLineTrack;

/**
 * @protected
 */
epiviz.plugins.charts.StackedLineTrack.prototype._initialize = function() {
  // Call super
  epiviz.ui.charts.Track.prototype._initialize.call(this);
};

/**
 * @param {epiviz.datatypes.GenomicRange} [range]
 * @param {?epiviz.datatypes.GenomicData} [data]
 * @param {number} [slide]
 * @param {number} [zoom]
 * @returns {Array.<epiviz.ui.charts.ChartObject>} The objects drawn
 */
epiviz.plugins.charts.StackedLineTrack.prototype.draw = function(range, data, slide, zoom) {
  epiviz.ui.charts.Track.prototype.draw.call(this, range, data, slide, zoom);

  // If data is defined, then the base class sets this._lastData to data.
  // If it isn't, then we'll use the data from the last draw call
  data = this._lastData;
  range = this._lastRange;
  slide = slide || this._slide;
  zoom = zoom || this._zoom;
  this._slide = 0;
  this._zoom = 1;

  // If data is not defined, there is nothing to draw
  if (!data || !range) { return []; }

  var Axis = epiviz.ui.charts.Axis;
  slide = slide || 0;
  var delta = slide * (this.width() - this.margins().sumAxis(Axis.X)) / range.width();
  return this._drawLines(range, data, delta, zoom || 1);
};

/**
 * @param {epiviz.datatypes.GenomicRange} range
 * @param {epiviz.datatypes.GenomicData} data
 * @param {number} delta
 * @param {number} zoom
 * @returns {Array.<epiviz.ui.charts.ChartObject>} The objects drawn
 * @private
 */
epiviz.plugins.charts.StackedLineTrack.prototype._drawLines = function(range, data, delta, zoom) {
  var Axis = epiviz.ui.charts.Axis;

  /** @type {epiviz.ui.charts.ColorPalette} */
  var colors = this.colors();

  /** @type {number} */
  var step = this.customSettingsValues()[epiviz.plugins.charts.StackedLineTrackType.CustomSettings.STEP];

  /** @type {string} */
  var interpolation = this.customSettingsValues()[epiviz.plugins.charts.StackedLineTrackType.CustomSettings.INTERPOLATION];

  /** @type {string} */
  var offset = this.customSettingsValues()[epiviz.plugins.charts.StackedLineTrackType.CustomSettings.OFFSET];

  var self = this;

  var invXScale = d3.scale.linear()
    .domain([0, this.width() - this.margins().sumAxis(Axis.X)])
    .range([range.start(), range.end()]);
  var deltaInBp = invXScale(delta) - range.start();

  // TODO: Re-introduce extendedRange (this is what we need to draw to make the track look continuous on navigation transition)
  var extendedRange = epiviz.datatypes.GenomicRange.fromStartEnd(
    range.seqName(),
    Math.min(range.start(), range.start() + deltaInBp),
    Math.max(range.end(), range.end() + deltaInBp));

  /** @type {Array.<epiviz.ui.charts.ChartObject>} */
  var items = [];

  var seriesAreas = [];

  var firstGlobalIndex = data.firstSeries().globalStartIndex();
  var lastGlobalIndex = data.firstSeries().globalEndIndex();

  data.foreach(function(measurement, series) {
    var firstIndex = series.globalStartIndex();
    var lastIndex = series.globalEndIndex();

    if (firstIndex > firstGlobalIndex) { firstGlobalIndex = firstIndex; }
    if (lastIndex < lastGlobalIndex) { lastGlobalIndex = lastIndex; }
  });

  firstGlobalIndex = Math.ceil(firstGlobalIndex / step) * step;
  lastGlobalIndex = Math.floor(lastGlobalIndex / step) * step;

  // TODO: Continue getting the labels on the x axis
  /** @type {Array.<string>} */
  var labels;

  data.foreach(function(m, series, i) {
    var indices = epiviz.utils.range((lastGlobalIndex - firstGlobalIndex) / step)
      .map(function(i) { return i * step + firstGlobalIndex; })
      .filter(function(globalIndex) {
        return series.getByGlobalIndex(globalIndex);
      });

    for (var k = 0; k < indices.length; ++k) {
      var cell = series.getByGlobalIndex(indices[k]);
      items.push(new epiviz.ui.charts.ChartObject(sprintf('line_%s_%s', i, cell.globalIndex), cell.rowItem.start(), cell.rowItem.end(), [cell.value], i, [[cell]], [m], sprintf('item data-series-%s', i)));
    }

    var x = function(j) {
      /** @type {epiviz.datatypes.GenomicData.ValueItem} */
      var cell = series.getByGlobalIndex(j);
      return cell.rowItem.start();
    };

    var y = function(j) {
      /** @type {epiviz.datatypes.GenomicData.ValueItem} */
      var cell = series.getByGlobalIndex(j);
      return cell.value;
    };

    var areas = [];
    indices.forEach(function(j) { areas.push({x: x(j), y: y(j)}); });
    seriesAreas.push(areas);
    if (!labels) {
      labels = [];
      indices.forEach(function(j) {
        /** @type {epiviz.datatypes.GenomicData.ValueItem} */
        var cell = series.getByGlobalIndex(j);
        labels.push(cell.rowItem.metadata('bacteria')); // TODO: Change to something more generic
      });
    }
  });

  var xScale = d3.scale.linear()
    .domain([range.start(), range.end()])
    .range([0, this.width() - this.margins().sumAxis(Axis.X)]);

  this._clearAxes();

  this._drawAxes(xScale, undefined, 10);
  // TODO: Add option for labels on tracks
  /* this._drawAxes(
    xScale, undefined, // scales
    labels.length, undefined, // ticks
    undefined, undefined, undefined, undefined, undefined, undefined, labels, undefined);*/

  var graph = this._svg.select('.lines');
  if (graph.empty()) {
    graph = this._svg.append('g')
      .attr('class', 'lines')
      .attr('transform', 'translate(' + this.margins().left() + ', ' + this.margins().top() + ')');
  }

  var stack = d3.layout.stack().offset(offset);
  var layers = stack(seriesAreas);

  var yScale = d3.scale.linear()
    .domain([
      Math.min(0, d3.min(layers, function(layer) { return d3.min(layer, function(d) { return d.y0 + d.y; }); })),
      d3.max(layers, function(layer) { return d3.max(layer, function(d) { return d.y0 + d.y; }); })])
    .range([this.height() - this.margins().sumAxis(Axis.Y), 0]);

  var area = d3.svg.area()
    .x(function(d) { return xScale(d.x); })
    .y0(function(d) { return yScale(d.y0); })
    .y1(function(d) { return yScale(d.y0 + d.y); })
    .interpolate(interpolation);

  var lines = graph
    .selectAll('path')
    .data(layers);

  lines.enter()
    .append('path')
    .attr('d', area)
    .style('shape-rendering', 'auto')
    .style('stroke-width', '0')
    .style('fill', function(d, i) { return colors.get(i); })
    .on('mouseover', function() { self._captureMouseHover(); self._dispatch.hover(self.id(), null)})
    .on('mousemove', function() { self._captureMouseHover(); self._dispatch.hover(self.id(), null)})
    .on('mouseout', function () { self._unhover.notify(new epiviz.ui.charts.VisEventArgs(self.id())); 
                   self._dispatch.hover(self.id(), null);
    });

  lines
    .attr('d', area)
    .style('fill', function(d, i) { return colors.get(i); })
    .attr('transform', 'translate(' + (+delta) + ')')
    .transition()
    .duration(500)
    .attr('transform', 'translate(' + (0) + ')');

  return items;
};



/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1);
__webpack_require__(0);


/***/ })
/******/ ]);