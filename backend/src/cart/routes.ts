import { Router } from "express";
import { getAdsFromUserCart, getAdByIdFromUserCart } from "./cartController";
import { verifyToken } from "../middleware/auth";

const router: Router = Router();

router.get('/backstagegear/me/cart', verifyToken, getAdsFromUserCart);
router.get('/backstagegear/me/cart/:adId', verifyToken, getAdByIdFromUserCart);

export default router;