function renderPlayerInfo(player) {
    return `
        <img src="${player.avatar}" class="avatar" alt="${player.name}">
        <div class="nickname">${player.name}</div>
    `;
}