import jwt from "jsonwebtoken";
import config from "../config/config";
import mysql from "mysql2/promise";

function extractToken(req: any) {
    const authorizationHeader = req.headers?.authorization || req.headers?.Authorization;
    const headerToken = authorizationHeader || req.headers?.["x-access-token"];
    const rawToken = req.body?.token || req.query?.token || headerToken;

    if (typeof rawToken !== "string") {
        return null;
    }

    const token = rawToken.trim();

    if (!token) {
        return null;
    }

    if (token.startsWith("Bearer ")) {
        const bearerToken = token.slice(7).trim();
        return bearerToken || null;
    }

    return token;
}

export function verifyToken(req: any, res: any, next: any){
    const token = extractToken(req);

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
        if (!(err instanceof Error) || (err.name !== "JsonWebTokenError" && err.name !== "TokenExpiredError")) {
            console.error(err);
        }
        return res.status(401).send("A hitelesítés nem sikerült.");
    }
};


export async function requireAdmin(req: any, res: any, next: any) {
    if (!req.user) {
        return res.status(401).send("Nincs hitelesítés.");
    };

    const userId: number = parseInt(req.user.id);

    const connection = await mysql.createConnection(config.database);

    try{
        const [adminRows] = await connection.query(
            'SELECT is_admin FROM users WHERE id = ?',
            [userId]
        ) as Array<any>;

        if(adminRows.length == 0){
            res.status(404).send("Nem létezik ilyen azonosítójú felhasználó.");
        }
        if(adminRows[0].is_admin !== 1){
            res.status(403).send("Admin jogosultság szükséges.");
            return;
        }
        
    }
    catch(err){
        console.log(err);
    }
    finally{
        await connection.end();
    }

    next();
};