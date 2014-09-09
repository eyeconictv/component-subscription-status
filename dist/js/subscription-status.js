(function () {
  "use strict";

  angular.module("risevision.widget.common.subscription-status.config", [])
    .value("STORE_URL", "http://store.risevision.com/~rvi/store/")
    .value("IN_RVA_PATH", "?up_id=iframeId&parent=parentUrl#/product/productId/?inRVA&cid=companyId")
    .value("STORE_SERVER_URL", "https://store-dot-rvaserver2.appspot.com/")
    .value("PATH_URL", "v1/company/companyId/product/status?pc=")
  ;
}());

(function () {
  "use strict";

  angular.module("risevision.widget.common.subscription-status",
    ["risevision.widget.common.subscription-status.config",
    "risevision.widget.common.translate",
    "risevision.widget.common.subscription-status.service",
    "risevision.widget.common"])
    .directive("subscriptionStatus", ["$templateCache", "subscriptionStatusService",
    "$location", "gadgetsApi", "STORE_URL", "IN_RVA_PATH",
      function ($templateCache, subscriptionStatusService, $location, gadgetsApi, STORE_URL, IN_RVA_PATH) {
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
          $scope.subscriptionStatus = {"status": "N/A", "subscribed": false, "expiry": null};

          $scope.$watch("companyId", function(companyId) {
            if ($scope.productCode && $scope.productId && companyId) {
              checkSubscriptionStatus();
            }
          });

          function checkSubscriptionStatus() {
            subscriptionStatusService.get($scope.productCode, $scope.companyId).then(function(subscriptionStatus) {
              if (subscriptionStatus) {
                $scope.subscriptionStatus = subscriptionStatus;
              }
            },
            function () {
              // TODO: catch error here
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
              var url = STORE_URL + IN_RVA_PATH
              .replace("parentUrl", encodeURIComponent($location.$$absUrl))
              .replace("productId", $scope.productId)
              .replace("companyId", $scope.companyId);

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

  angular.module("risevision.widget.common.subscription-status.service",
    ["risevision.widget.common.subscription-status.config"])
    .service("subscriptionStatusService", ["$http", "$q", "STORE_SERVER_URL", "PATH_URL",
    function ($http, $q, STORE_SERVER_URL, PATH_URL) {
      var responseType = ["On Trial", "Trial Expired", "Subscribed", "Suspended", "Cancelled", "Free"];

      this.get = function (productCode, companyId) {
        var deferred = $q.defer();

        var url = STORE_SERVER_URL +
          PATH_URL.replace("companyId", companyId) +
          productCode;

        $http.get(url).then(function (response) {
          if (response && response.data && response.data.length) {
            var subscriptionStatus = response.data[0];

            if (subscriptionStatus.status === "") {
              subscriptionStatus.status = "N/A";
              subscriptionStatus.subscribed = false;
            }
            else if (subscriptionStatus.status === responseType[0] ||
              subscriptionStatus.status === responseType[2] ||
              subscriptionStatus.status === responseType[5]) {
              subscriptionStatus.subscribed = true;
            }
            else {
              subscriptionStatus.subscribed = false;
            }

            deferred.resolve(subscriptionStatus);
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
    "<h3>\n" +
    "  <a href=\"\" ng-click=\"showStoreModal = true;\">\n" +
    "      <i class=\"fa fa-info-circle icon-left\"></i>\n" +
    "  </a>\n" +
    "  <span class=\"font-weight-normal\">{{'subscription-status.heading' | translate}} |</span>\n" +
    "  <a href=\"\" ng-click=\"showStoreModal = true;\">\n" +
    "    <span ng-class=\"{'product-trial':subscriptionStatus.subscribed, 'product-expired':!subscriptionStatus.subscribed}\">\n" +
    "        {{subscriptionStatus.status}}\n" +
    "        <span ng-if=\"subscriptionStatus.status === 'On Trial'\"> - {{ subscriptionStatus.expiry | productTrialDaysToExpiry }}</span>\n" +
    "    </span>\n" +
    "  </a>\n" +
    "</h3>\n" +
    "<div class=\"overlay stack-top\" ng-show=\"showStoreModal\"\n" +
    "  ng-click=\"showStoreModal = false;\">\n" +
    "</div>\n" +
    "<iframe id=\"store-modal-frame\" name=\"store-modal-frame\" class=\"wrapper container modal-content full-screen-modal\"\n" +
    "  ng-show=\"showStoreModal\">\n" +
    "</iframe>\n" +
    "");
}]);
})();
