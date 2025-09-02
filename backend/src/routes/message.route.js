import express from 'express';
import { verifyJwt } from '../middleware/auth.middleware.js'
import {
    getMessages,
    getUsersForSidebar,
    sendMessage
} from '../controllers/message.controller.js';

const router = express.Router();

router.use(verifyJwt); 

router.route("/users").get(getUsersForSidebar);
router.route

export default router;