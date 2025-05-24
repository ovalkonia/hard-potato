import { deck, user_id } from './globals.js';

function renderPlayerInfo(player) {
    const healthElem = document.querySelector('.hud.bottom .health .value');
    const manaElem = document.querySelector('.hud.bottom .mana .value');
    healthElem.textContent = player.Health;
    manaElem.textContent = player.mana;
}

function renderOponentInfo(opponent) {
    const nicknameElem = document.querySelector('.hud.top .nickname');
    const avatarElem = document.querySelector('.hud.top .avatar');
    const healthElem = document.querySelector('.hud.top .health .value');

    nicknameElem.textContent = opponent.name;
    avatarElem.src = `/images/avatars/${opponent.avatar}.png`;
    healthElem.textContent = opponent.Health;
}

function updateButtStatus(isPlayerTurn) {
    const butt = document.getElementById('end-turn');
    butt.disabled = !isPlayerTurn;
}

function updateBattlefield(opponentId, battlefield) {
    const enemyCards = battlefield[opponentId];
    const enemySlots = document.querySelectorAll('.player2-cards .card');

    enemySlots.forEach(slot => {
        slot.innerHTML = '';
    });

    enemyCards.forEach((cardId, index) => {
        const cardData = deck.find(card => card.id === cardId);
        if (!cardData || index >= enemySlots.length) return;

        const cardHtml = `
            <img class="unit-image" src="/images/avatars/${cardData.id}.png" alt="${cardData.name}">
            <div class="stat top-left"><img src="/images/lobby/attack.png" alt="Attack"> ${cardData.attack}</div>
            <div class="stat top-right"><img src="/images/lobby/defense.png" alt="Defense"> ${cardData.defense}</div>
            <div class="stat bottom-right"><img src="/images/lobby/cost.png" alt="Cost"> ${cardData.cost}</div>
        `;

        // const cardHtml = `
        //     <div class="card-in-deck">
        //         <img class="unit-image" src="/images/avatars/${cardData.id}.png" alt="${cardData.name}">
        //         <div class="stat top-left"><img src="/images/lobby/attack.png" alt="Attack"> ${cardData.attack}</div>
        //         <div class="stat top-right"><img src="/images/lobby/defense.png" alt="Defense"> ${cardData.defense}</div>
        //         <div class="stat bottom-right"><img src="/images/lobby/cost.png" alt="Cost"> ${cardData.cost}</div>
        //     </div>
        // `;

        enemySlots[index].innerHTML = cardHtml;
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
    const currentStatus = cardElement.getAttribute('data-status');
    const statusTextElem = cardElement.querySelector('.card-status');

    if (currentStatus === 'in-hand') {
        cardElement.setAttribute('data-status', 'in-battlefield');
        statusTextElem.textContent = 'Status: In Battlefield';
    } else {
        cardElement.setAttribute('data-status', 'in-hand');
        statusTextElem.textContent = 'Status: In Hand';
    }
}

function updateHand(player) {
    const handContainer = document.querySelector('.card-hand');
    handContainer.innerHTML = '';

    player.hand.forEach(cardId => {
        const cardData = deck.find(card => card.id === cardId);

        const cardElement = document.createElement('div');
        cardElement.classList.add('card-in-deck');
        cardElement.setAttribute('data-status', 'in-hand');
        cardElement.setAttribute('data-card-id', cardData.id);

        cardElement.innerHTML = `
            <img class="unit-image" src="/images/avatars/${cardData.id}.png" alt="${cardData.name}">
            <div class="stat top-left"><img src="/images/lobby/attack.png" alt="Attack"> ${cardData.attack}</div>
            <div class="stat top-right"><img src="/images/lobby/defense.png" alt="Defense"> ${cardData.defense}</div>
            <div class="stat bottom-right"><img src="/images/lobby/cost.png" alt="Cost"> ${cardData.cost}</div>
            <div class="card-status">Status: In Hand</div>
        `;
        
        handContainer.appendChild(cardElement);
    });

    attachCardStatusListeners();
}

export function renderGame(data) {
    const players = data.players;

    const opponentId = Object.keys(players).find(id => id !== user_id);
    renderPlayerInfo(players[user_id]);
    renderOponentInfo(players[opponentId]);
    updateButtStatus(data.player === user_id);
    updateHand(players[user_id]);
    updateBattlefield(opponentId, data.battlefield);
}

export function getBattlefieldCardIds() {
    const cards = document.querySelectorAll('.card-hand .card-in-deck[data-status="in-battlefield"]');
    const battlefieldCards = [];

    cards.forEach(card => {
        const cardId = card.getAttribute('data-card-id');
        if (cardId) {
            battlefieldCards.push(parseInt(cardId));
        }
    });

    return battlefieldCards;
}