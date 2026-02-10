import { Router } from "express";
import { signIn, signUp, deleteUserById } from "./userController";
import { verifyToken } from "../middleware/auth";

const router: Router = Router();

router.post('/backstagegear/login', signIn);
router.post('/backstagegear/signup', signUp);
router.delete('/backstagegear/me/my_profile/delete_my_profile', verifyToken, deleteUserById);

export default router;