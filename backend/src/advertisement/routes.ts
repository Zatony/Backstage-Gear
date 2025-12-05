import { Router } from "express";
import { getAds, getAdDatasById } from "./advertisementController";

const router: Router = Router();

router.get('/backstagegear/ads', getAds);
router.get('/backstagegear/ads/:adId', getAdDatasById);

export default router;