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
