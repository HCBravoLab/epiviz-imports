/**
 * Created by Florin Chelaru ( florinc [at] umd [dot] edu )
 * Date: 10/16/13
 * Time: 9:36 AM
 */

goog.provide('epiviz.plugins.charts.CustomBlocksTrackType');

goog.require('epiviz.ui.charts.Chart');

/**
 * @param {epiviz.Config} config
 * @extends {epiviz.ui.charts.TrackType}
 * @constructor
 */
epiviz.plugins.charts.CustomBlocksTrackType = function(config) {
    // Call superclass constructor
    epiviz.ui.charts.TrackType.call(this, config);
};

/*
 * Copy methods from upper class
 */
epiviz.plugins.charts.CustomBlocksTrackType.prototype = epiviz.utils.mapCopy(epiviz.ui.charts.TrackType.prototype);
epiviz.plugins.charts.CustomBlocksTrackType.constructor = epiviz.plugins.charts.CustomBlocksTrackType;

/**
 * @param {string} id
 * @param {jQuery} container The div where the chart will be drawn
 * @param {epiviz.ui.charts.VisualizationProperties} properties
 * @returns {epiviz.plugins.charts.BlocksTrack}
 */
epiviz.plugins.charts.CustomBlocksTrackType.prototype.createNew = function(id, container, properties) {
    return new epiviz.plugins.charts.CustomBlocksTrack(id, container, properties);
};

/**
 * @returns {string}
 */
epiviz.plugins.charts.CustomBlocksTrackType.prototype.typeName = function() {
    return 'epiviz.plugins.charts.CustomlocksTrack';
};

/**
 * @returns {string}
 */
epiviz.plugins.charts.CustomBlocksTrackType.prototype.chartName = function() {
    return 'Custom Blocks Track';
};

/**
 * @returns {string}
 */
epiviz.plugins.charts.CustomBlocksTrackType.prototype.chartHtmlAttributeName = function() {
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
epiviz.plugins.charts.CustomBlocksTrackType.prototype.isRestrictedToRangeMeasurements = function() { return true; };

/**
 * @returns {function(epiviz.measurements.Measurement): boolean}
 */
epiviz.plugins.charts.CustomBlocksTrackType.prototype.measurementsFilter = function() { return function(m) { return m.type() == epiviz.measurements.Measurement.Type.RANGE; }; };

/**
 * @returns {Array.<epiviz.ui.charts.CustomSetting>}
 */
epiviz.plugins.charts.CustomBlocksTrackType.prototype.customSettingsDefs = function() {
    return epiviz.ui.charts.TrackType.prototype.customSettingsDefs.call(this).concat([
        new epiviz.ui.charts.CustomSetting(
            epiviz.plugins.charts.CustomBlocksTrackType.CustomSettings.MIN_BLOCK_DISTANCE,
            epiviz.ui.charts.CustomSetting.Type.NUMBER,
            5,
            'Minimum block distance')
    ]);
};

/**
 * @enum {string}
 */
epiviz.plugins.charts.CustomBlocksTrackType.CustomSettings = {
    MIN_BLOCK_DISTANCE: 'minBlockDistance'
};