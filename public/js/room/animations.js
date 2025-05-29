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

export function animateNumberChange(elem, start, end, duration = 500) {
    const startTime = performance.now();
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const value = Math.floor(start + (end - start) * progress);
        elem.textContent = value;

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

function createCardHTML(cardData) {
    return `
        <img class="unit-image" src="/images/cards/${cardData.id}.png" alt="${cardData.name}" title="${cardData.name}">
        <div class="stat top-left"><img src="/images/lobby/attack.png" alt="Attack"> ${cardData.attack}</div>
        <div class="stat top-right"><img src="/images/lobby/defense.png" alt="Defense"> ${cardData.defense}</div>
        <div class="stat bottom-right"><img src="/images/lobby/cost.png" alt="Cost"> ${cardData.cost}</div>
    `;
}

function applyCardStyles(el) {
    Object.assign(el.style, {
        background: "linear-gradient(135deg, #3a3a3a, #222)",
        border: "2px solid #ff4444",
        borderRadius: "16px",
        padding: "6px",
        boxShadow: `0 0 12px rgba(255, 0, 0, 0.4),
                    inset 0 0 8px rgba(255, 0, 0, 0.2)`,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden"
    });
}

export function moveEnemyCard(targetSlotEl, cardData) {
    const animCard = document.createElement("div");
    animCard.classList.add("card", "enemy-card");

    animCard.innerHTML = createCardHTML(cardData);
    applyCardStyles(animCard);

    const slotRect = targetSlotEl.getBoundingClientRect();
    Object.assign(animCard.style, {
        position: "absolute",
        left: `${slotRect.left}px`,
        top: `-200px`,
        width: `${slotRect.width}px`,
        height: `${slotRect.height}px`,
        zIndex: 9999,
        transform: "scale(1.4)",
        pointerEvents: "none"
    });

    document.body.appendChild(animCard);

    anime({
        targets: animCard,
        top: `${slotRect.top}px`,
        scale: 1,
        easing: "easeOutBack",
        duration: 400,
        complete: () => {
        animCard.remove();
        targetSlotEl.innerHTML = createCardHTML(cardData);
        applyCardStyles(targetSlotEl);
        targetSlotEl.classList.add("card", "enemy-card");
        }
    });
}

export function moveMyCard(cardEl, targetSlotEl) {
    const cardRect = cardEl.getBoundingClientRect();
    const slotRect = targetSlotEl.getBoundingClientRect();

    const cardContent = cardEl.innerHTML;
    const cardId = cardEl.getAttribute('data-card-id');

    cardEl.style.pointerEvents = 'none';
    cardEl.style.opacity = '0.5';

    const clone = document.createElement('div');
    clone.innerHTML = cardContent;

    targetSlotEl.classList.add('occupied');
    targetSlotEl.setAttribute('data-card-id', cardId);

    Object.assign(clone.style, {
        position: 'fixed',
        left: `${cardRect.left}px`,
        top: `${cardRect.top}px`,
        width: `${cardRect.width}px`,
        height: `${cardRect.height}px`,
        margin: '0',
        zIndex: '9999',
        pointerEvents: 'none',
        background: 'linear-gradient(135deg, #3a3a3a, #222)',
        border: '2px solid #b8b8b8',
        borderRadius: '16px',
        padding: '6px',
        boxShadow: '0 0 12px rgba(255, 255, 255, 0.3), inset 0 0 8px rgba(0, 255, 204, 0.1)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        flexDirection: 'column',
        transformOrigin: 'center center'
    });

    document.body.appendChild(clone);
    cardEl.style.width = "0";
    cardEl.style.height = "0";
    cardEl.style.padding = "0";
    cardEl.style.margin = "0 -6px";
    cardEl.style.border = "0";
    cardEl.style.fontSize = "0";
    cardEl.style.overflow = "hidden";
    cardEl.style.transition = "0.4s";

    anime({
        targets: clone,
        left: `${slotRect.left}px`,
        top: `${slotRect.top}px`,
        scale: 1,
        duration: 400,
        easing: 'easeOutExpo',
        complete: () => {
            clone.remove();

            targetSlotEl.innerHTML = cardContent;

            Object.assign(targetSlotEl.style, {
                position: 'relative',
                width: '110px',
                height: '150px',
                background: 'linear-gradient(135deg, #3a3a3a, #222)',
                border: '2px solid #b8b8b8',
                borderRadius: '16px',
                padding: '6px',
                boxShadow: '0 0 12px rgba(255, 255, 255, 0.3), inset 0 0 8px rgba(0, 255, 204, 0.1)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'hidden',
                transition: 'transform 0.25s ease, box-shadow 0.25s ease'
            });

            cardEl.remove();
        }
    });
}
