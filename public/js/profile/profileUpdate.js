document.addEventListener('DOMContentLoaded', () => {
    const savePasswordBtn = document.getElementById('save-password');
    const saveNicknameBtn = document.getElementById('save-nickname');
    const profileModal = document.getElementById('profile-modal');
    const usernameHeading = document.querySelector('.user-info h2');

    document.querySelectorAll('.avatar-gallery img').forEach(img => {
        img.addEventListener('click', async () => {
            const avatarId = parseInt(img.dataset.id);
            const result = await updateProfile({ avatarId });

            if (result.success) {
                document.getElementById('user-avatar').src = `/images/avatars/${avatarId}.png`;
                document.getElementById('avatar-modal').style.display = 'none';
            } else {
                alert('Failed to update avatar.');
            }
        });
    });

    savePasswordBtn.addEventListener('click', async () => {
        const oldPassword = document.getElementById('old-password').value;
        const newPassword = document.getElementById('new-password').value;

        if (!oldPassword || !newPassword) {
            alert('Please fill in both password fields.');
            return;
        }

        const result = await updateProfile({ oldPassword, newPassword });

        if (result.success) {
            console.log('Password updated successfully!');
            profileModal.style.display = 'none';
        } else {
            alert(result.message || 'Failed to update password.');
        }
    });

    saveNicknameBtn.addEventListener('click', async () => {
        const newUsername = document.getElementById('new-nickname').value;

        if (!newUsername) {
            alert('Please enter a new nickname.');
            return;
        }

        const result = await updateProfile({ newUsername });

        if (result.success) {
            usernameHeading.textContent = newUsername;
            profileModal.style.display = 'none';
        } else {
            alert(result.message || 'Failed to update nickname.');
        }
    });

    async function updateProfile(data) {
        try {
            const response = await fetch('/update/profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            return { success: response.ok, ...result };
        } catch (error) {
            console.error('Error:', error);
            return { success: false, message: 'Server error' };
        }
    }
});
