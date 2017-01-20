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
 * Date: 12/9/2014
 * Time: 1:09 AM
 */

goog.provide('epiviz.plugins.charts.CustomLinePlotType');

goog.require('epiviz.ui.charts.Chart');

/**
 * @param {epiviz.Config} config
 * @extends {epiviz.ui.charts.PlotType}
 * @constructor
 */
epiviz.plugins.charts.CustomLinePlotType = function(config) {
    // Call superclass constructor
    epiviz.ui.charts.PlotType.call(this, config);
};

/*
 * Copy methods from upper class
 */
epiviz.plugins.charts.CustomLinePlotType.prototype = epiviz.utils.mapCopy(epiviz.ui.charts.PlotType.prototype);
epiviz.plugins.charts.CustomLinePlotType.constructor = epiviz.plugins.charts.CustomLinePlotType;

/**
 * @param {string} id
 * @param {jQuery} container The div where the chart will be drawn
 * @param {epiviz.ui.charts.VisualizationProperties} properties
 * @returns {epiviz.plugins.charts.LinePlot}
 */
epiviz.plugins.charts.CustomLinePlotType.prototype.createNew = function(id, container, properties) {
    return new epiviz.plugins.charts.CustomLinePlot(id, container, properties);
};

/**
 * @returns {string}
 */
epiviz.plugins.charts.CustomLinePlotType.prototype.typeName = function() {
    return 'epiviz.plugins.charts.CustomLinePlot';
};

/**
 * @returns {string}
 */
epiviz.plugins.charts.CustomLinePlotType.prototype.chartName = function() {
    return 'Custom Line Plot';
};

/**
 * @returns {string}
 */
epiviz.plugins.charts.CustomLinePlotType.prototype.chartHtmlAttributeName = function() {
    return 'line-plot';
};

/**
 * @returns {function(epiviz.measurements.Measurement): boolean}
 */
epiviz.plugins.charts.CustomLinePlotType.prototype.measurementsFilter = function() { return function(m) { return m.type() == epiviz.measurements.Measurement.Type.FEATURE; }; };

/**
 * If true, this flag indicates that the corresponding chart can only show measurements that belong to the same
 * data source group
 * @returns {boolean}
 */
epiviz.plugins.charts.CustomLinePlotType.prototype.isRestrictedToSameDatasourceGroup = function() { return true; };

/**
 * @returns {Array.<epiviz.ui.charts.CustomSetting>}
 */
epiviz.plugins.charts.CustomLinePlotType.prototype.customSettingsDefs = function() {
    return epiviz.ui.charts.PlotType.prototype.customSettingsDefs.call(this).concat([
        new epiviz.ui.charts.CustomSetting(
            epiviz.ui.charts.Visualization.CustomSettings.COL_LABEL,
            epiviz.ui.charts.CustomSetting.Type.MEASUREMENTS_METADATA,
            'colLabel',
            'Columns labels'),

        new epiviz.ui.charts.CustomSetting(
            epiviz.ui.charts.Visualization.CustomSettings.ROW_LABEL,
            epiviz.ui.charts.CustomSetting.Type.MEASUREMENTS_ANNOTATION,
            'name',
            'Row labels'),

        new epiviz.ui.charts.CustomSetting(
            epiviz.plugins.charts.CustomLinePlotType.CustomSettings.SHOW_POINTS,
            epiviz.ui.charts.CustomSetting.Type.BOOLEAN,
            false,
            'Show points'),
        new epiviz.ui.charts.CustomSetting(
            epiviz.plugins.charts.CustomLinePlotType.CustomSettings.SHOW_LINES,
            epiviz.ui.charts.CustomSetting.Type.BOOLEAN,
            true,
            'Show lines'),

        new epiviz.ui.charts.CustomSetting(
            epiviz.plugins.charts.CustomLinePlotType.CustomSettings.SHOW_ERROR_BARS,
            epiviz.ui.charts.CustomSetting.Type.BOOLEAN,
            true,
            'Show error bars'),

        new epiviz.ui.charts.CustomSetting(
            epiviz.plugins.charts.CustomLinePlotType.CustomSettings.POINT_RADIUS,
            epiviz.ui.charts.CustomSetting.Type.NUMBER,
            4,
            'Point radius'),
        new epiviz.ui.charts.CustomSetting(
            epiviz.plugins.charts.CustomLinePlotType.CustomSettings.LINE_THICKNESS,
            epiviz.ui.charts.CustomSetting.Type.NUMBER,
            3,
            'Line thickness'),

        new epiviz.ui.charts.CustomSetting(
            epiviz.ui.charts.Visualization.CustomSettings.Y_MIN,
            epiviz.ui.charts.CustomSetting.Type.NUMBER,
            epiviz.ui.charts.CustomSetting.DEFAULT,
            'Min Y'),

        new epiviz.ui.charts.CustomSetting(
            epiviz.ui.charts.Visualization.CustomSettings.Y_MAX,
            epiviz.ui.charts.CustomSetting.Type.NUMBER,
            epiviz.ui.charts.CustomSetting.DEFAULT,
            'Max Y'),

        new epiviz.ui.charts.CustomSetting(
            epiviz.plugins.charts.CustomLinePlotType.CustomSettings.INTERPOLATION,
            epiviz.ui.charts.CustomSetting.Type.CATEGORICAL,
            'basis',
            'Interpolation', ['linear', 'step-before', 'step-after', 'basis', 'basis-open', 'basis-closed', 'bundle', 'cardinal', 'cardinal-open', 'monotone'])
    ]);
};

/**
 * @enum {string}
 */
epiviz.plugins.charts.CustomLinePlotType.CustomSettings = {
    SHOW_POINTS: 'showPoints',
    SHOW_ERROR_BARS: 'showErrorBars',
    SHOW_LINES: 'showLines',
    POINT_RADIUS: 'pointRadius',
    LINE_THICKNESS: 'lineThickness',
    INTERPOLATION: 'interpolation'
};

/***/ }),
/* 1 */
/***/ (function(module, exports) {

/**
 * Created by Florin Chelaru ( florinc [at] umd [dot] edu )
 * Date: 12/9/2014
 * Time: 1:09 AM
 */

goog.provide('epiviz.plugins.charts.CustomLinePlot');

/**
 * @param {string} id
 * @param {jQuery} container
 * @param {epiviz.ui.charts.VisualizationProperties} properties
 * @extends {epiviz.ui.charts.Plot}
 * @constructor
 */
epiviz.plugins.charts.CustomLinePlot = function(id, container, properties) {
    // Call superclass constructor
    epiviz.ui.charts.Plot.call(this, id, container, properties);

    this._dispatch = d3.dispatch("hover", "click");

    this._initialize();
};

/*
 * Copy methods from upper class
 */
epiviz.plugins.charts.CustomLinePlot.prototype = epiviz.utils.mapCopy(epiviz.ui.charts.Plot.prototype);
epiviz.plugins.charts.CustomLinePlot.constructor = epiviz.plugins.charts.CustomLinePlot;

/**
 * @protected
 */
epiviz.plugins.charts.CustomLinePlot.prototype._initialize = function() {
    // Call super
    epiviz.ui.charts.Plot.prototype._initialize.call(this);

    this._svg.classed('line-plot', true);
};

/**
 * @param {epiviz.datatypes.GenomicRange} [range]
 * @param {?epiviz.datatypes.GenomicData} [data]
 * @param {number} [slide]
 * @param {number} [zoom]
 * @returns {Array.<epiviz.ui.charts.ChartObject>} The objects drawn
 */
epiviz.plugins.charts.CustomLinePlot.prototype.draw = function(range, data, key, dimx, dimy, slide, zoom) {
    //epiviz.ui.charts.Plot.prototype.draw.call(this, range, data, slide, zoom);

    // If data is defined, then the base class sets this._lastData to data.
    // If it isn't, then we'll use the data from the last draw call
    // data = this._lastData;
    // range = this._lastRange;

    // If data is not defined, there is nothing to draw
    // if (!data || !range) { return []; }

    var CustomSetting = epiviz.ui.charts.CustomSetting;
    var minY = this.customSettingsValues()[epiviz.ui.charts.Visualization.CustomSettings.Y_MIN];
    var maxY = this.customSettingsValues()[epiviz.ui.charts.Visualization.CustomSettings.Y_MAX];

    var rowLabel = this.customSettingsValues()[epiviz.ui.charts.Visualization.CustomSettings.ROW_LABEL];

    if (minY == CustomSetting.DEFAULT) {
        minY = null;
        // data.measurements().forEach(function(m) {
        //     if (m === null) { return; }
        //     if (minY === null || m.minValue() < minY) { minY = m.minValue(); }
        // });
        minY = d3.min(data, function(d) {
            return d[dimy];
        });
    }

    if (maxY == CustomSetting.DEFAULT) {
        maxY = null;
        // data.measurements().forEach(function(m) {
        //     if (m === null) { return; }
        //     if (maxY === null || m.maxValue() > maxY) { maxY = m.maxValue(); }
        // });
        maxY = d3.max(data, function(d) {
            return d[dimy];
        });
    }

    this.minX = d3.min(data, function(d) {
        return d[dimx];
    });
    this.maxX = d3.max(data, function(d) {
        return d[dimx];
    });

    if (minY === null && maxY === null) {
        minY = -1;
        maxY = 1;
    }
    if (minY === null) { minY = maxY - 1; }
    if (maxY === null) { maxY = minY + 1; }

    var Axis = epiviz.ui.charts.Axis;
    var xScale = d3.scale.linear()
        .domain([0, data.measurements().length - 1])
        .range([0, this.width() - this.margins().sumAxis(Axis.X)]);
    var yScale = d3.scale.linear()
        .domain([minY, maxY])
        .range([this.height() - this.margins().sumAxis(Axis.Y), 0]);

    this._clearAxes();
    this._drawAxes(xScale, yScale, data.measurements().length, 5,
        undefined, undefined, undefined, undefined, undefined, undefined,
        data.measurements().map(function(m) {
            if (rowLabel == 'name') { return m.name(); }
            var anno = m.annotation();
            if (!anno || !(rowLabel in anno)) { return '<NA>'; }
            return anno[rowLabel];
        }));

    var linesGroup = this._svg.selectAll('.lines');

    if (linesGroup.empty()) {
        linesGroup = this._svg.append('g')
            .attr('class', 'lines items');

        var selectedGroup = linesGroup.append('g').attr('class', 'selected');
        linesGroup.append('g').attr('class', 'hovered');
        selectedGroup.append('g').attr('class', 'hovered');
    }
    linesGroup.attr('transform', 'translate(' + this.margins().left() + ', ' + this.margins().top() + ')');
    return this._drawLines(range, data, dimx, dimy, key, xScale, yScale);
};

/**
 * @param {epiviz.datatypes.GenomicRange} range
 * @param {epiviz.datatypes.GenomicData} data
 * @param {function} xScale D3 linear scale
 * @param {function} yScale D3 linear scale
 * @returns {Array.<epiviz.ui.charts.ChartObject>} The objects drawn
 * @private
 */
epiviz.plugins.charts.CustomLinePlot.prototype._drawLines = function(range, data, dimx, dimy, key, xScale, yScale) {
    /** @type {epiviz.ui.charts.ColorPalette} */
    var colors = this.colors();

    /** @type {boolean} */
    var showPoints = this.customSettingsValues()[epiviz.plugins.charts.LinePlotType.CustomSettings.SHOW_POINTS];

    /** @type {boolean} */
    var showLines = this.customSettingsValues()[epiviz.plugins.charts.LinePlotType.CustomSettings.SHOW_LINES];

    /** @type {boolean} */
    var showErrorBars = this.customSettingsValues()[epiviz.plugins.charts.LinePlotType.CustomSettings.SHOW_ERROR_BARS];

    /** @type {number} */
    var pointRadius = this.customSettingsValues()[epiviz.plugins.charts.LinePlotType.CustomSettings.POINT_RADIUS];

    /** @type {number} */
    var lineThickness = this.customSettingsValues()[epiviz.plugins.charts.LinePlotType.CustomSettings.LINE_THICKNESS];

    var interpolation = this.customSettingsValues()[epiviz.plugins.charts.LinePlotType.CustomSettings.INTERPOLATION];

    var colLabel = this.customSettingsValues()[epiviz.ui.charts.Visualization.CustomSettings.COL_LABEL];

    var self = this;

    var graph = this._svg.select('.lines');

    var firstGlobalIndex = data.firstSeries().globalStartIndex();
    var lastGlobalIndex = data.firstSeries().globalEndIndex();

    data.foreach(function(measurement, series) {
        var firstIndex = series.globalStartIndex();
        var lastIndex = series.globalEndIndex();

        if (firstIndex > firstGlobalIndex) { firstGlobalIndex = firstIndex; }
        if (lastIndex < lastGlobalIndex) { lastGlobalIndex = lastIndex; }
    });

    var nEntries = lastGlobalIndex - firstGlobalIndex;

    // TODO: This might not be needed anymore
    // TODO: Search for all usages of this method
    var dataHasGenomicLocation = epiviz.measurements.Measurement.Type.isOrdered(data.measurements()[0].type());
    var firstIndex, lastIndex;
    for (var i = 0; i < nEntries; ++i) {
        var globalIndex = i + firstGlobalIndex;
        var item = data.firstSeries().getRowByGlobalIndex(globalIndex);
        if (!dataHasGenomicLocation ||
            (range.start() == undefined || range.end() == undefined) ||
            item.start() < range.end() && item.end() >= range.start()) {
            if (firstIndex == undefined) { firstIndex = globalIndex; }
            lastIndex = globalIndex + 1;
        }
    }

    firstGlobalIndex = firstIndex;
    lastGlobalIndex = lastIndex;
    nEntries = lastIndex - firstIndex;

    var width = this.width();

    var lineFunc = d3.svg.line()
        .x(function(d) {
            return xScale(d.x);
        })
        .y(function(d) {
            return yScale(d.y);
        })
        .interpolate(interpolation);

    /**
     * @param {epiviz.datatypes.GenomicData.RowItem} row
     * @returns {string|number}
     */
    var colorBy = function(row) {
        return self._globalIndexColorLabels ? self._globalIndexColorLabels[row.globalIndex()] : row.metadata(colLabel);
    };


    var valuesForIndex = function(index) {
        return data.measurements()
            .map(function(m, i) {
                var item = data.getByGlobalIndex(m, index);
                return {
                    x: i,
                    y: item ? item.value : null,
                    errMinus: (item && item.valueAnnotation) ? item.valueAnnotation['errMinus'] : null,
                    errPlus: (item && item.valueAnnotation) ? item.valueAnnotation['errPlus'] : null
                };
            })
            .filter(function(o) {
                return o.y !== null;
            });
    };

    var indices = epiviz.utils.range(nEntries, firstGlobalIndex);

    var lineItems;
    if (!showLines) {
        graph.selectAll('.line-series').remove();
    } else {
        lineItems = indices.map(function(index) {
            var rowItem = data.firstSeries().getRowByGlobalIndex(index);
            return new epiviz.ui.charts.ChartObject(
                sprintf('line-series-%s', index),
                rowItem.start(),
                rowItem.end(),
                valuesForIndex(index),
                index,
                data.measurements().map(function(m, i) { return [data.getByGlobalIndex(m, index)]; }), // valueItems one for each measurement
                data.measurements(), // measurements
                '');
        });
        var lines = graph.selectAll('.line-series')
            .data(lineItems, function(d) { return d.id; });

        lines
            .enter()
            .insert('g', ':first-child').attr('class', 'line-series item')
            .style('opacity', '0')
            .on('mouseover', function(d) {
                self._hover.notify(new epiviz.ui.charts.VisEventArgs(self.id(), d));
                self._dispatch.hover(self.id(), d);
            })
            .on('mouseout', function() {
                self._unhover.notify(new epiviz.ui.charts.VisEventArgs(self.id()));
                self._dispatch.hover(self.id(), null);
            })
            .each(function(d) {
                d3.select(this)
                    .append('path').attr('class', 'bg-line')
                    .attr('d', lineFunc(d.values))
                    .style('shape-rendering', 'auto')
                    .style('stroke-width', 10)
                    .style('stroke', '#dddddd')
                    .style('stroke-opacity', '0.1');
                d3.select(this)
                    .append('path').attr('class', 'main-line')
                    .attr('d', lineFunc(d.values))
                    .style('shape-rendering', 'auto');
            });

        lines
            .transition()
            .duration(500)
            .style('opacity', '0.7')
            .each(function(d) {
                var color = colors.getByKey(colorBy(data.firstSeries().getRowByGlobalIndex(d.seriesIndex)));
                d3.select(this)
                    .selectAll('.bg-line')
                    .attr('d', lineFunc(d.values));
                d3.select(this).selectAll('.main-line')
                    .attr('d', lineFunc(d.values))
                    .style('stroke', color)
                    .style('stroke-width', lineThickness);
            });

        lines
            .exit()
            .transition()
            .duration(500)
            .style('opacity', '0')
            .remove();
    }

    if (!showPoints) {
        graph.selectAll('.points').remove();
    } else {
        var points = graph.selectAll('.points')
            .data(lineItems, function(d) { return d.id; });

        points
            .enter()
            .append('g').attr('class', 'points')
            .style('opacity', '0');

        points
            .each(function(d) {
                d3.select(this).selectAll('.data-point').remove();
                var selection = d3.select(this).selectAll('.data-point').data(d.values);
                selection.enter().append('g').attr('class', 'data-point')
                    .each(function(dataPoint) {
                        d3.select(this).append('circle')
                            .attr('cx', function(d) { return xScale(d.x); })
                            .attr('cy', function(d) { return yScale(d.y); })
                            .attr('r', pointRadius)
                            .style('stroke-width', 2)
                            .attr('fill', 'none')
                            .attr('stroke', colors.getByKey(colorBy(data.firstSeries().getRowByGlobalIndex(d.seriesIndex))));
                        d3.select(this).selectAll('.error-bar').remove();
                        if (showErrorBars && dataPoint.errMinus != undefined && dataPoint.errPlus != undefined) {
                            d3.select(this)
                                .append('line').attr('x1', xScale(dataPoint.x)).attr('x2', xScale(dataPoint.x)).attr('y1', yScale(dataPoint.errMinus)).attr('y2', yScale(dataPoint.errPlus))
                                .style('stroke', colors.getByKey(colorBy(data.firstSeries().getRowByGlobalIndex(d.seriesIndex))))
                                .style('stroke-width', 2)
                                .attr('class', 'error-bar');

                            d3.select(this)
                                .append('line').attr('x1', xScale(dataPoint.x) - 4).attr('x2', xScale(dataPoint.x) + 4).attr('y1', yScale(dataPoint.errMinus)).attr('y2', yScale(dataPoint.errMinus))
                                .style('stroke', colors.getByKey(colorBy(data.firstSeries().getRowByGlobalIndex(d.seriesIndex))))
                                .style('stroke-width', 2)
                                .attr('class', 'error-bar');

                            d3.select(this)
                                .append('line').attr('x1', xScale(dataPoint.x) - 4).attr('x2', xScale(dataPoint.x) + 4).attr('y1', yScale(dataPoint.errPlus)).attr('y2', yScale(dataPoint.errPlus))
                                .style('stroke', colors.getByKey(colorBy(data.firstSeries().getRowByGlobalIndex(d.seriesIndex))))
                                .style('stroke-width', 2)
                                .attr('class', 'error-bar');
                        }
                    });
                selection.exit().remove();
            })
            .transition()
            .duration(500)
            .style('opacity', '1');

        points
            .exit()
            .transition()
            .duration(500)
            .style('opacity', '0')
            .remove();
    }

    // Draw legend
    var title = '';

    var labels = {};
    indices.forEach(function(index) {
        var label = colorBy(data.firstSeries().getRowByGlobalIndex(index));
        labels[label] = label;
    });

    this._svg.selectAll('.chart-title').remove();
    this._svg.selectAll('.chart-title-color').remove();
    var titleEntries = this._svg
        .selectAll('.chart-title')
        .data(Object.keys(labels));
    titleEntries
        .enter()
        .append('text')
        .attr('class', 'chart-title')
        .attr('font-weight', 'bold')
        .attr('y', self.margins().top() - 5);
    titleEntries
        .attr('fill', function(label) { return colors.getByKey(label); })
        .text(function(label) { return label; });

    var textLength = 0;
    var titleEntriesStartPosition = [];

    $('#' + this.id() + ' .chart-title')
        .each(function(i) {
            titleEntriesStartPosition.push(textLength);
            textLength += this.getBBox().width + 15;
        });

    titleEntries.attr('x', function(column, i) {
        return self.margins().left() + 10 + titleEntriesStartPosition[i];
    });

    var colorEntries = this._svg
        .selectAll('.chart-title-color')
        .data(Object.keys(labels))
        .enter()
        .append('circle')
        .attr('class', 'chart-title-color')
        .attr('cx', function(column, i) { return self.margins().left() + 4 + titleEntriesStartPosition[i]; })
        .attr('cy', self.margins().top() - 9)
        .attr('r', 4)
        .style('shape-rendering', 'auto')
        .style('stroke-width', '0')
        .style('fill', function(label) { return colors.getByKey(label); });

    return lineItems;
};

/**
 * @returns {Array.<string>}
 */
epiviz.plugins.charts.CustomLinePlot.prototype.colorLabels = function() {
    var labels = [];
    for (var i = 0; i < this.colors().size() && i < 20; ++i) {
        labels.push('Color ' + (i + 1));
    }
    return labels;
};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1);
__webpack_require__(0);

/***/ })
/******/ ]);