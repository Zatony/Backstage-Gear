import { Router } from "express";
import { signIn, signUp, deleteOwnUserById, updateOwnPasswordById, deleteUserById, getIsAdminById } from "./userController";
import { verifyToken, requireAdmin } from "../middleware/auth";

const router: Router = Router();

router.post('/backstagegear/login', signIn);
router.post('/backstagegear/signup', signUp);
router.get('/backstagegear/me/is_admin', verifyToken, getIsAdminById);
router.patch('/backstagegear/me/my_profile/update_password', verifyToken, updateOwnPasswordById);
router.delete('/backstagegear/me/my_profile/delete_my_profile', verifyToken, deleteOwnUserById);

// Admin
router.delete("/backstagegear/me/delete_user/:userId", verifyToken, requireAdmin, deleteUserById);

export default router;