document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector('form');
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

            if (res.ok) {
                window.location.href = '/auth/login';
            } else {
                console.log("hihihaha");
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });
});
