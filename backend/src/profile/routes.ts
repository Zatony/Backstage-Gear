import { Router } from "express";
import { getProfileDatasById } from "./profileController";

const router: Router = Router();

router.get('/backstagegear/user/:profileId', getProfileDatasById);

export default router;