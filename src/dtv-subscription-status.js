(function () {
  "use strict";

  angular.module("risevision.widget.common.subscription-status",
    ["risevision.widget.common.subscription-status.config",
    "risevision.widget.common.translate",
    "risevision.widget.common.subscription-status.service",
    "risevision.widget.common"])
    .directive("subscriptionStatus", ["$templateCache", "subscriptionStatusService", "$location", "gadgetsApi",
      function ($templateCache, subscriptionStatusService, $location, gadgetsApi) {
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
            subscriptionStatusService.get($scope.productCode, $scope.companyId).then(function(subscriptionStatus) {
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
