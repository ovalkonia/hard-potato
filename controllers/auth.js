const auth_controller = {
    get_login: (req, res) => {
        return res.render("auth/login", {
            email: req.params.email,
        });
    },
    post_login: (req, res) => {
        console.log("Didn't ask for now");

        return res.send(420);
    },

    get_register: (req, res) => {
        return res.render("auth/register", {
            email: req.params.email,
        });
    },
    post_register: (req, res) => {
        console.log("Didn't ask for now");

        return res.send(420);
    },
};

export default auth_controller;
