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
