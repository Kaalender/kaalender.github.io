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
    CORS_API_KEY = "580badd72fd337b07bc48e2a";
    url = "https://kaalender-d711.restdb.io/rest/orders/";
    var ajaxSettings = {
      "async": true,
      "crossDomain": true,
      "url": "https://kaalender-d711.restdb.io/rest/orders",
      "method": "POST",
      "headers": {
        "x-apikey": CORS_API_KEY,
        "content-type": "application/json"
      },
      "processData": false,
      data:JSON.stringify($scope.currentOrder)
    };
    $.ajax(ajaxSettings)
    .done(function (response) {
      console.log("done");
      console.log(response);
    });

  };
});
