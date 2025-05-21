export function setupStartButton(socket, waitingModule) {
    const startButton = document.getElementById('start-game');

    startButton.disabled = true;
    startButton.classList.remove('enabled');

    startButton.addEventListener('click', () => {
        if (startButton.disabled) return;

        socket.emit('startGameRequest');

        if (waitingModule) {
            waitingModule.stopDotAnimation();
        }

        hideWaitingUI();
        showGameUI();
    });

    socket.on('readyToStart', () => {
        startButton.disabled = false;
        startButton.classList.add('enabled');
    });
}

export function showWaitingUI() {
    document.querySelector('.waiting-container').style.display = 'flex';
}

export function hideWaitingUI() {
    document.querySelector('.waiting-container').style.display = 'none';
}

export function showGameUI() {
    document.getElementById('game-ui').style.display = 'block';
}
