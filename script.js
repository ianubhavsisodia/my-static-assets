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
            isScratching = true; // Set scratching state to true when scratching starts
            if (!audio.paused) {
                audio.pause(); // Pause audio if it's already playing
            }
            audio.currentTime = 0; // Rewind audio to start
            audio.play(); // Start playing audio
        },
        scratchMove: function (e, percent) {
            isScratching = false;
            // Show the plain-text promo code and call-to-action when the
            /* scratch area is 80% scratched */
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

// Wieghtage on which you dont want to show winning screen goes to if condition i.e. in our case 40.
if (result.win === "no") {
    document.querySelector(".scratchContainer .scratchpad").style.backgroundImage = "url('https://d3gfjdwfdb7zi0.cloudfront.net/in-app-scratch/assets/lose.png')";
    document.querySelector(".scratchContainer .scratchpad").style.backgroundSize = "cover";
    document
        .querySelector(".scratchContainer .scratchpad")
        .insertAdjacentHTML("beforeend", `<p>Better luck next time!</p>`);
    promoCode = "";
    try {
        weNotification.trackEvent(
            "In-app Template - Card Scratched",
            JSON.stringify({
                "Win": "No",
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
    document.querySelector(".scratchContainer .scratchpad").style.backgroundImage = "url('https://d3gfjdwfdb7zi0.cloudfront.net/in-app-scratch/assets/Won.png')";
    document.querySelector(".scratchContainer .scratchpad").style.backgroundSize = "cover";
    document
        .querySelector(".scratchContainer .scratchpad")
        .insertAdjacentHTML(
            "beforeend",
            `<code><p>You won</p><p><b>${result.code}</b></p><img src='https://d3gfjdwfdb7zi0.cloudfront.net/in-app-scratch/assets/Icon.svg' alt='copy-code-icon' srcset='' style="width:20px;"><span id='code'>✔</span></code>`
        );
    document.querySelector(".winScreen code p").innerHTML =
        `<p>You won</p><p><b>${result.code}</b></p>`;
    promoCode = result.code;

    // *** HERE: Update CTA link to append promoCode after referral_code= ***
    var cta = document.getElementById("cta1");
    if (cta && promoCode) {
        var href = cta.getAttribute("href");
        var newHref;

        if (href.includes("referral_code=")) {
            // Replace referral_code= value with promoCode
            newHref = href.replace(/(referral_code=)[^&]*/, `$1${promoCode}`);
        } else {
            // If referral_code= missing, append it at the end
            newHref = href + (href.includes("?") ? "&" : "?") + "referral_code=" + promoCode;
        }

        cta.setAttribute("href", newHref);
    }

    try {
        weNotification.trackEvent(
            "In-app Template - Card Scratched",
            JSON.stringify({
                "Win": "Yes",
                "Coupon Code": result.code,
            }),
            false
        );
    } catch (error) {
        console.error(
            "InApp event tracking is not supported in current WebEngage SDK version. Please update the WebEngage SDK."
        );
    }
}

callScratchPad();
document.querySelector(".scratchContainer .scratchpad > img").remove();

function weightedRandom(items) {
    if (!items.length) {
        throw new Error('Items must not be empty');
    }
    const cumulativeWeights = [];
    for (let i = 0; i < items.length; i += 1) {
        cumulativeWeights[i] = items[i].wieghtage + (cumulativeWeights[i - 1] || 0);
    }

    const maxCumulativeWeight = cumulativeWeights[cumulativeWeights.length - 1];
    const randomNumber = maxCumulativeWeight * Math.random();

    for (let itemIndex = 0; itemIndex < items.length; itemIndex += 1) {
        if (cumulativeWeights[itemIndex] >= randomNumber) {
            return items[itemIndex]
        }
    }
}

async function copyCode() {
    var copyText = document.querySelector("code p:nth-child(2)");
    try {
        await navigator.clipboard.writeText(copyText.innerText);
        document.querySelector("code span").style.display = "inline-block";
        setTimeout(function () {
            document.querySelector("code span").style.display = "none";
        }, 1000);
        weNotification.trackEvent(
            "In-app Template - Copy Clicked",
            JSON.stringify({ "Coupon Code": copyText.innerText }),
            false
        );
    } catch (err) {
        console.error(
            "Content not Copied: InApp event tracking is not supported in current WebEngage SDK version. Please update the WebEngage SDK."
        );
    }
}
