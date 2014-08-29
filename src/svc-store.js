angular.module("risevision.widget.common.service.store", [])
  .service("storeService", ["$http", "$q", function ($http, $q) {

    this.getSubscriptionStatus = function (productCode, companyId) {
      var deferred = $q.defer();

      var url = SUBSCRIPTION_STATUS_CONFIG.STORE_SERVER_URL +
        SUBSCRIPTION_STATUS_CONFIG.PATH_URL.replace("companyId", companyId) +
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
