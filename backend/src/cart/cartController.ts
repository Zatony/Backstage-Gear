import { idIsNan } from "../validators/id.validator";
import {
    deleteAdFromCartByAdIdService,
    getAdByIdFromUserCartService,
    getAdsFromUserCartService,
    putNewAdIntoCartByAdIdService
} from "./cartService";


export async function getAdsFromUserCart(req: any, res: any) {
    const userId: number = parseInt(req.user.id);
    idIsNan(userId, res);

    if (isNaN(userId)) {
        return;
    }

    try {
        const results = await getAdsFromUserCartService(userId);
        res.status(200).send(results);
    }
    catch (err: any) {
        if (err.message === "NO_CART_ADS") {
            return res.status(404).send("Nincsenek még kosárba helyezett hirdetések.");
        }

        console.log(err);
        res.status(500).send("Szerver hiba.");
    }
};


export async function getAdByIdFromUserCart(req: any, res: any) {
    const userId: number = parseInt(req.user.id);
    const adId: number = parseInt(req.params.adId);

    idIsNan(userId, res);
    idIsNan(adId, res);

    if (isNaN(userId) || isNaN(adId)) {
        return;
    }

    try {
        const result = await getAdByIdFromUserCartService(userId, adId);
        res.status(200).send(result);
    }
    catch (err: any) {
        if (err.message === "AD_NOT_FOUND") {
            return res.status(404).send("Nincs ilyen azonosítójú hirdetés.");
        }

        console.log(err);
        res.status(500).send("Szerver hiba.");
    }
};


export async function putNewAdIntoCartByAdId(req: any, res: any) {
    const userId: number = parseInt(req.user.id);
    const adId: number = parseInt(req.params.adId);

    idIsNan(userId, res);
    idIsNan(adId, res);

    if (isNaN(userId) || isNaN(adId)) {
        return;
    }

    try {
        await putNewAdIntoCartByAdIdService(userId, adId);
        res.status(201).send("Sikeres a hirdetés kosárba helyezése.");
    }
    catch (err: any) {
        if (err.message === "AD_NOT_FOUND") {
            return res.status(404).send("Nem létezik ilyen azonosítójú hirdetés.");
        }

        if (err.message === "AD_ALREADY_IN_CART") {
            return res.status(400).send("Ezt a hirdetést már beraktad a kosaradba.");
        }

        if (err.message === "OWN_AD_FORBIDDEN") {
            return res.status(400).send("A saját hirdetésedet nem tudod a kosaradba tenni.");
        }

        if (err.message === "ADD_TO_CART_FAILED") {
            return res.status(404).send("Nem sikerült a hirdetés kosárba helyezése.");
        }

        console.log(err);
        res.status(500).send("Szerver hiba.");
    }
};


export async function deleteAdFromCartByAdId(req: any, res: any) {
    const userId: number = parseInt(req.user.id);
    const adId: number = parseInt(req.params.adId);

    idIsNan(userId, res);
    idIsNan(adId, res);

    if (isNaN(userId) || isNaN(adId)) {
        return;
    }

    try {
        await deleteAdFromCartByAdIdService(userId, adId);
        res.status(204).send();
    }
    catch (err: any) {
        if (err.message === "AD_NOT_FOUND") {
            return res.status(404).send("Nem létezik ilyen azonosítójú hirdetés.");
        }

        if (err.message === "DELETE_FROM_CART_FAILED") {
            return res.status(404).send("Nem sikerült az adattörlés.");
        }

        console.log(err);
        res.status(500).send("Szerver hiba.");
    }
};