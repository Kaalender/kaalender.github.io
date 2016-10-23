var app = angular.module('orders', ['ui.validate']);

app.controller('OrderCtrl', function($scope,$http,$compile){
  $scope.currentOrder  = {"quantity":1,"cost":10,"contribution":5,"shipping":false,"total":15};
  $scope.allOrders = {};
  //re-calculate total whenever something changes
  $scope.$watch(function(){
    return $scope.currentOrder;
  },
  function(newValue,oldValue){
    var UNIT_COST = 10;
    var SHIPPING_COST = 3;

    $scope.currentOrder.cost = newValue.quantity * UNIT_COST;
    if(newValue.shipping){
      //if shipping out, then add 3 euro
      $scope.currentOrder.cost = $scope.currentOrder.cost + newValue.quantity * SHIPPING_COST;
    }
    $scope.currentOrder.total = $scope.currentOrder.cost + $scope.currentOrder.contribution;
  },true);

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

  $scope.getAllOrders = function(){
    CORS_API_KEY = "580badd72fd337b07bc48e2a";
    url = "https://kaalender-d711.restdb.io/rest/orders/";
    var ajaxSettings = {
      "async": true,
      "crossDomain": true,
      "url": "https://kaalender-d711.restdb.io/rest/orders",
      "method": "get",
      "headers": {
        "x-apikey": CORS_API_KEY,
        "content-type": "application/json"
      },
      "processData": false
    };
    $.ajax(ajaxSettings)
    .done(function (response) {
      console.log(response);
      return response;
    });

  };
  $scope.allOrders = $scope.getAllOrders();
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
      console.log(response);
      $scope.confirmOrder();
    });

  };
  $scope.printModal = function() {
    $('#myModal').modal('hide');
    //remove elements not shown by angular
    $("#myModal").find(".ng-hide").remove();
    //remove buttons
    $("#myModal").find(".modal-btn").remove();

    var content = $("#myModal")[0].innerHTML;
    var popupWin = window.open('', '_blank', '');
    popupWin.document.open();
    popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="./assets/css/main.css" /></head><body onload="window.print()">' + content + '</body></html>');
  }
  $scope.confirmOrder = function(){
    $('#myModal').modal('show');
  };
});
