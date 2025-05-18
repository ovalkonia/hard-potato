document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector('form');

    function showPopupMessage(message, duration = 1000) {
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

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        try {
            const res = await fetch('/auth/register', {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const responseData = await res.json();

            if (res.ok) {
                showPopupMessage(responseData.message);
                setTimeout(() => {
                    window.location.href = '/auth/login';
                }, 1500);
            } else {
                showMessage(responseData.message || "Something went wrong.", true);
            }
        } 
        catch (error) {
            console.error('Error:', error);
            showPopupMessage("Server error. Please try again.", 4000);
        }
    });
});
