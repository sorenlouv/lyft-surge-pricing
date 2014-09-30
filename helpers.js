'use strict';

var getDegBetweenCoords;
(function(){
  var M1 = 111132.92; // latitude calculation term 1
  var M2 = -559.82; // latitude calculation term 2
  var M3 = 1.175; // latitude calculation term 3
  var M4 = -0.0023; // latitude calculation term 4
  var P1 = 111412.84; // longitude calculation term 1
  var P2 = -93.5; // longitude calculation term 2
  var P3 = 0.118; // longitude calculation term 3

  var deg2rad = function(deg) {
    var conv_factor = (2.0 * Math.PI) / 360.0;
    return deg * conv_factor;
  };

  var latDeg2Meters = function(latRad) {
    var latLength = M1 + (M2 * Math.cos(2 * latRad)) + (M3 * Math.cos(4 * latRad)) + (M4 * Math.cos(6 * latRad));
    return Math.abs(latLength);
  };

  var lngDeg2Meters = function(latRad) {
    var lngLength = (P1 * Math.cos(latRad)) + (P2 * Math.cos(3 * latRad)) + (P3 * Math.cos(5 * latRad));
    return Math.abs(lngLength);
  };

  getDegBetweenCoords = function(metersBetweenCoords, latDeg) {
    var latRad = deg2rad(latDeg);
    return {
      lat: metersBetweenCoords / latDeg2Meters(latRad),
      lng: metersBetweenCoords / lngDeg2Meters(latRad)
    };
  };
}());


var getCoordinates = function(options) {
  var latStart = options.start.lat;
  var lngStart = options.start.lng;
  var latEnd = options.end.lat;
  var lngEnd = options.end.lng;
  var degBetweenCoords = getDegBetweenCoords(options.metersBetweenCoords, options.start.lat);

  var coordinates = [];
  for (var lng = lngStart; lng <= lngEnd; lng += degBetweenCoords.lng) {
    for (var lat = latStart; lat <= latEnd; lat += degBetweenCoords.lat) {
      coordinates.push({
        lat: lat,
        lng: lng
      });
    }
  }

  return coordinates;
};

module.exports = {
  getCoordinates: getCoordinates
};