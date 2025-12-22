import { Router } from "express";
import { getAds, getAdDatasById, getUserAds, getUserAdById, getLatestAds, getReportedAds, getReportedAdById } from "./advertisementController";

const router: Router = Router();

router.get('/backstagegear', getAds)
router.get('/backstagegear/ads', getLatestAds);
router.get('/backstagegear/ads/:adId', getAdDatasById);
router.get('/backstagegear/:userId/ads', getUserAds);
router.get('/backstagegear/:userId/ads/:adId', getUserAdById);

// Csak adminnál kéne, hogy működjön
router.get('/backstagegear/:userId/reported_ads', getReportedAds);
router.get('/backstagegear/:userId/reported_ads/:adId', getReportedAdById);

export default router;