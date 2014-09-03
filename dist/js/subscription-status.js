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
    "risevision.widget.common.service.store",
    "risevision.widget.common"])
    .directive("subscriptionStatus", ["$templateCache", "storeService", "$location", "gadgetsApi",
      function ($templateCache, storeService, $location, gadgetsApi) {
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
          var storeModalInitialized = false;
          var $elm = $(elm);

          $scope.showStoreModal = false;
          $scope.storeModalUrl = "";

          $scope.$watch("companyId", function(companyId) {
            if ($scope.productCode && $scope.productId && companyId) {
              checkSubscriptionStatus();
            }
          });

          function checkSubscriptionStatus() {
            storeService.getSubscriptionStatus($scope.productCode, $scope.companyId).then(function(subscriptionStatus) {
              $scope.subscribed = false;
              if (subscriptionStatus) {
                $scope.subscribed = true;
                $scope.subscriptionStatus = subscriptionStatus.status;
                if (subscriptionStatus.expiry) {
                  $scope.subscriptionExpiry = subscriptionStatus.expiry;
                }
              }
            });
          }

          if (ctrl) {
            $scope.$watch("subscribed", function(subscribed) {
              ctrl.$setViewValue(subscribed);
            });
          }

          var watch = $scope.$watch("showStoreModal", function(show) {
            if (show) {
              initStoreModal();

              watch();
            }
          });

          function initStoreModal() {
            if (!storeModalInitialized) {
              var url = "http://store.risevision.com/~rvi/store/?up_id=store-modal-frame&parent=" +
                encodeURIComponent($location.$$absUrl) +
                "#/product/" + $scope.productId + "/?inRVA&cid=" + $scope.companyId;

              $elm.find("#store-modal-frame").attr("src", url);

              registerRPC();

              storeModalInitialized = true;
            }
          }

          function registerRPC() {
            if (gadgetsApi) {
              gadgetsApi.rpc.register("rscmd_saveSettings", saveSettings);
              gadgetsApi.rpc.register("rscmd_closeSettings", closeSettings);

              gadgetsApi.rpc.setupReceiver("store-modal-frame");
            }
          }

          function saveSettings() {
            checkSubscriptionStatus();

            closeSettings();
          }

          function closeSettings() {
            $scope.$apply(function() {
              $scope.showStoreModal = false;
            });

            // storeModal.parentNode.removeChild(storeModal);
            // backDrop.parentNode.removeChild(backDrop);
          }
        }
      };
    }]);
}());

"use strict";

angular.module("risevision.widget.common.subscription-status")
  .filter("productTrialDaysToExpiry", function() {
    return function(subscriptionExpiry) {
      var msg = "Expiring ";
      try {
        var days = Math.floor((new Date(subscriptionExpiry) - new Date()) / (1000 * 60 * 60 * 24)) + 1;
        if (days === 0) {
          msg += "Today";
        }
        else {
          msg += "in " + days + " Days";
        }
      } catch (e) {
        msg += "Today";
      }

      return msg;
    };
  });

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
    "<a href=\"\" ng-click=\"showStoreModal = true;\">\n" +
    "  <span ng-class=\"{'product-trial':subscribed, 'product-expired':!subscribed}\">\n" +
    "    <h3>\n" +
    "      {{subscriptionStatus}}\n" +
    "      <span ng-if=\"subscriptionStatus === 'On Trial'\"> - {{ subscriptionExpiry | productTrialDaysToExpiry }}</span>\n" +
    "      <i class=\"fa fa-question-circle icon-right\"></i>\n" +
    "    </h3>\n" +
    "  </span>\n" +
    "</a>\n" +
    "<div class=\"storage-selector-backdrop stack-top\" ng-show=\"showStoreModal\"\n" +
    "  ng-click=\"showStoreModal = false;\">\n" +
    "</div>\n" +
    "<iframe id=\"store-modal-frame\" name=\"store-modal-frame\" class=\"storage-selector-iframe stack-top\"\n" +
    "  ng-show=\"showStoreModal\">\n" +
    "</iframe>\n" +
    "");
}]);
})();
