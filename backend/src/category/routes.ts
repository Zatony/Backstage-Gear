import { Router } from "express";
import { getCategories } from "../category/categoryController";

const router: Router = Router();

router.get('/backstagegear', getCategories);

export default router;