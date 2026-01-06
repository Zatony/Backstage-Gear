import { Router } from "express";
import { getUserIncomingMessages, getUserIcomingMessageById, getUserSentMessages, getUserSentMessageById } from "./mesageController";
import verifyToken from "../middleware/auth";

const router: Router = Router();

router.get('/backstagegear/me/incoming_messages', verifyToken, getUserIncomingMessages);
router.get('/backstagegear/me/incoming_messages/:messageId', verifyToken, getUserIcomingMessageById);
router.get('/backstagegear/me/sent_messages', verifyToken, getUserSentMessages);
router.get('/backstagegear/me/sent_messages/:messageId', verifyToken, getUserSentMessageById);

export default router;