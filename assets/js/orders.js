var app = angular.module('orders', ['ui.validate']);

app.controller('OrderCtrl', function($scope){
  $scope.currentOrder  = {"quantity":1,"contribution":13};
  $scope.printOnConsole = function(){
    console.log($scope.currentOrder);
  };

  $scope.validateContribution = function(value){
    minValue = $scope.currentOrder.quantity * 10;
    if($scope.currentOrder.address != null || $scope.currentOrder.address != ''){
      //if shipping out, then add 3 euro
      minValue = minValue + $scope.currentOrder.quantity*3;
    }
    return value >= minValue;
  };
});
