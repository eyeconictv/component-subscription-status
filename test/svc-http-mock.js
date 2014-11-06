(function () {
  "use strict";

  angular.module("risevision.widget.common.subscription-status.service")
    // $http service mock responds to subscription-status service requests
    .service("$http", ["$q", function ($q) {
      this.get = function(url) {
        var deferred = $q.defer();

        var response = {
          "data": [{
            "pc":"1",
            "status":"",
            "expiry":null
          }]
        };

        console.log(url);

        if (url && url.indexOf("/company/invalid/") !== -1) {
          response.data[0].status = "";
        }
        else if (url && url.indexOf("/product/status?pc=2") !== -1) {
          response.data[0].status = "Trial Expired";
        }
        else {
          response.data[0].status = "Free";
        }

        deferred.resolve(response);

        return deferred.promise;
      };
    }]);

  try {
    angular.module("pascalprecht.translate");
  }
  catch(err) {
    angular.module("pascalprecht.translate", []);
  }

  angular.module("pascalprecht.translate").factory("$translateStaticFilesLoader", [
    "$q",
    function ($q) {
      return function() {
        var deferred = $q.defer();

        deferred.resolve("{}");

        return deferred.promise;
      };
    }
  ]);

}());
