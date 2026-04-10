import { Request, Response } from "express";
import {
    deleteAdFromReportedAdsByIdService,
    deleteOwnAdByIdService,
    deleteUsersAdByIdService,
    getAdDatasByIdService,
    getAdsService,
    getBrandsService,
    getFilteredAdvertisementsService,
    getLatestAdsService,
    getReportedAdByIdService,
    getReportedAdsService,
    getUserAdByIdService,
    getUserAdsService,
    patchAdByIdService,
    postNewAdvertisementService,
    reportAdByIdService,
    UploadedAdvertisementFile
} from "./advertisementService";
import { bodyIsUndefined, idIsNan } from "../validators/id.validator";

type ErrorResponse = {
    status: number;
    body: string | Record<string, string>;
};

function handleControllerError(
    error: unknown,
    res: Response,
    errorMap: Record<string, ErrorResponse>,
    fallbackBody: string | Record<string, string>
): void {
    if (error instanceof Error && errorMap[error.message]) {
        const mapped = errorMap[error.message];
        res.status(mapped.status).send(mapped.body);
        return;
    }

    console.error(error);
    res.status(500).send(fallbackBody);
}

export async function getAds(_req: Request, res: Response) {
    try {
        const results = await getAdsService();
        res.status(200).send(results);
    }
    catch (error) {
        handleControllerError(error, res, {
            NO_ADS: { status: 404, body: "Nincsenek lekérendő hirdetések." }
        }, { error: "Hiba történt a hirdetések lekérdezése során." });
    }
}

export async function getLatestAds(_req: Request, res: Response) {
    try {
        const results = await getLatestAdsService();
        res.status(200).send(results);
    }
    catch (error) {
        handleControllerError(error, res, {
            NO_ADS: { status: 404, body: "Nincsenek lekérendő hirdetések." }
        }, { error: "Hiba történt a legfrissebb hirdetések lekérdezése során." });
    }
}

export async function getAdDatasById(req: Request, res: Response) {
    const adId = parseInt(req.params.adId, 10);

    if (isNaN(adId)) {
        idIsNan(adId, res);
        return;
    }

    try {
        const result = await getAdDatasByIdService(adId);
        res.status(200).send(result);
    }
    catch (error) {
        handleControllerError(error, res, {
            AD_NOT_FOUND: { status: 404, body: "Nincs ilyen azonosítójú elem." }
        }, { error: "Hiba történt a hirdetés lekérdezése során." });
    }
}

export async function getUserAds(req: any, res: Response) {
    const userId = parseInt(req.user.id, 10);

    try {
        const results = await getUserAdsService(userId);
        res.status(200).send(results);
    }
    catch (error) {
        handleControllerError(error, res, {
            NO_ADS: { status: 404, body: "Nincsenek lekérendő hirdetések." }
        }, { error: "Hiba történt a saját hirdetések lekérdezése során." });
    }
}

export async function getUserAdById(req: any, res: Response) {
    const userId = parseInt(req.user.id, 10);
    const adId = parseInt(req.params.adId, 10);

    if (isNaN(adId)) {
        idIsNan(adId, res);
        return;
    }

    try {
        const result = await getUserAdByIdService(userId, adId);
        res.status(200).send(result);
    }
    catch (error) {
        handleControllerError(error, res, {
            USER_AD_NOT_FOUND: { status: 404, body: "Nem létezik ilyen aznosítójú elem." }
        }, { error: "Hiba történt a saját hirdetés lekérdezése során." });
    }
}

export async function reportAdById(req: any, res: Response) {
    const adId = parseInt(req.params.adId, 10);
    const userId = parseInt(req.user.id, 10);

    if (isNaN(adId)) {
        idIsNan(adId, res);
        return;
    }

    try {
        await reportAdByIdService(adId, userId);
        res.status(200).send("Sikeres jelentés.");
    }
    catch (error) {
        handleControllerError(error, res, {
            AD_NOT_FOUND: { status: 404, body: "Nincs ilyen azonosítójú hirdetés." },
            OWN_AD_FORBIDDEN: { status: 403, body: "A saját hirdetésedet nem tudod jelenteni." }
        }, { error: "Hiba történt a hirdetés jelentése során." });
    }
}

export async function getBrands(_req: Request, res: Response) {
    try {
        const results = await getBrandsService();
        res.status(200).send(results);
    }
    catch (error) {
        handleControllerError(error, res, {
            NO_BRANDS: { status: 404, body: "Nincsenek lekérendő márkák." }
        }, { error: "Hiba történt a márkák lekérdezése során." });
    }
}

export async function postNewAdvertisement(req: any, res: Response) {
    const userId = parseInt(req.user.id, 10);

    if (!req.body) {
        bodyIsUndefined(req, res);
        return;
    }

    try {
        const adId = await postNewAdvertisementService(
            userId,
            req.body,
            Array.isArray(req.files) ? req.files as UploadedAdvertisementFile[] : []
        );

        res.status(201).json({
            message: "Hirdetés sikeresen létrehozva.",
            adId
        });
    }
    catch (error) {
        handleControllerError(error, res, {
            INVALID_AD_PAYLOAD: { status: 400, body: "Hibásan vagy hiányosan megadott adatok." }
        }, { error: "Hiba történt a hirdetés létrehozása során." });
    }
}

export const getFilteredAdvertisements = async (req: Request, res: Response) => {
    try {
        const result = await getFilteredAdvertisementsService({
            categoryIds: req.query.categoryIds as string | undefined,
            brandId: req.query.brandId as string | undefined,
            conditions: req.query.conditions as string | undefined,
            minPrice: req.query.minPrice as string | undefined,
            maxPrice: req.query.maxPrice as string | undefined,
            q: req.query.q as string | undefined,
            page: req.query.page as string | undefined,
            limit: req.query.limit as string | undefined
        });

        res.status(200).json(result);
    }
    catch (error) {
        handleControllerError(error, res, {}, { error: "Hiba történt a szűrt hirdetések lekérdezése során." });
    }
};

export async function deleteOwnAdById(req: any, res: Response) {
    const adId = parseInt(req.params.adId, 10);
    const userId = parseInt(req.user.id, 10);

    if (isNaN(adId)) {
        idIsNan(adId, res);
        return;
    }

    try {
        await deleteOwnAdByIdService(adId, userId);
        res.status(204).send();
    }
    catch (error) {
        handleControllerError(error, res, {
            AD_FORBIDDEN_OR_NOT_FOUND: { status: 403, body: "Nincs jogosultság vagy nem létező hirdetés." }
        }, { error: "Hiba történt a hirdetés törlése során." });
    }
}

export async function patchAdById(req: any, res: Response) {
    const adId = parseInt(req.params.adId, 10);
    const userId = parseInt(req.user.id, 10);

    if (isNaN(adId)) {
        idIsNan(adId, res);
        return;
    }

    try {
        await patchAdByIdService(
            adId,
            userId,
            req.body ?? {},
            Array.isArray(req.files) ? req.files as UploadedAdvertisementFile[] : []
        );

        res.status(200).send({ message: "Hirdetés frissítve." });
    }
    catch (error) {
        handleControllerError(error, res, {
            AD_NOT_FOUND: { status: 404, body: "Nincs ilyen azonosítójú hirdetés." },
            AD_FORBIDDEN: { status: 403, body: "Nincs jogosultságod a hirdetés módosításához." }
        }, { error: "Hiba történt a hirdetés frissítése során." });
    }
}

export async function getReportedAds(_req: Request, res: Response) {
    try {
        const results = await getReportedAdsService();
        res.status(200).send(results);
    }
    catch (error) {
        handleControllerError(error, res, {
            NO_ADS: { status: 404, body: "Nincsenek lekérendő hirdetések." }
        }, { error: "Hiba történt a jelentett hirdetések lekérdezése során." });
    }
}

export async function getReportedAdById(req: any, res: Response) {
    const adId = parseInt(req.params.adId, 10);

    if (isNaN(adId)) {
        idIsNan(adId, res);
        return;
    }

    try {
        const result = await getReportedAdByIdService(adId);
        res.status(200).send(result);
    }
    catch (error) {
        handleControllerError(error, res, {
            REPORTED_AD_NOT_FOUND: { status: 404, body: "Nincs ilyen azonosítójú jelentett hirdetés." }
        }, { error: "Hiba történt a jelentett hirdetés lekérdezése során." });
    }
}

export async function deleteAdFromReportedAdsById(req: any, res: Response) {
    const adId = parseInt(req.params.adId, 10);

    if (isNaN(adId)) {
        idIsNan(adId, res);
        return;
    }

    try {
        await deleteAdFromReportedAdsByIdService(adId);
        res.status(200).send("Sikeresen törölted a hirdetés jelentését.");
    }
    catch (error) {
        handleControllerError(error, res, {
            REPORTED_AD_NOT_FOUND: { status: 404, body: "Nincs ilyen azonosítójú jelentett hirdetés." }
        }, { error: "Hiba történt a jelentés törlése során." });
    }
}

export async function deleteUsersAdById(req: any, res: Response) {
    const adId = parseInt(req.params.adId, 10);

    if (isNaN(adId)) {
        idIsNan(adId, res);
        return;
    }

    try {
        await deleteUsersAdByIdService(adId);
        res.status(204).send();
    }
    catch (error) {
        handleControllerError(error, res, {
            REPORTED_AD_NOT_FOUND: { status: 404, body: "Nincs ilyen azonosítójú jelentett hirdetés." },
            AD_FORBIDDEN_OR_NOT_FOUND: { status: 403, body: "Nincs jogosultság vagy nem létező hirdetés." }
        }, { error: "Hiba történt a hirdetés törlése során." });
    }
}