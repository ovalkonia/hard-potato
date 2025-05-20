import express from "express";
import profile_controller from "../controllers/profile.js";

const profile_router = express.Router();

profile_router.get("/playerhome", profile_controller.get_home);

profile_router.get("/tutorial", (req, res) => {
    res.render("profile/tutorial", {
        username: "PlayerName",
        avatarUrl: "/images/avatars/greenshadow.png"
    });
});

profile_router.post("/profile/avatar", profile_controller.update_avatar);

profile_router.post("/profile/update-password", profile_controller.update_password);

profile_router.post("/profile/update-username", profile_controller.update_username);

profile_router.post("/auth/logout", profile_controller.post_logout);

export default profile_router;