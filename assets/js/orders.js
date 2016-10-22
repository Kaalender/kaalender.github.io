var app = angular.module('orders', ['ui.validate']);

app.controller('OrderCtrl', function($scope){
  $scope.currentOrder  = {};
  $scope.printOnConsole = function(){
    console.log($scope.currentOrder);
  };

  $scope.validateContribution = function(value){
    minValue = $scope.currentOrder.quantity * 10;
    if($scope.currentOrder.address != null){
      //if shipping out, then add 3 euro
      minValue = minValue + $scope.currentOrder.quantity*3;
    }
    return value >= minValue;
  };
});
