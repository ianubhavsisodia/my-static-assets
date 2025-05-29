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

var scratchImgPath = "https://d3gfjdwfdb7zi0.cloudfront.net/in-app-scratch/assets/Start.png";

var promoCode = "";
var audio = $('#audio')[0];
var isScratching = false;

function callScratchPad() {
  $("#card").wScratchPad({
    size: 30,
    bg: "#ffffff",
    realtime: true,
    fg: scratchImgPath,
    scratchStart: function (e) {
      isScratching = true;
      if (!audio.paused) {
        audio.pause();
      }
      audio.currentTime = 0;
      audio.play();
    },
    scratchMove: function (e, percent) {
      isScratching = false;
      if (percent > 50 && result.win !== "no") {
        document.querySelector(".screen-main").classList.add("hide");
        document.querySelector(".winScreen").classList.add("show");
      } else if (percent > 80 && result.win === "no") {
        document.querySelector(".screen-main").classList.add("hide");
        document.querySelector(".loseScreen").classList.add("show");
      }
    },
  });
}

var result = weightedRandom(DATA);

if (result.win === "no") {
  document.querySelector(".scratchContainer .scratchpad").style.backgroundImage =
    "url('https://d3gfjdwfdb7zi0.cloudfront.net/in-app-scratch/assets/lose.png')";
  document.querySelector(".scratchContainer .scratchpad").style.backgroundSize = "cover";
  document
    .querySelector(".scratchContainer .scratchpad")
    .insertAdjacentHTML("beforeend", `<p>Better luck next time!</p>`);
  promoCode = "";
  try {
    weNotification.trackEvent(
      "In-app Template - Card Scratched",
      JSON.stringify({
        Win: "No",
        "Coupon Code": result.code,
      }),
      false
    );
  } catch (error) {
    console.error(
      "InApp event tracking is not supported in current WebEngage SDK version. Please update the WebEngage SDK."
    );
  }
} else {
  document.querySelector(".scratchContainer .scratchpad").style.backgroundImage =
    "url('https://d3gfjdwfdb7zi0.cloudfront.net/in-app-scratch/assets/Won.png')";
  document.querySelector(".scratchContainer .scratchpad").style.backgroundSize = "cover";
  document
    .querySelector(".scratchContainer .scratchpad")
    .insertAdjacentHTML(
      "beforeend",
      `<code><p>You won</p><p><b>${result.code}</b></p><img src='https://d3gfjdwfdb7zi0.cloudfront.net/in-app-scratch/assets/Icon.svg' alt='copy-code-icon' style="width:20px;"><span id='code'>✓</span></code>`
    );
  document.querySelector(".winScreen code p").innerHTML = `<p>You won</p><p><b>${result.code}</b></p>`;
  promoCode = result.code;

  // 🔥 Update the CTA button href with the promo code
  const ctaBtn = document.getElementById("cta1");
  if (ctaBtn) {
    let href = ctaBtn.getAttribute("href");
    if (href.includes("referral_code=")) {
      href = href.replace(/referral_code=[^&]*/, `referral_code=_*_
