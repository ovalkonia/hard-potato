document.addEventListener('DOMContentLoaded', () => {
    const savePasswordBtn = document.getElementById('save-password');
    const saveNicknameBtn = document.getElementById('save-nickname');
    const profileModal = document.getElementById('profile-modal');
    const usernameHeading = document.querySelector('.user-info h2');

    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
    const usernameRegex = /^[a-zA-Z_]+$/;

    document.querySelectorAll('.avatar-gallery img').forEach(img => {
        img.addEventListener('click', async () => {
            const avatar_id = parseInt(img.dataset.id);
            const result = await updateProfile({ avatar_id });

            if (result.success) {
                document.getElementById('user-avatar').src = `/images/avatars/${avatar_id}.png`;
                document.getElementById('avatar-modal').style.display = 'none';
                showPopupMessage('Avatar updated successfully!');
            } else {
                showPopupMessage('Failed to update avatar.');
            }
        });
    });

    savePasswordBtn.addEventListener('click', async () => {
        const password = document.getElementById('old-password').value;
        const new_password = document.getElementById('new-password').value;

        if (!password || !new_password) {
            showPopupMessage('Please fill in both password fields.');
            return;
        }

        if (!passwordRegex.test(new_password)) {
            showPopupMessage('New password must be at least 8 characters, include one digit, one lowercase and one uppercase letter.', 4000);
            return;
        }

        const result = await updateProfile({ password, new_password });

        if (result.success) {
            profileModal.style.display = 'none';
            showPopupMessage('Password updated successfully!');
        } else {
            showPopupMessage(result.message || 'Failed to update password.');
        }
    });

    saveNicknameBtn.addEventListener('click', async () => {
        const username = document.getElementById('new-nickname').value;
        const password = document.getElementById('confirm-pass').value;

        if (!username || !password) {
            showPopupMessage('Please fill in both fields.');
            return;
        }

        if (!usernameRegex.test(username)) {
            showPopupMessage('Nickname must contain only letters and underscores.', 3000);
            return;
        }

        const result = await updateProfile({ username, password });

        if (result.success) {
            usernameHeading.textContent = username;
            profileModal.style.display = 'none';
            showPopupMessage('Nickname updated successfully!');
        } else {
            showPopupMessage(result.message || 'Failed to update nickname.');
        }
    });

    async function updateProfile(data) {
        try {
            const response = await fetch('/profile/self', {
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

function showPopupMessage(message, duration = 2000) {
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
