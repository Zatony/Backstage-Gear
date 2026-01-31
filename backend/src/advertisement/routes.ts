import { Router } from "express";
import { getAds, getAdDatasById, getUserAds, getUserAdById, getLatestAds, getReportedAds, getReportedAdById, reportAdById, deleteAdFromReportedAdsById, getBrands } from "./advertisementController";
import { verifyToken, requireAdmin } from "../middleware/auth";

const router: Router = Router();

router.get('/backstagegear/ads', getAds)
router.get('/backstagegear/latest_ads', getLatestAds);
router.get('/backstagegear/brands', getBrands);
router.get('/backstagegear/ads/:adId', getAdDatasById);
router.get('/backstagegear/me/my_ads', verifyToken, getUserAds);
router.get('/backstagegear/me/my_ads/:adId', verifyToken, getUserAdById);
router.get('/backstagegear/me/my_ads/update_ad/:adId', verifyToken, getUserAdById);
router.patch('/backstagegear/me/ads/:adId', verifyToken, reportAdById);

// Admin
router.get('/backstagegear/me/reported_ads', verifyToken, requireAdmin, getReportedAds);
router.get('/backstagegear/me/reported_ads/:adId', verifyToken, requireAdmin, getReportedAdById);
router.patch('/backstagegear/me/reported_ads/:adId', verifyToken, requireAdmin, deleteAdFromReportedAdsById);

export default router;