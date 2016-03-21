/*jshint expr:true */
/* global sinon */
/*jshint sub:true*/

"use strict";
describe("controller: store modal", function() {
  beforeEach(module("risevision.widget.common.subscription-status"));
  beforeEach(module(function ($provide) {
    widget = {
      url: "widget.url",
      additionalParams: "test"
    };
    $provide.service("$modalInstance",function(){
      return {
        close : function(){
          return;
        },
        dismiss : function(){
          return;
        }
      };
    });
    $provide.service("gadgetsApi",function(){
      return gadgetsApi;
    });
    $provide.service("$sce", function() {
      return {
        trustAsResourceUrl: function(url) {
          return url;
        }
      };
    });
    
  }));
  var $scope, $timeout, $modalInstance, $modalInstanceDismissSpy, $modalInstanceCloseSpy, widget, gadgetsApi;

  beforeEach(function(){

    inject(function($injector,$rootScope, $controller){
      gadgetsApi = {
        rpc: {
          register : function(functionName, functionCall){
            gadgetsApi.functions[functionName] = functionCall;
          },
          setupReceiver : function(receiver){
            gadgetsApi.receiver = receiver;
          }          
        },
        functions: {}
      };
      
      $scope = $rootScope.$new();
      $modalInstance = $injector.get("$modalInstance");
      
      $modalInstanceDismissSpy = sinon.spy($modalInstance, "dismiss");
      $modalInstanceCloseSpy = sinon.spy($modalInstance, "close");

      $timeout = $injector.get("$timeout");

      $controller("StoreModalController", {
        $scope: $scope,
        $timeout: $timeout,
        $modalInstance : $modalInstance,
        productId: "productId",
        companyId: "companyId",
        gadgetsApi: $injector.get("gadgetsApi")
      });
      $scope.$digest();
    });
  });
  
  beforeEach(function() {
    $timeout.flush();
  });
  
  it("should exist",function(){
    expect($scope).to.be.truely;
    expect($scope.url).to.ok;
    expect($scope.url).to.equal("https://store.risevision.com//product/productId/?up_id=store-modal-iframe&parent=http%3A%2F%2Fserver%2F&inRVA=true&cid=companyId");
  });

  it("should initialize RPC",function() {
    expect(gadgetsApi.rpc.register).to.be.a("function");
    expect(gadgetsApi.rpc.setupReceiver).to.be.a("function");

    expect(gadgetsApi.receiver).to.equal("store-modal-iframe");
    
    expect(gadgetsApi.functions).to.be.an("object");
    expect(gadgetsApi.functions).to.have.property("rscmd_saveSettings");
    expect(gadgetsApi.functions).to.have.property("rscmd_closeSettings");
  });
  
  it("should close settings", function() {
    gadgetsApi.functions["rscmd_closeSettings"]();
    
    $modalInstanceDismissSpy.should.have.been.called;
  });
  
  it("should save settings", function() {
    gadgetsApi.functions["rscmd_saveSettings"]();
    
    $modalInstanceCloseSpy.should.have.been.called;
  });

});
