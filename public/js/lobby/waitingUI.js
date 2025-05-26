export function showWaitingUI(roomId = null) {
    const container = document.querySelector('.waiting-container');
    container.style.display = 'flex';

    if (roomId) {
        const roomCodeEl = document.getElementById('room-code');
        const copyBtn = document.getElementById('copy-button');

        roomCodeEl.textContent = roomId;
        copyBtn.onclick = () => {
            navigator.clipboard.writeText(roomId).then(() => alert('Room code copied!'));
        };
    }
}

export function hideWaitingUI() {
    document.querySelector('.waiting-container').style.display = 'none';
}

export function showGameUI() {
    document.getElementById('game-ui').style.display = 'flex';
}

export function hideGameUI() {
    document.getElementById('game-ui').style.display = 'none';
}