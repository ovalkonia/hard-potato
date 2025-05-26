import session from "express-session";

const express_session_config = {
    secret: "Don't care for now",
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        rolling: true,
        maxAge: 72 /* hours */ * 60 /* minutes */ * 60 /* seconds*/ * 1000 /* milliseconds */,
    },
};

export default session(express_session_config);
