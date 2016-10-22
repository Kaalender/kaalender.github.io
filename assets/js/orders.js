var app = angular.module('orders', ['ui.validate']);

app.controller('OrderCtrl', function($scope,$http){
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
    API_KEY = "9e3f03d341393fe5ef9d291c7b56ff59f0529";
    url = "https://kaalender-d711.restdb.io/rest/orders/";
    $http({
      method: 'POST',
      url: url,
      header:{
        "x-apikey": API_KEY
      },
      data:$scope.currentOrder
    }).then(function successCallback(response) {
      console.log("success");
      console.log(response);
    }, function errorCallback(response) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.
      console.log("error");
      console.log(response);
    });

  };
});
