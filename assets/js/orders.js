var app = angular.module('orders', ['ngResource','ngSanitize']);

app.filter('formatAddress',function(){
  return function(text){
    return text.replace(/([\s,-]*)(\d{4})/g,"\t$2");
  };
});

app.service('OrderDaoService',function(){
  this.getAllOrders = function(){
    CORS_API_KEY = "580badd72fd337b07bc48e2a";
    url = "https://kaalender-d711.restdb.io/rest/orders/";
    var ajaxSettings = {
      "async": false,
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
      $scope.allOrders=response;
      //console.log($scope.allOrders);
      //add selected property for admin UI
      angular.forEach($scope.allOrders, function(order) {
        order.selected = false;
      });

    });

  };
});
app.controller('OrderCtrl', function($scope,$http,$resource){
  $scope.currentOrder  = {"quantity":1,"cost":10,"contribution":5,"shipping":false,"total":15,"orderState":"niet betaald"};
  $scope.trackFilter = null;
  $scope.search = null;
  $scope.allOrders = [{"quantity":1,"cost":10,"contribution":5,"shipping":false,"total":15}];
  $scope.selectedOrder = null;
  $scope.exportData = function () {
    //remove not checked rows
    $("#orderTable tr:not(:has(input:checked))").remove();
    $("#orderTable").tableExport({
      headings: false,                    // (Boolean), display table headings (th/td elements) in the <thead>
      footers: false,                     // (Boolean), display table footers (th/td elements) in the <tfoot>
      formats: ["xls", "csv", "txt"],    // (String[]), filetypes for the export
      fileName: "id",                    // (id, String), filename for the downloaded file
      bootstrap: true,                   // (Boolean), style buttons using bootstrap
      position: "bottom",                 // (top, bottom), position of the caption element relative to table
      ignoreRows: null,                  // (Number, Number[]), row indices to exclude from the exported file
      ignoreCols: [0,1,3,5,6,7,8,9,10,11],                   // (Number, Number[]), column indices to exclude from the exported file
      ignoreCSS: ".tableexport-ignore"   // (selector, selector[]), selector(s) to exclude from the exported file
    });
  };

  //re-calculate total whenever something changes
  $scope.$watch(function(){
    return $scope.currentOrder;
  },
  function(newValue,oldValue){
    var UNIT_COST = 10;
    var SHIPPING_COST = 5;

    $scope.currentOrder.cost = newValue.quantity * UNIT_COST;
    if(newValue.shipping){
      //if shipping out, then add 3 euro
      $scope.currentOrder.cost = $scope.currentOrder.cost + newValue.quantity * SHIPPING_COST;
    }
    $scope.currentOrder.total = $scope.currentOrder.cost + $scope.currentOrder.contribution;
  },true);
  $scope.applyTrackSearch = function(){
    console.log("search called");
    console.log($scope.trackFilter);
    $scope.search = $scope.trackFilter;
  }
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
  var CORS_API_KEY = "580badd72fd337b07bc48e2a";
  var OrderService = $resource('https://kaalender-d711.restdb.io/rest/orders/:id',{id: "@id"},{
    //add my own new function. In this case, an update is a post to the general url without ids
    query:{
      //isArray:false
      headers:{
        "x-apikey": CORS_API_KEY,
        "content-type": "application/json"
      },
      "crossDomain": true,
      "processData": false,
      "async":true
    }
  });


  $scope.getAllOrders = function(){
    CORS_API_KEY = "580badd72fd337b07bc48e2a";
    url = "https://kaalender-d711.restdb.io/rest/orders/";
    var ajaxSettings = {
      "async": false,
      "crossDomain": true,
      "url": "https://kaalender-d711.restdb.io/rest/orders?metafields=true",
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
      $scope.allOrders=response;
      //console.log($scope.allOrders);
      //add selected property for admin UI
      angular.forEach($scope.allOrders, function(order) {
        order.selected = false;
      });

    });

  };

  $scope.getAllOrders();
  //console.log($scope.allOrders);
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
      alert('Je bestelling is bewaard, bedankt!');
      $("#info").after('<div class="alert-success">Je bestelling is bewaard, bedankt!</div>');
      $scope.confirmOrder();
    })
    ;

  };
  $scope.setSelectedOrder = function(order){
    $scope.selectedOrder = order;
  }
  $scope.updateOrderState = function(order){
    //delete selected property, is only for admin UI
    delete order.selected;
    CORS_API_KEY = "580badd72fd337b07bc48e2a";
    url = "https://kaalender-d711.restdb.io/rest/orders/";
    var ajaxSettings = {
      "async": true,
      "crossDomain": true,
      "url": "https://kaalender-d711.restdb.io/rest/orders/"+order._id,
      "method": "PUT",
      "headers": {
        "x-apikey": CORS_API_KEY,
        "content-type": "application/json"
      },
      "processData": false,
      data:JSON.stringify(order)
    };
    console.log("dropdown changed for id "+order._id);
    console.log("state is now:"+order.orderState);

    $.ajax(ajaxSettings)
    .done(function (response) {
      console.log("update done");
      console.log(response);

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
