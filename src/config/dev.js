/* global SUBSCRIPTION_STATUS_CONFIG: true */
/* exported SUBSCRIPTION_STATUS_CONFIG */
if (typeof SUBSCRIPTION_STATUS_CONFIG === "undefined") {
  var SUBSCRIPTION_STATUS_CONFIG = {
    STORE_SERVER_URL: "https://store-dot-rvaserver2.appspot.com/",
    PATH_URL: "/v1/company/companyId/product/status?pc="
  };
}
