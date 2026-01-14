import { Router } from "express";
import { signIn, signUp } from "./userController";

const router: Router = Router();

router.post('/backstagegear/login', signIn);
router.post('/backstagegear/signup', signUp);

export default router;