/*jshint expr:true */
"use strict";

describe("Services: subscriptionStatusService", function() {

  beforeEach(module("risevision.widget.common.subscription-status.service"));

  beforeEach(module(function ($provide) {
      $provide.service("$q", function() {return Q;});
  }));

  it("should exist", function(done) {
    inject(function(subscriptionStatusService) {
      expect(subscriptionStatusService).be.defined;
      done();
    });
  });

  it("get function should exist", function(done) {
    inject(function(subscriptionStatusService) {
      expect(subscriptionStatusService.get).be.defined;
      done();
    });
  });

});
