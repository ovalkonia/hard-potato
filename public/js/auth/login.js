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
            const res = await fetch('/auth/login', {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(data)
            });

            const responseData = await res.json();

            if (res.ok) {
                showPopupMessage(responseData.message || "Login successful!");
                setTimeout(() => {
                    window.location.href = '/home';
                }, 1500);
            } else {
                showPopupMessage(responseData.message || "Login failed!", 4000);
            }
        } catch (error) {
            console.error('Error:', error);
            showPopupMessage("Server error. Please try again later.", 4000);
        }
    });
});
