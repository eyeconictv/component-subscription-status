/* global SUBSCRIPTION_STATUS_CONFIG: true */
/* exported SUBSCRIPTION_STATUS_CONFIG */
if (typeof SUBSCRIPTION_STATUS_CONFIG === "undefined") {
  var SUBSCRIPTION_STATUS_CONFIG = {
    STORE_URL: "http://store.risevision.com/~rvi/store/",
    PRODUCT_PATH: "#/product/productId/",
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
        productId: "@",
        productCode: "@",
        companyId: "@"
      },
      template: $templateCache.get("subscription-status-template.html"),
      link: function($scope, elm, attrs, ctrl) {
        if ($scope.productCode && $scope.companyId) {
          storeService.getSubscriptionStatus($scope.productCode, $scope.companyId).then(function(subscriptionStatus) {
            $scope.subscribed = false;
            if (subscriptionStatus) {
              $scope.subscribed = true;
              $scope.subscriptionMessage = subscriptionStatus.status;
            }
          });
        }

        if (ctrl) {
          $scope.$watch("subscribed", function(subscribed) {
            ctrl.$setViewValue(subscribed);
          });
        }
      }
    };
  }]);

angular.module("risevision.widget.common.subscription-status")
  .filter("productUrl", function() {
    return function(productId) {
      if (productId) {
        var url = SUBSCRIPTION_STATUS_CONFIG.STORE_URL;
        url += SUBSCRIPTION_STATUS_CONFIG.PRODUCT_PATH.replace("productId", productId);
        return url;
      }
      else {
        return "";
      }
    };
  });

angular.module("risevision.widget.common.service.store", [])
  .service("storeService", ["$http", "$q", function ($http, $q) {

    this.getSubscriptionStatus = function (productCode, companyId) {
      var deferred = $q.defer();

      var url = SUBSCRIPTION_STATUS_CONFIG.STORE_SERVER_URL +
        SUBSCRIPTION_STATUS_CONFIG.PATH_URL.replace("companyId", companyId) +
        productCode;

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
    "<a href=\"{{productId | productUrl}}\" target=\"_blank\">\n" +
    "  <span ng-class=\"{'product-trial':subscribed, 'product-expired':!subscribed}\">\n" +
    "    <h3>\n" +
    "      {{subscriptionMessage}}\n" +
    "      <i class=\"fa fa-question-circle icon-right\"></i>\n" +
    "    </h3>\n" +
    "  </span>\n" +
    "</a>\n" +
    "");
}]);
})();
