document.getElementById('logout-button').addEventListener('click', async () => {
    try {
        const res = await fetch('/auth/logout', {
            method: 'POST',
            credentials: 'include'
        });

        if (res.ok) {
            window.location.href = '/auth/login';
        } else {
            console.log('Logout failed.');
        }
    } catch (error) {
        console.error('Error:', error);
    }
});

document.getElementById('play-button').addEventListener('click', async () => {
    try {
        const res = await fetch('/lobby/gamepage', {
            method: 'GET',
            credentials: 'include'
        });

        if (res.ok) {

        } else {
            console.log('Failed to start a game.');
        }
    } catch (error) {
        console.error('Error:', error);
    }
});