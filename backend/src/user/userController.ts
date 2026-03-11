import { bodyIsUndefined, idIsNan } from "../validators/id.validator";
import { signInService, signUpService, getIsAdminService, deleteOwnUserByIdService, updateOwnPasswordByIdService, deleteUserByIdService } from "./userService";


export async function signIn(req: any, res: any) {
    const { email, password } = req.body;

    if (!(email && password)) {
        res.status(400).send("Nem megfelelően megadott adatok.");
        return;
    }

    try {
        const result = await signInService(email, password);
        res.status(200).json(result);
    }
    catch (err: any) {
        if (err.message === "INVALID_CREDENTIALS") {
            return res.status(401).send("Hibás email vagy jelszó.");
        }

        res.status(500).send("Szerver hiba.");
    }
};


export async function signUp(req: any, res: any) {
    try {
        const result = await signUpService(req.body);
        res.status(201).json(result);
    } 
    catch (err: any) {
        if(err.message === "INVALID_DATA"){
            return res.status(400).send("Hibásan vagy hiányosan megadott adatok.");
        }

        res.status(500).send("Regisztráció sikertelen.");
    }
};


export async function getIsAdminById(req: any, res: any) {
    const userId: number = parseInt(req.user.id);

    try {
        const isAdmin = await getIsAdminService(userId);

        if (isAdmin === null) {
            res.status(404).send("Nem létezik ilyen azonosítójú felhasználó.");
        } 
        else {
            res.status(200).send({ is_admin: isAdmin });
        }
    } 
    catch (err) {
        console.log(err);
        res.status(500).send("Szerver hiba.");
    }
};


export async function deleteOwnUserById(req: any, res: any) {
    const userId: number = parseInt(req.user.id);

    try {
        await deleteOwnUserByIdService(userId);
        res.status(204).send();
    } 
    catch (err) {
        console.error(err);
        res.status(500).send("A felhasználó törlése nem sikerült.");
    }
};


export async function updateOwnPasswordById(req: any, res: any) {
    const userId: number = parseInt(req.user.id);

    bodyIsUndefined(req, res);

    if (!req.body) {
        return;
    }

    try {
        await updateOwnPasswordByIdService(userId, req.body.password);
        res.status(204).send();
    }
    catch (err: any) {
        if (err.message === "INVALID_PASSWORD") {
            return res.status(400).send("Hiányosan megadott adatok.");
        }

        if (err.message === "PASSWORD_UPDATE_FAILED") {
            return res.status(404).send("Nem sikerült a jelszó módosítása.");
        }

        console.log(err);
        res.status(500).send("Szerver hiba.");
    }
};


////// ADMIN

export async function deleteUserById(req: any, res: any) {
    const userId: number = parseInt(req.params.userId);

    idIsNan(userId, res);

    if (isNaN(userId)) {
        return;
    }

    try {
        await deleteUserByIdService(userId);
        res.status(204).send();
    }
    catch (err: any) {
        if (err.message === "USER_NOT_FOUND") {
            return res.status(404).send("Nem létezik ilyen azonosítójú felhasználó.");
        }

        console.log(err);
        res.status(500).send("Szerver hiba.");
    }
};