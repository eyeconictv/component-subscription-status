/* global SUBSCRIPTION_STATUS_CONFIG: true */
/* exported SUBSCRIPTION_STATUS_CONFIG */
if (typeof SUBSCRIPTION_STATUS_CONFIG === "undefined") {
  var SUBSCRIPTION_STATUS_CONFIG = {
    STORE_SERVER_URL: "https://store-dot-rvaserver2.appspot.com/",
    PATH_URL: "v1/company/companyId/product/status?pc="
  };
}

"use strict";

angular.module("risevision.widget.common.subscription-status",
  ["risevision.widget.common.service.store"])
  .directive("subscriptionStatus", ["$templateCache", "storeService",
    function ($templateCache, storeService) {
    return {
      restrict: "AE",
      require: "?ngModel",
      scope: {
        productId: "@"
      },
      template: $templateCache.get("subscription-status-template.html"),
      link: function($scope, elm, attrs, ctrl) {
        if ($scope.productId) {
          storeService.getSubscriptionStatus($scope.productId).then(function(subscriptionStatus) {
            $scope.subscribed = false;
            if (subscriptionStatus) {
              $scope.subscribed = true;
              $scope.subscriptionMessage = subscriptionStatus.status;
            }
          });
        }

        if (ctrl) {
          // TODO: populate status

        }
      }
    };
  }]);

angular.module("risevision.widget.common.service.store", [])
  .service("storeService", ["$http", "$q", function ($http, $q) {

    this.getSubscriptionStatus = function (obj) {
      var deferred = $q.defer();

      var companyId = "6d0ce73d-7cc8-4951-841f-e3a6405145aa";
      var url = SUBSCRIPTION_STATUS_CONFIG.STORE_SERVER_URL +
        SUBSCRIPTION_STATUS_CONFIG.PATH_URL.replace("companyId", companyId) +
        obj;

      $http.get(url).then(function (response) {
        if (response && response.data && response.data.length) {
          deferred.resolve(response.data[0]);
        }
        else {
          deferred.reject("No response");
        }
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
    "<span ng-class=\"{'product-trial':subscribed, 'product-expired':!subscribed}\"\n" +
    "  class=\"fa fa-question-circle fa-lg\">\n" +
    "  <h3>\n" +
    "    {{subscriptionMessage}}\n" +
    "  </h3>\n" +
    "</span>\n" +
    "");
}]);
})();
