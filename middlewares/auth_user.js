const auth_user_middleware = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect("/auth/login");
    }

    next();
};

export default auth_user_middleware;
