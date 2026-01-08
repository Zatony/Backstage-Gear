import jwt from "jsonwebtoken";
import config from "../config/config";

export function verifyToken(req: any, res: any, next: any){
    const token = req.body?.token || req.query?.token || req.headers?.['x-access-token'];

    if(!token){
        return res.status(401).send("Token szükséges.");
    };

    try{
        if(!config.jwtSecret){
            return res.status(500).send("Hiba van a titkos kulcsnál.");
        }; 

        const decodedToken = jwt.verify(token, config.jwtSecret);
        req.user = decodedToken;

        return next();
    }
    catch(err){
        console.log(err);
        return res.status(401).send("A hitelesítés nem sikerült.");
    }
};


export function requireAdmin(req: any, res: any, next: any) {
    if (!req.user) {
        return res.status(401).send("Nincs hitelesítés.");
    };

    if (req.user.is_admin !== 1) {
        return res.status(403).send("Admin jogosultság szükséges.");
    };

    next();
};