const avatarWrapper = document.querySelector('.avatar-wrapper');
const avatarModal = document.getElementById('avatar-modal');
const closeModal = document.getElementById('close-modal');

avatarWrapper.addEventListener('click', () => {
    avatarModal.style.display = 'flex';
});

closeModal.addEventListener('click', () => {
    avatarModal.style.display = 'none';
});