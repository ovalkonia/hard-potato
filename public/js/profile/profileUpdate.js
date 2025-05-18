document.addEventListener('DOMContentLoaded', () => {
    const savePasswordBtn = document.getElementById('save-password');
    const saveNicknameBtn = document.getElementById('save-nickname');

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

            } else {

            }
        } catch (error) {
            console.error('Error:', error);
        }
    });

    saveNicknameBtn.addEventListener('click', async () => {
        const newNickname = document.getElementById('new-nickname').value;

        if (!newNickname) {
            alert('Please enter a new nickname.');
            return;
        }

        try {
            const response = await fetch('/api/update-nickname', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    newNickname,
                }),
            });

            if (response.ok) {

            } else {

            }
        } catch (error) {
            console.error('Error:', error);
        }
    });
});