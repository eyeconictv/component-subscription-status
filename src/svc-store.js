angular.module("risevision.widget.common.service.store", [])
  .service("storeService", ["$http", "$q", function ($http, $q) {

    var defaultObj = {
      "search": "",
      "cursor": 0,
      "count": 50,
      "sort": "code"
    };

    function processInstruments(dataTable) {
      var instruments = [];
      for (var i = 0; i < dataTable.getNumberOfRows(); i++) {
        var row = {
          "id": dataTable.getValue(i, 0),
          "text": dataTable.getValue(i, 0) +
          (dataTable.getValue(i, 1) ? " - " + dataTable.getValue(i, 1) : "")
        };
        instruments.push(row);
      }
      return instruments;
    }

    function formQuerystring(obj) {
      var search = angular.lowercase(obj.search);

      var queryString = "where ((lower(code) like '%" + search + "%') or" +
        " (lower(name) like '%" + search + "%'))" +
        " order by " + obj.sort +
        " limit " + obj.count +
        " offset " + obj.cursor;

      return queryString;
    }

    this.getInstruments = function (obj) {
      var deferred = $q.defer();

      obj = angular.extend(defaultObj, obj);

      jsapiLoader.getVisualization().then(function (gApi) {
        var url = CONFIG.FINANCIAL_SERVER_URL + "lookup/local";

        var query = new gApi.Query(url, {
          sendMethod: 'scriptInjection'
        });

        query.setQuery(formQuerystring(obj));

        query.send(function(queryResponse) {
          if (!queryResponse) {
            deferred.reject("No response");
          }
          else if (queryResponse.isError()) {
            deferred.reject(queryResponse.getMessage());
          }
          else {
            var dataTable = queryResponse.getDataTable();
            deferred.resolve(processInstruments(dataTable));
          }
        });
      });

      return deferred.promise;
    };

  }]);
