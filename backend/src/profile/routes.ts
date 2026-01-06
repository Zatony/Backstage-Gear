import { Router } from "express";
import { getProfileDatasById } from "./profileController";
import verifyToken from "../middleware/auth";

const router: Router = Router();

router.get('/backstagegear/me/profile', verifyToken, getProfileDatasById);

export default router;