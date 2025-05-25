export function handAnim() {
    const cards = document.querySelectorAll('.card-in-deck');

    anime({
        targets: cards,
        translateY: ['100vh', '0'],
        opacity: [0, 1],
        delay: anime.stagger(150, { start: 300 }),
        duration: 600,
        easing: 'easeOutBack'
    });

    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            anime.remove(card);
            anime({
                targets: card,
                translateY: -3,
                scale: 1.05,
                duration: 200,
                easing: 'easeOutQuad'
            });
        });

        card.addEventListener('mouseleave', () => {
            anime.remove(card);
            anime({
                targets: card,
                translateY: 0,
                scale: 1,
                duration: 200,
                easing: 'easeOutQuad'
            });
        });
    });
}

export function showEndOverlay(type) {
    const overlay = document.createElement("div");
    overlay.id = "end-overlay";
    overlay.className = "overlay";

    const text = document.createElement("h1");
    text.textContent = type === "win" ? "You Win!" : "You Lose";
    text.className = type === "win" ? "win-text" : "lose-text";
    overlay.appendChild(text);

    document.body.appendChild(overlay);

    if (type === "win") {
        for (let i = 0; i < 5; i++) {
            const sparkle = document.createElement("div");
            sparkle.className = "sparkle";
            overlay.appendChild(sparkle);
        }

        anime({
            targets: '.sparkle',
            scale: [{ value: 0, duration: 0 }, { value: 1.5, duration: 300 }, { value: 0, duration: 300 }],
            translateX: () => anime.random(-200, 200),
            translateY: () => anime.random(-200, 200),
            opacity: [{ value: 0, duration: 0 }, { value: 1, duration: 300 }, { value: 0, duration: 300 }],
            delay: anime.stagger(150, { start: 300 }),
            loop: true,
            easing: 'easeInOutSine'
        });
    }

    if (type === "lose") {
        const leftFlag = document.createElement("img");
        const rightFlag = document.createElement("img");

        leftFlag.src = "/images/lobby/flag.png";
        rightFlag.src = "/images/lobby/flag.png";

        leftFlag.className = "flag flag-left";
        rightFlag.className = "flag flag-right";

        overlay.appendChild(leftFlag);
        overlay.appendChild(rightFlag);

        anime({
            targets: '.flag',
            rotate: [{ value: -15, duration: 300 }, { value: 15, duration: 300 }],
            loop: true,
            direction: 'alternate',
            easing: 'easeInOutSine'
        });
    }
}
