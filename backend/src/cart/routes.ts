import { Router } from "express";
import { getAdsFromUserCart, getAdByIdFromUserCart } from "./cartController";

const router: Router = Router();

router.get('/backstagegear/:userId/cart', getAdsFromUserCart);
router.get('/backstagegear/:userId/cart/:adId', getAdByIdFromUserCart);

export default router;