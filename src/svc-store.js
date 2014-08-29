angular.module("risevision.widget.common.service.store", [])
  .service("storeService", ["$http", "$q", function ($http, $q) {

    this.getSubscriptionStatus = function (obj) {
      var deferred = $q.defer();

      var companyId = "6d0ce73d-7cc8-4951-841f-e3a6405145aa";
      var url = SUBSCRIPTION_STATUS_CONFIG.STORE_SERVER_URL +
        SUBSCRIPTION_STATUS_CONFIG.PATH_URL.replace("companyId", companyId) +
        obj;

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
