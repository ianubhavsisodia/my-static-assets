// Your existing DATA array and variables here (unchanged)
var DATA = [
  {
    id: 1,
    code: "UNLOCK",
    wieghtage: 50,
    win: "yes",
  },
  {
    id: 2,
    code: "UNA10",
    wieghtage: 40,
    win: "yes",
  },
  {
    id: 3,
    code: "UNACADEMY",
    wieghtage: 10,
    win: "yes",
  },
];

var scratchImgPath =
  "https://d3gfjdwfdb7zi0.cloudfront.net/in-app-scratch/assets/Start.png";

var promoCode = ""; // will hold the winning code

// Helper function to update referral_code in the subscribe link
function updateReferralCodeInLink() {
  var link = document.getElementById("cta1");
  if (link && promoCode) {
    try {
      var url = new URL(link.href);
      url.searchParams.set("referral_code", promoCode);
      link.href = url.toString();
    } catch (e) {
      // fallback for older browsers
      if (link.href.indexOf("referral_code=") !== -1) {
        link.href = link.href.replace(/(referral_code=)[^&]*/, "$1" + promoCode);
      }
    }
  }
}

// Scratchpad initialization and logic (your existing code, simplified here for clarity)
$(function () {
  // Initialize scratchpad (example, your code might differ)
  $("#card").wScratchPad({
    size: 50,
    bg: scratchImgPath,
    fg: "grey",
    realtime: true,
    scratchDown: function () {
      // play sound or other logic if needed
    },
    scratchUp: function () {
      var scratchedPercent = this scratched(); // assuming your wScratchPad instance provides this
      if (scratchedPercent > 50) { // example threshold to reveal
        // Pick winning code based on weights or logic
        var totalWeight = DATA.reduce(function (sum, item) {
          return sum + item.wieghtage;
        }, 0);
        var randomWeight = Math.random() * totalWeight;
        var cumulative = 0;
        var result = null;
        for (var i = 0; i < DATA.length; i++) {
          cumulative += DATA[i].wieghtage;
          if (randomWeight <= cumulative) {
            result = DATA[i];
            break;
          }
        }

        if (result && result.win === "yes") {
          promoCode = result.code; // **Set promo code**

          updateReferralCodeInLink(); // **Update the link automatically**

          // Show winning screen or update UI accordingly
          $(".screen-main").hide();
          $(".winScreen").show();
          $("#code").text(promoCode);
        }
      }
    },
  });
});

// Copy code function (your existing logic)
function copyCode() {
  var copyText = document.getElementById("code").textContent;
  navigator.clipboard.writeText(copyText).then(
    function () {
      alert("Code copied: " + copyText);
    },
    function (err) {
      alert("Failed to copy code");
    }
  );
}
