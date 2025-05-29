document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("register-form");

    function showPopupMessage(message, duration = 1500) {
        const popup = document.getElementById("message-popup");
        popup.textContent = message;
        popup.classList.remove("hidden");
        popup.classList.add("show");

        setTimeout(() => {
            popup.classList.remove("show");
            setTimeout(() => popup.classList.add("hidden"), 500);
        }, duration);
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const username = formData.get("username").trim();
        const email = formData.get("email").trim();
        const password = formData.get("password");
        const cpassword = formData.get("cpassword");

        const usernameRegex = /^[A-Za-z_]+$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;

        if (!usernameRegex.test(username)) {
            showPopupMessage("Username must contain only letters and underscores.", 3000);
            return;
        }

        if (!emailRegex.test(email)) {
            showPopupMessage("Invalid email address.", 3000);
            return;
        }

        if (!passwordRegex.test(password)) {
            showPopupMessage("Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 digit and be 8+ characters long.", 4000);
            return;
        }

        if (password !== cpassword) {
            showPopupMessage("Passwords do not match.", 3000);
            return;
        }

        formData.delete("cpassword");
        const data = Object.fromEntries(formData.entries());

        try {
            const res = await fetch('/auth/register', {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const responseData = await res.json();

            if (res.ok) {
                showPopupMessage(responseData.message || "Registration successful!");
                setTimeout(() => {
                    const encodedUsername = encodeURIComponent(username);
                    window.location.href = `/auth/login/${encodedUsername}`;
                }, 1500);
            } else {
                showPopupMessage(responseData.message || "Registration failed.", 4000);
            }
        } catch (error) {
            console.error('Error:', error);
            showPopupMessage("Server error. Please try again later.", 4000);
        }
    });
});
