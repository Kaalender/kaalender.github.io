var app = angular.module('orders', ['ui.validate']);

app.controller('OrderCtrl', function($scope){
  API_KEY = "9e3f03d341393fe5ef9d291c7b56ff59f0529";
  db = new restdb(API_KEY, {});
  $scope.currentOrder  = {"quantity":1,"contribution":10,"shipping":false};
  $scope.printOnConsole = function(){
    console.log($scope.currentOrder);
  };

  $scope.validateContribution = function(value){
    minValue = $scope.currentOrder.quantity * 10;
    if($scope.currentOrder.shipping){
      //if shipping out, then add 3 euro
      minValue = minValue + $scope.currentOrder.quantity*3;
    }
    return value >= minValue;
  };

  $scope.saveOrder = function(){
    var order = new db.orders($scope.currentOrder);
    order.save(function(error,result){
      if(!error){
        console.log("Saved order just fine");
      }
      else{
        console.log('error saving');
        console.log(error);
      }
    });
  };
});
