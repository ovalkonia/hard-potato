document.getElementById('join-room').addEventListener('click', () => {
    document.getElementById('join-form').style.display = 'flex';
});

document.getElementById('create-room').addEventListener('click', async () => {
    try {
        const res = await fetch('/rooms/create', {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        });
        if (!res.ok) {
            console.log('Error creating room:');
        }
    }
    catch (error) {
        console.error('Error:', error);
    }
});

document.getElementById('submit-join').addEventListener('click', async () => {
    const code = document.getElementById('room-code').value.trim();
    if (!code) {
        alert('Please enter a room code.');
        return;
    }

    try {
        const res = await fetch('/room/join', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code })
        });

        if (!res.ok) {
            console.log('There is no room with this code.');
            alert('There is no room with this code.');
        }
    } catch (error) {
        console.error('Error:', error);
    }
});