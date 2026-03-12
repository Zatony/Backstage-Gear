import { Request, Response } from "express";
import { getCategoriesService } from "./categoryService";

export async function getCategories(_req: Request, res: Response): Promise<void> {
    try {
        const categories = await getCategoriesService();
        res.status(200).send(categories);
        return;
    }
    catch (err: any) {
        if (err.message === "NO_CATEGORIES") {
            res.status(404).send("Nincsenek lekérendő kategóriák.");
            return;
        }

        console.log(err);
        res.status(500).send("Szerver hiba.");
        return;
    }
}