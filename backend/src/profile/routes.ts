import { Router } from "express";
import { getProfileDatasById, voteProfileById, getUsersProfileDatasById, patchProfileById } from "./profileController";
import { verifyToken } from "../middleware/auth";
import { uploadMiddlewareExpress } from "../middleware/upload";

const router: Router = Router();

router.get('/backstagegear/profiles/:profileId', getProfileDatasById);
router.get('/backstagegear/me/my_profile', verifyToken, getUsersProfileDatasById);
router.patch('/backstagegear/me/profiles/:profileId', verifyToken, voteProfileById);
router.patch('/backstagegear/me/my_profile/update_datas', verifyToken, uploadMiddlewareExpress, patchProfileById);

export default router;