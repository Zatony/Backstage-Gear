import { bodyIsUndefined, idIsNan } from "../validators/id.validator";
import {
    getProfileDatasByIdService,
    getUsersProfileDatasByIdService,
    patchProfileByIdService,
    UploadedProfileFile,
    voteProfileByIdService
} from "./profileService";

type ErrorResponse = {
    status: number;
    body: string | Record<string, string>;
};

function handleControllerError(
    error: unknown,
    res: any,
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

export async function getProfileDatasById(req: any, res: any){
    const profileId: number = parseInt(req.params.profileId);
    if (isNaN(profileId)) {
        idIsNan(profileId, res);
        return;
    }

    try{
        const result = await getProfileDatasByIdService(profileId);
        res.status(200).send(result);
    }
    catch(error){
        handleControllerError(error, res, {
            PROFILE_NOT_FOUND: { status: 404, body: "Ilyen azonosítójú felhasználó még nem létezik." }
        }, { error: "Hiba történt a profil lekérdezése során." });
    }
};


export async function getUsersProfileDatasById(req: any, res: any){
    const userId: number = parseInt(req.user.id);

    try{
        const result = await getUsersProfileDatasByIdService(userId);
        res.status(200).send(result);
    }
    catch(error){
        handleControllerError(error, res, {
            PROFILE_NOT_FOUND: { status: 404, body: "Ilyen azonosítójú felhasználó még nem létezik." }
        }, { error: "Hiba történt a saját profil lekérdezése során." });
    }
};


export async function voteProfileById(req: any, res: any) {
    const userId: number = parseInt(req.user.id);
    const profileId: number = parseInt(req.params.profileId);
    const vote: number = Number(req.body.vote);

    if (isNaN(profileId)) {
        idIsNan(profileId, res);
        return;
    }

    try{
        await voteProfileByIdService(userId, profileId, vote);
        res.status(200).send("Szavazat rögzítve.");
    }
    catch(error){
        handleControllerError(error, res, {
            INVALID_VOTE: { status: 400, body: "Érvénytelen szavazat." },
            PROFILE_NOT_FOUND: { status: 404, body: "Profil nem található." },
            OWN_PROFILE_VOTE_FORBIDDEN: { status: 403, body: "A saját profilodat nem szavazhatod." }
        }, { error: "Hiba történt a profil szavazása során." });
    }
};


export async function patchProfileById(req: any, res: any) {
    if (!req.body) {
        bodyIsUndefined(req, res);
        return;
    }

    const userId = parseInt(req.user.id);

    try {
        await patchProfileByIdService(
            userId,
            req.body,
            req.file as UploadedProfileFile | undefined
        );

        res.status(200).send({ message: 'Profil frissítve.' });
    } catch (error: any) {
        if (error && error.code === 'ER_DUP_ENTRY') {
            res.status(409).send('A felhasználónév már foglalt.');
            return;
        }

        handleControllerError(error, res, {
            PROFILE_NOT_FOUND: { status: 404, body: 'Profil nem található.' }
        }, { error: 'Hiba történt a profil frissítése során.' });
    }
};