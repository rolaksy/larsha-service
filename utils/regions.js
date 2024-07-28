const turf = require('@turf/turf');

/**
 * to find more bounding box for different regions,
 * go to http://bboxfinder.com/
 */

// Define bounding boxes or polygons for sub-regions in Auckland
const aucklandSubRegions = {
    "Central Auckland": turf.bboxPolygon([
      174.623394,-36.947422,174.972038,-36.804887
    ]),
    "West Auckland": turf.bboxPolygon([
        174.412354,-37.057965,174.727180,-36.841678
    ]),
    "South Auckland": turf.bboxPolygon([
        174.541168,-37.134319,175.194511,-36.880719
    ]),
  };

  
const regions = {
    "Auckland": aucklandSubRegions,
}

module.exports = regions;