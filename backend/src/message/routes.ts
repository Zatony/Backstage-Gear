import { Router } from "express";
import { getUserIncomingMessages, getUserIcomingMessageById, getUserSentMessages, getUserSentMessageById } from "./mesageController";

const router: Router = Router();

router.get('/backstagegear/:userName/incoming_messages', getUserIncomingMessages);
router.get('/backstagegear/:userName/incoming_messages/:messageId', getUserIcomingMessageById);
router.get('/backstagegear/:userName/sent_messages', getUserSentMessages);
router.get('/backstagegear/:userName/sent_messages/:messageId', getUserSentMessageById);

export default router;