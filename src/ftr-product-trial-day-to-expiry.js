"use strict";

angular.module("risevision.widget.common.subscription-status")
  .filter("productTrialDaysToExpiry", function() {
    return function(subscriptionExpiry) {
      var msg = "Expiring ";
      try {
        var days = Math.floor((new Date(subscriptionExpiry) - new Date()) / (1000 * 60 * 60 * 24)) + 1;
        if (days === 0) {
          msg += "Today";
        }
        else {
          msg += "in " + days + " Days";
        }
      } catch (e) {
        msg += "Today";
      }

      return msg;
    };
  });
