lyftApp.directive('googleMaps', [function(){
  'use strict';
  return {
    scope: {
      tips: '='
    },
    restrict: 'C',
    link: function($scope, $element) {

      var sanFrancisco = new google.maps.LatLng(37.7831249,-122.4434383);
      var map = new google.maps.Map($element[0], {
        zoom: 13,
        center: sanFrancisco,
        disableDefaultUI: true,
        minZoom: 13
      });


      function addTipsToMap() {
        for (var i = 0; i < $scope.tips.length; i++) {
          addTipPercentage($scope.tips[i]);
        }
      }

      $scope.$watch('tips', function(tip) {
        if(!tip){
          return;
        }

        addTipsToMap();
      });

      var addTipPercentage = function(tip) {
        var center = new google.maps.LatLng(tip.lat, tip.lng);
        var tipPercentage = tip.percentage;
        var fillOpacity = tipPercentage / 200;
        var textColor = tipPercentage > 100 ? '#ffffff' : '#000000';

        new google.maps.Circle({
          strokeColor: '#FF0000',
          strokeOpacity: 0.2,
          strokeWeight: 1,
          fillColor: '#d90000',
          fillOpacity: fillOpacity,
          map: map,
          center: center,
          radius: 400
        });

        var label = new InfoBox({
            content: tipPercentage,
            boxStyle: {
                color: textColor
            },
            disableAutoPan: true,
            // pixelOffset: new google.maps.Size(-49, -14),
            position: center,
            closeBoxURL: '',
            pane: 'overlayShadow'
        });
        label.open(map);
      };

    }
  };
}]);


