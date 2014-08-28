"use strict";

angular.module("risevision.widget.common.subscription-status", [])
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
