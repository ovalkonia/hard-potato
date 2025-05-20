document.addEventListener('DOMContentLoaded', () => {
    const savePasswordBtn = document.getElementById('save-password');
    const saveNicknameBtn = document.getElementById('save-nickname');
    const profileModal = document.getElementById('profile-modal');
    const usernameHeading = document.querySelector('.user-info h2');

    savePasswordBtn.addEventListener('click', async () => {
        const oldPassword = document.getElementById('old-password').value;
        const newPassword = document.getElementById('new-password').value;

        if (!oldPassword || !newPassword) {
            alert('Please fill in both password fields.');
            return;
        }

        try {
            const response = await fetch('/profile/update-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    oldPassword,
                    newPassword,
                }),
            });


            if (response.ok) {
                console.log('Password updated successfully!');
                profileModal.style.display = 'none';
            } else {
                console.log('Failed to update password.');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });

    saveNicknameBtn.addEventListener('click', async () => {
        const newUsername = document.getElementById('new-nickname').value;

        if (!newUsername) {
            alert('Please enter a new nickname.');
            return;
        }

        try {
            const response = await fetch('/profile/update-username', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    newUsername,
                }),
            });

            if (response.ok) {
                console.log('Nickname updated successfully!');
                usernameHeading.textContent = newUsername;
                profileModal.style.display = 'none';
            } else {
                console.log('Failed to update nickname.');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });
});