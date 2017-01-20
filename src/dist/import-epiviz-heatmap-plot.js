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
/******/ 	return __webpack_require__(__webpack_require__.s = 14);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

/**
 * Created by Florin Chelaru ( florinc [at] umd [dot] edu )
 * Date: 4/1/14
 * Time: 5:56 PM
 */

goog.provide('epiviz.plugins.charts.HeatmapPlotType');

goog.require('epiviz.ui.charts.Chart');

/**
 * @param {epiviz.Config} config
 * @extends {epiviz.ui.charts.PlotType}
 * @constructor
 */
epiviz.plugins.charts.HeatmapPlotType = function(config) {
  // Call superclass constructor
  epiviz.ui.charts.PlotType.call(this, config);
};

/*
 * Copy methods from upper class
 */
epiviz.plugins.charts.HeatmapPlotType.prototype = epiviz.utils.mapCopy(epiviz.ui.charts.PlotType.prototype);
epiviz.plugins.charts.HeatmapPlotType.constructor = epiviz.plugins.charts.HeatmapPlotType;

/**
 * @param {string} id
 * @param {jQuery} container The div where the chart will be drawn
 * @param {epiviz.ui.charts.VisualizationProperties} properties
 * @returns {epiviz.plugins.charts.HeatmapPlot}
 */
epiviz.plugins.charts.HeatmapPlotType.prototype.createNew = function(id, container, properties) {
  return new epiviz.plugins.charts.HeatmapPlot(id, container, properties);
};

/**
 * @returns {string}
 */
epiviz.plugins.charts.HeatmapPlotType.prototype.typeName = function() {
  return 'epiviz.plugins.charts.HeatmapPlot';
};

/**
 * @returns {string}
 */
epiviz.plugins.charts.HeatmapPlotType.prototype.chartName = function() {
  return 'Heatmap';
};

/**
 * @returns {string}
 */
epiviz.plugins.charts.HeatmapPlotType.prototype.chartHtmlAttributeName = function() {
  return 'heatmap';
};

/**
 * @returns {function(epiviz.measurements.Measurement): boolean}
 */
epiviz.plugins.charts.HeatmapPlotType.prototype.measurementsFilter = function() { return function(m) { return epiviz.measurements.Measurement.Type.hasValues(m.type()); }; };

/**
 * If true, this flag indicates that the corresponding chart can only show measurements that belong to the same
 * data source group
 * @returns {boolean}
 */
epiviz.plugins.charts.HeatmapPlotType.prototype.isRestrictedToSameDatasourceGroup = function() { return true; };

/**
 * @returns {Array.<epiviz.ui.charts.CustomSetting>}
 */
epiviz.plugins.charts.HeatmapPlotType.prototype.customSettingsDefs = function() {
  var clusteringFactory = epiviz.ui.charts.transform.clustering.ClusteringAlgorithmFactory.instance();

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
      epiviz.plugins.charts.HeatmapPlotType.CustomSettings.SHOW_COLORS_FOR_ROW_LABELS,
      epiviz.ui.charts.CustomSetting.Type.BOOLEAN,
      false,
      'Row labels as colors'),

    new epiviz.ui.charts.CustomSetting(
      epiviz.plugins.charts.HeatmapPlotType.CustomSettings.MAX_COLUMNS,
      epiviz.ui.charts.CustomSetting.Type.NUMBER,
      40,
      'Max columns'),

    new epiviz.ui.charts.CustomSetting(
      epiviz.ui.charts.Visualization.CustomSettings.Y_MIN,
      epiviz.ui.charts.CustomSetting.Type.NUMBER,
      epiviz.ui.charts.CustomSetting.DEFAULT,
      'Min Value'),

    new epiviz.ui.charts.CustomSetting(
      epiviz.ui.charts.Visualization.CustomSettings.Y_MAX,
      epiviz.ui.charts.CustomSetting.Type.NUMBER,
      epiviz.ui.charts.CustomSetting.DEFAULT,
      'Max Value'),

    new epiviz.ui.charts.CustomSetting(
      epiviz.plugins.charts.HeatmapPlotType.CustomSettings.CLUSTER,
      epiviz.ui.charts.CustomSetting.Type.CATEGORICAL,
      'rows',
      'Cluster',
      Object.keys(epiviz.plugins.charts.HeatmapPlotType.Cluster).map(function(key) { return epiviz.plugins.charts.HeatmapPlotType.Cluster[key]; })),

    new epiviz.ui.charts.CustomSetting(
      epiviz.plugins.charts.HeatmapPlotType.CustomSettings.CLUSTERING_ALG,
      epiviz.ui.charts.CustomSetting.Type.CATEGORICAL,
      clusteringFactory.algorithms()[0],
      'Clustering Algorithm',
      clusteringFactory.algorithms()),

    new epiviz.ui.charts.CustomSetting(
      epiviz.plugins.charts.HeatmapPlotType.CustomSettings.CLUSTERING_METRIC,
      epiviz.ui.charts.CustomSetting.Type.CATEGORICAL,
      clusteringFactory.metrics()[0],
      'Clustering Metric',
      clusteringFactory.metrics()),

    new epiviz.ui.charts.CustomSetting(
      epiviz.plugins.charts.HeatmapPlotType.CustomSettings.CLUSTERING_LINKAGE,
      epiviz.ui.charts.CustomSetting.Type.CATEGORICAL,
      clusteringFactory.linkages()[0],
      'Clustering Linkage',
      clusteringFactory.linkages()),

    // TODO: Maybe add back later
    /*new epiviz.ui.charts.CustomSetting(
      epiviz.plugins.charts.HeatmapPlotType.CustomSettings.DENDROGRAM_RATIO,
      epiviz.ui.charts.CustomSetting.Type.NUMBER,
      0,
      'Dendrogram Ratio'),*/

    /*new epiviz.ui.charts.CustomSetting(
      epiviz.plugins.charts.HeatmapPlotType.CustomSettings.SHOW_DENDROGRAM_LABELS,
      epiviz.ui.charts.CustomSetting.Type.BOOLEAN,
      false,
      'Show Dendrogram Labels')*/
    new epiviz.ui.charts.CustomSetting(
      epiviz.plugins.charts.HeatmapPlotType.CustomSettings.SHOW_DENDROGRAM,
      epiviz.ui.charts.CustomSetting.Type.BOOLEAN,
      true,
      'Show Dendrogram')
  ]);
};

/**
 * @enum {string}
 */
epiviz.plugins.charts.HeatmapPlotType.Cluster = {
  NONE: 'none',
  ROWS: 'rows',
  COLS: 'columns',
  BOTH: 'both'
};

/**
 * @enum {string}
 */
epiviz.plugins.charts.HeatmapPlotType.CustomSettings = {
  MAX_COLUMNS: 'maxColumns',
  CLUSTER: 'cluster',
  CLUSTERING_ALG: 'clusteringAlg',
  CLUSTERING_METRIC: 'clusteringMetric',
  CLUSTERING_LINKAGE: 'clusteringLinkage',
  // TODO: Maybe add back later
  //DENDROGRAM_RATIO: 'dendrogramRatio',
  //SHOW_DENDROGRAM_LABELS: 'showDendrogramLabels',
  SHOW_DENDROGRAM: 'showDendrogram',
  SHOW_COLORS_FOR_ROW_LABELS: 'showColorsForRowLabels'
};


/***/ }),
/* 1 */
/***/ (function(module, exports) {

/**
 * Created by Florin Chelaru ( florinc [at] umd [dot] edu )
 * Date: 4/1/14
 * Time: 5:56 PM
 */

goog.provide('epiviz.plugins.charts.HeatmapPlot');

/**
 * @param {string} id
 * @param {jQuery} container
 * @param {epiviz.ui.charts.VisualizationProperties} properties
 * @extends {epiviz.ui.charts.Plot}
 * @constructor
 */
epiviz.plugins.charts.HeatmapPlot = function(id, container, properties) {
  // Call superclass constructor
  epiviz.ui.charts.Plot.call(this, id, container, properties);

  /**
   * D3 chart container
   * @type {*}
   * @private
   */
  this._chartContent = null;

  /**
   * @type {number}
   * @private
   */
  this._min = this.measurements().first().minValue();

  /**
   * @type {number}
   * @private
   */
  this._max = this.measurements().first().maxValue();

  /**
   * @type {function(number): string}
   * @private
   */
  this._colorScale = epiviz.utils.colorizeBinary(this._min, this._max, '#ffffff', this.colors().getByKey('Max'));

  /**
   * @type {Array.<string>}
   * @private
   */
  this._colorLabels = [];

  /**
   * @type {number}
   * @private
   */
  this._dendrogramRatio = 0.1;

  this._initialize();

  this._dispatch = d3.dispatch("hover", "click");
};

/*
 * Copy methods from upper class
 */
epiviz.plugins.charts.HeatmapPlot.prototype = epiviz.utils.mapCopy(epiviz.ui.charts.Plot.prototype);
epiviz.plugins.charts.HeatmapPlot.constructor = epiviz.plugins.charts.HeatmapPlot;

/**
 * @protected
 */
epiviz.plugins.charts.HeatmapPlot.prototype._initialize = function() {
  // Call super
  epiviz.ui.charts.Plot.prototype._initialize.call(this);
  this._svg.classed('heatmap-plot', true);
  this._chartContent = this._svg.append('g').attr('class', 'chart-content');
};

/**
 * @param {epiviz.datatypes.GenomicRange} [range]
 * @param {epiviz.datatypes.GenomicData} [data]
 * @returns {Array.<epiviz.ui.charts.ChartObject>} The objects drawn
 */
epiviz.plugins.charts.HeatmapPlot.prototype.draw = function(range, data) {

  epiviz.ui.charts.Plot.prototype.draw.call(this, range, data);

  // If data is defined, then the base class sets this._lastData to data.
  // If it isn't, then we'll use the data from the last draw call
  data = this._lastData;
  range = this._lastRange;

  // If data is not defined, there is nothing to draw
  if (!data || !range) { return []; }

  var cluster = this.customSettingsValues()[epiviz.plugins.charts.HeatmapPlotType.CustomSettings.CLUSTER];

  var pair = this._applyClustering(range, data);

  /** @type {epiviz.datatypes.GenomicData} */
  var orderedData = pair.data;
  var colOrder = pair.columnOrder;

  return this._drawCells(range, orderedData, colOrder);
};

/**
 * @param {epiviz.datatypes.GenomicRange} range
 * @param {epiviz.datatypes.GenomicData} data
 * @returns {{data:epiviz.datatypes.GenomicData, columnOrder:Array.<number>}}
 * @private
 */
epiviz.plugins.charts.HeatmapPlot.prototype._applyClustering = function(range, data) {
  // TODO: This might not be needed anymore
  // TODO: Search for all usages of this method
  var dataHasGenomicLocation = epiviz.measurements.Measurement.Type.isOrdered(this.measurements().first().type());

  // Apply clustering
  var cluster = this.customSettingsValues()[epiviz.plugins.charts.HeatmapPlotType.CustomSettings.CLUSTER];
  var showDendrogram = this.customSettingsValues()[epiviz.plugins.charts.HeatmapPlotType.CustomSettings.SHOW_DENDROGRAM];
  var clusteringAlgFactory = epiviz.ui.charts.transform.clustering.ClusteringAlgorithmFactory.instance();
  var clusterer = clusteringAlgFactory.algorithm(
    this.customSettingsValues()[epiviz.plugins.charts.HeatmapPlotType.CustomSettings.CLUSTERING_ALG]);
  var metric = clusteringAlgFactory.metric(
    this.customSettingsValues()[epiviz.plugins.charts.HeatmapPlotType.CustomSettings.CLUSTERING_METRIC]);
  var linkage = clusteringAlgFactory.linkage(
    this.customSettingsValues()[epiviz.plugins.charts.HeatmapPlotType.CustomSettings.CLUSTERING_LINKAGE]);
  var maxColumns = this.customSettingsValues()[epiviz.plugins.charts.HeatmapPlotType.CustomSettings.MAX_COLUMNS];

  var firstGlobalIndex = data.firstSeries().globalStartIndex();
  var lastGlobalIndex = data.firstSeries().size() + firstGlobalIndex;

  data.foreach(function(measurement, series) {
    var firstIndex = series.globalStartIndex();
    var lastIndex = series.globalEndIndex();

    if (firstIndex > firstGlobalIndex) { firstGlobalIndex = firstIndex; }
    if (lastIndex < lastGlobalIndex) { lastGlobalIndex = lastIndex; }
  });
  var nEntries = lastGlobalIndex - firstGlobalIndex;

  var clusterRows = (cluster == epiviz.plugins.charts.HeatmapPlotType.Cluster.ROWS || cluster == epiviz.plugins.charts.HeatmapPlotType.Cluster.BOTH);
  var clusterCols = (cluster == epiviz.plugins.charts.HeatmapPlotType.Cluster.COLS || cluster == epiviz.plugins.charts.HeatmapPlotType.Cluster.BOTH);
  var dendrogramRatio = showDendrogram * this._dendrogramRatio;
  var dendrogramCols = (showDendrogram && clusterCols && maxColumns >= nEntries);

  var population, dendrogram, indexOrder, top, left, height, width;

  var svg = this._svg;
  ['dendrogram-horizontal', 'dendrogram-vertical'].forEach(function(dendClass) { svg.select('.' + dendClass).remove(); });

  /** @type {epiviz.datatypes.GenomicData} */
  var orderedData = data;

  if (clusterRows) {
    population = [];
    data.foreach(function(measurement, series) {
      var row = [];
      for (var j = 0; j < nEntries; ++j) {
        var globalIndex = j + firstGlobalIndex;
        var item = series.getByGlobalIndex(globalIndex);
        var rowInfo = item.rowItem;

        if (!dataHasGenomicLocation ||
            (range.start() == undefined || range.end() == undefined) ||
            rowInfo.start() < range.end() && rowInfo.end() >= range.start()) {
          row.push(item.value);
        }
      }
      population.push(row);
    });
    dendrogram = clusterer.cluster(population, metric, linkage);
    indexOrder = dendrogram.root().data();
    var measurements = [];
    data.foreach(function(measurement) { measurements.push(measurement); });
    var orderedMs = [];
    var i;
    for (i = 0; i < indexOrder.length; ++i) {
      orderedMs[i] = measurements[indexOrder[i]];
    }

    var ordered = new epiviz.measurements.MeasurementHashtable();
    for (i = 0; i < orderedMs.length; ++i) {
      ordered.put(orderedMs[i], data.getSeries(orderedMs[i]));
    }
    orderedData = new epiviz.datatypes.MapGenomicData(ordered);

    if (dendrogramRatio) {
      width = (this.width()) * dendrogramRatio;
      height = this.height() * (1 - dendrogramRatio * dendrogramCols) - this.margins().sumAxis(epiviz.ui.charts.Axis.Y);
      top = this.margins().top();
      left = this.width() - width - this.margins().right();
      this._drawDendrogram(dendrogram, top, left, height, width);
    }
  }

  // Column clustering
  indexOrder = null;
  if (clusterCols) {
    population = [];
    data.foreach(function(measurement, series) {
      for (var j = 0, row = 0; j < nEntries; ++j) {
        var globalIndex = j + firstGlobalIndex;
        var item = series.getByGlobalIndex(globalIndex);
        var rowInfo = item.rowItem;
        if (!dataHasGenomicLocation ||
            (range.start() == undefined || range.end() == undefined) ||
            rowInfo.start() < range.end() && rowInfo.end() >= range.start()) {
          if (population.length <= row) {
            population.push([]);
          }
          population[row].push(item.value);
          ++row;
        }
      }
    });

    if (population.length == 0) {
      return {data: orderedData, columnOrder: []};
    }

    dendrogram = clusterer.cluster(population, metric, linkage);
    indexOrder = dendrogram.root().data();

    if (dendrogramCols) {
      var rowLabelsAsColors = this.customSettingsValues()[epiviz.plugins.charts.HeatmapPlotType.CustomSettings.SHOW_COLORS_FOR_ROW_LABELS];
      var rowLabelColorWidth = rowLabelsAsColors ? 20 : 0; // TODO: Customize
      left = this.margins().left();
      top = this.height() * (1 - dendrogramRatio) - this.margins().bottom();
      width = this.height() * dendrogramRatio;
      height = this.width() * (1 - dendrogramRatio * clusterRows) - this.margins().left() - this.margins().right() - rowLabelColorWidth;
      this._drawDendrogram(dendrogram, top, left, height, width, true);
    }
  }

  return {data: orderedData, columnOrder: indexOrder};
};

/**
 * @param {epiviz.datatypes.GenomicRange} range
 * @param {epiviz.datatypes.GenomicData} data
 * @param {Array.<number>} [colOrder]
 * @returns {Array.<epiviz.ui.charts.ChartObject>} The objects drawn
 * @private
 */
epiviz.plugins.charts.HeatmapPlot.prototype._drawCells = function(range, data, colOrder) {
  var self = this;
  var Axis = epiviz.ui.charts.Axis;

  var maxColumns = this.customSettingsValues()[epiviz.plugins.charts.HeatmapPlotType.CustomSettings.MAX_COLUMNS];

  var firstGlobalIndex = data.firstSeries().globalStartIndex();
  var lastGlobalIndex = data.firstSeries().size() + firstGlobalIndex;
  var rows = [];

  // TODO: This might not be needed anymore
  // TODO: Search for all usages of this method
  var dataHasGenomicLocation = epiviz.measurements.Measurement.Type.isOrdered(this.measurements().first().type());

  data.foreach(function(measurement, series) {
    var firstIndex = series.globalStartIndex();
    var lastIndex = series.globalEndIndex();

    if (firstIndex > firstGlobalIndex) { firstGlobalIndex = firstIndex; }
    if (lastIndex < lastGlobalIndex) { lastGlobalIndex = lastIndex; }

    rows.push(measurement);
  });

  var nEntries = lastGlobalIndex - firstGlobalIndex;

  var colLabel = this.customSettingsValues()[epiviz.ui.charts.Visualization.CustomSettings.COL_LABEL];

  //var dendrogramRatio = this.customSettingsValues()[epiviz.plugins.charts.HeatmapPlotType.CustomSettings.DENDROGRAM_RATIO];
  var cluster = this.customSettingsValues()[epiviz.plugins.charts.HeatmapPlotType.CustomSettings.CLUSTER];
  var clusterRows = (cluster == epiviz.plugins.charts.HeatmapPlotType.Cluster.ROWS || cluster == epiviz.plugins.charts.HeatmapPlotType.Cluster.BOTH);
  var clusterCols = ((cluster == epiviz.plugins.charts.HeatmapPlotType.Cluster.COLS || cluster == epiviz.plugins.charts.HeatmapPlotType.Cluster.BOTH)
                     && maxColumns >= nEntries);

  var dendrogramRatio = this.customSettingsValues()[epiviz.plugins.charts.HeatmapPlotType.CustomSettings.SHOW_DENDROGRAM] * this._dendrogramRatio;
  var rowLabelsAsColors = this.customSettingsValues()[epiviz.plugins.charts.HeatmapPlotType.CustomSettings.SHOW_COLORS_FOR_ROW_LABELS];
  var rowLabelColorWidth = rowLabelsAsColors ? 20 : 0; // TODO: Customize


  var width = this.width() * (1 - dendrogramRatio * clusterRows) - rowLabelColorWidth;
  var height = this.height() * (1 - dendrogramRatio * clusterCols);

  var globalIndices = [];
  var colnames = [];
  var i, globalIndex;

  for (i = 0; i < nEntries; ++i) {
    globalIndex = i + firstGlobalIndex;

    // Find a defined row item for the data
    var item;
    data.foreach(function(m, series) {
      item = series.getRowByGlobalIndex(globalIndex);
      return item; // break if item is defined
    });

    if (!item) { continue; }

    if (!dataHasGenomicLocation ||
      (range.start() == undefined || range.end() == undefined) ||
      item.start() < range.end() && item.end() >= range.start()) {
      globalIndices.push(globalIndex);
      var label = item.metadata(colLabel) || '' + item.id();
      colnames.push(label);
    }
  }

  if (colOrder) {
    var unorderedGlobalIndices = globalIndices;
    var unorderedColnames = colnames;
    globalIndices = new Array(globalIndices.length);
    colnames = new Array(colnames.length);
    for (i = 0; i < globalIndices.length; ++i) {
      globalIndices[i] = unorderedGlobalIndices[colOrder[i]];
      colnames[i] = unorderedColnames[colOrder[i]];
      // TODO: Columnmap seems to have same functionality as globalIndices!
      //columnMap[i] = globalIndices[i];
    }
  }

  /** @type {Array.<epiviz.ui.charts.ChartObject>} */
  var items = [];
  var colIndex = {};
  data.foreach(function(m, series, seriesIndex) {
    var nextCellsPerCol = Math.ceil(colnames.length / maxColumns), cellsPerCol = 0;
    var colsLeft = maxColumns;
    for (var i = 0; i < colnames.length; ++i) {
      globalIndex = globalIndices[i];

      var cell = series.getByGlobalIndex(globalIndex);
      if (!cell) { continue; }
      var uiObj = null;
      if (cellsPerCol == 0) {
        var classes = sprintf('item data-series-%s', seriesIndex);

        uiObj = new epiviz.ui.charts.ChartObject(
          sprintf('heatmap_%s_%s', seriesIndex, globalIndex),
          cell.rowItem.start(),
          cell.rowItem.end(),
          [cell.value],
          seriesIndex,
          [[cell]], // valueItems one for each measurement
          [m], // measurements
          classes);
        items.push(uiObj);

        nextCellsPerCol = Math.ceil((colnames.length - i) / colsLeft);
        cellsPerCol = nextCellsPerCol;
        --colsLeft;
      } else {
        uiObj = items[items.length - 1];
        uiObj.id += '_' + globalIndex;
        if (epiviz.measurements.Measurement.Type.isOrdered(series.measurement().type())) {
          uiObj.start = Math.min(uiObj.start, cell.rowItem.start());
          uiObj.end = Math.max(uiObj.end, cell.rowItem.end());
        }
        uiObj.values[0] = (uiObj.values[0] * uiObj.valueItems[0].length + cell.value) / (uiObj.valueItems[0].length + 1);
        uiObj.valueItems[0].push(cell);
      }

      if (seriesIndex == 0) {
        colIndex[globalIndex] = items.length - 1;
      }

      --cellsPerCol;
    }
  });

  var colorLabelsMap;
  var colorScales;
  this._min = this.customSettingsValues()[epiviz.ui.charts.Visualization.CustomSettings.Y_MIN];
  this._max = this.customSettingsValues()[epiviz.ui.charts.Visualization.CustomSettings.Y_MAX];
  var CustomSetting = epiviz.ui.charts.CustomSetting;
  if (this._min == CustomSetting.DEFAULT) { this._min = data.measurements()[0].minValue(); }
  if (this._max == CustomSetting.DEFAULT) { this._max = data.measurements()[0].maxValue(); }
  if (this._globalIndexColorLabels) {
    colorLabelsMap = {};
    for (var j = firstGlobalIndex; j < lastGlobalIndex; ++j) {
      colorLabelsMap[this._globalIndexColorLabels[j]] = this._globalIndexColorLabels[j];
    }
    this._colorLabels = Object.keys(colorLabelsMap);
    colorScales = {};
    this._colorLabels.forEach(function(label, i) {
      var color = self.colors().getByKey(label);
      colorScales[label] = epiviz.utils.colorizeBinary(self._min, self._max, '#ffffff', color);
    });
  } else {
    this._colorLabels = [
      sprintf('Max', data.firstSeries().measurement().maxValue())
    ];
    this._colorScale = epiviz.utils.colorizeBinary(this._min, this._max, '#ffffff', this.colors().getByKey('Max'));
  }

  var nCols = Math.min(colnames.length, maxColumns);
  var cellWidth = nCols ? (width - this.margins().sumAxis(Axis.X)) / nCols : 0;
  var cellHeight = (height - this.margins().sumAxis(Axis.Y)) / data.measurements().length;

  var itemsGroup = this._chartContent.select('.items');

  if (itemsGroup.empty()) {
    itemsGroup = this._chartContent.append('g')
      .attr('class', 'items');
    var selectedGroup = itemsGroup.append('g').attr('class', 'selected');
    itemsGroup.append('g').attr('class', 'hovered');
    selectedGroup.append('g').attr('class', 'hovered');
  }

  itemsGroup.attr('transform', 'translate(' + this.margins().left() + ', ' + this.margins().top() + ')');

  var selection = itemsGroup.selectAll('rect').data(items, function(d) { return d.id; });

  selection
    .enter()
    .append('rect')
    .attr('id', function (d) {
      return sprintf('%s-item-%s-%s', self.id(), d.seriesIndex, d.valueItems[0][0].globalIndex);
    })
    .attr('class', function(d) { return d.cssClasses; })
    .style('opacity', 0)
    .style('fill-opacity', 0)
    .attr('x', function(d) { return cellWidth * colIndex[d.valueItems[0][0].globalIndex]; })
    .attr('y', function(d) { return cellHeight * d.seriesIndex; })
    .attr('width', cellWidth)
    .attr('height', cellHeight)
    .style('fill', function(d, i) {
      if (!self._globalIndexColorLabels) { return self._colorScale(d.values[0]); }
      return colorScales[self._globalIndexColorLabels[d.valueItems[0][0].globalIndex]](d.values[0]);
    });

  selection
    .transition()
    .duration(1000)
    .style('fill-opacity', null)
    .style('opacity', null)
    .attr('x', function(d) {
      return cellWidth * colIndex[d.valueItems[0][0].globalIndex];
    })
    .attr('y', function(d) { return cellHeight * d.seriesIndex; })
    .attr('width', cellWidth)
    .attr('height', cellHeight)
    .style('fill', function(d) {
      if (!self._globalIndexColorLabels) { return self._colorScale(d.values[0]); }
      return colorScales[self._globalIndexColorLabels[d.valueItems[0][0].globalIndex]](d.values[0]);
    });

  selection
    .exit()
    .transition()
    .duration(1000)
    .style('opacity', 0)
    .remove();

  selection
    .on('mouseover', function (d) {
      self._hover.notify(new epiviz.ui.charts.VisEventArgs(self.id(), d));
      self._dispatch.hover(self.id(), d);
    })
    .on('mouseout', function () {
      self._unhover.notify(new epiviz.ui.charts.VisEventArgs(self.id()));
      self._dispatch.hover(self.id(), null);
    })
    .on('click', function (d) {
      self._deselect.notify(new epiviz.ui.charts.VisEventArgs(self.id()));
      self._select.notify(new epiviz.ui.charts.VisEventArgs(self.id(), d));
      d3.event.stopPropagation();
      self._dispatch.click(self.id(), d);
    });

  this._drawLabels(itemsGroup, colnames, globalIndices, nCols, rows, cellWidth, cellHeight, firstGlobalIndex, width);

  return items;
};

/**
 * @param {epiviz.ui.charts.transform.clustering.ClusterTree} dendrogram
 * @param {number} top
 * @param {number} left
 * @param {number} height
 * @param {number} width
 * @param {boolean} [horizontal]
 * @private
 */
epiviz.plugins.charts.HeatmapPlot.prototype._drawDendrogram = function(dendrogram, top, left, height, width, horizontal) {
  var dendClass = horizontal ? 'dendrogram-horizontal' : 'dendrogram-vertical';
  var showLabels = false;

  var dendContainer = this._svg.append('g').attr('class', dendClass);

  if (!horizontal) {
    dendContainer.attr('transform', 'translate(' + left + ',' + top + ')');
    this._drawSubDendrogram(this._svg.select('.' + dendClass), dendrogram.root(), 0, 0, width, height, showLabels);
  } else {
    dendContainer.attr('transform', 'translate(' + left + ',' + top + ')scale(-1, 1)rotate(90, 0, 0)');
    this._drawSubDendrogram(this._svg.select('.' + dendClass), dendrogram.root(), 0, 0, width, height, showLabels);
  }
};

/**
 * @param svg
 * @param {epiviz.ui.charts.transform.clustering.ClusterNode} node
 * @param {number} top
 * @param {number} left
 * @param {number} width
 * @param {number} height
 * @param {boolean} showLabels
 * @private
 */
epiviz.plugins.charts.HeatmapPlot.prototype._drawSubDendrogram = function(svg, node, top, left, width, height, showLabels) {
  var children = node.children();
  if (children.length == 0) {
    return top + height * 0.5;
  }

  var xScale = d3.scale.linear()
    .domain([0, node.distance()])
    .range([0, width]);
  var nextTop = 0;
  var firstY, lastY;
  for (var i = 0; i < children.length; ++i) {
    var childTop = top + nextTop;
    var childHeight = (height / node.weight()) * children[i].weight();
    var childWidth = xScale(children[i].distance());

    var yCenter = this._drawSubDendrogram(
      svg,
      children[i],
      childTop,
      left,
      childWidth,
      childHeight,
      showLabels);

    svg.append('line')
      .attr('x1', left + childWidth)
      .attr('x2', left + width)
      .attr('y1', yCenter)
      .attr('y2', yCenter)
      .style('stroke', '#555555')
      .style('stroke-width', 1)
      .style('shape-rendering', 'auto');

    if (i == 0 && showLabels) {
      svg.append('text')
        .attr('class', 'row-text')
        .attr('x', Math.max(left + 10, left + (childWidth + width) * 0.5))
        .attr('y', yCenter - 10)
        .style('text-anchor', 'middle')
        .text(Globalize.format(node.distance(), 'n2'));
    }

    if (firstY == undefined || firstY > yCenter) {
      firstY = yCenter;
    }

    if (lastY == undefined || lastY < yCenter) {
      lastY = yCenter;
    }

    nextTop += (height / node.weight()) * children[i].weight();
  }

  svg.append('line')
    .attr('x1', left + width)
    .attr('x2', left + width)
    .attr('y1', firstY)
    .attr('y2', lastY)
    .style('stroke', '#555555')
    .style('stroke-width', 1)
    .style('shape-rendering', 'auto');

  return (firstY + lastY) * 0.5;
};

/**
 * @param itemsGroup D3 selection
 * @param {Array.<string>} colnames
 * @param {Object.<number, number>} columnMap
 * @param {number} nCols
 * @param {Array.<epiviz.measurements.Measurement>} rows
 * @param {number} cellWidth
 * @param {number} cellHeight
 * @param {number} firstGlobalIndex
 * @param {number} width
 * @private
 */
epiviz.plugins.charts.HeatmapPlot.prototype._drawLabels = function(itemsGroup, colnames, columnMap, nCols, rows, cellWidth, cellHeight, firstGlobalIndex, width) {

  var self = this;

  var mapCol = function(i, centered) {
    return i * cellWidth + ((centered) ? 0.5 * cellWidth : 0);
  };

  var mapRow = function(i, centered) {
    return i * cellHeight + ((centered) ? cellHeight * 0.5 : 0);
  };

  var measurementLabel = function(m) {
    var label;
    if (rowLabel == 'name') { label = m.name(); }
    else {
      var anno = m.annotation();
      if (!anno || !(rowLabel in anno)) { label = '<NA>'; }
      else { label = anno[rowLabel]; }
    }
    rowLabelMap[label] = label;
    return label;
  };

  // Column names
  var colSelection = itemsGroup.selectAll('.col-text');

  var maxColSize = 0;
  if (colnames.length > nCols) {
    colSelection
      .transition()
      .duration(500)
      .style('opacity', 0)
      .remove();
  } else {
    colSelection = colSelection
      .data(colnames, function(d, i) { return d + columnMap[i]; });

    colSelection
      .enter()
      .append('text')
      .attr('class', 'col-text')
      .style('opacity', '0')
      .attr('x', 0)
      .attr('y', 0)
      .attr('transform', function(d, i){
        return 'translate(' + (mapCol(i, true))  + ',' + (-5) + ')rotate(-60)';
      })
      .text(function(d){ return d; });

    colSelection
      .transition()
      .duration(500)
      .attr('x', 0)
      .attr('y', 0)
      .attr('transform', function(d, i){
        return 'translate(' + (mapCol(i, true))  + ',' + (-5) + ')rotate(-60)';
      })
      .style('opacity', null)
      .attr('fill', function(colName, i) {
        var globalIndex = i + firstGlobalIndex;
        if (!self._globalIndexColorLabels) { return '#000000'; }
        return self.colors().getByKey(self._globalIndexColorLabels[globalIndex]);
      });

    colSelection
      .exit()
      .transition()
      .duration(500)
      .style('opacity', 0)
      .remove();

    $('#' + this.id() + ' .col-text')
      .each(function(i) {
        var textWidth = this.getBBox().width;
        if (maxColSize < textWidth) { maxColSize = textWidth; }
      });
  }

  // Row names

  var rowLabel = this.customSettingsValues()[epiviz.ui.charts.Visualization.CustomSettings.ROW_LABEL];
  var rowLabelsAsColors = this.customSettingsValues()[epiviz.plugins.charts.HeatmapPlotType.CustomSettings.SHOW_COLORS_FOR_ROW_LABELS];

  if (!rowLabelsAsColors) {
    itemsGroup.selectAll('.row-color-label').remove();
    var rowSelection = itemsGroup.selectAll('.row-text')
      .data(rows, function(m) { return m.id(); });

    rowSelection
      .enter()
      .append('text')
      .attr('class', 'row-text')
      .attr('x', 0)
      .attr('y', 0)
      .attr('transform', function(d, i){
        return 'translate(' + (-5) + ',' + (mapRow(i, true)) + ')rotate(30)';
      });

    rowSelection
      .text(function(m){
        if (rowLabel == 'name') { return m.name(); }
        var anno = m.annotation();
        if (!anno || !(rowLabel in anno)) { return '<NA>'; }
        return anno[rowLabel];
      });

    rowSelection
      .transition()
      .duration(500)
      .attr('x', 0)
      .attr('y', 0)
      .attr('transform', function(d, i){
        return 'translate(' + (-5) + ',' + (mapRow(i, true)) + ')rotate(30)';
      });

    rowSelection.exit().remove();
  }

  var rowLabelCat;
  if (rowLabelsAsColors) {
    itemsGroup.selectAll('.row-text').remove();
    var rowLabelMap = {};
    rows.forEach(function(m) {
      var label = measurementLabel(m);
      rowLabelMap[label] = label;
    });
    rowLabelCat = Object.keys(rowLabelMap);

    var rowColorLabels = itemsGroup.selectAll('.row-color-label')
      .data(rows, function(m) { return m.id(); });

    rowColorLabels
      .enter()
      .append('rect')
      .attr('class', 'row-color-label')
      .attr('x', width - self.margins().sumAxis(epiviz.ui.charts.Axis.X))
      .attr('y', -cellHeight*0.5)
      .attr('width', 20)// TODO: Use a custom variable
      .attr('height', cellHeight)
      .attr('transform', function(d, i){
        return 'translate(' + (0) + ',' + (mapRow(i, true)) + ')';
      });

    rowColorLabels
      .style('fill', function(m) {
        var label = measurementLabel(m);
        return self.colors().getByKey(label);
      });

    rowColorLabels
      .transition()
      .duration(500)
      .attr('x', width - self.margins().sumAxis(epiviz.ui.charts.Axis.X))
      .attr('y', -cellHeight*0.5)
      .attr('height', cellHeight)
      .attr('transform', function(d, i){
        return 'translate(' + (0) + ',' + (mapRow(i, true)) + ')';
      });

    rowColorLabels.exit().remove();
  }

  // Legend
  this._svg.selectAll('.chart-title').remove();
  this._svg.selectAll('.chart-title-color ').remove();
  var titleEntries = this._svg
    .selectAll('.chart-title')
    .data(['Min'].concat(this._colorLabels));
  titleEntries
    .enter()
    .append('text')
    .attr('class', 'chart-title')
    .attr('font-weight', 'bold')
    .attr('y', self.margins().top() - 5 - maxColSize);
  titleEntries
    .attr('fill', function(label, i) {
      if (i == 0) { return '#000000'; }
      return self.colors().getByKey(label);
    })
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
    .data(['Min'].concat(this._colorLabels))
    .enter()
    .append('circle')
    .attr('class', 'chart-title-color')
    .attr('cx', function(column, i) { return self.margins().left() + 4 + titleEntriesStartPosition[i]; })
    .attr('cy', self.margins().top() - 9 - maxColSize)
    .attr('r', 4)
    .style('shape-rendering', 'auto')
    .style('stroke-width', '0')
    .attr('fill', function(label, i) {
      if (i == 0) { return '#ffffff'; }
      return self.colors().getByKey(label);
    })
    .style('stroke-width', function(label, i) { return i ? 0 : 1; })
    .style('stroke', '#000000');

  // Row labels legend

  this._svg.selectAll('.row-legend').remove();
  this._svg.selectAll('.row-legend-color').remove();
  if (rowLabelsAsColors) {
    // TODO: Make this optional
    //rowLabelCat.sort();
    var textEntries = this._svg
      .selectAll('.row-legend')
      .data(rowLabelCat);
    textEntries
      .enter()
      .append('text')
      .attr('class', 'row-legend')
      .attr('font-weight', 'bold')
      .attr('x', -20);
    textEntries
      .attr('fill', function(label) {
        return self.colors().getByKey(label);
      })
      .text(function(label) { return label; })
      .attr('transform', function(d, i){
        return 'translate(' + (self.margins().left()) + ',' + (self.margins().top()) + ')';
      });

    textEntries.attr('y', function(label, i) {
      return 10 + i * 15;
    });

    this._svg
      .selectAll('.row-legend-color')
      .data(rowLabelCat)
      .enter()
      .append('rect')
      .attr('class', 'chart-title-color')
      .attr('x', -18)
      .attr('y', function(label, i) { return 2 + i * 15})
      .attr('width', 10)
      .attr('height', 10)
      .style('shape-rendering', 'auto')
      .style('stroke-width', '0')
      .attr('fill', function(label) { return self.colors().getByKey(label); })
      .style('stroke-width', 0)
      .attr('transform', function(d, i){
        return 'translate(' + (self.margins().left()) + ',' + (self.margins().top()) + ')';
      });

    this._colorLabels = this._colorLabels.concat(rowLabelCat)
  }
};

/**
 * @returns {Array.<{name: string, color: string}>}
 */
epiviz.plugins.charts.HeatmapPlot.prototype.colorLabels = function() {
  return this._colorLabels;
};


/***/ }),
/* 2 */
/***/ (function(module, exports) {

/**
 * Created by Florin Chelaru ( florinc [at] umd [dot] edu )
 * Date: 4/14/14
 * Time: 11:37 AM
 */

goog.provide('epiviz.ui.charts.transform.clustering.AgglomerativeClustering');

/**
 * @constructor
 * @implements {epiviz.ui.charts.transform.clustering.HierarchicalClusteringAlgorithm}
 */
epiviz.ui.charts.transform.clustering.AgglomerativeClustering = function() {};

/**
 * @param {Array.<Array.<number>>} data
 * @param {epiviz.ui.charts.transform.clustering.ClusteringMetric} metric
 * @param {epiviz.ui.charts.transform.clustering.ClusteringLinkage} linkage
 * @returns {epiviz.ui.charts.transform.clustering.ClusterTree}
 */
epiviz.ui.charts.transform.clustering.AgglomerativeClustering.prototype.cluster = function(data, metric, linkage) {
  var i, j;
  var distances = new Array(data.length);
  for (i = 0; i < data.length; ++i) {
    distances[i] = new Array(data.length);

    for (j = i + 1; j < data.length; ++j) {
      distances[i][j] = metric.distance(data[i], data[j]);
    }
  }

  var nodes = [];
  for (i = 0; i < data.length; ++i) {
    nodes.push(new epiviz.ui.charts.transform.clustering.ClusterLeaf(i));
  }

  while (nodes.length > 1) {
    /** @type {{min: number, index: Array}} */
    var minInfo = epiviz.utils.indexOfMin(distances, true);
    var indices = minInfo.index;
    var node = new epiviz.ui.charts.transform.clustering.ClusterSubtree([nodes[indices[0]], nodes[indices[1]]], minInfo.min);
    if (indices[0] < indices[1]) {
      var aux = indices[0];
      indices[0] = indices[1];
      indices[1] = aux;
    }
    nodes.splice(indices[0], 1);
    nodes.splice(indices[1], 1);
    nodes.push(node);
    distances = linkage.link(distances, indices);
  }

  return new epiviz.ui.charts.transform.clustering.ClusterTree(nodes[0], data);
};

/**
 * @returns {string}
 */
epiviz.ui.charts.transform.clustering.AgglomerativeClustering.prototype.id = function() { return 'agglomerative'; };


/***/ }),
/* 3 */
/***/ (function(module, exports) {

/**
 * Created by Florin Chelaru ( florinc [at] umd [dot] edu )
 * Date: 4/14/14
 * Time: 11:35 AM
 */

goog.provide('epiviz.ui.charts.transform.clustering.ClusterLeaf');

/**
 * @param {number} dataIndex
 * @constructor
 * @implements {epiviz.ui.charts.transform.clustering.ClusterNode}
 */
epiviz.ui.charts.transform.clustering.ClusterLeaf = function(dataIndex) {
  /**
   * @type {number}
   * @private
   */
  this._dataIndex = dataIndex;
};

/**
 * @returns {number}
 */
epiviz.ui.charts.transform.clustering.ClusterLeaf.prototype.weight = function() { return 1; };

/**
 * @returns {Array.<epiviz.ui.charts.transform.clustering.ClusterNode>}
 */
epiviz.ui.charts.transform.clustering.ClusterLeaf.prototype.children = function() { return []; };

/**
 * The indices of the data stored
 * @returns {Array.<number>}
 */
epiviz.ui.charts.transform.clustering.ClusterLeaf.prototype.data = function() { return [this._dataIndex]; };

/**
 */
epiviz.ui.charts.transform.clustering.ClusterLeaf.prototype.sort = function() {};

/**
 * @returns {epiviz.ui.charts.transform.clustering.ClusterNode}
 */
epiviz.ui.charts.transform.clustering.ClusterLeaf.prototype.copy = function() { return new epiviz.ui.charts.transform.clustering.ClusterLeaf(this._dataIndex); };

/**
 * @returns {number}
 */
epiviz.ui.charts.transform.clustering.ClusterLeaf.prototype.distance = function() { return 0; };

/**
 * @returns {boolean}
 */
epiviz.ui.charts.transform.clustering.ClusterLeaf.prototype.sorted = function() { return true; };


/***/ }),
/* 4 */
/***/ (function(module, exports) {

/**
 * Created by Florin Chelaru ( florinc [at] umd [dot] edu )
 * Date: 4/14/14
 * Time: 11:30 AM
 */

goog.provide('epiviz.ui.charts.transform.clustering.ClusterNode');

/**
 * @interface
 */
epiviz.ui.charts.transform.clustering.ClusterNode = function() {};

/**
 * @returns {number}
 */
epiviz.ui.charts.transform.clustering.ClusterNode.prototype.weight = function() {};

/**
 * @returns {Array.<epiviz.ui.charts.transform.clustering.ClusterNode>}
 */
epiviz.ui.charts.transform.clustering.ClusterNode.prototype.children = function() {};

/**
 * The indices of the data stored
 * @returns {Array.<number>}
 */
epiviz.ui.charts.transform.clustering.ClusterNode.prototype.data = function() {};

/**
 * @param {boolean} [recursive]
 */
epiviz.ui.charts.transform.clustering.ClusterNode.prototype.sort = function(recursive) {};

/**
 * @returns {epiviz.ui.charts.transform.clustering.ClusterNode}
 */
epiviz.ui.charts.transform.clustering.ClusterNode.prototype.copy = function() {};

/**
 * @returns {number}
 */
epiviz.ui.charts.transform.clustering.ClusterNode.prototype.distance = function() {};

/**
 * @returns {boolean}
 */
epiviz.ui.charts.transform.clustering.ClusterNode.prototype.sorted = function() {};


/***/ }),
/* 5 */
/***/ (function(module, exports) {

/**
 * Created by Florin Chelaru ( florinc [at] umd [dot] edu )
 * Date: 4/14/14
 * Time: 11:33 AM
 */

goog.provide('epiviz.ui.charts.transform.clustering.ClusterSubtree');

/**
 * @param {Array.<epiviz.ui.charts.transform.clustering.ClusterNode>} children
 * @param {number} distance
 * @constructor
 * @implements {epiviz.ui.charts.transform.clustering.ClusterNode}
 */
epiviz.ui.charts.transform.clustering.ClusterSubtree = function(children, distance) {
  /**
   * @type {Array.<epiviz.ui.charts.transform.clustering.ClusterNode>}
   * @private
   */
  this._children = children;

  /**
   * @type {?number}
   * @private
   */
  this._weight = null;

  /**
   * @type {number}
   * @private
   */
  this._distance = distance;

  /**
   * @type {boolean}
   * @private
   */
  this._sorted = false;
};

/**
 * @returns {number}
 */
epiviz.ui.charts.transform.clustering.ClusterSubtree.prototype.weight = function() {
  if (this._weight == undefined) {
    var weight = 0;
    for (var i = 0; i < this._children.length; ++i) {
      weight += this._children[i].weight();
    }
    this._weight = weight;
  }

  return this._weight;
};

/**
 * @returns {Array.<epiviz.ui.charts.transform.clustering.ClusterNode>}
 */
epiviz.ui.charts.transform.clustering.ClusterSubtree.prototype.children = function() { return this._children; };

/**
 * The indices of the data stored
 * @returns {Array.<number>}
 */
epiviz.ui.charts.transform.clustering.ClusterSubtree.prototype.data = function() {
  var ret = [];
  for (var i = 0; i < this._children.length; ++i) {
    ret = ret.concat(this._children[i].data());
  }

  return ret;
};

/**
 * @param {boolean} [recursive]
 */
epiviz.ui.charts.transform.clustering.ClusterSubtree.prototype.sort = function(recursive) {
  if (this.sorted()) { return; }

  this._children.sort(function(node1, node2) {
    return node1.weight() - node2.weight();
  });

  if (recursive) {
    for (var i = 0; i < this._children.length; ++i) {
      this._children[i].sort(recursive);
    }

    this._sorted = true;
  }
};

/**
 * @returns {epiviz.ui.charts.transform.clustering.ClusterNode}
 */
epiviz.ui.charts.transform.clustering.ClusterSubtree.prototype.copy = function() {
  var children = [];
  for (var i = 0; i < this._children.length; ++i) {
    children.push(this._children[i].copy());
  }
  return new epiviz.ui.charts.transform.clustering.ClusterSubtree(children);
};

/**
 * @returns {number}
 */
epiviz.ui.charts.transform.clustering.ClusterSubtree.prototype.distance = function() { return this._distance; };

/**
 * @returns {boolean}
 */
epiviz.ui.charts.transform.clustering.ClusterSubtree.prototype.sorted = function() { return this._sorted; };


/***/ }),
/* 6 */
/***/ (function(module, exports) {

/**
 * Created by Florin Chelaru ( florinc [at] umd [dot] edu )
 * Date: 4/14/14
 * Time: 11:28 AM
 */

goog.provide('epiviz.ui.charts.transform.clustering.ClusterTree');

/**
 * @param {epiviz.ui.charts.transform.clustering.ClusterNode} root
 * @param {Array.<Array.<number>>} data
 * @constructor
 */
epiviz.ui.charts.transform.clustering.ClusterTree = function(root, data) {
  /**
   * @type {epiviz.ui.charts.transform.clustering.ClusterNode}
   * @private
   */
  this._root = root;

  /**
   * @type {Array.<Array.<number>>}
   * @private
   */
  this._data = data;
};

/**
 * @returns {epiviz.ui.charts.transform.clustering.ClusterNode}
 */
epiviz.ui.charts.transform.clustering.ClusterTree.prototype.root = function() { return this._root; };

/**
 * @returns {Array.<Array.<number>>}
 */
epiviz.ui.charts.transform.clustering.ClusterTree.prototype.orderedData = function() {
  if (!this._root.sorted()) {
    this._root.sort(true);
  }

  var orderedIndices = this._root.data();
  var orderedData = [];
  for (var i = 0; i < orderedIndices.length; ++i) {
    orderedData.push(this._data[orderedIndices[i]]);
  }

  return orderedData;
};


/***/ }),
/* 7 */
/***/ (function(module, exports) {

/**
 * Created by Florin Chelaru ( florinc [at] umd [dot] edu )
 * Date: 4/14/14
 * Time: 10:17 AM
 */

goog.provide('epiviz.ui.charts.transform.clustering.ClusteringAlgorithmFactory');

/**
 * @param {epiviz.Config} config
 * @constructor
 */
epiviz.ui.charts.transform.clustering.ClusteringAlgorithmFactory = function(config) {
  /**
   * @type {epiviz.Config}
   * @private
   */
  this._config = config;

  /**
   * @type {Object.<string, epiviz.ui.charts.transform.clustering.HierarchicalClusteringAlgorithm>}
   * @private
   */
  this._algorithms = {};

  /**
   * @type {Object.<string, epiviz.ui.charts.transform.clustering.ClusteringMetric>}
   * @private
   */
  this._metrics = {};

  /**
   * @type {Object.<string, epiviz.ui.charts.transform.clustering.ClusteringLinkage>}
   * @private
   */
  this._linkages = {};

  var i;
  for (i = 0; i < config.clustering.algorithms.length; ++i) {
    /** @type {?function(new:epiviz.ui.charts.transform.clustering.HierarchicalClusteringAlgorithm)} */
    var algorithmConstructor = epiviz.utils.evaluateFullyQualifiedTypeName(config.clustering.algorithms[i]);

    /** @type {epiviz.ui.charts.transform.clustering.HierarchicalClusteringAlgorithm} */
    var algorithm = epiviz.utils.applyConstructor(algorithmConstructor);

    this._algorithms[algorithm.id()] = algorithm;
  }

  for (i = 0; i < config.clustering.metrics.length; ++i) {
    /** @type {?function(new:epiviz.ui.charts.transform.clustering.ClusteringMetric)} */
    var metricConstructor = epiviz.utils.evaluateFullyQualifiedTypeName(config.clustering.metrics[i]);

    /** @type {epiviz.ui.charts.transform.clustering.ClusteringMetric} */
    var metric = epiviz.utils.applyConstructor(metricConstructor);

    this._metrics[metric.id()] = metric;
  }

  for (i = 0; i < config.clustering.linkages.length; ++i) {
    /** @type {?function(new:epiviz.ui.charts.transform.clustering.ClusteringLinkage)} */
    var linkageConstructor = epiviz.utils.evaluateFullyQualifiedTypeName(config.clustering.linkages[i]);

    /** @type {epiviz.ui.charts.transform.clustering.ClusteringLinkage} */
    var linkage = epiviz.utils.applyConstructor(linkageConstructor);

    this._linkages[linkage.id()] = linkage;
  }
};

/**
 * @type {?epiviz.ui.charts.transform.clustering.ClusteringAlgorithmFactory}
 * @private
 */
epiviz.ui.charts.transform.clustering.ClusteringAlgorithmFactory._instance = null;

/**
 * @returns {?epiviz.ui.charts.transform.clustering.ClusteringAlgorithmFactory}
 */
epiviz.ui.charts.transform.clustering.ClusteringAlgorithmFactory.instance = function() {
  return epiviz.ui.charts.transform.clustering.ClusteringAlgorithmFactory._instance;
};

/**
 * @param {epiviz.Config} config
 */
epiviz.ui.charts.transform.clustering.ClusteringAlgorithmFactory.initialize = function(config) {
  epiviz.ui.charts.transform.clustering.ClusteringAlgorithmFactory._instance =
    new epiviz.ui.charts.transform.clustering.ClusteringAlgorithmFactory(config);
};

/**
 * @param {string} id
 * @returns {epiviz.ui.charts.transform.clustering.HierarchicalClusteringAlgorithm}
 */
epiviz.ui.charts.transform.clustering.ClusteringAlgorithmFactory.prototype.algorithm = function(id) { return this._algorithms[id]; };

/**
 * @param {string} id
 * @returns {epiviz.ui.charts.transform.clustering.ClusteringMetric}
 */
epiviz.ui.charts.transform.clustering.ClusteringAlgorithmFactory.prototype.metric = function(id) { return this._metrics[id]; };

/**
 * @param {string} id
 * @returns {epiviz.ui.charts.transform.clustering.ClusteringLinkage}
 */
epiviz.ui.charts.transform.clustering.ClusteringAlgorithmFactory.prototype.linkage = function(id) { return this._linkages[id]; };

/**
 * @returns {Array.<string>}
 */
epiviz.ui.charts.transform.clustering.ClusteringAlgorithmFactory.prototype.algorithms = function() { return Object.keys(this._algorithms); };

/**
 * @returns {Array.<string>}
 */
epiviz.ui.charts.transform.clustering.ClusteringAlgorithmFactory.prototype.metrics = function() { return Object.keys(this._metrics); };

/**
 * @returns {Array.<string>}
 */
epiviz.ui.charts.transform.clustering.ClusteringAlgorithmFactory.prototype.linkages = function() { return Object.keys(this._linkages); };


/***/ }),
/* 8 */
/***/ (function(module, exports) {

/**
 * Created by Florin Chelaru ( florinc [at] umd [dot] edu )
 * Date: 4/14/14
 * Time: 11:26 AM
 */

goog.provide('epiviz.ui.charts.transform.clustering.ClusteringLinkage');

/**
 * @interface
 */
epiviz.ui.charts.transform.clustering.ClusteringLinkage = function() {};

/**
 * @param {Array.<Array.<number>>} distances
 * @param {Array.<number>} indices
 * @returns {Array.<Array.<number>>}
 */
epiviz.ui.charts.transform.clustering.ClusteringLinkage.prototype.link = function(distances, indices) {};

/**
 * @returns {string}
 */
epiviz.ui.charts.transform.clustering.ClusteringLinkage.prototype.id = function() {};


/***/ }),
/* 9 */
/***/ (function(module, exports) {

/**
 * Created by Florin Chelaru ( florinc [at] umd [dot] edu )
 * Date: 4/14/14
 * Time: 11:24 AM
 */

goog.provide('epiviz.ui.charts.transform.clustering.ClusteringMetric');

/**
 * @interface
 */
epiviz.ui.charts.transform.clustering.ClusteringMetric = function() {};

/**
 * @param {Array.<number>} item1
 * @param {Array.<number>} item2
 * @returns {number}
 */
epiviz.ui.charts.transform.clustering.ClusteringMetric.prototype.distance = function(item1, item2) {};

/**
 * @returns {string}
 */
epiviz.ui.charts.transform.clustering.ClusteringMetric.prototype.id = function() {};


/***/ }),
/* 10 */
/***/ (function(module, exports) {

/**
 * Created by Florin Chelaru ( florinc [at] umd [dot] edu )
 * Date: 4/14/14
 * Time: 11:53 AM
 */

goog.provide('epiviz.ui.charts.transform.clustering.CompleteLinkage');

/**
 * @constructor
 * @implements {epiviz.ui.charts.transform.clustering.ClusteringLinkage}
 */
epiviz.ui.charts.transform.clustering.CompleteLinkage = function() {};

/**
 * @param {Array.<Array.<number>>} distances
 * @param {Array.<number>} indices
 * @returns {Array.<Array.<number>>}
 */
epiviz.ui.charts.transform.clustering.CompleteLinkage.prototype.link = function(distances, indices) {
  var ret = new Array(distances.length - 1);

  if (indices[0] < indices[1]) {
    var aux = indices[0];
    indices[0] = indices[1];
    indices[1] = aux;
  }

  for (var i = 0, j = 0; i < distances.length; ++i, ++j) {
    if (i == indices[0] || i == indices[1]) {
      --j;
      continue;
    }
    ret[j] = distances[i].slice(0);
    ret[j].splice(indices[0], 1);
    ret[j].splice(indices[1], 1);

    var vals = [
      i < indices[0] ? distances[i][indices[0]] : distances[indices[0]][i],
      i < indices[1] ? distances[i][indices[1]] : distances[indices[1]][i]
    ];
    ret[j].push(Math.max(vals[0], vals[1]));
  }

  ret[ret.length - 1] = new Array(ret.length);

  return ret;
};

/**
 * @returns {string}
 */
epiviz.ui.charts.transform.clustering.CompleteLinkage.prototype.id = function() { return 'complete'; };


/***/ }),
/* 11 */
/***/ (function(module, exports) {

/**
 * Created by Florin Chelaru ( florinc [at] umd [dot] edu )
 * Date: 4/14/14
 * Time: 11:55 AM
 */

goog.provide('epiviz.ui.charts.transform.clustering.EuclideanMetric');

/**
 * @constructor
 * @implements {epiviz.ui.charts.transform.clustering.ClusteringMetric}
 */
epiviz.ui.charts.transform.clustering.EuclideanMetric = function() {};

/**
 * @param {?Array.<number>} item1
 * @param {?Array.<number>} item2
 * @returns {?number}
 */
epiviz.ui.charts.transform.clustering.EuclideanMetric.prototype.distance = function(item1, item2) {
  if (item1 == undefined || item2 == undefined) {
    return null;
  }

  var len = item1.length; // Assume item1.length == item2.length

  var nDimensions = 0;
  var meanDimDif = 0;
  var dist = 0;

  var i;
  for (i = 0; i < len; ++i) {
    if (item1[i] == undefined || item2[i] == undefined) { continue; }

    ++nDimensions;
    var dif = item1[i] - item2[i];
    meanDimDif += dif;
    dist += dif * dif;
  }

  if (nDimensions > 0) {
    meanDimDif /= nDimensions;
  }

  // All undefined dimensions are replaced with the mean dimension difference
  dist += (len - nDimensions) * meanDimDif * meanDimDif;

  return dist;
};

/**
 * @returns {string}
 */
epiviz.ui.charts.transform.clustering.EuclideanMetric.prototype.id = function() { return 'euclidean'; };


/***/ }),
/* 12 */
/***/ (function(module, exports) {

/**
 * Created by Florin Chelaru ( florinc [at] umd [dot] edu )
 * Date: 4/14/14
 * Time: 11:21 AM
 */

goog.provide('epiviz.ui.charts.transform.clustering.HierarchicalClusteringAlgorithm');

/**
 * @interface
 */
epiviz.ui.charts.transform.clustering.HierarchicalClusteringAlgorithm = function() {};

/**
 * @param {Array.<Array.<number>>} data An array of rows representing multidimensional items
 * @param {epiviz.ui.charts.transform.clustering.ClusteringMetric} metric
 * @param {epiviz.ui.charts.transform.clustering.ClusteringLinkage} linkage
 * @returns {epiviz.ui.charts.transform.clustering.ClusterTree}
 */
epiviz.ui.charts.transform.clustering.HierarchicalClusteringAlgorithm.prototype.cluster = function(data, metric, linkage) {};

/**
 * @returns {string}
 */
epiviz.ui.charts.transform.clustering.HierarchicalClusteringAlgorithm.prototype.id = function() {};


/***/ }),
/* 13 */
/***/ (function(module, exports) {

/**
 * Created by Florin Chelaru ( florinc [at] umd [dot] edu )
 * Date: 4/14/14
 * Time: 11:59 AM
 */

goog.provide('epiviz.ui.charts.transform.clustering.NoneClustering');

/**
 * @constructor
 * @implements {epiviz.ui.charts.transform.clustering.HierarchicalClusteringAlgorithm}
 */
epiviz.ui.charts.transform.clustering.NoneClustering = function() {};

/**
 * @param {Array.<Array.<number>>} data
 * @param {epiviz.ui.charts.transform.clustering.ClusteringMetric} metric
 * @param {epiviz.ui.charts.transform.clustering.ClusteringLinkage} linkage
 * @returns {epiviz.ui.charts.transform.clustering.ClusterTree}
 */
epiviz.ui.charts.transform.clustering.NoneClustering.prototype.cluster = function(data, metric, linkage) {
  var nodes = [];
  for (var i = 0; i < data.length; ++i) {
    nodes.push(new epiviz.ui.charts.transform.clustering.ClusterLeaf(i));
  }

  var root = new epiviz.ui.charts.transform.clustering.ClusterSubtree(nodes, 0);

  return new epiviz.ui.charts.transform.clustering.ClusterTree(root, data);
};

/**
 * @returns {string}
 */
epiviz.ui.charts.transform.clustering.NoneClustering.prototype.id = function() { return 'none'; };


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(4);
__webpack_require__(5);
__webpack_require__(3);
__webpack_require__(6);
__webpack_require__(9);
__webpack_require__(8);
__webpack_require__(12);
__webpack_require__(11);
__webpack_require__(10);
__webpack_require__(13);
__webpack_require__(2);
__webpack_require__(7);

__webpack_require__(1);
__webpack_require__(0);

/***/ })
/******/ ]);