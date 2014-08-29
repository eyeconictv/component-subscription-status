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
