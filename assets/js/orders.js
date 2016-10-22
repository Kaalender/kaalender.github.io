var app = angular.module('orders', []);

app.controller('OrderCtrl', function($scope){
  $scope.currentOrder  = {"name":"","email":"","address":"","quantity":"","contribution":""};
  $scope.printOnConsole = function(){
    console.log($scope.currentOrder);
  };
});
