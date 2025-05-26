let timerInterval = null;
let timerAnimation = null;

export function startCircularTurnTimer(seconds = 30, onEnd = () => {}) {
    console.log("startCircularTurnTimer started");

    const circle = document.getElementById("turn-timer-circle");
    const label = document.getElementById("turn-timer-label");

    if (!circle || !label) return;

    if (timerAnimation) {
        timerAnimation.pause();
        timerAnimation = null;
    }
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }

    const radius = parseFloat(circle.getAttribute("r"));
    const totalLength = 2 * Math.PI * radius;

    circle.setAttribute("stroke-dasharray", totalLength);
    circle.setAttribute("stroke-dashoffset", "0");

    timerAnimation = anime({
        targets: circle,
        strokeDashoffset: [0, totalLength],
        duration: seconds * 1000,
        easing: "linear",
        complete: onEnd
    });

    let t = seconds;
    label.textContent = t;

    timerInterval = setInterval(() => {
        t--;
        if (t >= 0) {
        label.textContent = t;
        }
        if (t <= 0) {
        clearInterval(timerInterval);
        timerInterval = null;
        }
    }, 1000);
}