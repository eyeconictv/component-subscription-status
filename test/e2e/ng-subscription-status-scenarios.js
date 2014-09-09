/* jshint expr: true */

(function() {

  "use strict";

  /* https://github.com/angular/protractor/blob/master/docs/getting-started.md */

  var chai = require("chai");
  var chaiAsPromised = require("chai-as-promised");

  chai.use(chaiAsPromised);
  var expect = chai.expect;

  browser.driver.manage().window().setSize(1024, 768);

  describe("Subscription Status Component", function() {
    beforeEach(function (){
      browser.get("/test/e2e/ng-subscription-status-scenarios.html");
    });

    it("Should show the default subscription status", function (done) {
      expect(element(by.css("#subscription-status h3 a span")).isPresent()).
        to.equal.true;

      expect(element(by.css("#subscription-status h3 a span")).getText()).
        to.eventually.equal("N/A");

      expect(element(by.css(".product-expired")).isPresent()).
        to.eventually.be.true;
    });


    it("Should show a valid subscription status", function (done) {
      element(by.id("setValid")).click();

      expect(element(by.css("#subscription-status h3 a span")).getText()).
        to.eventually.equal("Free");

      expect(element(by.css(".product-trial")).isPresent()).
        to.eventually.be.true;
    });

    it("Should show an invalid subscription status", function (done) {
      element(by.id("setInvalid")).click();

      expect(element(by.css("#subscription-status h3 a span")).getText()).
        to.eventually.equal("N/A");

      expect(element(by.css(".product-expired")).isPresent()).
        to.eventually.be.true;
    });

    it("Should show an expired subscription status", function (done) {
      element(by.id("setExpired")).click();

      expect(element(by.css("#subscription-status h3 a span")).getText()).
        to.eventually.equal("Expired");

      expect(element(by.css(".product-expired")).isPresent()).
        to.eventually.be.true;
    });

  });

})();
