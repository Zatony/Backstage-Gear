import { Router } from "express";
import { getProfileDatasById } from "./profileController";

const router: Router = Router();

router.get('/backstagegear/:userName/profile', getProfileDatasById);

export default router;