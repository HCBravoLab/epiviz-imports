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
 * Date: 10/16/13
 * Time: 9:36 AM
 */

goog.provide('epiviz.plugins.charts.BlocksTrackType');

goog.require('epiviz.ui.charts.Chart');

/**
 * @param {epiviz.Config} config
 * @extends {epiviz.ui.charts.TrackType}
 * @constructor
 */
epiviz.plugins.charts.BlocksTrackType = function(config) {
  // Call superclass constructor
  epiviz.ui.charts.TrackType.call(this, config);
};

/*
 * Copy methods from upper class
 */
epiviz.plugins.charts.BlocksTrackType.prototype = epiviz.utils.mapCopy(epiviz.ui.charts.TrackType.prototype);
epiviz.plugins.charts.BlocksTrackType.constructor = epiviz.plugins.charts.BlocksTrackType;

/**
 * @param {string} id
 * @param {jQuery} container The div where the chart will be drawn
 * @param {epiviz.ui.charts.VisualizationProperties} properties
 * @returns {epiviz.plugins.charts.BlocksTrack}
 */
epiviz.plugins.charts.BlocksTrackType.prototype.createNew = function(id, container, properties) {
  return new epiviz.plugins.charts.BlocksTrack(id, container, properties);
};

/**
 * @returns {string}
 */
epiviz.plugins.charts.BlocksTrackType.prototype.typeName = function() {
  return 'epiviz.plugins.charts.BlocksTrack';
};

/**
 * @returns {string}
 */
epiviz.plugins.charts.BlocksTrackType.prototype.chartName = function() {
  return 'Blocks Track';
};

/**
 * @returns {string}
 */
epiviz.plugins.charts.BlocksTrackType.prototype.chartHtmlAttributeName = function() {
  return 'blocks';
};

/**
 * @returns {epiviz.measurements.Measurement.Type}
 */
/*epiviz.plugins.charts.BlocksTrackType.prototype.chartContentType = function() {
  return epiviz.measurements.Measurement.Type.RANGE;
};*/

/**
 * @returns {boolean}
 */
epiviz.plugins.charts.BlocksTrackType.prototype.isRestrictedToRangeMeasurements = function() { return true; };

/**
 * @returns {function(epiviz.measurements.Measurement): boolean}
 */
epiviz.plugins.charts.BlocksTrackType.prototype.measurementsFilter = function() { return function(m) { return m.type() == epiviz.measurements.Measurement.Type.RANGE; }; };

/**
 * @returns {Array.<epiviz.ui.charts.CustomSetting>}
 */
epiviz.plugins.charts.BlocksTrackType.prototype.customSettingsDefs = function() {
  return epiviz.ui.charts.TrackType.prototype.customSettingsDefs.call(this).concat([
    new epiviz.ui.charts.CustomSetting(
      epiviz.plugins.charts.BlocksTrackType.CustomSettings.MIN_BLOCK_DISTANCE,
      epiviz.ui.charts.CustomSetting.Type.NUMBER,
      5,
      'Minimum block distance')
  ]);
};

/**
 * @enum {string}
 */
epiviz.plugins.charts.BlocksTrackType.CustomSettings = {
  MIN_BLOCK_DISTANCE: 'minBlockDistance'
};



/***/ }),
/* 1 */
/***/ (function(module, exports) {

/**
 * Created by Florin Chelaru ( florinc [at] umd [dot] edu )
 * Date: 10/16/13
 * Time: 9:35 AM
 */

goog.provide('epiviz.plugins.charts.BlocksTrack');

/**
 * @param id
 * @param {jQuery} container
 * @param {epiviz.ui.charts.VisualizationProperties} properties
 * @extends {epiviz.ui.charts.Track}
 * @constructor
 */
epiviz.plugins.charts.BlocksTrack = function(id, container, properties) {
    // Call superclass constructor
    epiviz.ui.charts.Track.call(this, id, container, properties);

    this._dispatch = d3.dispatch("hover", "click");

    this._initialize();
};

/*
 * Copy methods from upper class
 */
epiviz.plugins.charts.BlocksTrack.prototype = epiviz.utils.mapCopy(epiviz.ui.charts.Track.prototype);
epiviz.plugins.charts.BlocksTrack.constructor = epiviz.plugins.charts.BlocksTrack;

/**
 * @protected
 */
epiviz.plugins.charts.BlocksTrack.prototype._initialize = function() {
    // Call super
    epiviz.ui.charts.Track.prototype._initialize.call(this);

    this._svg.classed('blocks-track', true);
};

/**
 * @param {epiviz.datatypes.GenomicRange} [range]
 * @param {epiviz.datatypes.GenomicData} [data]
 * @param {number} [slide]
 * @param {number} [zoom]
 * @returns {Array.<epiviz.ui.charts.ChartObject>} The objects drawn
 */
epiviz.plugins.charts.BlocksTrack.prototype.draw = function(range, data, slide, zoom) {

    epiviz.ui.charts.Track.prototype.draw.call(this, range, data, slide, zoom);

    // If data is defined, then the base class sets this._lastData to data.
    // If it isn't, then we'll use the data from the last draw call
    data = this._lastData;
    range = this._lastRange;

    // If data is not defined, there is nothing to draw
    if (!data || !range || !data.isReady()) {
        return [];
    }

    return this._drawBlocks(range, data, slide || 0, zoom || 1);
};

/**
 * @param {epiviz.datatypes.GenomicRange} range
 * @param {epiviz.datatypes.GenomicData} data
 * @param {number} slide
 * @param {number} zoom
 * @returns {Array.<epiviz.ui.charts.ChartObject>} The objects drawn
 * @private
 */
epiviz.plugins.charts.BlocksTrack.prototype._drawBlocks = function(range, data, slide, zoom) {
    var Axis = epiviz.ui.charts.Axis;

    /** @type {number} */
    var start = range.start();

    /** @type {number} */
    var end = range.end();

    /** @type {number} */
    var width = this.width();

    /** @type {number} */
    var height = this.height();

    /** @type {epiviz.ui.charts.Margins} */
    var margins = this.margins();

    /** @type {epiviz.measurements.MeasurementSet} */
    var measurements = this.measurements();

    /** @type {epiviz.ui.charts.ColorPalette} */
    var colors = this.colors();

    var minBlockDistance = this.customSettingsValues()[epiviz.plugins.charts.BlocksTrackType.CustomSettings.MIN_BLOCK_DISTANCE];

    var xScale = d3.scale.linear()
        .domain([start, end])
        .range([0, width - margins.sumAxis(Axis.X)]);
    var delta = slide * (width - margins.sumAxis(Axis.X)) / (end - start);

    this._clearAxes();
    this._drawAxes(xScale, null, 10, 5);

    var self = this;
    /** @type {Array.<epiviz.ui.charts.ChartObject>} */
    var blocks = [];

    var i = 0;

    data.foreach(function(m, series, seriesIndex) {
        var seriesBlocks = [];

        for (var j = 0; j < series.size(); ++j) {
            /** @type {epiviz.datatypes.GenomicData.ValueItem} */
            var cell = series.get(j);

            if (cell.rowItem.start() > range.end() || cell.rowItem.end() < range.start()) {
                continue;
            }

            var classes = sprintf('item data-series-%s', i);


            if (minBlockDistance !== null && seriesBlocks.length > 0) {
                var lastBlock = seriesBlocks[seriesBlocks.length - 1];
                var start = xScale(cell.rowItem.start());
                var lastEnd = xScale(lastBlock.end);

                if (start - lastEnd < minBlockDistance) {
                    lastBlock.end = Math.max(lastBlock.end, cell.rowItem.end());
                    lastBlock.valueItems[0].push(cell);
                    lastBlock.id = sprintf('b-%s-%s-%s', i, lastBlock.start, lastBlock.end);
                    continue;
                }
            }

            seriesBlocks.push(new epiviz.ui.charts.ChartObject(
                sprintf('b-%s-%s-%s', i, cell.rowItem.start(), cell.rowItem.end()),
                cell.rowItem.start(),
                cell.rowItem.end(),
                null,
                i, // seriesIndex
                [
                    [cell]
                ], // valueItems
                [m], // measurements
                classes));
        }

        blocks = blocks.concat(seriesBlocks);
        ++i;
    });

    var items = this._svg.select('.items');
    var selected = items.select('.selected');
    var clipPath = this._svg.select('#clip-' + this.id());

    if (items.empty()) {
        if (clipPath.empty()) {
            this._svg.select('defs')
                .append('clipPath')
                .attr('id', 'clip-' + this.id())
                .append('rect')
                .attr('class', 'clip-path-rect');
        }

        items = this._svg.append('g')
            .attr('class', 'items')
            .attr('id', this.id() + '-gene-content')
            .attr('clip-path', 'url(#clip-' + this.id() + ')');

        selected = items.append('g').attr('class', 'selected');
        items.append('g').attr('class', 'hovered');
        selected.append('g').attr('class', 'hovered');
    }

    items.attr('transform', 'translate(' + margins.left() + ', ' + margins.top() + ')');

    this._svg.select('.clip-path-rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', width - margins.sumAxis(Axis.X))
        .attr('height', height - margins.sumAxis(Axis.Y));

    var selection = items.selectAll('.item')
        .data(blocks, function(b) {
            return b.id;
        });

    selection
        .enter()
        .insert('rect', ':first-child')
        .attr('class', function(b) {
            return b.cssClasses;
        })
        .style('fill', function(b) {
            return colors.get(b.seriesIndex);
        })
        .attr('x', function(b) {
            return xScale(b.start) / zoom + delta;
        })
        .attr('width', function(b) {
            // We're using b.end + 1 since b.end is the index of the last covered bp
            return zoom * (xScale(b.end + 1) - xScale(b.start));
        })
        .on('mouseout', function() {
            self._unhover.notify(new epiviz.ui.charts.VisEventArgs(self.id()));
            self._dispatch.hover(self.id(), null);
        })
        .on('mouseover', function(b) {
            self._hover.notify(new epiviz.ui.charts.VisEventArgs(self.id(), b));
            self._dispatch.hover(self.id(), b);
        })
        .on('click', function(b) {
            self._deselect.notify(new epiviz.ui.charts.VisEventArgs(self.id()));
            self._select.notify(new epiviz.ui.charts.VisEventArgs(self.id(), b));
            self._dispatch.click(self.id(), b);
            d3.event.stopPropagation();
        });

    selection
        .attr('class', function(b) {
            return b.cssClasses;
        })
        .attr('height', height - margins.sumAxis(Axis.Y))
        .attr('y', 0)
        .transition()
        .duration(500)
        .attr('x', function(b) {
            return xScale(b.start);
        })
        .attr('width', function(b) {
            return xScale(b.end + 1) - xScale(b.start);
        });

    selection
        .exit()
        .transition()
        .duration(500)
        .attr('x', function(b) {
            return xScale(b.start);
        })
        .remove();

    return blocks;
};

/**
 * @param {epiviz.ui.charts.ColorPalette} colors
 */
epiviz.plugins.charts.BlocksTrack.prototype.setColors = function(colors) {
    this.container().find('.items').remove();
    epiviz.ui.charts.Visualization.prototype.setColors.call(this, colors);
};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1);
__webpack_require__(0);


/***/ })
/******/ ]);