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
            if (percent > 50 && result.win !== "no") {
                document.querySelector(".screen-main").classList.remove("show");
                document.querySelector(".winScreen").classList.add("show");
                updateCTAButton(promoCode);
            } else if (percent > 80 && result.win === "no") {
                document.querySelector(".screen-main").classList.remove("show");
                document.querySelector(".loseScreen").classList.add("show");
            }
        },
    });
}

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
            return items[itemIndex];
        }
    }
}

function updateCTAButton(code) {
    var ctaButton = document.getElementById("cta1");
    var originalHref = ctaButton.getAttribute("href");
    var newHref;

    if (originalHref.includes("referral_code=")) {
        newHref = originalHref.replace(/referral_code=[^&]*/, "referral_code=" + code);
    } else {
        newHref = originalHref + "&referral_code=" + code;
    }

    ctaButton.setAttribute("href", newHref);
}

async function copyCode() {
    var copyText = document.getElementById("promoCodeDisplay");
    try {
        await navigator.clipboard.writeText(copyText.innerText);
        alert("Code copied to clipboard!");
    } catch (err) {
        console.error("Failed to copy code: ", err);
    }
}

// ---- Main Logic ----

var result = weightedRandom(DATA);

if (result.win === "no") {
    document.querySelector(".scratchContainer .scratchpad").style.backgroundImage = "url('https://d3gfjdwfdb7zi0.cloudfront.net/in-app-scratch/assets/lose.png')";
    document.querySelector(".scratchContainer .scratchpad").style.backgroundSize = "cover";
    document.querySelector(".scratchContainer .scratchpad").innerHTML = `<p>Better luck next time!</p>`;
    promoCode = "";
    try {
        weNotification.trackEvent(
            "In-app Template - Card Scratched",
            JSON.stringify({ "Win": "No", "Coupon Code": result.code }),
            false
        );
    } catch (error) {
        console.error("WebEngage SDK tracking error (lose): ", error);
    }
} else {
    document.querySelector(".scratchContainer .scratchpad").style.backgroundImage = "url('https://d3gfjdwfdb7zi0.cloudfront.net/in-app-scratch/assets/Won.png')";
    document.querySelector(".scratchContainer .scratchpad").style.backgroundSize = "cover";
    document.querySelector(".scratchContainer .scratchpad").innerHTML = `<code><p>You won</p><p><b>${result.code}</b></p></code>`;
    document.getElementById("promoCodeDisplay").innerText = result.code;
    promoCode = result.code;
    try {
        weNotification.trackEvent(
            "In-app Template - Card Scratched",
            JSON.stringify({ "Win": "Yes", "Coupon Code": result.code }),
            false
        );
    } catch (error) {
        console.error("WebEngage SDK tracking error (win): ", error);
    }
}

callScratchPad();
