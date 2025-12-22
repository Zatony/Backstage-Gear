import { Router } from "express";
import { getProfileDatasById } from "./profileController";

const router: Router = Router();

router.get('/backstagegear/:userId/profile', getProfileDatasById);

export default router;