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
          $scope.subscribed = false;
          $scope.subscriptionStatus = "N/A";

          $scope.$watch("companyId", function(companyId) {
            if ($scope.productCode && $scope.productId && companyId) {
              checkSubscriptionStatus();
            }
          });

          function checkSubscriptionStatus() {
            subscriptionStatusService.get($scope.productCode, $scope.companyId).then(function(subscriptionStatus) {
              if (subscriptionStatus && subscriptionStatus.status) {
                $scope.subscribed = true;
                $scope.subscriptionStatus = subscriptionStatus.status;
                if (subscriptionStatus.expiry) {
                  $scope.subscriptionExpiry = subscriptionStatus.expiry;
                }
              }
              else {
                $scope.subscribed = false;
                $scope.subscriptionStatus = "N/A";
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
