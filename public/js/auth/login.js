document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector('form');

    function showPopupMessage(message, duration = 1500) {
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

    const usernameRegex = /^[a-zA-Z_]+$/;
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        const { username, password } = data;

        if (!usernameRegex.test(username)) {
            showPopupMessage("Username can contain only letters and underscores.", 3000);
            return;
        }

        if (!passwordRegex.test(password)) {
            showPopupMessage("Password must be at least 8 characters long and contain a digit, a lowercase, and an uppercase letter.", 4000);
            return;
        }

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
                    window.location.href = '/profile/self';
                }, 1000);
            } else {
                showPopupMessage(responseData.message || "Login failed!", 4000);
            }
        } catch (error) {
            console.error('Error:', error);
            showPopupMessage("Server error. Please try again later.", 4000);
        }
    });
});
