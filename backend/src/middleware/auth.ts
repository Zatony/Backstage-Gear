import jwt from "jsonwebtoken";
import config from "../config/config";

export default function verifyToken(req: any, res: any, next: any){
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