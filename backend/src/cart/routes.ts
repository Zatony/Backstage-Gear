import { Router } from "express";
import { getAdsFromUserCart, getAdByIdFromUserCart, putNewAdIntoCartByAdId, deleteAdFromCartByAdId } from "./cartController";
import { verifyToken } from "../middleware/auth";

const router: Router = Router();

router.get('/backstagegear/me/cart', verifyToken, getAdsFromUserCart);
router.get('/backstagegear/me/cart/:adId', verifyToken, getAdByIdFromUserCart);

router.post('/backstagegear/me/cart/ads/:adId', verifyToken, putNewAdIntoCartByAdId);

router.delete('/backstagegear/me/cart/:adId', verifyToken, deleteAdFromCartByAdId);

export default router;