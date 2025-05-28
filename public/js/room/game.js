import{ animateNumberChange, moveMyCard, moveEnemyCard } from './animations.js';

let currentMana = 4;

export function renderPlayerInfo(player) {
    const healthElem = document.querySelector('.hud.bottom .health .value');
    const manaElem = document.querySelector('.hud.bottom .mana .value');

    const currentHealth = parseInt(healthElem.textContent) || 0;
    const currentManaValue = parseInt(manaElem.textContent) || 0;

    animateNumberChange(healthElem, currentHealth, player.defense);
    animateNumberChange(manaElem, currentManaValue, player.mana);

    currentMana = player.mana;
}

function updateManaUI() {
    const manaElem = document.querySelector('.hud.bottom .mana .value');
    const currentValue = parseInt(manaElem.textContent) || 0;
    animateNumberChange(manaElem, currentValue, currentMana);
}

export function renderOpponentNameAndAvatar(opponent) {
    const nicknameElem = document.querySelector('.hud.top .nickname');
    const avatarElem = document.querySelector('.hud.top .avatar');

    nicknameElem.textContent = opponent.name;
    avatarElem.src = `/images/avatars/${opponent.avatar}.png`;
}

export function renderOpponentHealth(opponent) {
    const healthElem = document.querySelector('.hud.top .health .value');
    const currentHealth = parseInt(healthElem.textContent) || 0;
    animateNumberChange(healthElem, currentHealth, opponent.defense);
}

export function updateButtStatus(isPlayerTurn) {
    const butt = document.getElementById('end-turn');
    butt.disabled = !isPlayerTurn;
}

export function updateBattlefield(battlefield) {
    const enemyCards = battlefield.opponent;
    const enemySlots = document.querySelectorAll('.player2-cards .card');

    enemySlots.forEach(slot => slot.innerHTML = '');

    enemyCards.forEach((cardId, index) => {
        const cardData = deck.find(card => card.id === cardId);
        if (!cardData || index >= enemySlots.length) return;

        moveEnemyCard(enemySlots[index], cardData);
    });
}

function attachCardStatusListeners() {
    const cards = document.querySelectorAll('.card-hand .card-in-deck');

    cards.forEach(card => {
        card.addEventListener('click', () => {
            toggleCardStatus(card);
        });
    });
}

function toggleCardStatus(cardElement) {
    const cardId = parseInt(cardElement.getAttribute('data-card-id'));
    const cardData = deck.find(card => card.id === cardId);

    if (currentMana < cardData.cost) {
        showPopupMessage('Not enough sparks to play this card!', 2000);
        return;
    }

    const targetSlot = findFreeBattlefieldSlot();
    if (!targetSlot) {
        showPopupMessage('No free slots on the battlefield!', 2000);
        return;
    }

    currentMana -= cardData.cost;
    updateManaUI();

    moveMyCard(cardElement, targetSlot);
}

export function updateCardInteractivity(isPlayerTurn) {
    const cards = document.querySelectorAll('.card-hand .card-in-deck');
    cards.forEach(card => {
        if (isPlayerTurn) {
            card.classList.remove('disabled');
        } else {
            card.classList.add('disabled');
        }
    });
}

export function updateHand(player, isPlayerTurn = false) {
    const handContainer = document.querySelector('.card-hand');
    handContainer.innerHTML = '';

    player.hand.forEach(cardId => {
        const cardData = deck.find(card => card.id === cardId);

        const cardElement = document.createElement('div');
        cardElement.classList.add('card-in-deck');
        cardElement.setAttribute('data-status', 'in-hand');
        cardElement.setAttribute('data-card-id', cardData.id);

        cardElement.innerHTML = `
            <img class="unit-image" src="/images/cards/${cardData.id}.png" alt="${cardData.name}">
            <div class="stat top-left"><img src="/images/lobby/attack.png" alt="Attack"> ${cardData.attack}</div>
            <div class="stat top-right"><img src="/images/lobby/defense.png" alt="Defense"> ${cardData.defense}</div>
            <div class="stat bottom-right"><img src="/images/lobby/cost.png" alt="Cost"> ${cardData.cost}</div>
        `;

        handContainer.appendChild(cardElement);
    });

    attachCardStatusListeners();
    updateCardInteractivity(isPlayerTurn);
}

export function updateHealthTextures(players) {
    const player = players.me;
    const opponent = players.opponent;

    const updateTexture = (selector, healthValue) => {
        const icon = document.querySelector(`${selector} .health .icon`);
        let texture;
        switch (true) {
            case (healthValue > 20):
                texture = 'fullhp.png';
                break;
            case (healthValue > 10):
                texture = 'halfhp.png';
                break;
            default:
                texture = 'lowhp.png';
        }

        icon.src = `/images/lobby/${texture}`;
    };

    updateTexture('.hud.bottom', player.defense);
    updateTexture('.hud.top', opponent.defense);
}

export function getBattlefieldCardIds() {
    const slots = document.querySelectorAll('.player1-cards .card');
    const battlefieldCards = [];

    slots.forEach(slot => {
        const cardId = slot.getAttribute('data-card-id');
        if (cardId) {
            battlefieldCards.push(parseInt(cardId));
        }
    });

    return battlefieldCards;
}

function findFreeBattlefieldSlot() {
    const slots = document.querySelectorAll('.player1-cards .card');
    for (const slot of slots) {
        if (!slot.classList.contains('occupied')) {
            return slot;
        }
    }
    return null;
}

export function showPopupMessage(message, duration = 1000) {
    const popup = document.getElementById('message-popup');
    popup.textContent = message;
    popup.classList.remove('hidden');
    popup.classList.add('show');

    setTimeout(() => {
        popup.classList.remove('show');
        setTimeout(() => {
            popup.classList.add('hidden');
        }, 500);
    }, duration);
}

export function clearBattlefield() {
    const allSlots = document.querySelectorAll('.player1-cards .card, .player2-cards .card');

    allSlots.forEach(slot => {
        slot.innerHTML = '';
        slot.removeAttribute('style');
        slot.classList.remove('occupied');

        if (slot.closest('.player1-cards')) {
            slot.className = 'card my-card';
        } else if (slot.closest('.player2-cards')) {
            slot.className = 'card enemy-card';
        }
    });
}