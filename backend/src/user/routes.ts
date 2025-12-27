import { Router } from "express";
import { signIn } from "./userController";

const router: Router = Router();

router.post('/backstagegear', signIn);

export default router;