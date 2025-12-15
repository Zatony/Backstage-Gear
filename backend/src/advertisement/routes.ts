import { Router } from "express";
import { getAds, getAdDatasById, getUserAds, getUserAdById, getLatestAds } from "./advertisementController";

const router: Router = Router();

router.get('/backstagegear', getAds)
router.get('/backstagegear/ads', getLatestAds);
router.get('/backstagegear/ads/:adId', getAdDatasById);
router.get('/backstagegear/:userId/ads', getUserAds);
router.get('/backstagegear/:userName/ads/:adId', getUserAdById);

export default router;