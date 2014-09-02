(function () {
  "use strict";

  angular.module("risevision.widget.common.subscription-status.config", [])
    .value("STORE_URL", "http://store.risevision.com/~rvi/store/")
    .value("PRODUCT_PATH", "#/product/productId/")
    .value("STORE_SERVER_URL", "https://store-dot-rvaserver2.appspot.com/")
    .value("PATH_URL", "v1/company/companyId/product/status?pc=")
  ;
}());

(function () {
  "use strict";

  angular.module("risevision.widget.common.subscription-status",
    ["risevision.widget.common.subscription-status.config",
    "risevision.widget.common.service.store"])
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
          $scope.$watch("companyId", function(companyId) {
            if ($scope.productCode && $scope.productId && companyId) {
              storeService.getSubscriptionStatus($scope.productCode, companyId).then(function(subscriptionStatus) {
                $scope.subscribed = false;
                if (subscriptionStatus) {
                  $scope.subscribed = true;
                  $scope.subscriptionMessage = subscriptionStatus.status;
                }
              });
            }
          });

          if (ctrl) {
            $scope.$watch("subscribed", function(subscribed) {
              ctrl.$setViewValue(subscribed);
            });
          }
        }
      };
    }]);
}());

(function () {
  "use strict";

  angular.module("risevision.widget.common.subscription-status")
    .filter("productUrl", ["STORE_URL", "PRODUCT_PATH",
    function(STORE_URL, PRODUCT_PATH) {
      return function(productId) {
        if (productId) {
          var url = STORE_URL;
          url += PRODUCT_PATH.replace("productId", productId);
          return url;
        }
        else {
          return "";
        }
      };
    }]);
}());

(function () {
  "use strict";

  angular.module("risevision.widget.common.service.store",
    ["risevision.widget.common.subscription-status.config"])
    .service("storeService", ["$http", "$q", "STORE_SERVER_URL", "PATH_URL",
    function ($http, $q, STORE_SERVER_URL, PATH_URL) {

      this.getSubscriptionStatus = function (productCode, companyId) {
        var deferred = $q.defer();

        var url = STORE_SERVER_URL +
          PATH_URL.replace("companyId", companyId) +
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
}());

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
