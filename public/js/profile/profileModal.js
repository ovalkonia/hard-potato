const profileButton = document.querySelector('.profile-button');
const profileModal = document.getElementById('profile-modal');
const closeProfileModal = document.getElementById('close-profile-modal');

profileButton.addEventListener('click', () => {
    profileModal.style.display = 'flex';
});

closeProfileModal.addEventListener('click', () => {
    profileModal.style.display = 'none';
});