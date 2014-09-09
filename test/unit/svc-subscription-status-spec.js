/*jshint expr:true */
"use strict";

describe("Services: subscriptionStatusService", function() {

  beforeEach(module("risevision.widget.common.subscription-status.service"));

  beforeEach(module(function ($provide) {
    $provide.service("$q", function() {return Q;});

    // $http service mock responds to service requests
    $provide.service("$http", function() {
      var service = {};

      service.get = function(url) {
        var response = {
          "data": [{
            "pc":"1",
            "status":"",
            "expiry":null
          }]
        };
        if (url && url.indexOf("/company/invalid/") !== -1) {
          response.data[0].status = "";
        }
        else if (url && url.indexOf("/product/status?pc=2") !== -1) {
          response.data[0].status = "Expired";
        }
        else {
          response.data[0].status = "Free";
        }
        return new Q(response);
      };

      return service;
    });
  }));

  it("should exist", function(done) {
    inject(function(subscriptionStatusService) {
      expect(subscriptionStatusService).be.defined;

      done();
    });
  });

  it("should call product status api", function(done) {
    inject(function(subscriptionStatusService) {
      subscriptionStatusService.get("1", "12345").then(function(data){
        expect(data).be.defined;
        expect(data.status).be.equal("Free");
        expect(data.subscribed).be.equal(true);

        done();
      });
    });
  });

  it("should fail if company is invalid", function(done) {
    inject(function(subscriptionStatusService) {
      subscriptionStatusService.get("1", "invalid").then(function(){
        done();
      },
      function(error) {
        expect(error).be.equal("No response");
        done();
      });
    });
  });

  it("should return expired product", function(done) {
    inject(function(subscriptionStatusService) {
      subscriptionStatusService.get("2", "12345").then(function(data){
        expect(data).be.defined;
        expect(data.status).be.equal("Expired");
        expect(data.subscribed).be.equal(false);

        done();
      });
    });
  });

});
