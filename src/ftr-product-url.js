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
