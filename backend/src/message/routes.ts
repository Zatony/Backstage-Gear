import { Router } from "express";
import { getUserIncomingMessages, getUserIcomingMessageById, getUserSentMessages, getUserSentMessageById } from "./mesageController";

const router: Router = Router();

router.get('/backstagegear/:userId/incoming_messages', getUserIncomingMessages);
router.get('/backstagegear/:userId/incoming_messages/:messageId', getUserIcomingMessageById);
router.get('/backstagegear/:userId/sent_messages', getUserSentMessages);
router.get('/backstagegear/:userId/sent_messages/:messageId', getUserSentMessageById);

export default router;