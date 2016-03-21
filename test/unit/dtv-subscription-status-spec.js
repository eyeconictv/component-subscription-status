/*jshint expr:true */
/* global sinon */

"use strict";
describe("directive: subscription status", function() {
  var $compile, $rootScope, $emitSpy, element, modalSuccess, modalResult, subscriptionSuccess;

  beforeEach(module("risevision.widget.common.subscription-status"));
  beforeEach(module(function ($provide) {
    $provide.service("$modal", function() {
      return {
        open: function() {
          var deferred = Q.defer();
          
          if (modalSuccess) {
            modalResult = true;
            deferred.resolve();
          }
          else {
            modalResult = false;
            deferred.reject();
          }

          return {
            result: deferred.promise
          };
        }
      };
    });
    $provide.service("subscriptionStatusService", function() {
      return {
        get: function() {
          var deferred = Q.defer();
          if(subscriptionSuccess){
            deferred.resolve({status: "subscribed"});
          }else{
            deferred.resolve({status: "trial"});
          }
          return deferred.promise;
        }
      };
    });
  }));

  beforeEach(inject(function(_$compile_, _$rootScope_, $templateCache){
    modalSuccess = true;
    modalResult = "";
    subscriptionSuccess = false;

    $templateCache.put("subscription-status-template.html", "<p>mock</p>");
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    
    $emitSpy = sinon.spy($rootScope, "$emit");

    element = $compile("<div id='subscription-status' subscription-status product-id='productId' " +
    "product-code='productCode' company-id='companyId' ng-model='subscribed'></div>")($rootScope);
  }));
  
  beforeEach(function(done) {
    $rootScope.$digest();

    setTimeout(function() {
      done();
    }, 10);
  });

  it("should replace the element with the appropriate content", function() {
    expect(element.html()).to.equal("<p>mock</p>");
  });
  
  it("should add watchers", function() {
    expect(element.isolateScope().$$watchers[0].exp).to.equal("showStoreModal");
    expect(element.isolateScope().$$watchers[1].exp).to.equal("subscriptionStatus");
    expect(element.isolateScope().$$watchers[2].exp).to.equal("companyId");
  });
  
  it("watch companyId and update checkSubscriptionStatus", function() {
    expect(element.isolateScope().subscriptionStatus).to.deep.equal({"status": "trial"});
    expect(element.isolateScope().storeAccountUrl).to.equal("https://store.risevision.com//account?cid=companyId");

    $emitSpy.should.have.been.calledOnce;
    $emitSpy.should.have.been.calledWith("subscription-status:changed", {status: "trial"});
  });
  
  it("should listen to 'refreshSubscriptionStatus' event", function(done) {
    $emitSpy.reset();
    subscriptionSuccess = true;

    $rootScope.$emit("refreshSubscriptionStatus");
    $rootScope.$digest();

    setTimeout(function() {
      expect(element.isolateScope().subscriptionStatus).to.deep.equal({"status": "subscribed"});

      // First $emit is from this test
      $emitSpy.should.have.been.calledTwice;
      $emitSpy.should.have.been.calledWith("subscription-status:changed", {status: "subscribed"});
      
      done();
    }, 10);
  });

  describe("showStoreModal:", function() {
    it("should close modal", function(done) {
      element.isolateScope().showStoreModal = true;
      $rootScope.$digest();

      setTimeout(function() {
        expect(modalResult).to.be.true;
        
        done();
      }, 10);
    });

    it("should dismiss modal", function(done) {
      modalSuccess = false;

      element.isolateScope().showStoreModal = true;
      $rootScope.$digest();

      setTimeout(function() {
        expect(modalResult).to.be.false;
        
        done();
      }, 10);
    });

    it("should emit event when subscription status changes", function(done) {
      $emitSpy.reset();

      subscriptionSuccess = true;
      element.isolateScope().showStoreModal = true;
      $rootScope.$digest();

      setTimeout(function() {
        $emitSpy.should.have.been.calledOnce;
        $emitSpy.should.have.been.calledWith("subscription-status:changed", {status: "subscribed"});

        done();
      }, 10);
    });

  });
  
});
