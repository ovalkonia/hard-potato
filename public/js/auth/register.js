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
        const password = formData.get("password");
        const cpassword = formData.get("cpassword");

        if (password !== cpassword) {
            showPopupMessage("Passwords do not match", 4000);
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
                    const encodedUsername = encodeURIComponent(data.username);
                    window.location.href = `/auth/login?username=${encodedUsername}`;
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
