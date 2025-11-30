import { Router } from "express";
import { getAds } from "./advertisementController";

const router: Router = Router();

router.get('/backstagegear/ads', getAds);

export default router;