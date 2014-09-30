lyftApp.controller('main', ['$scope', '$http', function($scope, $http){
  'use strict';

  var getTipAverage = function(tips) {
    var total = 0;
    tips.map(function(tip) {
      total += tip.percentage;
    });

    return total / tips.length;
  };

  var getTipCoverage = function(tips) {
    return tips.length / 120 * 100;
  };

  var isMobile = function() {
    return (/iPhone|iPod|iPad|Android|BlackBerry/).test(navigator.userAgent);
  };

  $scope.isLoading = true;
  $scope.isAboutVisible = !isMobile();
  $scope.isMobile = isMobile();
  $scope.tips = [];

  $http.get('/tips').success(function(tips) {
    $scope.tips = tips;

    $scope.tipCoverage = getTipCoverage(tips);
    $scope.tipAverage = getTipAverage(tips);
  }).error(function() {
    $scope.errorLoadingTips = true;
  })['finally'](function() {
    $scope.isLoading = false;
  });
}]);