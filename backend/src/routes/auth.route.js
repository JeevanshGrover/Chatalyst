import express from "express";
import { 
    login,
    logout,
    refreshAccessToken,
    signup,
    ChangePassword,
    updateAccountDetails
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = express.Router()

router.route("/signup").post(signup);
router.route("/login").post(login);

//secured routes
router.route("/logout").post(verifyJWT, logout);
router.route("/refresh-Token").post(verifyJWT, refreshAccessToken);
router.route("/change-password").patch(verifyJWT, ChangePassword);
router.route("/update-details").patch(verifyJWT, updateAccountDetails);

export default router;