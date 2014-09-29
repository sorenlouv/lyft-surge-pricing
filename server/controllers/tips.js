var helpers = require('../helpers');
var request = require('request');
var nconf = require('nconf');

var getTips = function(lat, lng, callback) {
  'use strict';
  var currentTime = new Date().toISOString().slice(0, -5) + 'Z';

  var requestBody = {
    appInfoRevision: '4f8d673dc625ad0987bfbc0fc51cb423',
    locations: [{
      accuracy: 8.0,
      bearing: 0.0,
      lat: lat,
      lng: lng,
      recordedAt: currentTime,
      speed: 0.0
    }],
    marker: {
      accuracy: 30.0,
      lat: lat,
      lng: lng,
      source: 'map',
      recordedAt: currentTime
    },
    rideType: 'standard'
  };

  nconf.use('file', { file: './config.json' });
  var userId = nconf.get('userId');
  var requestHeaders = nconf.get('requestHeaders');
  requestHeaders['Content-Type'] = 'application/json; charset=utf-8';
  requestHeaders['Accept-Encoding'] = 'gzip';
  requestHeaders.Connection = 'Keep-Alive';

  var requestOptions = {
    gzip: true,
    url: 'https://api.lyft.com/users/' + userId + '/location',
    method: 'PUT',
    headers: requestHeaders,
    json: requestBody
  };

  setTimeout(function() {
    var tipPercentages = [25, 50, 75, 100, 200];
    var tipPercentage = tipPercentages[Math.floor(Math.random() * tipPercentages.length)];
    callback(tipPercentage);
  }, 100);


  // request(requestOptions, function(error, response, body) {
  //   if (!error && response.statusCode == 200) {
  //     var tipPercentage = body.system.tipPercentage || 0;
  //     callback(tipPercentage);
  //   } else {
  //     console.log('error');
  //   }
  // });
};

module.exports = function(req, res){
  'use strict';

  var mainSFCoordinates = helpers.getCoordinates({
    start: {
      lat: 37.741900,
      lng: -122.479573
    },
    end: {
      lat: 37.807850,
      lng: -122.386894
    },
    metersBetweenCoords: 900
  });

  var westSFCoordinates = helpers.getCoordinates({
    start: {
      lat: 37.737833,
      lng: -122.507572
    },
    end: {
      lat: 37.788587,
      lng: -122.484998
    },
    metersBetweenCoords: 900
  });

  var coordinates = mainSFCoordinates.concat(westSFCoordinates);
  var tips = [];

  for (var i = 0; i < coordinates.length; i++) {
    outputTipPercentages(coordinates[i]);
  }

  function outputTipPercentages(coordinate){
    getTips(coordinate.lat, coordinate.lng, function(tipPercentage) {
      if(tipPercentage > 0){
        tips.push({
          lat: coordinate.lat,
          lng: coordinate.lng,
          percentage: tipPercentage
        });
      }

      var isLast = coordinates[coordinates.length-1] === coordinate;
      if(isLast){
        res.send(tips);
      }

    });
  }
};