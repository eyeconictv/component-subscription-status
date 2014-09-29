"use strict";

angular.module("risevision.widget.common.subscription-status")
  .filter("productTrialDaysToExpiry", function() {
    return function(subscriptionExpiry) {
      var msg = "Expiring ";
      try {
        var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
        var timeInMs = new Date(subscriptionExpiry).getTime() - new Date().getTime();
        var days = Math.floor(timeInMs/oneDay);

        if (days === 0) {
          msg += "Today";
        }
        else if (days > 0) {
          msg += "in " + days + " Days";
        }
        else {
          msg = "Today";
        }
      } catch (e) {
        msg += "Today";
      }

      return msg;
    };
  });
