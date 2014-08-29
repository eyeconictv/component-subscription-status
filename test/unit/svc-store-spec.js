/*jshint expr:true */
"use strict";

describe("Services: storeService", function() {

  beforeEach(module("risevision.widget.common.service.store"));

  beforeEach(module(function ($provide) {
      $provide.service("$q", function() {return Q;});
  }));

  it("should exist", function(done) {
    inject(function(storeService) {
      expect(storeService).be.defined;
      done();
    });
  });

});
