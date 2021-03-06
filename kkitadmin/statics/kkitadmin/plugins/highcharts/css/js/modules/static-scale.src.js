/**
 * @license Highcharts JS v6.2.0 (2018-10-17)
 * StaticScale
 *
 * (c) 2016 Torstein Honsi, Lars A. V. Cabrera
 *
 * --- WORK IN PROGRESS ---
 *
 * License: www.highcharts.com/license
 */
'use strict';
(function (factory) {
	if (typeof module === 'object' && module.exports) {
		module.exports = factory;
	} else if (typeof define === 'function' && define.amd) {
		define(function () {
			return factory;
		});
	} else {
		factory(Highcharts);
	}
}(function (Highcharts) {
	(function (H) {
		/**
		 * (c) 2018 Torstein Honsi, Lars Cabrera
		 *
		 * License: www.highcharts.com/license
		 */

		var Chart = H.Chart,
		    each = H.each,
		    pick = H.pick;

		/**
		 * For vertical axes only. Setting the statics scale ensures that each tick unit
		 * is translated into a fixed pixel height. For example, setting the statics
		 * scale to 24 results in each Y axis category taking up 24 pixels, and the
		 * height of the chart adjusts. Adding or removing items will make the chart
		 * resize.
		 *
		 * @type {number}
		 * @sample gantt/xrange-series/demo/ X-range series with statics scale
		 * @since 6.2.0
		 * @product gantt
		 * @default 50
		 * @apioption yAxis.staticScale
		 */

		H.addEvent(H.Axis, 'afterSetOptions', function () {
		    if (
		        !this.horiz &&
		        H.isNumber(this.options.staticScale) &&
		        !this.chart.options.chart.height
		    ) {
		        this.staticScale = this.options.staticScale;
		    }
		});

		Chart.prototype.adjustHeight = function () {
		    if (this.redrawTrigger !== 'adjustHeight') {
		        each(this.axes || [], function (axis) {
		            var chart = axis.chart,
		                animate = !!chart.initiatedScale && chart.options.animation,
		                staticScale = axis.options.staticScale,
		                height,
		                diff;

		            if (axis.staticScale && H.defined(axis.min)) {
		                height = pick(
		                    axis.unitLength,
		                    axis.max + axis.tickInterval - axis.min
		                ) * staticScale;


		                // Minimum height is 1 x staticScale.
		                height = Math.max(height, staticScale);

		                diff = height - chart.plotHeight;

		                if (Math.abs(diff) >= 1) {
		                    chart.plotHeight = height;
		                    chart.redrawTrigger = 'adjustHeight';
		                    chart.setSize(undefined, chart.chartHeight + diff, animate);
		                }

		                // Make sure clip rects have the right height before initial
		                // animation.
		                each(axis.series, function (series) {
		                    var clipRect =
		                        series.sharedClipKey && chart[series.sharedClipKey];
		                    if (clipRect) {
		                        clipRect.attr({
		                            height: chart.plotHeight
		                        });
		                    }
		                });
		            }

		        });
		        this.initiatedScale = true;
		    }
		    this.redrawTrigger = null;
		};
		H.addEvent(Chart, 'render', Chart.prototype.adjustHeight);

	}(Highcharts));
	return (function () {


	}());
}));
