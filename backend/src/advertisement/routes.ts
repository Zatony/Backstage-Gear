import { Router } from "express";
import { getAds, getAdDatasById, getUserAds, getUserAdById } from "./advertisementController";

const router: Router = Router();

router.get('/backstagegear/ads', getAds);
router.get('/backstagegear/ads/:adId', getAdDatasById);
router.get('/backstagegear/:userName/ads', getUserAds);
router.get('/backstagegear/:userName/ads/:adId', getUserAdById);

export default router;