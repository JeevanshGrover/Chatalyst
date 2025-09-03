import express from 'express';
import { verifyJWT } from '../middleware/auth.middleware.js'
import {
    getMessages,
    getUsersForSidebar,
    sendMessage
} from '../controllers/message.controller.js';

const router = express.Router();

router.use(verifyJWT); 

router.route("/users").get(getUsersForSidebar);
router.route("/:id").get(getMessages);
router.route("/send/:id").post(sendMessage);

export default router;