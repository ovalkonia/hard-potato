document.getElementById('join-room').addEventListener('click', () => {
    document.getElementById('join-form').style.display = 'flex';
});

document.getElementById('create-room').addEventListener('click', async () => {
    try {
        const res = await fetch('/room/create', {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        });
        if (!res.ok) {
            console.log('Error creating room:');
        } else {
            const responseData = await res.json();
            console.log(responseData);
            window.location.replace(`/room/${responseData.room_id}`);
        }
    }
    catch (error) {
        console.error('Error:', error);
    }
});

document.getElementById('join-form').addEventListener("submit", function(e) {
    e.preventDefault();

    const data = new FormData(this);
    window.location.replace(`/room/${data.get("code")}`);
});