import { Router } from "express";
import { getProfileDatasById, voteProfileById, getUsersProfileDatasById } from "./profileController";
import { verifyToken } from "../middleware/auth";

const router: Router = Router();

router.get('/backstagegear/profiles/:profileId', getProfileDatasById);
router.get('/backstagegear/me/my_profile', verifyToken, getUsersProfileDatasById);
router.patch('/backstagegear/me/profiles/:profileId', verifyToken, voteProfileById);

export default router;