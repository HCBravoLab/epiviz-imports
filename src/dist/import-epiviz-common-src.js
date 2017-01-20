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
/******/ 	return __webpack_require__(__webpack_require__.s = 88);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

/**
 * Created by Florin Chelaru ( florinc [at] umd [dot] edu )
 * Date: 1/27/2015
 * Time: 9:47 AM
 */

goog.provide('caja');
goog.provide('epiviz.caja');

caja.initialize = function() {};

/**
 * @param {string} funcStr
 * @param {Object.<string, *>} [args]
 * @returns {epiviz.deferred.Deferred.<function>}
 */
epiviz.caja.cajole = function(funcStr, args) {
  var deferred = new epiviz.deferred.Deferred();

  setTimeout(function() {
    deferred.resolve(eval('(' + funcStr + ')'));
  }, 0);

  return deferred;
};

/**
 * @param {string} scriptUrl
 * @param {Object.<string, *>} [args]
 * @returns {epiviz.deferred.Deferred}
 */
epiviz.caja.run = function(scriptUrl, args) {
  var deferred = new epiviz.deferred.Deferred();

  setTimeout(function() {
    // Adding the script tag to the head as suggested before
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = scriptUrl;

    // Then bind the event to the callback function.
    // There are several events for cross browser compatibility.
    script.onreadystatechange = script.onload = function() {
      deferred.resolve();
    };

    // Fire the loading
    head.appendChild(script);
  }, 0);

  return deferred;
};

/**
 * @param {Array.<string>} scriptUrls
 * @param {Array.<Object.<string, *>>|Object.<string, *>} [args]
 * @returns {epiviz.deferred.Deferred}
 */
epiviz.caja.chain = function(scriptUrls, args) {
  if (!$.isArray(args)) {
    args = epiviz.utils.fillArray(scriptUrls.length, args);
  }
  return epiviz.utils.deferredFor(scriptUrls.length, function(j) {
    return epiviz.caja.run(scriptUrls[j], args[j]);
  });
};

/**
 * @returns {Object.<string, *>}
 */
epiviz.caja.buildChartMethodContext = function() {
  return {
    epiviz: {
      ui: {
        charts: epiviz.ui.charts,
        controls: epiviz.ui.controls
      },
      utils: epiviz.utils,
      plugins: epiviz.plugins,
      measurements: epiviz.measurements,
      events: epiviz.events,
      deferred: epiviz.deferred,
      datatypes: epiviz.datatypes,
      data: {
        DataProvider: epiviz.data.DataProvider,
        Request: epiviz.data.Request,
        Response: epiviz.data.Response,
        WebServerDataProvider: {
          // TODO: In the future, restrict the access to this method, as it can be a risk factor
          // TODO: For now, it is kept here for DataProvider plugins
          makeGetRequest: epiviz.data.WebServerDataProvider.makeGetRequest
        }
      },
      Config: epiviz.Config
    },
    d3: d3,
    $: $,
    sprintf: sprintf,
    goog: goog
  };
};


/***/ }),
/* 1 */
/***/ (function(module, exports) {

/**
 * Created by: Florin Chelaru
 * Date: 10/3/13
 * Time: 12:14 PM
 */

goog.provide('epiviz.Config');

/**
 * @param {*} [settingsMap] A map of settings to override the default settings for the config.
 * @constructor
 */
epiviz.Config = function(settingsMap) {

    /**
     * The server storing all the back-end PHP scripts
     * @type {string}
     */
    this.dataServerLocation = null;

    /**
     * The path of the php script that handles chart saving, relative to dataServerLocation
     * @type {string}
     */
    this.chartSaverLocation = null;

    /**
     * A number between 0 and 1
     * @type {number}
     */
    this.zoominRatio = null;

    /**
     * A number greater than 1
     * @type {number}
     */
    this.zoomoutRatio = null;

    /**
     * A number between 0 and 1
     * @type {number}
     */
    this.navigationStepRatio = null;

    /**
     * The delay in milliseconds between a user command and the command being propagated to the data layer
     * @type {number}
     */
    this.navigationDelay = null;

    /**
     * @type {{
     *    name: string,
     *    content: {
     *      range: {seqName: string, start: number, width: number},
     *      measurements: Array.<{
              id: string, name: string, type: string, datasourceId: string,
              datasourceGroup: string, dataprovider: string, formula: null,
              defaultChartType: string, annotation: ?Object.<string, string>,
              minValue: ?number, maxValue: ?number,
              metadata: ?Array.<string>
            }>,
     *      charts: Object.<epiviz.ui.charts.VisualizationType.DisplayType, Array.<{
     *        id: string,
     *        type: string,
     *        properties: {
     *          width: number, height: number, margins: { top: number, left: number, bottom: number, right: number },
     *          measurements: Array.<number>, colors: Array.<string>, customSettings: Object.<string, string>
     *        }
     *      }>>
     *    }
     * }}
     */
    this.defaultWorkspaceSettings = null;

    /**
     * An array of strings in the following format:
     *   [typename],[arguments], where typename is the name of a type that
     *   extends DataProvider, and arguments is a list of arguments used for
     *   constructing the data provider, separated by comma.
     *
     * @type {Array.<string>}
     */
    this.dataProviders = null;

    /**
     * @type {string}
     */
    this.workspacesDataProvider = null;

    /**
     * @type {boolean}
     */
    this.useCache = true;

    /**
     * @type {string}
     */
    this.useCookie = null;

    /**
     * The time interval used by the cache to clear away unneeded loaded data
     * @type {number}
     */
    this.cacheUpdateIntervalMilliseconds = 30000;

    /**
     * The maximum number of search results to show in the gene search box
     * @type {number}
     */
    this.maxSearchResults = null;

    /**
     * @type {Array.<string>}
     */
    this.chartTypes = null;

    // Default chart properties: these settings map either generic chart display types (plot or track),
    // or specific chart types (for example epiviz.plugins.charts.BlocksTrack) to corresponding
    // configurations.
    //
    // Example:
    // this.chartSettings = {
    //   plot: { width: 400, height: 100 },
    //   'epiviz.plugins.charts.GenesTrack': { height: 150 },
    //   'epiviz.plugins.charts.BlocksTrack': { width: 450, height: 190 }
    // }


    /**
     * @type {Object.<epiviz.ui.charts.VisualizationType.DisplayType|string, Object.<epiviz.Config.VisualizationPropertySettings, *>>}
     */
    this.chartSettings = null;

    /**
     * A map of chart type and settings specific to that particular chart type
     * Example:
     * this.chartCustomSettings = {
     *   'epiviz.plugins.charts.LineTrack': {
     *     maxPoints: 1000
     *   }
     * }
     * @type {Object<string, Object<string, *>>}
     */
    this.chartCustomSettings = null;

    /**
     * @type {{algorithms: Array.<string>, metrics: Array.<string>, linkages: Array.<string>}}
     */
    this.clustering = null;

    /**
     * @type {Array.<epiviz.ui.charts.ColorPalette>}
     */
    this.colorPalettes = null;

    /**
     * @type {Object.<string, epiviz.ui.charts.ColorPalette>}
     */
    this.colorPalettesMap = null;

    // Override settings included in the given object
    if (settingsMap) {
        for (var setting in settingsMap) {
            if (!settingsMap.hasOwnProperty(setting)) {
                continue;
            }
            this[setting] = settingsMap[setting];
        }

        // if(settingsMap.configType != 'epivizr_standalone') {
        //   var socketHosts = epiviz.ui.WebArgsManager.WEB_ARGS['websocket-host'];
        //   if (socketHosts && socketHosts.length) {
        //     for (var i = 0; i < socketHosts.length; ++i) {
        //       this.dataProviders.push(sprintf('epiviz.data.WebsocketDataProvider,%s,%s',
        //           epiviz.data.WebsocketDataProvider.DEFAULT_ID + '-' + i,
        //           socketHosts[i]));
        //     }
        //   }
        // }
    }

    var colorPalettesMap = {};
    this.colorPalettes.forEach(function(palette) {
        colorPalettesMap[palette.id()] = palette;
    });
    this.colorPalettesMap = colorPalettesMap;

    // if (settingsMap.configType != 'default') {
    //     this.useCookie = epiviz.ui.WebArgsManager.WEB_ARGS.useCookie;
    // }
};

/**
 * A map of settings that are used as input for the EpiViz configuration
 * @type {*}
 */
epiviz.Config.SETTINGS = {};

/**
 * @const {string}
 */
epiviz.Config.DEFAULT_DATA_PROVIDER_ID = 'umd';

/**
 * @const {string}
 */
epiviz.Config.DEFAULT_WORKSPACE_NAME = 'Default Workspace';

/**
 * @type {Array.<string>}
 * @const
 */
epiviz.Config.EPIVIZ_V1_COLORS = ['#025167', '#e7003e', '#ffcd00', '#057d9f', '#970026', '#ffe373', '#ff8100'];

/**
 * @type {Array.<string>}
 * @const
 */
epiviz.Config.COLORS_BRIGHT = ['#1859a9', '#ed2d2e', '#008c47', '#010101', '#f37d22', '#662c91', '#a11d20', '#b33893'];

/**
 * @type {Array.<string>}
 * @const
 */
epiviz.Config.COLORS_LIGHT = ['#b8d2eb', '#f2aeac', '#d8e4aa', '#cccccc', '#f2d1b0', '#d4b2d3', '#ddb8a9', '#ebbfd9'];

/**
 * @type {Array.<string>}
 * @const
 */
epiviz.Config.COLORS_MEDIUM = ['#599ad3', '#f1595f', '#79c36a', '#727272', '#f9a65a', '#9e66ab', '#cd7058', '#d77fb3'];

/**
 * @type {Array.<string>}
 * @const
 */
epiviz.Config.COLORS_D3_CAT10 = ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"];

/**
 * @type {Array.<string>}
 * @const
 */
epiviz.Config.COLORS_D3_CAT20 = ["#1f77b4", "#aec7e8", "#ff7f0e", "#ffbb78", "#2ca02c", "#98df8a", "#d62728", "#ff9896", "#9467bd", "#c5b0d5", "#8c564b", "#c49c94", "#e377c2", "#f7b6d2", "#7f7f7f", "#c7c7c7", "#bcbd22", "#dbdb8d", "#17becf", "#9edae5"];

/**
 * @type {Array.<string>}
 * @const
 */
epiviz.Config.COLORS_D3_CAT20B = ["#393b79", "#5254a3", "#6b6ecf", "#9c9ede", "#637939", "#8ca252", "#b5cf6b", "#cedb9c", "#8c6d31", "#bd9e39", "#e7ba52", "#e7cb94", "#843c39", "#ad494a", "#d6616b", "#e7969c", "#7b4173", "#a55194", "#ce6dbd", "#de9ed6"];

/**
 * @type {Array.<string>}
 * @const
 */
epiviz.Config.COLORS_D3_CAT20C = ["#3182bd", "#6baed6", "#9ecae1", "#c6dbef", "#e6550d", "#fd8d3c", "#fdae6b", "#fdd0a2", "#31a354", "#74c476", "#a1d99b", "#c7e9c0", "#756bb1", "#9e9ac8", "#bcbddc", "#dadaeb", "#636363", "#969696", "#bdbdbd", "#d9d9d9"];

/**
 * @enum {string}
 */
epiviz.Config.VisualizationPropertySettings = {
    WIDTH: 'width',
    HEIGHT: 'height',
    MARGINS: 'margins',
    COLORS: 'colors',
    DECORATIONS: 'decorations'
};

/***/ }),
/* 2 */
/***/ (function(module, exports) {

/**
 * Created by Florin Chelaru ( florinc [at] umd [dot] edu )
 * Date: 10/29/13
 * Time: 12:49 PM
 */

goog.provide('epiviz.data.Cache');

/**
 * @param {epiviz.Config} config
 * @param {epiviz.data.DataProviderFactory} dataProviderFactory
 * @constructor
 */
epiviz.data.Cache = function(config, dataProviderFactory) {

  /**
   * @type {epiviz.Config}
   * @private
   */
  this._config = config;

  /**
   * @type {epiviz.data.DataProviderFactory}
   * @private
   */
  this._dataProviderFactory = dataProviderFactory;

  /**
   * @type {Object.<string, epiviz.datatypes.PartialSummarizedExperiment>}
   * @private
   */
  this._data = {};

  /**
   * @type {epiviz.measurements.MeasurementHashtable.<epiviz.data.RequestStack>}
   * @private
   */
  this._measurementRequestStackMap = new epiviz.measurements.MeasurementHashtable();

  /**
   * measurement -> (requestId -> range)
   * @type {epiviz.measurements.MeasurementHashtable.<Object.<number, epiviz.datatypes.GenomicRange>>}
   * @private
   */
  this._measurementPendingRequestsMap = new epiviz.measurements.MeasurementHashtable();

  /**
   * @type {epiviz.datatypes.GenomicRange}
   * @private
   */
  this._lastRequest = null;

  if (this._config.cacheUpdateIntervalMilliseconds > 0) {
    var self = this;
    this._intervalId = window.setTimeout(function() {
      self._clearUnneededData();
    }, config.cacheUpdateIntervalMilliseconds);
  }
};

/**
 * @param {epiviz.datatypes.GenomicRange} range
 * @param {Object.<string, epiviz.measurements.MeasurementSet>} chartMeasurementsMap
 * @param {function(string, epiviz.datatypes.GenomicData)} dataReadyCallback
 */
epiviz.data.Cache.prototype.getData = function(range, chartMeasurementsMap, dataReadyCallback) {
  var MeasurementType = epiviz.measurements.Measurement.Type;

  var self = this;

  this._lastRequest = epiviz.datatypes.GenomicRange.fromStartEnd(
    range.seqName(),
    range.start() - range.width(),
    range.end() + range.width());

  if (this._config.cacheUpdateIntervalMilliseconds > 0) {
    window.clearInterval(this._intervalId);
    this._intervalId = window.setTimeout(function() {
      self._clearUnneededData();
    }, this._config.cacheUpdateIntervalMilliseconds);
  }

  var computedMs = this._extractComputedMeasurements(chartMeasurementsMap);

  this._updateComputedMeasurementsData(computedMs);
  this._serveAvailableData(range, chartMeasurementsMap, dataReadyCallback);

  var requestRanges = [
    range,
    epiviz.datatypes.GenomicRange.fromStartEnd(range.seqName(), Math.max(range.start() - range.width(), 0), range.start()),
    new epiviz.datatypes.GenomicRange(range.seqName(), range.end(), range.width())
  ];

  /**
   * A map of measurements as keys and for each of them, an array of ranges needed
   * @type {epiviz.measurements.MeasurementHashtable.<Array.<epiviz.datatypes.GenomicRange>>}
   */
  var msNeededRanges = this._calcMeasurementNeededRanges(requestRanges, chartMeasurementsMap);

  msNeededRanges.foreach(function(m, ranges) {
    var requestStack = self._measurementRequestStackMap.get(m);
    if (!requestStack) {
      requestStack = new epiviz.data.RequestStack();
      self._measurementRequestStackMap.put(m, requestStack);
    }
    var request;

    if (ranges.length == 0) {
      request = epiviz.data.Request.emptyRequest();
      requestStack.pushRequest(request, function() {
        self._handleResponse(dataReadyCallback, range, chartMeasurementsMap, request, null, m, null);
      });

      // When the pending requests for this measurements come back, this will also pop out
      requestStack.serveData(new epiviz.data.Response(request.id(), {}));
      return; // continue iteration
    }

    for (var i = 0; i < ranges.length; ++i) {
      request = m.type() == MeasurementType.RANGE ?
        epiviz.data.Request.getRows(m, ranges[i]) :
        epiviz.data.Request.getValues(m, ranges[i]);
      (function(r, request) {
        requestStack.pushRequest(request,
          /** @param {{globalStartIndex: number, values: *, useOffset: ?boolean}} data */
          function(data) {
            self._handleResponse(dataReadyCallback, range, chartMeasurementsMap, request, r, m, data);
          });
      })(ranges[i], request);

      var pendingRequests = self._measurementPendingRequestsMap.get(m);
      if (!pendingRequests) {
        pendingRequests = {};
        self._measurementPendingRequestsMap.put(m, pendingRequests);
      }
      pendingRequests[request.id()] = ranges[i];

      var dataProvider = self._dataProviderFactory.get(m.dataprovider()) || self._dataProviderFactory.get(epiviz.data.EmptyResponseDataProvider.DEFAULT_ID);
      dataProvider.getData(request, function(response) {
        requestStack.serveData(response);
      });
    }
  });
};

/**
 * @param {function(string, epiviz.datatypes.GenomicData)} chartDataReadyCallback
 * @param {epiviz.datatypes.GenomicRange} chartRequestedRange
 * @param {Object.<string, epiviz.measurements.MeasurementSet>} chartMeasurementsMap
 * @param {epiviz.data.Request} request
 * @param {?epiviz.datatypes.GenomicRange} range A range corresponding to the current request; this can be different from the chartRequestedRange, and can also
 *   be null in case no real request to the data provider was necessary to retrieve data for this chart
 * @param {epiviz.measurements.Measurement} measurement
 * @param {?{globalStartIndex: number, values: *, useOffset: ?boolean}} rawData
 * @private
 */
epiviz.data.Cache.prototype._handleResponse = function(chartDataReadyCallback, chartRequestedRange, chartMeasurementsMap, request, range, measurement, rawData) {

  if (range) {
    var genomicArray = measurement.type() == epiviz.measurements.Measurement.Type.RANGE ?
      new epiviz.datatypes.GenomicRangeArray(measurement, range, rawData.globalStartIndex, rawData.values, rawData.useOffset) :
      new epiviz.datatypes.FeatureValueArray(measurement, range, rawData.globalStartIndex, rawData.values);
    this._mergeData(measurement, genomicArray);
  }

  var computedMs = this._extractComputedMeasurements(chartMeasurementsMap);
  this._updateComputedMeasurementsData(computedMs);

  var pendingRequests = this._measurementPendingRequestsMap.get(measurement);
  if (pendingRequests) {
    delete pendingRequests[request.id()];
  }

  this._serveAvailableData(chartRequestedRange, chartMeasurementsMap, chartDataReadyCallback);
};

/**
 * Look through charts; if there is one for which we have the whole needed data, serve it by calling
 * dataReadyCallback(chartId, data). Then, remove that particular chart from the map.
 *
 * @param {epiviz.datatypes.GenomicRange} range
 * @param {Object.<string, epiviz.measurements.MeasurementSet>} chartMeasurementsMap
 * @param {function(string, epiviz.datatypes.GenomicData)} dataReadyCallback
 * @private
 */
epiviz.data.Cache.prototype._serveAvailableData = function(range, chartMeasurementsMap, dataReadyCallback) {
  var MeasurementType = epiviz.measurements.Measurement.Type;
  var self = this;

  var servedChartIds = [];

  for (var chartId in chartMeasurementsMap) {
    if (!chartMeasurementsMap.hasOwnProperty(chartId)) { continue; }

    var chartMeasurements = chartMeasurementsMap[chartId];
    var allDataAvailable = true;
    /** @type {epiviz.measurements.MeasurementHashtable.<epiviz.datatypes.MeasurementGenomicData>} */
    var chartData = new epiviz.measurements.MeasurementHashtable();
    (function(chartData) {
      chartMeasurements.foreach(function(m) {
        var storedData = self._data[m.datasourceGroup()];
        if (!storedData || !storedData.rowData() || (m.type() == MeasurementType.FEATURE && !storedData.values(m))) {
          allDataAvailable = false;
          return true; // Break!
        }
        var rowData = storedData.rowData();
        var valueData = (m.type() == MeasurementType.FEATURE) ? storedData.values(m) : null;
        var neededRanges = range.subtract(rowData.boundaries());
        if (neededRanges.length) {
          allDataAvailable = false;
          return true; // Break;
        }

        if (valueData) {
          neededRanges = range.subtract(valueData.boundaries());
          if (neededRanges.length) {
            allDataAvailable = false;
            return true; // Break!
          }
        }

        chartData.put(m, new epiviz.datatypes.MeasurementGenomicDataWrapper(m, self._data[m.datasourceGroup()]));

        return false;
      });
    }(chartData));

    if (allDataAvailable) {
      dataReadyCallback(chartId, new epiviz.datatypes.MapGenomicData(chartData));
      servedChartIds.push(chartId);
    }
  }

  for (var i = 0; i < servedChartIds.length; ++i) {
    delete chartMeasurementsMap[servedChartIds[i]];
  }
};

/**
 * @param {Array.<epiviz.datatypes.GenomicRange>} ranges
 * @param {Object.<string, epiviz.measurements.MeasurementSet>} chartMeasurementsMap
 * @return {epiviz.measurements.MeasurementHashtable.<Array.<epiviz.datatypes.GenomicRange>>}
 * @private
 */
epiviz.data.Cache.prototype._calcMeasurementNeededRanges = function(ranges, chartMeasurementsMap) {
  var MeasurementType = epiviz.measurements.Measurement.Type;
  var self = this;

  /** @type {epiviz.measurements.MeasurementHashtable.<Array.<epiviz.datatypes.GenomicRange>>} */
  var result = new epiviz.measurements.MeasurementHashtable();

  for (var chartId in chartMeasurementsMap) {
    if (!chartMeasurementsMap.hasOwnProperty(chartId)) { continue; }

    var chartMeasurements = new epiviz.measurements.MeasurementSet();

    (function(chartMeasurements) {
      chartMeasurementsMap[chartId].foreach(function(m) {
        var compMs = m.componentMeasurements();
        compMs.foreach(function(compM) {
          chartMeasurements.add(compM);
          chartMeasurements.add(compM.datasource());
        });

        if (!m.isComputed()) {
          chartMeasurements.add(m.datasource());
        }
      });
    })(chartMeasurements);

    chartMeasurements.foreach(function(m) {
      var neededRanges = null;

      /** @type {?epiviz.datatypes.PartialSummarizedExperiment} */
      var storedData = self._data[m.datasourceGroup()];
      if (!storedData || (m.type() == MeasurementType.FEATURE && !storedData.values(m))) {
        neededRanges = ranges.slice(0); // copy array
      } else {
        /** @type {epiviz.datatypes.GenomicArray} */
        var data = (m.type() == MeasurementType.FEATURE) ? storedData.values(m) : storedData.rowData();
        if (!data) {
          neededRanges = ranges.slice(0); // copy array
        } else {
          neededRanges = [];
          var boundaries = data.boundaries();
          for (var i = 0; i < ranges.length; ++i) {
            neededRanges = neededRanges.concat(ranges[i].subtract(boundaries));
          }
        }
      }

      // Also check pending requests

      /** @type {?Object.<number, epiviz.datatypes.GenomicRange>} */
      var pendingRequests = self._measurementPendingRequestsMap.get(m);

      if (pendingRequests) {
        for (var j = 0; j < neededRanges.length; ++j) {
          for (var requestId in pendingRequests) {
            if (!pendingRequests.hasOwnProperty(requestId)) { continue; }

            /** @type {Array.<epiviz.datatypes.GenomicRange>} */
            var dif = neededRanges[j].subtract(pendingRequests[requestId]);

            // Now replace neededRanges[j] with dif
            Array.prototype.splice.apply(neededRanges, [j, 1].concat(dif));

            if (dif.length == 0) {
              --j;
              break;
            }

            if (j >= neededRanges.length) { break; }
          }
        }
      }

      // It is very important that, even if there are no needed ranges, we still put the empty
      // array in the hashtable, because there will still be a pseudo-request corresponding to it
      result.put(m, neededRanges);
    });
  }

  return result;
};

/**
 * @param {Object.<string, epiviz.measurements.MeasurementSet>} chartMeasurementsMap
 * @returns {epiviz.measurements.MeasurementSet}
 * @private
 */
epiviz.data.Cache.prototype._extractComputedMeasurements = function(chartMeasurementsMap) {
  var result = new epiviz.measurements.MeasurementSet();
  for (var chartId in chartMeasurementsMap) {
    if (!chartMeasurementsMap.hasOwnProperty(chartId)) { continue; }
    chartMeasurementsMap[chartId].foreach(function(m) {
      if (m.isComputed()) { result.add(m); }
    });
  }

  return result;
};

/**
 * @param {epiviz.measurements.Measurement} measurement
 * @param {epiviz.datatypes.GenomicArray} data
 * @private
 */
epiviz.data.Cache.prototype._mergeData = function(measurement, data) {
  var MeasurementType = epiviz.measurements.Measurement.Type;
  var storedData = this._data[measurement.datasourceGroup()];
  if (!storedData) {
    storedData = new epiviz.datatypes.PartialSummarizedExperiment();
    this._data[measurement.datasourceGroup()] = storedData;
  }

  if (measurement.type() == MeasurementType.RANGE) {
    storedData.addRowData(/** @type {epiviz.datatypes.GenomicRangeArray} */ data);
    return;
  }

  // FEATURE
  storedData.addValues(/** @type {epiviz.datatypes.FeatureValueArray} */ data);
};

/**
 * @private
 */
epiviz.data.Cache.prototype._clearUnneededData = function() {
  if (!this._lastRequest) { return; }
  console.log(sprintf('Clearing data outside of range [%7s%10s%10s]', this._lastRequest.seqName(), this._lastRequest.start(), this._lastRequest.end()));

  var self = this;
  var newData = {};
  for (var datasourceGroup in this._data) {
    if (!this._data.hasOwnProperty(datasourceGroup)) { continue; }
    var exp = this._data[datasourceGroup];
    newData[datasourceGroup] = exp.trim(self._lastRequest);
  }

  this._data = newData;
};

/**
 * @param {epiviz.measurements.MeasurementSet} computedMs
 * @private
 */
epiviz.data.Cache.prototype._updateComputedMeasurementsData = function(computedMs) {
  var self = this;
  var GenomicRange = epiviz.datatypes.GenomicRange;
  computedMs.foreach(function(cm) {
    // First, see if there is new data for all of the component measurements of m

    /** @type {?epiviz.datatypes.PartialSummarizedExperiment} */
    var storedData = self._data[cm.datasourceGroup()];
    if (!storedData) { return false; } // Continue

    /** @type {epiviz.measurements.MeasurementSet} */
    var componentMeasurements = cm.componentMeasurements();

    /** @type {?number} */
    var globalStartIndex = null;

    /** @type {?number} */
    var size = null;

    /** @type {?epiviz.datatypes.GenomicRange} */
    var  boundaries = null;

    componentMeasurements.foreach(function(m) {
      /** @type {epiviz.datatypes.FeatureValueArray} */
      var values = storedData.values(m);

      if (!values || !values.boundaries()) {
        globalStartIndex = null;
        size = null;
        boundaries = null;
        return true; // break: there is not enough data to compute the measurement
      }

      if (boundaries === null) {
        globalStartIndex = values.globalStartIndex();
        size = values.size();
        boundaries = values.boundaries();

        // if globalStartIndex === null then break:
        //   this means either that there is not enough data loaded to
        //   compute the measurement (if boundaries is also null),
        //   or the current range simply doesn't contain any data.
        // otherwise, continue iteration
        return (globalStartIndex === null);
      }

      if (values.boundaries().seqName() != boundaries.seqName()) {
        // The stored data for the component measurements belongs to different chromosomes,
        // so the computed measurement cannot be computed yet.
        size = 0;
        return true;
      }

      if (globalStartIndex < values.globalStartIndex()) {
        size -= values.globalStartIndex() - globalStartIndex;
        if (size < 0) {
          // This means that the global start index for one of the component measurements begins
          // after the end of another, which means that the computed measurement cannot be computed yet.
          size = 0;
          return true;
        }
        globalStartIndex = values.globalStartIndex();
        var start = values.boundaries().start(), end = boundaries.end();

        if (size > values.size()) {
          size = values.size();
          end = values.boundaries().end();
        }
        boundaries = GenomicRange.fromStartEnd(boundaries.seqName(), start, end);
      } else {
        var newSize = values.size() - globalStartIndex + values.globalStartIndex();
        if (size > newSize) {
          size = newSize;
          if (size <= 0) {
            size = 0;
            return true;
          }
          boundaries = GenomicRange.fromStartEnd(
            boundaries.seqName(), boundaries.start(), values.boundaries().end());
        }
      }

      if (size == 0) { return true; } // break: there is not enough data to compute the measurement

      return false;
    });

    if (boundaries === null) { return false; } // continue

    // Check if the existing stored values already contain the new values
    var existingValues = storedData.values(cm);
    if (existingValues &&
      (globalStartIndex === null ||
      (existingValues.globalStartIndex() < globalStartIndex &&
      existingValues.globalStartIndex() + existingValues.size() > globalStartIndex + size))) {
      return false; // continue
    }

    // Here, compute the actual measurement

    // Values before the currently stored start index

    /** @type {epiviz.measurements.MeasurementHashtable.<Array.<number>>} */
    var compMsVals = new epiviz.measurements.MeasurementHashtable();
    var values = null;

    if (existingValues && existingValues.size()) {
      componentMeasurements.foreach(function(m) {
        var v = storedData.values(m);
        var mVals = [];
        if (globalStartIndex !== null) {
          for (var index = globalStartIndex; index < existingValues.globalStartIndex(); ++index) {
            mVals.push(v.getByGlobalIndex(index));
          }
        }
        compMsVals.put(m, mVals);
      });

      values = new epiviz.datatypes.FeatureValueArray(cm,
        GenomicRange.fromStartEnd(boundaries.seqName(), boundaries.start(), existingValues.boundaries().start()),
        globalStartIndex,
        cm.evaluateArr(compMsVals));


      self._mergeData(cm, values);

      // Values after current global start index + size
      compMsVals = new epiviz.measurements.MeasurementHashtable();
      componentMeasurements.foreach(function(m) {
        var v = storedData.values(m);
        var mVals = [];
        if (globalStartIndex !== null) {
          for (var index = existingValues.globalStartIndex() + existingValues.size(); index < globalStartIndex + size; ++index) {
            mVals.push(v.getByGlobalIndex(index));
          }
        }
        compMsVals.put(m, mVals);
      });

      values = new epiviz.datatypes.FeatureValueArray(cm,
        GenomicRange.fromStartEnd(boundaries.seqName(), existingValues.boundaries().end(), boundaries.end()),
        existingValues.globalStartIndex() + existingValues.size(),
        cm.evaluateArr(compMsVals));

      self._mergeData(cm, values);

      return false;
    }

    compMsVals = new epiviz.measurements.MeasurementHashtable();
    componentMeasurements.foreach(function(m) {
      var v = storedData.values(m);
      var mVals = [];
      if (globalStartIndex !== null) {
        for (var index = globalStartIndex; index < globalStartIndex + size; ++index) {
          mVals.push(v.getByGlobalIndex(index));
        }
      }
      compMsVals.put(m, mVals);
    });

    values = new epiviz.datatypes.FeatureValueArray(cm,
      boundaries,
      globalStartIndex,
      cm.evaluateArr(compMsVals));

    self._mergeData(cm, values);

    return false;
  });
};

/**
 * Clears all data stored in cache
 */
epiviz.data.Cache.prototype.flush = function() {
  this._data = {};

  // Discard all pending requests
  this._measurementRequestStackMap.foreach(function(m, requestStack) { requestStack.clear(); });
  this._measurementPendingRequestsMap.clear();
};

/**
 * @param {string} datasourceGroup
 */
epiviz.data.Cache.prototype.clearDatasourceGroupCache = function(datasourceGroup) {
  delete this._data[datasourceGroup];
  this._measurementRequestStackMap.foreach(function(m, requestStack) {
    if (m.datasourceGroup() == datasourceGroup) { requestStack.clear(); }
  });

  var msToClear = [];
  this._measurementPendingRequestsMap.foreach(function(m, map) {
    if (m.datasourceGroup() == datasourceGroup) { msToClear.push(m); }
  });

  for (var i = 0; i < msToClear.length; ++i) {
    this._measurementPendingRequestsMap.put(msToClear[i], {});
  }
};


/***/ }),
/* 3 */
/***/ (function(module, exports) {

/**
 * Created by: Florin Chelaru
 * Date: 9/30/13
 * Time: 7:50 PM
 */

goog.provide('epiviz.data.DataManager');

goog.require('epiviz.data.DataProvider');
goog.require('epiviz.data.DataProviderFactory');
goog.require('epiviz.measurements.MeasurementSet');
goog.require('epiviz.events.EventListener');

/**
 * @param {epiviz.Config} config
 * @param {epiviz.data.DataProviderFactory} dataProviderFactory
 * @constructor
 */
epiviz.data.DataManager = function(config, dataProviderFactory) {

  /**
   * @type {epiviz.Config}
   * @private
   */
  this._config = config;

  /**
   * @type {epiviz.measurements.MeasurementSet}
   * @private
   */
  this._measurements = new epiviz.measurements.MeasurementSet();

  /**
   * @type {epiviz.data.DataProviderFactory}
   * @private
   */
  this._dataProviderFactory = dataProviderFactory;

  /**
   * @type {epiviz.data.Cache}
   * @private
   */
  this._cache = new epiviz.data.Cache(config, dataProviderFactory);

  /**
   * @type {Object.<string, epiviz.data.RequestStack>}
   * @private
   */
  this._combinedRequestsStacks = {};

  /**
   * @type {epiviz.events.Event.<{measurements: epiviz.measurements.MeasurementSet, result: epiviz.events.EventResult}>}
   * @private
   */
  this._requestAddMeasurements = new epiviz.events.Event();

  /**
   * @type {epiviz.events.Event.<{measurements: epiviz.measurements.MeasurementSet, result: epiviz.events.EventResult}>}
   * @private
   */
  this._requestRemoveMeasurements = new epiviz.events.Event();

  /**
   * @type {epiviz.events.Event.<{type: string, visConfigSelection: epiviz.ui.controls.VisConfigSelection, result: epiviz.events.EventResult.<{id: string}>}>}
   * @private
   */
  this._requestAddChart = new epiviz.events.Event();

  /**
   * @type {epiviz.events.Event.<{id: string, result: epiviz.events.EventResult}>}
   * @private
   */
  this._requestRemoveChart = new epiviz.events.Event();

  /**
   * @type {epiviz.events.Event.<{id: string, result: epiviz.events.EventResult}>}
   * @private
   */
  this._requestPrintWorkspace = new epiviz.events.Event();

  /**
   * @type {epiviz.events.Event.<{seqInfos: Array.<epiviz.datatypes.SeqInfo>, result: epiviz.events.EventResult}>}
   * @private
   */
  this._requestAddSeqInfos = new epiviz.events.Event();

  /**
   * @type {epiviz.events.Event.<{seqNames: Array.<string>, result: epiviz.events.EventResult}>}
   * @private
   */
  this._requestRemoveSeqNames = new epiviz.events.Event();

  /**
   * @type {epiviz.events.Event.<{range: epiviz.datatypes.GenomicRange, result: epiviz.events.EventResult}>}
   * @private
   */
  this._requestNavigate = new epiviz.events.Event();

  /**
   * @type {epiviz.events.Event.<{result: epiviz.events.EventResult}>}
   * @private
   */
  this._requestRedraw = new epiviz.events.Event();

  /**
   * @type {epiviz.events.Event}
   * @private
   */
  this._flushCache = new epiviz.events.Event();

  /**
   * @type {epiviz.events.Event.<{datasourceGroup: string}>}
   * @private
   */
  this._clearDatasourceGroupCache = new epiviz.events.Event();

  /**
   * @type {epiviz.events.Event.<{result: epiviz.events.EventResult}>}
   * @private
   */
  this._requestCurrentLocation = new epiviz.events.Event();

  /**
   * @type {epiviz.events.Event.<{id: string, result: epiviz.events.EventResult}>}
   * @private
   */
  this._requestGetChartSettings = new epiviz.events.Event();

  /**
   * @type {epiviz.events.Event.<{id: string, result: epiviz.events.EventResult}>}
   * @private
   */
  this._requestSetChartSettings = new epiviz.events.Event();

  /**
   * @type {epiviz.events.Event.<{id: string, result: epiviz.events.EventResult}>}
   * @private
   */
  this._requestGetAvailableCharts = new epiviz.events.Event();


  this._registerProviderAddMeasurements();
  this._registerProviderRemoveMeasurements();
  this._registerProviderAddChart();
  this._registerProviderRemoveChart();
  this._registerProviderPrintWorkspace();
  this._registerProviderAddSeqInfos();
  this._registerProviderRemoveSeqNames();
  this._registerProviderNavigate();
  this._registerProviderRedraw();
  this._registerProviderFlushCache();
  this._registerProviderClearDatasourceGroupCache();
  this._registerProviderGetCurrentLocation();
  this._registerProviderGetChartSettings();
  this._registerProviderSetChartSettings();
  this._registerProviderGetAvailableCharts();

};

/**
 * @returns {epiviz.events.Event.<{measurements: epiviz.measurements.MeasurementSet, result: epiviz.events.EventResult}>}
 */
epiviz.data.DataManager.prototype.onRequestAddMeasurements = function() { return this._requestAddMeasurements; };

/**
 * @returns {epiviz.events.Event.<{measurements: epiviz.measurements.MeasurementSet, result: epiviz.events.EventResult}>}
 */
epiviz.data.DataManager.prototype.onRequestRemoveMeasurements = function() { return this._requestRemoveMeasurements; };

/**
 * @returns {epiviz.events.Event.<{type: string, visConfigSelection: epiviz.ui.controls.VisConfigSelection, result: epiviz.events.EventResult.<{id: string}>}>}
 */
epiviz.data.DataManager.prototype.onRequestAddChart = function() { return this._requestAddChart; };

/**
 * @returns {epiviz.events.Event.<{id: string, result: epiviz.events.EventResult}>}
 */
epiviz.data.DataManager.prototype.onRequestRemoveChart = function() { return this._requestRemoveChart; };

/**
 * @returns {epiviz.events.Event.<{id: string, result: epiviz.events.EventResult}>}
 */
epiviz.data.DataManager.prototype.onRequestPrintWorkspace = function() { return this._requestPrintWorkspace; };

/**
 * @returns {epiviz.events.Event.<{seqInfos: Array.<epiviz.datatypes.SeqInfo>, result: epiviz.events.EventResult}>}
 */
epiviz.data.DataManager.prototype.onRequestAddSeqInfos = function() { return this._requestAddSeqInfos; };

/**
 * @returns {epiviz.events.Event.<{seqNames: Array.<string>, result: epiviz.events.EventResult}>}
 */
epiviz.data.DataManager.prototype.onRequestRemoveSeqNames = function() { return this._requestRemoveSeqNames; };

/**
 * @returns {epiviz.events.Event.<{range: epiviz.datatypes.GenomicRange, result: epiviz.events.EventResult}>}
 */
epiviz.data.DataManager.prototype.onRequestNavigate = function() { return this._requestNavigate; };

/**
 * @returns {epiviz.events.Event.<{result: epiviz.events.EventResult}>}
 */
epiviz.data.DataManager.prototype.onRequestRedraw = function() { return this._requestRedraw; };

/**
 * @returns {epiviz.events.Event.<{datasourceGroup: string}>}
 */
epiviz.data.DataManager.prototype.onClearDatasourceGroupCache = function() { return this._clearDatasourceGroupCache; };

/**
 * @returns {epiviz.events.Event}
 */
epiviz.data.DataManager.prototype.onFlushCache = function() { return this._flushCache; };

/**
 * @returns {epiviz.events.Event.<{result: epiviz.events.EventResult}>}
 */
epiviz.data.DataManager.prototype.onRequestCurrentLocation = function() { return this._requestCurrentLocation; };

/**
 * @returns {epiviz.events.Event.<{id: string, result: epiviz.events.EventResult}>}
 */
epiviz.data.DataManager.prototype.onRequestGetChartSettings = function() { return this._requestGetChartSettings; };

/**
 * @returns {epiviz.events.Event.<{id: string, result: epiviz.events.EventResult}>}
 */
epiviz.data.DataManager.prototype.onRequestSetChartSettings = function() { return this._requestSetChartSettings; };

/**
 * @returns {epiviz.events.Event.<{id: string, result: epiviz.events.EventResult}>}
 */
epiviz.data.DataManager.prototype.onRequestGetAvailableCharts = function() { return this._requestGetAvailableCharts; };


/**
 * @param {function(Array.<epiviz.datatypes.SeqInfo>)} callback
 */
epiviz.data.DataManager.prototype.getSeqInfos = function(callback) {
  var self = this;

  var nResponses = 0;

  var existingSeqNames = {};

  /** @type {Array.<epiviz.datatypes.SeqInfo>} */
  var result = [];
  this._dataProviderFactory.foreach(function(provider) {
    provider.getData(epiviz.data.Request.getSeqInfos(),
      /**
       * @param {epiviz.data.Response.<Array.<Array>>} response Each element in the response is an array with three values:
       * the name of the sequence, the minimum and maximum values it can have
       */
      function(response) {
        var seqs = response.data();
        if (seqs) {
          if(!Array.isArray(seqs)) {
            var keys = Object.keys(seqs);
            for (var i=0; i<keys.length; i++) {
              if (!(keys[i] in existingSeqNames)) {
                result.push(epiviz.datatypes.SeqInfo.fromRawObject([keys[i], seqs[keys[i]][0], seqs[keys[i]][1]]));
                existingSeqNames[keys[i]] = true;
              }
            }
          }
          else {
            for (var i = 0; i < seqs.length; ++i) {
              if (!(seqs[i][0] in existingSeqNames)) {
                result.push(epiviz.datatypes.SeqInfo.fromRawObject(seqs[i]));
                existingSeqNames[seqs[i][0]] = true;
              }
            }
          }
        }

        if (++nResponses < self._dataProviderFactory.size()) { return; }

        callback(result.sort(epiviz.datatypes.SeqInfo.compare));
      });
  });
};

/**
 */
epiviz.data.DataManager.prototype.updateChartSettings = function(values) {
  var self = this;

  this._dataProviderFactory.foreach(function(provider) {

    if(provider.id().includes('websocket-')) {

      var colors = null;

      if(values.colorMap != null) {
        colors = values.colorMap._colors;
      }

      provider.updateChartSettings(epiviz.data.Request.createRequest({
            action: epiviz.data.Request.Action.SET_CHART_SETTINGS,
            settings: values.settings,
            colorMap: colors,
            chartId: values.chartId
      }),
          function() {
            //do nothing
          }
      );  
    }
  });
};


/**
 * @param {function(epiviz.measurements.MeasurementSet)} callback
 */
epiviz.data.DataManager.prototype.getMeasurements = function(callback) {
  var self = this;
  var result = new epiviz.measurements.MeasurementSet();

  var nResponses = 0;
  this._dataProviderFactory.foreach(function(provider) {
    provider.getData(epiviz.data.Request.getMeasurements(),
      /**
       * @param {epiviz.data.Response.<{
       *   id: Array.<number>,
       *   name: Array.<string>,
       *   type: Array.<string>|string,
       *   datasourceId: Array.<string>|string,
       *   datasourceGroup: Array.<string>|string,
       *   defaultChartType: Array.<string>|string,
       *   annotation: Array.<Object.<string, string>>,
       *   minValue: Array.<number>|number,
       *   maxValue: Array.<number>|number,
       *   metadata: Array.<Array.<string>>|Array.<string>
       * }>} response
       */
      function(response) {
        var jsondata = response.data();

        if (jsondata) {
          var n = jsondata['id'] ? (jsondata['id'].length || 0) : 0;
          for (var i = 0; i < n; ++i) {
            result.add(new epiviz.measurements.Measurement(
              jsondata['id'][i],
              jsondata['name'][i],
              $.isArray(jsondata['type']) ? jsondata['type'][i] : jsondata['type'],
              $.isArray(jsondata['datasourceId']) ? jsondata['datasourceId'][i] : jsondata['datasourceId'],
              $.isArray(jsondata['datasourceGroup']) ? jsondata['datasourceGroup'][i] : jsondata['datasourceGroup'],
              provider.id(),
              null,
              $.isArray(jsondata['defaultChartType']) ? jsondata['defaultChartType'][i] : jsondata['defaultChartType'],
              jsondata['annotation'][i],
              $.isArray(jsondata['minValue']) ? jsondata['minValue'][i] : jsondata['minValue'],
              $.isArray(jsondata['maxValue']) ? jsondata['maxValue'][i] : jsondata['maxValue'],
              ($.isArray(jsondata['metadata']) && $.isArray(jsondata['metadata'][0])) ? jsondata['metadata'][i] : jsondata['metadata']
            ));
          }
        }

        if (++nResponses < self._dataProviderFactory.size()) { return; }

        callback(result);
      });
  });
};

/**
 * @param {epiviz.datatypes.GenomicRange} range
 * @param {Object.<string, epiviz.measurements.MeasurementSet>} chartMeasurementsMap
 * @param {function(string, epiviz.datatypes.GenomicData)} dataReadyCallback
 */
epiviz.data.DataManager.prototype.getData = function(range, chartMeasurementsMap, dataReadyCallback) {
  if (this._config.useCache) {
    this._cache.getData(range, chartMeasurementsMap, dataReadyCallback);
  } else {
    this._getDataNoCache(range, chartMeasurementsMap, dataReadyCallback);
  }
};

/**
 * TODO: Take care of computed measurements as well
 * @param {epiviz.datatypes.GenomicRange} range
 * @param {Object.<string, epiviz.measurements.MeasurementSet>} chartMeasurementsMap
 * @param {function(string, epiviz.datatypes.GenomicData)} dataReadyCallback
 */
epiviz.data.DataManager.prototype._getDataNoCache = function(range, chartMeasurementsMap, dataReadyCallback) {
  var self = this;

  /** @type {Object.<string, epiviz.measurements.MeasurementSet>} */
  var msByDp = {};
  for (var chartId in chartMeasurementsMap) {
    if (!chartMeasurementsMap.hasOwnProperty(chartId)) { continue; }
    var chartMsByDp = chartMeasurementsMap[chartId].split(function(m) { return m.dataprovider(); });
    for (var dp in chartMsByDp) {
      if (!chartMsByDp.hasOwnProperty(dp)) { continue; }
      var dpMs = msByDp[dp];
      if (dpMs == undefined) { msByDp[dp] = chartMsByDp[dp]; }
      else { dpMs.addAll(chartMsByDp[dp]); }
    }
  }

  /**
   * @type {Object.<string, Object.<string, epiviz.datatypes.PartialSummarizedExperiment>>}
   */
  var allData = {};
  epiviz.utils.forEach(msByDp, function(dpMs, dataprovider) {
    var msByDs = dpMs.split(function(m) { return m.datasource().id(); });
    var request = epiviz.data.Request.getCombined(msByDs, range);

    var requestStack = self._combinedRequestsStacks[dataprovider];
    if (requestStack == undefined) {
      requestStack = new epiviz.data.RequestStack();
      self._combinedRequestsStacks[dataprovider] = requestStack;
    }

    requestStack.pushRequest(request, function(data) {
      var dataByDs = {};
      epiviz.utils.forEach(msByDs, function(dsMs, datasourceId) {
        var datasource = dsMs.first().datasource();
        var dsData = data[datasourceId];
        var sumExp = new epiviz.datatypes.PartialSummarizedExperiment();

        var globalStartIndex = dsData.globalStartIndex;
        var rowData = new epiviz.datatypes.GenomicRangeArray(datasource, range, globalStartIndex, dsData.rows);

        sumExp.addRowData(rowData);

        dsMs.foreach(function(m) {
          var valueData = new epiviz.datatypes.FeatureValueArray(m, range, globalStartIndex, dsData.cols[m.id()]);
          sumExp.addValues(valueData);
        });

        dataByDs[datasourceId] = sumExp;
      });

      allData[dataprovider] = dataByDs;
      self._serveAvailableData(range, chartMeasurementsMap, dataReadyCallback, allData);
    });

    var dataProvider = self._dataProviderFactory.get(dataprovider) || self._dataProviderFactory.get(epiviz.data.EmptyResponseDataProvider.DEFAULT_ID);
    dataProvider.getData(request, function(response) {
      requestStack.serveData(response);
    });
  });
};

/**
 * @param {epiviz.datatypes.GenomicRange} range
 * @param {Object.<string, epiviz.measurements.MeasurementSet>} chartMeasurementsMap
 * @param {function(string, epiviz.datatypes.GenomicData)} dataReadyCallback
 * @param {Object.<string, Object.<string, epiviz.datatypes.PartialSummarizedExperiment>>} data
 * @private
 */
epiviz.data.DataManager.prototype._serveAvailableData = function(range, chartMeasurementsMap, dataReadyCallback, data) {
  var resolvedCharts = [];
  epiviz.utils.forEach(chartMeasurementsMap, function(ms, chartId) {
    var allMsDataFetched = true;
    var msDataMap = new epiviz.measurements.MeasurementHashtable();
    ms.foreach(function(m) {
      if (!(m.dataprovider() in data)) {
        allMsDataFetched = false;
        return true; // break
      }

      var msData = new epiviz.datatypes.MeasurementGenomicDataWrapper(m, data[m.dataprovider()][m.datasource().id()]);
      msDataMap.put(m, msData);
    });

    if (allMsDataFetched) {
      var genomicData = new epiviz.datatypes.MapGenomicData(msDataMap);
      dataReadyCallback(chartId, genomicData);
      resolvedCharts.push(chartId);
    }
  });

  resolvedCharts.forEach(function(chartId) { delete chartMeasurementsMap[chartId]; });
};

/**
 * @param {Object.<string, epiviz.ui.controls.VisConfigSelection>} chartVisConfigSelectionMap
 * @param {function(string, *)} dataReadyCallback
 */
epiviz.data.DataManager.prototype.getHierarchy = function(chartVisConfigSelectionMap, dataReadyCallback) {
  for (var chartId in chartVisConfigSelectionMap) {
    if (!chartVisConfigSelectionMap.hasOwnProperty(chartId)) { continue; }
    var visConfigSelection = chartVisConfigSelectionMap[chartId];
  }
  var dataprovider = visConfigSelection.dataprovider;
  if (!dataprovider) {
    visConfigSelection.measurements.foreach(function(m) {
      if (m.dataprovider()) {
        dataprovider = m.dataprovider();
        return true;
      }
      return false;
    });
  }
  var provider = this._dataProviderFactory.get(dataprovider) || this._dataProviderFactory.get(epiviz.data.EmptyResponseDataProvider.DEFAULT_ID);
  provider.getData(epiviz.data.Request.getHierarchy(visConfigSelection.datasourceGroup, visConfigSelection.customData), function(response) {
    dataReadyCallback(chartId, response.data());
  });
};

/**
 * @param {Object.<string, epiviz.ui.controls.VisConfigSelection>} chartVisConfigSelectionMap
 * @param {function(string, *)} dataReadyCallback
 */
epiviz.data.DataManager.prototype.propagateHierarchyChanges = function(chartVisConfigSelectionMap, dataReadyCallback) {
  for (var chartId in chartVisConfigSelectionMap) {
    if (!chartVisConfigSelectionMap.hasOwnProperty(chartId)) { continue; }
    var visConfigSelection = chartVisConfigSelectionMap[chartId];
    var dataprovider = visConfigSelection.dataprovider;
    if (!dataprovider) {
      visConfigSelection.measurements.foreach(function(m) {
        if (m.dataprovider()) {
          dataprovider = m.dataprovider();
          return true;
        }
        return false;
      });
    }
    var provider = this._dataProviderFactory.get(dataprovider) || this._dataProviderFactory.get(epiviz.data.EmptyResponseDataProvider.DEFAULT_ID);
    (function(chartId, provider, visConfigSelection) {
      provider.getData(epiviz.data.Request.propagateHierarchyChanges(
        visConfigSelection.datasourceGroup,
        visConfigSelection.customData.selection,
        visConfigSelection.customData.order,
        visConfigSelection.customData.selectedLevels), function(response) {

        setTimeout(function() {
          provider.onRequestClearDatasourceGroupCache().notify({
            datasourceGroup: visConfigSelection.datasourceGroup,
            result: new epiviz.events.EventResult()
          });
          provider.onRequestRedraw().notify({
            result: new epiviz.events.EventResult()
          });

          dataReadyCallback(chartId, response.data());
        }, 0);
      });
    })(chartId, provider, visConfigSelection);
  }
};


/**
 * @param {function(Array)} callback
 * @param {string} [filter]
 * @param {string} [requestWorkspaceId]
 */
epiviz.data.DataManager.prototype.getWorkspaces = function(callback, filter, requestWorkspaceId) {
  var workspaceProvider = this._dataProviderFactory.workspacesDataProvider();

  if (!workspaceProvider) { throw Error('Invalid data provider for workspaces (see Config.workspaceDataProvider)'); }

  workspaceProvider.getData(epiviz.data.Request.getWorkspaces(filter, requestWorkspaceId),
    /**
     * @param {epiviz.data.Response.<Array.<{id: string, id_v1: string, name: string, content: string}>>} response
     */
    function(response) {
      var wsRows = response.data();

      var workspaces = [];

      if (!wsRows || !wsRows.length) {
        // No workspaces in database
        callback(workspaces);
        return;
      }

      for (var i = 0; i < wsRows.length; ++i) {
        workspaces.push({
          id: wsRows[i].id,
          name: wsRows[i].name,
          content: JSON.parse(wsRows[i].content)
        });
      }
      callback(workspaces);
    });
};

/**
 * @param {epiviz.workspaces.Workspace} workspace
 * @param {epiviz.Config} config
 * @param {function(string)} callback
 */
epiviz.data.DataManager.prototype.saveWorkspace = function(workspace, config, callback) {
  var workspaceProvider = this._dataProviderFactory.workspacesDataProvider();

  if (!workspaceProvider) { throw Error('Invalid data provider for workspaces (see Config.workspaceDataProvider)'); }

  //workspaceProvider.saveWorkspace(workspace, callback);
  workspaceProvider.getData(epiviz.data.Request.saveWorkspace(workspace, config),
    /**
     * @param {epiviz.data.Response.<string>} response
     */
    function(response) {
      var workspaceId = response.data();
      callback(workspaceId);
    });
};

/**
 * @param {epiviz.workspaces.Workspace} workspace
 */
epiviz.data.DataManager.prototype.deleteWorkspace = function(workspace) {
  var workspaceProvider = this._dataProviderFactory.workspacesDataProvider();

  if (!workspaceProvider) { throw Error('Invalid data provider for workspaces (see Config.workspaceDataProvider)'); }

  workspaceProvider.getData(epiviz.data.Request.deleteWorkspace(workspace),
    /**
     * @param {epiviz.data.Response.<{success: boolean}>} response
     */
    function(response) {
      var success = response.data().success;
    });
};

/**
 * @param {function(Array)} callback
 * @param {string} query
 */
epiviz.data.DataManager.prototype.search = function(callback, query) {
  var self = this;
  var remainingResponses = this._dataProviderFactory.size();
  var results = [];
  this._dataProviderFactory.foreach(function(provider) {
    provider.getData(epiviz.data.Request.search(query, self._config.maxSearchResults),
      /**
       * @param {epiviz.data.Response.<Array.<{probe: string, gene: string, seqName: string, start: number, end: number}>>} response
       */
      function(response) {
        var providerResults = response.data();
        if (providerResults) {
          epiviz.utils.arrayAppend(results, providerResults);
        }

        --remainingResponses;

        if (!remainingResponses) {
          callback(results);
        }
      });
  });
};

/**
 * Clears all data from cache
 */
epiviz.data.DataManager.prototype.flushCache = function() {
  this._cache.flush();
  this._flushCache.notify();
};

/**
 * @param {string} datasourceGroup
 */
epiviz.data.DataManager.prototype.clearDatasourceGroupCache = function(datasourceGroup) {
  this._cache.clearDatasourceGroupCache(datasourceGroup);
  this._clearDatasourceGroupCache.notify({datasourceGroup: datasourceGroup});
};

/**
 * @private
 */
epiviz.data.DataManager.prototype._registerProviderAddMeasurements = function() {
  var self = this;
  this._dataProviderFactory.foreach(function(/** @type {epiviz.data.DataProvider} */ provider) {
    provider.onRequestAddMeasurements().addListener(new epiviz.events.EventListener(
      function(e) {
        self._requestAddMeasurements.notify(e);
      }));
  });
};

/**
 * @private
 */
epiviz.data.DataManager.prototype._registerProviderRemoveMeasurements = function() {
  var self = this;
  this._dataProviderFactory.foreach(function(/** @type {epiviz.data.DataProvider} */ provider) {
    provider.onRequestRemoveMeasurements().addListener(new epiviz.events.EventListener(
      function(e) {
        self._requestRemoveMeasurements.notify(e);
      }));
  });
};

/**
 * @private
 */
epiviz.data.DataManager.prototype._registerProviderAddChart = function() {
  var self = this;
  this._dataProviderFactory.foreach(function(/** @type {epiviz.data.DataProvider} */ provider) {
    provider.onRequestAddChart().addListener(new epiviz.events.EventListener(
      function(e) {
        self._requestAddChart.notify(e);
      }));
  });
};

/**
 * @private
 */
epiviz.data.DataManager.prototype._registerProviderRemoveChart = function() {
  var self = this;
  this._dataProviderFactory.foreach(function(/** @type {epiviz.data.DataProvider} */ provider) {
    provider.onRequestRemoveChart().addListener(new epiviz.events.EventListener(
      function(e) {
        self._requestRemoveChart.notify(e);
      }));
  });
};

/**
 * @private
 */
epiviz.data.DataManager.prototype._registerProviderPrintWorkspace = function() {
  var self = this;
  this._dataProviderFactory.foreach(function(/** @type {epiviz.data.DataProvider} */ provider) {
    provider.onRequestPrintWorkspace().addListener(new epiviz.events.EventListener(
        function(e) {
          self._requestPrintWorkspace.notify(e);
        }));
  });
};

/**
 * @private
 */
epiviz.data.DataManager.prototype._registerProviderAddSeqInfos = function() {
  var self = this;
  this._dataProviderFactory.foreach(function(/** @type {epiviz.data.DataProvider} */ provider) {
    provider.onRequestAddSeqInfos().addListener(new epiviz.events.EventListener(
      /**
       * @param {{seqInfos: Array.<Array>, result: epiviz.events.EventResult}} e
       */
      function(e) {
        var seqInfos = [];
        for (var i = 0; i < e.seqInfos.length; ++i) {
          seqInfos.push(epiviz.datatypes.SeqInfo.fromRawObject(e.seqInfos[i]));
        }
        self._requestAddSeqInfos.notify({seqInfos: seqInfos, result: e.result});
      }));
  });
};

/**
 * @private
 */
epiviz.data.DataManager.prototype._registerProviderRemoveSeqNames = function() {
  var self = this;
  this._dataProviderFactory.foreach(function(/** @type {epiviz.data.DataProvider} */ provider) {
    provider.onRequestRemoveSeqNames().addListener(new epiviz.events.EventListener(
      function(e) {
        self._requestRemoveSeqNames.notify(e);
      }));
  });
};

/**
 * @private
 */
epiviz.data.DataManager.prototype._registerProviderNavigate = function() {
  var self = this;
  this._dataProviderFactory.foreach(function(/** @type {epiviz.data.DataProvider} */ provider) {
    provider.onRequestNavigate().addListener(new epiviz.events.EventListener(
      function(e) {
        self._requestNavigate.notify(e);
      }));
  });
};

/**
 * @private
 */
epiviz.data.DataManager.prototype._registerProviderRedraw = function() {
  var self = this;
  this._dataProviderFactory.foreach(function(/** @type {epiviz.data.DataProvider} */ provider) {
    provider.onRequestRedraw().addListener(new epiviz.events.EventListener(
      function(e) {
        self._requestRedraw.notify(e);
      }));
  });
};

/**
 * @private
 */
epiviz.data.DataManager.prototype._registerProviderClearDatasourceGroupCache = function() {
  var self = this;
  this._dataProviderFactory.foreach(function(/** @type {epiviz.data.DataProvider} */ provider) {
    provider.onRequestClearDatasourceGroupCache().addListener(new epiviz.events.EventListener(
      function(e) {
        self.clearDatasourceGroupCache(e.datasourceGroup);
        e.result.success = true;
      }));
  });
};

/**
 * @private
 */
epiviz.data.DataManager.prototype._registerProviderFlushCache = function() {
  var self = this;
  this._dataProviderFactory.foreach(function(/** @type {epiviz.data.DataProvider} */ provider) {
    provider.onRequestFlushCache().addListener(new epiviz.events.EventListener(
      function(e) {
        self.flushCache();
        e.result.success = true;
      }));
  });
};

/**
 * @private
 */
epiviz.data.DataManager.prototype._registerProviderGetCurrentLocation = function() {
  var self = this;
  this._dataProviderFactory.foreach(function(/** @type {epiviz.data.DataProvider} */ provider) {
    provider.onRequestCurrentLocation().addListener(new epiviz.events.EventListener(
      function(e) {
        self._requestCurrentLocation.notify(e);
      }));
  });
};

/**
 * @private
 */
epiviz.data.DataManager.prototype._registerProviderSetChartSettings = function() {
  var self = this;
  this._dataProviderFactory.foreach(function(/** @type {epiviz.data.DataProvider} */ provider) {
    provider.onRequestSetChartSettings().addListener(new epiviz.events.EventListener(
        function(e) {
          self._requestSetChartSettings.notify(e);
        }));
  });
};

/**
 * @private
 */
epiviz.data.DataManager.prototype._registerProviderGetChartSettings = function() {
  var self = this;
  this._dataProviderFactory.foreach(function(/** @type {epiviz.data.DataProvider} */ provider) {
    provider.onRequestGetChartSettings().addListener(new epiviz.events.EventListener(
        function(e) {
          self._requestGetChartSettings.notify(e);
        }));
  });
};

/**
 * @private
 */
epiviz.data.DataManager.prototype._registerProviderGetAvailableCharts = function() {
  var self = this;
  this._dataProviderFactory.foreach(function(/** @type {epiviz.data.DataProvider} */ provider) {
    provider.onRequestGetChartSettings().addListener(new epiviz.events.EventListener(
        function(e) {
          self._requestGetAvailableCharts.notify(e);
        }));
  });
};


/***/ }),
/* 4 */
/***/ (function(module, exports) {

/**
 * Created by: Florin Chelaru
 * Date: 10/1/13
 * Time: 1:28 PM
 */

goog.provide('epiviz.data.DataProviderFactory');

/**
 * A factory containing all the registered active data providers
 * (like EpivizR connections or PHP servers)
 * @param {epiviz.Config} config
 * @constructor
 * @implements {epiviz.utils.Iterable}
 */
epiviz.data.DataProviderFactory = function(config) {
  /**
   * @type {epiviz.Config}
   * @private
   */
  this._config = config;

  /**
   * @type {Array.<epiviz.data.DataProvider>}
   * @private
   */
  //this._providers = [];

  /**
   * @type {Object.<string, epiviz.data.DataProvider>}
   * @private
   */
  this._providers = {};

  /**
   * @type {number}
   * @private
   */
  this._size = 0;

  var tokens;
  for (var i = 0; i < this._config.dataProviders.length; ++i) {
    if (!$.isArray(this._config.dataProviders[i])) {
      tokens = this._config.dataProviders[i].split(',');
    } else {
      tokens = this._config.dataProviders[i];
    }
    /**
     * @type {?function(new:epiviz.data.DataProvider)}
     */
    var dataProviderConstructor = epiviz.utils.evaluateFullyQualifiedTypeName(tokens[0]);

    if (!dataProviderConstructor) { continue; }

    /** @type {epiviz.data.DataProvider} */
    var dataProvider = epiviz.utils.applyConstructor(dataProviderConstructor, tokens.slice(1));

    this._providers[dataProvider.id()] = dataProvider;

    ++this._size;
  }
  var emptyProvider = new epiviz.data.EmptyResponseDataProvider();
  this._providers[emptyProvider.id()] = emptyProvider;
  ++this._size;

  tokens = this._config.workspacesDataProvider.split(',');
  /**
   * @type {?function(new:epiviz.data.DataProvider)}
   */
  var wsDataProviderConstructor = epiviz.utils.evaluateFullyQualifiedTypeName(tokens[0]);

  /** @type {epiviz.data.DataProvider} */
  this._workspacesDataProvider = epiviz.utils.applyConstructor(wsDataProviderConstructor, tokens.slice(1));

};

/**
 * Iterates through all registered data providers until the function
 *   evaluates to true
 * @param {function(epiviz.data.DataProvider)} func
 */
epiviz.data.DataProviderFactory.prototype.foreach = function(func) {
  for (var id in this._providers) {
    if (!this._providers.hasOwnProperty(id)) { continue; }
    if (func(this._providers[id])) { return; }
  }
};

/**
 * @returns {boolean}
 */
epiviz.data.DataProviderFactory.prototype.isEmpty = function() {
  //return !this._providers.length;
  return !this._size;
};

/**
 * @returns {number}
 */
epiviz.data.DataProviderFactory.prototype.size = function() {
  //return this._providers.length;
  return this._size;
};

/**
 * @param {string} id
 * @returns {epiviz.data.DataProvider}
 */
epiviz.data.DataProviderFactory.prototype.get = function(id) {
  if (id in this._providers) {
    return this._providers[id];
  }

  return null;
};

/**
 * @returns {epiviz.data.DataProvider}
 */
epiviz.data.DataProviderFactory.prototype.workspacesDataProvider = function() {
  return this._workspacesDataProvider;
};


/***/ }),
/* 5 */
/***/ (function(module, exports) {

/**
 * Created by: Florin Chelaru
 * Date: 9/30/13
 * Time: 8:28 PM
 */

goog.provide('epiviz.data.DataProvider');

/**
 * @param {string} id
 * @constructor
 */
epiviz.data.DataProvider = function(id) {
  /**
   * @type {string}
   * @private
   */
  this._id = id;

  /**
   * seqInfos: an array of raw seqInfos, which consist of 3-element arrays: name, min and max
   * @type {epiviz.events.Event.<{seqInfos: Array.<Array>, result: epiviz.events.EventResult}>}
   * @private
   */
  this._requestAddSeqInfos = new epiviz.events.Event();

  /**
   * @type {epiviz.events.Event.<{seqNames: Array.<string>, result: epiviz.events.EventResult}>}
   * @private
   */
  this._requestRemoveSeqNames = new epiviz.events.Event();

  /**
   * @type {epiviz.events.Event.<{measurements: epiviz.measurements.MeasurementSet, result: epiviz.events.EventResult}>}
   * @private
   */
  this._requestAddMeasurements = new epiviz.events.Event();

  /**
   * @type {epiviz.events.Event.<{measurements: epiviz.measurements.MeasurementSet, result: epiviz.events.EventResult}>}
   * @private
   */
  this._requestRemoveMeasurements = new epiviz.events.Event();

  /**
   * @type {epiviz.events.Event.<{type: string, visConfigSelection: epiviz.ui.controls.VisConfigSelection, result: epiviz.events.EventResult.<{id: string}>}>}
   * @private
   */
  this._requestAddChart = new epiviz.events.Event();

  /**
   * @type {epiviz.events.Event.<{id: string, result: epiviz.events.EventResult}>}
   * @private
   */
  this._requestRemoveChart = new epiviz.events.Event();

  /**
   * @type {epiviz.events.Event.<{result: epiviz.events.EventResult}>}
   * @private
   */
  this._requestFlushCache = new epiviz.events.Event();

  /**
   * @type {epiviz.events.Event.<{datasourceGroup: string, result: epiviz.events.EventResult}>}
   * @private
   */
  this._requestClearDatasourceGroupCache = new epiviz.events.Event();

  /**
   * @type {epiviz.events.Event.<{range: epiviz.datatypes.GenomicRange, result: epiviz.events.EventResult}>}
   * @private
   */
  this._requestNavigate = new epiviz.events.Event();

  /**
   * @type {epiviz.events.Event.<{result: epiviz.events.EventResult}>}
   * @private
   */
  this._requestRedraw = new epiviz.events.Event();

  /**
   * @type {epiviz.events.Event.<{result: epiviz.events.EventResult}>}
   * @private
   */
  this._requestCurrentLocation = new epiviz.events.Event();

  /**
   * @type {epiviz.events.Event.<{result: epiviz.events.EventResult}>}
   * @private
   */
  this._requestPrintWorkspace = new epiviz.events.Event();

  /**
   * @type {epiviz.events.Event.<{result: epiviz.events.EventResult}>}
   * @private
   */
  this._requestSetChartSettings = new epiviz.events.Event();

  /**
   * @type {epiviz.events.Event.<{result: epiviz.events.EventResult}>}
   * @private
   */
  this._requestGetChartSettings = new epiviz.events.Event();

  /**
   * @type {epiviz.events.Event.<{result: epiviz.events.EventResult}>}
   * @private
   */
  this._requestGetAvailableCharts = new epiviz.events.Event();


};

/**
 * @returns {string}
 */
epiviz.data.DataProvider.prototype.id = function() { return this._id; };

/**
 * @param {epiviz.data.Request} request
 * @param {function(epiviz.data.Response<*>)} callback
 */
epiviz.data.DataProvider.prototype.getData = function(request, callback) {
  callback(epiviz.data.Response.fromRawObject({
    requestId: request.id(),
    data: null
  }));
};

/**
 * seqInfos: an array of raw seqInfos, which consist of 3-element arrays: name, min and max
 * @returns {epiviz.events.Event.<{seqInfos: Array.<Array>, result: epiviz.events.EventResult}>}
 */
epiviz.data.DataProvider.prototype.onRequestAddSeqInfos = function() { return this._requestAddSeqInfos; };

/**
 * @returns {epiviz.events.Event.<{seqNames: Array.<string>, result: epiviz.events.EventResult}>}
 */
epiviz.data.DataProvider.prototype.onRequestRemoveSeqNames = function() { return this._requestRemoveSeqNames; };

/**
 * Fired whenever the data provider requests the UI to add new measurements
 * @returns {epiviz.events.Event.<{measurements: epiviz.measurements.MeasurementSet, result: epiviz.events.EventResult}>}
 */
epiviz.data.DataProvider.prototype.onRequestAddMeasurements = function() { return this._requestAddMeasurements; };

/**
 * Fired whenever the data provider requests the UI to remove measurements
 * @returns {epiviz.events.Event.<{measurements: epiviz.measurements.MeasurementSet, result: epiviz.events.EventResult}>}
 */
epiviz.data.DataProvider.prototype.onRequestRemoveMeasurements = function() { return this._requestRemoveMeasurements; };

/**
 * The type argument is a string denoting the complete class name of the chart to be used.
 * For example: 'epiviz.plugins.charts.BlocksTrack'.
 * @returns {epiviz.events.Event.<{type: string, visConfigSelection: epiviz.ui.controls.VisConfigSelection, result: epiviz.events.EventResult.<{id: string}>}>}
 */
epiviz.data.DataProvider.prototype.onRequestAddChart = function() { return this._requestAddChart; };

/**
 * @returns {epiviz.events.Event.<{id: string, result: epiviz.events.EventResult}>}
 */
epiviz.data.DataProvider.prototype.onRequestRemoveChart = function() { return this._requestRemoveChart; };

/**
 * @returns {epiviz.events.Event.<{result: epiviz.events.EventResult}>}
 */
epiviz.data.DataProvider.prototype.onRequestFlushCache = function() { return this._requestFlushCache; };

/**
 * @returns {epiviz.events.Event.<{datasourceGroup: string, result: epiviz.events.EventResult}>}
 */
epiviz.data.DataProvider.prototype.onRequestClearDatasourceGroupCache = function() { return this._requestClearDatasourceGroupCache; };

/**
 * @returns {epiviz.events.Event.<{range: epiviz.datatypes.GenomicRange, result: epiviz.events.EventResult}>}
 */
epiviz.data.DataProvider.prototype.onRequestNavigate = function() { return this._requestNavigate; };

/**
 * @returns {epiviz.events.Event.<{result: epiviz.events.EventResult}>}
 */
epiviz.data.DataProvider.prototype.onRequestRedraw = function() { return this._requestRedraw; };

/**
 * @returns {epiviz.events.Event.<{result: epiviz.events.EventResult}>}
 */
epiviz.data.DataProvider.prototype.onRequestCurrentLocation = function() { return this._requestCurrentLocation; };

/**
 * @returns {epiviz.events.Event.<{result: epiviz.events.EventResult}>}
 */
epiviz.data.DataProvider.prototype.onRequestPrintWorkspace = function() { return this._requestPrintWorkspace; };

/**
 * @returns {epiviz.events.Event.<{result: epiviz.events.EventResult}>}
 */
epiviz.data.DataProvider.prototype.onRequestGetChartSettings = function() { return this._requestGetChartSettings; };

/**
 * @returns {epiviz.events.Event.<{result: epiviz.events.EventResult}>}
 */
epiviz.data.DataProvider.prototype.onRequestSetChartSettings = function() { return this._requestSetChartSettings; };

/**
 * @returns {epiviz.events.Event.<{result: epiviz.events.EventResult}>}
 */
epiviz.data.DataProvider.prototype.onRequestGetAvailableCharts = function() { return this._requestGetAvailableCharts; };


/***/ }),
/* 6 */
/***/ (function(module, exports) {

/**
 * Created by Florin Chelaru ( florinc [at] umd [dot] edu )
 * Date: 4/22/14
 * Time: 12:58 PM
 */

goog.provide('epiviz.data.EmptyResponseDataProvider');

/**
 * @constructor
 * @extends {epiviz.data.DataProvider}
 */
epiviz.data.EmptyResponseDataProvider = function () {
  epiviz.data.DataProvider.call(this, epiviz.data.EmptyResponseDataProvider.DEFAULT_ID);
};

/**
 * Copy methods from upper class
 */
epiviz.data.EmptyResponseDataProvider.prototype = epiviz.utils.mapCopy(epiviz.data.DataProvider.prototype);
epiviz.data.EmptyResponseDataProvider.constructor = epiviz.data.EmptyResponseDataProvider;

epiviz.data.EmptyResponseDataProvider.DEFAULT_ID = 'empty';

/**
 * @param {epiviz.data.Request} request
 * @param {function(epiviz.data.Response)} callback
 * @override
 */
epiviz.data.EmptyResponseDataProvider.prototype.getData = function (request, callback) {
  var requestId = request.id();
  var action = request.get('action');

  switch (action) {
    case epiviz.data.Request.Action.GET_ROWS:
      callback(epiviz.data.Response.fromRawObject({
        data: {
          values: { id: null, start: [], end:[], strand: [], metadata:{my_metadata:[]} },
          globalStartIndex: null,
          useOffset: false
        },
        requestId: requestId
      }));
      return;

    case epiviz.data.Request.Action.GET_VALUES:
      callback(epiviz.data.Response.fromRawObject({
        data: { values: [], globalStartIndex: null },
        requestId: requestId
      }));
      return;

    case epiviz.data.Request.Action.GET_MEASUREMENTS:
      callback(epiviz.data.Response.fromRawObject({
        requestId: request.id(),
        data: { id: [], name: [], type: [], datasourceId: [], datasourceGroup: [], defaultChartType: [], annotation: [], minValue: [], maxValue: [], metadata: [] }
      }));
      return;

    case epiviz.data.Request.Action.GET_SEQINFOS:
      callback(epiviz.data.Response.fromRawObject({
        requestId: request.id(),
        data: []
      }));
      return;

    case epiviz.data.Request.Action.SEARCH:
      callback(epiviz.data.Response.fromRawObject({
        requestId: request.id(),
        data: []
      }));
      return;

    case epiviz.data.Request.Action.SAVE_WORKSPACE:
      callback(epiviz.data.Response.fromRawObject({
	  requestId: request.id(),
	  data: []
    }));
    return;  

    case epiviz.data.Request.Action.DELETE_WORKSPACE:
      callback(epiviz.data.Response.fromRawObject({
	  requestId: request.id(),
	  data: []
    }));
    return;
  
    case epiviz.data.Request.Action.GET_WORKSPACES:
      callback(epiviz.data.Response.fromRawObject({
	  requestId: request.id(),
	  data: []
    }));
    return;

    default:
      epiviz.data.DataProvider.prototype.getData.call(this, request, callback);
      break;
  }
};


/***/ }),
/* 7 */
/***/ (function(module, exports) {

/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 7/3/2015
 * Time: 4:27 PM
 */

goog.provide('epiviz.data.EpivizApiDataProvider');
goog.provide('epiviz.data.EpivizApiDataProvider.Request');

/**
 * @param {string} id
 * @param {string} serverEndpoint
 * @param {Array.<string>} [measurementAnnotations]
 * @param {number} [maxDepth]
 * @param {Object.<number, number>} [selectedLevels]
 * @constructor
 * @extends epiviz.data.DataProvider
 */
epiviz.data.EpivizApiDataProvider = function(id, serverEndpoint, measurementAnnotations, maxDepth, selectedLevels) {
  epiviz.data.DataProvider.call(this, id);

  /**
   * @type {string}
   * @private
   */
  this._serverEndpoint = serverEndpoint;

  /**
   * @type {Array.<string>}
   * @private
   */
  this._measurementAnnotations = measurementAnnotations;

  /**
   * @type {Object.<string, epiviz.ui.charts.tree.NodeSelectionType>}
   * @private
   */
  this._selection = {};

  /**
   * @type {Object.<string, number>}
   * @private
   */
  this._order = {};

  /**
   * @type {Object.<number, number>}
   * @private
   */
  this._selectedLevels = selectedLevels || {6: epiviz.ui.charts.tree.NodeSelectionType.NODE, 7: epiviz.ui.charts.tree.NodeSelectionType.NODE};

  /**
   * @type {string}
   * @private
   */
  this._lastRoot = '';

  /**
   * @type {number}
   * @private
   */
  this._maxDepth = maxDepth || 2;
};

/**
 * Copy methods from upper class
 */
epiviz.data.EpivizApiDataProvider.prototype = epiviz.utils.mapCopy(epiviz.data.DataProvider.prototype);
epiviz.data.EpivizApiDataProvider.constructor = epiviz.data.EpivizApiDataProvider;

/**
 * @type {Object.<string, string>}
 */
epiviz.data.EpivizApiDataProvider.REQUEST_MAPPING = {
  getRows: 'rows',
  getValues: 'values',
  getMeasurements: 'measurements',
  getSeqInfos: 'partitions',
  getHierarchy: 'hierarchy'
};

/**
 * @param {epiviz.data.Request} request
 * @param {function(epiviz.data.Response.<*>)} callback
 */
epiviz.data.EpivizApiDataProvider.prototype.getData = function(request, callback) {
  if (request.isEmpty()) { return; }

  var self = this;
  var apiRequest = self._adaptRequest(request);
  this._send(apiRequest, function(apiData) {
    callback(self._adaptResponse(request, apiData));
  });
};

/**
 * @param {epiviz.data.EpivizApiDataProvider.Request} request
 * @param {function(epiviz.data.EpivizApiDataProvider.Response)} callback
 * @private
 */
epiviz.data.EpivizApiDataProvider.prototype._send = function(request, callback) {
  var requestHandler = $.ajax({
    type: 'post',
    url: this._serverEndpoint,
    data: request,
    dataType: 'json',
    async: true,
    cache: false,
    processData: true
  });

  // callback handler that will be called on success
  requestHandler.done(function (data, textStatus, jqXHR){
    callback(data);
  });

  // callback handler that will be called on failure
  requestHandler.fail(function (jqXHR, textStatus, errorThrown){
    console.error("The following error occured: " + textStatus, errorThrown);
  });

  // callback handler that will be called regardless
  // if the request failed or succeeded
  requestHandler.always(function () {});
};

/**
 * Adapts Epiviz requests to API requests
 * @param {epiviz.data.Request} request
 * @returns {epiviz.data.EpivizApiDataProvider.Request}
 * @private
 */
epiviz.data.EpivizApiDataProvider.prototype._adaptRequest = function(request) {
  var action = request.get('action');
  switch (action) {
    case epiviz.data.Request.Action.GET_MEASUREMENTS:
      return new epiviz.data.EpivizApiDataProvider.Request(request.id(), 'measurements', {annotation: JSON.stringify(this._measurementAnnotations)});
    case epiviz.data.Request.Action.GET_SEQINFOS:
      return new epiviz.data.EpivizApiDataProvider.Request(request.id(), 'partitions');
    case epiviz.data.Request.Action.GET_ROWS:
      var start = request.get('start');
      var end = request.get('end');
      var partition = request.get('seqName');
      if (partition == '[NA]') { partition = ''; }
      return new epiviz.data.EpivizApiDataProvider.Request(request.id(), 'rows', {start: start, end: end, partition: JSON.stringify(partition), selection: JSON.stringify(this._selection), order: JSON.stringify(this._order), selectedLevels: JSON.stringify(this._selectedLevels)});
    case epiviz.data.Request.Action.GET_VALUES:
      var start = request.get('start');
      var end = request.get('end');
      var partition = request.get('seqName');
      var measurement = request.get('measurement');
      if (partition == '[NA]') { partition = ''; }
      return new epiviz.data.EpivizApiDataProvider.Request(request.id(), 'values', {start: start, end: end, partition: JSON.stringify(partition), measurement: JSON.stringify(measurement), selection: JSON.stringify(this._selection), order: JSON.stringify(this._order), selectedLevels: JSON.stringify(this._selectedLevels)});
    case epiviz.data.Request.Action.GET_COMBINED:
      var start = request.get('start');
      var end = request.get('end');
      var partition = request.get('seqName');
      var measurements = request.get('measurements')[this._id];
      if (partition == '[NA]') { partition = ''; }
      return new epiviz.data.EpivizApiDataProvider.Request(request.id(), 'combined', {start: start, end: end, partition: JSON.stringify(partition), measurements: JSON.stringify(measurements), selection: JSON.stringify(this._selection), order: JSON.stringify(this._order), selectedLevels: JSON.stringify(this._selectedLevels)});
    case epiviz.data.Request.Action.GET_HIERARCHY:
      var nodeId = request.get('nodeId') || '';
      this._lastRoot = nodeId;
      return new epiviz.data.EpivizApiDataProvider.Request(request.id(), 'hierarchy', {depth: this._maxDepth, nodeId: JSON.stringify(nodeId), selection: JSON.stringify(this._selection), order: JSON.stringify(this._order), selectedLevels: JSON.stringify(this._selectedLevels)});
    case epiviz.data.Request.Action.PROPAGATE_HIERARCHY_CHANGES:
      var order = request.get('order');
      var selection = request.get('selection');
      var selectedLevels = request.get('selectedLevels');

      if (selectedLevels) {
        var self = this;
        var deselectedNodeIds = [];
        $.each(this._selection, function(nodeId, selectionType) {
          var nodeDepth = self._calcNodeDepth(nodeId);
          var selectionForNodeLevel = selectedLevels[nodeDepth];
          var lastSelectionForNodeLevel = self._selectedLevels[nodeDepth];
          if (selectionForNodeLevel != undefined && selectionForNodeLevel != lastSelectionForNodeLevel) {
            deselectedNodeIds.push(nodeId);
          }
        });
        deselectedNodeIds.forEach(function(nodeId) { delete self._selection[nodeId]; });
      }

      if (selection) {
        for (var nodeId  in selection) {
          if (!selection.hasOwnProperty(nodeId)) { continue; }
          var selectionForNodeLevel = selectedLevels[self._calcNodeDepth(nodeId)];
          if (selectionForNodeLevel == undefined) { selectionForNodeLevel = epiviz.ui.charts.tree.NodeSelectionType.LEAVES; }
          // if (selection[nodeId] == epiviz.ui.charts.tree.NodeSelectionType.LEAVES) {
          if (selection[nodeId] == selectionForNodeLevel) {
            delete this._selection[nodeId];
            continue;
          }
          this._selection[nodeId] = selection[nodeId];
        }
      }

      if (order) {
        for (var nodeId in order) {
          if (!order.hasOwnProperty(nodeId)) { continue; }
          this._order[nodeId] = order[nodeId];
        }
      }

      if (selectedLevels) {
        for (var level in selectedLevels) {
          if (!selectedLevels.hasOwnProperty(level)) { continue; }
          this._selectedLevels[level] = selectedLevels[level];
          if (this._selectedLevels[level] == epiviz.ui.charts.tree.NodeSelectionType.LEAVES) {
            delete this._selectedLevels[level];
          }
        }
      }

      return new epiviz.data.EpivizApiDataProvider.Request(request.id(), 'hierarchy', {depth: this._maxDepth, nodeId: JSON.stringify(this._lastRoot), selection: JSON.stringify(this._selection), order: JSON.stringify(this._order), selectedLevels: JSON.stringify(this._selectedLevels)});
  }
};

/**
 * @param {epiviz.data.Request} request
 * @param {epiviz.data.EpivizApiDataProvider.Response} data
 * @returns {epiviz.data.Response}
 * @private
 */
epiviz.data.EpivizApiDataProvider.prototype._adaptResponse = function(request, data) {
  var result = data.result;
  var action = request.get('action');
  switch (action) {
    case epiviz.data.Request.Action.GET_MEASUREMENTS:
      break;
    case epiviz.data.Request.Action.GET_SEQINFOS:
      result = result.map(function(tuple) { return tuple[0] == null ? ['[NA]'].concat(tuple.slice(1)) : tuple; });
      break;
    case epiviz.data.Request.Action.GET_ROWS:
      result.values.id = result.values.index;
      delete result.values.index;
      if (result.values.end) {
        // On the API, the resulted values are start inclusive, end exclusive
        result.values.end = result.values.end.map(function(val) { return val - 1; });
      }
      break;
    case epiviz.data.Request.Action.GET_VALUES:
      break;
    case epiviz.data.Request.Action.GET_COMBINED:
      result.rows.id = result.rows.index;
      delete result.rows.index;
      if (result.rows.end) {
        // On the API, the resulted values are start inclusive, end exclusive
        result.rows.end = result.rows.end.map(function(val) { return val - 1; });
      }

      var datasource = Object.keys(request.get('measurements'))[0];
      var ret = {};
      ret[datasource] = result;
      result = ret;
      break;
    case epiviz.data.Request.Action.GET_HIERARCHY:
      break;
    case epiviz.data.Request.Action.PROPAGATE_HIERARCHY_CHANGES:
      break;
  }
  return epiviz.data.Response.fromRawObject({
    requestId: request.id(),
    data: result
  });
};

/**
 * @param {string} nodeId
 * @returns {Number}
 * @private
 */
epiviz.data.EpivizApiDataProvider.prototype._calcNodeDepth = function(nodeId) {
  return parseInt(nodeId.split('-')[0], 16);
};

/**
 * @param {string|number} id
 * @param {string} method
 * @param {Array|Object.<string, *>} [params]
 * @constructor
 */
epiviz.data.EpivizApiDataProvider.Request = function(id, method, params) {
  /**
   * @type {string|number}
   */
  this.id = id;
  /**
   * @type {string}
   */
  this.method = method;

  /**
   * @type {Array|Object.<string, *>}
   */
  this.params = params;
};

/**
 * @param {string} id
 * @param {string} error
 * @param {*} result
 * @constructor
 */
epiviz.data.EpivizApiDataProvider.Response = function(id, error, result) {
  /**
   * @type {string}
   */
  this.id = id;

  /**
   * @type {string}
   */
  this.error = error;

  this.result = result;
};


/***/ }),
/* 8 */
/***/ (function(module, exports) {

/**
 * Created by Florin Chelaru ( florinc [at] umd [dot] edu )
 * Date: 3/15/14
 * Time: 1:50 PM
 */

goog.provide('epiviz.data.MessageType');

/**
 * @enum {string}
 */
epiviz.data.MessageType = {
  REQUEST: 'request',
  RESPONSE: 'response'
};


/***/ }),
/* 9 */
/***/ (function(module, exports) {

/**
 * Created by Florin Chelaru ( florinc [at] umd [dot] edu )
 * Date: 11/5/13
 * Time: 9:51 AM
 */

goog.provide('epiviz.data.RequestStack');

/**
 * @constructor
 */
epiviz.data.RequestStack = function() {
  /**
   * An array of requests, in the order they are made
   * @type {Array.<epiviz.data.Request>}
   * @private
   */
  this._requests = [];

  /**
   * Map of callbacks stored by request id
   * @type {Object.<number, function(*)>}
   * @private
   */
  this._callbacks = {};

  /**
   * Map of responses stored by request id
   * @type {Object.<number, *>}
   * @private
   */
  this._dataMap = {};
};

/**
 * @param {epiviz.data.Request} request
 * @param {function(*)} callback
 */
epiviz.data.RequestStack.prototype.pushRequest = function(request, callback) {
  this._requests.push(request);
  this._callbacks[request.id()] = callback;
};

/**
 * Correlates the response to a particular request; the callback corresponding to that
 * request will be called when all requests that were made before this one have been
 * served.
 *
 * @param {epiviz.data.Response<*>} response
 */
epiviz.data.RequestStack.prototype.serveData = function(response) {

  if (!this._callbacks[response.id()]) {
    return;
  }

  // Check if this request is the first request in the stack. If it is,
  // pop it. Otherwise, we'll wait, so that we execute everything in the
  // same order as it was requested.
  if (this._requests.length > 0 && this._requests[0].id() == response.id()) {
    var callback = this._callbacks[response.id()];
    delete this._callbacks[response.id()];
    this._requests = this._requests.slice(1);
    callback(response.data());

    // Serve all other responses that have already come back, and are immediately after this one
    while (this._requests.length > 0 && (this._requests[0].id() in this._dataMap)) {
      callback = this._callbacks[this._requests[0].id()];
      var data = this._dataMap[this._requests[0].id()];
      delete this._callbacks[this._requests[0].id()];
      delete this._dataMap[this._requests[0].id()];
      this._requests = this._requests.slice(1);

      // It is important we call the callback after we've already changed the stack,
      // because the callback may query the stack again
      callback(data);
    }

    return;
  }

  // If unable to serve data, then store it for later
  this._dataMap[response.id()] = response.data();
};

/**
 * Clears the entire request stack
 */
epiviz.data.RequestStack.prototype.clear = function() {
  this._requests = [];
  this._callbacks = {};
  this._dataMap = {};
};



/***/ }),
/* 10 */
/***/ (function(module, exports) {

/**
 * Created by: Florin Chelaru
 * Date: 9/30/13
 * Time: 8:35 PM
 */

goog.provide('epiviz.data.Request');

/**
 * @param {number} id
 * @param {Object.<string, string>} args
 * @param {epiviz.data.Request.Method} [method]
 * @constructor
 */
epiviz.data.Request = function(id, args, method) {
  /**
   * @type {number}
   * @private
   */
  this._id = id;

  /**
   * @type {Object.<string, string>}
   * @private
   */
  this._args = args;

  /**
   * @type {epiviz.data.Request.Method}
   * @private
   */
  this._method = method;
};

/**
 * @enum {string}
 */
epiviz.data.Request.Method = {
  GET: 'get',
  POST: 'post'
};

/**
 * @enum {string}
 */
epiviz.data.Request.Action = {
  // Server actions
  GET_ROWS: 'getRows',
  GET_VALUES: 'getValues',
  GET_COMBINED: 'getCombined',
  GET_MEASUREMENTS: 'getMeasurements',
  SEARCH: 'search',
  GET_SEQINFOS: 'getSeqInfos',
  SAVE_WORKSPACE: 'saveWorkspace',
  DELETE_WORKSPACE: 'deleteWorkspace',
  GET_WORKSPACES: 'getWorkspaces',

  GET_HIERARCHY: 'getHierarchy',
  PROPAGATE_HIERARCHY_CHANGES: 'propagateHierarchyChanges',

  GET_CHART_SETTINGS: 'getChartSettings',
  SET_CHART_SETTINGS: 'setChartSettings',
  GET_AVAILABLE_CHARTS: 'getAvailableCharts',

  // UI actions
  ADD_MEASUREMENTS: 'addMeasurements',
  REMOVE_MEASUREMENTS: 'removeMeasurements',
  ADD_SEQINFOS: 'addSeqInfos',
  REMOVE_SEQNAMES: 'removeSeqNames',
  ADD_CHART: 'addChart',
  REMOVE_CHART: 'removeChart',
  CLEAR_DATASOURCE_GROUP_CACHE: 'clearDatasourceGroupCache',
  FLUSH_CACHE: 'flushCache',
  NAVIGATE: 'navigate',
  REDRAW: 'redraw',
  GET_CURRENT_LOCATION: 'getCurrentLocation',
  WRITE_DEBUG_MSG: 'writeMsg',
  PRINT_WORKSPACE: 'printWorkspace',
  REGISTER_CHART_TYPES: 'registerChartTypes'
};

/**
 * @param {Object.<string, string>} args A map with the arguments for the request
 * @param {epiviz.data.Request.Method} [method]
 * @returns {epiviz.data.Request}
 */
epiviz.data.Request.createRequest = function(args, method) {
  return new epiviz.data.Request(
    epiviz.data.Request._nextId++,
    args,
    method || epiviz.data.Request.Method.GET
  );
};

/**
 * @param {{requestId: number, type: string, data: Object.<string, string>}} o
 * @returns {epiviz.data.Request}
 */
epiviz.data.Request.fromRawObject = function(o) {
  return new epiviz.data.Request(o.requestId, o.data);
};

/**
 * @type {number}
 * @private
 */
epiviz.data.Request._nextId = 0;

/**
 * @returns {number}
 */
epiviz.data.Request.prototype.id = function() { return this._id; };

/**
 * @returns {epiviz.data.MessageType}
 */
epiviz.data.Request.prototype.type = function() { return epiviz.data.MessageType.REQUEST; };

/**
 * @returns {epiviz.data.Request.Method}
 */
epiviz.data.Request.prototype.method = function() { return this._method; };

/**
 * Concatenates all arguments in the request into one string. By default, the result will have the following format:
 *   <key1>=<val1>&<key2>=<val2>...
 * @param {string} [keyValGlue] The token used to join keys and values; by default, this is '='
 * @param {string} [argGlue] The token used to join different arguments together; by default, this is '&'
 * @returns {string}
 */
epiviz.data.Request.prototype.joinArgs = function(keyValGlue, argGlue) {
  keyValGlue = keyValGlue || '=';
  argGlue = argGlue || '&';

  var result = sprintf('requestId%s%s', keyValGlue, this._id);
  for (var arg in this._args) {
    if (!this._args.hasOwnProperty(arg)) { continue; }
    if (!Array.isArray(this._args[arg])) {
      result += sprintf('%s%s%s%s', argGlue, arg, keyValGlue, this._args[arg] || '');
    } else {
      for (var i = 0; i < this._args[arg].length; ++i) {
        result += sprintf('%s%s[]%s%s', argGlue, arg, keyValGlue, this._args[arg][i]);
      }
    }
  }

  return result;
};

/**
 * @returns {boolean}
 */
epiviz.data.Request.prototype.isEmpty = function() {
  for (var arg in this._args) {
    if (!this._args.hasOwnProperty(arg)) { continue; }
    return false;
  }

  return true;
};

/**
 * @param arg
 * @returns {?string}
 */
epiviz.data.Request.prototype.get = function(arg) {
  return (arg in this._args) ? this._args[arg] : null;
};

/**
 * @returns {{requestId: number, type: string, data: Object.<string, string>}}
 */
epiviz.data.Request.prototype.raw = function() {
  return {
    requestId: this._id,
    type: this.type(),
    data: epiviz.utils.mapCopy(this._args)
  };
};

/**
 * @returns {epiviz.data.Request}
 */
epiviz.data.Request.emptyRequest = function() {
  return epiviz.data.Request.createRequest({});
};

/**
 * @param {epiviz.measurements.Measurement} datasource
 * @param {epiviz.datatypes.GenomicRange} [range]
 * @returns {epiviz.data.Request}
 */
epiviz.data.Request.getRows = function(datasource, range) {
  return epiviz.data.Request.createRequest({
    //version: epiviz.EpiViz.VERSION,
    version: 4,
    action: epiviz.data.Request.Action.GET_ROWS,
    datasource: datasource.id(),
    seqName: range ? range.seqName() : undefined,
    start: range ? range.start() : undefined,
    end: range ? range.end() : undefined,
    metadata: datasource.metadata()
  });
};

/**
 * @param {epiviz.measurements.Measurement} measurement
 * @param {epiviz.datatypes.GenomicRange} [range]
 * @returns {epiviz.data.Request}
 */
epiviz.data.Request.getValues = function(measurement, range) {
  return epiviz.data.Request.createRequest({
    //version: epiviz.EpiViz.VERSION,
    version: 4,
    action: epiviz.data.Request.Action.GET_VALUES,
    datasource: measurement.datasource().id(),
    measurement: measurement.id(),
    seqName: range ? range.seqName() : undefined,
    start: range ? range.start() : undefined,
    end: range ? range.end() : undefined
  });
};

/**
 * @param {Object.<string, epiviz.measurements.MeasurementSet>} measurementsByDatasource
 * @param {epiviz.datatypes.GenomicRange} range
 * @returns {epiviz.data.Request}
 */
epiviz.data.Request.getCombined = function(measurementsByDatasource, range) {
  var rawMsByDs = {};
  for (var ds in measurementsByDatasource) {
    if (!measurementsByDatasource.hasOwnProperty(ds)) { continue; }
    rawMsByDs[ds] = (function() {
      var ms = [];
      measurementsByDatasource[ds].foreach(function(m) {
        ms.push(m.id());
      });
      return ms;
    })();
  }
  return epiviz.data.Request.createRequest({
    //version: epiviz.EpiViz.VERSION,
    version: 4,
    action: epiviz.data.Request.Action.GET_COMBINED,
    seqName: range ? range.seqName() : undefined,
    start: range ? range.start() : undefined,
    end: range ? range.end() : undefined,
    measurements: rawMsByDs
  });
};

/**
 * @returns {epiviz.data.Request}
 */
epiviz.data.Request.getMeasurements = function() {
  return epiviz.data.Request.createRequest({
    //version: epiviz.EpiViz.VERSION,
    version: 4,
    action: epiviz.data.Request.Action.GET_MEASUREMENTS
  });
};

/**
 * @param {string} query
 * @param {number} maxResults
 * @returns {epiviz.data.Request}
 */
epiviz.data.Request.search = function(query, maxResults) {
  return epiviz.data.Request.createRequest({
    //version: epiviz.EpiViz.VERSION,
    version: 4,
    action: epiviz.data.Request.Action.SEARCH,
    q: query || '',
    maxResults: maxResults
  });
};

/**
 * @returns {epiviz.data.Request}
 */
epiviz.data.Request.getSeqInfos = function() {
  return epiviz.data.Request.createRequest({
    //version: epiviz.EpiViz.VERSION,
    version: 4,
    action: epiviz.data.Request.Action.GET_SEQINFOS
  });
};

/**
 * @param {epiviz.workspaces.Workspace} workspace
 * @param {epiviz.Config} config
 * @returns {epiviz.data.Request}
 */
epiviz.data.Request.saveWorkspace = function(workspace, config) {
  return epiviz.data.Request.createRequest({
    //version: epiviz.EpiViz.VERSION,
    version: 4,
    action: epiviz.data.Request.Action.SAVE_WORKSPACE,
    id: workspace.id(),
    name: workspace.name(),
    content: encodeURIComponent(JSON.stringify(workspace.raw(config).content))
  },
  epiviz.data.Request.Method.POST);
};

/**
 * @param {epiviz.workspaces.Workspace} workspace
 * @returns {epiviz.data.Request}
 */
epiviz.data.Request.deleteWorkspace = function(workspace) {
  return epiviz.data.Request.createRequest({
      //version: epiviz.EpiViz.VERSION,
      version:4,
      action: epiviz.data.Request.Action.DELETE_WORKSPACE,
      id: workspace.id()
    },
    epiviz.data.Request.Method.POST);
};

/**
 * @param filter
 * @param requestWorkspaceId
 * @returns {epiviz.data.Request}
 */
epiviz.data.Request.getWorkspaces = function(filter, requestWorkspaceId) {
  return epiviz.data.Request.createRequest({
    //version: epiviz.EpiViz.VERSION,
    version:4,
    action: epiviz.data.Request.Action.GET_WORKSPACES,
    q: filter || '',
    ws: requestWorkspaceId
  });
};

/**
 * @param {string} datasourceGroup
 * @param {string} [nodeId]
 * @returns {epiviz.data.Request}
 */
epiviz.data.Request.getHierarchy = function(datasourceGroup, nodeId) {
  return epiviz.data.Request.createRequest({
    //version: epiviz.EpiViz.VERSION,
    version: 4,
    action: epiviz.data.Request.Action.GET_HIERARCHY,
    datasourceGroup: datasourceGroup,
    nodeId: nodeId
  });
};

/**
 * @param {string} datasourceGroup
 * @param {Object.<string, epiviz.ui.charts.tree.NodeSelectionType>} [selection]
 * @param {Object.<string, number>} [order]
 * @param {Object.<number, number>} [selectedLevels]
 * @returns {epiviz.data.Request}
 */
epiviz.data.Request.propagateHierarchyChanges = function(datasourceGroup, selection, order, selectedLevels) {
  return epiviz.data.Request.createRequest({
    //version: epiviz.EpiViz.VERSION,
    version: 4,
    action: epiviz.data.Request.Action.PROPAGATE_HIERARCHY_CHANGES,
    datasourceGroup: datasourceGroup,
    selection: selection,
    order: order,
    selectedLevels: selectedLevels
  });
};




/***/ }),
/* 11 */
/***/ (function(module, exports) {

/**
 * Created by: Florin Chelaru
 * Date: 9/30/13
 * Time: 8:36 PM
 */

goog.provide('epiviz.data.Response');

/**
 * @param {number} requestId
 * @param {T} data
 * @constructor
 * @template T
 */
epiviz.data.Response = function(requestId, data) {
  /**
   * @type {number}
   * @private
   */
  this._id = requestId;

  /**
   * @type {T}
   * @private
   */
  this._data = data;
};

/**
 * @returns {number}
 */
epiviz.data.Response.prototype.id = function() { return this._id; };

/**
 * @returns {T}
 */
epiviz.data.Response.prototype.data = function() {

  var data = this._data;

  // for getMeasurements and getSeqInfo response!
  var all_keys = Object.keys(data);
  if(all_keys.length > 0) {
    if (all_keys.indexOf('success') != -1) {
      all_keys.splice(all_keys.indexOf('success'), 1);
      delete data['success'];
      //for SeqInfo response
/*      if(all_keys.indexOf("") != -1) {
        return data[all_keys[0]];
      }*/
    }
  }
  return data;
};

/**
 * @returns {epiviz.data.MessageType}
 */
epiviz.data.Response.prototype.type = function() { return epiviz.data.MessageType.RESPONSE; };

/**
 * @returns {{requestId: number, type: epiviz.data.MessageType, data: T}}
 */
epiviz.data.Response.prototype.raw = function() {
  return {
    requestId: this._id,
    type: this.type(),
    data: this._data
  };
};

/**
 * @param {{requestId: number, data: T}} o
 * @constructor
 * @template T
 * @returns {epiviz.data.Response.<T>}
 */
epiviz.data.Response.fromRawObject = function(o) {
  return new epiviz.data.Response(o.requestId, o.data);
};


/***/ }),
/* 12 */
/***/ (function(module, exports) {

/**
 * Created by: Florin Chelaru
 * Date: 10/2/13
 * Time: 11:20 AM
 */

goog.provide('epiviz.data.WebServerDataProvider');

/**
 * @param {string} [id]
 * @param {string} [serverEndpoint]
 * @constructor
 * @extends epiviz.data.DataProvider
 */
epiviz.data.WebServerDataProvider = function(id, serverEndpoint) {
  epiviz.data.DataProvider.call(this, id || epiviz.Config.DEFAULT_DATA_PROVIDER_ID);

  /**
   * @type {string}
   * @private
   */
  this._serverEndpoint = serverEndpoint || epiviz.data.WebServerDataProvider.DEFAULT_SERVER_ENDPOINT;
};

/**
 * Copy methods from upper class
 */
epiviz.data.WebServerDataProvider.prototype = epiviz.utils.mapCopy(epiviz.data.DataProvider.prototype);
epiviz.data.WebServerDataProvider.constructor = epiviz.data.WebServerDataProvider;

/**
 * @constant
 * @type {string}
 */
epiviz.data.WebServerDataProvider.DEFAULT_SERVER_ENDPOINT = 'data/main.php';

/**
 * @param {epiviz.data.Request} request
 * @param {function(epiviz.data.Response.<*>)} callback
 */
epiviz.data.WebServerDataProvider.prototype.getData = function(request, callback) {
  if (request.isEmpty()) { return; }

  if (request.method() == epiviz.data.Request.Method.GET) {
    var query = sprintf('%s?%s', this._serverEndpoint, request.joinArgs());

    epiviz.data.WebServerDataProvider.makeGetRequest(query, function(jsondata) {
      callback(epiviz.data.Response.fromRawObject(jsondata));
    });
  } else {
    epiviz.data.WebServerDataProvider.makePostRequest(this._serverEndpoint, request.joinArgs(), function(jsondata) {
      callback(epiviz.data.Response.fromRawObject(jsondata));
    });
  }
};

/**
 *
 * @param query
 * @param callback
 */
epiviz.data.WebServerDataProvider.makeGetRequest = function(query, callback) {
  var request = $.ajax({
    type: "get",
    url: query,
    dataType: "json",
    async: true,
    cache: false,
    processData: true
  });

  // callback handler that will be called on success
  request.done(function (jsonData){
    callback(jsonData);
  });

  // callback handler that will be called on failure
  request.fail(function (jqXHR, textStatus, errorThrown){
    //console.error("The following error occured: " + textStatus, errorThrown);
  });

  // callback handler that will be called regardless
  // if the request failed or succeeded
  request.always(function () {});
};

/**
 * @param {string} query
 * @param {Object} postData
 * @param {function} callback
 */
epiviz.data.WebServerDataProvider.makePostRequest = function(query, postData, callback) {
  var request = $.ajax({
    type: "post",
    url: query,
    data: postData,
    dataType: "json",
    async: true,
    cache: false,
    processData: true
  });

  // callback handler that will be called on success
  request.done(function (data, textStatus, jqXHR){
    callback(data);
  });

  // callback handler that will be called on failure
  request.fail(function (jqXHR, textStatus, errorThrown){
    console.error("The following error occured: " + textStatus, errorThrown);
  });

  // callback handler that will be called regardless
  // if the request failed or succeeded
  request.always(function () {});
};


/***/ }),
/* 13 */
/***/ (function(module, exports) {

/**
 * Created by: Florin Chelaru
 * Date: 10/1/13
 * Time: 1:22 PM
 */

goog.provide('epiviz.data.WebsocketDataProvider');

/**
 * @param {?string} [id]
 * @param {string} websocketHost
 * @constructor
 * @extends {epiviz.data.DataProvider}
 */
epiviz.data.WebsocketDataProvider = function (id, websocketHost) {
  epiviz.data.DataProvider.call(this, id || epiviz.data.WebsocketDataProvider.DEFAULT_ID);

  /**
   * @type {string}
   * @private
   */
  this._websocketHost = websocketHost;

  /**
   * @type {?WebSocket}
   * @private
   */
  this._socket = null;

  /**
   * Variable used for testing. If this is set to false, then
   * events triggered by instances of this class should have no
   * UI effect
   * @type {boolean}
   * @private
   */
  this._useUI = (epiviz.ui.WebArgsManager.WEB_ARGS['websocketNoUI'] != 'true');

  /**
   * Used for testing
   * @type {boolean}
   * @private
   */
  this._debug = (epiviz.ui.WebArgsManager.WEB_ARGS['debug'] == 'true');

  /**
   * Callbacks hashtable, mapping request ids to their corresponding callbacks
   * @type {Object.<string, function>}
   * @private
   */
  this._callbacks = {};

  /**
   * Stores messages as a stack until the socket is actually open
   * @type {Array.<string>}
   * @private
   */
  this._requestsStack = [];

  this._initialize();
};

/**
 * Copy methods from upper class
 */
epiviz.data.WebsocketDataProvider.prototype = epiviz.utils.mapCopy(epiviz.data.DataProvider.prototype);
epiviz.data.WebsocketDataProvider.constructor = epiviz.data.WebsocketDataProvider;

epiviz.data.WebsocketDataProvider.DEFAULT_ID = 'websocket';

/**
 * @private
 */
epiviz.data.WebsocketDataProvider.prototype._initialize = function () {
  if (!this._websocketHost || this._websocketHost == 'None') { return; }

  try {
    this._socket = new WebSocket(this._websocketHost);
    this._log('WebSocket - status ' + this._socket.readyState);
    var self = this;
    this._socket.onopen = function () { self._onSocketOpen(); };
    this._socket.onmessage = function (msg) { self._onSocketMessage(msg); };
    this._socket.onclose = function () { self._onSocketClose(); };
  } catch (error) {
    this._log(error.toString());
    // TODO: Throw some error to be caught up in epiviz.js
  }
};

/**
 * @private
 */
epiviz.data.WebsocketDataProvider.prototype._onSocketOpen = function () {
  // Send the requests that were made before the socked was fully open.
  // Those are stored in this._requestStack
  for (var i = 0; i < this._requestsStack.length; ++i) {
    this._socket.send(this._requestsStack[i]);
  }

  this._requestsStack = [];

  this._registerAvailableCharts();
};


/**
 * @private
 */
epiviz.data.WebsocketDataProvider.prototype._onSocketClose = function () {
  this._socket = null;
};

/**
 * @param {string} message
 * @private
 */
epiviz.data.WebsocketDataProvider.prototype._sendMessage = function (message) {
  if (this.connected() && this._socket.readyState) {
    this._socket.send(message);
  } else {
    this._requestsStack.push(message);
  }
};

/**
 * @param {{data: string}} msg
 * @private
 */
epiviz.data.WebsocketDataProvider.prototype._onSocketMessage = function (msg) {
  this._log('Local Controller Received: ' + msg.data);

  /**
   * @type {{requestId: number, type: string, data: *}}
   */
  var message = JSON.parse(msg.data);
  if (message['type'] == epiviz.data.MessageType.RESPONSE) {
    var response = epiviz.data.Response.fromRawObject(message);
    var callback = this._callbacks[response.id()];
    delete this._callbacks[response.id()];
    callback(response);
  } else if (message['type'] == epiviz.data.MessageType.REQUEST) {
    var Action = epiviz.data.Request.Action;
    var request = epiviz.data.Request.fromRawObject(message);

    switch (request.get('action')) {
      case Action.ADD_MEASUREMENTS:
        this._addMeasurements(request);
        break;
      case Action.REMOVE_MEASUREMENTS:
        this._removeMeasurements(request);
        break;
      case Action.ADD_SEQINFOS:
        this._addSeqInfos(request);
        break;
      case Action.REMOVE_SEQNAMES:
        this._removeSeqNames(request);
        break;
      case Action.ADD_CHART:
        this._addChart(request);
        break;
      case Action.REMOVE_CHART:
        this._removeChart(request);
        break;
      case Action.CLEAR_DATASOURCE_GROUP_CACHE:
        this._clearDatasourceGroupCache(request);
        break;
      case Action.FLUSH_CACHE:
        this._flushCache(request);
        break;
      case Action.NAVIGATE:
        this._navigate(request);
        break;
      case Action.REDRAW:
        this._redraw(request);
        break;
      case Action.GET_CURRENT_LOCATION:
        this._getCurrentLocation(request);
        break;
      case Action.WRITE_DEBUG_MSG: 
        this._writeDebugMsg(request);
        break;
      case Action.PRINT_WORKSPACE:
        this._printWorkspace(request);
        break;
      case Action.SET_CHART_SETTINGS:
        this._setChartSettings(request);
        break;
      case Action.GET_CHART_SETTINGS:
        this._getChartSettings(request);
        break;
      case Action.GET_AVAILABLE_CHARTS:
        this._getAvailableCharts(request);
        break;
    }
  }
};

/**
 * @param {string} message
 * @private
 */
epiviz.data.WebsocketDataProvider.prototype._log = function(message) {
  if (this._debug) { console.log(message); }
};

/**
 * @param {epiviz.events.Event.<{result: epiviz.events.EventResult<*>}>} event
 * @param {{result: epiviz.events.EventResult<*>}} args
 * @private
 */
epiviz.data.WebsocketDataProvider.prototype._fireEvent = function(event, args) {
  if (!this._useUI) {
    args.result.success = true;
    return;
  }

  event.notify(args);
};

/**
 * @returns {boolean}
 */
epiviz.data.WebsocketDataProvider.prototype.connected = function () {
  return (this._socket != null);
};

/**
 * @param {epiviz.data.Request} request
 * @param {function(epiviz.data.Response)} callback
 * @override
 */
epiviz.data.WebsocketDataProvider.prototype.getData = function (request, callback) {
  var message = JSON.stringify(request.raw());
  this._callbacks[request.id()] = callback;

  this._sendMessage(message);
};

// This is the interface to the websocket

/**
 * @param {epiviz.data.Request} request
 * @private
 */
epiviz.data.WebsocketDataProvider.prototype._addMeasurements = function (request) {
  var result = new epiviz.events.EventResult();
  var measurements = new epiviz.measurements.MeasurementSet();

  /**
   * @type {Array.<{
   *   id: string,
   *   name: string,
   *   type: string,
   *   datasourceId: string,
   *   datasourceGroup: string,
   *   defaultChartType: ?string,
   *   annotation: ?Object.<string, string>,
   *   minValue: ?number,
   *   maxValue: ?number,
   *   metadata: ?Array.<string>}>}
   */
  var rawMeasurements = JSON.parse(request.get('measurements'));
  for (var i = 0; i < rawMeasurements.length; ++i) {
    measurements.add(new epiviz.measurements.Measurement(
      rawMeasurements[i]['id'],
      rawMeasurements[i]['name'],
      rawMeasurements[i]['type'],
      rawMeasurements[i]['datasourceId'],
      rawMeasurements[i]['datasourceGroup'],
      this.id(),
      null,
      rawMeasurements[i]['defaultChartType'],
      rawMeasurements[i]['annotation'],
      rawMeasurements[i]['minValue'],
      rawMeasurements[i]['maxValue'],
      rawMeasurements[i]['metadata']
    ));
  }

  this._fireEvent(this.onRequestAddMeasurements(), {measurements: measurements, result: result});

  var response = new epiviz.data.Response(request.id(), result);
  this._sendMessage(JSON.stringify(response.raw()));
};

/**
 * @param {epiviz.data.Request} request
 * @private
 */
epiviz.data.WebsocketDataProvider.prototype._removeMeasurements = function (request) {
  var result = new epiviz.events.EventResult();
  var measurements = new epiviz.measurements.MeasurementSet();

  /**
   * @type {Array.<{
   *   id: string,
   *   name: string,
   *   type: string,
   *   datasourceId: string,
   *   datasourceGroup: string,
   *   defaultChartType: ?string,
   *   annotation: ?Object.<string, string>,
   *   minValue: ?number,
   *   maxValue: ?number,
   *   metadata: ?Array.<string>}>}
   */
  var rawMeasurements = JSON.parse(request.get('measurements'));
  for (var i = 0; i < rawMeasurements.length; ++i) {
    measurements.add(new epiviz.measurements.Measurement(
      rawMeasurements[i]['id'],
      rawMeasurements[i]['name'],
      rawMeasurements[i]['type'],
      rawMeasurements[i]['datasourceId'],
      rawMeasurements[i]['datasourceGroup'],
      this.id(),
      null,
      rawMeasurements[i]['defaultChartType'],
      rawMeasurements[i]['annotation'],
      rawMeasurements[i]['minValue'],
      rawMeasurements[i]['maxValue'],
      rawMeasurements[i]['metadata']
    ));
  }
  this._fireEvent(this.onRequestRemoveMeasurements(), {measurements: measurements, result: result});

  var response = new epiviz.data.Response(request.id(), result);
  this._sendMessage(JSON.stringify(response.raw()));
};

/**
 * @param {epiviz.data.Request} request
 * @private
 */
epiviz.data.WebsocketDataProvider.prototype._addSeqInfos = function (request) {
  var result = new epiviz.events.EventResult();

  /**
   * @type {Array.<Array>}
   */
  var seqInfos = JSON.parse(request.get('seqInfos'));

  this._fireEvent(this.onRequestAddSeqInfos(), {seqInfos: seqInfos, result: result});

  var response = new epiviz.data.Response(request.id(), result);
  this._sendMessage(JSON.stringify(response.raw()));
};

/**
 * @param {epiviz.data.Request} request
 * @private
 */
epiviz.data.WebsocketDataProvider.prototype._removeSeqNames = function (request) {
  var result = new epiviz.events.EventResult();

  /**
   * @type {Array.<string>}
   */
  var seqNames = JSON.parse(request.get('seqNames'));

  this._fireEvent(this.onRequestRemoveSeqNames(), {seqNames: seqNames, result: result});

  var response = new epiviz.data.Response(request.id(), result);
  this._sendMessage(JSON.stringify(response.raw()));
};

/**
 * @param {epiviz.data.Request} request
 * @private
 */
epiviz.data.WebsocketDataProvider.prototype._addChart = function (request) {
  /** @type {epiviz.events.EventResult.<{id: string}>} */
  var result = new epiviz.events.EventResult();

  var measurements, datasource, datasourceGroup;

  if (request.get('measurements') != undefined) {
    measurements = new epiviz.measurements.MeasurementSet();

    /**
     * @type {Array.<{
     *   id: string,
     *   name: string,
     *   type: string,
     *   datasourceId: string,
     *   datasourceGroup: string,
     *   defaultChartType: ?string,
     *   annotation: ?Object.<string, string>,
     *   minValue: ?number,
     *   maxValue: ?number,
     *   metadata: ?Array.<string>}>}
     */
    var rawMeasurements = JSON.parse(request.get('measurements'));
    for (var i = 0; i < rawMeasurements.length; ++i) {
      measurements.add(new epiviz.measurements.Measurement(
        rawMeasurements[i]['id'],
        rawMeasurements[i]['name'],
        rawMeasurements[i]['type'],
        rawMeasurements[i]['datasourceId'],
        rawMeasurements[i]['datasourceGroup'],
        this.id(),
        null,
        rawMeasurements[i]['defaultChartType'],
        rawMeasurements[i]['annotation'],
        rawMeasurements[i]['minValue'],
        rawMeasurements[i]['maxValue'],
        rawMeasurements[i]['metadata']
      ));
    }
  }

  datasource = request.get('datasource');
  datasourceGroup = request.get('datasourceGroup') || datasource;

  this._fireEvent(this.onRequestAddChart(), {
    type: request.get('type'),
    visConfigSelection: new epiviz.ui.controls.VisConfigSelection(measurements, datasource, datasourceGroup),
    result: result
  });

  var response = new epiviz.data.Response(request.id(), result);
  this._sendMessage(JSON.stringify(response.raw()));
};

/**
 * @param {epiviz.data.Request} request
 * @private
 */
epiviz.data.WebsocketDataProvider.prototype._removeChart = function (request) {
  var chartId = request.get('chartId');
  var result = new epiviz.events.EventResult();

  this._fireEvent(this.onRequestRemoveChart(), {
    id: chartId,
    result: result
  });

  var response = new epiviz.data.Response(request.id(), result);
  this._sendMessage(JSON.stringify(response.raw()));
};

/**
 * @param {epiviz.data.Request} request
 * @private
 */
epiviz.data.WebsocketDataProvider.prototype._clearDatasourceGroupCache = function (request) {
  var result = new epiviz.events.EventResult();

  this._fireEvent(this.onRequestClearDatasourceGroupCache(), {
    datasourceGroup: request.get('datasourceGroup'),
    result: result
  });

  var response = new epiviz.data.Response(request.id(), result);
  this._sendMessage(JSON.stringify(response.raw()));
};

/**
 * @param {epiviz.data.Request} request
 * @private
 */
epiviz.data.WebsocketDataProvider.prototype._flushCache = function (request) {
  var result = new epiviz.events.EventResult();
  this._fireEvent(this.onRequestFlushCache(), {
    result: result
  });

  var response = new epiviz.data.Response(request.id(), result);
  this._sendMessage(JSON.stringify(response.raw()));
};

/**
 * @param {epiviz.data.Request} request
 * @private
 */
epiviz.data.WebsocketDataProvider.prototype._navigate = function (request) {
  /**
   * @type {{seqName: string, start: number, end: number}}
   */
  var range = JSON.parse(request.get('range'));
  var result = new epiviz.events.EventResult();

  this._fireEvent(this.onRequestNavigate(), {
    range: epiviz.datatypes.GenomicRange.fromStartEnd(range.seqName, range.start, range.end),
    result: result
  });

  var response = new epiviz.data.Response(request.id(), result);
  this._sendMessage(JSON.stringify(response.raw()));
};

/**
 * @param {epiviz.data.Request} request
 * @private
 */
epiviz.data.WebsocketDataProvider.prototype._redraw = function (request) {
  var result = new epiviz.events.EventResult();
  this._fireEvent(this.onRequestRedraw(), {
    result: result
  });

  var response = new epiviz.data.Response(request.id(), result);
  this._sendMessage(JSON.stringify(response.raw()));
};

/**
 * @param {epiviz.data.Request} request
 * @private
 */
epiviz.data.WebsocketDataProvider.prototype._getCurrentLocation = function(request) {
  var result = new epiviz.events.EventResult();
  this._fireEvent(this.onRequestCurrentLocation(), {
    result: result
  });

  var response = new epiviz.data.Response(request.id(), result);
  this._sendMessage(JSON.stringify(response.raw()));
};

/**
 * @param {epiviz.data.Request} request
 * @private
 */
epiviz.data.WebsocketDataProvider.prototype._writeDebugMsg = function(request) {
    var msg = request.get('msg');
    var msgDiv = document.createElement("pre");
    msgDiv.innerHTML = msg.replace(/&/g, "&amp;").replace(/\\</g,"&lt;");
    var response = new epiviz.data.Response(request.id(), {msg: "that msg"});
    document.getElementById("chart-container").appendChild(msgDiv);
    this._sendMessage(JSON.stringify(response.raw()));
};

/**
 * @param {epiviz.data.Request} request
 * @private
 */
epiviz.data.WebsocketDataProvider.prototype._printWorkspace = function (request) {
  var contrId = request.get('chartId');
  var fName = request.get('fileName');
  var fType = request.get('fileType');
  var result = new epiviz.events.EventResult();
  this._fireEvent(this.onRequestPrintWorkspace(), {
    chartId: contrId,
    fileName: fName,
    fileType: fType,
    result: result
  });

  var response = new epiviz.data.Response(request.id(), result);
  this._sendMessage(JSON.stringify(response.raw()));
};

/**
 * @param {epiviz.data.Request} request
 * @private
 */
epiviz.data.WebsocketDataProvider.prototype._setChartSettings = function (request) {
  var chartId = request.get('chartId');
  var settings = request.get('settings');
  var colorMap = request.get('colorMap');

  var colors = new epiviz.ui.charts.ColorPalette(colorMap);
  var result = new epiviz.events.EventResult();

  this._fireEvent(this.onRequestSetChartSettings(), {
    chartId: chartId,
    settings: settings,
    colorMap: colors,
    result: result
  });

  var response = new epiviz.data.Response(request.id(), result);
  this._sendMessage(JSON.stringify(response.raw()));
};

/**
 * @param {epiviz.data.Request} request
 * @private
 */
epiviz.data.WebsocketDataProvider.prototype._getChartSettings = function (request) {
  var chartId = request.get('chartId');
  var result = new epiviz.events.EventResult();

  this._fireEvent(this.onRequestGetChartSettings(), {
    chartId: chartId,
    result: result
  });

  var response = new epiviz.data.Response(request.id(), result);
  this._sendMessage(JSON.stringify(response.raw()));
};

/**
 * @param {epiviz.data.Request} request
 * @private
 */
epiviz.data.WebsocketDataProvider.prototype._getAvailableCharts = function (request) {
  var result = new epiviz.events.EventResult();

  this._fireEvent(this.onRequestGetChartSettings(), {
    result: result
  });

  var response = new epiviz.data.Response(request.id(), result);
  this._sendMessage(JSON.stringify(response.raw()));
};


/**
 * @param {epiviz.data.Request} request
 * @private
 */
epiviz.data.WebsocketDataProvider.prototype._registerAvailableCharts = function () {
  var result = new epiviz.events.EventResult();

  this._fireEvent(this.onRequestGetChartSettings(), {
    result: result
  });

  request = epiviz.data.Request.createRequest({
    action: epiviz.data.Request.Action.REGISTER_CHART_TYPES,
    data: result.value
  });

  var message = JSON.stringify(request.raw());

  this._callbacks[request.id()] = function (resp) {
    //do nothing
  };

  this._sendMessage(message);
};

/**
 * @param {epiviz.data.Request} request
 * @private
 */
epiviz.data.WebsocketDataProvider.prototype.updateChartSettings = function (request, callback) {
  var message = JSON.stringify(request.raw());
  this._callbacks[request.id()] = callback;
  this._sendMessage(message);
};

/***/ }),
/* 14 */
/***/ (function(module, exports) {

/**
 * Created by Florin Chelaru ( florinc [at] umd [dot] edu )
 * Date: 11/8/13
 * Time: 8:31 AM
 */

goog.provide('epiviz.datatypes.FeatureValueArray');

/**
 * @param {epiviz.measurements.Measurement} measurement
 * @param {epiviz.datatypes.GenomicRange} boundaries
 * @param {number} globalStartIndex
 * @param {Array.<number>|Object.<string, Array.<*>>} values
 * @constructor
 * @extends {epiviz.datatypes.GenomicArray}
 */
epiviz.datatypes.FeatureValueArray = function(measurement, boundaries, globalStartIndex, values) {
  var vals = null;
  var valuesAnnotation = null;
  if (!values || $.isArray(values)) {
    vals = values;
    valuesAnnotation = {values: values};
  } else {
    vals = values.values;
    valuesAnnotation = values;
  }

  epiviz.datatypes.GenomicArray.call(this, measurement, boundaries, globalStartIndex, vals);

  /**
   * @type {Object.<string, Array.<*>>}
   * @private
   */
  this._valuesAnnotation = valuesAnnotation;
};

/**
 * Copy methods from upper class
 */
epiviz.datatypes.FeatureValueArray.prototype = epiviz.utils.mapCopy(epiviz.datatypes.GenomicArray.prototype);
epiviz.datatypes.FeatureValueArray.constructor = epiviz.datatypes.FeatureValueArray;

/**
 * @param {epiviz.measurements.Measurement} measurement
 * @param {epiviz.datatypes.GenomicRange} boundaries
 * @param {number} globalStartIndex
 * @param {Array.<number>} values
 * @returns {epiviz.datatypes.GenomicArray}
 * @override
 */
epiviz.datatypes.FeatureValueArray.prototype.createNew = function(measurement, boundaries, globalStartIndex, values) {
  return new epiviz.datatypes.FeatureValueArray(measurement, boundaries, globalStartIndex, values);
};

/**
 * @param {number} index
 * @returns {number}
 * @override
 */
epiviz.datatypes.FeatureValueArray.prototype.get = function(index) {
  return this._values[index];
};

/**
 * @param index
 * @returns {?Object.<string, *>}
 */
epiviz.datatypes.FeatureValueArray.prototype.getAnnotation = function(index) {
  if (this._valuesAnnotation == undefined) { return null; }
  var ret = {};
  for (var col in this._valuesAnnotation) {
    if (!this._valuesAnnotation.hasOwnProperty(col)) { continue; }
    ret[col] = this._valuesAnnotation[col][index];
  }
  return ret;
};

/**
 * @returns {number}
 * @override
 */
epiviz.datatypes.FeatureValueArray.prototype.size = function() {
  return this._values ? this._values.length : 0;
};

/**
 * @param {epiviz.datatypes.FeatureValueArray} second
 * @param {number} secondIndex
 * @returns {Array.<number>|Object.<string, *>}
 */
epiviz.datatypes.FeatureValueArray.prototype.concatValues = function(second, secondIndex) {
  if (!second || !second.size()) { return this._valuesAnnotation; }
  if (!this._valuesAnnotation || !this._valuesAnnotation.values) {
    this._valuesAnnotation = {values:[]};
  }
  var ret = {};
  for (var key in this._valuesAnnotation) {
    if (!this._valuesAnnotation.hasOwnProperty(key)) { continue; }
    if (!second._valuesAnnotation.hasOwnProperty(key)) { continue; }
    ret[key] = this._valuesAnnotation[key].concat(second._valuesAnnotation[key].slice(secondIndex));
  }
  return ret;
};

/**
 * @param {epiviz.datatypes.GenomicRange} range
 * @param {number} globalStartIndex
 * @param {number} length
 * @returns {epiviz.datatypes.FeatureValueArray}
 */
epiviz.datatypes.FeatureValueArray.prototype.trim = function(range, globalStartIndex, length) {
  if (this.globalStartIndex() == undefined || !this.size() ||
    globalStartIndex == undefined || !range ||
    !this.boundaries() || this.boundaries().seqName() != range.seqName()) {
    return null;
  }

  var start = Math.max(this.boundaries().start(), range.start());
  var end = Math.min(this.boundaries().end(), range.end());
  if (end <= start) { return null; }
  range = epiviz.datatypes.GenomicRange.fromStartEnd(range.seqName(), start, end);

  var startIndex = Math.max(globalStartIndex, this.globalStartIndex()) - this.globalStartIndex();
  var endIndex = Math.min(globalStartIndex + length, this.globalStartIndex() + this.size()) - this.globalStartIndex();
  if (endIndex <= startIndex) { return null; }
  /** @type {Object.<string, Array.<*>>} */
  var values = {};
  for (var key in this._valuesAnnotation) {
    if (!this._valuesAnnotation.hasOwnProperty(key)) { continue; }
    values[key] = this._valuesAnnotation[key].slice(startIndex, endIndex);
  }
  return new epiviz.datatypes.FeatureValueArray(this.measurement(), range, startIndex + this.globalStartIndex(), values);
};

/**
 * @returns {string}
 */
epiviz.datatypes.FeatureValueArray.prototype.toString = function() {
  var c, s, e;
  if (this.boundaries()) {
    c = this.boundaries().seqName();
    s = this.boundaries().start();
    e = this.boundaries().end();
  } else {
    c = s = e = '*';
  }
  var header = sprintf('%25s', this.measurement().name().substr(0, 22)) + sprintf(' [%6s%10s%10s]', c, s, e);
  var idx = sprintf('%10s:', 'idx');
  var val = sprintf('%10s:', 'val');

  if (this.globalStartIndex() != undefined) {
    for (var globalIndex = this.globalStartIndex(); globalIndex < this.globalStartIndex() + this.size(); ++globalIndex) {
      /** @type {number} */
      var v = this.getByGlobalIndex(globalIndex);
      idx += sprintf('%10s', globalIndex);
      val += sprintf('%10s', v);
    }
  }

  return [header, idx, val].join('\n');
};


/***/ }),
/* 15 */
/***/ (function(module, exports) {

/**
 * Created by Florin Chelaru ( florinc [at] umd [dot] edu )
 * Date: 11/8/13
 * Time: 2:34 PM
 */

goog.provide('epiviz.datatypes.GenomicArray');

/**
 * @param {epiviz.measurements.Measurement} measurement
 * @param {epiviz.datatypes.GenomicRange} boundaries
 * @param {number} globalStartIndex
 * @param {*} values
 * @constructor
 */
epiviz.datatypes.GenomicArray = function(measurement, boundaries, globalStartIndex, values) {
  /**
   * @type {epiviz.measurements.Measurement}
   * @private
   */
  this._measurement = measurement;

  /**
   * @type {epiviz.datatypes.GenomicRange}
   * @private
   */
  this._boundaries = boundaries;

  /**
   * @type {?number}
   * @private
   */
  this._globalStartIndex = globalStartIndex;

  /**
   * @type {*}
   * @protected
   */
  this._values = values;
};

/**
 * @returns {epiviz.datatypes.GenomicRange}
 */
epiviz.datatypes.GenomicArray.prototype.boundaries = function() { return this._boundaries; };

/**
 * @returns {?number}
 */
epiviz.datatypes.GenomicArray.prototype.globalStartIndex = function() {
  return this._globalStartIndex;
};

/**
 * @returns {epiviz.measurements.Measurement}
 */
epiviz.datatypes.GenomicArray.prototype.measurement = function() {
  return this._measurement;
};

/**
 * @param {number} index
 * @returns {*}
 */
epiviz.datatypes.GenomicArray.prototype.get = function(index) { throw Error('unimplemented abstract method'); };

/**
 * @returns {number}
 */
epiviz.datatypes.GenomicArray.prototype.size = function() { throw Error('unimplemented abstract method'); };

/**
 * @param {number} globalIndex
 * @returns {*}
 */
epiviz.datatypes.GenomicArray.prototype.getByGlobalIndex = function(globalIndex) {
  return this.get(globalIndex - this._globalStartIndex);
};

/**
 * @param {epiviz.datatypes.GenomicArray} second
 * @param {number} secondIndex
 * @returns {*}
 */
epiviz.datatypes.GenomicArray.prototype.concatValues = function(second, secondIndex) { throw Error('unimplemented abstract method'); };

/**
 * Factory method
 * @param {epiviz.measurements.Measurement} measurement
 * @param {epiviz.datatypes.GenomicRange} boundaries
 * @param {number} globalStartIndex
 * @param {*} values
 * @returns {epiviz.datatypes.GenomicArray}
 */
epiviz.datatypes.GenomicArray.prototype.createNew = function(measurement, boundaries, globalStartIndex, values) { throw Error('unimplemented abstract method'); };

/**
 * Merges two genomic arrays together by global index, eliminating common rows (where indices match)
 * IMPORTANT: This method fails if the given arrays are not overlapping or in continuation of one another
 * @param {epiviz.datatypes.GenomicArray} arr
 * @returns {epiviz.datatypes.GenomicArray}
 */
epiviz.datatypes.GenomicArray.prototype.merge = function(arr) {
  if (!arr || arr.boundaries() == undefined) {
    return this;
  }

  if (this.boundaries().seqName() != arr.boundaries().seqName() ||
    this.boundaries().start() > arr.boundaries().end() ||
    arr.boundaries().start() > this.boundaries().end()) {
    throw Error('Two genomic arrays can only be merged if they overlap or are in continuation to one another');
  }

  var first = (this.boundaries().start() < arr.boundaries().start()) ? this : arr;
  var second = (first == this) ? arr : this;

  if (first.boundaries().end() >= second.boundaries().end()) {
    // The first array contains the given array
    return first;
  }

  // Compute the index of the first element in the second array that isn't in the first as well;
  var secondIndex = (first.globalStartIndex() != undefined && second.globalStartIndex() != undefined) ?
    first.globalStartIndex() + first.size() - second.globalStartIndex() : 0;

  var
    measurement = first.measurement(),
    globalStartIndex = (first.globalStartIndex() != undefined) ? first.globalStartIndex() : second.globalStartIndex(),
    boundaries = epiviz.datatypes.GenomicRange.fromStartEnd(
      first.boundaries().seqName(),
      first.boundaries().start(),
      second.boundaries().end()),
    values = first.concatValues(second, secondIndex);

  return this.createNew(measurement, boundaries, globalStartIndex, values);
};


/***/ }),
/* 16 */
/***/ (function(module, exports) {

/**
 * Created by Florin Chelaru ( florinc [at] umd [dot] edu )
 * Date: 1/15/2015
 * Time: 2:20 PM
 */

goog.provide('epiviz.datatypes.GenomicData');

/**
 * @interface
 */
epiviz.datatypes.GenomicData = function() {};

/**
 * @param {function} callback Called when data is fully initialized and ready to be manipulated
 */
epiviz.datatypes.GenomicData.prototype.ready = function(callback) { throw Error('unimplemented abstract method'); };

/**
 * @returns {boolean}
 */
epiviz.datatypes.GenomicData.prototype.isReady = function() { throw Error('unimplemented abstract method'); };

/**
 * @returns {epiviz.datatypes.MeasurementGenomicData}
 */
epiviz.datatypes.GenomicData.prototype.firstSeries = function() { throw Error('unimplemented abstract method'); };

/**
 * @param {epiviz.measurements.Measurement} m
 * @returns {epiviz.datatypes.MeasurementGenomicData}
 */
epiviz.datatypes.GenomicData.prototype.getSeries = function(m) { throw Error('unimplemented abstract method'); };

/**
 * @param {epiviz.measurements.Measurement} m
 * @param {number} i
 * @returns {epiviz.datatypes.GenomicData.ValueItem}
 */
epiviz.datatypes.GenomicData.prototype.get = function(m, i) { throw Error('unimplemented abstract method'); };

/**
 * @param {epiviz.measurements.Measurement} m
 * @param {number} i
 * @returns {epiviz.datatypes.GenomicData.RowItem}
 */
epiviz.datatypes.GenomicData.prototype.getRow = function(m, i) { throw Error('unimplemented abstract method'); };

/**
 * @returns {Array.<epiviz.measurements.Measurement>}
 */
epiviz.datatypes.GenomicData.prototype.measurements = function() { throw Error('unimplemented abstract method'); };

/**
 * @param {epiviz.measurements.Measurement} m
 * @returns {number}
 */
epiviz.datatypes.GenomicData.prototype.globalStartIndex = function(m) { throw Error('unimplemented abstract method'); };

/**
 * @param {epiviz.measurements.Measurement} m
 * @returns {number}
 */
epiviz.datatypes.GenomicData.prototype.globalEndIndex = function(m) { throw Error('unimplemented abstract method'); };

/**
 * @param {epiviz.measurements.Measurement} m
 * @returns {number}
 */
epiviz.datatypes.GenomicData.prototype.size = function(m) { throw Error('unimplemented abstract method'); };

/**
 * @param {epiviz.measurements.Measurement} m
 * @param {number} globalIndex
 * @returns {epiviz.datatypes.GenomicData.ValueItem}
 */
epiviz.datatypes.GenomicData.prototype.getByGlobalIndex = function(m, globalIndex) { throw Error('unimplemented abstract method'); };

/**
 * @param {epiviz.measurements.Measurement} m
 * @param {number} globalIndex
 * @returns {epiviz.datatypes.GenomicData.RowItem}
 */
epiviz.datatypes.GenomicData.prototype.getRowByGlobalIndex = function(m, globalIndex) { throw Error('unimplemented abstract method'); };

/**
 * Gets the first index and length of the rows that have start positions within the given range
 * @param {epiviz.measurements.Measurement} m
 * @param {epiviz.datatypes.GenomicRange} range
 * @returns {{index: ?number, length: number}}
 */
epiviz.datatypes.GenomicData.prototype.binarySearchStarts = function(m, range) { throw Error('unimplemented abstract method'); };

/**
 * Iterates through all pairs in the map, or until the given function returns something that
 * evaluates to true.
 * @param {function(epiviz.measurements.Measurement, epiviz.datatypes.MeasurementGenomicData, number=)} callback
 */
epiviz.datatypes.GenomicData.prototype.foreach = function(callback) { throw Error('unimplemented abstract method'); };

/**
 * @param {number} globalIndex
 * @param {epiviz.datatypes.GenomicData.RowItem} rowItem
 * @param {?number} [value]
 * @param {epiviz.measurements.Measurement} measurement
 * @param {Object.<string, *>} [valueAnnotation]
 * @constructor
 * @struct
 */
epiviz.datatypes.GenomicData.ValueItem = function(globalIndex, rowItem, value, measurement, valueAnnotation) {
  /**
   * @type {number}
   */
  this.globalIndex = globalIndex;

  /**
   * @type {epiviz.datatypes.GenomicData.RowItem}
   */
  this.rowItem = rowItem;

  /**
   * @type {number}
   */
  this.value = (value === 0 || value) ? value : null;

  /**
   * @type {epiviz.measurements.Measurement}
   */
  this.measurement = measurement;

  /**
   * @type {?Object.<string, *>}
   */
  this.valueAnnotation = valueAnnotation;
};

/**
 * @interface
 */
epiviz.datatypes.GenomicData.RowItem = function() {};

/**
 * @returns {string}
 */
epiviz.datatypes.GenomicData.RowItem.prototype.id = function() { throw Error('unimplemented abstract method'); };

/**
 * @returns {string}
 */
epiviz.datatypes.GenomicData.RowItem.prototype.seqName = function() { throw Error('unimplemented abstract method'); };

/**
 * @returns {number}
 */
epiviz.datatypes.GenomicData.RowItem.prototype.start = function() { throw Error('unimplemented abstract method'); };

/**
 * @returns {number}
 */
epiviz.datatypes.GenomicData.RowItem.prototype.end = function() { throw Error('unimplemented abstract method'); };

/**
 * @returns {number}
 */
epiviz.datatypes.GenomicData.RowItem.prototype.globalIndex = function() { throw Error('unimplemented abstract method'); };

/**
 * @returns {string}
 */
epiviz.datatypes.GenomicData.RowItem.prototype.strand = function() { throw Error('unimplemented abstract method'); };

/**
 * @param {string} column
 * @returns {*}
 */
epiviz.datatypes.GenomicData.RowItem.prototype.metadata = function(column) { throw Error('unimplemented abstract method'); };

/**
 * @returns {Object.<string, *>}
 */
epiviz.datatypes.GenomicData.RowItem.prototype.rowMetadata = function() { throw Error('unimplemented abstract method'); };


/***/ }),
/* 17 */
/***/ (function(module, exports) {

/**
 * Created by Florin Chelaru ( florinc [at] umd [dot] edu )
 * Date: 11/1/13
 * Time: 10:26 AM
 */

goog.provide('epiviz.datatypes.GenomicRangeArray');

/**
 * @param {epiviz.measurements.Measurement} measurement
 * @param {epiviz.datatypes.GenomicRange} boundaries
 * @param {number} globalStartIndex
 * @param {{id: Array.<string>, start: Array.<number>, end: Array.<number>, strand: Array.<string>|string, metadata: Object.<string, Array>}} values
 * @param {boolean} [useOffset] True if the values are compressed and false/undefined/null otherwise
 * @constructor
 * @implements {epiviz.utils.Iterable}
 * @extends {epiviz.datatypes.GenomicArray}
 */
epiviz.datatypes.GenomicRangeArray = function(measurement, boundaries, globalStartIndex, values, useOffset) {

  epiviz.datatypes.GenomicArray.call(this, measurement, boundaries, globalStartIndex, values);

  /**
   * @type {Array.<string>}
   * @private
   */
  this._id = values.id;

  /**
   * @type {Array.<number>}
   * @private
   */
  this._start = values.start;

  /**
   * @type {Array.<number>}
   * @private
   */
  this._end = values.end;

  /**
   * @type {Array.<string>|string}
   * @private
   */
  this._strand = values.strand || null;

  /**
   * @type {Object.<string, Array>}
   * @private
   */
  this._metadata = values.metadata;

  /**
   * @type {?number}
   * @private
   */
  this._size = null;

  // If useOffset is true, it means that the values in the start/end arrays are compressed, and each value
  // in the array (with the exception of the first) is the offset between the real value and the previous one.
  // If the values are compressed, here we decompress them:
  if (useOffset) {
    var i;
    for (i = 1; i < this._start.length; ++i) {
      this._start[i] += this._start[i - 1];

      if (this._end) { this._end[i] += this._end[i - 1]; }
    }
  }
};

/**
 * Copy methods from upper class
 */
epiviz.datatypes.GenomicRangeArray.prototype = epiviz.utils.mapCopy(epiviz.datatypes.GenomicArray.prototype);
epiviz.datatypes.GenomicRangeArray.constructor = epiviz.datatypes.GenomicRangeArray;

/**
 * @param {epiviz.measurements.Measurement} measurement
 * @param {epiviz.datatypes.GenomicRange} boundaries
 * @param {number} globalStartIndex
 * @param {{id: Array.<string>, start: Array.<number>, end: Array.<number>, strand: Array.<string>|string, metadata: Object.<string, Array>}} values
 * @returns {epiviz.datatypes.GenomicArray}
 * @override
 */
epiviz.datatypes.GenomicRangeArray.prototype.createNew = function(measurement, boundaries, globalStartIndex, values) {
  return new epiviz.datatypes.GenomicRangeArray(measurement, boundaries, globalStartIndex, values);
};

/**
 * @param {number} i a numeric index of the row
 * @returns {epiviz.datatypes.GenomicData.RowItem}
 * @override
 */
epiviz.datatypes.GenomicRangeArray.prototype.get = function(i) {
  if (i < 0 || i >= this.size()) { return null; }

  return new epiviz.datatypes.GenomicRangeArray.RowItemWrapper(this, i);
};

/**
 * @returns {number} the total number of items in the structure
 * @override
 */
epiviz.datatypes.GenomicRangeArray.prototype.size = function() {
  if (this._size == undefined) {
    var size = Math.max(
      this._id ? this._id.length : 0,
      this._start ? this._start.length : 0,
      this._end ? this._end.length : 0,
      (this._metadata && Object.keys(this._metadata).length) ?
        Math.max.apply(undefined, $.map(this._metadata, function(col) { return col.length; })) : 0);
    this._size = size;
  }
  return this._size;
};

/**
 * @param {epiviz.datatypes.GenomicRangeArray} second
 * @param {number} secondIndex
 * @returns {{id: Array.<string>, start: Array.<number>, end: Array.<number>, strand: Array.<string>|string, metadata: Object.<string, Array>}}
 */
epiviz.datatypes.GenomicRangeArray.prototype.concatValues = function(second, secondIndex) {
  var strand = null;
  if (!Array.isArray(this._strand) && !Array.isArray(second._strand) && this._strand == second._strand) {
    strand = this._strand;
  } else {
    var
      firstStrand = Array.isArray(this._strand) ? this._strand : epiviz.utils.fillArray(this.size(), this._strand),
      secondStrand = Array.isArray(second._strand) ? second._strand : epiviz.utils.fillArray(second.size(), second._strand);
    strand = firstStrand.concat(secondStrand.slice(secondIndex))
  }

  var
    id = this._id ? this._id.concat(second._id.slice(secondIndex)) : null,
    start = this._start.concat(second._start.slice(secondIndex)),
    end = this._end ? this._end.concat(second._end.slice(secondIndex)) : null;

  // Concatenate metadata values. We assume that both structures have the same columns
  var metadata = {};
  for (var col in this._metadata) {
    if (!this._metadata.hasOwnProperty(col)) { continue; }
    metadata[col] = this._metadata[col].concat(second._metadata[col].slice(secondIndex));
  }

  return {
    id: id,
    start: start,
    end: end,
    strand: strand,
    metadata: metadata
  };
};

/**
 * @param {epiviz.datatypes.GenomicRange} range
 * @returns {?epiviz.datatypes.GenomicRangeArray}
 */
epiviz.datatypes.GenomicRangeArray.prototype.trim = function(range) {
  if (this.globalStartIndex() == undefined || !this.size() || !range || !this.boundaries() || this.boundaries().seqName() != range.seqName()) {
    return null;
  }

  var start = Math.max(this.boundaries().start(), range.start());
  var end = Math.min(this.boundaries().end(), range.end());
  if (end <= start) { return null; }
  range = epiviz.datatypes.GenomicRange.fromStartEnd(range.seqName(), start, end);

  var startIndex = -1;
  var endIndex = -1;
  for (var i = 0; i < this.size(); ++i) {
    if (startIndex < 0 && this.end(i) >= range.start()) { startIndex = i; }
    if (this._start[i] < range.end()) { endIndex = i + 1; }
  }
  if (endIndex <= startIndex) { return null; }

  var values, globalStartIndex;
  var col;

  if (startIndex >= 0 && endIndex >= startIndex) {
    values = {
      id: this._id ? this._id.slice(startIndex, endIndex) : null,
      start: this._start.slice(startIndex, endIndex),
      end: this._end ? this._end.slice(startIndex, endIndex) : null,
      strand: Array.isArray(this._strand) ? this._strand.slice(startIndex, endIndex) : this._strand,
      metadata: {}
    };
    for (col in this._metadata) {
      if (!this._metadata.hasOwnProperty(col)) { continue; }
      values.metadata[col] = this._metadata[col].slice(startIndex, endIndex);
    }
    globalStartIndex = this.globalStartIndex() + startIndex;
  } else {
    values = {
      id: this._id ? [] : null,
      start: [],
      end: this._end ? [] : null,
      strand: Array.isArray(this._strand) ? [] : this._strand,
      metadata: {}
    };
    for (col in this._metadata) {
      if (!this._metadata.hasOwnProperty(col)) { continue; }
      values.metadata[col] = [];
    }
    globalStartIndex = null;
  }

  return new epiviz.datatypes.GenomicRangeArray(this.measurement(), range, globalStartIndex, values);
};

/**
 * @returns {epiviz.datatypes.GenomicRangeArray}
 */
epiviz.datatypes.GenomicRangeArray.prototype.ranges = function() { return this; };

/**
 * Iterates through all genomic ranges until func returns something that evaluates to true
 * @param {function(epiviz.datatypes.GenomicData.RowItem)} func
 */
epiviz.datatypes.GenomicRangeArray.prototype.foreach = function(func) {
  var size = this.size();
  for (var i = 0; i < size; ++i) {
    if (func(this.get(i))) { return; }
  }
};

/**
 * @returns {Array.<string>} the names of the metadata columns associated with the epiviz.datatypes.GenomicRangeArray instance
 */
epiviz.datatypes.GenomicRangeArray.prototype.metadataColumns = function() {
  if (this._metadata) {
    return Object.keys(this._metadata);
  }

  return [];
};

/**
 * @param {number} index
 * @returns {string}
 */
epiviz.datatypes.GenomicRangeArray.prototype.id = function(index) {
  return this._id ? this._id[index] : this.globalStartIndex() + index;
};

/**
 * @param {number} index
 * @returns {number}
 */
epiviz.datatypes.GenomicRangeArray.prototype.start = function(index) {
  return this._start ? this._start[index] : undefined;
};

/**
 * @param {number} index
 * @returns {number}
 */
epiviz.datatypes.GenomicRangeArray.prototype.end = function(index) {
  return this._end ? this._end[index] : this.start(index);
};

/**
 * @param {number} index
 * @returns {string}
 */
epiviz.datatypes.GenomicRangeArray.prototype.strand = function(index) {
  return Array.isArray(this._strand) ? this._strand[index] : this._strand;
};

/**
 * @param {string} column
 * @param {number} index
 * @returns {*}
 */
epiviz.datatypes.GenomicRangeArray.prototype.metadata = function(column, index) {
  if (!this._metadata || !this._metadata[column]) { return null; }
  return this._metadata[column][index];
};

/**
 * @param {number} index
 * @returns {Object.<string, *>}
 */
epiviz.datatypes.GenomicRangeArray.prototype.rowMetadata = function(index) {
  var result = {};
  for (var column in this._metadata) {
    if (!this._metadata.hasOwnProperty(column)) { continue; }
    result[column] = this._metadata[column][index];
  }

  return result;
};

/**
 * @returns {string}
 */
epiviz.datatypes.GenomicRangeArray.prototype.toString = function() {
  var c, s, e;
  if (this.boundaries()) {
    c = this.boundaries().seqName();
    s = this.boundaries().start();
    e = this.boundaries().end();
  } else {
    c = s = e = '*';
  }
  var header = sprintf('%25s', this.measurement().name().substr(0, 22)) + sprintf(' [%6s%10s%10s]', c, s, e);
  var id = sprintf('%10s:', 'id');
  var idx = sprintf('%10s:', 'idx');
  var chr = sprintf('%10s:', 'chr');
  var start = sprintf('%10s:', 'start');
  var end = sprintf('%10s:', 'end');

  if (this.globalStartIndex() != undefined) {
    for (var globalIndex = this.globalStartIndex(); globalIndex < this.globalStartIndex() + this.size(); ++globalIndex) {
      /** @type {epiviz.datatypes.GenomicData.RowItem} */
      var row = this.getByGlobalIndex(globalIndex);
      id += sprintf('%10s', row.id());
      idx += sprintf('%10s', globalIndex);
      chr += sprintf('%10s', row.seqName());
      start += sprintf('%10s', row.start());
      end += sprintf('%10s', row.end());
    }
  }

  return [header, id, idx, chr, start, end].join('\n');
};

goog.provide('epiviz.datatypes.GenomicRangeArray.RowItemWrapper');

/**
 * @param {epiviz.datatypes.GenomicRangeArray} parent
 * @param {number} index
 *
 * @constructor
 * @implements {epiviz.datatypes.GenomicData.RowItem}
 */
epiviz.datatypes.GenomicRangeArray.RowItemWrapper = function(parent, index) {
  /**
   * @type {number}
   * @private
   */
  this._index = index;

  /**
   * @type {epiviz.datatypes.GenomicRangeArray}
   * @private
   */
  this._parent = parent;
};

/**
 * @returns {epiviz.datatypes.GenomicRangeArray}
 */
epiviz.datatypes.GenomicRangeArray.RowItemWrapper.prototype.parent = function() {
  return this._parent;
};

/**
 * @returns {string}
 */
epiviz.datatypes.GenomicRangeArray.RowItemWrapper.prototype.id = function() {
  return this._parent.id(this._index);
};

/**
 * @returns {string}
 */
epiviz.datatypes.GenomicRangeArray.RowItemWrapper.prototype.seqName = function() {
  return this._parent.boundaries() ? this._parent.boundaries().seqName() : undefined;
};

/**
 * @returns {number}
 */
epiviz.datatypes.GenomicRangeArray.RowItemWrapper.prototype.start = function() {
  return this._parent.start(this._index);
};

/**
 * @returns {number}
 */
epiviz.datatypes.GenomicRangeArray.RowItemWrapper.prototype.end = function() {
  return this._parent.end(this._index);
};

/**
 * @returns {number}
 */
epiviz.datatypes.GenomicRangeArray.RowItemWrapper.prototype.index = function() {
  return this._index;
};

/**
 * @returns {number}
 */
epiviz.datatypes.GenomicRangeArray.RowItemWrapper.prototype.globalIndex = function() {
  return this._index + this._parent.globalStartIndex();
};

/**
 * @param {epiviz.datatypes.GenomicData.RowItem} other
 * @returns {boolean}
 */
epiviz.datatypes.GenomicRangeArray.RowItemWrapper.prototype.equals = function(other) {
  if (!other) { return false; }
  if (this == other) { return true; }

  return (other.seqName() == this.seqName() &&
    other.start() == this.start() &&
    other.end() == this.end());
};

/**
 * @returns {string}
 */
epiviz.datatypes.GenomicRangeArray.RowItemWrapper.prototype.strand = function() {
  return this._parent.strand(this._index);
};

/**
 * @param {string} column
 * @returns {*}
 */
epiviz.datatypes.GenomicRangeArray.RowItemWrapper.prototype.metadata = function(column) {
  return this._parent.metadata(column, this._index);
};

/**
 * @returns {Object.<string, *>}
 */
epiviz.datatypes.GenomicRangeArray.RowItemWrapper.prototype.rowMetadata = function() {
  return this._parent.rowMetadata(this._index);
};

/**
 * @param {epiviz.datatypes.GenomicData.RowItem} other
 * @returns {boolean}
 */
epiviz.datatypes.GenomicRangeArray.RowItemWrapper.prototype.overlapsWith = function(other) {
  if (!other) { return false; }
  if (this == other) { return true; }
  if (this.seqName() != other.seqName()) { return false; }
  return (this.start() < other.end() && this.end() > other.start());
};


/***/ }),
/* 18 */
/***/ (function(module, exports) {

/**
 * Created by: Florin Chelaru
 * Date: 10/3/13
 * Time: 6:01 PM
 */

goog.provide('epiviz.datatypes.GenomicRange');

/**
 * A genomic range to be used within EpiViz for requesting and displaying data.
 * IMPORTANT: Not to be confused with epiviz.datatypes.GenomicRanges.Row (an element
 * of GenomicRanges)
 * @param {string} seqname
 * @param {number} start
 * @param {number} width
 * @constructor
 * @implements {epiviz.datatypes.Range}
 */
epiviz.datatypes.GenomicRange = function(seqname, start, width) {

  if (width != undefined && width < 0) {
    width = -width;
    if (start != undefined) {
      start -= width;
    }
  }

  /**
   * @type {string}
   * @private
   */
  this._seqname = seqname;

  /**
   * @type {number}
   * @private
   */
  this._start = start;

  /**
   * @type {number}
   * @private
   */
  this._width = width;
};

/**
 * @param {string} seqname
 * @param {number} start
 * @param {number} end
 * @returns {epiviz.datatypes.GenomicRange}
 */
epiviz.datatypes.GenomicRange.fromStartEnd = function(seqname, start, end) {
  return new epiviz.datatypes.GenomicRange(seqname, start, (start != undefined && end != undefined) ? end - start : undefined);
};

/**
 * @returns {string}
 */
epiviz.datatypes.GenomicRange.prototype.seqName = function() { return this._seqname; };

/**
 * @returns {number}
 */
epiviz.datatypes.GenomicRange.prototype.start = function() { return this._start; };

/**
 * @returns {number}
 */
epiviz.datatypes.GenomicRange.prototype.width = function() { return this._width; };

/**
 * @returns {number}
 */
epiviz.datatypes.GenomicRange.prototype.end = function() { return (this._start != undefined && this._width != undefined) ? this._start + this._width : undefined; };

/**
 * @returns {boolean}
 */
epiviz.datatypes.GenomicRange.prototype.isEmpty = function() { return this._width <= 0; };

/**
 * @param {epiviz.datatypes.GenomicRange} other
 * @returns {Array.<epiviz.datatypes.GenomicRange>}
 */
epiviz.datatypes.GenomicRange.prototype.subtract = function(other) {
  if (!other || other.seqName() != this._seqname || other.isEmpty()
      || other.start() >= this.end() || this._start >= other.end()) {
    return [this];
  }

  if (other.start() <= this._start && other.end() >= this.end()) {
    return [];
  }

  if (other.start() > this._start && other.end() < this.end()) {
    return [
      epiviz.datatypes.GenomicRange.fromStartEnd(this._seqname, this._start, other.start()),
      epiviz.datatypes.GenomicRange.fromStartEnd(this._seqname, other.end(), this.end())
    ];
  }

  if (other.start() > this._start) {
    return [epiviz.datatypes.GenomicRange.fromStartEnd(this._seqname, this._start, other.start())];
  }

  // other.end() < this.end()
  return [epiviz.datatypes.GenomicRange.fromStartEnd(this._seqname, other.end(), this.end())];
};

/**
 * @param {epiviz.datatypes.GenomicRange} other
 * @returns {boolean}
 */
epiviz.datatypes.GenomicRange.prototype.equals = function(other) {
  if (!other) { return false; }

  if (other == this) { return true; }

  return (this._seqname == other._seqname && this._start == other._start && this._width == other._width);
};

/**
 * @param {epiviz.datatypes.GenomicRange} other
 * @returns {boolean}
 */
epiviz.datatypes.GenomicRange.prototype.overlapsWith = function(other) {
  if (!other) { return false; }
  if (this == other) { return true; }
  if (this.seqName() != other.seqName()) { return false; }
  return (this.start() < other.end() && this.end() > other.start());
};

/**
 * @returns {{seqName: string, start: number, width: number}}
 */
epiviz.datatypes.GenomicRange.prototype.raw = function() {
  return {
    seqName: this._seqname,
    start: this._start,
    width: this._width
  };
};

/**
 * @param {{seqName: string, start: number, width: number}} o
 * @returns {epiviz.datatypes.GenomicRange}
 */
epiviz.datatypes.GenomicRange.fromRawObject = function(o) {
  return new epiviz.datatypes.GenomicRange(o.seqName, o.start, o.width);
};


/***/ }),
/* 19 */
/***/ (function(module, exports) {

/**
 * Created by Florin Chelaru ( florinc [at] umd [dot] edu )
 * Date: 1/15/2015
 * Time: 1:56 PM
 */

goog.provide('epiviz.datatypes.ItemFilteredGenomicData');

/**
 * @param {epiviz.datatypes.GenomicData} data
 * @param {epiviz.ui.charts.markers.VisualizationMarker.<epiviz.datatypes.GenomicData, *, epiviz.datatypes.GenomicData.ValueItem, boolean>} filter
 * @constructor
 * @extends {epiviz.datatypes.MapGenomicData}
 */
epiviz.datatypes.ItemFilteredGenomicData = function(data, filter) {
  epiviz.datatypes.MapGenomicData.call(this);

  /**
   * @type {epiviz.datatypes.GenomicData}
   * @private
   */
  this._data = data;

  /**
   * @type {epiviz.ui.charts.markers.VisualizationMarker.<epiviz.datatypes.GenomicData, *, epiviz.datatypes.GenomicData.ValueItem, boolean>}
   * @private
   */
  this._filter = filter;

  /**
   * @type {epiviz.deferred.Deferred}
   * @private
   */
  this._deferredInit = null;

  this._initialize();
};

/*
 * Copy methods from upper class
 */
epiviz.datatypes.ItemFilteredGenomicData.prototype = epiviz.utils.mapCopy(epiviz.datatypes.MapGenomicData.prototype);
epiviz.datatypes.ItemFilteredGenomicData.constructor = epiviz.datatypes.ItemFilteredGenomicData;

/**
 * @returns {epiviz.deferred.Deferred}
 * @private
 */
epiviz.datatypes.ItemFilteredGenomicData.prototype._initialize = function() {

  if (this._deferredInit) { return this._deferredInit; }

  this._deferredInit = new epiviz.deferred.Deferred();

  var self = this;

  /** @type {epiviz.ui.charts.markers.VisualizationMarker.<epiviz.datatypes.GenomicData, *, epiviz.datatypes.GenomicData.ValueItem, boolean>} */
  var filter = this._filter;

  /** @type {epiviz.datatypes.GenomicData} */
  var data = this._data;

  data.ready(function() {
    filter.preMark()(data).done(function(preFilterVars) {
      /** @type {epiviz.measurements.MeasurementHashtable.<epiviz.datatypes.MeasurementGenomicData>} */
      var map = new epiviz.measurements.MeasurementHashtable();

      var measurements = data.measurements();

      epiviz.utils.deferredFor(measurements.length, function(j) {
        var mDeferredIteration = new epiviz.deferred.Deferred();
        var m = measurements[j];
        var mItems = [];
        var mItemsByGlobalIndex = {};

        epiviz.utils.deferredFor(data.size(m), function(i) {
          var dataDeferredIteration = new epiviz.deferred.Deferred();
          var item = data.get(m, i);
          filter.mark()(item, data, preFilterVars).done(function(markResult) {
            if (markResult) {
              mItems.push(item);
              mItemsByGlobalIndex[item.globalIndex] = item;
            }
            dataDeferredIteration.resolve();
          });
          return dataDeferredIteration;
        }).done(function() {
          map.put(m, new epiviz.datatypes.MeasurementGenomicDataArrayWrapper(m, mItems, mItemsByGlobalIndex));
          mDeferredIteration.resolve();
        });

        return mDeferredIteration;
      }).done(function() {
        self._setMap(map);
        self._deferredInit.resolve();
      });
    });
  });

  return this._deferredInit;
};


/***/ }),
/* 20 */
/***/ (function(module, exports) {

/**
 * Created by Florin Chelaru ( florinc [at] umd [dot] edu )
 * Date: 1/15/2015
 * Time: 4:52 PM
 */

goog.provide('epiviz.datatypes.MapGenomicData');

/**
 * @param {epiviz.measurements.MeasurementHashtable.<epiviz.datatypes.MeasurementGenomicData>} [map]
 * @constructor
 * @implements {epiviz.datatypes.GenomicData}
 */
epiviz.datatypes.MapGenomicData = function(map) {
  /**
   * @type {epiviz.measurements.MeasurementHashtable.<epiviz.datatypes.MeasurementGenomicData>}
   * @private
   */
  this._map = map;

  /**
   * @type {Array.<epiviz.measurements.Measurement>}
   * @private
   */
  this._measurements = map ? map.keys() : null;

  /**
   * @type {epiviz.deferred.Deferred}
   * @private
   */
  this._mapLoaded = new epiviz.deferred.Deferred();

  if (this._map) { this._mapLoaded.resolve(); }
};

/**
 * @param {function} callback
 */
epiviz.datatypes.MapGenomicData.prototype.ready = function(callback) {
  this._mapLoaded.done(callback);
};

/**
 * @returns {boolean}
 */
epiviz.datatypes.MapGenomicData.prototype.isReady = function() {
  return this._mapLoaded.state() == epiviz.deferred.Deferred.State.RESOLVED;
};

/**
 * @param {epiviz.measurements.MeasurementHashtable.<epiviz.datatypes.MeasurementGenomicData>} map
 * @protected
 */
epiviz.datatypes.MapGenomicData.prototype._setMap = function(map) {
  if (this._map) { throw Error('MapGenomicData is immutable'); }
  this._map = map;
  if (!map) { return; }
  this._measurements = map.keys();
  this._mapLoaded.resolve();
};

/**
 * @returns {epiviz.datatypes.MeasurementGenomicData}
 */
epiviz.datatypes.MapGenomicData.prototype.firstSeries = function() {
  if (this._map.size() == 0) { return null; }
  return this._map.first().value;
};

/**
 * @param {epiviz.measurements.Measurement} m
 * @returns {epiviz.datatypes.MeasurementGenomicData}
 */
epiviz.datatypes.MapGenomicData.prototype.getSeries = function(m) {
  return this._map.get(m);
};

/**
 * @param {epiviz.measurements.Measurement} m
 * @param {number} i
 * @returns {epiviz.datatypes.GenomicData.ValueItem}
 */
epiviz.datatypes.MapGenomicData.prototype.get = function(m, i) {
  var mItems = this._map.get(m);
  if (!mItems) { return null; }
  return mItems.get(i);
};

/**
 * @param {epiviz.measurements.Measurement} m
 * @param {number} i
 * @returns {epiviz.datatypes.GenomicData.RowItem}
 */
epiviz.datatypes.MapGenomicData.prototype.getRow = function(m, i) {
  var mItems = this._map.get(m);
  if (!mItems) { return null; }
  return mItems.getRow(i);
};

/**
 * @returns {Array.<epiviz.measurements.Measurement>}
 */
epiviz.datatypes.MapGenomicData.prototype.measurements = function() {
  return this._measurements;
};

/**
 * @param {epiviz.measurements.Measurement} m
 * @returns {number}
 */
epiviz.datatypes.MapGenomicData.prototype.globalStartIndex = function(m) {
  var mItems = this._map.get(m);
  if (!mItems) { return null; }
  return mItems.globalStartIndex();
};

/**
 * @param {epiviz.measurements.Measurement} m
 * @returns {number}
 */
epiviz.datatypes.MapGenomicData.prototype.globalEndIndex = function(m) {
  var mItems = this._map.get(m);
  if (!mItems) { return null; }
  return mItems.globalEndIndex();
};

/**
 * @param {epiviz.measurements.Measurement} m
 * @returns {number}
 */
epiviz.datatypes.MapGenomicData.prototype.size = function(m) {
  var mItems = this._map.get(m);
  if (!mItems) { return null; }
  return mItems.size();
};

/**
 * @param {epiviz.measurements.Measurement} m
 * @param {number} globalIndex
 * @returns {epiviz.datatypes.GenomicData.ValueItem}
 */
epiviz.datatypes.MapGenomicData.prototype.getByGlobalIndex = function(m, globalIndex) {
  var mItems = this._map.get(m);
  if (!mItems) { return null; }
  return mItems.getByGlobalIndex(globalIndex);
};

/**
 * @param {epiviz.measurements.Measurement} m
 * @param {number} globalIndex
 * @returns {epiviz.datatypes.GenomicData.RowItem}
 */
epiviz.datatypes.MapGenomicData.prototype.getRowByGlobalIndex = function(m, globalIndex) {
  var mItems = this._map.get(m);
  if (!mItems) { return null; }
  return mItems.getRowByGlobalIndex(globalIndex);
};

/**
 * Gets the first index and length of the rows that have start positions within the given range
 * @param {epiviz.measurements.Measurement} m
 * @param {epiviz.datatypes.GenomicRange} range
 * @returns {{index: ?number, length: number}}
 */
epiviz.datatypes.MapGenomicData.prototype.binarySearchStarts = function(m, range) {
  var mItems = this._map.get(m);
  if (!mItems) { return {index:null, length:0}; }
  return mItems.binarySearchStarts(range);
};

/**
 * Iterates through all pairs in the map, or until the given function returns something that
 * evaluates to true.
 * @param {function(epiviz.measurements.Measurement, epiviz.datatypes.MeasurementGenomicData, number=)} callback
 */
epiviz.datatypes.MapGenomicData.prototype.foreach = function(callback) {
  this._map.foreach(function(m, series, seriesIndex) {
    callback(m, series, seriesIndex);
  });
};



/***/ }),
/* 21 */
/***/ (function(module, exports) {

/**
 * Created by Florin Chelaru ( florinc [at] umd [dot] edu )
 * Date: 1/16/2015
 * Time: 10:56 AM
 */

goog.provide('epiviz.datatypes.MeasurementAggregatedGenomicData');

/**
 * @param {epiviz.datatypes.GenomicData} data
 * @param {epiviz.ui.charts.markers.VisualizationMarker.<epiviz.datatypes.GenomicData, *, epiviz.measurements.Measurement, string>} groupByMarker
 * @param {epiviz.ui.charts.markers.MeasurementAggregator} aggregator
 * @constructor
 * @extends {epiviz.datatypes.MapGenomicData}
 */
epiviz.datatypes.MeasurementAggregatedGenomicData = function(data, groupByMarker, aggregator) {
  epiviz.datatypes.MapGenomicData.call(this);

  /**
   * @type {epiviz.datatypes.GenomicData}
   * @private
   */
  this._data = data;

  /**
   * @type {epiviz.ui.charts.markers.VisualizationMarker.<epiviz.datatypes.GenomicData, *, epiviz.measurements.Measurement, string>}
   * @private
   */
  this._groupByMarker = groupByMarker;

  /**
   * @type {epiviz.ui.charts.markers.MeasurementAggregator}
   * @private
   */
  this._aggregator = aggregator;

  /**
   * @type {epiviz.deferred.Deferred}
   * @private
   */
  this._deferredInit = null;

  this._initialize();
};

/*
 * Copy methods from upper class
 */
epiviz.datatypes.MeasurementAggregatedGenomicData.prototype = epiviz.utils.mapCopy(epiviz.datatypes.MapGenomicData.prototype);
epiviz.datatypes.MeasurementAggregatedGenomicData.constructor = epiviz.datatypes.MeasurementAggregatedGenomicData;

/**
 * @returns {epiviz.deferred.Deferred}
 * @private
 */
epiviz.datatypes.MeasurementAggregatedGenomicData.prototype._initialize = function() {
  if (this._deferredInit) { return this._deferredInit; }

  this._deferredInit = new epiviz.deferred.Deferred();

  var self = this;

  /** @type {epiviz.ui.charts.markers.VisualizationMarker.<epiviz.datatypes.GenomicData, *, epiviz.measurements.Measurement, string>} */
  var groupBy = this._groupByMarker;

  /** @type {epiviz.datatypes.GenomicData} */
  var data = this._data;

  data.ready(function() {
    groupBy.preMark()(data).done(function(preGroupVars) {
      /** @type {epiviz.measurements.MeasurementHashtable.<epiviz.datatypes.MeasurementGenomicData>} */
      var map = new epiviz.measurements.MeasurementHashtable();

      /** @type {Object.<string, Array.<epiviz.measurements.Measurement>>} */
      var grouped = {};

      var measurements = data.measurements();

      epiviz.utils.deferredFor(measurements.length, function(j) {
        var mDeferredIteration = new epiviz.deferred.Deferred();
        var m = measurements[j];
        groupBy.mark()(m, data, preGroupVars).done(function(groupLabel) {
          if (!(groupLabel in grouped)) {
            grouped[groupLabel] = [];
          }
          grouped[groupLabel].push(m);
          mDeferredIteration.resolve();
        });
        return mDeferredIteration;
      }).done(function() {
        var labelMeasurements = {};
        var label;
        /** @type {Array.<epiviz.measurements.Measurement>} */
        var ms;
        for (label in grouped) {
          if (!grouped.hasOwnProperty(label)) { continue; }

          ms = grouped[label];
          var id = label + '-group',
            name = label,
            type = ms[0].type(),
            datasourceId = ms[0].datasourceId(),
            datasourceGroup = ms[0].datasourceGroup(),
            dataprovider = ms[0].dataprovider(),
            defaultChartType = ms[0].defaultChartType(),
            annotation = epiviz.utils.mapCopy(ms[0].annotation()),
            minValue = ms[0].minValue(),
            maxValue = ms[0].maxValue(),
            metadata = ms[0].metadata();
          var metadataColsMap = {};
          metadata.forEach(function(c) { metadataColsMap[c] = c; });
          grouped[label].forEach(function(m) {
            if (datasourceId != m.datasourceId()) { datasourceId = '*'; }
            if (datasourceGroup != m.datasourceGroup()) { datasourceGroup = '*'; }
            if (dataprovider != m.dataprovider()) { dataprovider = '*'; }
            if (defaultChartType != m.defaultChartType()) { defaultChartType = '*'; }

            var mAnno = m.annotation();
            if (annotation != mAnno) {
              if (annotation == undefined) { annotation = epiviz.utils.mapCopy(mAnno); }
              else if (mAnno != undefined) {
                for (var k in mAnno) {
                  if (!mAnno.hasOwnProperty(k)) { continue; }
                  if (!(k in annotation)) { annotation[k] = mAnno[k]; continue; }
                  if (annotation[k] != mAnno[k]) { annotation[k] = '*'; }
                }
              }
            }
            minValue = Math.min(minValue, m.minValue());
            maxValue = Math.max(maxValue, m.maxValue());

            m.metadata().forEach(function(c) {
              if (!(c in metadataColsMap)) {
                metadataColsMap[c] = c;
                metadata.push(c);
              }
            });
          });
          labelMeasurements[label] = new epiviz.measurements.Measurement(id, name, type, datasourceId, datasourceGroup, dataprovider, null, defaultChartType, annotation, minValue, maxValue, metadata);
        }

        for (label in grouped) {
          if (!grouped.hasOwnProperty(label)) { continue; }
          var m = labelMeasurements[label];
          var items = [];
          var itemsByGlobalIndex = {};
          ms = grouped[label];
          var globalStartIndex = Math.min.apply(undefined, ms.map(function(m) { return data.globalStartIndex(m); }));
          var globalEndIndex = Math.max.apply(undefined, ms.map(function(m) { return data.globalEndIndex(m); }));
          for (var globalIndex = globalStartIndex; globalIndex < globalEndIndex; ++globalIndex) {
            /** @type {Array.<epiviz.datatypes.GenomicData.ValueItem>} */
            var indexItems = ms
              .map(function(m) { return data.getByGlobalIndex(m, globalIndex); })
              .filter(function(item) { return item; });
            if (!indexItems.length) { continue; }
            var values = indexItems
              .map(function(item) { return item.value; });
            var aggregation = self._aggregator.aggregate(label, ms, values);
            var row = indexItems[0].rowItem;
            var aggRow = new epiviz.datatypes.RowItemImpl(row.id(), row.seqName(), row.start(), row.end(), row.globalIndex(), row.strand(),
              row.rowMetadata() || {});
            var item = new epiviz.datatypes.GenomicData.ValueItem(globalIndex, aggRow, aggregation.value, m, {errMinus:aggregation.errMinus, errPlus:aggregation.errPlus});
            items.push(item);
            itemsByGlobalIndex[globalIndex] = item;
          }
          var series = new epiviz.datatypes.MeasurementGenomicDataArrayWrapper(m, items, itemsByGlobalIndex);
          map.put(m, series);
        }

        self._setMap(map);
        self._deferredInit.resolve();
      });
    });
  });

  return this._deferredInit;
};


/***/ }),
/* 22 */
/***/ (function(module, exports) {

/**
 * Created by Florin Chelaru ( florinc [at] umd [dot] edu )
 * Date: 1/15/2015
 * Time: 3:05 PM
 */

goog.provide('epiviz.datatypes.MeasurementGenomicDataArrayWrapper');

/**
 * @param {epiviz.measurements.Measurement} measurement
 * @param {Array.<epiviz.datatypes.GenomicData.ValueItem>} items
 * @param {Object.<number, epiviz.datatypes.GenomicData.ValueItem>} itemsByGlobalIndex
 * @constructor
 * @implements {epiviz.datatypes.MeasurementGenomicData}
 */
epiviz.datatypes.MeasurementGenomicDataArrayWrapper = function(measurement, items, itemsByGlobalIndex) {
  /**
   * @type {epiviz.measurements.Measurement}
   * @private
   */
  this._measurement = measurement;

  /**
   * @type {Array.<epiviz.datatypes.GenomicData.ValueItem>}
   * @private
   */
  this._items = items;

  /**
   * @type {Object.<number, epiviz.datatypes.GenomicData.ValueItem>}
   * @private
   */
  this._itemsByGlobalIndex = itemsByGlobalIndex;
};

/**
 * @param {number} index
 * @returns {epiviz.datatypes.GenomicData.ValueItem}
 */
epiviz.datatypes.MeasurementGenomicDataArrayWrapper.prototype.get = function(index) {
  return (this._items && index >= 0 && index < this._items.length) ? this._items[index] : null;
};

/**
 * @param {number} index
 * @returns {epiviz.datatypes.GenomicData.RowItem}
 */
epiviz.datatypes.MeasurementGenomicDataArrayWrapper.prototype.getRow = function(index) {
  return (this._items && index >= 0 && index < this._items.length) ? this._items[index].rowItem : null;
};

/**
 * @returns {epiviz.measurements.Measurement}
 */
epiviz.datatypes.MeasurementGenomicDataArrayWrapper.prototype.measurement = function() {
  return this._measurement;
};

/**
 * @returns {number}
 */
epiviz.datatypes.MeasurementGenomicDataArrayWrapper.prototype.globalStartIndex = function() {
  return (this._items && this._items.length) ? this._items[0].globalIndex : null;
};

/**
 * @returns {number}
 */
epiviz.datatypes.MeasurementGenomicDataArrayWrapper.prototype.globalEndIndex = function() {
  return (this._items && this._items.length) ? this._items[this._items.length - 1].globalIndex + 1 : null;
};

/**
 * @returns {number}
 */
epiviz.datatypes.MeasurementGenomicDataArrayWrapper.prototype.size = function() {
  return (this._items) ? this._items.length : 0;
};

/**
 * @param {number} globalIndex
 * @returns {epiviz.datatypes.GenomicData.ValueItem}
 */
epiviz.datatypes.MeasurementGenomicDataArrayWrapper.prototype.getByGlobalIndex = function(globalIndex) {
  return (this._itemsByGlobalIndex && (globalIndex in this._itemsByGlobalIndex)) ? this._itemsByGlobalIndex[globalIndex] : null;
};

/**
 * @param {number} globalIndex
 * @returns {epiviz.datatypes.GenomicData.RowItem}
 */
epiviz.datatypes.MeasurementGenomicDataArrayWrapper.prototype.getRowByGlobalIndex = function(globalIndex) {
  return (this._itemsByGlobalIndex && (globalIndex in this._itemsByGlobalIndex)) ? this._itemsByGlobalIndex[globalIndex].rowItem : null;
};

/**
 * TODO: Test to check correctness
 * Gets the first index and length of the rows that have start positions within the given range
 * @param {epiviz.datatypes.GenomicRange} range
 * @returns {{index: ?number, length: number}}
 */
epiviz.datatypes.MeasurementGenomicDataArrayWrapper.prototype.binarySearchStarts = function(range) {
  if (!this._items || !this._items.length ||
      this._items[0].rowItem.start() > range.end() ||
      this._items[this._items.length - 1].rowItem.start() < range.start()) {
    return {index:null, length:0};
  }

  // Perform binary search to find the start row index

  var s = 0, e = this._items.length - 1;
  var m;

  var startIndex = null;

  while (s <= e) {
    m = Math.floor((s + e) * 0.5);
    if (this._items[m].rowItem.start() == range.start()) {
      startIndex = m;
      e = m - 1;
    } else if (this._items[m].rowItem.start() < range.start()) { s = m + 1; }
    else { e = m - 1; }
  }

  if (startIndex === null) { startIndex = s; }

  // Perform binary search to find the end row index

  s = 0;
  e = this._items.length - 1;

  var endIndex = null;

  while (s <= e) {
    m = Math.floor((s + e) * 0.5);
    if (this._items[m].rowItem.start() == range.end()) {
      endIndex = m;
      s = m + 1;
    } else if (this._items[m].rowItem.start() < range.end()) { s = m + 1; }
    else { e = m - 1; }
  }

  if (endIndex === null) { endIndex = s - 1; }

  return {
    index: startIndex,
    length: endIndex + 1 - startIndex
  };
};



/***/ }),
/* 23 */
/***/ (function(module, exports) {

/**
 * Created by Florin Chelaru ( florinc [at] umd [dot] edu )
 * Date: 11/8/13
 * Time: 12:45 PM
 */

goog.provide('epiviz.datatypes.MeasurementGenomicDataWrapper');

/**
 * @param {epiviz.measurements.Measurement} measurement
 * @param {epiviz.datatypes.PartialSummarizedExperiment} container
 * @constructor
 * @implements {epiviz.datatypes.MeasurementGenomicData}
 */
epiviz.datatypes.MeasurementGenomicDataWrapper = function(measurement, container) {
  /**
   * @type {epiviz.measurements.Measurement}
   * @private
   */
  this._measurement = measurement;

  /**
   * @type {epiviz.datatypes.PartialSummarizedExperiment}
   * @private
   */
  this._container = container;

  /**
   * @type {?number}
   * @private
   */
  this._size = null;

  /**
   * @type {?number}
   * @private
   */
  this._globalStartIndex = null;
};

/**
 * @param {number} index
 * @returns {epiviz.datatypes.GenomicData.ValueItem}
 */
epiviz.datatypes.MeasurementGenomicDataWrapper.prototype.get = function(index) {
  var rows = this._container.rowData();
  var values = null;
  var firstGlobalIndex = this.globalStartIndex();

  var item = null;
  var value = null;
  var valueAnnotation = null;
  var globalIndex = null;

  var size = this.size();
  if (!size || index >= size || index < 0) {
    return new epiviz.datatypes.GenomicData.ValueItem(globalIndex, item, value, this._measurement, valueAnnotation);
  }

  if (firstGlobalIndex != undefined) {
    if (this._measurement.type() == epiviz.measurements.Measurement.Type.FEATURE ||
      this._measurement.type() == epiviz.measurements.Measurement.Type.UNORDERED) {
      values = this._container.values(this._measurement);
      var valueIndex = firstGlobalIndex - values.globalStartIndex() + index;
      value = values.get(valueIndex);
      valueAnnotation = values.getAnnotation(valueIndex);
    }

    var rowIndex = firstGlobalIndex - rows.globalStartIndex() + index;
    item = rows.get(rowIndex);

    globalIndex = firstGlobalIndex + index;
  }

  return new epiviz.datatypes.GenomicData.ValueItem(globalIndex, item, value, this._measurement, valueAnnotation);
};

/**
 * @param {number} index
 * @returns {epiviz.datatypes.GenomicData.RowItem}
 */
epiviz.datatypes.MeasurementGenomicDataWrapper.prototype.getRow = function(index) {
  var rows = this._container.rowData();
  var firstGlobalIndex = this.globalStartIndex();

  var item = null;

  var size = this.size();
  if (!size || index >= size || index < 0) {
    return item;
  }

  if (firstGlobalIndex != undefined) {
    var rowIndex = firstGlobalIndex - rows.globalStartIndex() + index;
    item = rows.get(rowIndex);
  }

  return item;
};

/**
 * @returns {epiviz.measurements.Measurement}
 */
epiviz.datatypes.MeasurementGenomicDataWrapper.prototype.measurement = function() {
  return this._measurement;
};

/**
 * @returns {number}
 */
epiviz.datatypes.MeasurementGenomicDataWrapper.prototype.globalStartIndex = function() {
  if (this._globalStartIndex !== null) { return this._globalStartIndex; }

  /**
   * @type {?epiviz.datatypes.GenomicRangeArray}
   */
  var rows = this._container.rowData();
  var values = null;
  var firstGlobalIndex = rows.globalStartIndex();

  if (firstGlobalIndex === null) { return firstGlobalIndex; }

  if (this._measurement.type() == epiviz.measurements.Measurement.Type.FEATURE ||
    this._measurement.type() == epiviz.measurements.Measurement.Type.UNORDERED) {
    values = this._container.values(this._measurement);
    if (!values.globalStartIndex()) { return values.globalStartIndex(); }
    firstGlobalIndex = Math.max(firstGlobalIndex, values.globalStartIndex());
  }

  this._globalStartIndex = firstGlobalIndex;
  return this._globalStartIndex;
};

/**
 * @returns {number}
 */
epiviz.datatypes.MeasurementGenomicDataWrapper.prototype.globalEndIndex = function() {
  var startIndex = this.globalStartIndex();
  if (startIndex == null) { return null; }
  return startIndex + this.size();
};

/**
 * @returns {number}
 */
epiviz.datatypes.MeasurementGenomicDataWrapper.prototype.size = function() {
  if (this._size !== null) { return this._size; }

  var firstGlobalIndex = this.globalStartIndex();
  if (firstGlobalIndex == undefined) { return 0; }

  var rows = this._container.rowData();
  var values = this._container.values(this._measurement);

  var result = rows.size() - firstGlobalIndex + rows.globalStartIndex();

  if (this._measurement.type() == epiviz.measurements.Measurement.Type.FEATURE ||
    this._measurement.type() == epiviz.measurements.Measurement.Type.UNORDERED) {
    result = Math.min(result, values.size() - firstGlobalIndex + values.globalStartIndex());
  }

  this._size = Math.max(0, result);

  return this._size;
};

/**
 * @param {number} globalIndex
 * @returns {epiviz.datatypes.GenomicData.ValueItem}
 */
epiviz.datatypes.MeasurementGenomicDataWrapper.prototype.getByGlobalIndex = function(globalIndex) {
  var firstGlobalIndex = this.globalStartIndex();
  if (firstGlobalIndex == undefined) { return new epiviz.datatypes.GenomicData.ValueItem(null, null, null, this._measurement, null); }

  return this.get(globalIndex - firstGlobalIndex);
};

/**
 * @param {number} globalIndex
 * @returns {epiviz.datatypes.GenomicData.RowItem}
 */
epiviz.datatypes.MeasurementGenomicDataWrapper.prototype.getRowByGlobalIndex = function(globalIndex) {
  var firstGlobalIndex = this.globalStartIndex();
  if (firstGlobalIndex == undefined) { return null; }

  return this.getRow(globalIndex - firstGlobalIndex);
};

/**
 * Gets the first index and length of the rows that have start positions within the given range
 * @param {epiviz.datatypes.GenomicRange} range
 * @returns {{index: ?number, length: number}}
 */
epiviz.datatypes.MeasurementGenomicDataWrapper.prototype.binarySearchStarts = function(range) {

  /** @type {?epiviz.datatypes.GenomicRangeArray} */
  var rows = this._container.rowData();

  if (this.size() == 0 || !rows || rows.size() == 0 || rows.start(0) >= range.end() || rows.start(rows.size() - 1) <= range.start()) { return {index: null, length: 0}; }

  // Perform binary search to find the start row index

  var s = 0, e = rows.size() - 1;
  var m;

  var startIndex = null;

  while (s <= e) {
    m = Math.floor((s + e) * 0.5);
    if (rows.start(m) == range.start()) {
      startIndex = m;
      e = m - 1;
    } else if (rows.start(m) < range.start()) { s = m + 1; }
    else { e = m - 1; }
  }

  if (startIndex === null) { startIndex = s; }

  // Perform binary search to find the end row index

  s = 0;
  e = rows.size() - 1;

  var endIndex = null;

  while (s <= e) {
    m = Math.floor((s + e) * 0.5);
    if (rows.start(m) == range.end()) {
      endIndex = m;
      s = m + 1;
    } else if (rows.start(m) < range.end()) { s = m + 1; }
    else { e = m - 1; }
  }

  if (endIndex === null) { endIndex = s - 1; }

  var globalStartIndex = Math.max(startIndex + rows.globalStartIndex(), this.globalStartIndex());
  var globalEndIndex = Math.min(endIndex + rows.globalStartIndex(), this.globalStartIndex() + this.size() - 1);

  return {
    index: globalStartIndex - this.globalStartIndex(),
    length: globalEndIndex - globalStartIndex + 1
  };
};


/***/ }),
/* 24 */
/***/ (function(module, exports) {

/**
 * Created by Florin Chelaru ( florinc [at] umd [dot] edu )
 * Date: 1/15/2015
 * Time: 1:32 PM
 */

goog.provide('epiviz.datatypes.MeasurementGenomicData');

/**
 * @interface
 */
epiviz.datatypes.MeasurementGenomicData = function() {};

/**
 * @param {number} index
 * @returns {epiviz.datatypes.GenomicData.ValueItem}
 */
epiviz.datatypes.MeasurementGenomicData.prototype.get = function(index) { throw Error('unimplemented abstract method'); };

/**
 * @param {number} index
 * @returns {epiviz.datatypes.GenomicData.RowItem}
 */
epiviz.datatypes.MeasurementGenomicData.prototype.getRow = function(index) { throw Error('unimplemented abstract method'); };

/**
 * @returns {epiviz.measurements.Measurement}
 */
epiviz.datatypes.MeasurementGenomicData.prototype.measurement = function() { throw Error('unimplemented abstract method'); };

/**
 * @returns {number}
 */
epiviz.datatypes.MeasurementGenomicData.prototype.globalStartIndex = function() { throw Error('unimplemented abstract method'); };

/**
 * @returns {number}
 */
epiviz.datatypes.MeasurementGenomicData.prototype.globalEndIndex = function() { throw Error('unimplemented abstract method'); };


/**
 * @returns {number}
 */
epiviz.datatypes.MeasurementGenomicData.prototype.size = function() { throw Error('unimplemented abstract method'); };

/**
 * @param {number} globalIndex
 * @returns {epiviz.datatypes.GenomicData.ValueItem}
 */
epiviz.datatypes.MeasurementGenomicData.prototype.getByGlobalIndex = function(globalIndex) { throw Error('unimplemented abstract method'); };

/**
 * @param {number} globalIndex
 * @returns {epiviz.datatypes.GenomicData.RowItem}
 */
epiviz.datatypes.MeasurementGenomicData.prototype.getRowByGlobalIndex = function(globalIndex) { throw Error('unimplemented abstract method'); };

/**
 * Gets the first index and length of the rows that have start positions within the given range
 * @param {epiviz.datatypes.GenomicRange} range
 * @returns {{index: ?number, length: number}}
 */
epiviz.datatypes.MeasurementGenomicData.prototype.binarySearchStarts = function(range) { throw Error('unimplemented abstract method'); };


/***/ }),
/* 25 */
/***/ (function(module, exports) {

/**
 * Created by Florin Chelaru ( florinc [at] umd [dot] edu )
 * Date: 1/15/2015
 * Time: 5:42 PM
 */

goog.provide('epiviz.datatypes.MeasurementOrderedGenomicData');

/**
 * @param {epiviz.datatypes.GenomicData} data
 * @param {epiviz.ui.charts.markers.VisualizationMarker.<epiviz.datatypes.GenomicData, *, epiviz.measurements.Measurement, string|number>} order
 * @constructor
 * @extends {epiviz.datatypes.MapGenomicData}
 */
epiviz.datatypes.MeasurementOrderedGenomicData = function(data, order) {
  epiviz.datatypes.MapGenomicData.call(this);

  /**
   * @type {epiviz.datatypes.GenomicData}
   * @private
   */
  this._data = data;

  /**
   * @type {epiviz.ui.charts.markers.VisualizationMarker.<epiviz.datatypes.GenomicData, *, epiviz.measurements.Measurement, string|number>}
   * @private
   */
  this._order = order;

  /**
   * @type {epiviz.deferred.Deferred}
   * @private
   */
  this._deferredInit = null;

  this._initialize();
};

/*
 * Copy methods from upper class
 */
epiviz.datatypes.MeasurementOrderedGenomicData.prototype = epiviz.utils.mapCopy(epiviz.datatypes.MapGenomicData.prototype);
epiviz.datatypes.MeasurementOrderedGenomicData.constructor = epiviz.datatypes.MeasurementOrderedGenomicData;

/**
 * @returns {epiviz.deferred.Deferred}
 * @private
 */
epiviz.datatypes.MeasurementOrderedGenomicData.prototype._initialize = function() {

  if (this._deferredInit) { return this._deferredInit; }

  this._deferredInit = new epiviz.deferred.Deferred();

  var self = this;

  /** @type {epiviz.datatypes.GenomicData} */
  var data = this._data;

  /** @type {epiviz.ui.charts.markers.VisualizationMarker.<epiviz.datatypes.GenomicData, *, epiviz.datatypes.GenomicData.ValueItem, boolean>} */
  var order = this._order;

  data.ready(function() {
    order.preMark()(data).done(function(preOrderVars) {
      /** @type {epiviz.measurements.MeasurementHashtable.<epiviz.datatypes.MeasurementGenomicData>} */
      var map = new epiviz.measurements.MeasurementHashtable();

      var measurements = data.measurements();
      var measurementLabels = new epiviz.measurements.MeasurementHashtable();
      epiviz.utils.deferredFor(measurements.length, function(j) {
        var mDeferredIteration = new epiviz.deferred.Deferred();
        var m = measurements[j];
        order.mark()(m, data, preOrderVars).done(function(label) {
          measurementLabels.put(m, label);
          mDeferredIteration.resolve();
        });
        return mDeferredIteration;
      }).done(function() {
        measurements.sort(function(m1, m2) {
          var v1 = measurementLabels.get(m1);
          var v2 = measurementLabels.get(m2);
          return (v1 == v2) ? 0 : (v1 < v2 ? -1 : 1);
        });

        measurements.forEach(function(m) {
          map.put(m, data.getSeries(m));
        });

        self._setMap(map);
        self._deferredInit.resolve();
      });
    });
  });

  return this._deferredInit;
};


/***/ }),
/* 26 */
/***/ (function(module, exports) {

/**
 * Created by Florin Chelaru ( florinc [at] umd [dot] edu )
 * Date: 11/1/13
 * Time: 12:05 PM
 */

goog.provide('epiviz.datatypes.PartialSummarizedExperiment');

goog.require('epiviz.datatypes.GenomicRangeArray');

/**
 * @constructor
 */
epiviz.datatypes.PartialSummarizedExperiment = function() {
  /**
   * @type {?epiviz.datatypes.GenomicRangeArray}
   * @private
   */
  this._rowData = null;

  /**
   * @type {epiviz.measurements.MeasurementHashtable.<epiviz.datatypes.FeatureValueArray>}
   * @private
   */
  this._values = new epiviz.measurements.MeasurementHashtable();

};

/**
 * @returns {epiviz.datatypes.GenomicRangeArray}
 */
epiviz.datatypes.PartialSummarizedExperiment.prototype.ranges = function() { return this.rowData(); };

/**
 * @returns {?epiviz.datatypes.GenomicRangeArray}
 */
epiviz.datatypes.PartialSummarizedExperiment.prototype.rowData = function() {
  return this._rowData;
};

/**
 * @param {epiviz.datatypes.GenomicRangeArray} rowData
 */
epiviz.datatypes.PartialSummarizedExperiment.prototype.addRowData = function(rowData) {
  if (!rowData) {
    return;
  }
  if (!this._rowData ||
    this._rowData.boundaries().seqName() != rowData.boundaries().seqName() ||
    this._rowData.boundaries().start() > rowData.boundaries().end() ||
    this._rowData.boundaries().end() < rowData.boundaries().start() ||
    rowData.measurement().type() == epiviz.measurements.Measurement.Type.UNORDERED) {
    this._rowData = rowData;
    return;
  }

  this._rowData = this._rowData.merge(rowData);
};

/**
 * @param {epiviz.datatypes.FeatureValueArray} values
 */
epiviz.datatypes.PartialSummarizedExperiment.prototype.addValues = function(values) {
  if (!values) {
    return;
  }
  var currentValues = this._values.get(values.measurement());
  if (!currentValues ||
    currentValues.boundaries().seqName() != values.boundaries().seqName() ||
    currentValues.boundaries().start() > values.boundaries().end() ||
    currentValues.boundaries().end() < values.boundaries().start() ||
    values.measurement().type() == epiviz.measurements.Measurement.Type.UNORDERED) {
    this._values.put(values.measurement(), values);
    return;
  }

  this._values.put(values.measurement(), currentValues.merge(values));
};

/**
 * @param {epiviz.datatypes.GenomicRange} range
 * @returns {epiviz.datatypes.PartialSummarizedExperiment}
 */
epiviz.datatypes.PartialSummarizedExperiment.prototype.trim = function (range) {
  var result = new epiviz.datatypes.PartialSummarizedExperiment();
  if (this._rowData) {
    result.addRowData(this._rowData.trim(range));
  }

  if (result.rowData()) {
    this._values.foreach(function (m, featureValueArray) {
      result.addValues(featureValueArray.trim(range, result.rowData().globalStartIndex(), result.rowData().size()));
    });
  }

  return result;
};

/**
 * @param {epiviz.measurements.Measurement} measurement
 * @returns {epiviz.datatypes.FeatureValueArray}
 */
epiviz.datatypes.PartialSummarizedExperiment.prototype.values = function(measurement) {
  return this._values.get(measurement);
};

/**
 * Gets the first global index contained in either the rows or one of the value
 * columns loaded so far (inclusive)
 * @returns {?number}
 */
epiviz.datatypes.PartialSummarizedExperiment.prototype.calcMinGlobalIndex = function() {
  var minGlobalIndex = this._rowData ? this._rowData.globalStartIndex() : null;

  if (this._values) {
    this._values.foreach(function(m, valuesArray) {
      if (valuesArray && valuesArray.globalStartIndex() != undefined && (minGlobalIndex == undefined || minGlobalIndex > valuesArray.globalStartIndex())) {
        minGlobalIndex = valuesArray.globalStartIndex();
      }
    });
  }

  return minGlobalIndex;
};

/**
 * Gets the last global index contained in either the rows or one of the value
 * columns loaded so far (exclusive)
 * @returns {?number}
 */
epiviz.datatypes.PartialSummarizedExperiment.prototype.calcMaxGlobalIndex = function() {
  var maxGlobalIndex = (this._rowData && this._rowData.globalStartIndex() != undefined) ? this._rowData.globalStartIndex() + this._rowData.size() : null;

  if (this._values) {
    this._values.foreach(function(m, valuesArray) {
      if (valuesArray && valuesArray.globalStartIndex() != undefined && (maxGlobalIndex == undefined || maxGlobalIndex < valuesArray.globalStartIndex() + valuesArray.size())) {
        maxGlobalIndex = valuesArray.globalStartIndex() + valuesArray.size();
      }
    });
  }

  return maxGlobalIndex;
};

/**
 * @returns {string}
 */
epiviz.datatypes.PartialSummarizedExperiment.prototype.toString = function() {

  var result = '';
  var minGlobalIndex = this.calcMinGlobalIndex();
  var maxGlobalIndex = this.calcMaxGlobalIndex();

  result += sprintf('%25s', this._rowData && this._rowData.measurement() ? this._rowData.measurement().name().substr(0, 22) : '[undefined datasource]');
  var chr, start, end, rowGlobalIndex, rowSize;
  if (this._rowData && this._rowData.boundaries()) {
    chr = this._rowData.boundaries().seqName();
    start = this._rowData.boundaries().start();
    end = this._rowData.boundaries().end();
    rowGlobalIndex = this._rowData.globalStartIndex() != undefined ? this._rowData.globalStartIndex() : '*';
    rowSize = this._rowData.size();
  } else {
    chr = start = end = rowGlobalIndex = '*';
    rowSize = 0;
  }
  result += sprintf(' [%6s%10s%10s] [globalStartIndex: %10s] [size: %7s]\n', chr, start, end, rowGlobalIndex, rowSize);

  var header = sprintf('%15s%15s%15s%15s%15s', 'id', 'idx', 'chr', 'start', 'end');
  if (this._values) {
    this._values.foreach(function(m, valuesArray) {
      result += sprintf('%25s', m.name().substr(0, 22));
      if (valuesArray && valuesArray.boundaries()) {
        chr = valuesArray.boundaries().seqName();
        start = valuesArray.boundaries().start();
        end = valuesArray.boundaries().end();
      } else {
        chr = start = end = '*';
      }
      result += sprintf(' [%6s%10s%10s] [globalStartIndex: %10s] [size: %7s]\n', chr, start, end, valuesArray.globalStartIndex() != undefined ? valuesArray.globalStartIndex() : '*', valuesArray.size());
      header += sprintf('%25s', m.name().substr(0, 22));
    });
  }
  result += header + '\n';

  for (var globalIndex = minGlobalIndex; globalIndex < maxGlobalIndex; ++globalIndex) {
    var id;
    if (this._rowData && this._rowData.globalStartIndex() != undefined && this._rowData.globalStartIndex() <= globalIndex && this._rowData.globalStartIndex() + this._rowData.size() > globalIndex) {
      var row = this._rowData.getByGlobalIndex(globalIndex);

      id = row.id();
      chr = row.seqName();
      start = row.start();
      end = row.end();
    } else {
      id = chr = start = end = '*';
    }
    result += sprintf('%15s%15s%15s%15s%15s', id, globalIndex, chr, start, end);
    if (this._values) {
      this._values.foreach(function(m, valuesArray) {
        if (valuesArray && valuesArray.globalStartIndex() != undefined && valuesArray.globalStartIndex() <= globalIndex && valuesArray.globalStartIndex() + valuesArray.size() > globalIndex) {
          result += sprintf('%25s', valuesArray.getByGlobalIndex(globalIndex));
        } else {
          result += sprintf('%25s', '*');
        }
      });
    }

    result += '\n';
  }

  return result;
};


/***/ }),
/* 27 */
/***/ (function(module, exports) {

/**
 * Created by Florin Chelaru ( florinc [at] umd [dot] edu )
 * Date: 1/16/2015
 * Time: 1:12 PM
 */

goog.provide('epiviz.datatypes.RowItemImpl');

/**
 * @param {string} id
 * @param {string} seqName
 * @param {number} start
 * @param {number} end
 * @param {number} globalIndex
 * @param {string} strand
 * @param {Object.<string, *>} rowMetadata
 * @constructor
 * @implements {epiviz.datatypes.GenomicData.RowItem}
 */
epiviz.datatypes.RowItemImpl = function(id, seqName, start, end, globalIndex, strand, rowMetadata) {
  /**
   * @type {string}
   * @private
   */
  this._id = id;

  /**
   * @type {string}
   * @private
   */
  this._seqName = seqName;

  /**
   * @type {number}
   * @private
   */
  this._start = start;

  /**
   * @type {number}
   * @private
   */
  this._end = end;

  /**
   * @type {number}
   * @private
   */
  this._globalIndex = globalIndex;

  /**
   * @type {string}
   * @private
   */
  this._strand = strand;

  /**
   * @type {Object.<string, *>}
   * @private
   */
  this._rowMetadata = rowMetadata;
};

/**
 * @returns {string}
 */
epiviz.datatypes.RowItemImpl.prototype.id = function() { return this._id; };

/**
 * @returns {string}
 */
epiviz.datatypes.RowItemImpl.prototype.seqName = function() { return this._seqName; };

/**
 * @returns {number}
 */
epiviz.datatypes.RowItemImpl.prototype.start = function() { return this._start; };

/**
 * @returns {number}
 */
epiviz.datatypes.RowItemImpl.prototype.end = function() { return this._end; };

/**
 * @returns {number}
 */
epiviz.datatypes.RowItemImpl.prototype.globalIndex = function() { return this._globalIndex; };

/**
 * @returns {string}
 */
epiviz.datatypes.RowItemImpl.prototype.strand = function() { return this._strand; };

/**
 * @param {string} column
 * @returns {*}
 */
epiviz.datatypes.RowItemImpl.prototype.metadata = function(column) {
  var ret = this._rowMetadata[column];
  if (ret == undefined) { return null; }
  return ret;
};

/**
 * @returns {Object.<string, *>}
 */
epiviz.datatypes.RowItemImpl.prototype.rowMetadata = function() { return this._rowMetadata; };



/***/ }),
/* 28 */
/***/ (function(module, exports) {

/**
 * Created by Florin Chelaru ( florinc [at] umd [dot] edu )
 * Date: 3/27/14
 * Time: 9:18 AM
 */

goog.provide('epiviz.datatypes.SeqInfo');

/**
 * @param {string} seqName
 * @param {number} min Minimum location covered inclusive
 * @param {number} max Maximum location covered exclusive
 * @constructor
 * @struct
 */
epiviz.datatypes.SeqInfo = function(seqName, min, max) {
  /**
   * @type {string}
   */
  this.seqName = seqName;

  /**
   * @type {number}
   */
  this.min = min;

  /**
   * @type {number}
   */
  this.max = max;
};

/**
 * @returns {Array} [seqName, min, max]
 */
epiviz.datatypes.SeqInfo.prototype.raw = function() { return [this.seqName, this.min, this.max]; };

/**
 * @param {Array} o [seqName, min, max]
 * @returns {epiviz.datatypes.SeqInfo}
 */
epiviz.datatypes.SeqInfo.fromRawObject = function(o) { return new epiviz.datatypes.SeqInfo(o[0], parseFloat(o[1]), parseFloat(o[2])); };

/**
 * @param {epiviz.datatypes.SeqInfo} s1
 * @param {epiviz.datatypes.SeqInfo} s2
 * @returns {number}
 */
epiviz.datatypes.SeqInfo.compare = function(s1, s2) {
  if (s1.seqName == s2.seqName) { return 0; }
  if (s1.seqName == undefined) { return -1; }
  if (s2.seqName == undefined) { return 1; }

  var n1str = s1.seqName.replace(/\D/g, '');
  var n2str = s2.seqName.replace(/\D/g, '');

  if (n1str == '' || n2str == '' ||
    (!epiviz.utils.stringStartsWith(s1.seqName, n1str) && !epiviz.utils.stringEndsWith(s1.seqName, n1str)) ||
    (!epiviz.utils.stringStartsWith(s2.seqName, n2str) && !epiviz.utils.stringEndsWith(s2.seqName, n2str))) {
    return (s1.seqName < s2.seqName) ? -1 : ((s1.seqName > s2.seqName) ? 1 : 0);
  }

  return parseInt(n1str) - parseInt(n2str);
};


/***/ }),
/* 29 */
/***/ (function(module, exports) {

/**
 * Created by Florin Chelaru ( florinc [at] umd [dot] edu )
 * Date: 1/26/2015
 * Time: 9:41 AM
 */

goog.provide('epiviz.deferred.Deferred');

/**
 * Wrapper around JQuery Deferred
 * @param {Deferred} [deferred]
 * @constructor
 * @template T
 */
epiviz.deferred.Deferred = function(deferred) {
  /**
   * @type {Deferred}
   * @private
   */
  this._deferred = deferred || $.Deferred();
};

/**
 * @enum {string}
 */
epiviz.deferred.Deferred.State = {
  PENDING: 'pending',
  RESOLVED: 'resolved',
  REJECTED: 'rejected'
};

/**
 * @param {function(T)} doneFilter
 * @param {function} [failFilter]
 * @param {function} [progressFilter]
 * @returns {epiviz.deferred.Promise.<T>}
 */
epiviz.deferred.Deferred.prototype.then = function(doneFilter, failFilter, progressFilter) {
  return new epiviz.deferred.Promise(this._deferred.then(doneFilter, failFilter, progressFilter));
};

/**
 * @param {function(T)|Array.<function(T)>} doneCallbacks
 * @param {function(T)|Array.<function(T)>} [moreDoneCallbacks]
 * @returns {epiviz.deferred.Deferred.<T>}
 */
epiviz.deferred.Deferred.prototype.done = function(doneCallbacks, moreDoneCallbacks) {
  return new epiviz.deferred.Deferred(this._deferred.done(doneCallbacks, moreDoneCallbacks));
};

/**
 * @param {function|Array.<function>} failCallbacks
 * @param {function|Array.<function>} [moreFailCallbacks]
 * @returns {epiviz.deferred.Deferred.<T>}
 */
epiviz.deferred.Deferred.prototype.fail = function(failCallbacks, moreFailCallbacks) {
  return new epiviz.deferred.Deferred(this._deferred.fail(failCallbacks, moreFailCallbacks));
};

/**
 * @param {function|Array.<function>} alwaysCallbacks
 * @param {function|Array.<function>} [moreAlwaysCallbacks]
 * @returns {epiviz.deferred.Deferred.<T>}
 */
epiviz.deferred.Deferred.prototype.always = function(alwaysCallbacks, moreAlwaysCallbacks) {
  return new epiviz.deferred.Deferred(this._deferred.always(alwaysCallbacks, moreAlwaysCallbacks));
};

/**
 * @returns {string}
 */
epiviz.deferred.Deferred.prototype.state = function() {
  return this._deferred.state();
};

/**
 * @param {Object} [args]
 * @retuns {epiviz.deferred.Deferred.<T>}
 */
epiviz.deferred.Deferred.prototype.notify = function(args) {
  return new epiviz.deferred.Deferred(this._deferred.notify(args));
};

/**
 * @param {Object} context
 * @param {Array} [args]
 * @retuns {epiviz.deferred.Deferred.<T>}
 */
epiviz.deferred.Deferred.prototype.notifyWith = function(context, args) {
  return new epiviz.deferred.Deferred(this._deferred.notifyWith(context, args));
};

/**
 * @param {function|Array.<function>} progressCallbacks
 * @param {function|Array.<function>} [moreProgressCallbacks]
 * @returns {epiviz.deferred.Deferred.<T>}
 */
epiviz.deferred.Deferred.prototype.progress = function(progressCallbacks, moreProgressCallbacks) {
  return new epiviz.deferred.Deferred(this._deferred.progress(progressCallbacks, moreProgressCallbacks));
};

/**
 * @param {Object} [target]
 * @returns {epiviz.deferred.Promise.<T>}
 */
epiviz.deferred.Deferred.prototype.promise = function(target) {
  return new epiviz.deferred.Promise(this._deferred.promise(target));
};

/**
 * @param {*} [args]
 * @returns {epiviz.deferred.Deferred.<T>}
 */
epiviz.deferred.Deferred.prototype.reject = function(args) {
  return new epiviz.deferred.Deferred(this._deferred.reject(args));
};

/**
 * @param {Object} context
 * @param {Array} [args]
 * @retuns {epiviz.deferred.Deferred.<T>}
 */
epiviz.deferred.Deferred.prototype.rejectWith = function(context, args) {
  return new epiviz.deferred.Deferred(this._deferred.rejectWith(context, args));
};

/**
 * @param {*} [args]
 * @returns {epiviz.deferred.Deferred.<T>}
 */
epiviz.deferred.Deferred.prototype.resolve = function(args) {
  return new epiviz.deferred.Deferred(this._deferred.resolve(args));
};

/**
 * @param {Object} context
 * @param {Array} [args]
 * @retuns {epiviz.deferred.Deferred.<T>}
 */
epiviz.deferred.Deferred.prototype.resolveWith = function(context, args) {
  return new epiviz.deferred.Deferred(this._deferred.resolveWith(context, args));
};


/***/ }),
/* 30 */
/***/ (function(module, exports) {

/**
 * Created by Florin Chelaru ( florinc [at] umd [dot] edu )
 * Date: 1/26/2015
 * Time: 9:45 AM
 */

goog.provide('epiviz.deferred.Promise');

/**
 * Wrapper around JQuery Promise
 * @param {Promise} promise
 * @constructor
 * @template T The type of result
 */
epiviz.deferred.Promise = function(promise) {
  /**
   * @type {Promise}
   * @private
   */
  this._promise = promise;
};

/**
 * @param {function(T)} doneFilter
 * @param {function} [failFilter]
 * @param {function} [progressFilter]
 * @returns {epiviz.deferred.Promise.<T>}
 */
epiviz.deferred.Promise.prototype.then = function(doneFilter, failFilter, progressFilter) {
  return new epiviz.deferred.Promise(this._promise.then(doneFilter, failFilter, progressFilter));
};

/**
 * @param {function(T)|Array.<function(T)>} doneCallbacks
 * @param {function(T)|Array.<function(T)>} [moreDoneCallbacks]
 * @returns {epiviz.deferred.Deferred.<T>}
 */
epiviz.deferred.Promise.prototype.done = function(doneCallbacks, moreDoneCallbacks) {
  return new epiviz.deferred.Deferred(this._promise.done(doneCallbacks, moreDoneCallbacks));
};

/**
 * @param {function|Array.<function>} failCallbacks
 * @param {function|Array.<function>} [moreFailCallbacks]
 * @returns {epiviz.deferred.Deferred.<T>}
 */
epiviz.deferred.Promise.prototype.fail = function(failCallbacks, moreFailCallbacks) {
  return new epiviz.deferred.Deferred(this._promise.fail(failCallbacks, moreFailCallbacks));
};

/**
 * @param {function|Array.<function>} alwaysCallbacks
 * @param {function|Array.<function>} [moreAlwaysCallbacks]
 * @returns {epiviz.deferred.Deferred.<T>}
 */
epiviz.deferred.Promise.prototype.always = function(alwaysCallbacks, moreAlwaysCallbacks) {
  return new epiviz.deferred.Deferred(this._promise.always(alwaysCallbacks, moreAlwaysCallbacks));
};

/**
 * @returns {string}
 */
epiviz.deferred.Promise.prototype.state = function() {
  return this._promise.state();
};


/***/ }),
/* 31 */
/***/ (function(module, exports) {

/**
 * Created by: Florin Chelaru
 * Date: 9/30/13
 * Time: 8:49 PM
 */

goog.provide('epiviz.events.EventListener');

/**
 * @param {function(T=)} updateCallback
 * @constructor
 * @template T
 */
epiviz.events.EventListener = function(updateCallback) {
  /**
   * @type {number}
   * @private
   */
  this._id = epiviz.events.EventListener._nextId++;

  /**
   * @type {function(T)}
   * @private
   */
  this._updateCallback = updateCallback;
};

epiviz.events.EventListener._nextId = 0;

/**
 * @param {T} [args]
 */
epiviz.events.EventListener.prototype.update = function(args) {
  this._updateCallback(args);
};

/**
 * @returns {number}
 */
epiviz.events.EventListener.prototype.id = function() {
  return this._id;
};


/***/ }),
/* 32 */
/***/ (function(module, exports) {

/**
 * Created by Florin Chelaru ( florinc [at] umd [dot] edu )
 * Date: 3/4/14
 * Time: 10:45 AM
 */

goog.provide('epiviz.events.EventResult');

/**
 * @constructor
 * @struct
 * @template T
 */
epiviz.events.EventResult = function() {
  /**
   * @type {?boolean}
   */
  this.success = null;

  /**
   * @type {?string}
   */
  this.errorMessage = null;

  /**
   * @type {?T}
   */
  this.value = null;
};


/***/ }),
/* 33 */
/***/ (function(module, exports) {

/**
 * Created by: Florin Chelaru
 * Date: 9/30/13
 * Time: 8:42 PM
 */

goog.provide('epiviz.events.Event');

goog.require('epiviz.events.EventListener');

/**
 * @constructor
 * @template T
 */
epiviz.events.Event = function() {
  /**
   * @type {number}
   * @private
   */
  this._count = 0;

  /**
   * @type {Object.<number, epiviz.events.EventListener.<T>>}
   * @private
   */
  this._listeners = {};

  /**
   * Set to true when in the notify() method, to avoid loops
   * @type {boolean}
   * @private
   */
  this._firing = false;
};

/**
 * @param {epiviz.events.EventListener.<T>} listener
 */
epiviz.events.Event.prototype.addListener = function(listener) {
  if (!this._listeners[listener.id()]) { ++this._count; }

  this._listeners[listener.id()] = listener;
};

/**
 * @param {epiviz.events.EventListener.<T>} listener
 */
epiviz.events.Event.prototype.removeListener = function(listener) {
  if (!this._listeners[listener.id()]) { return; }

  delete this._listeners[listener.id()];
  --this._count;
};

/**
 * @param {T} [args]
 */
epiviz.events.Event.prototype.notify = function(args) {
  if (this._firing) { return; }

  if (this._count == 0) { return; }

  this._firing = true;

  for (var id in this._listeners) {
    if (!this._listeners.hasOwnProperty(id)) { continue; }
    this._listeners[id].update(args);
  }

  this._firing = false;
};

/**
 * Returns true if the event is already firing
 * @returns {boolean}
 */
epiviz.events.Event.prototype.isFiring = function() { return this._firing; };


/***/ }),
/* 34 */
/***/ (function(module, exports) {

/**
 * Created by Florin Chelaru ( florinc [at] umd [dot] edu )
 * Date: 10/30/13
 * Time: 3:45 PM
 */

goog.provide('epiviz.measurements.MeasurementHashtable');

/**
 * @constructor
 * @implements {epiviz.utils.Iterable}
 * @template T
 */
epiviz.measurements.MeasurementHashtable = function() {
  /**
   * @type {number}
   * @private
   */
  this._size = 0;

  /**
   * A map containing measurement values in a tree structure, by the following levels:
   *   dataprovider, type, datasourceGroup, datasource, id
   * @type {Object.<string, Object.<string, Object.<string, Object.<string, Object.<string, {key: epiviz.measurements.Measurement, value: T, index: number}>>>>>}
   * @private
   */
  this._measurementTree = {};

  /**
   * @type {Array.<{key: epiviz.measurements.Measurement, value: T, contained: boolean}>}
   * @private
   */
  this._order = [];
};

/**
 * @param {epiviz.measurements.Measurement} m
 * @param {T} value
 */
epiviz.measurements.MeasurementHashtable.prototype.put = function(m, value) {
  if (this.contains(m)) {
    var existingItem = this._measurementTree[m.dataprovider()][m.type()][m.datasourceGroup()][m.datasource().id()][m.id()];
    this._measurementTree[m.dataprovider()][m.type()][m.datasourceGroup()][m.datasource().id()][m.id()] = {key: m, value: value, index: existingItem.index};
    this._order[existingItem.index] = {key: m, value: value, contained: true};
    return;
  }

  if (!(m.dataprovider() in this._measurementTree)) {
    this._measurementTree[m.dataprovider()] = {};
  }

  if (!(m.type() in this._measurementTree[m.dataprovider()])) {
    this._measurementTree[m.dataprovider()][m.type()] = {};
  }

  if (!(m.datasourceGroup() in this._measurementTree[m.dataprovider()][m.type()])) {
    this._measurementTree[m.dataprovider()][m.type()][m.datasourceGroup()] = {};
  }

  if (!(m.datasource().id() in this._measurementTree[m.dataprovider()][m.type()][m.datasourceGroup()])) {
    this._measurementTree[m.dataprovider()][m.type()][m.datasourceGroup()][m.datasource().id()] = {};
  }

  this._measurementTree[m.dataprovider()][m.type()][m.datasourceGroup()][m.datasource().id()][m.id()] = {key: m, value: value, index: this._order.length};
  this._order.push({key: m, value: value, contained: true});

  ++this._size;
};

/**
 * @param {epiviz.measurements.Measurement} m
 * @returns {?T}
 */
epiviz.measurements.MeasurementHashtable.prototype.get = function(m) {
  if (!this.contains(m)) { return null; }

  return this._measurementTree[m.dataprovider()][m.type()][m.datasourceGroup()][m.datasource().id()][m.id()].value;
};

/**
 * @param {epiviz.measurements.Measurement} m
 * @returns {boolean} true if the measurement was in the data structure and was removed
 *   and false if the measurement was not in the collection
 */
epiviz.measurements.MeasurementHashtable.prototype.remove = function(m) {
  if (!this.contains(m)) {
    return false;
  }

  var item = this._measurementTree[m.dataprovider()][m.type()][m.datasourceGroup()][m.datasource().id()][m.id()];
  delete this._measurementTree[m.dataprovider()][m.type()][m.datasourceGroup()][m.datasource().id()][m.id()];
  this._order[item.index].contained = false;
  --this._size;
  return true;
};

/**
 * @param {epiviz.measurements.Measurement} m
 * @returns {boolean}
 */
epiviz.measurements.MeasurementHashtable.prototype.contains = function(m) {
  if (!(m.dataprovider() in this._measurementTree)) {
    return false;
  }

  if (!(m.type() in this._measurementTree[m.dataprovider()])) {
    return false;
  }

  if (!(m.datasourceGroup() in this._measurementTree[m.dataprovider()][m.type()])) {
    return false;
  }

  if (!(m.datasource().id() in this._measurementTree[m.dataprovider()][m.type()][m.datasourceGroup()])) {
    return false;
  }

  return (m.id() in this._measurementTree[m.dataprovider()][m.type()][m.datasourceGroup()][m.datasource().id()]);
};

/**
 */
epiviz.measurements.MeasurementHashtable.prototype.clear = function() {
  this._size = 0;
  this._measurementTree = {};
  this._order = [];
};

/**
 * @returns {boolean}
 */
epiviz.measurements.MeasurementHashtable.prototype.isEmpty = function() {
  return this._size == 0;
};

/**
 * returns {number}
 */
epiviz.measurements.MeasurementHashtable.prototype.size = function() {
  return this._size;
};

/**
 * Iterates through all pairs in the map, or until the given function returns something that
 * evaluates to true.
 * @param {function(epiviz.measurements.Measurement, T, number=)} func
 * @param {function(epiviz.measurements.Measurement):boolean} [predicate]
 */
epiviz.measurements.MeasurementHashtable.prototype.foreach = function(func, predicate) {
  var iter = this.iterator();
  for (var pair = iter.first(), i = 0; pair !== null; pair = iter.next(), ++i) {
    if (predicate && !predicate(pair.key)) { continue; }
    if (func(pair.key, pair.value, i)) { return; }
  }
};

/**
 * @returns {{key: epiviz.measurements.Measurement, value: T}}
 */
epiviz.measurements.MeasurementHashtable.prototype.first = function() {
  return this.iterator().first();
};

/**
 * Creates a copy of this hashtable, ordered by keys (measurements)
 * @param {function(epiviz.measurements.Measurement, epiviz.measurements.Measurement): number} comparer
 * @returns {epiviz.measurements.MeasurementHashtable}
 */
epiviz.measurements.MeasurementHashtable.prototype.sorted = function(comparer) {
  var ret = new epiviz.measurements.MeasurementHashtable();

  var pairs = this._order.slice(0);
  pairs.sort(function(p1, p2) { return comparer(p1.key, p2.key); });

  pairs.forEach(function(pair) {
    if (!pair.contained) { return; }
    ret.put(pair.key, pair.value);
  });

  return ret;
};

/**
 * @returns {Array.<epiviz.measurements.Measurement>}
 */
epiviz.measurements.MeasurementHashtable.prototype.keys = function() {
  var ret = [];
  this._order.forEach(function(o) {
    if (o.contained) { ret.push(o.key); }
  });
  return ret;
};

/**
 * @returns {epiviz.utils.Iterator.<{key: epiviz.measurements.Measurement, value: T}>}
 */
epiviz.measurements.MeasurementHashtable.prototype.iterator = function() {
  return new epiviz.measurements.MeasurementHashtable.Iterator(this);
};

/**
 * @returns {string}
 */
epiviz.measurements.MeasurementHashtable.prototype.toString = function() {
  var result = {};
  this.foreach(function(m, v) {
    var id = m.id();
    var i = 2;
    while (id in result) {
      id = m.id() + ' (' + (i++) + ')';
    }
    result[id] = v;
  });
  return JSON.stringify(result);
};

/**
 * @param {epiviz.measurements.MeasurementHashtable} measurementHashtable
 * @constructor
 * @implements {epiviz.utils.Iterator}
 */
epiviz.measurements.MeasurementHashtable.Iterator = function(measurementHashtable) {
  /**
   * @type {epiviz.measurements.MeasurementHashtable}
   * @private
   */
  this._parent = measurementHashtable;

  /**
   * @type {number}
   * @private
   */
  this._lastIndex = null;
};

/**
 * @returns {?{key: epiviz.measurements.Measurement, value: T}}
 */
epiviz.measurements.MeasurementHashtable.Iterator.prototype.first = function() {
  if (this._parent.size() == 0) {
    return null;
  }

  for (var i = 0; i < this._parent._order.length; ++i) {
    if (this._parent._order[i].contained) {
      this._lastIndex = i;
      return {key: this._parent._order[i].key, value: this._parent._order[i].value};
    }
  }

  // Should never be reached!
  throw Error('Inconsistent MeasurementHashtable with size() > 0 and no first element');
};

/**
 * @returns {?{key: epiviz.measurements.Measurement, value: T}}
 */
epiviz.measurements.MeasurementHashtable.Iterator.prototype.next = function() {
  if (this._lastIndex === null) {
    throw Error('Iterator.next() called before calling Iterator.first()');
  }

  for (var i = this._lastIndex + 1; i < this._parent._order.length; ++i) {
    if (this._parent._order[i].contained) {
      this._lastIndex = i;
      return {key: this._parent._order[i].key, value: this._parent._order[i].value};
    }
  }

  this._lastIndex = this._parent._order.length;
  return null;
};


/***/ }),
/* 35 */
/***/ (function(module, exports) {

/**
 * Created by: Florin Chelaru
 * Date: 9/30/13
 * Time: 7:19 PM
 */

goog.provide('epiviz.measurements.MeasurementSet');

/**
 * A collection of measurements, where each item is stored only once,
 * and iteration is done in the insertion order.
 *
 * @param {epiviz.measurements.MeasurementSet} [other]
 * @constructor
 * @implements {epiviz.utils.Iterable}
 */
epiviz.measurements.MeasurementSet = function(other) {
  /**
   * A map containing measurements in a tree structure, by the following levels:
   *   dataprovider, type, datasourceGroup, datasource, id
   * @type {Object.<string, Object.<string, Object.<string, Object.<string, Object.<string, {measurement: epiviz.measurements.Measurement, index: number}>>>>>}
   * @private
   */
  this._measurementTree = {};

  /**
   * @type {number}
   * @private
   */
  this._size = 0;

  /**
   * @type {Array.<{measurement: epiviz.measurements.Measurement, contained: boolean}>}
   * @private
   */
  this._order = [];

  if (other) {
    this.addAll(other);
  }
};

/**
 * @param {epiviz.measurements.Measurement} m
 * @returns {boolean} true if the measurement was successfully added to the collection and
 *   false if there was already a measurement with this id in the collection
 */
epiviz.measurements.MeasurementSet.prototype.add = function(m) {
  if (!(m.dataprovider() in this._measurementTree)) {
    this._measurementTree[m.dataprovider()] = {};
  }

  if (!(m.type() in this._measurementTree[m.dataprovider()])) {
    this._measurementTree[m.dataprovider()][m.type()] = {};
  }

  if (!(m.datasourceGroup() in this._measurementTree[m.dataprovider()][m.type()])) {
    this._measurementTree[m.dataprovider()][m.type()][m.datasourceGroup()] = {};
  }

  if (!(m.datasource().id() in this._measurementTree[m.dataprovider()][m.type()][m.datasourceGroup()])) {
    this._measurementTree[m.dataprovider()][m.type()][m.datasourceGroup()][m.datasource().id()] = {};
  }

  if (m.id() in this._measurementTree[m.dataprovider()][m.type()][m.datasourceGroup()][m.datasource().id()]) {
    return false;
  }

  this._measurementTree[m.dataprovider()][m.type()][m.datasourceGroup()][m.datasource().id()][m.id()] = {
    measurement: m,
    index: this._order.length
  };

  this._order.push({
    measurement: m,
    contained: true
  });

  ++this._size;

  return true;
};

/**
 * @param {epiviz.measurements.Measurement} m
 * @returns {boolean} true if the measurement was in the collection and
 *   false if there was no measurement with this id in the collection
 */
epiviz.measurements.MeasurementSet.prototype.remove = function(m) {
  if (!(m.dataprovider() in this._measurementTree)) {
    return false;
  }

  if (!(m.type() in this._measurementTree[m.dataprovider()])) {
    return false;
  }

  if (!(m.datasourceGroup() in this._measurementTree[m.dataprovider()][m.type()])) {
    return false;
  }

  if (!(m.datasource().id() in this._measurementTree[m.dataprovider()][m.type()][m.datasourceGroup()])) {
    return false;
  }

  if (!(m.id() in this._measurementTree[m.dataprovider()][m.type()][m.datasourceGroup()][m.datasource().id()])) {
    return false;
  }

  this._order[this._measurementTree[m.dataprovider()][m.type()][m.datasourceGroup()][m.datasource().id()][m.id()].index].contained = false;

  delete this._measurementTree[m.dataprovider()][m.type()][m.datasourceGroup()][m.datasource().id()][m.id()];
  --this._size;
  return true;
};

/**
 * Returns true if any new measurements were added and false if
 * all measurements were already in the collection.
 * @param {?epiviz.measurements.MeasurementSet} measurements
 * @returns {boolean}
 */
epiviz.measurements.MeasurementSet.prototype.addAll = function(measurements) {
  if (!measurements || !measurements.size()) { return false; }
  var newMeasurementsAdded = false;
  var self = this;
  measurements.foreach(
    /**
     * @param {epiviz.measurements.Measurement} m
     * @returns {boolean}
     */
    function(m) {
      if (self.add(m)) {
        newMeasurementsAdded = true;
      }
      return false;
    });

  return newMeasurementsAdded;
};

/**
 * @param {epiviz.measurements.MeasurementSet} measurements
 * @returns {boolean}
 */
epiviz.measurements.MeasurementSet.prototype.removeAll = function(measurements) {
  var someMeasurementsRemoved = false;
  var self = this;
  measurements.foreach(
    /**
     * @param {epiviz.measurements.Measurement} m
     * @returns {boolean}
     */
    function(m) {
      if (self.remove(m)) {
        someMeasurementsRemoved = true;
      }
      return false;
    });

  return someMeasurementsRemoved;
};

/**
 * Iterates through all items stored in this collection, in the order they were added.
 *
 * @param {function(epiviz.measurements.Measurement, number=)} func A function called
 *   for each measurement matching the given filters. Iteration
 *   is stopped if the function returns something that evaluates to true.
 * @param {function(epiviz.measurements.Measurement): boolean} [predicate]
 */
epiviz.measurements.MeasurementSet.prototype.foreach = function(func, predicate) {
  var iter = this.iterator();
  for (var m = iter.first(), i = 0; m !== null; m = iter.next(), ++i) {
    if (predicate && !predicate(m)) { continue; }
    if (func(m, i)) { return; }
  }
};

/**
 * @returns {epiviz.utils.Iterator.<epiviz.measurements.Measurement>}
 */
epiviz.measurements.MeasurementSet.prototype.iterator = function() {
  return new epiviz.measurements.MeasurementSet.Iterator(this);
};

/**
 * @param {function(epiviz.measurements.Measurement): boolean} [predicate]
 *
 * @returns {epiviz.measurements.MeasurementSet}
 */
epiviz.measurements.MeasurementSet.prototype.subset = function(predicate) {
  var measurements = new epiviz.measurements.MeasurementSet();
  this.foreach(function(m) { measurements.add(m); }, predicate);

  return measurements;
};

/**
 * @param {function(epiviz.measurements.Measurement): epiviz.measurements.Measurement} transformer
 * @returns {epiviz.measurements.MeasurementSet}
 */
epiviz.measurements.MeasurementSet.prototype.map = function(transformer) {
  var ret = new epiviz.measurements.MeasurementSet();
  this.foreach(function(m) {
    ret.add(transformer(m));
  });
  return ret;
};

/**
 * @returns {number}
 */
epiviz.measurements.MeasurementSet.prototype.size = function() { return this._size; };

/**
 * @param {epiviz.measurements.Measurement} m
 * @returns {boolean}
 */
epiviz.measurements.MeasurementSet.prototype.contains = function(m) {
  if (!(m.dataprovider() in this._measurementTree)) {
    return false;
  }

  if (!(m.type() in this._measurementTree[m.dataprovider()])) {
    return false;
  }

  if (!(m.datasourceGroup() in this._measurementTree[m.dataprovider()][m.type()])) {
    return false;
  }

  if (!(m.datasource().id() in this._measurementTree[m.dataprovider()][m.type()][m.datasourceGroup()])) {
    return false;
  }

  return (m.id() in this._measurementTree[m.dataprovider()][m.type()][m.datasourceGroup()][m.datasource().id()]);
};

/**
 * @returns {?epiviz.measurements.Measurement}
 */
epiviz.measurements.MeasurementSet.prototype.first = function() {
  return this.iterator().first();
};

/**
 * Gets measurement at the given index. This method performs in O(n) time, so
 * it's not appropriate for iteration.
 * @param index
 * @returns {epiviz.measurements.Measurement}
 */
epiviz.measurements.MeasurementSet.prototype.get = function(index) {
  if (index >= this._size || index < 0) { return null; }
  if (this._size == this._order.length) {
    return this._order[index].measurement;
  }

  var result = null;
  this.foreach(function(m, i) {
    if (i == index) {
      result = m;
      return true;
    }
    return false;
  });

  return result;
};

/**
 * @returns {Array.<epiviz.measurements.Measurement>}
 */
epiviz.measurements.MeasurementSet.prototype.toArray = function() {
  var result = new Array(this._size);
  this.foreach(function(m, i) {
    result[i] = m;
  });

  return result;
};

/**
 * @param {function(epiviz.measurements.Measurement, epiviz.measurements.Measurement): number} comparer
 * @returns {epiviz.measurements.MeasurementSet}
 */
epiviz.measurements.MeasurementSet.prototype.sorted = function(comparer) {
  /** @type {Array.<epiviz.measurements.Measurement>} */
  var msArr = this.toArray().sort(comparer);
  var ret = new epiviz.measurements.MeasurementSet();
  msArr.forEach(function(m) { ret.add(m); });
  return ret;
};

/**
 * @returns {Array.<{id: string, name: string, type: epiviz.measurements.Measurement.Type, datasourceId: string, datasourceGroup: string, dataprovider: string, formula: null, defaultChartType: ?string, annotation: ?Object.<string, string>, minValue: ?number, maxValue: ?number, metadata: ?Array.<string>}>}
 */
epiviz.measurements.MeasurementSet.prototype.raw = function() {
  var result = new Array(this._size);
  this.foreach(function(m, i) {
    result[i] = m.raw();
  });

  return result;
};

/**
 * @param {function(epiviz.measurements.Measurement): number|string} criterion
 * @returns {Object.<string, epiviz.measurements.MeasurementSet>}
 */
epiviz.measurements.MeasurementSet.prototype.split = function(criterion) {
  var ret = {};
  this.foreach(function(m, i) {
    var key = criterion(m);
    var group = ret[key];
    if (group == undefined) {
      group = new epiviz.measurements.MeasurementSet();
      ret[key] = group;
    }
    group.add(m);
  });

  return ret;
};

/**
 *
 * @param {epiviz.measurements.MeasurementSet} measurementSet
 * @constructor
 * @implements {epiviz.utils.Iterator}
 */
epiviz.measurements.MeasurementSet.Iterator = function(measurementSet) {
  /**
   * @type {epiviz.measurements.MeasurementSet}
   * @private
   */
  this._parent = measurementSet;

  /**
   * @type {number}
   * @private
   */
  this._lastIndex = null;
};

/**
 * @returns {?epiviz.measurements.Measurement}
 */
epiviz.measurements.MeasurementSet.Iterator.prototype.first = function() {
  if (this._parent.size() == 0) {
    return null;
  }

  for (var i = 0; i < this._parent._order.length; ++i) {
    if (this._parent._order[i].contained) {
      this._lastIndex = i;
      return this._parent._order[i].measurement;
    }
  }

  // Should never be reached!
  throw Error('Inconsistent MeasurementSet with size() > 0 and no first element');
};

/**
 * @returns {?epiviz.measurements.Measurement}
 */
epiviz.measurements.MeasurementSet.Iterator.prototype.next = function() {
  if (this._lastIndex === null) {
    throw Error('Iterator.next() called before calling Iterator.first()');
  }

  for (var i = this._lastIndex + 1; i < this._parent._order.length; ++i) {
    if (this._parent._order[i].contained) {
      this._lastIndex = i;
      return this._parent._order[i].measurement;
    }
  }

  this._lastIndex = this._parent._order.length;
  return null;
};


/***/ }),
/* 36 */
/***/ (function(module, exports) {

/**
 * Created by: Florin Chelaru
 * Date: 9/30/13
 * Time: 6:47 PM
 */

goog.provide('epiviz.measurements.Measurement');
goog.provide('epiviz.measurements.Measurement.Type');

/**
 * @param {string} id
 * @param {string} name
 * @param {epiviz.measurements.Measurement.Type} type
 * @param {string} datasourceId
 * @param {string} datasourceGroup
 * @param {string} dataprovider
 * @param {{referredMeasurements: Object.<number, epiviz.measurements.Measurement>, expression: epiviz.utils.ExpressionParser.Expression}} [formula]
 * @param {string} [defaultChartType]
 * @param {Object.<string, string>} [annotation]
 * @param {number} [minValue]
 * @param {number} [maxValue]
 * @param {Array.<string>} [metadata]
 * @constructor
 */
epiviz.measurements.Measurement = function(id, name, type, datasourceId, datasourceGroup,
                                           dataprovider, formula, defaultChartType, annotation,
                                           minValue, maxValue, metadata) {

  var MeasurementType = epiviz.measurements.Measurement.Type;

  /**
   * @type {string}
   * @private
   */
  this._id = id;

  /**
   * @type {string}
   * @private
   */
  this._name = name;

  /**
   * @type {epiviz.measurements.Measurement.Type}
   * @private
   */
  this._type = type;

  /**
   * @type {epiviz.measurements.Measurement}
   * @private
   */
  this._datasource = type == (MeasurementType.RANGE) ? this :
    new epiviz.measurements.Measurement(
      datasourceId, // id
      datasourceId, // name
      MeasurementType.RANGE, // type
      datasourceId, // datasource
      datasourceGroup, // datasourceGroup
      dataprovider, // dataprovider
      null, // formula
      'Blocks Track', // defaultChartType
      null, null, null, // annotation, minValue, maxValue
      metadata); // metadata

  /**
   * @type {string}
   * @private
   */
  this._datasourceGroup = datasourceGroup;

  /**
   * @type {string}
   * @private
   */
  this._dataprovider = dataprovider;

  /**
   * @type {?{referredMeasurements: Object.<number, epiviz.measurements.Measurement>, expression: epiviz.utils.ExpressionParser.Expression}}
   * @private
   */
  this._formula = formula || null;

  /**
   * @type {?string}
   * @private
   */
  this._defaultChartType = defaultChartType || null;

  /**
   * @type {?Object.<string, string>}
   * @private
   */
  this._annotation = annotation || null;

  /**
   * @type {?number}
   * @private
   */
  this._minValue = (minValue || minValue === 0) ? minValue : null;

  /**
   * @type {?number}
   * @private
   */
  this._maxValue = (maxValue || maxValue === 0) ? maxValue : null;

  /**
   * @type {?Array.<string>}
   * @private
   */
  this._metadata = metadata || null;
};

/**
 * @enum {string}
 */
epiviz.measurements.Measurement.Type = {
  FEATURE: 'feature',
  RANGE: 'range',
  UNORDERED: 'unordered'
};

/**
 * @param {epiviz.measurements.Measurement.Type} type
 * @returns {boolean}
 */
epiviz.measurements.Measurement.Type.isOrdered = function(type) {
  return type == epiviz.measurements.Measurement.Type.FEATURE || type == epiviz.measurements.Measurement.Type.RANGE;
};

/**
 * @param {epiviz.measurements.Measurement.Type} type
 * @returns {boolean}
 */
epiviz.measurements.Measurement.Type.hasValues = function(type) {
  return type == epiviz.measurements.Measurement.Type.FEATURE || type == epiviz.measurements.Measurement.Type.UNORDERED;
};


/**
 * @returns {string}
 */
epiviz.measurements.Measurement.prototype.id = function() {
  return this._id;
};

/**
 * @returns {string}
 */
epiviz.measurements.Measurement.prototype.name = function() {
  return this._name;
};

/**
 * @returns {epiviz.measurements.Measurement.Type}
 */
epiviz.measurements.Measurement.prototype.type = function() {
  return this._type;
};

/**
 * @returns {epiviz.measurements.Measurement}
 */
epiviz.measurements.Measurement.prototype.datasource = function() {
  return this._datasource;
};

/**
 * @returns {string}
 */
epiviz.measurements.Measurement.prototype.datasourceId = function() {
  return this._datasource.id();
};

/**
 * @returns {string}
 */
epiviz.measurements.Measurement.prototype.datasourceGroup = function() {
  return this._datasourceGroup;
};

/**
 * @returns {string}
 */
epiviz.measurements.Measurement.prototype.dataprovider = function() {
  return this._dataprovider;
};

/**
 * @returns {?{referredMeasurements: Object.<number, epiviz.measurements.Measurement>, expression: epiviz.utils.ExpressionParser.Expression}}
 */
epiviz.measurements.Measurement.prototype.formula = function() {
  return this._formula;
};

/**
 * @returns {string}
 */
epiviz.measurements.Measurement.prototype.formulaStr = function() {
  if (!this._formula) { return ''; }
  var referredMs = this._formula.referredMeasurements;
  var expression = this._formula.expression.toString();

  for (var formulaIndex in referredMs) {
    if (!referredMs.hasOwnProperty(formulaIndex)) { continue; }

    expression = expression.replace(
      new RegExp('\\{' + formulaIndex + '\\}', 'g'),
      ' {' + referredMs[formulaIndex].name()  + '} ');
  }

  return expression;
};

/**
 * @param {epiviz.measurements.MeasurementHashtable.<number>} values A map between
 *   each of the component measurements and their corresponding values. See
 *   epiviz.measurements.Measurement.prototype.componentMeasurements() for more.
 */
epiviz.measurements.Measurement.prototype.evaluate = function(values) {
  var tuple = {};
  for (var i in this._formula.referredMeasurements) {
    if (!this._formula.referredMeasurements.hasOwnProperty(i)) { continue; }

    var m = this._formula.referredMeasurements[i];
    tuple['{' + i + '}'] = m.isComputed() ?
      m.evaluate(values) : values.get(m);
  }

  return this._formula.expression.evaluate(tuple);
};

/*
 *@param {epiviz.measurements.MeasurementHashtable.<Array.<number>>} values A map between
 *   each of the component measurements and an array of their corresponding values. See
 *   epiviz.measurements.Measurement.prototype.componentMeasurements() for more.
 */
epiviz.measurements.Measurement.prototype.evaluateArr = function(values) {
  /** @type {Object.<string, Array.<number>>} */
  var tuple = {};
  for (var i in this._formula.referredMeasurements) {
    if (!this._formula.referredMeasurements.hasOwnProperty(i)) { continue; }

    var m = this._formula.referredMeasurements[i];
    tuple['{' + i + '}'] = m.isComputed() ?
      m.evaluateArr(values) : values.get(m);
  }

  return this._formula.expression.evaluateArr(tuple);
};

/**
 * @returns {?string}
 */
epiviz.measurements.Measurement.prototype.defaultChartType = function() {
  return this._defaultChartType;
};

/**
 * @returns {?Object.<string, string>}
 */
epiviz.measurements.Measurement.prototype.annotation = function() {
  return this._annotation;
};

/**
 * @returns {?number}
 */
epiviz.measurements.Measurement.prototype.minValue = function() {
  return this._minValue;
};

/**
 * @returns {?number}
 */
epiviz.measurements.Measurement.prototype.maxValue = function() {
  return this._maxValue;
};

/**
 * @returns {Array.<string>}
 */
epiviz.measurements.Measurement.prototype.metadata = function() {
  return this._metadata || [];
};

/**
 * Gets a set of all independent measurements needed to compute this measurement. If the measurement is independent,
 * then the returned set contains this measurement only.
 *
 * @returns {epiviz.measurements.MeasurementSet}
 */
epiviz.measurements.Measurement.prototype.componentMeasurements = function() {
  var result = new epiviz.measurements.MeasurementSet();

  if (!this._formula) {
    result.add(this);
    return result;
  }

  for (var i in this._formula.referredMeasurements) {
    if (!this._formula.referredMeasurements.hasOwnProperty(i)) { continue; }

    result.addAll(this._formula.referredMeasurements[i].componentMeasurements());
  }

  return result;
};

/**
 * @returns {boolean}
 */
epiviz.measurements.Measurement.prototype.isComputed = function() { return (this._formula) ? true : false; };

/**
 *
 * @param {epiviz.measurements.MeasurementHashtable.<number>} measurementsIndexMap
 * @returns {{id: string, name: string, type: epiviz.measurements.Measurement.Type, datasourceId: string, datasourceGroup: string, dataprovider: string, formula: {expression: (string), referredMeasurements: Object.<number, number>}, defaultChartType: ?string, annotation: ?Object.<string, string>, minValue: ?number, maxValue: ?number, metadata: ?Array.<string>}}
 */
epiviz.measurements.Measurement.prototype.raw = function(measurementsIndexMap) {

  if (this._formula) {
    /** @type {Object.<number, epiviz.measurements.Measurement>} */
    var referredMeasurements = this._formula.referredMeasurements;

    /** @type {Object.<number, number>} */
    var rawReferredMeasurements = {};

    for (var formulaIndex in referredMeasurements) {
      if (!referredMeasurements.hasOwnProperty(formulaIndex)) { continue; }

      rawReferredMeasurements[formulaIndex] = measurementsIndexMap.get(referredMeasurements[formulaIndex]);
    }
  }

  return {
    id: this._id,
    name: this._name,
    type: this._type,
    datasourceId: this._datasource._id,
    datasourceGroup: this._datasourceGroup,
    dataprovider: this._dataprovider,
    formula: this._formula ?
      {expression: this._formula.expression.toString(), referredMeasurements: rawReferredMeasurements} :
      null,
    defaultChartType: this._defaultChartType,
    annotation: this._annotation,
    minValue: this._minValue,
    maxValue: this._maxValue,
    metadata: this._metadata
  };
};

/**
 * @returns {string}
 */
epiviz.measurements.Measurement.prototype.toString = function() {
  return this.name();
};

/**
 * @param {{
 *   id: string,
 *   name: string,
 *   type: string,
 *   datasourceId: string,
 *   datasourceGroup: string,
 *   dataprovider: string,
 *   formula: ?{expression: string, referredMeasurements: Object.<number, number>},
 *   defaultChartType: ?string,
 *   annotation: ?Object.<string, string>,
 *   minValue: ?number,
 *   maxValue: ?number,
 *   metadata: ?Array.<string>}} o
 * @param {Array.<epiviz.measurements.Measurement>} [measurements] This argument is used in conjunction
 *   with o.formula. If that is null, then this parameter is ignored.
 * @returns {epiviz.measurements.Measurement}
 */
epiviz.measurements.Measurement.fromRawObject = function(o, measurements) {
  var formula = null;
  if (o.formula) {
    var expr = epiviz.utils.ExpressionParser.parse(o.formula.expression);
    var refMs = {};

    var vars = expr.variables();
    for (var i = 0; i < vars.length; ++i) {
      if (!epiviz.utils.stringStartsWith(vars[i], '{') || !epiviz.utils.stringEndsWith(vars[i], '}')) {
        // This means that the variable is something else than a measurement
        continue;
      }
      var formulaIndex = parseInt(vars[i].substring(1, vars[i].length - 1));
      var index = o.formula.referredMeasurements[formulaIndex];
      refMs[formulaIndex] = measurements[index];
    }
    formula = {expression: expr, referredMeasurements: refMs};
  }

  return new epiviz.measurements.Measurement(o.id, o.name, o.type, o.datasourceId, o.datasourceGroup, o.dataprovider,
    formula, o.defaultChartType, o.annotation, o.minValue, o.maxValue, o.metadata);
};


/***/ }),
/* 37 */
/***/ (function(module, exports) {

/**
 * Created by Florin Chelaru ( florinc [at] umd [dot] edu )
 * Date: 10/22/13
 * Time: 8:37 PM
 */

/**
 * @enum {string}
 */
epiviz.ui.charts.Axis = {
  X: 'x',
  Y: 'y'
};


/***/ }),
/* 38 */
/***/ (function(module, exports) {

/**
 * Created by: Florin Chelaru
 * Date: 10/3/13
 * Time: 10:59 PM
 */

goog.provide('epiviz.ui.charts.ChartFactory');

goog.require('epiviz.ui.charts.Chart');
goog.require('epiviz.ui.charts.ChartType');

/**
 * @param {epiviz.Config} config
 * @constructor
 * @implements {epiviz.utils.Iterable}
 */
epiviz.ui.charts.ChartFactory = function(config) {

  /**
   * @type {epiviz.Config}
   * @private
   */
  this._config = config;

  /**
   * A map of type names and their corresponding constructors
   * @type {Object.<string, epiviz.ui.charts.ChartType>}
   * @private
   */
  this._types = {};

  /**
   * @type {number}
   * @private
   */
  this._size = 0;

  for (var i = 0; i < config.chartTypes.length; ++i) {
    this.register(config.chartTypes[i]);
  }
};

/**
 * @returns {number}
 */
epiviz.ui.charts.ChartFactory.prototype.size = function() {
  return this._size;
};

/**
 * @param {epiviz.ui.charts.ChartType} type
 */
epiviz.ui.charts.ChartFactory.prototype.registerType = function(type) {
  if (!(type.typeName() in this._types)) {
    ++this._size;
  }
  this._types[type.typeName()] = type;
};

/**
 * @param {epiviz.ui.charts.ChartType} type
 * @returns {boolean}
 */
epiviz.ui.charts.ChartFactory.prototype.unregisterType = function(type) {
  if (!(type.typeName() in this._types)) { return false; }

  --this._size;

  delete this._types[type.typeName()];
  return true;
};

/**
 * @param {string} typeName
 * @returns {boolean}
 */
epiviz.ui.charts.ChartFactory.prototype.register = function(typeName) {
  /** @type {?function(new:epiviz.ui.charts.ChartType)} */
  var typeDescriptorConstructor = epiviz.utils.evaluateFullyQualifiedTypeName(typeName);

  if (!typeDescriptorConstructor) { return false; }

  this.registerType(/** @type {epiviz.ui.charts.ChartType} */ (new typeDescriptorConstructor(this._config)));
  return true;
};

/**
 * @param {string} typeName
 * @returns {boolean}
 */
epiviz.ui.charts.ChartFactory.prototype.unregister = function(typeName) {
  /** @type {?function(new:epiviz.ui.charts.ChartType)} */
  var typeDescriptorConstructor = epiviz.utils.evaluateFullyQualifiedTypeName(typeName);

  if (!typeDescriptorConstructor) { return false; }

  return this.unregisterType(/** @type {epiviz.ui.charts.ChartType} */ (new typeDescriptorConstructor(this._config)));
};

/**
 * @param {string} typeName
 * @returns {?epiviz.ui.charts.ChartType}
 */
epiviz.ui.charts.ChartFactory.prototype.get = function(typeName) {
  if (typeName && typeName in this._types) {
    return this._types[typeName];
  }

  return null;
};

/**
 * Iterates through all types in the factory, or until func returns something that evaluates to true.
 * @param {function(string, epiviz.ui.charts.ChartType)} func A function called for each (typeName, descriptor) pair in the factory.
 */
epiviz.ui.charts.ChartFactory.prototype.foreach = function(func) {
  for (var typeName in this._types) {
    if (!this._types.hasOwnProperty(typeName)) { continue; }
    if (func(typeName, this._types[typeName])) {
      return;
    }
  }
};



/***/ }),
/* 39 */
/***/ (function(module, exports) {

/**
 * Created by: Florin Chelaru
 * Date: 10/3/13
 * Time: 11:24 PM
 */

goog.provide('epiviz.ui.charts.ChartManager');

goog.require('epiviz.ui.PrintManager');

/**
 * @param {epiviz.Config} config
 * @constructor
 */
epiviz.ui.charts.ChartManager = function(config) {

  /**
   * @type {epiviz.Config}
   * @private
   */
  this._config = config;

  /**
   * Map id to chart
   * @type {Object.<string, epiviz.ui.charts.Chart>}
   * @private
   */
  this._charts = {};

  /**
   * Each array in the map contains the ids of the charts in order
   * @type {Object.<epiviz.ui.charts.VisualizationType.DisplayType, Array.<string>>}
   * @private
   */
  this._chartsOrder = {};

  /**
   * Used to resize the charts after window has been resized
   * @type {?number}
   * @private
   */
  this._resizeInterval = null;

  /**
   * @type {epiviz.events.Event.<epiviz.ui.charts.VisEventArgs.<{
   *   type: epiviz.ui.charts.ChartType,
   *   properties: epiviz.ui.charts.VisualizationProperties,
   *   chartsOrder: Object.<epiviz.ui.charts.VisualizationType.DisplayType, Array.<string>>
   * }>>}
   * @private
   */
  this._chartAdded = new epiviz.events.Event();

  /**
   * Argument is chartsOrder: track -> ids, plot -> ids
   * @type {epiviz.events.Event.<epiviz.ui.charts.VisEventArgs.<Object.<epiviz.ui.charts.VisualizationType.DisplayType, Array.<string>>>>}
   * @private
   */
  this._chartRemoved = new epiviz.events.Event();

  /**
   * @type {epiviz.events.Event.<Object.<epiviz.ui.charts.VisualizationType.DisplayType, Array.<string>>>}
   * @private
   */
  this._chartsOrderChanged = new epiviz.events.Event();

  /**
   * @type {epiviz.events.Event}
   * @private
   */
  this._chartsCleared = new epiviz.events.Event();

  /**
   * @type {epiviz.events.Event.<epiviz.ui.charts.VisEventArgs.<epiviz.ui.charts.ColorPalette>>}
   * @private
   */
  this._chartColorsChanged = new epiviz.events.Event();

  /**
   * Event arg: a map of method -> code
   * @type {epiviz.events.Event.<epiviz.ui.charts.VisEventArgs.<Object.<string, string>>>}
   * @private
   */
  this._chartMethodsModified = new epiviz.events.Event();

  /**
   * @type {epiviz.events.Event.<epiviz.ui.charts.VisEventArgs>}
   * @private
   */
  this._chartMethodsReset = new epiviz.events.Event();

  /**
   * @type {epiviz.events.Event.<epiviz.ui.charts.VisEventArgs.<Array.<epiviz.ui.charts.markers.VisualizationMarker>>>}
   * @private
   */
  this._chartMarkersModified = new epiviz.events.Event();

  /**
   * Event arg: custom settings values setting -> value
   * @type {epiviz.events.Event.<epiviz.ui.charts.VisEventArgs.<Object.<string, *>>>}
   * @private
   */
  this._chartCustomSettingsChanged = new epiviz.events.Event();

  /**
   * @type {epiviz.events.Event.<epiviz.ui.charts.VisEventArgs.<{width: number|string, height: number|string}>>}
   * @private
   */
  this._chartSizeChanged = new epiviz.events.Event();

  /**
   * @type {epiviz.events.Event.<epiviz.ui.charts.VisEventArgs.<epiviz.ui.charts.Margins>>}
   * @private
   */
  this._chartMarginsChanged = new epiviz.events.Event();

  /**
   * event -> event args -> selection -> data
   * @type {epiviz.events.Event.<epiviz.ui.charts.VisEventArgs.<epiviz.ui.controls.VisConfigSelection.<*>>>}
   * @protected
   */
  this._chartRequestHierarchy = new epiviz.events.Event();

  /**
   * @type {epiviz.events.Event.<epiviz.ui.charts.VisEventArgs.<{selection: Object.<string, epiviz.ui.charts.tree.NodeSelectionType>, order: Object.<string, number>}>>}
   * @private
   */
  this._chartPropagateHierarchyChanges = new epiviz.events.Event();

  this._registerWindowResize();
};

/**
 * @param {epiviz.ui.charts.ChartType} chartType
 * @param {epiviz.ui.controls.VisConfigSelection} visConfigSelection
 * @param {string} [id] The specific id for the chart. If not
 *   specified, it's generated dynamically
 * @param {epiviz.ui.charts.VisualizationProperties} [chartProperties]
 * @returns {string} The id of the newly created chart
 */
epiviz.ui.charts.ChartManager.prototype.addChart = function(chartType, visConfigSelection, id, chartProperties) {
  id = id || sprintf('%s-%s-%s', chartType.chartDisplayType(), chartType.chartHtmlAttributeName(), epiviz.utils.generatePseudoGUID(5));
  var css = chartType.cssClass();

  var chartDisplayTypeContainer = $('#' + id);
  var chartsAccordion = chartDisplayTypeContainer.find('.accordion');
  var chartsContainer = chartsAccordion.find('.vis-container');
  if (chartsAccordion.length == 0) {
    chartsAccordion = $('<div class="accordion"></div>').appendTo(chartDisplayTypeContainer);
    var displayType = chartType.chartDisplayType();
    chartsAccordion.append(
      sprintf('<h3><a href="#"><b><span style="color: #025167">Views by %s</span></b></a></h3>',
        'ds'));
    chartsContainer = $('<div class="vis-container"></div>').appendTo(chartsAccordion);
    chartsAccordion.multiAccordion();
    chartsAccordion.multiAccordion('option', 'active', 'all');
    var self = this;
    // TODO: This doesn't go well with the icicle, because that requires a lot of drag & drop
    // TODO: Once we find a solution for it, re-enable the feature
    /*chartsContainer.sortable({
      stop: function(e, ui) {
        var newOrder = chartsContainer.find('.visualization-container')
          .map(function(i, el) {
            return $(el).attr('id');
          });
        if (epiviz.utils.arraysEqual(newOrder, self._chartsOrder[displayType])) { return; }
        self._chartsOrder[displayType] = newOrder;
        self._chartsOrderChanged.notify(self._chartsOrder);
      }
    });*/
  }

  chartsContainer.append(sprintf('<div id="%s" class="%s"></div>', id, css));
  var container = chartsContainer.find('#' + id);

  chartProperties = chartProperties || new epiviz.ui.charts.VisualizationProperties(
    chartType.defaultWidth(), // width
    chartType.defaultHeight(), // height
    chartType.defaultMargins(), // margins
    visConfigSelection, // configuration of measurements and other information selected by the user
    chartType.defaultColors(), // colors
    null, // modified methods
    chartType.customSettingsValues(),
    chartType.customSettingsDefs(),
    [],
    null
  );

  var chart = chartType.createNew(id, container, chartProperties);
  this._charts[id] = chart;

  this._registerChartHover(chart);
  this._registerChartUnhover(chart);
  this._registerChartSelect(chart);
  this._registerChartDeselect(chart);
  this._registerChartColorsChanged(chart);
  this._registerChartMethodsModified(chart);
  this._registerChartMethodsReset(chart);
  this._registerChartMarkersModified(chart);
  this._registerChartCustomSettingsChanged(chart);
  this._registerChartSizeChanged(chart);
  this._registerChartMarginsChanged(chart);
  this._registerChartRemove(chart);
  this._registerChartSave(chart);
  this._registerChartRequestHierarchy(chart);
  this._registerChartPropagateHierarchyChanges(chart);

  if (chartType.decorations()) {
    /** @type {epiviz.ui.charts.decoration.VisualizationDecoration} */
    var topDecoration = undefined;
    for (var i = 0; i < chartType.decorations().length; ++i) {
      /** @type {?(function(new:epiviz.ui.charts.decoration.VisualizationDecoration))} */
      var decorationCtor = epiviz.utils.evaluateFullyQualifiedTypeName(chartType.decorations()[i]);

      if (!decorationCtor) { continue; }

      /** @type {epiviz.ui.charts.decoration.VisualizationDecoration} */
      topDecoration  = epiviz.utils.applyConstructor(decorationCtor, [chart, topDecoration, this._config]);
    }

    if (topDecoration) {
      topDecoration.decorate();
    }
  }

  if (!(chartType.chartDisplayType() in this._chartsOrder)) { this._chartsOrder[chartType.chartDisplayType()] = []; }
  this._chartsOrder[chartType.chartDisplayType()].push(id);

  this._chartAdded.notify(new epiviz.ui.charts.VisEventArgs(id, {
      type: chartType,
      properties: chartProperties,
      chartsOrder: this._chartsOrder
    }));

  return id;
};

/**
 * @param {string} id The id of the chart being removed
 */
epiviz.ui.charts.ChartManager.prototype.removeChart = function(id) {
  $('#' + id).remove();

  var chart = this._charts[id];
  delete this._charts[id];
  this._chartsOrder[chart.displayType()].splice(this._chartsOrder[chart.displayType()].indexOf(id), 1);

  var chartDisplayTypeContainer = $('#' + epiviz.ui.ControlManager.CHART_TYPE_CONTAINERS[chart.displayType()]);
  var chartsAccordion = chartDisplayTypeContainer.find('.accordion');
  var chartsContainer = chartsAccordion.find('.vis-container');
  if (chartsContainer.children().length == 0) {
    chartDisplayTypeContainer.empty();
  }

  this._chartRemoved.notify(new epiviz.ui.charts.VisEventArgs(id, this._chartsOrder));
};

/**
 * Returns a map of chart ids as keys and corresponding measurements as values
 * @returns {Object.<string, epiviz.measurements.MeasurementSet>}
 */
epiviz.ui.charts.ChartManager.prototype.chartsMeasurements = function() {
  /** @type {Object.<string, epiviz.measurements.MeasurementSet>} */
  var result = {};
  for (var chartId in this._charts) {
    if (!this._charts.hasOwnProperty(chartId)) { continue; }
    if (this._charts[chartId].displayType() == epiviz.ui.charts.VisualizationType.DisplayType.DATA_STRUCTURE) { continue; }
    result[chartId] = this._charts[chartId].measurements();
  }

  return result;
};

/**
 * @param {epiviz.datatypes.GenomicRange} range
 * @param {epiviz.datatypes.GenomicData} data
 * @param {Array.<string>} [chartIds]
 */
epiviz.ui.charts.ChartManager.prototype.updateCharts = function(range, data, chartIds) {
  chartIds = chartIds || Object.keys(this._charts);
  for (var i = 0; i < chartIds.length; ++i) {
    if (!this._charts.hasOwnProperty(chartIds[i])) { continue; }
    var chart = this._charts[chartIds[i]];
    if (!chart) { continue; }

    (function(chart) {
      chart.transformData(range, data).done(function() {
        // No need to call with arguments, since transformData will set the lastRange and lastData values
        chart.draw();
      });
    })(chart);
  }
};

/**
 */
epiviz.ui.charts.ChartManager.prototype.updateDataStructureCharts = function() {
  var chartIds = Object.keys(this._charts);
  for (var i = 0; i < chartIds.length; ++i) {
    if (!this._charts.hasOwnProperty(chartIds[i])) { continue; }
    var chart = this._charts[chartIds[i]];
    if (!chart) { continue; }
    if (chart.displayType() != epiviz.ui.charts.VisualizationType.DisplayType.DATA_STRUCTURE) { continue; }

    (function(chart) {
      setTimeout(function() {
        chart.fireRequestHierarchy();
      }, 0);
    })(chart);
  }
};

/**
 * Clears all the charts on stage
 */
epiviz.ui.charts.ChartManager.prototype.clear = function() {
  this._charts = {};
  this._chartsOrder = {};

  var chartContainers = epiviz.ui.ControlManager.CHART_TYPE_CONTAINERS;

  for (var displayType in chartContainers) {
    if (!chartContainers.hasOwnProperty(displayType)) { continue; }
    $('#' + chartContainers[displayType]).empty();
  }

  this._chartsCleared.notify();
};

/**
 * Tells all charts that new data has been requested.
 * Used, for example, by ChartLoaderAnimation decoration.
 * @param {string} [chartId]
 * @param {function(epiviz.ui.charts.Visualization): boolean} [chartFilter]
 */
epiviz.ui.charts.ChartManager.prototype.dataWaitStart = function(chartId, chartFilter) {
  if (chartId && this._charts[chartId]) {
    this._charts[chartId].onDataWaitStart().notify(new epiviz.ui.charts.VisEventArgs(chartId));
    return;
  }
  for (var id in this._charts) {
    if (!this._charts.hasOwnProperty(id)) { continue; }
    if (!chartFilter || !chartFilter[this._charts[id]]) { continue; }
    this._charts[id].onDataWaitStart().notify(new epiviz.ui.charts.VisEventArgs(id));
  }
};

/**
 * @returns {epiviz.events.Event.<epiviz.ui.charts.VisEventArgs.<{type: epiviz.ui.charts.ChartType, properties: epiviz.ui.charts.VisualizationProperties, chartsOrder: Object.<epiviz.ui.charts.VisualizationType.DisplayType, Array.<string>>}>>}
 */
epiviz.ui.charts.ChartManager.prototype.onChartAdded = function() { return this._chartAdded; };

/**
 * @returns {epiviz.events.Event.<epiviz.ui.charts.VisEventArgs.<Object.<epiviz.ui.charts.VisualizationType.DisplayType, Array.<string>>>>}
 */
epiviz.ui.charts.ChartManager.prototype.onChartRemoved = function() { return this._chartRemoved; };

/**
 * @returns {epiviz.events.Event.<Object.<epiviz.ui.charts.VisualizationType.DisplayType, Array.<string>>>}
 */
epiviz.ui.charts.ChartManager.prototype.onChartsOrderChanged = function() { return this._chartsOrderChanged; };

/**
 * @returns {epiviz.events.Event}
 */
epiviz.ui.charts.ChartManager.prototype.onChartsCleared = function() { return this._chartsCleared; };

/**
 * @returns {epiviz.events.Event.<epiviz.ui.charts.VisEventArgs.<epiviz.ui.charts.ColorPalette>>}
 */
epiviz.ui.charts.ChartManager.prototype.onChartColorsChanged = function() { return this._chartColorsChanged; };

/**
 * @returns {epiviz.events.Event.<epiviz.ui.charts.VisEventArgs.<Object.<string, string>>>}
 */
epiviz.ui.charts.ChartManager.prototype.onChartMethodsModified = function() { return this._chartMethodsModified; };

/**
 * @returns {epiviz.events.Event.<epiviz.ui.charts.VisEventArgs>}
 */
epiviz.ui.charts.ChartManager.prototype.onChartMethodsReset = function() { return this._chartMethodsReset; };

/**
 * @returns {epiviz.events.Event.<epiviz.ui.charts.VisEventArgs.<Array.<epiviz.ui.charts.markers.VisualizationMarker>>>}
 */
epiviz.ui.charts.ChartManager.prototype.onChartMarkersModified = function() { return this._chartMarkersModified; };

/**
 * @returns {epiviz.events.Event.<epiviz.ui.charts.VisEventArgs.<Object.<string, *>>>}
 */
epiviz.ui.charts.ChartManager.prototype.onChartCustomSettingsChanged = function() { return this._chartCustomSettingsChanged; };

/**
 * @returns {epiviz.events.Event.<epiviz.ui.charts.VisEventArgs.<{width: (number|string), height: (number|string)}>>}
 */
epiviz.ui.charts.ChartManager.prototype.onChartSizeChanged = function() { return this._chartSizeChanged; };

/**
 * @returns {epiviz.events.Event.<epiviz.ui.charts.VisEventArgs.<epiviz.ui.charts.Margins>>}
 */
epiviz.ui.charts.ChartManager.prototype.onChartMarginsChanged = function() { return this._chartMarginsChanged; };

/**
 * @returns {epiviz.events.Event.<epiviz.ui.charts.VisEventArgs.<epiviz.ui.controls.VisConfigSelection.<*>>>}
 */
epiviz.ui.charts.ChartManager.prototype.onChartRequestHierarchy = function() { return this._chartRequestHierarchy; };

/**
 * @returns {epiviz.events.Event.<epiviz.ui.charts.VisEventArgs.<{selection: Object.<string, epiviz.ui.charts.tree.NodeSelectionType>, order: Object.<string, number>}>>}
 */
epiviz.ui.charts.ChartManager.prototype.onChartPropagateHierarchyChanges = function() { return this._chartPropagateHierarchyChanges; };

/**
 * @private
 */
epiviz.ui.charts.ChartManager.prototype._registerWindowResize = function() {
  var self = this;
  $(window).resize(function() {
    if (self._resizeInterval !== null) { window.clearTimeout(self._resizeInterval); }
    self._resizeInterval = window.setTimeout(function() {
      for (var chartId in self._charts) {
        if (!self._charts.hasOwnProperty(chartId)) { continue; }
        self._charts[chartId].updateSize();
      }
      self._resizeInterval = null;
    }, 500);
  });
};

/**
 * @param {epiviz.ui.charts.Chart} chart
 * @private
 */
epiviz.ui.charts.ChartManager.prototype._registerChartHover = function(chart) {
  var self = this;
  chart.onHover().addListener(new epiviz.events.EventListener(
    /** @param {epiviz.ui.charts.VisEventArgs.<epiviz.ui.charts.ChartObject>} e */
    function(e) {
      for (var id in self._charts) {
        if (!self._charts.hasOwnProperty(id)) { continue; }
        self._charts[id].doHover(e.args);
      }
    }));
};

/**
 * @param {epiviz.ui.charts.Chart} chart
 * @private
 */
epiviz.ui.charts.ChartManager.prototype._registerChartUnhover = function(chart) {
  var self = this;
  chart.onUnhover().addListener(new epiviz.events.EventListener(function() {
    for (var id in self._charts) {
      if (!self._charts.hasOwnProperty(id)) { continue; }
      self._charts[id].doUnhover();
    }
  }));
};

/**
 * @param {epiviz.ui.charts.Chart} chart
 * @private
 */
epiviz.ui.charts.ChartManager.prototype._registerChartSelect = function(chart) {
  var self = this;
  chart.onSelect().addListener(new epiviz.events.EventListener(
    /** @param {epiviz.ui.charts.VisEventArgs.<epiviz.ui.charts.ChartObject>} e */
      function(e) {
      var selectedObject = e.args;
      for (var id in self._charts) {
        if (!self._charts.hasOwnProperty(id)) { continue; }
        self._charts[id].doSelect(selectedObject);
      }
    }));
};

/**
 * @param {epiviz.ui.charts.Chart} chart
 * @private
 */
epiviz.ui.charts.ChartManager.prototype._registerChartDeselect = function(chart) {
  var self = this;
  chart.onDeselect().addListener(new epiviz.events.EventListener(function() {
    for (var id in self._charts) {
      if (!self._charts.hasOwnProperty(id)) { continue; }
      self._charts[id].doDeselect();
    }
  }));
};

/**
 * @param {epiviz.ui.charts.Chart} chart
 * @private
 */
epiviz.ui.charts.ChartManager.prototype._registerChartRemove = function(chart) {
  var self = this;
  chart.onRemove().addListener(new epiviz.events.EventListener(
    /** @param {epiviz.ui.charts.VisEventArgs} e */
    function(e) { self.removeChart(e.id); }));
};

/**
 * @param {epiviz.ui.charts.Chart} chart
 * @private
 */
epiviz.ui.charts.ChartManager.prototype._registerChartSave = function(chart) {
  var self = this;

  if(self._config.configType != "default") {
    chart.onSave().addListener(new epiviz.events.EventListener(
        /** @param {epiviz.ui.charts.VisEventArgs} e */
        function(e) {
          var pm = new epiviz.ui.PrintManager(e.id, "epiviz_" + Math.floor($.now() / 1000), "pdf");
          pm.print();
        }));
  }
  else {
    chart.onSave().addListener(new epiviz.events.EventListener(
        /** @param {epiviz.ui.charts.VisEventArgs} e */
        function(e) {
          var saveSvgDialog = new epiviz.ui.controls.SaveSvgAsImageDialog(
              {ok: function(){}, cancel: function(){}},
              e.id,
              self._config.dataServerLocation + self._config.chartSaverLocation);

          saveSvgDialog.show();
        }));
  }

};

/**
 * @param {epiviz.ui.charts.Chart} chart
 * @private
 */
epiviz.ui.charts.ChartManager.prototype._registerChartColorsChanged = function(chart) {
  var self = this;
  chart.onColorsChanged().addListener(new epiviz.events.EventListener(function(e) {
    self._chartColorsChanged.notify(e);
  }));
};

/**
 * @param {epiviz.ui.charts.Chart} chart
 * @private
 */
epiviz.ui.charts.ChartManager.prototype._registerChartMethodsModified = function(chart) {
  var self = this;
  chart.onMethodsModified().addListener(new epiviz.events.EventListener(function(e) {
    self._chartMethodsModified.notify(e);
  }));
};

/**
 * @param {epiviz.ui.charts.Chart} chart
 * @private
 */
epiviz.ui.charts.ChartManager.prototype._registerChartMethodsReset = function(chart) {
  var self = this;
  chart.onMethodsReset().addListener(new epiviz.events.EventListener(function(e) {
    self._chartMethodsReset.notify(e);
  }));
};

/**
 * @param {epiviz.ui.charts.Chart} chart
 * @private
 */
epiviz.ui.charts.ChartManager.prototype._registerChartMarkersModified = function(chart) {
  var self = this;
  chart.onMarkersModified().addListener(new epiviz.events.EventListener(function(e) {
    self._chartMarkersModified.notify(e);
  }));
};

/**
 * @param {epiviz.ui.charts.Chart} chart
 * @private
 */
epiviz.ui.charts.ChartManager.prototype._registerChartCustomSettingsChanged = function(chart) {
  var self = this;
  chart.onCustomSettingsChanged().addListener(new epiviz.events.EventListener(function(e) {
    self._chartCustomSettingsChanged.notify(e);
  }));
};

/**
 * @param {epiviz.ui.charts.Chart} chart
 * @private
 */
epiviz.ui.charts.ChartManager.prototype._registerChartSizeChanged = function(chart) {
  var self = this;
  chart.onSizeChanged().addListener(new epiviz.events.EventListener(function(e) {
    self._chartSizeChanged.notify(e);
  }));
};

/**
 * @param {epiviz.ui.charts.Chart} chart
 * @private
 */
epiviz.ui.charts.ChartManager.prototype._registerChartMarginsChanged = function(chart) {
  var self = this;
  chart.onMarginsChanged().addListener(new epiviz.events.EventListener(function(e) {
    self._chartMarginsChanged.notify(e);
  }));
};

/**
 * @param {epiviz.ui.charts.Visualization} chart
 * @private
 */
epiviz.ui.charts.ChartManager.prototype._registerChartRequestHierarchy = function(chart) {
  var self = this;
  if (chart.displayType() == epiviz.ui.charts.VisualizationType.DisplayType.DATA_STRUCTURE) {
    var dataStructVis = /** @type {epiviz.ui.charts.DataStructureVisualization} */ chart; // Assignment done for consistency
    dataStructVis.onRequestHierarchy().addListener(new epiviz.events.EventListener(function(e) {
      self._chartRequestHierarchy.notify(e);
    }));
  }
};

/**
 * @param {epiviz.ui.charts.Visualization} chart
 * @private
 */
epiviz.ui.charts.ChartManager.prototype._registerChartPropagateHierarchyChanges = function(chart) {
  var self = this;
  if (chart.displayType() == epiviz.ui.charts.VisualizationType.DisplayType.DATA_STRUCTURE) {
    var dataStructVis = /** @type {epiviz.ui.charts.DataStructureVisualization} */ chart; // Assignment done for consistency
    dataStructVis.onPropagateHierarchyChanges().addListener(new epiviz.events.EventListener(function(e) {
      self._chartPropagateHierarchyChanges.notify(e);
    }));
  }
};

epiviz.ui.charts.ChartManager.prototype.getChartSettings = function(id) {

  var chart = this._charts[id];
  var result = {};
  //result['defs'] = chart.properties().customSettingsDefs;
  result['settings'] = chart.customSettingsValues();
  result['colorMap'] = chart.properties().colors;
  return result;

};

epiviz.ui.charts.ChartManager.prototype.setChartSettings = function(id, settings, colorMap) {

  var chart = this._charts[id];

  if(settings != null) {
    var currentSettings = chart.customSettingsValues();

    var all_keys = Object.keys(settings);

    all_keys.forEach(function(key) {
      currentSettings[key] = settings[key];
    });

    chart.setCustomSettingsValues(currentSettings);
  }

  if(colorMap != null) {
    chart.setColors(colorMap);
  }

  chart.draw();
};



/***/ }),
/* 40 */
/***/ (function(module, exports) {

/**
 * Created by Florin Chelaru ( florinc [at] umd [dot] edu )
 * Date: 3/25/14
 * Time: 2:03 PM
 */

goog.provide('epiviz.ui.charts.ChartObject');

/**
 * A struct for various objects in visualizations, like blocks, genes or circles in scatter plots
 * @param {string} id
 * @param {number} start
 * @param {number} end
 * @param {?Array.<number>} [values] One for each measurement
 * @param {number} [seriesIndex]
 * @param {Array.<Array.<epiviz.datatypes.GenomicData.ValueItem>>} [valueItems] For each measurement, an array of value items
 * @param {Array.<epiviz.measurements.Measurement>} [measurements]
 * @param {string} [cssClasses]
 * @constructor
 * @struct
 * @extends {epiviz.ui.charts.VisObject}
 */
epiviz.ui.charts.ChartObject = function(id, start, end, values, seriesIndex, valueItems, measurements, cssClasses) {
  epiviz.ui.charts.VisObject.call(this);

  /**
   * @type {string}
   */
  this.id = id;

  /**
   * @type {number}
   */
  this.start = start;

  /**
   * @type {number}
   */
  this.end = end;

  /**
   * @type {?Array<number>}
   */
  this.values = values;

  /**
   * @type {number}
   */
  this.seriesIndex = seriesIndex;

  /**
   * For each measurement, an array of value items
   * @type {Array.<Array.<epiviz.datatypes.GenomicData.ValueItem>>}
   */
  this.valueItems = valueItems;

  /**
   * @type {Array.<epiviz.measurements.Measurement>}
   */
  this.measurements = measurements;

  /**
   * @type {string}
   */
  this.cssClasses = cssClasses;
};

/*
 * Copy methods from upper class
 */
epiviz.ui.charts.ChartObject.prototype = epiviz.utils.mapCopy(epiviz.ui.charts.VisObject.prototype);
epiviz.ui.charts.ChartObject.constructor = epiviz.ui.charts.ChartObject;

/**
 * @returns {number}
 */
epiviz.ui.charts.ChartObject.prototype.regionStart = function() { return this.start; };

/**
 * @returns {number}
 */
epiviz.ui.charts.ChartObject.prototype.regionEnd = function() { return this.end; };

/**
 * @param {number} i
 * @param {number} j
 * @param {string} metadataCol
 * @returns {string}
 */
epiviz.ui.charts.ChartObject.prototype.getMetadata = function(i, j, metadataCol) {
  if (this.valueItems) {
    return this.valueItems[i][j].rowItem.metadata(metadataCol);
  }

  return null;
};

/**
 * Measurement i, object j
 * @param {number} i
 * @param {number} j
 * @returns {number}
 */
epiviz.ui.charts.ChartObject.prototype.getStart = function(i, j) { return this.valueItems[i][j].rowItem.start(); };

/**
 * Measurement i, object j
 * @param {number} i
 * @param {number} j
 * @returns {number}
 */
epiviz.ui.charts.ChartObject.prototype.getEnd = function(i, j) { return this.valueItems[i][j].rowItem.end(); };

/**
 * @returns {Array.<string>}
 */
epiviz.ui.charts.ChartObject.prototype.metadataColumns = function() { return Object.keys(this.valueItems[0][0].rowItem.rowMetadata()); };

/**
 * Number of measurements times number of objects stored per measurement
 * @returns {Array.<number>}
 */
epiviz.ui.charts.ChartObject.prototype.dimensions = function() {
  var ret = [];

  if (this.valueItems) {
    ret.push(this.valueItems.length);
    if (this.valueItems.length) {
      ret.push(this.valueItems[0].length);
    } else {
      ret.push(0);
    }
    return ret;
  }

  return [0, 0];
};


/***/ }),
/* 41 */
/***/ (function(module, exports) {

/**
 * Created by: Florin Chelaru
 * Date: 10/3/13
 * Time: 11:02 PM
 */

goog.provide('epiviz.ui.charts.ChartType');

goog.require('epiviz.ui.charts.Chart');


/**
 * Abstract class
 * @param {epiviz.Config} config
 * @constructor
 * @extends {epiviz.ui.charts.VisualizationType}
 */
epiviz.ui.charts.ChartType = function(config) {
  epiviz.ui.charts.VisualizationType.call(this, config);
};

/*
 * Copy methods from upper class
 */
epiviz.ui.charts.ChartType.prototype = epiviz.utils.mapCopy(epiviz.ui.charts.VisualizationType.prototype);
epiviz.ui.charts.ChartType.constructor = epiviz.ui.charts.ChartType;

/**
 * @param {string} id
 * @param {jQuery} container
 * @param {epiviz.ui.charts.VisualizationProperties} properties
 * @returns {epiviz.ui.charts.Chart}
 */
epiviz.ui.charts.ChartType.prototype.createNew = function(id, container, properties) { throw Error('unimplemented abstract method'); };

epiviz.ui.charts.ChartType.prototype.customSettingsDefs = function() {
  var defs = epiviz.ui.charts.VisualizationType.prototype.customSettingsDefs.call(this);
  if (this.isRestrictedToRangeMeasurements()) { return defs; }

  var aggregators = Object.keys(epiviz.ui.charts.markers.MeasurementAggregators);

  return defs.concat([
    new epiviz.ui.charts.CustomSetting(
      epiviz.ui.charts.ChartType.CustomSettings.MEASUREMENT_GROUPS_AGGREGATOR,
      epiviz.ui.charts.CustomSetting.Type.CATEGORICAL,
      aggregators[0],
      'Aggregator for measurement groups', aggregators)
  ]);
};

/**
 * @enum {string}
 */
epiviz.ui.charts.ChartType.CustomSettings = {
  MEASUREMENT_GROUPS_AGGREGATOR: 'measurementGroupsAggregator'
};


/***/ }),
/* 42 */
/***/ (function(module, exports) {

/**
 * Created by: Florin Chelaru
 * Date: 10/3/13
 * Time: 8:21 PM
 */

goog.provide('epiviz.ui.charts.Chart');

/**
 * @param {string} id
 * @param {jQuery} container The div where the chart will be drawn
 * @param {epiviz.ui.charts.VisualizationProperties} properties
 * @constructor
 * @extends {epiviz.ui.charts.Visualization.<epiviz.datatypes.GenomicData>}
 */
epiviz.ui.charts.Chart = function(id, container, properties) {
  // Call superclass constructor
  epiviz.ui.charts.Visualization.call(this, id, container, properties);

  /**
   * Constant used for mouse highlighting by location
   * @type {number}
   * @protected
   */
  this._nBins = 100;

  /**
   * Used for mouse highlighting by location
   * @type {?number}
   * @protected
   */
  this._binSize = null;

  /**
   * @type {epiviz.measurements.MeasurementHashtable.<string>}
   * @protected
   */
  this._measurementColorLabels = null;

  /**
   * @type {Object.<number, string>}
   * @protected
   */
  this._globalIndexColorLabels = null;
};

/*
 * Copy methods from upper class
 */
epiviz.ui.charts.Chart.prototype = epiviz.utils.mapCopy(epiviz.ui.charts.Visualization.prototype);
epiviz.ui.charts.Chart.constructor = epiviz.ui.charts.Chart;

/**
 * @protected
 */
epiviz.ui.charts.Chart.prototype._initialize = function() {
  // Call super
  epiviz.ui.charts.Visualization.prototype._initialize.call(this);

  this._svg.classed('base-chart', true);
};

/**
 * Deprecated method, kept for future reference
 * @protected
 * @deprecated
 */
epiviz.ui.charts.Chart.prototype._addFilters = function() {
  var defs = this._svg.append('defs');
  var glow = defs.append('filter')
    .attr('id', this.id() + '-glow');
  glow.append('feGaussianBlur')
    .attr('id', 'gaussianBlur')
    .attr('stdDeviation', '2')
    .attr('result', 'blurResult');
  glow.append('feComposite')
    .attr('id', 'composite')
    .attr('in', 'SourceGraphic')
    .attr('in2', 'blurResult')
    .attr('operator', 'over');

  var contour = defs.append('filter')
    .attr('id', this.id() + '-contour');
  contour.append('feGaussianBlur')
    .attr('in', 'SourceAlpha')
    .attr('stdDeviation', '1')
    .attr('result', 'blur');
  contour.append('feColorMatrix')
    .attr('values', '1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 10 -1 ')
    .attr('result', 'colorMatrix');
  contour.append('feFlood')
    .attr('result', 'fillColor')
    .attr('flood-color', '#800000')
    .attr('in', 'blur');
  contour.append('feComposite')
    .attr('result', 'composite')
    .attr('in', 'fillColor')
    .attr('in2', 'colorMatrix')
    .attr('operator', 'atop');
  contour.append('feComposite')
    .attr('in', 'SourceGraphic')
    .attr('in2', 'composite')
    .attr('operator', 'atop');

  var dropShadow = defs.append('filter')
    .attr('id', this.id() + '-dropshadow')
    .attr('filterUnits', 'userSpaceOnUse')
    .attr('color-interpolation-filters', 'sRGB');
  var temp = dropShadow.append('feComponentTransfer')
    .attr('in', 'SourceAlpha');
  temp.append('feFuncR')
    .attr('type', 'discrete')
    .attr('tableValues', '1');
  temp.append('feFuncG')
    .attr('type', 'discrete')
    .attr('tableValues', 198/255);
  temp.append('feFuncB')
    .attr('type', 'discrete')
    .attr('tableValues', '0');
  dropShadow.append('feGaussianBlur')
    .attr('stdDeviation', '2');
  dropShadow.append('feOffset')
    .attr('dx', '0')
    .attr('dy', '0')
    .attr('result', 'shadow');
  dropShadow.append('feComposite')
    .attr('in', 'SourceGraphic')
    .attr('in2', 'shadow')
    .attr('operator', 'over');
};

/**
 * @param {epiviz.datatypes.GenomicRange} [range]
 * @param {epiviz.datatypes.GenomicData} [data]
 * @returns {Array.<epiviz.ui.charts.ChartObject>} The objects drawn
 */
epiviz.ui.charts.Chart.prototype.draw = function(range, data) {
  epiviz.ui.charts.Visualization.prototype.draw.call(this, range, data);
  if (range) {
    this._binSize = Math.ceil((range.end() - range.start()) / this._nBins);
  }

  return [];
};

/**
 * @param {epiviz.datatypes.GenomicRange} range
 * @param {epiviz.datatypes.GenomicData} data
 * @returns {epiviz.deferred.Deferred}
 */
epiviz.ui.charts.Chart.prototype.transformData = function(range, data) {
  var deferred = new epiviz.deferred.Deferred();
  var self = this;
  epiviz.ui.charts.Visualization.prototype.transformData.call(this, range, data)
    .done(function() {
      if (!self._lastData) { deferred.resolve(); return; }
      self._lastData.ready(function() {
        var isFeatureChart = false;
        self._lastData.measurements().every(function(m) { isFeatureChart = m.type() !== epiviz.measurements.Measurement.Type.RANGE; return !isFeatureChart });

        if (isFeatureChart) {
          var groupByMarker;
          self._markers.every(function(marker) {
            if (marker && marker.type() == epiviz.ui.charts.markers.VisualizationMarker.Type.GROUP_BY_MEASUREMENTS) {
              groupByMarker = marker;
            }
            return !groupByMarker;
          });
          if (groupByMarker) {
            var aggregator = epiviz.ui.charts.markers.MeasurementAggregators[
              self.customSettingsValues()[epiviz.ui.charts.ChartType.CustomSettings.MEASUREMENT_GROUPS_AGGREGATOR]];
            self._lastData = new epiviz.datatypes.MeasurementAggregatedGenomicData(self._lastData, groupByMarker, aggregator);
          }
        }

        var filter;
        self._markers.every(function(marker) {
          if (marker && marker.type() == epiviz.ui.charts.markers.VisualizationMarker.Type.FILTER) {
            filter = marker;
          }
          return !filter;
        });
        if (filter) { self._lastData = new epiviz.datatypes.ItemFilteredGenomicData(self._lastData, filter); }

        var order;
        self._markers.every(function(marker) {
          if (marker && marker.type() == epiviz.ui.charts.markers.VisualizationMarker.Type.ORDER_BY_MEASUREMENTS) {
            order = marker;
          }
          return !order;
        });

        if (order) { self._lastData = new epiviz.datatypes.MeasurementOrderedGenomicData(self._lastData, order); }

        self._lastData.ready(function() {
          // self._lastData might have changed since we started to wait for it
          // so check the last version of it
          var data = self._lastData;
          if (data.isReady()) {
            // Also reassign color labels for both measurements and global indices
            var deferredColorByMeasurements = new epiviz.deferred.Deferred();
            var colorByMeasurements;
            self._markers.every(function(marker) {
              if (marker && marker.type() == epiviz.ui.charts.markers.VisualizationMarker.Type.COLOR_BY_MEASUREMENTS) {
                colorByMeasurements = marker;
              }
              return !colorByMeasurements;
            });

            self._measurementColorLabels = null;
            if (colorByMeasurements) {
              var measurementColorLabels = new epiviz.measurements.MeasurementHashtable();
              colorByMeasurements.preMark()(data).done(function(preColorVars) {
                var measurements = data.measurements();
                epiviz.utils.deferredFor(measurements.length, function(j) {
                  var mDeferredIteration = new epiviz.deferred.Deferred();
                  colorByMeasurements.mark()(measurements[j], data, preColorVars).done(function(label) {
                    measurementColorLabels.put(measurements[j], label);
                    mDeferredIteration.resolve();
                  });
                  return mDeferredIteration;
                }).done(function() {
                  self._measurementColorLabels = measurementColorLabels;
                  deferredColorByMeasurements.resolve();
                });
              });
            } else {
              deferredColorByMeasurements.resolve();
            }

            var deferredColorByGlobalIndices = new epiviz.deferred.Deferred();
            var colorByGlobalIndices;
            self._markers.every(function(marker) {
              if (marker && marker.type() == epiviz.ui.charts.markers.VisualizationMarker.Type.COLOR_BY_ROW) {
                colorByGlobalIndices = marker;
              }
              return !colorByGlobalIndices;
            });

            self._globalIndexColorLabels = null;
            if (colorByGlobalIndices) {
              var globalIndexColorLabels = {};
              colorByGlobalIndices.preMark()(data).done(function(preColorVars) {
                var firstSeries = data.firstSeries();
                epiviz.utils.deferredFor(firstSeries.size(), function(j) {
                  var seriesDeferredIteration = new epiviz.deferred.Deferred();
                  colorByGlobalIndices.mark()(firstSeries.getRow(j), data, preColorVars).done(function(label) {
                    globalIndexColorLabels[j + firstSeries.globalStartIndex()] = label;
                    seriesDeferredIteration.resolve();
                  });
                  return seriesDeferredIteration;
                }).done(function() {
                  self._globalIndexColorLabels = globalIndexColorLabels;
                  deferredColorByGlobalIndices.resolve();
                });
              });
            } else {
              deferredColorByGlobalIndices.resolve();
            }

            deferredColorByMeasurements.done(function() {
              if (deferredColorByGlobalIndices.state() == epiviz.deferred.Deferred.State.RESOLVED) {
                self._dataWaitEnd.notify(new epiviz.ui.charts.VisEventArgs(self.id()));
                deferred.resolve();
              }
            });

            deferredColorByGlobalIndices.done(function() {
              if (deferredColorByMeasurements.state() == epiviz.deferred.Deferred.State.RESOLVED) {
                self._dataWaitEnd.notify(new epiviz.ui.charts.VisEventArgs(self.id()));
                deferred.resolve();
              }
            });
          }
        });
      });
    });
  return deferred;
};

/**
 * @returns {epiviz.ui.charts.VisualizationProperties}
 */
epiviz.ui.charts.Chart.prototype.properties = function() {
  return /** @type {epiviz.ui.charts.VisualizationProperties} */ epiviz.ui.charts.Visualization.prototype.properties.call(this);
};


/***/ }),
/* 43 */
/***/ (function(module, exports) {

/**
 * Created by Florin Chelaru ( florinc [at] umd [dot] edu )
 * Date: 10/22/13
 * Time: 9:00 PM
 */

goog.provide('epiviz.ui.charts.ColorPalette');

/**
 * @param {Array.<string>} colors
 * @param {string} [name]
 * @param {string} [id]
 * @param {Object.<string|number, number>} [keyIndices]
 * @constructor
 */
epiviz.ui.charts.ColorPalette = function(colors, name, id, keyIndices) {
  /**
   * @type {Array.<string>}
   * @private
   */
  this._colors = colors;

  /**
   * @type {string}
   * @private
   */
  this._id = id || epiviz.utils.generatePseudoGUID(6);

  /**
   * @type {string}
   * @private
   */
  this._name = name || 'Custom (' + this._id + ')';

  /**
   * @type {Object.<string|number, number>}
   * @private
   */
  this._keyIndices = keyIndices || {};

  /**
   * @type {number}
   * @private
   */
  this._nKeys = 0;
};

/**
 * @returns {string}
 */
epiviz.ui.charts.ColorPalette.prototype.id = function() { return this._id; };

/**
 * @returns {string}
 */
epiviz.ui.charts.ColorPalette.prototype.name = function() { return this._name; };

/**
 * @param {number} i
 * @returns {string} A color corresponding to the index i
 */
epiviz.ui.charts.ColorPalette.prototype.get = function(i) {
  return this._colors[i % this._colors.length];
};

/**
 * @param {string|number} key
 * @returns {string}
 */
epiviz.ui.charts.ColorPalette.prototype.getByKey = function(key) {
  var index = this._keyIndices[key];
  if (index == undefined) {
    index = this._nKeys;
    this._keyIndices[key] = this._nKeys;
    ++this._nKeys;
  }
  return this.get(index);
};

/**
 * @param {string} key
 * @returns {number}
 */
epiviz.ui.charts.ColorPalette.prototype.keyColorIndex = function(key) {
  var ret = this._keyIndices[key];
  if (ret == undefined) { return -1; }
  return ret;
};

/**
 * @returns {Object.<string|number, number>}
 */
epiviz.ui.charts.ColorPalette.prototype.keyIndices = function() { return this._keyIndices; };

/**
 * @returns {Number} The number of colors contained in this palette
 */
epiviz.ui.charts.ColorPalette.prototype.size = function() {
  return this._colors.length;
};

/**
 * @param {epiviz.ui.charts.ColorPalette} other
 * @returns {boolean}
 */
epiviz.ui.charts.ColorPalette.prototype.equals = function(other) {
  if (this == other) { return true; }
  if (!other) { return false; }

  return epiviz.utils.arraysEqual(this._colors, other._colors);
};

/**
 * @returns {epiviz.ui.charts.ColorPalette}
 */
epiviz.ui.charts.ColorPalette.prototype.copy = function() {
  return new epiviz.ui.charts.ColorPalette(this._colors.slice(0));
};

/**
 * @param {epiviz.Config} [config]
 * @returns {{id: string, name: string, colors: Array.<string>}}
 */
epiviz.ui.charts.ColorPalette.prototype.raw = function(config) {
  if (config && (this._id in config.colorPalettesMap)) {
    return {id: this._id};
  }
  return {id: this._id, name: this._name, colors: this._colors};
};

/**
 * @param {Array.<string>|{id:string, name:string, colors:Array.<string>}} o
 * @param {epiviz.Config} [config]
 * @returns {epiviz.ui.charts.ColorPalette}
 */
epiviz.ui.charts.ColorPalette.fromRawObject = function(o, config) {
  if ($.isArray(o)) {
    return new epiviz.ui.charts.ColorPalette(o);
  }

  if (config && (o.id in config.colorPalettesMap)) {
    return config.colorPalettesMap[o.id];
  }

  if (!o.colors || !o.colors.length) { o.colors = epiviz.Config.COLORS_BRIGHT; }

  return new epiviz.ui.charts.ColorPalette(o.colors, o.name, o.id);
};


/***/ }),
/* 44 */
/***/ (function(module, exports) {

/**
 * Created by Florin Chelaru ( florinc [at] umd [dot] edu )
 * Date: 3/25/14
 * Time: 2:03 PM
 */

goog.provide('epiviz.ui.charts.ChartIndexObject');

/**
 * A struct for various objects in visualizations, like blocks, genes or circles in scatter plots
 * @param {string} id
 * @param {number} start
 * @param {number} end
 * @param {?Array.<number>} [values] One for each measurement
 * @param {number} [seriesIndex]
 * @param {Array.<Array.<epiviz.datatypes.GenomicData.ValueItem>>} [valueItems] For each measurement, an array of value items
 * @param {Array.<epiviz.measurements.Measurement>} [measurements]
 * @param {string} [cssClasses]
 * @constructor
 * @struct
 * @extends {epiviz.ui.charts.VisObject}
 */
epiviz.ui.charts.ChartIndexObject = function(id, keys, keyValues, values, valueItems, measurements, seriesIndex, cssClasses) {
    epiviz.ui.charts.VisObject.call(this);

    this.id = id;

    // Array
    this.keys = keys;

    // Array - made of [keys]
    this.keyValues = keyValues;

    // array [x, y]
    this.values = values;

    // number
    this.seriesIndex = seriesIndex;

    // array [actual dataX and dataY items]
    this.valueItems = valueItems;

    // [dimx, dimY]
    this.measurements = measurements;
    this.cssClasses = cssClasses;
};

/*
 * Copy methods from upper class
 */
epiviz.ui.charts.ChartIndexObject.prototype = epiviz.utils.mapCopy(epiviz.ui.charts.VisObject.prototype);
epiviz.ui.charts.ChartIndexObject.constructor = epiviz.ui.charts.ChartIndexObject;

epiviz.ui.charts.ChartIndexObject.prototype.getMetadata = function(i, j, metadataCol) {
    if (this.valueItems) {
        return this.valueItems[i][j][metadataCol];
    }

    return null;
};

epiviz.ui.charts.ChartIndexObject.prototype.metadataColumns = function() {
    return this.keys;
};

epiviz.ui.charts.ChartIndexObject.prototype.dimensions = function() {
    return [1, 1];
};

/***/ }),
/* 45 */
/***/ (function(module, exports) {

/**
 * Created by Florin Chelaru ( florinc [at] umd [dot] edu )
 * Date: 3/29/14
 * Time: 2:52 PM
 */

goog.provide('epiviz.ui.charts.CustomSetting');

/**
 * @param {string} id
 * @param {epiviz.ui.charts.CustomSetting.Type} type
 * @param defaultValue
 * @param {string} [label]
 * @param {Array} [possibleValues]
 * @constructor
 * @struct
 */
epiviz.ui.charts.CustomSetting = function(id, type, defaultValue, label, possibleValues) {
  /**
   * @type {string}
   */
  this.id = id;

  /**
   * @type {epiviz.ui.charts.CustomSetting.Type}
   */
  this.type = type;

  this.defaultValue = defaultValue;

  /**
   * @type {string}
   */
  this.label = label || id;

  /**
   * @type {Array}
   */
  this.possibleValues = possibleValues || null;
};

/**
 * @enum {string}
 */
epiviz.ui.charts.CustomSetting.Type = {
  NUMBER: 'number',
  STRING: 'string',
  ARRAY: 'array',
  BOOLEAN: 'boolean',
  CATEGORICAL: 'categorical',
  MEASUREMENTS_METADATA: 'measurementsMetadata',
  MEASUREMENTS_ANNOTATION: 'measurementsAnnotation'
};

/**
 * @type {string}
 * @constant
 */
epiviz.ui.charts.CustomSetting.DEFAULT = 'default';


/***/ }),
/* 46 */
/***/ (function(module, exports) {

/**
 * Created by Florin Chelaru ( florinc [at] umd [dot] edu )
 * Date: 12/1/2014
 * Time: 6:52 PM
 */

goog.provide('epiviz.ui.charts.DataStructureVisualizationType');

/**
 * @param {epiviz.Config} config
 * @extends {epiviz.ui.charts.VisualizationType}
 * @constructor
 */
epiviz.ui.charts.DataStructureVisualizationType = function(config) {
  // Call superclass constructor
  epiviz.ui.charts.VisualizationType.call(this, config);
};

/*
 * Copy methods from upper class
 */
epiviz.ui.charts.DataStructureVisualizationType.prototype = epiviz.utils.mapCopy(epiviz.ui.charts.VisualizationType.prototype);
epiviz.ui.charts.DataStructureVisualizationType.constructor = epiviz.ui.charts.DataStructureVisualizationType;

/**
 * @returns {epiviz.ui.charts.VisualizationType.DisplayType}
 */
epiviz.ui.charts.DataStructureVisualizationType.prototype.chartDisplayType = function() { return epiviz.ui.charts.VisualizationType.DisplayType.DATA_STRUCTURE; };

/**
 * @returns {string}
 */
epiviz.ui.charts.DataStructureVisualizationType.prototype.cssClass = function() {
  return 'data-structure-container ui-widget-content';
};

/**
 * If true, this flag indicates that the corresponding chart can only show measurements that belong to the same
 * data source group
 * @returns {boolean}
 */
epiviz.ui.charts.DataStructureVisualizationType.prototype.isRestrictedToSameDatasourceGroup = function() { return true; };

/**
 * @returns {boolean}
 */
epiviz.ui.charts.DataStructureVisualizationType.prototype.hasMeasurements = function() { return false; };

/***/ }),
/* 47 */
/***/ (function(module, exports) {

/**
 * Created by Florin Chelaru ( florinc [at] umd [dot] edu )
 * Date: 12/1/2014
 * Time: 6:47 PM
 */

goog.provide('epiviz.ui.charts.DataStructureVisualization');

/**
 * @param {string} id
 * @param {jQuery} container The div where the chart will be drawn
 * @param {epiviz.ui.charts.VisualizationProperties} properties
 * @extends {epiviz.ui.charts.Visualization.<T>}
 * @template T
 * @constructor
 */
epiviz.ui.charts.DataStructureVisualization = function(id, container, properties) {
  // Call superclass constructor
  epiviz.ui.charts.Visualization.call(this, id, container, properties);


  /**
   * @type {string}
   * @private
   */
  this._datasourceGroup = properties.visConfigSelection.datasourceGroup;

  /**
   * @type {string}
   * @private
   */
  this._dataprovider = properties.visConfigSelection.dataprovider;

  if (!this._dataprovider) {
    var self = this;
    properties.visConfigSelection.measurements.foreach(function(m) {
      if (m.dataprovider()) { self._dataprovider = m.dataprovider(); return true; }
    });
  }

  // Discard all measurements but one.

  var ms = new epiviz.measurements.MeasurementSet();
  properties.visConfigSelection.measurements.foreach(function(m) {
    if (m.dataprovider()) { ms.add(m); return true; }
  });
  properties.visConfigSelection.measurements = ms;

  // Events

  /**
   * @type {epiviz.events.Event.<epiviz.ui.charts.VisEventArgs.<{
   *   selection: Object.<string, epiviz.ui.charts.tree.NodeSelectionType>,
   *   order: Object.<string, number>
   * }>>}
   * @private
   */
  this._propagateHierarchyChanges = new epiviz.events.Event();

  /**
   * event -> event args -> selection -> data
   * @type {epiviz.events.Event.<epiviz.ui.charts.VisEventArgs.<epiviz.ui.controls.VisConfigSelection.<T>>>}
   * @private
   */
  this._requestHierarchy = new epiviz.events.Event();
};

/*
 * Copy methods from upper class
 */
epiviz.ui.charts.DataStructureVisualization.prototype = epiviz.utils.mapCopy(epiviz.ui.charts.Visualization.prototype);
epiviz.ui.charts.DataStructureVisualization.constructor = epiviz.ui.charts.DataStructureVisualization;

/**
 * @returns {epiviz.ui.charts.VisualizationType.DisplayType}
 */
epiviz.ui.charts.DataStructureVisualization.prototype.displayType = function() { return epiviz.ui.charts.VisualizationType.DisplayType.DATA_STRUCTURE; };

/**
 * @returns {string}
 */
epiviz.ui.charts.DataStructureVisualization.prototype.datasourceGroup = function() { return this._datasourceGroup; };

/**
 * @returns {string}
 */
epiviz.ui.charts.DataStructureVisualization.prototype.dataprovider = function() { return this._dataprovider; };

/**
 * @returns {Array.<{name: string, color: string}>}
 */
epiviz.ui.charts.DataStructureVisualization.prototype.colorLabels = function() {
  var labels = [];
  for (var i = 0; i < this.colors().size() && i < 20; ++i) {
    labels.push('Color ' + (i + 1));
  }
  return labels;
};

/**
 * @returns {epiviz.events.Event.<epiviz.ui.charts.VisEventArgs.<{selection: Object.<string, epiviz.ui.charts.tree.NodeSelectionType>, order: Object.<string, number>}>>}
 */
epiviz.ui.charts.DataStructureVisualization.prototype.onPropagateHierarchyChanges = function() { return this._propagateHierarchyChanges; };

/**
 */
epiviz.ui.charts.DataStructureVisualization.prototype.firePropagateHierarchyChanges = function() {
  this._propagateHierarchyChanges.notify(new epiviz.ui.charts.VisEventArgs(
    this.id(),
    new epiviz.ui.controls.VisConfigSelection(undefined, undefined, this.datasourceGroup(), this.dataprovider(), undefined, undefined, undefined, {})));
};


/**
 * @returns {epiviz.events.Event.<epiviz.ui.charts.VisEventArgs.<epiviz.ui.controls.VisConfigSelection.<T>>>}
 */
epiviz.ui.charts.DataStructureVisualization.prototype.onRequestHierarchy = function() { return this._requestHierarchy; };


/***/ }),
/* 48 */
/***/ (function(module, exports) {

/**
 * Created by Florin Chelaru ( florinc [at] umd [dot] edu )
 * Date: 1/10/2015
 * Time: 11:00 AM
 */

goog.provide('epiviz.ui.charts.decoration.ChartColorByMeasurementsCodeButton');

/**
 * @param {epiviz.ui.charts.Visualization} visualization
 * @param {epiviz.ui.charts.decoration.VisualizationDecoration} [otherDecoration]
 * @param {epiviz.Config} [config]
 * @extends {epiviz.ui.charts.decoration.CodeButton}
 * @constructor
 */
epiviz.ui.charts.decoration.ChartColorByMeasurementsCodeButton = function(visualization, otherDecoration, config) {
  epiviz.ui.charts.decoration.MarkerCodeButton.call(this, visualization, otherDecoration, config);
};

/*
 * Copy methods from upper class
 */
epiviz.ui.charts.decoration.ChartColorByMeasurementsCodeButton.prototype = epiviz.utils.mapCopy(epiviz.ui.charts.decoration.MarkerCodeButton.prototype);
epiviz.ui.charts.decoration.ChartColorByMeasurementsCodeButton.constructor = epiviz.ui.charts.decoration.ChartColorByMeasurementsCodeButton;

/**
 * @returns {epiviz.ui.charts.markers.VisualizationMarker.Type}
 */
epiviz.ui.charts.decoration.ChartColorByMeasurementsCodeButton.prototype.markerType = function() { return epiviz.ui.charts.markers.VisualizationMarker.Type.COLOR_BY_MEASUREMENTS; };

/**
 * @returns {string}
 */
epiviz.ui.charts.decoration.ChartColorByMeasurementsCodeButton.prototype.markerLabel = function() { return 'Color by Measurements' };

/**
 * @returns {string}
 */
epiviz.ui.charts.decoration.ChartColorByMeasurementsCodeButton.prototype.markerId = function() { return 'color-by-measurements'; };

/**
 * @returns {string}
 */
epiviz.ui.charts.decoration.ChartColorByMeasurementsCodeButton.prototype.preMarkTemplate = function() {
  return '/**\n' +
  ' * This method is called once before every draw, for all data available to the visualization,\n' +
  ' * for initialization. Its result can be used inside the filter method.\n' +
  ' * @param {epiviz.datatypes.GenomicData} [data]\n' +
  ' * @returns {InitialVars}\n' +
  ' * @template InitialVars\n' +
  ' */\n' +
  'function(data) {\n' +
  '  // TODO: Your code here\n' +
  '  return null;\n' +
  '}\n';
};

/**
 * @returns {string}
 */
epiviz.ui.charts.decoration.ChartColorByMeasurementsCodeButton.prototype.markTemplate = function() {
  return '/**\n' +
  ' * @param {epiviz.measurements.Measurement} m\n' +
  ' * @param {epiviz.datatypes.GenomicData} [data]\n' +
  ' * @param {InitialVars} [preMarkResult]\n' +
  ' * @returns {string|number}\n' +
  ' * @template InitialVars\n' +
  ' */\n' +
  'function(m, data, preMarkResult) {\n' +
  '  // TODO: Your code here\n' +
  '  return 0;\n' +
  '}\n';
};



/***/ }),
/* 49 */
/***/ (function(module, exports) {

/**
 * Created by Florin Chelaru ( florinc [at] umd [dot] edu )
 * Date: 1/10/2015
 * Time: 11:00 AM
 */

goog.provide('epiviz.ui.charts.decoration.ChartColorByRowCodeButton');

/**
 * @param {epiviz.ui.charts.Visualization} visualization
 * @param {epiviz.ui.charts.decoration.VisualizationDecoration} [otherDecoration]
 * @param {epiviz.Config} [config]
 * @extends {epiviz.ui.charts.decoration.CodeButton}
 * @constructor
 */
epiviz.ui.charts.decoration.ChartColorByRowCodeButton = function(visualization, otherDecoration, config) {
  epiviz.ui.charts.decoration.MarkerCodeButton.call(this, visualization, otherDecoration, config);
};

/*
 * Copy methods from upper class
 */
epiviz.ui.charts.decoration.ChartColorByRowCodeButton.prototype = epiviz.utils.mapCopy(epiviz.ui.charts.decoration.MarkerCodeButton.prototype);
epiviz.ui.charts.decoration.ChartColorByRowCodeButton.constructor = epiviz.ui.charts.decoration.ChartColorByRowCodeButton;

/**
 * @returns {epiviz.ui.charts.markers.VisualizationMarker.Type}
 */
epiviz.ui.charts.decoration.ChartColorByRowCodeButton.prototype.markerType = function() { return epiviz.ui.charts.markers.VisualizationMarker.Type.COLOR_BY_ROW; };

/**
 * @returns {string}
 */
epiviz.ui.charts.decoration.ChartColorByRowCodeButton.prototype.markerLabel = function() { return 'Color By' };

/**
 * @returns {string}
 */
epiviz.ui.charts.decoration.ChartColorByRowCodeButton.prototype.markerId = function() { return 'color-by'; };

/**
 * @returns {string}
 */
epiviz.ui.charts.decoration.ChartColorByRowCodeButton.prototype.preMarkTemplate = function() {
  return '/**\n' +
  ' * This method is called once before every draw, for all data available to the visualization,\n' +
  ' * for initialization. Its result can be used inside the filter method.\n' +
  ' * @param {epiviz.datatypes.GenomicData} [data]\n' +
  ' * @returns {InitialVars}\n' +
  ' * @template InitialVars\n' +
  ' */\n' +
  'function(data) {\n' +
  '  // TODO: Your code here\n' +
  '  return null;\n' +
  '}\n';
};

/**
 * @returns {string}
 */
epiviz.ui.charts.decoration.ChartColorByRowCodeButton.prototype.markTemplate = function() {
  return '/**\n' +
  ' * This method is called for every data object. If it returns false, the object will not be drawn.\n' +
  ' * @param {epiviz.datatypes.GenomicData.RowItem} [row]\n' +
  ' * @param {epiviz.datatypes.GenomicData} [data]\n' +
  ' * @param {InitialVars} [preMarkResult]\n' +
  ' * @returns {string}\n' +
  ' * @template InitialVars\n' +
  ' */\n' +
  'function(row, data, preMarkResult) {\n' +
  '  // TODO: Your code here\n' +
  '  return row.metadata(\'colLabel\');\n' +
  '}\n'
};



/***/ }),
/* 50 */
/***/ (function(module, exports) {

/**
 * Created by Florin Chelaru ( florinc [at] umd [dot] edu )
 * Date: 10/30/2014
 * Time: 12:24 PM
 */

goog.provide('epiviz.ui.charts.decoration.ChartColorsButton');

/**
 * @param {epiviz.ui.charts.Visualization} visualization
 * @param {epiviz.ui.charts.decoration.VisualizationDecoration} [otherDecoration]
 * @param {epiviz.Config} [config]
 * @extends {epiviz.ui.charts.decoration.ChartOptionButton}
 * @constructor
 */
epiviz.ui.charts.decoration.ChartColorsButton = function(visualization, otherDecoration, config) {
  epiviz.ui.charts.decoration.ChartOptionButton.call(this, visualization, otherDecoration, config);
};

/*
 * Copy methods from upper class
 */
epiviz.ui.charts.decoration.ChartColorsButton.prototype = epiviz.utils.mapCopy(epiviz.ui.charts.decoration.ChartOptionButton.prototype);
epiviz.ui.charts.decoration.ChartColorsButton.constructor = epiviz.ui.charts.decoration.ChartColorsButton;

/**
 * @returns {Function}
 * @protected
 */
epiviz.ui.charts.decoration.ChartColorsButton.prototype._click = function() {
  var self = this;
  return function(){
    var labels = self.visualization().colorLabels();
    var colorPickerDialog = new epiviz.ui.controls.ColorPickerDialog(
      {
        ok: function(colors) {
          self.visualization().setColors(colors);
        },
        cancel: function() {},
        reset: function() {}
      },
      labels,
      self.config().colorPalettes,
      self.visualization().colors());
    colorPickerDialog.show();
  };
};

/**
 * @returns {*} jQuery button render options
 * @protected
 */
epiviz.ui.charts.decoration.ChartColorsButton.prototype._renderOptions = function() {
  return {
    icons:{ primary:'ui-icon ui-icon-colorpicker' },
    text:false
  };
};

/**
 * @returns {string}
 * @protected
 */
epiviz.ui.charts.decoration.ChartColorsButton.prototype._text = function() { return 'Colors'; };


/***/ }),
/* 51 */
/***/ (function(module, exports) {

/**
 * Created by Florin Chelaru ( florinc [at] umd [dot] edu )
 * Date: 1/10/2015
 * Time: 11:00 AM
 */

goog.provide('epiviz.ui.charts.decoration.ChartFilterCodeButton');

/**
 * @param {epiviz.ui.charts.Visualization} visualization
 * @param {epiviz.ui.charts.decoration.VisualizationDecoration} [otherDecoration]
 * @param {epiviz.Config} [config]
 * @extends {epiviz.ui.charts.decoration.CodeButton}
 * @constructor
 */
epiviz.ui.charts.decoration.ChartFilterCodeButton = function(visualization, otherDecoration, config) {
  epiviz.ui.charts.decoration.MarkerCodeButton.call(this, visualization, otherDecoration, config);
};

/*
 * Copy methods from upper class
 */
epiviz.ui.charts.decoration.ChartFilterCodeButton.prototype = epiviz.utils.mapCopy(epiviz.ui.charts.decoration.MarkerCodeButton.prototype);
epiviz.ui.charts.decoration.ChartFilterCodeButton.constructor = epiviz.ui.charts.decoration.ChartFilterCodeButton;

/**
 * @returns {epiviz.ui.charts.markers.VisualizationMarker.Type}
 */
epiviz.ui.charts.decoration.ChartFilterCodeButton.prototype.markerType = function() { return epiviz.ui.charts.markers.VisualizationMarker.Type.FILTER; };

/**
 * @returns {string}
 */
epiviz.ui.charts.decoration.ChartFilterCodeButton.prototype.markerLabel = function() { return 'User Filter' };

/**
 * @returns {string}
 */
epiviz.ui.charts.decoration.ChartFilterCodeButton.prototype.markerId = function() { return 'user-filter'; };

/**
 * @returns {string}
 */
epiviz.ui.charts.decoration.ChartFilterCodeButton.prototype.preMarkTemplate = function() {
  return '/**\n' +
  ' * This method is called once before every draw, for all data available to the visualization,\n' +
  ' * for initialization. Its result can be used inside the filter method.\n' +
  ' * @param {epiviz.datatypes.GenomicData} [data]\n' +
  ' * @returns {InitialVars}\n' +
  ' * @template InitialVars\n' +
  ' */\n' +
  'function(data) {\n' +
  '  // TODO: Your code here\n' +
  '  return null;\n' +
  '}\n';
};

/**
 * @returns {string}
 */
epiviz.ui.charts.decoration.ChartFilterCodeButton.prototype.markTemplate = function() {
  return '/**\n' +
  ' * This method is called for every data object. If it returns false, the object will not be drawn.\n' +
  ' * @param {epiviz.datatypes.GenomicData.ValueItem} [item]\n' +
  ' * @param {epiviz.datatypes.GenomicData} [data]\n' +
  ' * @param {InitialVars} [preMarkResult]\n' +
  ' * @returns {boolean}\n' +
  ' * @template InitialVars\n' +
  ' */\n' +
  'function(item, data, preMarkResult) {\n' +
  '  // TODO: Your code here\n' +
  '  return true;\n' +
  '}\n'
};



/***/ }),
/* 52 */
/***/ (function(module, exports) {

/**
 * Created by Florin Chelaru ( florinc [at] umd [dot] edu )
 * Date: 1/16/2015
 * Time: 6:18 PM
 */

goog.provide('epiviz.ui.charts.decoration.ChartGroupByMeasurementsCodeButton');

/**
 * @param {epiviz.ui.charts.Visualization} visualization
 * @param {epiviz.ui.charts.decoration.VisualizationDecoration} [otherDecoration]
 * @param {epiviz.Config} [config]
 * @extends {epiviz.ui.charts.decoration.CodeButton}
 * @constructor
 */
epiviz.ui.charts.decoration.ChartGroupByMeasurementsCodeButton = function(visualization, otherDecoration, config) {
  epiviz.ui.charts.decoration.MarkerCodeButton.call(this, visualization, otherDecoration, config);
};

/*
 * Copy methods from upper class
 */
epiviz.ui.charts.decoration.ChartGroupByMeasurementsCodeButton.prototype = epiviz.utils.mapCopy(epiviz.ui.charts.decoration.MarkerCodeButton.prototype);
epiviz.ui.charts.decoration.ChartGroupByMeasurementsCodeButton.constructor = epiviz.ui.charts.decoration.ChartGroupByMeasurementsCodeButton;

/**
 * @returns {epiviz.ui.charts.markers.VisualizationMarker.Type}
 */
epiviz.ui.charts.decoration.ChartGroupByMeasurementsCodeButton.prototype.markerType = function() { return epiviz.ui.charts.markers.VisualizationMarker.Type.GROUP_BY_MEASUREMENTS; };

/**
 * @returns {string}
 */
epiviz.ui.charts.decoration.ChartGroupByMeasurementsCodeButton.prototype.markerLabel = function() { return 'Group by' };

/**
 * @returns {string}
 */
epiviz.ui.charts.decoration.ChartGroupByMeasurementsCodeButton.prototype.markerId = function() { return 'group-by-measurements'; };

/**
 * @returns {string}
 */
epiviz.ui.charts.decoration.ChartGroupByMeasurementsCodeButton.prototype.preMarkTemplate = function() {
  return '/**\n' +
  ' * This method is called once before every draw, for all data available to the visualization,\n' +
  ' * for initialization. Its result can be used inside the filter method.\n' +
  ' * @param {epiviz.datatypes.GenomicData} [data]\n' +
  ' * @returns {InitialVars}\n' +
  ' * @template InitialVars\n' +
  ' */\n' +
  'function(data) {\n' +
  '  // TODO: Your code here\n' +
  '  return null;\n' +
  '}\n';
};

/**
 * @returns {string}
 */
epiviz.ui.charts.decoration.ChartGroupByMeasurementsCodeButton.prototype.markTemplate = function() {
  return '/**\n' +
  ' * @param {epiviz.measurements.Measurement} m\n' +
  ' * @param {epiviz.datatypes.GenomicData} [data]\n' +
  ' * @param {InitialVars} [preMarkResult]\n' +
  ' * @returns {string}\n' +
  ' * @template InitialVars\n' +
  ' */\n' +
  'function(m, data, preMarkResult) {\n' +
  '  // TODO: Your code here\n' +
  '  return 0;\n' +
  '}\n';
};



/***/ }),
/* 53 */
/***/ (function(module, exports) {

/**
 * Created by Florin Chelaru ( florinc [at] umd [dot] edu )
 * Date: 10/30/2014
 * Time: 12:31 PM
 */

goog.provide('epiviz.ui.charts.decoration.ChartLoaderAnimation');

/**
 * @param {epiviz.ui.charts.Visualization} visualization
 * @param {epiviz.ui.charts.decoration.VisualizationDecoration} [otherDecoration]
 * @extends {epiviz.ui.charts.decoration.VisualizationDecoration}
 * @constructor
 */
epiviz.ui.charts.decoration.ChartLoaderAnimation = function(visualization, otherDecoration) {
  epiviz.ui.charts.decoration.VisualizationDecoration.call(this, visualization, otherDecoration);

  /**
   * @type {number}
   * @private
   */
  this._loaderTimeout = 0;

  /**
   * @type {boolean}
   * @private
   */
  this._animationShowing = false;
};

/*
 * Copy methods from upper class
 */
epiviz.ui.charts.decoration.ChartLoaderAnimation.prototype = epiviz.utils.mapCopy(epiviz.ui.charts.decoration.VisualizationDecoration.prototype);
epiviz.ui.charts.decoration.ChartLoaderAnimation.constructor = epiviz.ui.charts.decoration.ChartLoaderAnimation;

/**
 */
epiviz.ui.charts.decoration.ChartLoaderAnimation.prototype.decorate = function() {
  epiviz.ui.charts.decoration.VisualizationDecoration.prototype.decorate.call(this);

  var self = this;
  this.visualization().onDataWaitStart().addListener(new epiviz.events.EventListener(function() {
    self._addLoaderAnimation();
  }));

  this.visualization().onDataWaitEnd().addListener(new epiviz.events.EventListener(function() {
    self._removeLoaderAnimation();
  }));

  this.visualization().onSizeChanged().addListener(new epiviz.events.EventListener(function() {
    if (self._animationShowing) {
      self._addLoaderAnimation();
    }
  }));
};

epiviz.ui.charts.decoration.ChartLoaderAnimation.prototype._addLoaderAnimation = function() {
  if (this._loaderTimeout) { clearTimeout(this._loaderTimeout); }

  var doAddLoaderAnimation = function() {
    self._animationShowing = true;
    var loaderCls = 'chart-loader';

    var visualization = self.visualization();
    var container = visualization.container();
    container.find('.' + loaderCls).remove();

    container.append(sprintf(
      '<div class="loader-icon %s" style="top: %spx; left: %spx;"></div>',
      loaderCls,
      Math.floor(visualization.height() * 0.5),
      Math.floor(visualization.width() * 0.5)));
    container.find('.' + loaderCls).activity({
      segments: 8,
      steps: 5,
      opacity: 0.3,
      width: 4,
      space: 0,
      length: 10,
      color: '#0b0b0b',
      speed: 1.0
    });
  };

  var self = this;

  if (!this._animationShowing) {
    this._loaderTimeout = setTimeout(doAddLoaderAnimation, 500);
  } else {
    doAddLoaderAnimation();
  }
};

epiviz.ui.charts.decoration.ChartLoaderAnimation.prototype._removeLoaderAnimation = function() {
  if (this._loaderTimeout) { clearTimeout(this._loaderTimeout); }
  this._animationShowing = false;
  var loaderCls = 'chart-loader';
  this.visualization().container().find('.' + loaderCls).remove();
};


/***/ }),
/* 54 */
/***/ (function(module, exports) {

/**
 * Created by Florin Chelaru ( florinc [at] umd [dot] edu )
 * Date: 10/30/2014
 * Time: 12:31 PM
 */

goog.provide('epiviz.ui.charts.decoration.ChartOptionButton');

/**
 * @param {epiviz.ui.charts.Visualization} visualization
 * @param {epiviz.ui.charts.decoration.VisualizationDecoration} [otherDecoration]
 * @param {epiviz.Config} [config]
 * @extends {epiviz.ui.charts.decoration.VisualizationDecoration}
 * @constructor
 */
epiviz.ui.charts.decoration.ChartOptionButton = function(visualization, otherDecoration, config) {
  epiviz.ui.charts.decoration.VisualizationDecoration.call(this, visualization, otherDecoration, config);

  /**
   * @type {boolean}
   */
  this.isChartOptionButton = true;
};

/*
 * Copy methods from upper class
 */
epiviz.ui.charts.decoration.ChartOptionButton.prototype = epiviz.utils.mapCopy(epiviz.ui.charts.decoration.VisualizationDecoration.prototype);
epiviz.ui.charts.decoration.ChartOptionButton.constructor = epiviz.ui.charts.decoration.ChartOptionButton;

/**
 */
epiviz.ui.charts.decoration.ChartOptionButton.prototype.decorate = function() {
  epiviz.ui.charts.decoration.VisualizationDecoration.prototype.decorate.call(this);

  if (!this.isChartOptionButton) { return; }

  var buttonIndex = 0;
  for (var decoration = this.otherDecoration(); decoration; decoration = decoration.otherDecoration()) {
    if (decoration.isChartOptionButton) { ++buttonIndex; }
  }

  var button = $(sprintf('<button style="position: absolute; top: 5px; right: %spx">%s</button>',
    5 + buttonIndex * 30,
    this._text()))
    .appendTo(this.visualization().container())
    .button(this._renderOptions())
    .click(this._click());

  this.visualization().container()
    .mousemove(function () { button.show(); })
    .mouseleave(function () { button.hide(); });
};

/**
 * @returns {Function}
 * @protected
 */
epiviz.ui.charts.decoration.ChartOptionButton.prototype._click = function() { return function() {}; };

/**
 * @returns {*} jQuery button render options
 * @protected
 */
epiviz.ui.charts.decoration.ChartOptionButton.prototype._renderOptions = function() { return {}; };

/**
 * @returns {string}
 * @protected
 */
epiviz.ui.charts.decoration.ChartOptionButton.prototype._text = function() { return ''; };


/***/ }),
/* 55 */
/***/ (function(module, exports) {

/**
 * Created by Florin Chelaru ( florinc [at] umd [dot] edu )
 * Date: 1/10/2015
 * Time: 11:00 AM
 */

goog.provide('epiviz.ui.charts.decoration.ChartOrderByMeasurementsCodeButton');

/**
 * @param {epiviz.ui.charts.Visualization} visualization
 * @param {epiviz.ui.charts.decoration.VisualizationDecoration} [otherDecoration]
 * @param {epiviz.Config} [config]
 * @extends {epiviz.ui.charts.decoration.CodeButton}
 * @constructor
 */
epiviz.ui.charts.decoration.ChartOrderByMeasurementsCodeButton = function(visualization, otherDecoration, config) {
  epiviz.ui.charts.decoration.MarkerCodeButton.call(this, visualization, otherDecoration, config);
};

/*
 * Copy methods from upper class
 */
epiviz.ui.charts.decoration.ChartOrderByMeasurementsCodeButton.prototype = epiviz.utils.mapCopy(epiviz.ui.charts.decoration.MarkerCodeButton.prototype);
epiviz.ui.charts.decoration.ChartOrderByMeasurementsCodeButton.constructor = epiviz.ui.charts.decoration.ChartOrderByMeasurementsCodeButton;

/**
 * @returns {epiviz.ui.charts.markers.VisualizationMarker.Type}
 */
epiviz.ui.charts.decoration.ChartOrderByMeasurementsCodeButton.prototype.markerType = function() { return epiviz.ui.charts.markers.VisualizationMarker.Type.ORDER_BY_MEASUREMENTS; };

/**
 * @returns {string}
 */
epiviz.ui.charts.decoration.ChartOrderByMeasurementsCodeButton.prototype.markerLabel = function() { return 'Order By' };

/**
 * @returns {string}
 */
epiviz.ui.charts.decoration.ChartOrderByMeasurementsCodeButton.prototype.markerId = function() { return 'order-by-measurements'; };

/**
 * @returns {string}
 */
epiviz.ui.charts.decoration.ChartOrderByMeasurementsCodeButton.prototype.preMarkTemplate = function() {
  return '/**\n' +
  ' * This method is called once before every draw, for all data available to the visualization,\n' +
  ' * for initialization. Its result can be used inside the filter method.\n' +
  ' * @param {epiviz.datatypes.GenomicData} [data]\n' +
  ' * @returns {InitialVars}\n' +
  ' * @template InitialVars\n' +
  ' */\n' +
  'function(data) {\n' +
  '  // TODO: Your code here\n' +
  '  return null;\n' +
  '}\n';
};

/**
 * @returns {string}
 */
epiviz.ui.charts.decoration.ChartOrderByMeasurementsCodeButton.prototype.markTemplate = function() {
  return '/**\n' +
  ' * @param {epiviz.measurements.Measurement} m\n' +
  ' * @param {epiviz.datatypes.GenomicData} [data]\n' +
  ' * @param {InitialVars} [preMarkResult]\n' +
  ' * @returns {string|number}\n' +
  ' * @template InitialVars\n' +
  ' */\n' +
  'function(m, data, preMarkResult) {\n' +
  '  // TODO: Your code here\n' +
  '  return 0;\n' +
  '}\n';
};



/***/ }),
/* 56 */
/***/ (function(module, exports) {

/**
 * Created by Florin Chelaru ( florinc [at] umd [dot] edu )
 * Date: 10/30/2014
 * Time: 12:31 PM
 */

goog.provide('epiviz.ui.charts.decoration.ChartResize');

/**
 * @param {epiviz.ui.charts.Visualization} visualization
 * @param {epiviz.ui.charts.decoration.VisualizationDecoration} [otherDecoration]
 * @extends {epiviz.ui.charts.decoration.VisualizationDecoration}
 * @constructor
 */
epiviz.ui.charts.decoration.ChartResize = function(visualization, otherDecoration) {
  epiviz.ui.charts.decoration.VisualizationDecoration.call(this, visualization, otherDecoration);
};

/*
 * Copy methods from upper class
 */
epiviz.ui.charts.decoration.ChartResize.prototype = epiviz.utils.mapCopy(epiviz.ui.charts.decoration.VisualizationDecoration.prototype);
epiviz.ui.charts.decoration.ChartResize.constructor = epiviz.ui.charts.decoration.ChartResize;

/**
 */
epiviz.ui.charts.decoration.ChartResize.prototype.decorate = function() {
  epiviz.ui.charts.decoration.VisualizationDecoration.prototype.decorate.call(this);

  var self = this;
  var resizeHandler = function(event, ui) { self.visualization().updateSize(); };
  this.visualization().container().resizable({
    //resize: resizeHandler,
    stop: resizeHandler
  });
};


/***/ }),
/* 57 */
/***/ (function(module, exports) {

/**
 * Created by Florin Chelaru ( florinc [at] umd [dot] edu )
 * Date: 10/30/2014
 * Time: 12:31 PM
 */

goog.provide('epiviz.ui.charts.decoration.ChartTooltip');

/**
 * @param {epiviz.ui.charts.Visualization} visualization
 * @param {epiviz.ui.charts.decoration.VisualizationDecoration} [otherDecoration]
 * @extends {epiviz.ui.charts.decoration.VisualizationDecoration}
 * @constructor
 */
epiviz.ui.charts.decoration.ChartTooltip = function(visualization, otherDecoration) {
  epiviz.ui.charts.decoration.VisualizationDecoration.call(this, visualization, otherDecoration);
};

/*
 * Copy methods from upper class
 */
epiviz.ui.charts.decoration.ChartTooltip.prototype = epiviz.utils.mapCopy(epiviz.ui.charts.decoration.VisualizationDecoration.prototype);
epiviz.ui.charts.decoration.ChartTooltip.constructor = epiviz.ui.charts.decoration.ChartTooltip;

/**
 */
epiviz.ui.charts.decoration.ChartTooltip.prototype.decorate = function() {
  epiviz.ui.charts.decoration.VisualizationDecoration.prototype.decorate.call(this);

  /** @type {epiviz.ui.charts.decoration.ToggleTooltipButton} */
  var tooltipButtonDecoration = undefined;
  for (var decoration = this.otherDecoration(); decoration; decoration = decoration.otherDecoration()) {
    if (decoration.constructor == epiviz.ui.charts.decoration.ToggleTooltipButton) {
      tooltipButtonDecoration = decoration;
      break;
    }
  }

  var self = this;
  this.visualization().container().tooltip({
    items: '.item',
    content:function () {
      if (!tooltipButtonDecoration.checked()) { return false; }

      /** @type {epiviz.ui.charts.ChartObject} */
      var item = d3.select(this).data()[0];
      if (item.valueItems[0].length > item.measurements.length + item.measurements[0].metadata().length) {
        return self._horizontalContent(item);
      } else {
        return self._verticalContent(item);
      }
    },
    track: true,
    show: false
    // TODO: Use a better tooltip
    /*,
    position: {
      my: 'left+10 bottom-10',
      of: event,
      collision: 'fit'
    }*/
  });
};

/**
 * @param {epiviz.ui.charts.ChartObject} item
 * @returns {*}
 * @private
 */
epiviz.ui.charts.decoration.ChartTooltip.prototype._horizontalContent = function(item) {
  var maxMetadataValueLength = 15;

  var metadataCols = item.measurements[0].metadata();
  var colsHeader = sprintf('%s%s%s',
    (item.start != undefined && item.end != undefined) ? '<th><b>Start</b></th><th><b>End</b></th>' : '',
    metadataCols ? '<th><b>' + metadataCols.join('</b></th><th><b>') + '</b></th>' : '',
    item.values ? '<th><b>' + item.measurements.join('</b></th><th><b>') + '</b></th>': '');

  var rows = '';
  for (var j = 0; j < item.valueItems[0].length && j < 10; ++j) {
    var row = '';
    var rowItem = item.valueItems[0][j].rowItem;
    var start = Globalize.format(rowItem.start(), 'n0');
    var end = Globalize.format(rowItem.end(), 'n0');
    if (start != undefined && end != undefined) {
      row += sprintf('<td>%s</td><td>%s</td>', start, end);
    }
    var rowMetadata = rowItem.rowMetadata();
    if (metadataCols && rowMetadata) {
      for (var k = 0; k < metadataCols.length; ++k) {
        var metadataCol = metadataCols[k];
        var metadataValue = rowMetadata[metadataCol] || '';
        row += sprintf('<td>%s</td>', metadataValue.length <= maxMetadataValueLength ? metadataValue : metadataValue.substr(0, maxMetadataValueLength) + '...');
      }
    }

    if (item.values) {
      for (var i = 0; i < item.measurements.length; ++i) {
        row += sprintf('<td>%s</td>', Globalize.format(item.valueItems[i][j].value, 'n3'));
      }
    }

    rows += sprintf('<tr>%s</tr>', row);
  }
  if (j < item.valueItems[0].length) {
    var colspan = 2 + (metadataCols ? metadataCols.length : 0) + (item.values ? item.measurements.length : 0);
    rows += sprintf('<tr><td colspan="%s" style="text-align: center;">...</td></tr>', colspan)
  }

  return sprintf('<table class="tooltip-table"><thead><tr>%s</tr></thead><tbody>%s</tbody></table>', colsHeader, rows);
};

/**
 * @param {epiviz.ui.charts.ChartObject} item
 * @returns {*}
 * @private
 */
epiviz.ui.charts.decoration.ChartTooltip.prototype._verticalContent = function(item) {
  var maxMetadataValueLength = 15;
  var maxRows = 10;
  var maxCols = 6;
  var condensedMetadata = 4;
  var condensedValues = 5;

  var table = [];
  var coordinates = [0, 0];
  if (item.start != undefined && item.end != undefined) {
    var start = ['Start'];
    var end = ['End'];
    item.valueItems[0].every(function(valueItem, j) {
      start.push(Globalize.format(valueItem.rowItem.start(), 'n0'));
      end.push(Globalize.format(valueItem.rowItem.end(), 'n0'));
      return j < (maxCols - 1);
    });
    table.push(start);
    table.push(end);
    coordinates = [0, 2];
  }

  var metadataCols = item.measurements[0].metadata();
  var metadata = [coordinates[1], coordinates[1] + metadataCols.length];
  metadataCols.forEach(function(metadata) {
    var row = [metadata];
    item.valueItems[0].every(function(valueItem, j) {
      var metadataVal = valueItem.rowItem.metadata(metadata) || '[NA]';
      if (metadataVal.length > maxMetadataValueLength) {
        metadataVal = metadataVal.substr(0, maxMetadataValueLength) + '...';
      }
      row.push(metadataVal);
      return j < (maxCols - 1);
    });
    table.push(row);
  });

  var values = [metadata[1], metadata[1]];
  if (item.values) {
    values = [metadata[1], metadata[1] + item.measurements.length];
    item.measurements.forEach(function(m, i) {
      var row = [m.name()];
      item.valueItems[i].every(function(valueItem, j) {
        row.push(Globalize.format(valueItem.value, 'n3'));
        return j < (maxCols - 1);
      });
      table.push(row);
    });
  }

  var nRows = values[1];
  if (nRows > maxRows) {
    coordinates[1] = 1;
    metadata[1] = Math.min(metadata[1], metadata[0] + condensedMetadata);
    nRows = coordinates[1] - coordinates[0] + metadata[1] - metadata[0] + values[1] - values[0];
    if (nRows > maxRows) {
      values[1] -= (nRows - maxRows);
    }
  }

  var ret = '', i;
  for (i = coordinates[0]; i < coordinates[1]; ++i) {
    ret += '<tr><td><b>' + table[i][0] + '</b></td><td>' + table[i].slice(1).join('</td><td>') + '</td></tr>';
  }
  for (i = metadata[0]; i < metadata[1]; ++i) {
    ret += '<tr><td><b>' + table[i][0] + '</b></td><td>' + table[i].slice(1).join('</td><td>') + '</td></tr>';
  }
  for (i = values[0]; i < values[1]; ++i) {
    ret += '<tr><td><b>' + table[i][0] + '</b></td><td>' + table[i].slice(1).join('</td><td>') + '</td></tr>';
  }
  return '<table class="tooltip-table"><tbody>' + ret + '</tbody></table>';
};


/***/ }),
/* 58 */
/***/ (function(module, exports) {

/**
 * Created by Florin Chelaru ( florinc [at] umd [dot] edu )
 * Date: 1/6/2015
 * Time: 12:59 PM
 */

goog.provide('epiviz.ui.charts.decoration.CodeButton');

/**
 * @param {epiviz.ui.charts.Visualization} visualization
 * @param {epiviz.ui.charts.decoration.VisualizationDecoration} [otherDecoration]
 * @param {epiviz.Config} [config]
 * @extends {epiviz.ui.charts.decoration.ChartOptionButton}
 * @constructor
 */
epiviz.ui.charts.decoration.CodeButton = function(visualization, otherDecoration, config) {
  epiviz.ui.charts.decoration.ChartOptionButton.call(this, visualization, otherDecoration, config);

  /**
   * @type {boolean}
   * @const
   */
  this.isCodeButton = true;

  /**
   * @type {Array.<{creator: function(jQuery): epiviz.ui.controls.CodeControl, save: function(*), cancel: function()}>}
   * @private
   */
  this._controlCreators = [];

  var isChartOptionButton = true;
  var lastCodeButtonDecoration;
  for (var decoration = this.otherDecoration(); decoration; decoration = decoration.otherDecoration()) {
    if (decoration.isCodeButton) {
      isChartOptionButton = false;
      lastCodeButtonDecoration = decoration;
    }
  }
  if (lastCodeButtonDecoration) {
    lastCodeButtonDecoration._addControlCreator(this._controlCreator(), this._saveHandler(), this._cancelHandler());
  }
  this.isChartOptionButton = isChartOptionButton;
  if (isChartOptionButton) {
    this._addControlCreator(this._controlCreator(), this._saveHandler(), this._cancelHandler());
  }
};

/*
 * Copy methods from upper class
 */
epiviz.ui.charts.decoration.CodeButton.prototype = epiviz.utils.mapCopy(epiviz.ui.charts.decoration.ChartOptionButton.prototype);
epiviz.ui.charts.decoration.CodeButton.constructor = epiviz.ui.charts.decoration.CodeButton;

/**
 * @returns {Function}
 * @protected
 */
epiviz.ui.charts.decoration.CodeButton.prototype._click = function() {
  var self = this;

  return function() {
    var editCodeDialog = new epiviz.ui.controls.CodeDialog(
      'Chart Code',
      {
        save: function(results) {
          results.forEach(function(result, i) {
            self._controlCreators[i].save(result);
          });
        },
        cancel: function() {
          self._controlCreators.forEach(function(o) { o.cancel(); })
        }
      },
      self._controlCreators.map(function(o) { return o.creator; }));
    editCodeDialog.show();
  };
};

/**
 * @returns {*} jQuery button render options
 * @protected
 */
epiviz.ui.charts.decoration.CodeButton.prototype._renderOptions = function() {
  return {
    icons:{ primary:'ui-icon ui-icon-pencil' },
    text:false
  };
};

/**
 * @returns {string}
 * @protected
 */
epiviz.ui.charts.decoration.CodeButton.prototype._text = function() { return 'Code'; };

/**
 * @param {function(jQuery): epiviz.ui.controls.CodeControl} creator
 * @param {function(*)} [saveHandler]
 * @param {function()} [cancelHandler]
 * @protected
 */
epiviz.ui.charts.decoration.CodeButton.prototype._addControlCreator = function(creator, saveHandler, cancelHandler) {
  this._controlCreators.push({creator: creator, save: saveHandler, cancel: cancelHandler});
};

/**
 * @returns {function(jQuery): epiviz.ui.controls.CodeControl}
 * @protected
 */
epiviz.ui.charts.decoration.CodeButton.prototype._controlCreator = function() { return null; };

/**
 * @returns {function(*)}
 * @private
 */
epiviz.ui.charts.decoration.CodeButton.prototype._saveHandler = function() { return null; };

/**
 * @returns {function()}
 * @private
 */
epiviz.ui.charts.decoration.CodeButton.prototype._cancelHandler = function() { return null; };


/***/ }),
/* 59 */
/***/ (function(module, exports) {

/**
 * Created by Florin Chelaru ( florinc [at] umd [dot] edu )
 * Date: 10/30/2014
 * Time: 12:24 PM
 */

goog.provide('epiviz.ui.charts.decoration.CustomSettingsButton');

/**
 * @param {epiviz.ui.charts.Visualization} visualization
 * @param {epiviz.ui.charts.decoration.VisualizationDecoration} [otherDecoration]
 * @extends {epiviz.ui.charts.decoration.ChartOptionButton}
 * @constructor
 */
epiviz.ui.charts.decoration.CustomSettingsButton = function(visualization, otherDecoration) {
  epiviz.ui.charts.decoration.ChartOptionButton.call(this, visualization, otherDecoration);
};

/*
 * Copy methods from upper class
 */
epiviz.ui.charts.decoration.CustomSettingsButton.prototype = epiviz.utils.mapCopy(epiviz.ui.charts.decoration.ChartOptionButton.prototype);
epiviz.ui.charts.decoration.CustomSettingsButton.constructor = epiviz.ui.charts.decoration.CustomSettingsButton;

/**
 * @returns {Function}
 * @protected
 */
epiviz.ui.charts.decoration.CustomSettingsButton.prototype._click = function() {
  var self = this;
  return function(){
    var CustomSettings = epiviz.ui.charts.Visualization.CustomSettings;
    var customSettingsDialog = new epiviz.ui.controls.CustomSettingsDialog(
      'Edit custom settings', {
        ok: function(settingsValues) {
          self.visualization().setCustomSettingsValues(settingsValues);
        },
        cancel: function() {}
      },
      self.visualization().properties().customSettingsDefs,
      self.visualization().customSettingsValues());
    customSettingsDialog.show();
  };
};

/**
 * @returns {*} jQuery button render options
 * @protected
 */
epiviz.ui.charts.decoration.CustomSettingsButton.prototype._renderOptions = function() {
  return {
    icons:{ primary:'ui-icon ui-icon-gear' },
    text:false
  };
};

/**
 * @returns {string}
 * @protected
 */
epiviz.ui.charts.decoration.CustomSettingsButton.prototype._text = function() { return 'Custom settings'; };


/***/ }),
/* 60 */
/***/ (function(module, exports) {

/**
 * Created by Florin Chelaru ( florinc [at] umd [dot] edu )
 * Date: 10/30/2014
 * Time: 12:24 PM
 */

goog.provide('epiviz.ui.charts.decoration.EditCodeButton');

/**
 * @param {epiviz.ui.charts.Visualization} visualization
 * @param {epiviz.ui.charts.decoration.VisualizationDecoration} [otherDecoration]
 * @param {epiviz.Config} [config]
 * @extends {epiviz.ui.charts.decoration.CodeButton}
 * @constructor
 */
epiviz.ui.charts.decoration.EditCodeButton = function(visualization, otherDecoration, config) {
  epiviz.ui.charts.decoration.CodeButton.call(this, visualization, otherDecoration, config);
};

/*
 * Copy methods from upper class
 */
epiviz.ui.charts.decoration.EditCodeButton.prototype = epiviz.utils.mapCopy(epiviz.ui.charts.decoration.CodeButton.prototype);
epiviz.ui.charts.decoration.EditCodeButton.constructor = epiviz.ui.charts.decoration.EditCodeButton;

/**
 * @returns {function(jQuery): epiviz.ui.controls.CodeControl}
 * @private
 */
epiviz.ui.charts.decoration.EditCodeButton.prototype._controlCreator = function() {
  var self = this;
  return function(container) {
    return new epiviz.ui.controls.EditCodeControl(container, 'Edit Code', null, self.visualization(), self.visualization().lastModifiedMethod(), self.visualization().hasModifiedMethods());
  };
};

/**
 * @returns {function(*)}
 * @private
 */
epiviz.ui.charts.decoration.EditCodeButton.prototype._saveHandler = function() {
  var self = this;
  return function(result) {
    if (result.hasModifiedMethods) {
      self.visualization().setModifiedMethods(result.modifiedMethods);
    } else {
      self.visualization().resetModifiedMethods();
    }
  };
};

/**
 * @returns {function()}
 * @private
 */
epiviz.ui.charts.decoration.EditCodeButton.prototype._cancelHandler = function() { return function() {}; };


/***/ }),
/* 61 */
/***/ (function(module, exports) {

/**
 * Created by Florin Chelaru ( florinc [at] umd [dot] edu )
 * Date: 1/10/2015
 * Time: 11:04 AM
 */

goog.provide('epiviz.ui.charts.decoration.HierarchyFilterCodeButton');

/**
 * @param {epiviz.ui.charts.Visualization} visualization
 * @param {epiviz.ui.charts.decoration.VisualizationDecoration} [otherDecoration]
 * @param {epiviz.Config} [config]
 * @extends {epiviz.ui.charts.decoration.CodeButton}
 * @constructor
 */
epiviz.ui.charts.decoration.HierarchyFilterCodeButton = function(visualization, otherDecoration, config) {
  epiviz.ui.charts.decoration.MarkerCodeButton.call(this, visualization, otherDecoration, config);
};

/*
 * Copy methods from upper class
 */
epiviz.ui.charts.decoration.HierarchyFilterCodeButton.prototype = epiviz.utils.mapCopy(epiviz.ui.charts.decoration.MarkerCodeButton.prototype);
epiviz.ui.charts.decoration.HierarchyFilterCodeButton.constructor = epiviz.ui.charts.decoration.HierarchyFilterCodeButton;

/**
 * @returns {epiviz.ui.charts.markers.VisualizationMarker.Type}
 */
epiviz.ui.charts.decoration.HierarchyFilterCodeButton.prototype.markerType = function() { return epiviz.ui.charts.markers.VisualizationMarker.Type.FILTER; };

/**
 * @returns {string}
 */
epiviz.ui.charts.decoration.HierarchyFilterCodeButton.prototype.markerLabel = function() { return 'User Filter' };

/**
 * @returns {string}
 */
epiviz.ui.charts.decoration.HierarchyFilterCodeButton.prototype.markerId = function() { return 'user-filter'; };

/**
 * @returns {string}
 */
epiviz.ui.charts.decoration.HierarchyFilterCodeButton.prototype.preMarkTemplate = function() {
  return '/**\n' +
  ' * This method is called once before every draw, for all data available to the visualization,\n' +
  ' * for initialization. Its result can be used inside the filter method.\n' +
  ' * @param {epiviz.ui.charts.tree.Node} [root]\n' +
  ' * @returns {InitialVars}\n' +
  ' * @template InitialVars\n' +
  ' */\n' +
  'function(root) {\n' +
  '  // TODO: Your code here\n' +
  '  return null;\n' +
  '}\n';
};

/**
 * @returns {string}
 */
epiviz.ui.charts.decoration.HierarchyFilterCodeButton.prototype.markTemplate = function() {
  return '/**\n' +
  ' * This method is called for every data object. If it returns false, the object will not be drawn.\n' +
  ' * @param {epiviz.ui.charts.tree.Node} [node]\n' +
  ' * @param {epiviz.ui.charts.tree.Node} [root]\n' +
  ' * @param {InitialVars} [preMarkResult]\n' +
  ' * @returns {boolean}\n' +
  ' * @template InitialVars\n' +
  ' */\n' +
  'function(node, root, preMarkResult) {\n' +
  '  // TODO: Your code here\n' +
  '  return true;\n' +
  '}\n'
};




/***/ }),
/* 62 */
/***/ (function(module, exports) {

/**
 * Created by Florin Chelaru ( florinc [at] umd [dot] edu )
 * Date: 1/7/2015
 * Time: 2:00 PM
 */

goog.provide('epiviz.ui.charts.decoration.MarkerCodeButton');

/**
 * @param {epiviz.ui.charts.Visualization} visualization
 * @param {epiviz.ui.charts.decoration.VisualizationDecoration} [otherDecoration]
 * @param {epiviz.Config} [config]
 * @extends {epiviz.ui.charts.decoration.CodeButton}
 * @constructor
 */
epiviz.ui.charts.decoration.MarkerCodeButton = function(visualization, otherDecoration, config) {
  epiviz.ui.charts.decoration.CodeButton.call(this, visualization, otherDecoration, config);
};

/*
 * Copy methods from upper class
 */
epiviz.ui.charts.decoration.MarkerCodeButton.prototype = epiviz.utils.mapCopy(epiviz.ui.charts.decoration.CodeButton.prototype);
epiviz.ui.charts.decoration.MarkerCodeButton.constructor = epiviz.ui.charts.decoration.MarkerCodeButton;

/**
 * @returns {function(jQuery): epiviz.ui.controls.CodeControl}
 * @private
 */
epiviz.ui.charts.decoration.MarkerCodeButton.prototype._controlCreator = function() {
  var self = this;
  return function(container) {
    var existingMark = self.visualization().getMarker(self.markerId());
    var preMark, mark;
    if (existingMark) {
      preMark = existingMark.preMarkStr();
      mark = existingMark.markStr();
    }

    preMark = preMark || self.preMarkTemplate();
    mark = mark || self.markTemplate();

    return new epiviz.ui.controls.MarkerCodeControl(container, self.markerLabel(), null, self.visualization(), preMark, mark, existingMark != undefined);
  };
};

/**
 * @returns {function(*)}
 * @private
 */
epiviz.ui.charts.decoration.MarkerCodeButton.prototype._saveHandler = function() {
  var self = this;
  return function(arg) {
    if (arg.enabled) {
      self.visualization().putMarker(self.createMarker(arg.preMark, arg.mark));
    } else {
      self.visualization().removeMarker(self.markerId());
    }
  };
};

/**
 * @returns {function()}
 * @private
 */
epiviz.ui.charts.decoration.MarkerCodeButton.prototype._cancelHandler = function() { return function() {}; };

/**
 * @param {string} [preMark]
 * @param {string} [mark]
 */
epiviz.ui.charts.decoration.MarkerCodeButton.prototype.createMarker = function(preMark, mark) {
  return new epiviz.ui.charts.markers.VisualizationMarker(
    this.markerType(),
    this.markerId(),
    this.markerLabel(),
    preMark,
    mark);
};

/**
 * @returns {epiviz.ui.charts.markers.VisualizationMarker.Type}
 */
epiviz.ui.charts.decoration.MarkerCodeButton.prototype.markerType = function() { throw Error('unimplemented abstract method'); };

/**
 * @returns {string}
 */
epiviz.ui.charts.decoration.MarkerCodeButton.prototype.markerLabel = function() { throw Error('unimplemented abstract method'); };

/**
 * @returns {string}
 */
epiviz.ui.charts.decoration.MarkerCodeButton.prototype.markerId = function() { throw Error('unimplemented abstract method'); };

/**
 * @returns {string}
 */
epiviz.ui.charts.decoration.MarkerCodeButton.prototype.preMarkTemplate = function() { throw Error('unimplemented abstract method'); };

/**
 * @returns {string}
 */
epiviz.ui.charts.decoration.MarkerCodeButton.prototype.markTemplate = function() { throw Error('unimplemented abstract method'); };


/***/ }),
/* 63 */
/***/ (function(module, exports) {

/**
 * Created by Florin Chelaru ( florinc [at] umd [dot] edu )
 * Date: 10/30/2014
 * Time: 12:24 PM
 */

goog.provide('epiviz.ui.charts.decoration.RemoveChartButton');

/**
 * @param {epiviz.ui.charts.Visualization} visualization
 * @param {epiviz.ui.charts.decoration.VisualizationDecoration} [otherDecoration]
 * @extends {epiviz.ui.charts.decoration.ChartOptionButton}
 * @constructor
 */
epiviz.ui.charts.decoration.RemoveChartButton = function(visualization, otherDecoration) {
  epiviz.ui.charts.decoration.ChartOptionButton.call(this, visualization, otherDecoration);
};

/*
 * Copy methods from upper class
 */
epiviz.ui.charts.decoration.RemoveChartButton.prototype = epiviz.utils.mapCopy(epiviz.ui.charts.decoration.ChartOptionButton.prototype);
epiviz.ui.charts.decoration.RemoveChartButton.constructor = epiviz.ui.charts.decoration.RemoveChartButton;

/**
 * @returns {Function}
 * @protected
 */
epiviz.ui.charts.decoration.RemoveChartButton.prototype._click = function() {
  var self = this;
  return function(){
    self.visualization().onRemove().notify(new epiviz.ui.charts.VisEventArgs(self.visualization().id()));
  };
};

/**
 * @returns {*} jQuery button render options
 * @protected
 */
epiviz.ui.charts.decoration.RemoveChartButton.prototype._renderOptions = function() {
  return {
    icons:{ primary:'ui-icon ui-icon-cancel' },
    text:false
  };
};

/**
 * @returns {string}
 * @protected
 */
epiviz.ui.charts.decoration.RemoveChartButton.prototype._text = function() { return 'Remove'; };


/***/ }),
/* 64 */
/***/ (function(module, exports) {

/**
 * Created by Florin Chelaru ( florinc [at] umd [dot] edu )
 * Date: 10/30/2014
 * Time: 12:24 PM
 */

goog.provide('epiviz.ui.charts.decoration.SaveChartButton');

/**
 * @param {epiviz.ui.charts.Visualization} visualization
 * @param {epiviz.ui.charts.decoration.VisualizationDecoration} [otherDecoration]
 * @extends {epiviz.ui.charts.decoration.ChartOptionButton}
 * @constructor
 */
epiviz.ui.charts.decoration.SaveChartButton = function(visualization, otherDecoration) {
  epiviz.ui.charts.decoration.ChartOptionButton.call(this, visualization, otherDecoration);
};

/*
 * Copy methods from upper class
 */
epiviz.ui.charts.decoration.SaveChartButton.prototype = epiviz.utils.mapCopy(epiviz.ui.charts.decoration.ChartOptionButton.prototype);
epiviz.ui.charts.decoration.SaveChartButton.constructor = epiviz.ui.charts.decoration.SaveChartButton;

/**
 * @returns {Function}
 * @protected
 */
epiviz.ui.charts.decoration.SaveChartButton.prototype._click = function() {
  var self = this;
  return function(){
    self.visualization().onSave().notify(new epiviz.ui.charts.VisEventArgs(self.visualization().id()));
  };
};

/**
 * @returns {*} jQuery button render options
 * @protected
 */
epiviz.ui.charts.decoration.SaveChartButton.prototype._renderOptions = function() {
  return {
    icons:{ primary:'ui-icon ui-icon-disk' },
    text:false
  };
};

/**
 * @returns {string}
 * @protected
 */
epiviz.ui.charts.decoration.SaveChartButton.prototype._text = function() { return 'Save'; };


/***/ }),
/* 65 */
/***/ (function(module, exports) {

/**
 * Created by Florin Chelaru ( florinc [at] umd [dot] edu )
 * Date: 10/30/2014
 * Time: 12:24 PM
 */

goog.provide('epiviz.ui.charts.decoration.ToggleTooltipButton');

/**
 * @param {epiviz.ui.charts.Visualization} visualization
 * @param {epiviz.ui.charts.decoration.VisualizationDecoration} [otherDecoration]
 * @extends {epiviz.ui.charts.decoration.VisualizationDecoration}
 * @constructor
 */
epiviz.ui.charts.decoration.ToggleTooltipButton = function(visualization, otherDecoration) {
  epiviz.ui.charts.decoration.VisualizationDecoration.call(this, visualization, otherDecoration);

  /**
   * @type {boolean}
   * @const
   */
  this.isChartOptionButton = true;

  /**
   * @type {boolean}
   * @private
   */
  this._checked = false;
};

/*
 * Copy methods from upper class
 */
epiviz.ui.charts.decoration.ToggleTooltipButton.prototype = epiviz.utils.mapCopy(epiviz.ui.charts.decoration.VisualizationDecoration.prototype);
epiviz.ui.charts.decoration.ToggleTooltipButton.constructor = epiviz.ui.charts.decoration.ToggleTooltipButton;

/**
 */
epiviz.ui.charts.decoration.ToggleTooltipButton.prototype.decorate = function() {
  epiviz.ui.charts.decoration.VisualizationDecoration.prototype.decorate.call(this);

  var buttonIndex = 0;
  for (var decoration = this.otherDecoration(); decoration; decoration = decoration.otherDecoration()) {
    if (decoration.isChartOptionButton) { ++buttonIndex; }
  }

  var self = this;
  var tooltipButtonId = sprintf('%s-tooltip-button', this.visualization().id());
  this.visualization().container().append(sprintf(
    '<div id="%1$s-container" style="position: absolute; top: 5px; right: %2$spx">' +
    '<input type="checkbox" id="%1$s" %3$s />' +
    '<label for="%1$s" >Toggle tooltip</label>' +
    '</div>', tooltipButtonId, 5 + buttonIndex * 30, this._checked ? 'checked="checked"' : ''));
  var button = $('#' + tooltipButtonId);
  var tooltipButtonContainer = $('#' + tooltipButtonId + '-container');
  button.button({
    text: false,
    icons: {
      primary: 'ui-icon-comment'
    }
  }).click(function() {
    self._checked = button.is(':checked');
  });

  this.visualization().container()
    .mousemove(function () { tooltipButtonContainer.show(); })
    .mouseleave(function () { tooltipButtonContainer.hide(); });
};

/**
 * @returns {boolean}
 */
epiviz.ui.charts.decoration.ToggleTooltipButton.prototype.checked = function() { return this._checked; };


/***/ }),
/* 66 */
/***/ (function(module, exports) {

/**
 * Created by Florin Chelaru ( florinc [at] umd [dot] edu )
 * Date: 10/30/2014
 * Time: 12:11 PM
 */

goog.provide('epiviz.ui.charts.decoration.VisualizationDecoration');

/**
 * @param {epiviz.ui.charts.Visualization} visualization
 * @param {epiviz.ui.charts.decoration.VisualizationDecoration} [otherDecoration]
 * @param {epiviz.Config} [config]
 * @constructor
 */
epiviz.ui.charts.decoration.VisualizationDecoration = function(visualization, otherDecoration, config) {
  /**
   * @type {epiviz.ui.charts.Visualization}
   * @private
   */
  this._visualization = visualization;

  /**
   * @type {epiviz.ui.charts.decoration.VisualizationDecoration}
   * @private
   */
  this._otherDecoration = otherDecoration;

  /**
   * @type {epiviz.Config}
   * @private
   */
  this._config = config;
};

/**
 */
epiviz.ui.charts.decoration.VisualizationDecoration.prototype.decorate = function() {
  if (this._otherDecoration) { this._otherDecoration.decorate(); }
};

/**
 * @returns {epiviz.ui.charts.Visualization}
 */
epiviz.ui.charts.decoration.VisualizationDecoration.prototype.visualization = function() { return this._visualization; };

/**
 * @returns {epiviz.ui.charts.decoration.VisualizationDecoration}
 */
epiviz.ui.charts.decoration.VisualizationDecoration.prototype.otherDecoration = function() { return this._otherDecoration; };

/**
 * @returns {epiviz.Config}
 */
epiviz.ui.charts.decoration.VisualizationDecoration.prototype.config = function() { return this._config; };


/***/ }),
/* 67 */
/***/ (function(module, exports) {

/**
 * Created by Florin Chelaru ( florinc [at] umd [dot] edu )
 * Date: 12/3/2014
 * Time: 9:27 AM
 */

goog.provide('epiviz.ui.charts.DisplayType');

/**
 * TODO: Maybe at some point, switch to this
 * @enum {{name: string, subtypes: epiviz.ui.charts.DisplayType}}
 */
epiviz.ui.charts.DisplayType = {
  MEASUREMENT_VIS: {
    name: 'measurement-vis',
    PLOT: {
      name: 'plot'
    },
    TRACK: {
      name: 'track'
    }
  },
  DATA_STRUCTURE: {
    name: 'data-structure',
    HIERARCHY: {
      name: 'hierarchy'
    }
  }
};

/**
 * @param subtype
 * @param type
 */
epiviz.ui.charts.DisplayType.is = function(subtype, type) {
  var recurseIs = function(subtype, type) {
    if (subtype.name == type.name) { return true; }
    for (var childType in type) {
      if (!type.hasOwnProperty(childType) || childType == 'name') { continue; }
      if (recurseIs(subtype, type[childType])) { return true; }
    }
    return false;
  };
  return recurseIs(subtype, type);
};


/***/ }),
/* 68 */
/***/ (function(module, exports) {

/**
 * Created by Florin Chelaru ( florinc [at] umd [dot] edu )
 * Date: 10/22/13
 * Time: 8:34 PM
 */

goog.provide('epiviz.ui.charts.Margins');

/**
 * @param {number} top
 * @param {number} left
 * @param {number} bottom
 * @param {number} right
 * @constructor
 */
epiviz.ui.charts.Margins = function(top, left, bottom, right) {
  /**
   * @type {number}
   * @private
   */
  this._top = top;

  /**
   * @type {number}
   * @private
   */
  this._left = left;

  /**
   * @type {number}
   * @private
   */
  this._bottom = bottom;

  /**
   * @type {number}
   * @private
   */
  this._right = right;
};

/**
 * @type {epiviz.ui.charts.Margins}
 * @const
 */
epiviz.ui.charts.Margins.ZERO_MARGIN = new epiviz.ui.charts.Margins(0, 0, 0, 0);

/**
 * @returns {number}
 */
epiviz.ui.charts.Margins.prototype.top = function() { return this._top; };

/**
 * @returns {number}
 */
epiviz.ui.charts.Margins.prototype.left = function() { return this._left; };

/**
 * @returns {number}
 */
epiviz.ui.charts.Margins.prototype.bottom = function() { return this._bottom; };

/**
 * @returns {number}
 */
epiviz.ui.charts.Margins.prototype.right = function() { return this._right; };

/**
 * @param {epiviz.ui.charts.Axis} axis
 * @returns {number}
 */
epiviz.ui.charts.Margins.prototype.sumAxis = function(axis) {
  switch (axis) {
    case epiviz.ui.charts.Axis.X: return this._left + this._right;
    case epiviz.ui.charts.Axis.Y: return this._top + this._bottom;
    default: throw Error('Invalid argument: ' + axis);
  }
};

/**
 * @returns {{top: number, left: number, bottom: number, right: number}}
 */
epiviz.ui.charts.Margins.prototype.raw = function() {
  return {
    top: this._top,
    left: this._left,
    bottom: this._bottom,
    right: this._right
  };
};

/**
 * @param {{top: number, left: number, bottom: number, right: number}} o
 * @returns {epiviz.ui.charts.Margins}
 */
epiviz.ui.charts.Margins.fromRawObject = function(o) {
  return new epiviz.ui.charts.Margins(o.top, o.left, o.bottom, o.right);
};

/**
 * @returns {epiviz.ui.charts.Margins}
 */
epiviz.ui.charts.Margins.prototype.copy = function() {
  return new epiviz.ui.charts.Margins(this._top, this._left, this._bottom, this._right);
};

/**
 * @param {epiviz.ui.charts.Margins} other
 * @returns {boolean}
 */
epiviz.ui.charts.Margins.prototype.equals = function(other) {
  if (!other) { return false; }
  if (this == other) { return true; }
  return (this._top == other._top && this._left == other._left && this._bottom == other._bottom && this._right == other._right);
};


/***/ }),
/* 69 */
/***/ (function(module, exports) {

/**
 * Created by Florin Chelaru ( florinc [at] umd [dot] edu )
 * Date: 1/16/2015
 * Time: 6:58 PM
 */

goog.provide('epiviz.ui.charts.markers.MeasurementAggregator');

/**
 * @param {string} [id]
 * @param {function(string, Array.<epiviz.measurements.Measurement>, Array.<number>): {value: number, errMinus: number=, errPlus: number=}} aggregator
 * @constructor
 */
epiviz.ui.charts.markers.MeasurementAggregator = function(id, aggregator) {
  /**
   * @type {string}
   * @private
   */
  this._id = id;

  /**
   * @type {function(string, Array.<epiviz.measurements.Measurement>, Array.<number>): {value: number, errMinus?: number, errPlus?: number}}
   * @private
   */
  this._aggregator = aggregator;
};

/**
 * @param {string} label
 * @param {Array.<epiviz.measurements.Measurement>} measurements
 * @param {Array.<number>} values
 * @returns {{value: number, errMinus?: number, errPlus?: number}}
 */
epiviz.ui.charts.markers.MeasurementAggregator.prototype.aggregate = function(label, measurements, values) {
  return this._aggregator(label, measurements, values);
};

/**
 * @returns {string}
 */
epiviz.ui.charts.markers.MeasurementAggregator.prototype.id = function() { return this._id; };

/**
 * @type{Object.<string, epiviz.ui.charts.markers.MeasurementAggregator>}
 */
epiviz.ui.charts.markers.MeasurementAggregators = {
  'mean-stdev': new epiviz.ui.charts.markers.MeasurementAggregator('mean-stdev', function(label, measurements, values) {
    if (!values || values.length == 0) { return null; }
    var mean = values.reduce(function(v1, v2) { return v1 + v2; }) / values.length;
    var variance = values
        .map(function(v) { return (v - mean) * (v - mean); })
        .reduce(function(v1, v2) { return v1 + v2; }) / values.length;
    var stdev = Math.sqrt(variance);
    return { value: mean, errMinus: mean - stdev, errPlus: mean + stdev };
  }),

  'quartiles': new epiviz.ui.charts.markers.MeasurementAggregator('quartiles', function(label, measurements, values) {
    if (!values || values.length == 0) { return null; }
    values = values.slice(0).sort(function(v1, v2) { return v1 - v2; });
    var n = values.length;
    var m1 = Math.floor(n * 0.5);
    var m2 = Math.ceil(n * 0.5);
    var q2 = (values[Math.floor((n - 1) * 0.5)] + values[m1]) * 0.5;
    var q1 = (values[Math.floor((m1 - 1) * 0.5)] + values[Math.floor(m1 * 0.5)]) * 0.5;
    var q3 = (values[m2 + Math.floor((n - m2 - 1) * 0.5)] + values[m2 + Math.floor((n - m2) * 0.5)]) * 0.5;

    return { value: q2, errMinus: q1, errPlus: q3 };
  }),

  'count': new epiviz.ui.charts.markers.MeasurementAggregator('count', function(label, measurements, values) {
    if (!values || values.length == 0) { return 0; }
    return { value: values.length };
  }),

  'min': new epiviz.ui.charts.markers.MeasurementAggregator('min', function(label, measurements, values) {
    if (!values || values.length == 0) { return null; }
    return { value: Math.min.apply(undefined, values) };
  }),

  'max': new epiviz.ui.charts.markers.MeasurementAggregator('max', function(label, measurements, values) {
    if (!values || values.length == 0) { return null; }
    return { value: Math.max.apply(undefined, values) };
  }),

  'sum': new epiviz.ui.charts.markers.MeasurementAggregator('sum', function(label, measurements, values) {
    if (!values || values.length == 0) { return null; }
    return { value: values.reduce(function(v1, v2) { return v1 + v2; }) };
  })
};


/***/ }),
/* 70 */
/***/ (function(module, exports) {

/**
 * Created by Florin Chelaru ( florinc [at] umd [dot] edu )
 * Date: 1/10/2015
 * Time: 10:19 AM
 */

goog.provide('epiviz.ui.charts.markers.VisualizationMarker');

/**
 * @param {epiviz.ui.charts.markers.VisualizationMarker.Type} type
 * @param {string} [id]
 * @param {string} [name]
 * @param {string} [preMark]
 * @param {string} [mark]
 * @constructor
 * @template Data, InitialVars, Item, MarkResult
 */
epiviz.ui.charts.markers.VisualizationMarker = function(type, id, name, preMark, mark) {

  /**
   * @type {epiviz.ui.charts.markers.VisualizationMarker.Type}
   * @private
   */
  this._type = type;

  /**
   * @type {string}
   * @protected
   */
  this._id = id || epiviz.utils.generatePseudoGUID(6);

  /**
   * @type {string}
   * @protected
   */
  this._name = name || 'Custom Marker ' + this._id;

  /**
   * @type {string}
   * @private
   */
  this._preMarkStr = preMark || '';

  /**
   * @type {string}
   * @private
   */
  this._markStr = mark || '';

  var deferredPreMark = new epiviz.deferred.Deferred();
  var cajoledPreMark = null;
  epiviz.caja.cajole(this._preMarkStr).done(function(preMarkFunc) {
    cajoledPreMark = preMarkFunc;
    deferredPreMark.resolve();
  });

  /**
   * @type {function(Data): epiviz.deferred.Deferred.<InitialVars>}
   * @private
   */
  this._preMark = function(data) {
    var d = new epiviz.deferred.Deferred();
    deferredPreMark.done(function(){
      var initialVars = cajoledPreMark(data);
      d.resolve(initialVars);
    });
    return d;
  };

  var deferredMark = new epiviz.deferred.Deferred();
  var cajoledMark = null;
  epiviz.caja.cajole(this._markStr).done(function(markFunc) {
    cajoledMark = markFunc;
    deferredMark.resolve();
  });

  /**
   * @type {function(Item, Data, InitialVars): epiviz.deferred.Deferred.<MarkResult>}
   * @private
   */
  this._mark = function(item, data, preMarkResult) {
    var d = new epiviz.deferred.Deferred();
    deferredMark.done(function() {
      var markResult = cajoledMark(item, data, preMarkResult);
      d.resolve(markResult);
    });
    return d;
  };
};

/**
 * @returns {epiviz.ui.charts.markers.VisualizationMarker.Type}
 */
epiviz.ui.charts.markers.VisualizationMarker.prototype.type = function() { return this._type; };

/**
 * @returns {string}
 */
epiviz.ui.charts.markers.VisualizationMarker.prototype.id = function() { return this._id; };

/**
 * @returns {string}
 */
epiviz.ui.charts.markers.VisualizationMarker.prototype.name = function() { return this._name; };

/**
 * @returns {function(Data, function(InitialVars))}
 */
epiviz.ui.charts.markers.VisualizationMarker.prototype.preMark = function() { return this._preMark; };

/**
 * @returns {function(Item, Data, InitialVars, function(MarkResult))}
 */
epiviz.ui.charts.markers.VisualizationMarker.prototype.mark = function() { return this._mark; };

/**
 * @returns {string}
 */
epiviz.ui.charts.markers.VisualizationMarker.prototype.preMarkStr = function() { return this._preMarkStr; };

/**
 * @returns {string}
 */
epiviz.ui.charts.markers.VisualizationMarker.prototype.markStr = function() { return this._markStr; };

/**
 * @enum {string}
 */
epiviz.ui.charts.markers.VisualizationMarker.Type = {
  FILTER: 'filter',
  COLOR_BY_ROW: 'colorByRow',
  ORDER_BY_MEASUREMENTS: 'orderByMeasurements',
  COLOR_BY_MEASUREMENTS: 'colorByMeasurements',
  GROUP_BY_MEASUREMENTS: 'groupByMeasurements'
};

/**
 * @returns {{type: string, id: string, name: string, preMark: string, mark: string}}
 */
epiviz.ui.charts.markers.VisualizationMarker.prototype.raw = function() {
  return {
    type: this._type,
    id: this._id,
    name: this._name,
    preMark: this._preMarkStr,
    mark: this._markStr
  };
};

/**
 * @param {{type: string, id: string, name: string, preMark: string, mark: string}} o
 * @returns {epiviz.ui.charts.markers.VisualizationMarker}
 */
epiviz.ui.charts.markers.VisualizationMarker.fromRawObject = function(o) {
  return new epiviz.ui.charts.markers.VisualizationMarker(o.type, o.id, o.name, o.preMark, o.mark);
};


/***/ }),
/* 71 */
/***/ (function(module, exports) {

/**
 * Created by Florin Chelaru ( florinc [at] umd [dot] edu )
 * Date: 10/28/13
 * Time: 10:26 AM
 */

goog.provide('epiviz.ui.charts.PlotType');

/**
 * @param {epiviz.Config} config
 * @extends {epiviz.ui.charts.ChartType}
 * @constructor
 */
epiviz.ui.charts.PlotType = function(config) {
  // Call superclass constructor
  epiviz.ui.charts.ChartType.call(this, config);
};

/*
 * Copy methods from upper class
 */
epiviz.ui.charts.PlotType.prototype = epiviz.utils.mapCopy(epiviz.ui.charts.ChartType.prototype);
epiviz.ui.charts.PlotType.constructor = epiviz.ui.charts.PlotType;

/**
 * @returns {epiviz.ui.charts.VisualizationType.DisplayType}
 */
epiviz.ui.charts.PlotType.prototype.chartDisplayType = function() { return epiviz.ui.charts.VisualizationType.DisplayType.PLOT; };

/**
 * @returns {string}
 */
epiviz.ui.charts.PlotType.prototype.cssClass = function() {
  return 'plot-container ui-widget-content';
};


/***/ }),
/* 72 */
/***/ (function(module, exports) {

/**
 * Created by Florin Chelaru ( florinc [at] umd [dot] edu )
 * Date: 10/28/13
 * Time: 10:25 AM
 */

goog.provide('epiviz.ui.charts.Plot');

/**
 * @param {string} id
 * @param {jQuery} container The div where the chart will be drawn
 * @param {epiviz.ui.charts.VisualizationProperties} properties
 * @extends {epiviz.ui.charts.Chart}
 * @constructor
 */
epiviz.ui.charts.Plot = function(id, container, properties) {
  // Call superclass constructor
  epiviz.ui.charts.Chart.call(this, id, container, properties);
};

/*
 * Copy methods from upper class
 */
epiviz.ui.charts.Plot.prototype = epiviz.utils.mapCopy(epiviz.ui.charts.Chart.prototype);
epiviz.ui.charts.Plot.constructor = epiviz.ui.charts.Plot;

/**
 * @returns {epiviz.ui.charts.VisualizationType.DisplayType}
 */
epiviz.ui.charts.Plot.prototype.displayType = function() { return epiviz.ui.charts.VisualizationType.DisplayType.PLOT; };


/***/ }),
/* 73 */
/***/ (function(module, exports) {

/**
 * Created by Florin Chelaru ( florinc [at] umd [dot] edu )
 * Date: 10/22/13
 * Time: 6:49 PM
 */

goog.provide('epiviz.ui.charts.TrackType');

/**
 * @param {epiviz.Config} config
 * @extends {epiviz.ui.charts.ChartType}
 * @constructor
 */
epiviz.ui.charts.TrackType = function(config) {
  // Call superclass constructor
  epiviz.ui.charts.ChartType.call(this, config);
};

/*
 * Copy methods from upper class
 */
epiviz.ui.charts.TrackType.prototype = epiviz.utils.mapCopy(epiviz.ui.charts.ChartType.prototype);
epiviz.ui.charts.TrackType.constructor = epiviz.ui.charts.TrackType;

/**
 * @returns {epiviz.ui.charts.VisualizationType.DisplayType}
 */
epiviz.ui.charts.TrackType.prototype.chartDisplayType = function() { return epiviz.ui.charts.VisualizationType.DisplayType.TRACK; };

/**
 * @returns {string}
 */
epiviz.ui.charts.TrackType.prototype.cssClass = function() {
  return 'track-container ui-widget-content';
};


/***/ }),
/* 74 */
/***/ (function(module, exports) {

/**
 * Created by Florin Chelaru ( florinc [at] umd [dot] edu )
 * Date: 10/22/13
 * Time: 6:47 PM
 */

goog.provide('epiviz.ui.charts.Track');

/**
 * @param {string} id
 * @param {jQuery} container The div where the chart will be drawn
 * @param {epiviz.ui.charts.VisualizationProperties} properties
 * @extends {epiviz.ui.charts.Chart}
 * @constructor
 */
epiviz.ui.charts.Track = function(id, container, properties) {
    // Call superclass constructor
    epiviz.ui.charts.Chart.call(this, id, container, properties);

    /**
     * D3 rectangle in the SVG
     * @type {*}
     * @protected
     */
    this._background = null;

    /**
     * D3 group in the SVG used for adding hover/selection elements
     * @type {*}
     * @protected
     */
    this._highlightGroup = null;
};

/*
 * Copy methods from upper class
 */
epiviz.ui.charts.Track.prototype = epiviz.utils.mapCopy(epiviz.ui.charts.Chart.prototype);
epiviz.ui.charts.Track.constructor = epiviz.ui.charts.Track;


/**
 * Initializes the chart and draws the initial SVG in the container
 * @protected
 */
epiviz.ui.charts.Track.prototype._initialize = function() {
    // this._properties.width = '100%';

    epiviz.ui.charts.Chart.prototype._initialize.call(this);

    var self = this;

    this._highlightGroup = this._svg
        .append('g')
        .attr('class', 'track-highlight');

    this._background = this._svg
        .append('rect')
        .attr('class', 'chart-background')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', '100%')
        .attr('height', '100%')
        .attr('fill', '#ffffff')
        .attr('fill-opacity', '0');

    this._background
        .on('mouseover', function() { self._captureMouseHover(); })
        .on('mousemove', function() { self._captureMouseHover(); })
        .on('mouseout', function() {
            self._unhover.notify(new epiviz.ui.charts.VisEventArgs(self.id()));
            self._dispatch.hover(self.id(), null);
        });
};

/**
 * @param {epiviz.datatypes.GenomicRange} [range]
 * @param {epiviz.datatypes.GenomicData} [data]
 * @param {number} [slide]
 * @param {number} [zoom]
 * @returns {Array.<epiviz.ui.charts.ChartObject>} The objects drawn
 */
epiviz.ui.charts.Track.prototype.draw = function(range, data, slide, zoom) {
    var result = epiviz.ui.charts.Chart.prototype.draw.call(this, range, data);

    this._drawLegend();

    return result;
};

/**
 * @returns {epiviz.ui.charts.VisualizationType.DisplayType}
 */
epiviz.ui.charts.Track.prototype.displayType = function() {
    return epiviz.ui.charts.VisualizationType.DisplayType.TRACK;
};

/**
 * @param {epiviz.ui.charts.ChartObject} selectedObject
 */
epiviz.ui.charts.Track.prototype.doHover = function(selectedObject) {
    epiviz.ui.charts.Chart.prototype.doHover.call(this, selectedObject);

    if (selectedObject.start == undefined || selectedObject.end == undefined) {
        return;
    }

    if (!this._lastRange) {
        return;
    }

    this._highlightGroup.selectAll('rect').remove();
    this._highlightGroup.attr('transform', 'translate(' + this.margins().left() + ', ' + 0 + ')');

    var Axis = epiviz.ui.charts.Axis;
    var xScale = d3.scale.linear()
        .domain([this._lastRange.start(), this._lastRange.end()])
        .range([0, this.width() - this.margins().sumAxis(Axis.X)]);

    var items = [];
    if (!selectedObject.measurements || !selectedObject.measurements.length) {
        items.push({ start: selectedObject.start, end: selectedObject.end });
    } else {
        for (var i = 0; i < selectedObject.valueItems[0].length; ++i) {
            var rowItem = selectedObject.valueItems[0][i].rowItem;
            items.push({ start: rowItem.start(), end: rowItem.end() });
        }
    }

    var minHighlightSize = 5;
    this._highlightGroup.selectAll('rect').data(items, function(d) {
            return sprintf('%s-%s', d.start, d.end);
        })
        .enter()
        .append('rect')
        .style('fill', this.colors().get(0))
        .style('fill-opacity', '0.1')
        .attr('x', function(d) {
            var defaultWidth = xScale(d.end + 1) - xScale(d.start);
            var width = Math.max(minHighlightSize, defaultWidth);
            return xScale(d.start) + defaultWidth * 0.5 - width * 0.5;
        })
        .attr('width', function(d) {
            return Math.max(minHighlightSize, xScale(d.end + 1) - xScale(d.start));
        })
        .attr('y', 0)
        .attr('height', this.height());
};

/**
 */
epiviz.ui.charts.Track.prototype.doUnhover = function() {
    epiviz.ui.charts.Chart.prototype.doUnhover.call(this);

    this._highlightGroup.selectAll('rect').remove();
};

/**
 * @protected
 */
epiviz.ui.charts.Track.prototype._captureMouseHover = function() {
    if (!this._lastRange) {
        return;
    }
    this._unhover.notify(new epiviz.ui.charts.VisEventArgs(this.id()));
    var inverseXScale = d3.scale.linear()
        .domain([0, this.width()])
        .range([this._lastRange.start(), this._lastRange.end()]);
    var start = inverseXScale(d3.mouse(this._background[0][0])[0]) - this._binSize / 2;
    var end = start + this._binSize;

    var selectedObject = new epiviz.ui.charts.ChartObject(sprintf('%s-highlight', this.id()), start, end);
    this._hover.notify(new epiviz.ui.charts.VisEventArgs(this.id(), selectedObject));

    this._dispatch.hover(this.id(), selectedObject);
};

/**
 * @private
 */
epiviz.ui.charts.Track.prototype._drawLegend = function() {
    var self = this;
    this._svg.selectAll('.chart-title').remove();
    this._svg.selectAll('.chart-title-color ').remove();

    if (!this._lastData || !this._lastData.isReady()) {
        return;
    }

    var title = '';
    var measurements = this._lastData.measurements();

    var titleEntries = this._svg
        .selectAll('.chart-title')
        .data(measurements)
        .enter()
        .append('text')
        .attr('class', 'chart-title')
        .attr('font-weight', 'bold')
        .attr('fill', function(m, i) {
            if (!self._measurementColorLabels) {
                return self.colors().get(i);
            }
            return self.colors().getByKey(self._measurementColorLabels.get(m));
        })
        .attr('y', self.margins().top() - 5)
        .text(function(m, i) {
            return m.name();
        });

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
        .data(measurements)
        .enter()
        .append('circle')
        .attr('class', 'chart-title-color')
        .attr('cx', function(column, i) {
            return self.margins().left() + 4 + titleEntriesStartPosition[i];
        })
        .attr('cy', self.margins().top() - 9)
        .attr('r', 4)
        .style('shape-rendering', 'auto')
        .style('stroke-width', '0')
        .style('fill', function(m, i) {
            if (!self._measurementColorLabels) {
                return self.colors().get(i);
            }
            return self.colors().getByKey(self._measurementColorLabels.get(m));
        });
};

/***/ }),
/* 75 */
/***/ (function(module, exports) {

/**
 * Created by Florin Chelaru ( florinc [at] umd [dot] edu )
 * Date: 12/2/2014
 * Time: 7:13 PM
 */

goog.provide('epiviz.ui.charts.tree.HierarchyVisualizationType');

/**
 * @param {epiviz.Config} config
 * @extends {epiviz.ui.charts.DataStructureVisualizationType}
 * @constructor
 */
epiviz.ui.charts.tree.HierarchyVisualizationType = function(config) {
  // Call superclass constructor
  epiviz.ui.charts.DataStructureVisualizationType.call(this, config);
};

/*
 * Copy methods from upper class
 */
epiviz.ui.charts.tree.HierarchyVisualizationType.prototype = epiviz.utils.mapCopy(epiviz.ui.charts.DataStructureVisualizationType.prototype);
epiviz.ui.charts.tree.HierarchyVisualizationType.constructor = epiviz.ui.charts.tree.HierarchyVisualizationType;


/***/ }),
/* 76 */
/***/ (function(module, exports) {

/**
 * Created by Florin Chelaru ( florinc [at] umd [dot] edu )
 * Date: 12/2/2014
 * Time: 7:13 PM
 */


goog.provide('epiviz.ui.charts.tree.HierarchyVisualization');

/**
 * @param {string} id
 * @param {jQuery} container The div where the chart will be drawn
 * @param {epiviz.ui.charts.VisualizationProperties} properties
 * @extends {epiviz.ui.charts.DataStructureVisualization.<epiviz.ui.charts.tree.Node>}
 * @constructor
 */
epiviz.ui.charts.tree.HierarchyVisualization = function(id, container, properties) {
  // Call superclass constructor
  epiviz.ui.charts.DataStructureVisualization.call(this, id, container, properties);

  // Selection

  /**
   * @type {Object.<string, epiviz.ui.charts.tree.NodeSelectionType>}
   * @private
   */
  this._selectedNodes = {};

  /**
   * @type {Object.<number, number>}
   * @private
   */
  this._selectedLevels = {};

  /**
   * @type {Object.<string, number>}
   * @private
   */
  this._nodesOrder = {};

  /**
   * @type {boolean}
   * @private
   */
  this._selectMode = false;

  // Animation

  var self = this;
  /**
   * A D3 function used to partition a tree
   * @private
   */
  this._partition = d3.layout.partition()
    .value(
    /**
     * @param {epiviz.ui.charts.tree.Node} d
     * @returns {number}
     */
      // function(d) { return d.nleaves; }) // If we want the size of the nodes to reflect the number of leaves under them
      function(d) { return 1; }) // If we want the size of the nodes to reflect only the number of leaves in the current subtree
    //.sort(function() { return 0; }); // No reordering of the nodes
    .sort(function(d1, d2) { return (self._calcNodeOrder(d1) || 0) - (self._calcNodeOrder(d2) || 0); }); // Take predefined order into account

  /**
   * @type {Array.<epiviz.ui.charts.tree.UiNode>}
   * @private
   */
  this._uiData = null;

  /**
   * @type {number}
   * @private
   */
  this._oldSubtreeDepth = null;

  /**
   * @type {number}
   * @private
   */
  this._subtreeDepth = null;

  /**
   * @type {number}
   * @private
   */
  this._oldRootDepth = null;

  /**
   * @type {number}
   * @private
   */
  this._rootDepth = null;

  /**
   * @type {Object.<string, epiviz.ui.charts.tree.UiNode>}
   * @private
   */
  this._oldUiDataMap = null;

  /**
   * @type {Object.<string, epiviz.ui.charts.tree.UiNode>}
   * @protected
   */
  this._uiDataMap = {};

  /**
   * @type {epiviz.ui.charts.tree.UiNode}
   * @private
   */
  this._referenceNode = null;

  /**
   * @type {epiviz.ui.charts.tree.UiNode}
   * @private
   */
  this._selectedNode = null;

  /**
   * @type {Array.<string>}
   * @private
   */
  this._levelsTaxonomy = null;
};

/**
 * @type {Object.<epiviz.ui.charts.tree.NodeSelectionType, string>}
 * @const
 */
epiviz.ui.charts.tree.HierarchyVisualization.SELECTION_CLASSES = {
  0: 'none-select',
  1: 'leaves-select',
  2: 'node-select'
};

/*
 * Copy methods from upper class
 */
epiviz.ui.charts.tree.HierarchyVisualization.prototype = epiviz.utils.mapCopy(epiviz.ui.charts.DataStructureVisualization.prototype);
epiviz.ui.charts.tree.HierarchyVisualization.constructor = epiviz.ui.charts.tree.HierarchyVisualization;

/**
 * @param {epiviz.datatypes.Range} [range]
 * @param {epiviz.ui.charts.tree.Node} [root]
 * @returns {Array.<epiviz.ui.charts.VisObject>}
 */
epiviz.ui.charts.tree.HierarchyVisualization.prototype.draw = function(range, root) {
  epiviz.ui.charts.DataStructureVisualization.prototype.draw.call(this, range, root);

  var self = this;

  // If data is defined, then the base class sets this._lastData to data.
  // If it isn't, then we'll use the data from the last draw call
  root = this._lastData;
  range = this._lastRange;
  if (root) {
    this._oldRootDepth = this._rootDepth;
    this._rootDepth = root.depth;
    this._referenceNode = null;
    var uiSelected = root.children && root.children.length ? this._uiDataMap[root.children[0].id] : null;
    this._selectedNode = uiSelected ?
      new epiviz.ui.charts.tree.UiNode(uiSelected.id, uiSelected.name, uiSelected.children, uiSelected.parentId, uiSelected.size,
        uiSelected.depth, uiSelected.nchildren, uiSelected.nleaves, uiSelected.selectionType, uiSelected.order, uiSelected.globalDepth, uiSelected.taxonomy, uiSelected.x, uiSelected.dx, uiSelected.y, uiSelected.dy, uiSelected.parent) : null;

    this._oldSubtreeDepth = this._subtreeDepth;
    this._subtreeDepth = 0;
    this._oldUiDataMap = this._uiDataMap;
    this._uiDataMap = {};

    var uiData = this._partition.nodes(root);
    this._uiData = [];
    var rootCopy = null;
    uiData.every(function(node) {
      if (node.id == root.id) {
        rootCopy = epiviz.ui.charts.tree.UiNode.deepCopy(node);
        return false; // break
      }
      return true;
    });
    var levelsTaxonomy = {};
    epiviz.ui.charts.tree.Node.dfs(rootCopy, function(node) {
      self._uiData.push(node);
      if (!(node.taxonomy in levelsTaxonomy)) { levelsTaxonomy[node.taxonomy] = node.taxonomy; }
    });
    this._levelsTaxonomy = Object.keys(levelsTaxonomy);

    this._uiData.forEach(function(node) {
      self._uiDataMap[node.id] = node;
      if ((!self._referenceNode || self._referenceNode.x == undefined || self._referenceNode.depth < node.depth) && (node.id in self._oldUiDataMap)) {
        self._referenceNode = node;
      }
      if (self._subtreeDepth < node.depth + 1) {
        self._subtreeDepth = node.depth + 1;
      }
    });
    if (!this._selectedNode) { this._selectedNode = root.children && root.children.length ? this._uiDataMap[root.children[0].id] : this._uiDataMap[root.id]; }
    if (!this._referenceNode) { this._referenceNode = this._uiData[0]; }
    if (this._oldSubtreeDepth == null) { this._oldSubtreeDepth = this._subtreeDepth; }
    if (this._oldRootDepth == null) { this._oldRootDepth = this._rootDepth; }
  }

  this._drawLegend();

  return this._uiData;
};

/**
 * @param {epiviz.ui.charts.tree.UiNode} node
 * @protected
 */
epiviz.ui.charts.tree.HierarchyVisualization.prototype._calcNodeOrder = function(node) {
  if (node.id in this._nodesOrder) { return this._nodesOrder[node.id]; }
  if (node.id in this._uiDataMap) { return this._uiDataMap[node.id].order; }
  return node.order;
};

/**
 * @param {epiviz.ui.charts.tree.UiNode} node
 * @returns {epiviz.ui.charts.tree.UiNode}
 * @protected
 */
epiviz.ui.charts.tree.HierarchyVisualization.prototype._getOldNode = function(node) {
  var oldNode = this._oldUiDataMap[node.id];
  var newNode = this._uiDataMap[node.id];
  if (oldNode) { return oldNode; }
  if (!newNode) { return node; }
  var oldDepth = newNode.depth + this._rootDepth - this._oldRootDepth;
  var isRoot = oldDepth < 0;
  var isExtremity = oldDepth < 0 || oldDepth >= this._subtreeDepth;
  var oldY = isRoot ? 0 : Math.min(1, oldDepth / this._oldSubtreeDepth);
  return new epiviz.ui.charts.tree.UiNode(
    node.id, node.name, node.children, node.parentId, node.size, node.depth, node.nchildren, node.nleaves, node.selectionType, node.order, node.globalDepth, node.taxonomy,

    isExtremity ? newNode.x : (newNode.x <= this._referenceNode.x ? 0 : 1), // x
    isExtremity ? newNode.dx : 0, // dx
    oldY, // y
    isExtremity ? 0 : newNode.y + newNode.dy - oldY); // dy
};

/**
 * @param {epiviz.ui.charts.tree.UiNode} node
 * @returns {epiviz.ui.charts.tree.UiNode}
 * @protected
 */
epiviz.ui.charts.tree.HierarchyVisualization.prototype._getNewNode = function(node) {
  var oldNode = this._oldUiDataMap[node.id];
  var newNode = this._uiDataMap[node.id];
  if (newNode) { return newNode; }
  if (!oldNode) { return node; }
  var newDepth = oldNode.depth - this._rootDepth + this._oldRootDepth;
  var isRoot = newDepth < 0;
  var isExtremity = newDepth < 0 || newDepth >= this._subtreeDepth;
  var newY = isRoot ? 0 : Math.min(1, newDepth / this._subtreeDepth);
  return new epiviz.ui.charts.tree.UiNode(
    node.id, node.name, node.children, node.parentId, node.size, node.depth, node.nchildren, node.nleaves, node.selectionType, node.order, node.globalDepth, node.taxonomy,
    isExtremity ? oldNode.x : (oldNode.x <= this._selectedNode.x ? 0 : 1), // x
    isExtremity ? oldNode.dx : 0, // dx
    newY, // y
    isExtremity ? 0 : oldNode.y + oldNode.dy - newY); // dy
};

/**
 * @private
 */
epiviz.ui.charts.tree.HierarchyVisualization.prototype._drawLegend = function() {
  this._svg.selectAll('.chart-title').remove();
  this._svg.selectAll('.chart-title-color').remove();
  if (!this._levelsTaxonomy) { return; }
  var self = this;
  var titleEntries = this._svg
    .selectAll('.chart-title')
    .data(this._levelsTaxonomy);
  titleEntries
    .enter()
    .append('text')
    .attr('class', 'chart-title')
    .attr('font-weight', 'bold')
    .attr('y', this.margins().top() - 5);
  titleEntries
    .attr('fill', function(label) { return self.colors().getByKey(label); })
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
    .data(this._levelsTaxonomy)
    .enter()
    .append('circle')
    .attr('class', 'chart-title-color')
    .attr('cx', function(column, i) { return self.margins().left() + 4 + titleEntriesStartPosition[i]; })
    .attr('cy', self.margins().top() - 9)
    .attr('r', 4)
    .style('shape-rendering', 'auto')
    .style('stroke-width', '0')
    .style('fill', function(label) { return self.colors().getByKey(label); });
};

/**
 * @returns {Array.<string>}
 */
epiviz.ui.charts.tree.HierarchyVisualization.prototype.levelsTaxonomy = function() { return this._levelsTaxonomy; };

/**
 * @returns {boolean}
 */
epiviz.ui.charts.tree.HierarchyVisualization.prototype.selectMode = function() { return this._selectMode; };

/**
 * @param {boolean} mode
 */
epiviz.ui.charts.tree.HierarchyVisualization.prototype.setSelectMode = function(mode) { this._selectMode = mode; };

/**
 * @param {epiviz.ui.charts.tree.UiNode} node
 */
epiviz.ui.charts.tree.HierarchyVisualization.prototype.selectNode = function(node) {
  var selectionType = (node.selectionType + 1) % 3;
  this._selectedNodes[node.id] = selectionType;

  this._changeNodeSelection(node, selectionType);

  if (this.autoPropagateChanges()) {
    this.firePropagateHierarchyChanges();
  }

  return selectionType;
};

/**
 * @param {number} level
 */
epiviz.ui.charts.tree.HierarchyVisualization.prototype.selectLevel = function(level) {
  var self = this;
  var deselectedNodeIds = [];
  $.each(this._selectedNodes, function(nodeId, selectionType) {
    /** @type {epiviz.ui.charts.tree.UiNode} */
    var node = self._uiDataMap[nodeId];
    if (node.globalDepth == level) {
      deselectedNodeIds.push(nodeId);
    }
  });
  deselectedNodeIds.forEach(function(nodeId) { delete self._selectedNodes[nodeId]; });
  if (!(level in this._selectedLevels)) {
    this._selectedLevels[level] = epiviz.ui.charts.tree.NodeSelectionType.NODE;
  } else {
    this._selectedLevels[level] = (this._selectedLevels[level] + 1) % 3;
  }

  if (this.autoPropagateChanges()) {
    this.firePropagateHierarchyChanges();
  }
};

/**
 * @returns {Object.<string, epiviz.ui.charts.tree.NodeSelectionType>}
 */
epiviz.ui.charts.tree.HierarchyVisualization.prototype.selectedNodes = function() { return this._selectedNodes; };

/**
 * @returns {Object.<string, number>}
 */
epiviz.ui.charts.tree.HierarchyVisualization.prototype.nodesOrder = function() { return this._nodesOrder; };

/**
 * @param {epiviz.ui.charts.tree.UiNode} node
 * @param {epiviz.ui.charts.tree.NodeSelectionType} selectionType
 * @private
 */
epiviz.ui.charts.tree.HierarchyVisualization.prototype._changeNodeSelection = function(node, selectionType) {
  var selectionClasses = epiviz.ui.charts.tree.HierarchyVisualization.SELECTION_CLASSES;
  var item = this._svg.select('#' + this.id() + '-' + node.id);

  for (var t in selectionClasses) {
    if (!selectionClasses.hasOwnProperty(t)) { continue; }
    item.classed(selectionClasses[t], false);
  }
  item.classed(selectionClasses[selectionType], true);
};

/**
 */
epiviz.ui.charts.tree.HierarchyVisualization.prototype.firePropagateHierarchyChanges = function() {
  var selectedNodes = this._selectedNodes;
  var nodesOrder = this._nodesOrder;
  var selectedLevels = this._selectedLevels;
  this._selectedNodes = {};
  this._nodesOrder = {};
  this.onPropagateHierarchyChanges().notify(new epiviz.ui.charts.VisEventArgs(
    this.id(),
    new epiviz.ui.controls.VisConfigSelection(undefined, undefined, this.datasourceGroup(), this.dataprovider(), undefined, undefined, undefined,
      {selection: selectedNodes, order: nodesOrder, selectedLevels: selectedLevels})));
};

/**
 */
epiviz.ui.charts.tree.HierarchyVisualization.prototype.fireRequestHierarchy = function() {
  var nodeId = null;
  if (this._lastData && this._lastData.children) {
    if (this._lastData.children.length == 1) {
      nodeId = this._lastData.children[0].id;
    } else {
      nodeId = this._lastData.id;
    }
  }
  this.onRequestHierarchy().notify(new epiviz.ui.charts.VisEventArgs(
    this.id(),
    new epiviz.ui.controls.VisConfigSelection(undefined, undefined, this.datasourceGroup(), this.dataprovider(), undefined, undefined, undefined, nodeId)));
};

/**
 * @param {boolean} val
 */
epiviz.ui.charts.tree.HierarchyVisualization.prototype.setAutoPropagateChanges = function(val) {
  epiviz.ui.charts.Visualization.prototype.setAutoPropagateChanges.call(this, val);
  if (val) { this.firePropagateHierarchyChanges(); }
};


/***/ }),
/* 77 */
/***/ (function(module, exports) {

/**
 * Created by Florin Chelaru ( florinc [at] umd [dot] edu )
 * Date: 11/15/2014
 * Time: 9:19 AM
 */

goog.provide('epiviz.ui.charts.VisEventArgs');

/**
 * @param {string} id The id of the visualization
 * @param {T} [args] The custom event arguments
 * @constructor
 * @struct
 * @template T
 */
epiviz.ui.charts.VisEventArgs = function(id, args) {
  /**
   * @type {string}
   */
  this.id = id;

  /**
   * @type {T}
   */
  this.args = args;
};


/***/ }),
/* 78 */
/***/ (function(module, exports) {

/**
 * Created by Florin Chelaru ( florinc [at] umd [dot] edu )
 * Date: 11/15/2014
 * Time: 11:03 AM
 */

goog.provide('epiviz.ui.charts.VisObject');

/**
 * @constructor
 */
epiviz.ui.charts.VisObject = function() {};

/**
 * @returns {number}
 */
epiviz.ui.charts.VisObject.prototype.regionStart = function() { return null; };

/**
 * @returns {number}
 */
epiviz.ui.charts.VisObject.prototype.regionEnd = function() { return null; };

/**
 * Measurement i, object j
 * @param {number} i
 * @param {number} j
 * @param {string} metadataCol
 * @returns {string}
 */
epiviz.ui.charts.VisObject.prototype.getMetadata = function(i, j, metadataCol) { return null; };

/**
 * Measurement i, object j
 * @param {number} i
 * @param {number} j
 * @returns {number}
 */
epiviz.ui.charts.VisObject.prototype.getStart = function(i, j) { return null; };

/**
 * Measurement i, object j
 * @param {number} i
 * @param {number} j
 * @returns {number}
 */
epiviz.ui.charts.VisObject.prototype.getEnd = function(i, j) { return null; };

/**
 * @returns {Array.<string>}
 */
epiviz.ui.charts.VisObject.prototype.metadataColumns = function() { return null; };

/**
 * Number of measurements times number of objects stored per measurement
 * @returns {Array.<number>}
 */
epiviz.ui.charts.VisObject.prototype.dimensions = function() { return [0, 0]; };

/**
 * @returns {boolean}
 */
epiviz.ui.charts.VisObject.prototype.metadataLooseCompare = function() { return false; };

/**
 * @param {epiviz.ui.charts.VisObject} other
 * @returns {boolean}
 */
epiviz.ui.charts.VisObject.prototype.overlapsWith = function(other) {
  if (!other) { return false; }
  if (this === other) { return true; }

  var i, j, k;

  // If this is a generic selection with no cells inside, then check its start and end against
  // the other object's cells/location
  var thisDim = this.dimensions();
  var otherDim = other.dimensions();

  if ((!thisDim[0] || !otherDim[0]) &&
    (this.regionStart() == undefined || other.regionStart() == undefined || this.regionEnd() == undefined || other.regionEnd() == undefined)) {

    return false;
  }

  if (!thisDim[0]) {
    if (!otherDim[0]) {
      return (this.regionStart() < other.regionEnd() && this.regionEnd() > other.regionStart());
    }

    for (j = 0; j < otherDim[1]; ++j) {
      var otherRowStart = other.getStart(0, j);
      var otherRowEnd = other.getEnd(0, j);

      if (otherRowStart != undefined && otherRowEnd != undefined &&
        this.regionStart() < otherRowEnd && this.regionEnd() > otherRowStart) {
        return true;
      }
    }

    return false;
  }

  // Check metadata
  var commonMetadata = epiviz.utils.arrayIntersection(this.metadataColumns(), other.metadataColumns());

  if (commonMetadata.length) {
    for (i = 0; i < thisDim[1]; ++i) {
      for (j = 0; j < otherDim[1]; ++j) {
        var metadataMatches = true;
        for (k = 0; k < commonMetadata.length; ++k) {
          var useLooseCompare = this.metadataLooseCompare() || other.metadataLooseCompare();
          var thisM = this.getMetadata(0, i, commonMetadata[k]);
          var otherM = other.getMetadata(0, j, commonMetadata[k]);

          if (thisM == otherM) { continue; }
          if (!useLooseCompare) { metadataMatches = false; break; }

          var first, second;
          if (thisM.length <= otherM.length) {
            first = thisM;
            second = otherM;
          } else {
            first = otherM;
            second = thisM;
          }

          var r = new RegExp('^(.+,)?' + first + '(,.+)?$');

          if (!r.test(second)) {
            metadataMatches = false;
            break;
          }
        }

        if (metadataMatches) {
          return true;
        }
      }
    }
    return false;
  }

  // If there are no common metadata columns, then we'll check for location overlaps
  for (i = 0; i < thisDim[1]; ++i) {
    for (j = 0; j < otherDim[1]; ++j) {
      if (this.getStart(0, i) < other.getEnd(0, j) && this.getEnd(0, i) > other.getStart(0, j)) {
        return true;
      }
    }
  }

  return false;
};


/***/ }),
/* 79 */
/***/ (function(module, exports) {

/**
 * Created by Florin Chelaru ( florinc [at] umd [dot] edu )
 * Date: 11/15/2014
 * Time: 9:07 AM
 */

goog.provide('epiviz.ui.charts.VisualizationProperties');

/**
 * @param {number|string} [width]
 * @param {number|string} [height]
 * @param {epiviz.ui.charts.Margins} [margins]
 * @param {epiviz.ui.controls.VisConfigSelection} [visConfigSelection]
 * @param {epiviz.ui.charts.ColorPalette} [colors]
 * @param {Object.<string, string>} [modifiedMethods]
 * @param {Object<string, *>} [customSettingsValues]
 * @param {Array.<epiviz.ui.charts.CustomSetting>} [customSettingsDefs]
 * @param {Array.<epiviz.ui.charts.markers.VisualizationMarker>} [chartMarkers]
 * @constructor
 * @struct
 */
epiviz.ui.charts.VisualizationProperties = function(width, height, margins, visConfigSelection, colors, modifiedMethods, customSettingsValues, customSettingsDefs, chartMarkers) {
  /**
   * @type {number|string}
   */
  this.width = width;

  /**
   * @type {number|string}
   */
  this.height = height;

  /**
   * @type {epiviz.ui.charts.Margins}
   */
  this.margins = margins;

  /**
   * @type {epiviz.ui.controls.VisConfigSelection}
   */
  this.visConfigSelection = visConfigSelection;

  /**
   * @type {epiviz.ui.charts.ColorPalette}
   */
  this.colors = colors;

  /**
   * @type {Object.<string, string>}
   */
  this.modifiedMethods = modifiedMethods;

  /**
   * @type {Object.<string, *>}
   */
  this.customSettingsValues = customSettingsValues || {};

  /**
   * @type {Array.<epiviz.ui.charts.CustomSetting>}
   */
  this.customSettingsDefs = customSettingsDefs || [];

  /**
   * @type {Array.<epiviz.ui.charts.markers.VisualizationMarker>}
   */
  this.chartMarkers = chartMarkers || [];
};

/**
 * @returns {epiviz.ui.charts.VisualizationProperties}
 */
epiviz.ui.charts.VisualizationProperties.prototype.copy = function() {
  var visConfigSelection = new epiviz.ui.controls.VisConfigSelection(
    this.visConfigSelection.measurements ? new epiviz.measurements.MeasurementSet(this.visConfigSelection.measurements) : undefined,
    this.visConfigSelection.datasource,
    this.visConfigSelection.datasourceGroup,
    this.visConfigSelection.dataprovider,
    epiviz.utils.mapCopy(this.visConfigSelection.annotation),
    this.visConfigSelection.defaultChartType,
    this.visConfigSelection.minSelectedMeasurements);
  return new epiviz.ui.charts.VisualizationProperties(
    this.width, this.height,
    this.margins ? this.margins.copy() : this.margins,
    visConfigSelection,
    this.colors,
    this.modifiedMethods ? epiviz.utils.mapCopy(this.modifiedMethods) : this.modifiedMethods,
    this.customSettingsValues ? epiviz.utils.mapCopy(this.customSettingsValues) : this.customSettingsValues,
    this.customSettingsDefs ? this.customSettingsDefs.slice(0) : this.customSettingsDefs,
    this.chartMarkers.slice(0));
};



/***/ }),
/* 80 */
/***/ (function(module, exports) {

/**
 * Created by: Florin Chelaru
 * Date: 11/22/14
 * Time: 12:43 PM
 */

goog.provide('epiviz.ui.charts.VisualizationType');
goog.provide('epiviz.ui.charts.VisualizationType.DisplayType');

goog.require('epiviz.ui.charts.Visualization');


/**
 * Abstract class
 * @param {epiviz.Config} config
 * @constructor
 */
epiviz.ui.charts.VisualizationType = function(config) {

  var VisualizationPropertySettings = epiviz.Config.VisualizationPropertySettings;

  /**
   * @type {epiviz.Config}
   * @private
   */
  this._config = config;

  /**
   * @type {Object.<epiviz.Config.VisualizationPropertySettings|string, *>}
   * @protected
   */
  this._defaultSettings = epiviz.utils.mapCombine(
    epiviz.utils.mapCombine(config.chartSettings[this.typeName()], config.chartSettings[this.chartDisplayType()], true),
    config.chartSettings['default'], true);

  /**
   * @type {string|number}
   * @private
   */
  this._defaultWidth = this._defaultSettings[VisualizationPropertySettings.WIDTH];

  /**
   * @type {string|number}
   * @private
   */
  this._defaultHeight = this._defaultSettings[VisualizationPropertySettings.HEIGHT];

  /**
   * @type {epiviz.ui.charts.Margins}
   * @private
   */
  this._defaultMargins = this._defaultSettings[VisualizationPropertySettings.MARGINS];

  /**
   * @type {epiviz.ui.charts.ColorPalette}
   * @private
   */
  this._defaultColors = config.colorPalettesMap[this._defaultSettings[VisualizationPropertySettings.COLORS]];

  /**
   * @type {Array.<string>}
   * @private
   */
  this._decorations = this._defaultSettings[VisualizationPropertySettings.DECORATIONS];

  /**
   * @type {?Object.<string, *>}
   * @private
   */
  this._customSettingsValues = config.chartCustomSettings[this.typeName()] || null;
};

/**
 * @enum {string}
 */
epiviz.ui.charts.VisualizationType.DisplayType = {
  PLOT: 'plot',
  TRACK: 'track',
  DATA_STRUCTURE: 'data-structure'
};

/**
 * @param {string} id
 * @param {jQuery} container
 * @param {epiviz.ui.charts.VisualizationProperties} properties
 * @returns {epiviz.ui.charts.Chart}
 */
epiviz.ui.charts.VisualizationType.prototype.createNew = function(id, container, properties) { throw Error('unimplemented abstract method'); };

/**
 * @returns {string} The fully qualified type name of the chart
 */
epiviz.ui.charts.VisualizationType.prototype.typeName = function() { throw Error('unimplemented abstract method'); };

/**
 * @returns {string}
 */
epiviz.ui.charts.VisualizationType.prototype.chartName = function() { throw Error('unimplemented abstract method'); };

/**
 * @returns {string} a string to be used for html id attributes of
 *   elements containing this chart type
 */
epiviz.ui.charts.VisualizationType.prototype.chartHtmlAttributeName = function() { throw Error('unimplemented abstract method'); };

/**
 * @returns {epiviz.ui.charts.VisualizationType.DisplayType}
 */
epiviz.ui.charts.VisualizationType.prototype.chartDisplayType = function() { throw Error('unimplemented abstract method'); };

/**
 * @returns {function(epiviz.measurements.Measurement): boolean}
 */
epiviz.ui.charts.VisualizationType.prototype.measurementsFilter = function() { return function(m) { return true; }; };

/**
 * If true, this flag indicates that the corresponding chart can only show measurements that belong to the same
 * data source group
 * @returns {boolean}
 */
epiviz.ui.charts.VisualizationType.prototype.isRestrictedToSameDatasourceGroup = function() { return false; };

/**
 * @returns {boolean}
 */
epiviz.ui.charts.VisualizationType.prototype.isRestrictedToRangeMeasurements = function() { return false; };

/**
 * @returns {boolean}
 */
epiviz.ui.charts.VisualizationType.prototype.isRestrictedToFeatureMeasurements = function() { return !this.isRestrictedToRangeMeasurements(); };

/**
 * Gets the minimum number of measurements that must be selected for the chart to be displayed
 * @returns {number}
 */
epiviz.ui.charts.VisualizationType.prototype.minSelectedMeasurements = function() { return 1; };

/**
 * @returns {string}
 */
epiviz.ui.charts.VisualizationType.prototype.chartContainer = function() {
  return epiviz.ui.ControlManager.CHART_TYPE_CONTAINERS[this.chartDisplayType()];
};

/**
 * @returns {string}
 */
epiviz.ui.charts.VisualizationType.prototype.cssClass = function() { throw Error('unimplemented abstract method'); };

/**
 * @returns {number|string}
 */
epiviz.ui.charts.VisualizationType.prototype.defaultWidth = function() { return this._defaultWidth; };

/**
 * @returns {number|string}
 */
epiviz.ui.charts.VisualizationType.prototype.defaultHeight = function() { return this._defaultHeight; };

/**
 * @returns {epiviz.ui.charts.Margins}
 */
epiviz.ui.charts.VisualizationType.prototype.defaultMargins = function() { return this._defaultMargins; };

/**
 * @returns {epiviz.ui.charts.ColorPalette}
 */
epiviz.ui.charts.VisualizationType.prototype.defaultColors = function() { return this._defaultColors; };

/**
 * @returns {Array.<string>}
 */
epiviz.ui.charts.VisualizationType.prototype.decorations = function() { return this._decorations; };

/**
 * @returns {?Object.<string, *>}
 */
epiviz.ui.charts.VisualizationType.prototype.customSettingsValues = function() { return this._customSettingsValues; };

/**
 * @returns {Array.<epiviz.ui.charts.CustomSetting>}
 */
epiviz.ui.charts.VisualizationType.prototype.customSettingsDefs = function() {
  return [
    new epiviz.ui.charts.CustomSetting(
      epiviz.ui.charts.Visualization.CustomSettings.TITLE,
      epiviz.ui.charts.CustomSetting.Type.STRING,
      '',
      'Title'),

    new epiviz.ui.charts.CustomSetting(
      epiviz.ui.charts.Visualization.CustomSettings.MARGIN_TOP,
      epiviz.ui.charts.CustomSetting.Type.NUMBER,
      this._defaultMargins.top(),
      'Top margin'),

    new epiviz.ui.charts.CustomSetting(
      epiviz.ui.charts.Visualization.CustomSettings.MARGIN_BOTTOM,
      epiviz.ui.charts.CustomSetting.Type.NUMBER,
      this._defaultMargins.bottom(),
      'Bottom margin'),

    new epiviz.ui.charts.CustomSetting(
      epiviz.ui.charts.Visualization.CustomSettings.MARGIN_LEFT,
      epiviz.ui.charts.CustomSetting.Type.NUMBER,
      this._defaultMargins.left(),
      'Left margin'),

    new epiviz.ui.charts.CustomSetting(
      epiviz.ui.charts.Visualization.CustomSettings.MARGIN_RIGHT,
      epiviz.ui.charts.CustomSetting.Type.NUMBER,
      this._defaultMargins.right(),
      'Right margin')
  ];
};


/***/ }),
/* 81 */
/***/ (function(module, exports) {

/**
 * Created by Florin Chelaru ( florinc [at] umd [dot] edu )
 * Date: 11/15/2014
 * Time: 9:05 AM
 */

goog.provide('epiviz.ui.charts.Visualization');

/**
 * Uses data of T type for drawing objects of a subtype of epiviz.ui.charts.VisObject
 * @param {string} id
 * @param {jQuery} container The div where the visualization will be drawn
 * @param {epiviz.ui.charts.VisualizationProperties} properties
 * @constructor
 * @template T
 */
epiviz.ui.charts.Visualization = function(id, container, properties) {
  /**
   * @type {string}
   * @private
   */
  this._id = id;

  /**
   * @type {jQuery}
   * @private
   */
  this._container = container;

  /**
   * @type {epiviz.ui.charts.VisualizationProperties}
   * @private
   */
  this._properties = properties;

  /**
   * @type {Object.<string, function>}
   * @private
   */
  this._originalMethods = {};

  /**
   * @type {boolean}
   * @private
   */
  this._hasModifiedMethods = false;

  /**
   * @type {string}
   * @private
   */
  this._lastModifiedMethod = 'draw';

  var self = this;
  if (properties.modifiedMethods) {
    var methodsUpdated = new epiviz.deferred.Deferred();
    var modifiedMethods = properties.modifiedMethods;
    var modifiedMethodNames = Object.keys(modifiedMethods);
    var cajoledMethods = {};
    var nMethodsUpdated = 0;
    for (var m in modifiedMethods) {
      if (!modifiedMethods.hasOwnProperty(m)) { continue; }
      if (m == '_setModifiedMethods') { continue; } // Ignore modifications to this method
      (function(m) {
        epiviz.caja.cajole(modifiedMethods[m], epiviz.caja.buildChartMethodContext()).done(function(method) {
          if (!method) { return; }
          cajoledMethods[m] = method;
          nMethodsUpdated += 1;
          if (nMethodsUpdated >= modifiedMethodNames.length) {
            methodsUpdated.resolve();
          }
        });
      })(m);
    }
    methodsUpdated.done(function() {
      for (var m in cajoledMethods) {
        if (!cajoledMethods.hasOwnProperty(m)) { continue; }
        self._originalMethods[m] = self[m];
        self[m] = cajoledMethods[m];
        self._lastModifiedMethod = m;
      }
      self._hasModifiedMethods = true;
      self.draw();
    });
  }

  /**
   * @type {Object.<string, *>}
   * @private
   */
  this._customSettingsValues = {};
  for (var i = 0; i < properties.customSettingsDefs.length; ++i) {
    var setting = properties.customSettingsDefs[i];
    var val = properties.customSettingsValues[setting.id];
    switch (setting.type) {
      case epiviz.ui.charts.CustomSetting.Type.BOOLEAN:
        this._customSettingsValues[setting.id] = (val === false || val) ? val : setting.defaultValue;
        break;
      case epiviz.ui.charts.CustomSetting.Type.NUMBER:
        this._customSettingsValues[setting.id] = (val === 0 || val) ? val : setting.defaultValue;
        break;
      case epiviz.ui.charts.CustomSetting.Type.STRING:
        this._customSettingsValues[setting.id] = (val === '' || val) ? val : setting.defaultValue;
        break;
      case epiviz.ui.charts.CustomSetting.Type.MEASUREMENTS_METADATA:
        var possibleValues = {};
        properties.visConfigSelection.measurements.foreach(function(m) {
          m.metadata().forEach(function(metadataCol) { possibleValues[metadataCol] = metadataCol; });
        });
        setting.possibleValues = Object.keys(possibleValues);
        setting.possibleValues.sort();
        val = val || setting.defaultValue;
        this._customSettingsValues[setting.id] = (val in possibleValues) ?
          val : ((setting.possibleValues.length) ? setting.possibleValues[0] : '');
        break;
      case epiviz.ui.charts.CustomSetting.Type.MEASUREMENTS_ANNOTATION:
        var possibleValues = {name: 'name'};
        properties.visConfigSelection.measurements.foreach(function(m) {
          var anno = m.annotation();
          if (!anno) { return; }
          Object.keys(anno).forEach(function(key) { possibleValues[key] = key; });
        });
        setting.possibleValues = Object.keys(possibleValues);
        setting.possibleValues.sort();
        val = val || setting.defaultValue;
        this._customSettingsValues[setting.id] = (val in possibleValues) ?
          val : ((setting.possibleValues.length) ? setting.possibleValues[0] : '');
        break;
      default:
        this._customSettingsValues[setting.id] = val || setting.defaultValue;
        break;
    }
  }

  /**
   * @type {string}
   * @private
   */
  this._svgId = sprintf('%s-svg', this._id);

  /**
   * The D3 svg handler for the visualization
   * @protected
   */
  this._svg = null;

  /**
   * @type {?T}
   * @protected
   */
  this._unalteredData = null;

  /**
   * @type {?T}
   * @protected
   */
  this._lastData = null;

  /**
   * @type {epiviz.datatypes.Range}
   * @protected
   */
  this._lastRange = null;

  /**
   * @type {number}
   * @protected
   */
  this._slide = 0;

  /**
   * @type {number}
   * @protected
   */
  this._zoom = 1;

  /**
   * @type {Array.<epiviz.ui.charts.markers.VisualizationMarker>}
   * @protected
   */
  this._markers = properties.chartMarkers;

  /**
   * @type {Object.<string, epiviz.ui.charts.markers.VisualizationMarker>}
   * @protected
   */
  this._markersMap = {};

  /**
   * @type {Object.<string, number>}
   * @private
   */
  this._markersIndices = {};

  this._markers.forEach(function(marker, i) {
    if (!marker) { return; }
    self._markersMap[marker.id()] = marker;
    self._markersIndices[marker.id()] = i;
  });

  /**
   * @type {boolean}
   */
  this._autoPropagateChanges = true;

  // Events

  /**
   * @type {epiviz.events.Event.<epiviz.ui.charts.VisEventArgs.<epiviz.ui.charts.VisObject>>}
   * @protected
   */
  this._hover = new epiviz.events.Event();

  /**
   * @type {epiviz.events.Event.<epiviz.ui.charts.VisEventArgs>}
   * @protected
   */
  this._unhover = new epiviz.events.Event();

  /**
   * @type {epiviz.events.Event.<epiviz.ui.charts.VisEventArgs.<epiviz.ui.charts.VisObject>>}
   * @protected
   */
  this._select = new epiviz.events.Event();

  /**
   * @type {epiviz.events.Event.<epiviz.ui.charts.VisEventArgs>}
   * @protected
   */
  this._deselect = new epiviz.events.Event();

  /**
   * @type {epiviz.events.Event.<epiviz.ui.charts.VisEventArgs>}
   * @private
   */
  this._save = new epiviz.events.Event();

  /**
   * @type {epiviz.events.Event.<epiviz.ui.charts.VisEventArgs>}
   * @private
   */
  this._remove = new epiviz.events.Event();

  /**
   * @type {epiviz.events.Event.<epiviz.ui.charts.VisEventArgs.<epiviz.ui.charts.ColorPalette>>}
   * @protected
   */
  this._colorsChanged = new epiviz.events.Event();

  /**
   * Event arg: a map of method -> code
   * @type {epiviz.events.Event.<epiviz.ui.charts.VisEventArgs.<Object.<string, string>>>}
   * @private
   */
  this._methodsModified = new epiviz.events.Event();

  /**
   * @type {epiviz.events.Event.<epiviz.ui.charts.VisEventArgs>}
   * @private
   */
  this._methodsReset = new epiviz.events.Event();

  /**
   * @type {epiviz.events.Event.<epiviz.ui.charts.VisEventArgs.<Array.<epiviz.ui.charts.markers.VisualizationMarker>>>}
   * @private
   */
  this._markersModified = new epiviz.events.Event();

  /**
   * Event arg: custom settings values setting -> value
   * @type {epiviz.events.Event.<epiviz.ui.charts.VisEventArgs.<Object.<string, *>>>}
   * @private
   */
  this._customSettingsChanged = new epiviz.events.Event();

  /**
   * @type {epiviz.events.Event.<epiviz.ui.charts.VisEventArgs.<{width: number|string, height: number|string}>>}
   * @private
   */
  this._sizeChanged = new epiviz.events.Event();

  /**
   * @type {epiviz.events.Event.<epiviz.ui.charts.VisEventArgs.<epiviz.ui.charts.Margins>>}
   * @private
   */
  this._marginsChanged = new epiviz.events.Event();

  /**
   * @type {epiviz.events.Event.<epiviz.ui.charts.VisEventArgs>}
   * @private
   */
  this._dataWaitStart = new epiviz.events.Event();

  /**
   * @type {epiviz.events.Event.<epiviz.ui.charts.VisEventArgs>}
   * @protected
   */
  this._dataWaitEnd = new epiviz.events.Event();
};

/**
 * @type {number}
 * @constant
 */
epiviz.ui.charts.Visualization.SVG_MARGIN = 20;

/**
 * Initializes the visualization and draws the initial SVG in the container
 * @protected
 */
epiviz.ui.charts.Visualization.prototype._initialize = function() {
  if (this._properties.height == '100%') { this._properties.height = this._container.height() - epiviz.ui.charts.Visualization.SVG_MARGIN; }
  if (this._properties.width == '100%') { this._properties.width = this._container.width() - epiviz.ui.charts.Visualization.SVG_MARGIN; }

  var width = this.width();
  var height = this.height();

  this._container.addClass('visualization-container');

  this._container.append(sprintf('<svg id="%s" class="visualization" width="%s" height="%s"><style type="text/css"></style><defs></defs></svg>', this._svgId, width, height));
  this._svg = d3.select('#' + this._svgId);

  var jSvg = $('#' + this._svgId);

  /**
   * The difference in size between the container and the inner SVG
   * @type {number}
   * @private
   */
  this._widthDif = jSvg.width() - (this._container.width() - epiviz.ui.charts.Visualization.SVG_MARGIN);

  /**
   * The difference in size between the container and the inner SVG
   * @type {number}
   * @private
   */
  this._heightDif = height - (this._container.height() - epiviz.ui.charts.Visualization.SVG_MARGIN);

  this._properties.width = width;
  this._properties.height = height;

  var self = this;
  this._container.click(function() { self._deselect.notify(new epiviz.ui.charts.VisEventArgs(self._id)); });
};

/**
 * @param [svg] D3 svg container for the axes
 * @protected
 */
epiviz.ui.charts.Visualization.prototype._clearAxes = function(svg) {
  svg = svg || this._svg;
  svg.selectAll('.xAxis').remove();
  svg.selectAll('.yAxis').remove();
};

/**
 * @param [xScale] D3 linear scale for the x axis
 * @param [yScale] D3 linear scale for the y axis
 * @param {number} [xTicks]
 * @param {number} [yTicks]
 * @param [svg] D3 svg container for the axes
 * @param {number} [width]
 * @param {number} [height]
 * @param {epiviz.ui.charts.Margins} [margins]
 * @param {function} [xAxisFormat]
 * @param {function} [yAxisFormat]
 * @param {Array.<string>} [xLabels]
 * @param {Array.<string>} [yLabels]
 * @param {boolean} [xLabelsBtTicks]
 * @param {boolean} [yLabelsBtTicks]
 * @protected
 */
epiviz.ui.charts.Visualization.prototype._drawAxes = function (xScale, yScale, xTicks, yTicks, svg, width, height, margins, xAxisFormat, yAxisFormat, xLabels, yLabels, xLabelsBtTicks, yLabelsBtTicks) {

  svg = svg || this._svg;
  margins = margins || this.margins();
  height = height || this.height();
  width = width || this.width();

  var axesGroup = svg.select('.axes'),
    xAxisGrid = axesGroup.select('.xAxis-grid'),
    yAxisGrid = axesGroup.select('.yAxis-grid'),
    xAxisLine = axesGroup.select('.xAxis-line'),
    yAxisLine = axesGroup.select('.yAxis-line');

  if (axesGroup.empty()) { axesGroup = svg.append('g').attr('class', 'axes'); }

  if (xAxisGrid.empty()) { xAxisGrid = axesGroup.append('g').attr('class', 'xAxis xAxis-grid'); }
  if (yAxisGrid.empty()) { yAxisGrid = axesGroup.append('g').attr('class', 'yAxis yAxis-grid'); }
  if (xAxisLine.empty()) { xAxisLine = axesGroup.append('g').attr('class', 'xAxis xAxis-line'); }
  if (yAxisLine.empty()) { yAxisLine = axesGroup.append('g').attr('class', 'yAxis yAxis-line'); }

  if (xScale) {
    // Draw X-axis grid lines
    xAxisGrid
      .attr('transform', 'translate(' + margins.left() + ', ' + margins.top() + ')')
      .selectAll('line.x')
      .data(xScale.ticks(xTicks))
      .enter().append('line')
      .attr('x1', xScale)
      .attr('x2', xScale)
      .attr('y1', 0)
      .attr('y2', height - margins.top() - margins.bottom())
      .style('stroke', '#eeeeee')
      .style('shape-rendering', 'crispEdges');

    var xAxisTickFormat = xAxisFormat ||
      ((xLabels) ?
        function(i) { return xLabels[i]; } :
        function(x) {
          var format = d3.format('s');
          var rounded = Math.round(x * 1000) / 1000;
          return format(rounded);
        });

    var xAxis = d3.svg.axis()
      .scale(xScale)
      .orient('bottom')
      .ticks(xTicks)
      .tickFormat(xAxisTickFormat);

    xAxisLine
      .attr('transform', 'translate(' + margins.left() + ', ' + (height - margins.bottom()) + ')')
      .call(xAxis);

    if (xLabels) {
      var xTransform = 'rotate(-90)';
      if (xLabelsBtTicks) { xTransform += 'translate(0,' + (xScale(0.5) - xScale(0)) + ')'; }
      xAxisLine
      .selectAll('text')
      .style('text-anchor', 'end')
      .attr('dx', '-.8em')
      .attr('dy', '-0.5em')
      .attr('transform', xTransform);
    }
  }

  if (yScale) {
    // Draw Y-axis grid lines
    yAxisGrid
      .attr('transform', 'translate(' + margins.left() + ', ' + margins.top() + ')')
      .selectAll('line.y')
      .data(yScale.ticks(yTicks - 1))
      .enter().append('line')
      .attr('x1', 0)
      .attr('x2', width - margins.left() - margins.right())
      .attr('y1', yScale)
      .attr('y2', yScale)
      .style('stroke', '#eeeeee')
      .style('shape-rendering', 'crispEdges');

    var yAxisTickFormat = (yLabels) ? function(i) { return yLabels[i]; } :
      function(y) {
        var format = d3.format('s');
        var rounded = Math.round(y * 1000) / 1000;
        return format(rounded);
      };

    var yAxis = d3.svg.axis()
      .ticks(yTicks - 1)
      .scale(yScale)
      .orient('left')
      .tickFormat(yAxisTickFormat);
    yAxisLine
      .attr('transform', 'translate(' + margins.left() + ', ' + margins.top() + ')')
      .call(yAxis);
  }
};

/**
 * @private
 */
epiviz.ui.charts.Visualization.prototype._drawTitle = function() {
  var svgTitle = this._svg.selectAll('.visualization-title');

  var Settings = epiviz.ui.charts.Visualization.CustomSettings;
  var settingsVals = this.customSettingsValues();

  var title = settingsVals[Settings.TITLE];
  if (!title || title.trim() == '') {
    if (!svgTitle.empty()) {
      svgTitle.remove();
    }
    return;
  }

  if (svgTitle.empty()) {
    svgTitle = this._svg.append('text')
      .attr('class', 'visualization-title')
      .attr('text-anchor', 'middle');
  }

  svgTitle
    .attr('x', this.width() * 0.5)
    .attr('y', 25)
    .text(title);
};

/**
 * @param {number} width
 * @param {number} height
 */
epiviz.ui.charts.Visualization.prototype.resize = function(width, height) {
  if (width) { this._properties.width = width; }
  if (height) { this._properties.height = height; }

  this.draw();

  this._sizeChanged.notify(new epiviz.ui.charts.VisEventArgs(this._id, {width: this._properties.width, height: this._properties.height}));
};


/**
 */
epiviz.ui.charts.Visualization.prototype.updateSize = function() {
  this.resize(
    this._widthDif + this._container.width() - epiviz.ui.charts.Visualization.SVG_MARGIN,
    this._heightDif + this._container.height() - epiviz.ui.charts.Visualization.SVG_MARGIN);
};

/**
 * @param {epiviz.datatypes.Range} [range]
 * @param {T} [data]
 * @returns {Array.<epiviz.ui.charts.VisObject>}
 */
epiviz.ui.charts.Visualization.prototype.draw = function(range, data) {

  if (range != undefined) {
    this._lastRange = range;
  }

  if (data != undefined) {
    this._lastData = data;
    this._unalteredData = data;
    this._dataWaitEnd.notify(new epiviz.ui.charts.VisEventArgs(this._id));
  }

  this._svg
    .attr('width', this.width())
    .attr('height', this.height());

  this._drawTitle();

  return [];
};

/* Getters */

/**
 * @returns {jQuery}
 */
epiviz.ui.charts.Visualization.prototype.container = function() { return this._container; };

/**
 * @returns {string}
 */
epiviz.ui.charts.Visualization.prototype.id = function() { return this._id; };

/**
 * @returns {epiviz.ui.charts.VisualizationProperties}
 */
epiviz.ui.charts.Visualization.prototype.properties = function() {
  return this._properties;
};

/**
 * @returns {number}
 */
epiviz.ui.charts.Visualization.prototype.height = function() {
  return this._properties.height;
};

/**
 * @returns {number}
 */
epiviz.ui.charts.Visualization.prototype.width = function() {
  return this._properties.width;
};

/**
 * @returns {epiviz.ui.charts.Margins}
 */
epiviz.ui.charts.Visualization.prototype.margins = function() {
  return this._properties.margins;
};

/**
 * @returns {epiviz.ui.charts.ColorPalette}
 */
epiviz.ui.charts.Visualization.prototype.colors = function() {
  return this._properties.colors;
};

/**
 * @param {epiviz.ui.charts.ColorPalette} colors
 */
epiviz.ui.charts.Visualization.prototype.setColors = function(colors) {
  if (!colors || colors.equals(this._properties.colors)) { return; }
  this._properties.colors = colors;
  this.draw();
  this._colorsChanged.notify(new epiviz.ui.charts.VisEventArgs(this._id, this._properties.colors));
};

/**
 * @returns {Array.<string>}
 */
epiviz.ui.charts.Visualization.prototype.colorLabels = function() {
  var self = this;
  var colors = new Array(this.measurements().size());
  this.measurements().foreach(
    /**
     * @param {epiviz.measurements.Measurement} m
     * @param {number} i
     */
      function(m, i) {
      colors[i] = m.name();
    });

  return colors;
};

/**
 * @returns {epiviz.measurements.MeasurementSet}
 */
epiviz.ui.charts.Visualization.prototype.measurements = function() {
  return this.properties().visConfigSelection.measurements;
};

/**
 * @returns {Object.<string, *>}
 */
epiviz.ui.charts.Visualization.prototype.customSettingsValues = function() { return this._customSettingsValues; };

/**
 * @param {Object.<string, *>} settingsValues
 */
epiviz.ui.charts.Visualization.prototype.setCustomSettingsValues = function(settingsValues) {
  if (this._customSettingsValues == settingsValues || !settingsValues || epiviz.utils.mapEquals(this._customSettingsValues, settingsValues)) {
    return;
  }
  var CustomSettings = epiviz.ui.charts.Visualization.CustomSettings;

  var currentTitle = this._customSettingsValues[CustomSettings.TITLE] || '';
  var newTitle = settingsValues[CustomSettings.TITLE] || '';

  var currentLen = currentTitle.trim().length;
  var newLen = newTitle.trim().length;

  // Check if either both titles are undefined or both are defined
  if (!(currentLen * newLen) && (currentLen + newLen)) {
    var marginDelta = epiviz.utils.sign(newLen - currentLen) * 20;
    var top = settingsValues[CustomSettings.MARGIN_TOP] || this._properties.margins.top();
    var left = settingsValues[CustomSettings.MARGIN_LEFT] || this._properties.margins.left();
    var right = settingsValues[CustomSettings.MARGIN_RIGHT] || this._properties.margins.right();
    var bottom = settingsValues[CustomSettings.MARGIN_BOTTOM] || this._properties.margins.bottom();
    settingsValues[CustomSettings.MARGIN_TOP] = top + marginDelta;
    settingsValues[CustomSettings.MARGIN_LEFT] = left;
    settingsValues[CustomSettings.MARGIN_RIGHT] = right;
    settingsValues[CustomSettings.MARGIN_BOTTOM] = bottom;
  }

  // FIXME: This is a property specific to Chart and not Visualization; move this portion of the code in Chart
  var currentMeasurementAggregator = this._customSettingsValues[epiviz.ui.charts.ChartType.CustomSettings.MEASUREMENT_GROUPS_AGGREGATOR];
  var newMeasurementAggregator = settingsValues[epiviz.ui.charts.ChartType.CustomSettings.MEASUREMENT_GROUPS_AGGREGATOR];

  this._customSettingsValues = settingsValues;

  if (CustomSettings.MARGIN_TOP in settingsValues && CustomSettings.MARGIN_BOTTOM in settingsValues && CustomSettings.MARGIN_LEFT in settingsValues && CustomSettings.MARGIN_RIGHT in settingsValues) {
    this._properties.margins = new epiviz.ui.charts.Margins(settingsValues[CustomSettings.MARGIN_TOP], settingsValues[CustomSettings.MARGIN_LEFT], settingsValues[CustomSettings.MARGIN_BOTTOM], settingsValues[CustomSettings.MARGIN_RIGHT]);
    this._marginsChanged.notify(new epiviz.ui.charts.VisEventArgs(this._id, this._properties.margins));
  }

  if (currentMeasurementAggregator != newMeasurementAggregator) {
    var self = this;
    this.transformData(this._lastRange, this._unalteredData).done(function() {
      self.draw();
    });
  } else {
    this.draw();
  }

  this._customSettingsChanged.notify(new epiviz.ui.charts.VisEventArgs(this._id, settingsValues));
};

/**
 * @param {Object.<string, string>} modifiedMethods
 */
epiviz.ui.charts.Visualization.prototype.setModifiedMethods = function(modifiedMethods) {
  var self = this;
  var methodsModified = false;
  if (!modifiedMethods) { return; }
  var modifiedMethodNames = Object.keys(modifiedMethods);
  var methodsUpdated = new epiviz.deferred.Deferred();
  var nMethodsUpdated = 0;
  var cajoledMethods = {};
  for (var m in modifiedMethods) {
    if (!modifiedMethods.hasOwnProperty(m)) { continue; }
    if (m == '_setModifiedMethods') { continue; } // Ignore modifications to this method
    if (this[m].toString() == modifiedMethods[m]) { continue; }

    if (!(m in this._originalMethods)) {
      this._originalMethods[m] = this[m];
    }

    (function(m) {
      epiviz.caja.cajole(modifiedMethods[m], epiviz.caja.buildChartMethodContext()).done(function(method) {
        if (method) {
          cajoledMethods[m] = method;
          methodsModified = true;

          nMethodsUpdated += 1;
          if (nMethodsUpdated >= modifiedMethodNames.length) {
            methodsUpdated.resolve();
          }
        }
      });
    })(m);
  }

  methodsUpdated.done(function() {
    if (methodsModified) {
      for (var m in cajoledMethods) {
        if (!cajoledMethods.hasOwnProperty(m)) { continue; }
        self[m] = cajoledMethods[m];
        self._lastModifiedMethod = m;
      }
      self._hasModifiedMethods = true;
      self.draw();
      self._methodsModified.notify(new epiviz.ui.charts.VisEventArgs(self._id, modifiedMethods));
    }
  });
};

/**
 * @returns {boolean}
 */
epiviz.ui.charts.Visualization.prototype.hasModifiedMethods = function() { return this._hasModifiedMethods; };

/**
 * @returns {string}
 */
epiviz.ui.charts.Visualization.prototype.lastModifiedMethod = function() { return this._lastModifiedMethod; };

/**
 */
epiviz.ui.charts.Visualization.prototype.resetModifiedMethods = function() {
  if (!this._hasModifiedMethods) { return; }
  for (var m in this._originalMethods) {
    if (!this._originalMethods.hasOwnProperty(m)) { continue; }
    this[m] = this._originalMethods[m];
  }

  this._hasModifiedMethods = false;

  this.draw();

  this._methodsReset.notify(new epiviz.ui.charts.VisEventArgs(this._id));
};

/**
 * @param {epiviz.ui.charts.markers.VisualizationMarker} marker
 */
epiviz.ui.charts.Visualization.prototype.putMarker = function(marker) {
  if (!marker) { return; }
  var i;
  if (marker.id() in this._markersMap) {
    i = this._markersIndices[marker.id()];
    var oldMarker = this._markers[i];
    if (oldMarker == marker ||
        (oldMarker.type() == marker.type() &&
         oldMarker.preMarkStr() == marker.preMarkStr() &&
         oldMarker.markStr() == marker.markStr())) {
      // Marker not modified
      return;
    }
    this._markers[i] = marker;
    this._markersMap[marker.id()] = marker;
  } else {
    i = this._markers.length;
    this._markers.push(marker);
    this._markersIndices[marker.id()] = i;
    this._markersMap[marker.id()] = marker;
  }

  var self = this;
  this.transformData(this._lastRange, this._unalteredData).done(function() {
    self.draw();
  });

  this._markersModified.notify(new epiviz.ui.charts.VisEventArgs(this._id, this._markers));
};

epiviz.ui.charts.Visualization.prototype.removeMarker = function(markerId) {
  if (!(markerId in this._markersMap)) { return; }

  var i = this._markersIndices[markerId];
  this._markers[i] = null;
  delete this._markersMap[markerId];
  delete this._markersIndices[markerId];

  var self = this;
  this.transformData(this._lastRange, this._unalteredData).done(function() {
    self.draw();
  });

  this._markersModified.notify(new epiviz.ui.charts.VisEventArgs(this._id, this._markers));
};

/**
 * @param {string} markerId
 * @returns {epiviz.ui.charts.markers.VisualizationMarker}
 */
epiviz.ui.charts.Visualization.prototype.getMarker = function(markerId) {
  if (!markerId || !(markerId in this._markersMap)) { return null; }
  return this._markersMap[markerId];
};

/**
 * @returns {epiviz.ui.charts.VisualizationType.DisplayType}
 */
epiviz.ui.charts.Visualization.prototype.displayType = function() { throw Error('unimplemented abstract method'); };

/**
 * @returns {boolean}
 */
epiviz.ui.charts.Visualization.prototype.autoPropagateChanges = function() { return this._autoPropagateChanges; };

/**
 * @param {boolean} val
 */
epiviz.ui.charts.Visualization.prototype.setAutoPropagateChanges = function(val) { this._autoPropagateChanges = val; };

/**
 * @param {epiviz.datatypes.Range} range
 * @param {T} data
 * @returns {epiviz.deferred.Deferred}
 */
epiviz.ui.charts.Visualization.prototype.transformData = function(range, data) {
  var lastRange = this._lastRange;

  if (range != undefined) {
    this._lastRange = range;
  }
  if (data != undefined) {
    this._lastData = data;
    this._unalteredData = data;
  }

  if (lastRange && range && lastRange.overlapsWith(range) && lastRange.width() == range.width()) {
    this._slide = range.start() - lastRange.start();
  }

  if (lastRange && range && lastRange.overlapsWith(range) && lastRange.width() != range.width()) {
    this._zoom = lastRange.width() / range.width();
  }

  var deferred = new epiviz.deferred.Deferred();
  deferred.resolve();
  return deferred;
};

/* Events */

/**
 * @returns {epiviz.events.Event.<epiviz.ui.charts.VisEventArgs.<epiviz.ui.charts.VisObject>>}
 */
epiviz.ui.charts.Visualization.prototype.onHover = function() { return this._hover; };

/**
 * @returns {epiviz.events.Event.<epiviz.ui.charts.VisEventArgs>}
 */
epiviz.ui.charts.Visualization.prototype.onUnhover = function() { return this._unhover; };

/**
 * @returns {epiviz.events.Event.<epiviz.ui.charts.VisEventArgs.<epiviz.ui.charts.VisObject>>}
 */
epiviz.ui.charts.Visualization.prototype.onSelect = function() { return this._select; };

/**
 * @returns {epiviz.events.Event.<epiviz.ui.charts.VisEventArgs>}
 */
epiviz.ui.charts.Visualization.prototype.onDeselect = function() { return this._deselect; };

// Deprecated code, kept here for future reference
// Selection and hovering by changing the class of the selected items

/**
 * @param {epiviz.ui.charts.VisObject} selectedObject
 */
/*epiviz.ui.charts.Visualization.prototype.doHover = function(selectedObject) {
  var itemsGroup = this._svg.select('.items');
  itemsGroup.classed('unhovered', true);
  var selectItems = itemsGroup.selectAll('.item').filter(function(d) {
    return selectedObject.overlapsWith(d);
  });
  selectItems.classed('hovered', true);
  itemsGroup.selectAll('.item').sort(function(d1, d2) { return selectedObject.overlapsWith(d1) ? 1 : -1; });
};*/

/**
 */
/*epiviz.ui.charts.Visualization.prototype.doUnhover = function() {
  this._svg.select('.items').classed('unhovered', false);
  this._svg.select('.items').selectAll('.item').classed('hovered', false);
};*/

/**
 * @param {epiviz.ui.charts.ChartObject} selectedObject
 */
/*epiviz.ui.charts.Visualization.prototype.doSelect = function(selectedObject) {
  var itemsGroup = this._svg.select('.items');
  var selectItems = itemsGroup.selectAll('.item').filter(function(d) {
    return selectedObject.overlapsWith(d);
  });
  selectItems.classed('selected', true);
};*/

/**
 */
/*epiviz.ui.charts.Visualization.prototype.doDeselect = function() {
  this._svg.select('.items').selectAll('.selected').classed('selected', false);
};*/

/**
 * @param {epiviz.ui.charts.VisObject} selectedObject
 */
epiviz.ui.charts.Visualization.prototype.doHover = function(selectedObject) {
  var itemsGroup = this._container.find('.items');
  var unselectedHoveredGroup = itemsGroup.find('> .hovered');
  var selectedGroup = itemsGroup.find('> .selected');
  var selectedHoveredGroup = selectedGroup.find('> .hovered');

  var filter = function() {
    return selectedObject.overlapsWith(d3.select(this).data()[0]);
  };
  var selectItems = itemsGroup.find('> .item').filter(filter);
  unselectedHoveredGroup.append(selectItems);

  selectItems = selectedGroup.find('> .item').filter(filter);
  selectedHoveredGroup.append(selectItems);
};

/**
 */
epiviz.ui.charts.Visualization.prototype.doUnhover = function() {
  var itemsGroup = this._container.find('.items');
  var unselectedHoveredGroup = itemsGroup.find('> .hovered');
  var selectedGroup = itemsGroup.find('> .selected');
  var selectedHoveredGroup = selectedGroup.find('> .hovered');

  itemsGroup.prepend(unselectedHoveredGroup.children());

  selectedGroup.prepend(selectedHoveredGroup.children());
};

/**
 * @param {epiviz.ui.charts.ChartObject} selectedObject
 */
epiviz.ui.charts.Visualization.prototype.doSelect = function(selectedObject) {
  var itemsGroup = this._container.find('.items');
  var unselectedHoveredGroup = itemsGroup.find('> .hovered');
  var selectedGroup = itemsGroup.find('> .selected');
  var selectedHoveredGroup = selectedGroup.find('> .hovered');

  var filter = function() {
    return selectedObject.overlapsWith(d3.select(this).data()[0]);
  };
  var selectItems = itemsGroup.find('> .item').filter(filter);
  selectedGroup.append(selectItems);

  selectItems = unselectedHoveredGroup.find('> .item').filter(filter);
  selectedHoveredGroup.append(selectItems);
};

/**
 */
epiviz.ui.charts.Visualization.prototype.doDeselect = function() {
  var itemsGroup = this._container.find('.items');
  var unselectedHoveredGroup = itemsGroup.find('> .hovered');
  var selectedGroup = itemsGroup.find('> .selected');
  var selectedHoveredGroup = selectedGroup.find('> .hovered');

  itemsGroup.prepend(selectedGroup.find('> .item'));
  unselectedHoveredGroup.prepend(selectedHoveredGroup.children());
};

/**
 * @returns {epiviz.events.Event.<epiviz.ui.charts.VisEventArgs>}
 */
epiviz.ui.charts.Visualization.prototype.onSave = function() { return this._save; };

/**
 * @returns {epiviz.events.Event.<epiviz.ui.charts.VisEventArgs>}
 */
epiviz.ui.charts.Visualization.prototype.onRemove = function() { return this._remove; };

/**
 * @returns {epiviz.events.Event.<epiviz.ui.charts.VisEventArgs.<epiviz.ui.charts.ColorPalette>>}
 */
epiviz.ui.charts.Visualization.prototype.onColorsChanged = function() { return this._colorsChanged; };

/**
 * @returns {epiviz.events.Event.<epiviz.ui.charts.VisEventArgs.<Object.<string, string>>>}
 */
epiviz.ui.charts.Visualization.prototype.onMethodsModified = function() { return this._methodsModified; };

/**
 * @returns {epiviz.events.Event.<epiviz.ui.charts.VisEventArgs>}
 */
epiviz.ui.charts.Visualization.prototype.onMethodsReset = function() { return this._methodsReset; };

/**
 * @returns {epiviz.events.Event.<Array.<epiviz.ui.charts.markers.VisualizationMarker>>}
 */
epiviz.ui.charts.Visualization.prototype.onMarkersModified = function() { return this._markersModified; };

/**
 * @returns {epiviz.events.Event.<epiviz.ui.charts.VisEventArgs.<Object.<string, *>>>}
 */
epiviz.ui.charts.Visualization.prototype.onCustomSettingsChanged = function() { return this._customSettingsChanged; };

/**
 * @returns {epiviz.events.Event.<epiviz.ui.charts.VisEventArgs.<{width: (number|string), height: (number|string)}>>}
 */
epiviz.ui.charts.Visualization.prototype.onSizeChanged = function() { return this._sizeChanged; };

/**
 * @returns {epiviz.events.Event.<epiviz.ui.charts.VisEventArgs.<epiviz.ui.charts.Margins>>}
 */
epiviz.ui.charts.Visualization.prototype.onMarginsChanged = function() { return this._marginsChanged; };

/**
 * @returns {epiviz.events.Event.<epiviz.ui.charts.VisEventArgs>}
 */
epiviz.ui.charts.Visualization.prototype.onDataWaitStart = function() { return this._dataWaitStart; };

/**
 * @returns {epiviz.events.Event.<epiviz.ui.charts.VisEventArgs>}
 */
epiviz.ui.charts.Visualization.prototype.onDataWaitEnd = function() { return this._dataWaitEnd; };

/**
 * @enum {string}
 */
epiviz.ui.charts.Visualization.CustomSettings = {
  TITLE: 'title',
  MARGIN_LEFT: 'marginLeft',
  MARGIN_RIGHT: 'marginRight',
  MARGIN_TOP: 'marginTop',
  MARGIN_BOTTOM: 'marginBottom',
  X_MIN: 'xMin',
  X_MAX: 'xMax',
  Y_MIN: 'yMin',
  Y_MAX: 'yMax',
  COL_LABEL: 'colLabel',
  ROW_LABEL: 'rowLabel'
};


/***/ }),
/* 82 */
/***/ (function(module, exports) {

/**
 * Created by Florin Chelaru ( florinc [at] umd [dot] edu )
 * Date: 4/1/14
 * Time: 3:31 PM
 */

goog.provide('epiviz.ui.controls.VisConfigSelection');

/**
 * @param {epiviz.measurements.MeasurementSet} [measurements]
 * @param {string} [datasource]
 * @param {string} [datasourceGroup]
 * @param {string} [dataprovider]
 * @param {Object.<string, string>} [annotation]
 * @param {string} [defaultChartType]
 * @param {number} [minSelectedMeasurements]
 * @param {T} [customData]
 * @constructor
 * @struct
 * @template T
 */
epiviz.ui.controls.VisConfigSelection = function(measurements, datasource, datasourceGroup, dataprovider, annotation, defaultChartType, minSelectedMeasurements, customData) {
  /**
   * @type {epiviz.measurements.MeasurementSet}
   */
  this.measurements = measurements;

  /**
   * @type {string}
   */
  this.datasource = datasource;

  /**
   * @type {string}
   */
  this.datasourceGroup = datasourceGroup;

  /**
   * @type {string}
   */
  this.dataprovider = dataprovider;

  /**
   * @type {Object.<string, string>}
   */
  this.annotation = annotation;

  /**
   * @type {string}
   */
  this.defaultChartType = defaultChartType;

  /**
   * @type {number}
   */
  this.minSelectedMeasurements = minSelectedMeasurements || 1;

  /**
   * @type {T}
   */
  this.customData = customData;
};


/***/ }),
/* 83 */
/***/ (function(module, exports) {

/**
 * Created by Jayaram Kancherla ( jkanche [at] umd [dot] edu )
 * Date: 4/6/2016
 */

goog.provide('epiviz.ui.PrintManager');

epiviz.ui.PrintManager = function(ctrId, fName, fType) {

    /**
     * DOM ID to print
     * @type {string}
     */
    this._containerId = ctrId ? ctrId : 'pagemain';

    /**
     * File Name for the screenshot/chart
     * @type {string}
     */
    this._fName = fName ? fName : "epiviz_" + Math.floor($.now() / 1000);

    /**
     * File Format to save (pdf, png)
     * @type {string}
     */
    this._fType = fType ? fType : "pdf";
};

epiviz.ui.PrintManager.prototype.print = function() {

    var self = this;

    var container = $('#' + self._containerId);

    function inline_styles(dom) {
        var used = "";
        var sheets = document.styleSheets;
        for (var i = 0; i < sheets.length; i++) {
            var rules = sheets[i].cssRules;
            for (var j = 0; j < rules.length; j++) {
                var rule = rules[j];
                if (typeof(rule.style) != "undefined") {
                    var elems = dom.querySelectorAll(rule.selectorText);
                    if (elems.length > 0) {
                        used += rule.selectorText + " { " + rule.style.cssText + " }\n";
                    }
                }
            }
        }

        $(dom).find('style').remove();

        var s = document.createElement('style');
        s.setAttribute('type', 'text/css');
        s.innerHTML = "<![CDATA[\n" + used + "\n]]>";

        //dom.getElementsByTagName("defs")[0].appendChild(s);
        dom.insertBefore(s, dom.firstChild);
    }

    //add inline styles to svg elements
    function custom_styles(dom) {

        // style axes lines
        var axes = $(dom).find('.domain');
        axes.each(function () {
            $(this).css({"fill": "none", "stroke-width": "1px", "stroke": "#000000", "shape-rendering": "crispEdges"});
        });

        //remove gene name labels
        var gLabels = $(dom).find('.gene-name');
        gLabels.each(function () {
            $(this).remove();
        });

        // fill path on single line tracks
        var lines = $(dom).find('.line-series-index-0 path');
        lines.each(function() {
            $(this).css({"fill": "none"});
        });

        //change text size to fit screen
        var texts = $(dom).find('text');
        texts.each(function(){
            $(this).css({"font-size": "11px"});
        });

        var cLegends = $(dom).find('.chart-legend');
        cLegends.each(function() {
            $(this).css({"border": "none", "background": "transparent"});
        })
    }

    // html2canvas has issues with svg elements on ff and IE.
    // Convert svg elements into canvas objects, temporarily hide the svg elements for html2canvas to work and
    // finally remove all dom changes!
    // TODO: this feature does not work all the time in FF!

    var svgElems = container.find('svg');

    svgElems.each(function () {
        var canvas, xml;

        canvas = document.createElement("canvas");
        canvas.className = "tempCanvas";

        custom_styles(this);

        // Convert SVG into a XML string
        xml = new XMLSerializer().serializeToString(this);

        // Removing the name space as IE throws an error
        //xml = xml.replace(/xmlns=\"http:\/\/www\.w3\.org\/2000\/svg\"/, '');

        //draw the canvas object created from canvg
        canvg(canvas, xml, {
            useCORS: true,
            renderCallback: function() {
                $(canvas).insertAfter(this);
                $(this).hide();
            }
        });
    });

    // use html2canvas to take a screenshot of the page!
    html2canvas(container, {
        //allowTaint: true,
        //taintTest: false,
        timeout: 0,
        //logging: true,
        useCORS: true
    }).then(function (canvas) {

        var ctx = canvas.getContext("2d");
        ctx.mozImageSmoothingEnabled = false;
        ctx.imageSmoothingEnabled = false;

        var filename = self._fName + "." + self._fType;
        var format = self._fType;
        var image = canvas.toDataURL("image/png");

        if(format == "pdf") {

            var dWidth = container.width() > 1200 ? container.width() : 1200;
            var dHeight = container.height() > 780 ? container.height() : 780;

            var jsdoc = new jsPDF('l', 'px', [dWidth * 0.6, dHeight * 0.65]);

            function toDataUrl(url, callback, outputFormat){
                var img = new Image();
                //img.crossOrigin = 'Anonymous';
                img.onload = function(){
                    var canvas = document.createElement('canvas');
                    var ctx = canvas.getContext('2d');
                    var dataURL;
                    canvas.height = this.height;
                    canvas.width = this.width;
                    ctx.drawImage(this, 0, 0);

                    dataURL = canvas.toDataURL(outputFormat);
                    callback(dataURL);
                    canvas = null;
                };
                img.src = url;
            }

            //TODO: save workspace if user is not signed in and get workspace id
            var ws_id = "abcdef";
            var s_url ="http://epiviz.org/?ws=" + ws_id;

            /*      toDataUrl(window.location.href + '/img/epiviz_4_logo_medium.png', function(imgData) {
             jsdoc.addImage(imgData, 'PNG', 20, 20, 100, 21);
             });*/

            jsdoc.addImage("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOYAAAAyCAYAAABIxaeCAAASqElEQVR4nO2de5QU1Z3Hv/Wurn5M9wxvGBwGBUVF4hBFgwkaZOPukRBdGBaDkpUdY7LGaDxCEjUxehSMxizHF8QHMasug9mYaKJBRKMm7LKALwQxMCAPcXAe/Ziuqdet2j+qi+npqemZ7q7u6eH055w6Z7rurXtv99S37r2/3+/eouoa1++nYb3GmOoWXj62JV417TiGIf6WZpGtOfMCwgUu0rmqGSbFTTZpZiRtkpE662c5ImsmzXXQpn4QwE7a1LYInbs2x0fNjg1luw89s2goq69QplC1SzZYJz5ZxGIs/QPaNLbQlvEnoXPXX+KjZmtD2L6s+FuaeTJh7nxCc4tNmr+M0IKUy/WMqRmAuYkzkk/y0T0vxEfNJsVqqwesyPg74pJnJYDVpWlOhWwU+sDtLcwMGFProE3tGdoyH1S50IGCavKQquj7I5TApBsNWmgiND/KizIZUz3AEfk+vvPDJ8vkYVQPYCH6F6EbFWGWCYUKk86WSGi+WmcDN6hc4GNY5Klg8sCpBdVWOAGOyPd0VZ1xQGWDt3klSgAgtDBJ4SKPJmsa9opax1COLyMA1gLYD2AVBi/KcmUu7O9iAeiA/bCpMADs4LLRLCgsk6UJSwQjtkbs+uTOWHh6V3Gb1htBjzeqXOAXOiON6y8PYyqttGnsBqwDAN3JmIpMGJ8AIGxS9DhCcWeBYuqy1UMYXx1hfBs4I/ltXo9+O+kb/7HX3yULTbBFebIQAdCMnoeL8/lSAJtL3JZVsEcfO1L1d5a4/pwYpDBtCMXxhK26xQhNvTIgH1reJU3cUqyGOQTkwyNUvvoRlQv1edIyphZlTeUlg/H9WVTb3k6KYw+StDGADn+f8vzKsTEKXzOf0OwCAHMBmnOrV2f9F5s0926wa9/Pdv/hxz+vXbKh2PPPZgzcm2xGzw29DmV+cwFogHuP34DSC7Mpre4mlPmQP+scMysWMUU9tlqQj9wRC083PG4XAEBSWy9TufCThBbG9Jw1TcFIvgqLPEbtf+Fl5fRlar7lhzreGZesOr0JFHN9tmGxpLa+xcX3L42NvPCTfOvKQgTAq7BvGDdaYIuwrG+kfojAHsZmivOk7zELNv6c8Y37r9TZqikmRTWAYubojFSTSwEM6d4qah2NSd/4wwW1JA1/SzNLJsy9W+GqbgXFUPZZUxOMrv9kiLJaFkZ5OryU1FYfYXxNKhtYCdBj3PJwRI5yRvIaWRj5Bw+rHkiU18EW5XBmLmxRNMAWw3UANg5pi0qAF1bZEx8OP9tIn7bwsRmEYv/FpPnFhBYmDKYQxtRaBa3jSlkc89eCWgMg2LV/lOwb9zxhfBfZZ0xIavvvGC16ayJ42r5Cy8+GqHUEFL56JSxyCyhG6JPBIpZfPX7vR//9/Ts8Gtr2N3xtgf1Ub/GgjgpDgKfCTMff0kyTCV+do7P+fyc0Px+gmexFmaqoRb+r8NVP5NsYv3JshsJX/57QwsRUme/4ldabk+LYN/ItMx9EreNUnfU/TGhhnlu6pLS+TLdubew6ZUGigGpWwO5JMmkBMBPlP3+skIWiuUuS9YtMha/ZQmjxCn/3p1M5I/kEYOpZihIUPvy4YMTvOvxsI5VrQ0St/QpFGPE2oYWJsIgiGImbAXpmqUUJAApfve/gf139NcbUrgPMPuKTxdGX6eMv+VtV27ZJeVYRQe+AAYdODAOLYYXik9WP6ZD0Tdivs/7lweQn0xhTa4btk3ItTmVDt9U3PvVk6OgmV2tnJoefbaQ4o+s2hQs/TyjOz5jadlHvbFDZ4IMAzMF+Ea+pXbLBIjS/jiHqOQzp3pqZrrKhs7qqp28V9c7+5ofZyBa5MxTDVyeQwfE3ph/7U2kV/2MJGZQwHRL+SfsIzTeKWvtFjKl80F8+nZGWdY+Z/UJV27asIXKho5u4Uxeu/bXOBu4CRYEx1XsJzV+g8CN259KuYkIY3wHxkxe/zBH5XmQ8KAgtjtbZwOui1v7VHIqMoMd0n45jfS0lK2A7/ZthD6vrXfLUp9KaU3nd2p6NV9Fb6K9mpG9Pnd+eY7n9EYHdTgu9RyWrUueaB7g288E02KMD7qOgvMhJmA4KX/NX/7E3GwQj9kNYRHHLozPSP3ZFzn45FN8Tckuv6tjp7x79pd+rXHgpgChHlAWEFn4EoCiul0JI1i8ydEb6kai1L2BMLZ6eRiguqHOhP4lax2B7lIVw7y1L6Q6phy2EXCOLnKik7XAXcT4437sB/Vunc6EJdjs7UdoHXQT27znXi8LyEiYAxMfP01W2apWoR7/ImOp7bnkI4/ty0l+3JSAfHpF+PhT/qEauOv01nfVfxpjqXsFInKczkpduiKKg8DUvBmK7ZwlGYm/6eUJxvMJVPScYsW8Oohi3f1wnSudCaIAtrEJE4EUZDhvRM3z3Yrjs9OibkftcvRMAleexI1WGF79J/sJ0UPiaXYHOD84XjPgatykhYXwN3eLINyWldRwA+Ls/HZ0M1L2hM9L5HJHflLo/vVBlg38vtB2lIhaZsUdo3Xq+YMT/2CuBYhiVrVov6NFrByjC7R+Xz02UDw2wh5JuveQ6AIvQ94ZbCfeHhuOD9aLndMovVJhz0dOeUvpKG9Lq9SRwomBhAkCsZqaqsqEbRS26GBbpE0NLaPEMlY+8LSmtkylLNwBYgpF4TorunpfwT+rwog2lJD5+Xow99Mp8zkjck/EwYlQ2+CtBj17fz6URuN/IO1zOFYO16CvKHQAmo3/H/2rYgnXzqzqxr4Xi1OusqMkX59oWlE6Y9eiJB94Ij/6XngjTQeGrN0jq57MYU+kTukZofpLKh9/Suaox/rbtX9jXvPyqWM3MvMPphppk/SJTZ4M/9iut19rrOlNQDKVy4YcFPXqDy2X9zeccw0ShRzbjwwr07a03w/aZDsYSvBnu4nRiTwthB3puaC+EWcq5ZTNsce6A/XDzBE+FCQCyOOZDqfvYLMZUt2WmEVoYazDSm1r49Ia8Y3TLjKQ49klJPnw5YyrpIwVK5UJrBD36w4zsXhlM8iFTtJ2we8JccCKSMofdXlgj04ez+fxOjtEnvaxi44RTtsD+LT2bjnguTABI+Cd9JiU/uZgj8kuZafYaz9BrotZ+STHqHgoSgcmvBGIffYUzEp/1nKWhcuF7BD16fz4BFx7jZgleifxupBb0tSAXOgRFqkynPfmU5VyzGaXxBTsWWOcB52mdRREmACSCU2Qpse8bjKU/k5lGaD5guxjav16s+ktNLDJjp9T+7gWCHt+Tfl7lwj+oa1z/XCi+x4ehi33NtAQX6kpwu9YrCy2Q+9C4Hj3fsRS9ZRN6RgkrUQQbQdGECQCx8HSDfv/RazgjsT4zjVCcoHOh34pa29XFbEMx8XcfCXFGcpNgJDZw761hYqMvOih8vm22oEffSs9HGF9jt/+UvwhGvO8CUZvJyN9Mn3705wt1m1sWQif63oxe+O/SjUC5lJdu9Cn2/HIuehazryxWfUUVJgDo53yP6GzwXwUj9lhmGqE4RuEi6zkjcXOx2+E1ghGbqAij3tZZ/6Um6LFS7WwRAOLj5nawhzfNE7WOXk9unZG+qLKh1wGz1aU4T3xfWcics3nxhM8sw4stUNKHobkMZ50etti9pWOBBYq8Rrbowkxh7Wtu+o5gxH/ZJ4ViKJ0NPiAYiYe499YMsIKlPBC1tvMMRvpfQvNnc0byZSn64ddi1ecmnfRk/SLl789fv1hSjz+Y4U6pYUzdLUzRk2iRLGSKxgsjReaw3CvDltMD5RJJVQrfZfo2KZvhoQXWjZy2FimE2iUbLBW4SdCjXSoXui3zmaCywe9yZy2vFbWOqxS+uqT7CeWCYMSvUfgRjwLwCUbiN0Lr1mtj4+f1WXVTu2SDKQM3S8pnB2Vh5C9AMamHDhVwKXYh8jfGDMRQWoLzYR16gvybMPBQ0RFwusulGDTDHtk4OyC48sz/3AUAeGvyXdnKWgbglLTPd6bOrXdOlKrHPIHKhW8XtegNgNlnobHOSPN1NrBVUluHeje+PviVYyJH5LUqG1oPwCepnz+wr3n5NXEXUaYji2PWSFrbQlhEBgBC8xSAZEa2CIbf6o1MwXtl2OpEzxx4oN8kgtIYfdam6nHcIoUwA8BTAH6aOuoAhAE8mJ6p5MIEAIWvfkjUOhYzlt4nAJ7Q/FkqF/k/Ueu4bCja5kZAPjRT4cI7dEZqYiydiFrHDbIw8pbB+mJlYfTvBCNxMSxyHLD363XJNty2qsycF3tpcXZENtelnnRKEbC+IlWPV26RdAFGAdwE4EbY4jzBkAgTABR+xPOi2nYJY2qfZaYRmg8rfPVLHJHvr2rf3neLjxIRTHzMiXrnnd2+sVsJ45vGmFpcVI5frvDVD+ValsqFtzGmNosxtY8IzdcCZuZw3Vm5MRyoR1/BeDmMHGxgu5O2EcWZBixEzy4T16Hw7zgndTg4NpfvZ2YcMmECQFIcu1XQY+dxRH7XJZnWGekHXZGztola25mlbpuktn5F9te9o3CROwjFsYypfOxTW2clfeNfzrdMwvgOCFrHhRyRtzBEddvt3VmwXO64tdHroeRAge3py8SKMYytR2+3iBd1PJX290EA/wG7Bw1nZhxSYQKALIw8LMpHvsQReb1bOqHF6Qo/YidnJFdXRd93M5x4ir/76BSOyL+VhdGvE5o/EwAEI/HHQPzj87t8tXsGun4gZHFMp5TY9w+gmF8zlr7XJcsquO8FVC64xcZuhveGF2do2l9UUbrv0uutMJ2VMxF45xZZBns+6XAnbEEuc8s85MIE7CghnZG+JWrt/8ZYerdLFl5n/bd2haZ+JBiJb/pbmj23Jvu7j0zjjMTTSd/YD3VGugIAxVi6IWptK/c1L788Fp4e9aquWHi6QWj+Zto07odF3LbiXAHv1jt6SbofL51i+PPSBZdNmMWYWzqB6V65RTKNO+/CtsDW9XdBWQjTQeFrHpfkIzMZU9nplk5oYbzKBn+j1C3YK+jR71RF3xcLqc/f0syLWvuVnJHclPSN26WzwaUAzQIAY6oHReX4xQo/YnWxAu51xve4/Z4U8x2XZGcxcjOK4+d0RDZYd8pCuO9csBHF27w53QiUbhhrSrWjGEYfxwKb1S2SI5nGnZsGuqCshAkACf+k3VLy0CxBj97NWLrrW7cIzderXPjhrtDUY5J6/Olg1/75/pbmQYm06vO/jRW19kbBiD+t1C1oVfia53XWfylAOxtLgyPyE/6ulnOSvvFve/fN3FGEke8B9Lnofw6zED375ji7iRe6zCq97P2p8lfAXaQrUunp7yBx8HSpkwvOayAy90lKD1j30ujj/LbOKhovCKO3ceeN1JGVkgUY5EIiOEUHcLu/++gGjY+s1RnpQrd8hBbCsjBqKYRRSxlpgiYYsd0APqBM8ilgRQHLsihWMhgpDJhTAHpqbMT5k0C5BxgxpnZA0KPfk4VRL+mhMwbV1lz2D514VdY1xYsw8EuF0o0ubvnyfQ3fXPTsmD5YSvVyno2wf5eFsL9bsQLWnS1Fvd5CNNO4863BXFSWwnRI+sbvOvxs4+zT/vmRxTrrX0VocWJ/eQkt8IQWZsB24OYEY2px2jJ+7mvf+UB81Gy3OW6pWAe7F1iF8g442Ai7pyzFdijrYAuzAfZv4sy7vd6lwFka1wLvfLJ16G3cWQ/bGjsgZTeUzaR2yQZL4WueC3TumiIYsRsY0n3Uq7I5In8uGImfSfKROp2R7h5iUTo40SWTUbwwPSC/DcB2wG6bp4uCB1GnM4dtRs+oweu5pSPGehSwi8RVs263rpp1u/PwSHePOMEEg6Lshelg7ytU9RC961f1wa79S0WtYyusPF4fYhEiau2vBRN7rybvPlKrssGfJAL15bjzubMguRo9m2I5hxftdSJZ0st2Y0cqbWbqGIoXAi1CbwPTanhvCd4Mbx+Ec9A3mGDQlv1+310yHAjIh6Z2i2O+Dor6JwAXEopzHZozptZGm9prNMw/892fvZIITjnmVRs8nGMWi3rYBp50Toa3iJUlThA7gHfQM606COAL6CvMOQBeT/t8YqeLsp5jDkSXNHEvgPsA3Bc89KLPHHnuNItiphFWCsMyaZPmj8Ii77c0L99Xu2SDCQBq0HX/6QoVvGQZets67kQOvSUwzIWZTmLi5d3oZ+nPcB4VVBiW/CTtbyeYICdOGmFWqFAmLEDviJ6D6C3UdOoyPp/Ixxb6Hr8KFSr04pyMzwtSx2D4qfPHsLHKVqgwTOiz2Xk+VIayFSp4y3rYkT6D2Zo1jN5GojecPyrCrFDBe36JnkXQ2ZiD3u6Si50/KkPZChXKkIowK1QoQyrCrFChDKEs66R46VaFCmXBW5PPziX7HJyMIXkVKgxzouhn0fT/A3tQ05HQIpHYAAAAAElFTkSuQmCC", 'PNG', 20, 20, 100, 21);
            jsdoc.setFontSize(10);
            jsdoc.text(150, 25, "Chromosome: Location");
            jsdoc.setFontSize(14);
            jsdoc.text(150, 40, $('#chromosome-selector').val() + ' : ' + $('#text-location').val());
            jsdoc.setTextColor(0, 0, 255);
            jsdoc.setFontSize(16);
            //jsdoc.text(550, 40, s_url);
            jsdoc.setTextColor(0, 0, 0);
            jsdoc.setFontSize(10);
            jsdoc.text(350, 25, "Workspace ID");
            jsdoc.setFontSize(14);
            jsdoc.text(350, 40, $('#save-workspace-text').val());
            jsdoc.addImage(image, 'PNG', 15, 55);
            jsdoc.save(filename);

        }
        else {

            if (navigator.msSaveBlob) {
                // IE 10+
                var image_blob = canvas.msToBlob();
                var blob = new Blob([image_blob], {type: "image/png"});
                navigator.msSaveBlob(blob, filename);
            }
            else {
                var blob = new Blob([image], {type: "image/png"});
                var link = document.createElement("a");

                if (link.download !== undefined) {
                    // check if browser supports HTML5 download attribute
                    var url = URL.createObjectURL(blob);
                    link.setAttribute("href", image);
                    link.setAttribute("download", filename);
                    link.style = "visibility:hidden";
                    link.setAttribute("target", "_blank");
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }
                else {
                    var image_octet = image.replace("image/png", "image/octet-stream");
                    window.open(image_octet);
                }
            }
        }

        // remove all changes made to the DOM
        container.find('.tempCanvas').remove();
        svgElems.each(function () {
            $(this).show();
        });
    });
};

/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Created by Florin Chelaru ( florinc [at] umd [dot] edu )
 * Date: 2/25/14
 * Time: 10:37 PM
 */

/*
 Based on ndef.parser, by Raphael Graf(r@undefined.ch)
 http://www.undefined.ch/mparser/index.html

 Ported to JavaScript and modified by Matthew Crumley (email@matthewcrumley.com, http://silentmatt.com/)

 You are free to use and modify this code in anyway you find useful. Please leave this comment in the code
 to acknowledge its original source. If you feel like it, I enjoy hearing about projects that use my code,
 but don't feel like you have to let me know or ask permission.
 */

//  Added by stlsmiths 6/13/2011
//  re-define Array.indexOf, because IE doesn't know it ...
//
//  from http://stellapower.net/content/javascript-support-and-arrayindexof-ie
if (!Array.indexOf) {
  Array.prototype.indexOf = function (obj, start) {
    for (var i = (start || 0); i < this.length; i++) {
      if (this[i] === obj) {
        return i;
      }
    }
    return -1;
  }
}

goog.provide('epiviz.utils.ExpressionParser');

epiviz.utils.ExpressionParser = (function (scope) {
  function object(o) {
    function F() {}
    F.prototype = o;
    return new F();
  }

  var TNUMBER = 0;
  var TOP1 = 1;
  var TOP2 = 2;
  var TVAR = 3;
  var TFUNCALL = 4;

  function Token(type_, index_, prio_, number_) {
    this.type_ = type_;
    this.index_ = index_ || 0;
    this.prio_ = prio_ || 0;
    this.number_ = (number_ !== undefined && number_ !== null) ? number_ : 0;
    this.toString = function () {
      switch (this.type_) {
        case TNUMBER:
          return this.number_;
        case TOP1:
        case TOP2:
        case TVAR:
          return this.index_;
        case TFUNCALL:
          return "CALL";
        default:
          return "Invalid Token";
      }
    };
  }

  function Expression(tokens, ops1, ops2, functions) {
    this.tokens = tokens;
    this.ops1 = ops1;
    this.ops2 = ops2;
    this.functions = functions;
  }

  // Based on http://www.json.org/json2.js
  var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
    escapable = /[\\\'\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
    meta = {    // table of character substitutions
      '\b': '\\b',
      '\t': '\\t',
      '\n': '\\n',
      '\f': '\\f',
      '\r': '\\r',
      "'" : "\\'",
      '\\': '\\\\'
    };

  function escapeValue(v) {
    if (typeof v === "string") {
      escapable.lastIndex = 0;
      return escapable.test(v) ?
        "'" + v.replace(escapable, function (a) {
          var c = meta[a];
          return typeof c === 'string' ? c :
            '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        }) + "'" :
        "'" + v + "'";
    }
    return v;
  }

  Expression.prototype = {
    simplify: function (values) {
      values = values || {};
      var nstack = [];
      var newexpression = [];
      var n1;
      var n2;
      var f;
      var L = this.tokens.length;
      var item;
      var i = 0;
      for (i = 0; i < L; i++) {
        item = this.tokens[i];
        var type_ = item.type_;
        if (type_ === TNUMBER) {
          nstack.push(item);
        }
        else if (type_ === TVAR && (item.index_ in values)) {
          item = new Token(TNUMBER, 0, 0, values[item.index_]);
          nstack.push(item);
        }
        else if (type_ === TOP2 && nstack.length > 1) {
          n2 = nstack.pop();
          n1 = nstack.pop();
          f = this.ops2[item.index_];
          item = new Token(TNUMBER, 0, 0, f(n1.number_, n2.number_));
          nstack.push(item);
        }
        else if (type_ === TOP1 && nstack.length > 0) {
          n1 = nstack.pop();
          f = this.ops1[item.index_];
          item = new Token(TNUMBER, 0, 0, f(n1.number_));
          nstack.push(item);
        }
        else {
          while (nstack.length > 0) {
            newexpression.push(nstack.shift());
          }
          newexpression.push(item);
        }
      }
      while (nstack.length > 0) {
        newexpression.push(nstack.shift());
      }

      return new Expression(newexpression, object(this.ops1), object(this.ops2), object(this.functions));
    },

    substitute: function (variable, expr) {
      if (!(expr instanceof Expression)) {
        expr = new Parser().parse(String(expr));
      }
      var newexpression = [];
      var L = this.tokens.length;
      var item;
      var i = 0;
      for (i = 0; i < L; i++) {
        item = this.tokens[i];
        var type_ = item.type_;
        if (type_ === TVAR && item.index_ === variable) {
          for (var j = 0; j < expr.tokens.length; j++) {
            var expritem = expr.tokens[j];
            var replitem = new Token(expritem.type_, expritem.index_, expritem.prio_, expritem.number_);
            newexpression.push(replitem);
          }
        }
        else {
          newexpression.push(item);
        }
      }

      var ret = new Expression(newexpression, object(this.ops1), object(this.ops2), object(this.functions));
      return ret;
    },

    /**
     * @param {Object.<string, number>} values
     * @returns {number}
     */
    evaluate: function (values) {
      values = values || {};
      var nstack = [];
      var n1;
      var n2;
      var f;
      var L = this.tokens.length;
      var item;
      var i = 0;
      for (i = 0; i < L; i++) {
        item = this.tokens[i];
        var type_ = item.type_;
        if (type_ === TNUMBER) {
          nstack.push(item.number_);
        }
        else if (type_ === TOP2) {
          n2 = nstack.pop();
          n1 = nstack.pop();
          f = this.ops2[item.index_];
          nstack.push(f(n1, n2));
        }
        else if (type_ === TVAR) {
          if (item.index_ in values) {
            nstack.push(values[item.index_]);
          }
          else if (item.index_ in this.functions) {
            nstack.push(this.functions[item.index_]);
          }
          else {
            throw new Error("undefined variable: " + item.index_);
          }
        }
        else if (type_ === TOP1) {
          n1 = nstack.pop();
          f = this.ops1[item.index_];
          nstack.push(f(n1));
        }
        else if (type_ === TFUNCALL) {
          n1 = nstack.pop();
          f = nstack.pop();
          if (f.apply && f.call) {
            if (Object.prototype.toString.call(n1) == "[object Array]") {
              nstack.push(f.apply(undefined, n1));
            }
            else {
              nstack.push(f.call(undefined, n1));
            }
          }
          else {
            throw new Error(f + " is not a function");
          }
        }
        else {
          throw new Error("invalid Expression");
        }
      }
      if (nstack.length > 1) {
        throw new Error("invalid Expression (parity)");
      }
      return nstack[0];
    },

    /**
     * Evaluates the expression for each of the tuple of values in the given arrays
     * @param {Object.<string, Array.<number>>} values
     * @returns {Array.<number>}
     */
    evaluateArr: function(values) {
      var result = [];
      var finished = false;
      while (!finished) {
        var tuple = {};
        for (var v in values) {
          if (!values.hasOwnProperty(v)) { continue; }
          if (result.length >= values[v].length) {
            finished = true;
            break;
          }

          tuple[v] = values[v][result.length];
        }

        if (!finished) {
          result.push(this.evaluate(tuple));
        }
      }

      return result;
    },

    toString: function (toJS) {
      var nstack = [];
      var n1;
      var n2;
      var f;
      var L = this.tokens.length;
      var item;
      var i = 0;
      for (i = 0; i < L; i++) {
        item = this.tokens[i];
        var type_ = item.type_;
        if (type_ === TNUMBER) {
          nstack.push(escapeValue(item.number_));
        }
        else if (type_ === TOP2) {
          n2 = nstack.pop();
          n1 = nstack.pop();
          f = item.index_;
          if (toJS && f == "^") {
            nstack.push("Math.pow(" + n1 + "," + n2 + ")");
          }
          else {
            nstack.push("(" + n1 + f + n2 + ")");
          }
        }
        else if (type_ === TVAR) {
          nstack.push(item.index_);
        }
        else if (type_ === TOP1) {
          n1 = nstack.pop();
          f = item.index_;
          if (f === "-") {
            nstack.push("(" + f + n1 + ")");
          }
          else {
            nstack.push(f + "(" + n1 + ")");
          }
        }
        else if (type_ === TFUNCALL) {
          n1 = nstack.pop();
          f = nstack.pop();
          nstack.push(f + "(" + n1 + ")");
        }
        else {
          throw new Error("invalid Expression");
        }
      }
      if (nstack.length > 1) {
        throw new Error("invalid Expression (parity)");
      }
      return nstack[0];
    },

    variables: function () {
      var L = this.tokens.length;
      var vars = [];
      for (var i = 0; i < L; i++) {
        var item = this.tokens[i];
        if (item.type_ === TVAR && (vars.indexOf(item.index_) == -1)) {
          vars.push(item.index_);
        }
      }

      return vars;
    },

    toJSFunction: function (param, variables) {
      var f = new Function(param, "with(Parser.values) { return " + this.simplify(variables).toString(true) + "; }");
      return f;
    }
  };

  function add(a, b) {
    return Number(a) + Number(b);
  }
  function sub(a, b) {
    return a - b;
  }
  function mul(a, b) {
    return a * b;
  }
  function div(a, b) {
    return a / b;
  }
  function mod(a, b) {
    return a % b;
  }
  function concat(a, b) {
    return "" + a + b;
  }

  function neg(a) {
    return -a;
  }

  function random(a) {
    return Math.random() * (a || 1);
  }
  function fac(a) { //a!
    a = Math.floor(a);
    var b = a;
    while (a > 1) {
      b = b * (--a);
    }
    return b;
  }

  // TODO: use hypot that doesn't overflow
  function pyt(a, b) {
    return Math.sqrt(a * a + b * b);
  }

  function append(a, b) {
    if (Object.prototype.toString.call(a) != "[object Array]") {
      return [a, b];
    }
    a = a.slice();
    a.push(b);
    return a;
  }

  function Parser() {
    this.success = false;
    this.errormsg = "";
    this.expression = "";

    this.pos = 0;

    this.tokennumber = 0;
    this.tokenprio = 0;
    this.tokenindex = 0;
    this.tmpprio = 0;

    this.ops1 = {
      "sin": Math.sin,
      "cos": Math.cos,
      "tan": Math.tan,
      "asin": Math.asin,
      "acos": Math.acos,
      "atan": Math.atan,
      "sqrt": Math.sqrt,
      "log": Math.log,
      "abs": Math.abs,
      "ceil": Math.ceil,
      "floor": Math.floor,
      "round": Math.round,
      "-": neg,
      "exp": Math.exp
    };

    this.ops2 = {
      "+": add,
      "-": sub,
      "*": mul,
      "/": div,
      "%": mod,
      "^": Math.pow,
      ",": append,
      "||": concat
    };

    this.functions = {
      "random": random,
      "fac": fac,
      "min": Math.min,
      "max": Math.max,
      "pyt": pyt,
      "pow": Math.pow,
      "atan2": Math.atan2
    };

    this.consts = {
      "E": Math.E,
      "PI": Math.PI
    };
  }

  Parser.parse = function (expr) {
    return new Parser().parse(expr);
  };

  Parser.evaluate = function (expr, variables) {
    return Parser.parse(expr).evaluate(variables);
  };

  Parser.Expression = Expression;

  Parser.values = {
    sin: Math.sin,
    cos: Math.cos,
    tan: Math.tan,
    asin: Math.asin,
    acos: Math.acos,
    atan: Math.atan,
    sqrt: Math.sqrt,
    log: Math.log,
    abs: Math.abs,
    ceil: Math.ceil,
    floor: Math.floor,
    round: Math.round,
    random: random,
    fac: fac,
    exp: Math.exp,
    min: Math.min,
    max: Math.max,
    pyt: pyt,
    pow: Math.pow,
    atan2: Math.atan2,
    E: Math.E,
    PI: Math.PI
  };

  var PRIMARY      = 1 << 0;
  var OPERATOR     = 1 << 1;
  var FUNCTION     = 1 << 2;
  var LPAREN       = 1 << 3;
  var RPAREN       = 1 << 4;
  var COMMA        = 1 << 5;
  var SIGN         = 1 << 6;
  var CALL         = 1 << 7;
  var NULLARY_CALL = 1 << 8;

  Parser.prototype = {
    parse: function (expr) {
      this.errormsg = "";
      this.success = true;
      var operstack = [];
      var tokenstack = [];
      this.tmpprio = 0;
      var expected = (PRIMARY | LPAREN | FUNCTION | SIGN);
      var noperators = 0;
      this.expression = expr;
      this.pos = 0;

      while (this.pos < this.expression.length) {
        if (this.isOperator()) {
          if (this.isSign() && (expected & SIGN)) {
            if (this.isNegativeSign()) {
              this.tokenprio = 2;
              this.tokenindex = "-";
              noperators++;
              this.addfunc(tokenstack, operstack, TOP1);
            }
            expected = (PRIMARY | LPAREN | FUNCTION | SIGN);
          }
          else if (this.isComment()) {

          }
          else {
            if ((expected & OPERATOR) === 0) {
              this.error_parsing(this.pos, "unexpected operator");
            }
            noperators += 2;
            this.addfunc(tokenstack, operstack, TOP2);
            expected = (PRIMARY | LPAREN | FUNCTION | SIGN);
          }
        }
        else if (this.isNumber()) {
          if ((expected & PRIMARY) === 0) {
            this.error_parsing(this.pos, "unexpected number");
          }
          var token = new Token(TNUMBER, 0, 0, this.tokennumber);
          tokenstack.push(token);

          expected = (OPERATOR | RPAREN | COMMA);
        }
        else if (this.isString()) {
          if ((expected & PRIMARY) === 0) {
            this.error_parsing(this.pos, "unexpected string");
          }
          var token = new Token(TNUMBER, 0, 0, this.tokennumber);
          tokenstack.push(token);

          expected = (OPERATOR | RPAREN | COMMA);
        }
        else if (this.isLeftParenth()) {
          if ((expected & LPAREN) === 0) {
            this.error_parsing(this.pos, "unexpected \"(\"");
          }

          if (expected & CALL) {
            noperators += 2;
            this.tokenprio = -2;
            this.tokenindex = -1;
            this.addfunc(tokenstack, operstack, TFUNCALL);
          }

          expected = (PRIMARY | LPAREN | FUNCTION | SIGN | NULLARY_CALL);
        }
        else if (this.isRightParenth()) {
          if (expected & NULLARY_CALL) {
            var token = new Token(TNUMBER, 0, 0, []);
            tokenstack.push(token);
          }
          else if ((expected & RPAREN) === 0) {
            this.error_parsing(this.pos, "unexpected \")\"");
          }

          expected = (OPERATOR | RPAREN | COMMA | LPAREN | CALL);
        }
        else if (this.isComma()) {
          if ((expected & COMMA) === 0) {
            this.error_parsing(this.pos, "unexpected \",\"");
          }
          this.addfunc(tokenstack, operstack, TOP2);
          noperators += 2;
          expected = (PRIMARY | LPAREN | FUNCTION | SIGN);
        }
        else if (this.isConst()) {
          if ((expected & PRIMARY) === 0) {
            this.error_parsing(this.pos, "unexpected constant");
          }
          var consttoken = new Token(TNUMBER, 0, 0, this.tokennumber);
          tokenstack.push(consttoken);
          expected = (OPERATOR | RPAREN | COMMA);
        }
        else if (this.isOp2()) {
          if ((expected & FUNCTION) === 0) {
            this.error_parsing(this.pos, "unexpected function");
          }
          this.addfunc(tokenstack, operstack, TOP2);
          noperators += 2;
          expected = (LPAREN);
        }
        else if (this.isOp1()) {
          if ((expected & FUNCTION) === 0) {
            this.error_parsing(this.pos, "unexpected function");
          }
          this.addfunc(tokenstack, operstack, TOP1);
          noperators++;
          expected = (LPAREN);
        }
        else if (this.isVar()) {
          if ((expected & PRIMARY) === 0) {
            this.error_parsing(this.pos, "unexpected variable");
          }
          var vartoken = new Token(TVAR, this.tokenindex, 0, 0);
          tokenstack.push(vartoken);

          expected = (OPERATOR | RPAREN | COMMA | LPAREN | CALL);
        }
        else if (this.isWhite()) {
        }
        else {
          if (this.errormsg === "") {
            this.error_parsing(this.pos, "unknown character");
          }
          else {
            this.error_parsing(this.pos, this.errormsg);
          }
        }
      }
      if (this.tmpprio < 0 || this.tmpprio >= 10) {
        this.error_parsing(this.pos, "unmatched \"()\"");
      }
      while (operstack.length > 0) {
        var tmp = operstack.pop();
        tokenstack.push(tmp);
      }
      if (noperators + 1 !== tokenstack.length) {
        //print(noperators + 1);
        //print(tokenstack);
        this.error_parsing(this.pos, "parity");
      }

      return new Expression(tokenstack, object(this.ops1), object(this.ops2), object(this.functions));
    },

    evaluate: function (expr, variables) {
      return this.parse(expr).evaluate(variables);
    },

    error_parsing: function (column, msg) {
      this.success = false;
      this.errormsg = "parse error [column " + (column) + "]: " + msg;
      throw new Error(this.errormsg);
    },

//\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\

    addfunc: function (tokenstack, operstack, type_) {
      var operator = new Token(type_, this.tokenindex, this.tokenprio + this.tmpprio, 0);
      while (operstack.length > 0) {
        if (operator.prio_ <= operstack[operstack.length - 1].prio_) {
          tokenstack.push(operstack.pop());
        }
        else {
          break;
        }
      }
      operstack.push(operator);
    },

    isNumber: function () {
      var r = false;
      var str = "";
      while (this.pos < this.expression.length) {
        var code = this.expression.charCodeAt(this.pos);
        if ((code >= 48 && code <= 57) || code === 46) {
          str += this.expression.charAt(this.pos);
          this.pos++;
          this.tokennumber = parseFloat(str);
          r = true;
        }
        else {
          break;
        }
      }
      return r;
    },

    // Ported from the yajjl JSON parser at http://code.google.com/p/yajjl/
    unescape: function(v, pos) {
      var buffer = [];
      var escaping = false;

      for (var i = 0; i < v.length; i++) {
        var c = v.charAt(i);

        if (escaping) {
          switch (c) {
            case "'":
              buffer.push("'");
              break;
            case '\\':
              buffer.push('\\');
              break;
            case '/':
              buffer.push('/');
              break;
            case 'b':
              buffer.push('\b');
              break;
            case 'f':
              buffer.push('\f');
              break;
            case 'n':
              buffer.push('\n');
              break;
            case 'r':
              buffer.push('\r');
              break;
            case 't':
              buffer.push('\t');
              break;
            case 'u':
              // interpret the following 4 characters as the hex of the unicode code point
              var codePoint = parseInt(v.substring(i + 1, i + 5), 16);
              buffer.push(String.fromCharCode(codePoint));
              i += 4;
              break;
            default:
              throw this.error_parsing(pos + i, "Illegal escape sequence: '\\" + c + "'");
          }
          escaping = false;
        } else {
          if (c == '\\') {
            escaping = true;
          } else {
            buffer.push(c);
          }
        }
      }

      return buffer.join('');
    },

    isString: function () {
      var r = false;
      var str = "";
      var startpos = this.pos;
      if (this.pos < this.expression.length && this.expression.charAt(this.pos) == "'") {
        this.pos++;
        while (this.pos < this.expression.length) {
          var code = this.expression.charAt(this.pos);
          if (code != "'" || str.slice(-1) == "\\") {
            str += this.expression.charAt(this.pos);
            this.pos++;
          }
          else {
            this.pos++;
            this.tokennumber = this.unescape(str, startpos);
            r = true;
            break;
          }
        }
      }
      return r;
    },

    isConst: function () {
      var str;
      for (var i in this.consts) {
        if (true) {
          var L = i.length;
          str = this.expression.substr(this.pos, L);
          if (i === str) {
            this.tokennumber = this.consts[i];
            this.pos += L;
            return true;
          }
        }
      }
      return false;
    },

    isOperator: function () {
      var code = this.expression.charCodeAt(this.pos);
      if (code === 43) { // +
        this.tokenprio = 0;
        this.tokenindex = "+";
      }
      else if (code === 45) { // -
        this.tokenprio = 0;
        this.tokenindex = "-";
      }
      else if (code === 124) { // |
        if (this.expression.charCodeAt(this.pos + 1) === 124) {
          this.pos++;
          this.tokenprio = 0;
          this.tokenindex = "||";
        }
        else {
          return false;
        }
      }
      else if (code === 42) { // *
        this.tokenprio = 1;
        this.tokenindex = "*";
      }
      else if (code === 47) { // /
        this.tokenprio = 2;
        this.tokenindex = "/";
      }
      else if (code === 37) { // %
        this.tokenprio = 2;
        this.tokenindex = "%";
      }
      else if (code === 94) { // ^
        this.tokenprio = 3;
        this.tokenindex = "^";
      }
      else {
        return false;
      }
      this.pos++;
      return true;
    },

    isSign: function () {
      var code = this.expression.charCodeAt(this.pos - 1);
      if (code === 45 || code === 43) { // -
        return true;
      }
      return false;
    },

    isPositiveSign: function () {
      var code = this.expression.charCodeAt(this.pos - 1);
      if (code === 43) { // -
        return true;
      }
      return false;
    },

    isNegativeSign: function () {
      var code = this.expression.charCodeAt(this.pos - 1);
      if (code === 45) { // -
        return true;
      }
      return false;
    },

    isLeftParenth: function () {
      var code = this.expression.charCodeAt(this.pos);
      if (code === 40) { // (
        this.pos++;
        this.tmpprio += 10;
        return true;
      }
      return false;
    },

    isRightParenth: function () {
      var code = this.expression.charCodeAt(this.pos);
      if (code === 41) { // )
        this.pos++;
        this.tmpprio -= 10;
        return true;
      }
      return false;
    },

    isComma: function () {
      var code = this.expression.charCodeAt(this.pos);
      if (code === 44) { // ,
        this.pos++;
        this.tokenprio = -1;
        this.tokenindex = ",";
        return true;
      }
      return false;
    },

    isWhite: function () {
      var code = this.expression.charCodeAt(this.pos);
      if (code === 32 || code === 9 || code === 10 || code === 13) {
        this.pos++;
        return true;
      }
      return false;
    },

    isOp1: function () {
      var str = "";
      for (var i = this.pos; i < this.expression.length; i++) {
        var c = this.expression.charAt(i);
        if (c.toUpperCase() === c.toLowerCase()) {
          if (i === this.pos || (c != '_' && (c < '0' || c > '9'))) {
            break;
          }
        }
        str += c;
      }
      if (str.length > 0 && (str in this.ops1)) {
        this.tokenindex = str;
        this.tokenprio = 5;
        this.pos += str.length;
        return true;
      }
      return false;
    },

    isOp2: function () {
      var str = "";
      for (var i = this.pos; i < this.expression.length; i++) {
        var c = this.expression.charAt(i);
        if (c.toUpperCase() === c.toLowerCase()) {
          if (i === this.pos || (c != '_' && (c < '0' || c > '9'))) {
            break;
          }
        }
        str += c;
      }
      if (str.length > 0 && (str in this.ops2)) {
        this.tokenindex = str;
        this.tokenprio = 5;
        this.pos += str.length;
        return true;
      }
      return false;
    },

    isVar: function () {
      var str = "";
      for (var i = this.pos; i < this.expression.length; i++) {
        var c = this.expression.charAt(i);
        if (c.toUpperCase() === c.toLowerCase()) {
          if (i === this.pos || (c != '_' && (c < '0' || c > '9'))) {
            break;
          }
        }
        str += c;
      }

      // Added by Florin Chelaru, on 2/25/2014:
      // Support variables in the form {0}
      var start = this.pos, end = this.expression.indexOf('}', this.pos);
      if (this.expression.charAt(start) == '{' && end > start) {
        str = this.expression.substring(start, end + 1);
      }

      if (str.length > 0) {
        this.tokenindex = str;
        this.tokenprio = 4;
        this.pos += str.length;
        return true;
      }
      return false;
    },

    isComment: function () {
      var code = this.expression.charCodeAt(this.pos - 1);
      if (code === 47 && this.expression.charCodeAt(this.pos) === 42) {
        this.pos = this.expression.indexOf("*/", this.pos) + 2;
        if (this.pos === 1) {
          this.pos = this.expression.length;
        }
        return true;
      }
      return false;
    }
  };

  scope.Parser = Parser;
  return Parser
})( false ? {} : exports);



/***/ }),
/* 85 */
/***/ (function(module, exports) {

/**
 * Created by Florin Chelaru ( florinc [at] umd [dot] edu )
 * Date: 3/31/14
 * Time: 10:16 AM
 */

goog.provide('epiviz.utils.IterableArray');

/**
 * @param {Array.<T>} array
 * @constructor
 * @implements {epiviz.utils.Iterable.<T>}
 * @template T
 */
epiviz.utils.IterableArray = function(array) {
  /**
   * @type {Array.<T>}
   * @private
   */
  this._array = array;
};

/**
 * @param {function(T)} iteration
 */
epiviz.utils.IterableArray.prototype.foreach = function(iteration) {
  for (var i = 0; i < this._array.length; ++i) {
    if (iteration(this._array[i])) { return; }
  }
};


/***/ }),
/* 86 */
/***/ (function(module, exports) {

/**
 * Created by Florin Chelaru ( florinc [at] umd [dot] edu )
 * Date: 3/31/14
 * Time: 10:12 AM
 */

goog.provide('epiviz.utils.Iterable');

/**
 * @interface
 * @template T
 */
epiviz.utils.Iterable = function() {};

/**
 * @param {function(T)} iteration A function that is called for every iteration;
 * if the function returns something that evaluates to true, iteration should break.
 */
epiviz.utils.Iterable.prototype.foreach = function(iteration) {};


/***/ }),
/* 87 */
/***/ (function(module, exports) {

/**
 * Created by: Florin Chelaru
 * Date: 10/4/13
 * Time: 11:19 AM
 */

goog.provide('epiviz.utils.capitalizeFirstLetter');
goog.provide('epiviz.utils.fillArray');
goog.provide('epiviz.utils.mapCopy');
goog.provide('epiviz.utils.evaluateFullyQualifiedTypeName');
goog.provide('epiviz.utils.generatePseudoGUID');

// String

/**
 * @param {string} str
 * @returns {string}
 */
epiviz.utils.capitalizeFirstLetter = function(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * @param {string} str
 * @param {string} substr
 * @returns {boolean}
 */
epiviz.utils.stringContains = function(str, substr) {
  return str.indexOf(substr) != -1;
};

/**
 * @param {string} str
 * @param {string} prefix
 * @returns {boolean}
 */
epiviz.utils.stringStartsWith = function(str, prefix) {
  return str.indexOf(prefix) == 0;
};

/**
 * @param {string} str
 * @param {string} suffix
 * @returns {boolean}
 */
epiviz.utils.stringEndsWith = function(str, suffix) {
  return str.lastIndexOf(suffix) == str.length - suffix.length;
};

// Array

/**
 * Creates an array of length n filled with value
 * @param {number} n
 * @param {T} value
 * @returns {Array.<T>}
 * @template T
 */
epiviz.utils.fillArray = function(n, value) {
  n = n || 0;
  var result = new Array(n);
  for (var i = 0; i < n; ++i) {
    result[i] = value;
  }
  return result;
};

/**
 * @param {Array.<T>} arr
 * @param {function(T): boolean} predicate
 * @returns {number}
 * @template T
 */
epiviz.utils.indexOf = function(arr, predicate) {
  for (var i = 0; i < arr.length; ++i) {
    if (predicate(arr[i])) { return i; }
  }
  return -1;
};

/**
 * @param {Array} arr1
 * @param {Array} arr2
 * @returns {boolean}
 */
epiviz.utils.arraysEqual = function(arr1, arr2) {
  if (arr1 == arr2) { return true; }

  if (!arr1 || !arr2) { return false; }

  if (arr1.length != arr2.length) { return false; }

  if (arr1 < arr2 || arr2 < arr1) { return false; }

  // The previous check doesn't work when the elements of the array are complex objects
  for (var i = 0; i < arr1.length; ++i) {
    if (arr1[i] != arr2[i]) { return false; }
  }
  return true;
};

/**
 * Compares the two given arrays ignoring the order of their elements;
 * for example [1, 2, 1, 3] and [2, 1, 1, 3] will be considered equal.
 * @param {Array.<string|number>} arr1
 * @param {Array.<string|number>} arr2
 * @returns {boolean}
 */
epiviz.utils.elementsEqual = function(arr1, arr2) {
  if (arr1 == arr2) { return true; }

  if (!arr1 || !arr2) { return false; }

  if (arr1.length != arr2.length) { return false; }

  var valueMap = {};

  var i;
  for (i = 0; i < arr1.length; ++i) {
    if (!(arr1[i] in valueMap)) { valueMap[arr1[i]] = 0; }
    ++valueMap[arr1[i]];
  }

  for (i = 0; i < arr2.length; ++i) {
    if (!valueMap[arr2[i]]) { return false; }
    --valueMap[arr2[i]];
  }

  return true;
};

/**
 * Generates an array of consecutive numbers starting from startIndex
 * (or 0 if it's not defined)
 * @param {number} n
 * @param {number} [startIndex]
 */
epiviz.utils.range = function(n, startIndex) {
  startIndex = startIndex || 0;
  n = n || 0;

  var result = new Array(n);
  for (var i = 0; i < n; ++i) {
    result[i] = i + startIndex;
  }

  return result;
};

/**
 * Append an array to another in place
 * @param {Array} self
 * @param {Array} arr
 */
epiviz.utils.arrayAppend = function(self, arr) {
  self.push.apply(self, arr);
};

/**
 * @param {Array.<string|number>} arr
 * @returns {Object.<string|number, number>}
 */
epiviz.utils.arrayFlip = function(arr) {
  var result = {};
  for (var i = 0; i < arr.length; ++i) {
    result[arr[i]] = i;
  }

  return result;
};

/**
 * Gets the minimum value in the matrix, along with the i, j indices where this value is located
 * @param {Array.<Array.<number>>} matrix
 * @param {boolean} [isSymmetrical]
 * @returns {{min: number, index: Array}}
 */
epiviz.utils.indexOfMin = function(matrix, isSymmetrical) {
  var ret = null;
  var min = null;
  for (var i = 0; i < matrix.length; ++i) {
    for (var j = isSymmetrical ? (i + 1) : 0; j < matrix[i].length; ++j) {
      if (min == null || matrix[i][j] < min) {
        min = matrix[i][j];
        ret = [i, j];
      }
    }
  }

  return {min: min, index: ret};
};

/**
 * @param {Array.<number|string>} arr1
 * @param {Array.<number|string>} arr2
 * @returns {Array.<number|string>}
 */
epiviz.utils.arrayIntersection = function(arr1, arr2) {
  var arr1Map = {};
  arr1.forEach(function(e) { arr1Map[e] = e; });

  var ret = [];
  arr2.forEach(function(e) { if (e in arr1Map) { ret.push(e); }});

  return ret;
};

/**
 * @param {number} n
 * @param {function(number, function(boolean))} iterationCallback The callback parameter will be true if should break
 * @param {function} finishedCallback
 */
epiviz.utils.asyncFor = function(n, iterationCallback, finishedCallback) {
  if (!n) {
    if (finishedCallback) { finishedCallback(); }
    return;
  }

  var iteration = function(i) {
    if (i >= n) {
      if (finishedCallback) { finishedCallback(); }
      return;
    }

    iterationCallback(i, function(result) {
      if (result) {
        if (finishedCallback) { finishedCallback(); }
      }
      else {
        iteration(i + 1);
      }
    });
  };

  iteration(0);
};

/**
 * @param {number} n
 * @param {function(number): epiviz.deferred.Deferred} deferredIteration
 * @returns {epiviz.deferred.Deferred}
 */
epiviz.utils.deferredFor = function(n, deferredIteration) {
  var initial = new epiviz.deferred.Deferred();
  var ret = new epiviz.deferred.Deferred();
  var p = initial.promise();
  for (var i = 0; i < n; ++i) {
    (function(i) {
      p = p.then(function () {
        var promise = deferredIteration(i);
        if (i == n - 1) {
          promise.then(function () { ret.resolve(); });
        }
        return promise;
      });
    })(i);
  }

  initial.resolve();
  return ret;
};

// Object (Hashtable)

/**
 * Creates a copy of the given map
 * @param {Object.<K, V>} map
 * @returns {Object.<K, V>}
 * @template K, V
 */
epiviz.utils.mapCopy = function(map) {
  var result = {};
  for (var key in map) {
    if (!map.hasOwnProperty(key)) { continue; }
    result[key] = map[key];
  }

  return result;
};

/**
 * @param {Object.<K, V>} m1
 * @param {Object.<K, V>} m2
 * @returns {boolean}
 * @template K, V
 */
epiviz.utils.mapEquals = function(m1, m2) {
  if (m1 == m2) { return true; }
  if (!m1 || !m2) { return false; }

  var k;
  for (k in m1) {
    if (!m1.hasOwnProperty(k)) { continue; }
    if (!m2.hasOwnProperty(k)) { return false; }
    if (m1[k] != m2[k]) { return false; }
  }

  for (k in m2) {
    if (!m2.hasOwnProperty(k)) { continue; }
    if (!m1.hasOwnProperty(k)) { return false; }
  }

  return true;
};

/**
 * Creates a new map that contains the keys of both m1 and m2.
 * If one key is in both maps, then the value from m1 will be used.
 * @param {Object<*,*>} m1
 * @param {Object<*,*>} m2
 * @param {boolean} [combineArrayVals] specifies that array values should also be combined
 * @returns {Object<*,*>}
 */
epiviz.utils.mapCombine = function(m1, m2, combineArrayVals) {
  var result = {};

  var key;

  if (m2) {
    for (key in m2) {
      if (!m2.hasOwnProperty(key)) { continue; }
      result[key] = m2[key];
    }
  }

  if (m1) {
    for (key in m1) {
      if (!m1.hasOwnProperty(key)) { continue; }
      if (combineArrayVals &&
        result[key] && $.isArray(result[key]) &&
        m1[key] && $.isArray(m1[key])) {
        result[key] = result[key].concat(m1[key]);
      } else {
        result[key] = m1[key];
      }
    }
  }

  return result;
};

/**
 * @param {Object.<*, *>} map
 * @param {string} [keyValueSep] Default: ':'
 * @param {string} [separator] Default: ','
 */
epiviz.utils.mapJoin = function(map, keyValueSep, separator) {
  if (!keyValueSep && keyValueSep !== '') { keyValueSep = ':'; }
  if (!separator && separator !== '') { separator = ','; }
  var result = '';
  for (var key in map) {
    if (!map.hasOwnProperty(key)) { continue; }
    if (result) { result += separator; }
    result += key + keyValueSep + map[key];
  }

  return result;
};

/**
 * Gets the keys that are in both maps
 * @param {Object.<*, *>} m1
 * @param {Object.<*, *>} m2
 * @returns {Array.<*>}
 */
epiviz.utils.mapKeyIntersection = function(m1, m2) {
  var result = [];

  if (!m1 || !m2) { return result; }

  for (var key in m1) {
    if (!m1.hasOwnProperty(key)) { continue; }
    if (key in m2) { result.push(key); }
  }

  return result;
};

/**
 * Loops through all the elements of an object or until callback returns something that evaluates to true
 * @param {Object.<string|number, T>} obj
 * @param {function(T=, string|number=, Object.<string|number, T>=)} callback
 * @template T
 */
epiviz.utils.forEach = function(obj, callback) {
  for (var key in obj) {
    if (!obj.hasOwnProperty(key)) { continue; }
    if (callback(obj[key], key, obj)) { break; }
  }
};

// Reflection

/**
 * Evaluates the given string into a constructor for a type
 * @param {string} typeName
 * @returns {?function(new: T)}
 * @template T
 */
epiviz.utils.evaluateFullyQualifiedTypeName = function(typeName) {
  try {
    var namespaces = typeName.split('.');
    var func = namespaces.pop();
    var context = window;
    for (var i = 0; i < namespaces.length; ++i) {
      context = context[namespaces[i]];
    }

    var result = context[func];
    if (typeof(result) !== 'function') {
      console.error('Unknown type name: ' + typeName);
      return null;
    }

    return result;
  } catch (error) {
    console.error('Unknown type name: ' + typeName);
    return null;
  }
};

/**
 * Applies the given constructor to the given parameters and creates
 * a new instance of the class it defines
 * @param {function(new: T)} ctor
 * @param {Array} params
 * @returns {T}
 * @template T
 */
epiviz.utils.applyConstructor = function(ctor, params) {
  var obj;

  // Use a fake constructor function with the target constructor's
  // `prototype` property to create the object with the right prototype
  var fakeCtor = function() {};
  fakeCtor.prototype = ctor.prototype;

  /** @type {T} */
  obj = new fakeCtor();

  // Set the object's `constructor`
  obj.constructor = ctor;

  // Call the constructor function
  ctor.apply(obj, params);

  return obj;
};

// Misc

/**
 * @const
 * @type {number}
 */
epiviz.utils.RAD_TO_DEG = 180 / Math.PI;

/**
 * @const
 * @type {number}
 */
epiviz.utils.DEG_TO_RAD = Math.PI / 180;

/**
 * @returns {number} The version of Internet Explorer or -1 (indicating the use of another browser).
 */
epiviz.utils.getInternetExplorerVersion = function() {
  var rv = -1; // Return value assumes failure.
  if (navigator.appName == 'Microsoft Internet Explorer') {
    var ua = navigator.userAgent;
    var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
    var match = re.exec(ua);
    if (match != null)
      rv = parseFloat(match[1]);
  }
  return rv;
};

/**
 * @param {number} size
 * @returns {string}
 */
epiviz.utils.generatePseudoGUID = function(size) {
  var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var result = '';

  for (var i = 0; i < size; ++i) {
    result += chars[Math.round(Math.random() * (chars.length - 1))];
  }

  return result;
};

/**
 * This function will take a set of 3 "increasing" colors and
 * return a color scale that fills in intensities between the
 * colors. For use in turning each column of the observation
 * matrix into a heatmap.
 * @param {number} min
 * @param {number} max
 * @param {number} median
 * @param {string} colorMin
 * @param {string} colorMax
 * @param {string} colorMedian
 * @returns {function(number): string} A function that takes in a number and returns a color
 */
epiviz.utils.colorize = function(min, max, median, colorMin, colorMax, colorMedian){
  return d3.scale.linear()
    .domain([min, median, max])
    .range([colorMin, colorMedian, colorMax]);
};

/**
 * @param {number} min
 * @param {number} max
 * @param {string} colorMin
 * @param {string} colorMax
 * @returns {function(number): string}
 */
epiviz.utils.colorizeBinary = function(min, max, colorMin, colorMax){
  return d3.scale.linear()
    .domain([min, max])
    .range([colorMin, colorMax]);
};

// Math

/**
 * @param {number} val
 * @returns {number}
 */
epiviz.utils.sign = function(val) { return val < 0 ? -1 : (val == 0 ? 0 : 1); };


/***/ }),
/* 88 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(31)
__webpack_require__(33)
__webpack_require__(32)

__webpack_require__(29)
__webpack_require__(30)
__webpack_require__(87)
__webpack_require__(0)
__webpack_require__(84)
__webpack_require__(86)
__webpack_require__(85)

__webpack_require__(35)
__webpack_require__(34)
__webpack_require__(36)

__webpack_require__(69)
__webpack_require__(70)

__webpack_require__(68)
__webpack_require__(43)
__webpack_require__(37)
__webpack_require__(45)

__webpack_require__(78)
__webpack_require__(79)
__webpack_require__(77)
__webpack_require__(67)
__webpack_require__(81)
__webpack_require__(80)

__webpack_require__(40)
__webpack_require__(44)
__webpack_require__(42)
__webpack_require__(74)
__webpack_require__(72)
__webpack_require__(47)
__webpack_require__(76)
__webpack_require__(41)
__webpack_require__(73)
__webpack_require__(71)
__webpack_require__(46)
__webpack_require__(75)
__webpack_require__(38)

__webpack_require__(66)
__webpack_require__(54)
__webpack_require__(63)
__webpack_require__(64)
__webpack_require__(50)
__webpack_require__(59)
__webpack_require__(65)
__webpack_require__(58)
__webpack_require__(60)
__webpack_require__(62)
__webpack_require__(51)
__webpack_require__(61)
__webpack_require__(49)
__webpack_require__(55)
__webpack_require__(48)
__webpack_require__(52)

__webpack_require__(56)
__webpack_require__(57)
__webpack_require__(53)
__webpack_require__(82)

__webpack_require__(83)
__webpack_require__(39)

__webpack_require__(5)
__webpack_require__(4)
__webpack_require__(3)
__webpack_require__(6)
__webpack_require__(2)
__webpack_require__(7)
__webpack_require__(8)
__webpack_require__(10)
__webpack_require__(9)
__webpack_require__(11)
__webpack_require__(12)
__webpack_require__(13)
__webpack_require__(1)

__webpack_require__(28)
__webpack_require__(15)
__webpack_require__(17)
__webpack_require__(14)
__webpack_require__(26)
__webpack_require__(24)
__webpack_require__(23)
__webpack_require__(22)
__webpack_require__(16)
__webpack_require__(27)
__webpack_require__(20)
__webpack_require__(19)
__webpack_require__(25)
__webpack_require__(21)
__webpack_require__(18)

/***/ })
/******/ ]);