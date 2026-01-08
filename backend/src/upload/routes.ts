import { Router } from "express";
import { getFileList } from "./uploadController";
import verifyToken from "../middleware/auth";

const router: Router = Router();

router.get('/backstagegear/ads/:adId/kepek', getFileList);
router.get('/backstagegear/me/ads/:adId/kepek', verifyToken, getFileList);
router.get('/backstagegear/me/my_ads/:adId/kepek', verifyToken, getFileList);
router.get('/backstagegear/me/my_ads/update_ad/:adId/kepek', verifyToken, getFileList);

export default router;