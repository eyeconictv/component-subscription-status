(function () {
  "use strict";

  angular.module("risevision.widget.common.subscription-status.service",
    ["risevision.common.config",
     "risevision.widget.common.subscription-status.config"])
    .service("subscriptionStatusService", ["$http", "$q", "STORE_SERVER_URL", "PATH_URL",
    function ($http, $q, STORE_SERVER_URL, PATH_URL) {
      var responseType = ["On Trial", "Trial Expired", "Subscribed", "Suspended", "Cancelled", "Free", "Not Subscribed", "Product Not Found", "Company Not Found", "Error"];
      var responseCode = ["on-trial", "trial-expired", "subscribed", "suspended", "cancelled", "free", "not-subscribed", "product-not-found", "company-not-found", "error"];

      this.get = function (productCode, companyId) {
        var deferred = $q.defer();

        var url = STORE_SERVER_URL +
          PATH_URL.replace("companyId", companyId) +
          productCode;

        $http.get(url).then(function (response) {
          if (response && response.data && response.data.length) {
            var subscriptionStatus = response.data[0];
            var statusIndex = responseType.indexOf(subscriptionStatus.status);
            
            if(statusIndex >= 0) {
              subscriptionStatus.statusCode = responseCode[statusIndex];
            }
            
            if (subscriptionStatus.status === "") {
              subscriptionStatus.status = "N/A";
              subscriptionStatus.statusCode = "na";
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

            if(subscriptionStatus.statusCode === "not-subscribed" && 
              subscriptionStatus.trialPeriod && subscriptionStatus.trialPeriod > 0) {
              subscriptionStatus.statusCode = "trial-available";
              subscriptionStatus.subscribed = true;
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
