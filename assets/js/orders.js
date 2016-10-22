var app = angular.module('orders', ['ngResource','ngRoute']);

app.controller('MsgCtrl', function($scope){
  $scope.currentOrder  = {};
});
