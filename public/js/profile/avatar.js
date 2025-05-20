document.querySelectorAll('.avatar-gallery img').forEach(img => {
    img.addEventListener('click', async () => {
        //some data
        try {
            const res = await fetch('/profile/avatar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(Somedata)
            });

            if (res.ok) {

            } else {
                console.log("Hihihaha");
            }
        } 
        catch (error) {
            console.error('Error:', error);
        }
    });
});