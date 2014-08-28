/* global SUBSCRIPTION_STATUS_CONFIG: true */
/* exported SUBSCRIPTION_STATUS_CONFIG */
if (typeof SUBSCRIPTION_STATUS_CONFIG === "undefined") {
  var SUBSCRIPTION_STATUS_CONFIG = {
    STORE_SERVER_URL: "https://store-dot-rvaserver2.appspot.com/",
    PATH_URL: "/v1/company/companyId/product/status?pc="
  };
}

"use strict";

angular.module("risevision.widget.common.subscription-status", [
  "risevision.widget.common.service.store"
  ])
  .directive("subscriptionStatus", ["$templateCache",
    function ($templateCache) {
    return {
      restrict: "AE",
      require: "?ngModel",
      scope: {
        productId: "@"
      },
      template: $templateCache.get("subscription-status-template.html"),
      link: function($scope, elm, attrs, ctrl) {
        $scope.subscribed = true;
        $scope.subscriptionMessage = "Free";
        if ($scope.productId) {
          // TODO: send request
        }

        if (ctrl) {
          // TODO: populate status

        }
      }
    };
  }]);

angular.module("risevision.widget.common.service.store", [])
  .service("storeService", ["$http", "$q", function ($http, $q) {

    var defaultObj = {
      "search": "",
      "cursor": 0,
      "count": 50,
      "sort": "code"
    };

    function processInstruments(dataTable) {
      var instruments = [];
      for (var i = 0; i < dataTable.getNumberOfRows(); i++) {
        var row = {
          "id": dataTable.getValue(i, 0),
          "text": dataTable.getValue(i, 0) +
          (dataTable.getValue(i, 1) ? " - " + dataTable.getValue(i, 1) : "")
        };
        instruments.push(row);
      }
      return instruments;
    }

    function formQuerystring(obj) {
      var search = angular.lowercase(obj.search);

      var queryString = "where ((lower(code) like '%" + search + "%') or" +
        " (lower(name) like '%" + search + "%'))" +
        " order by " + obj.sort +
        " limit " + obj.count +
        " offset " + obj.cursor;

      return queryString;
    }

    this.getInstruments = function (obj) {
      var deferred = $q.defer();

      obj = angular.extend(defaultObj, obj);

      jsapiLoader.getVisualization().then(function (gApi) {
        var url = CONFIG.FINANCIAL_SERVER_URL + "lookup/local";

        var query = new gApi.Query(url, {
          sendMethod: 'scriptInjection'
        });

        query.setQuery(formQuerystring(obj));

        query.send(function(queryResponse) {
          if (!queryResponse) {
            deferred.reject("No response");
          }
          else if (queryResponse.isError()) {
            deferred.reject(queryResponse.getMessage());
          }
          else {
            var dataTable = queryResponse.getDataTable();
            deferred.resolve(processInstruments(dataTable));
          }
        });
      });

      return deferred.promise;
    };

    this.getInstrumentsRemote = function (obj) {
      var deferred = $q.defer();

      obj = angular.extend(defaultObj, obj);

      jsapiLoader.getVisualization().then(function (gApi) {
        var url = CONFIG.FINANCIAL_SERVER_URL + "lookup/remote";

        var query = new gApi.Query(url, {
          sendMethod: 'scriptInjection'
        });

        query.setQuery(formQuerystring(obj));

        query.send(function(queryResponse) {
          if (!queryResponse) {
            deferred.reject("No response");
          }
          else if (queryResponse.isError()) {
            deferred.reject(queryResponse.getMessage());
          }
          else {
            var dataTable = queryResponse.getDataTable();
            deferred.resolve(processInstruments(dataTable));
          }
        });
      });

      return deferred.promise;
    };
  }]);

(function(module) {
try { app = angular.module("risevision.widget.common.subscription-status"); }
catch(err) { app = angular.module("risevision.widget.common.subscription-status", []); }
app.run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("subscription-status-template.html",
    "<div class=\"row\">\n" +
    "  <span ng-class=\"{'product-trial':subscribed, 'product-expired':!subscribed}\">\n" +
    "    <h3>\n" +
    "      {{subscriptionMessage}}\n" +
    "    </h3>\n" +
    "  </span>\n" +
    "</div>\n" +
    "");
}]);
})();
