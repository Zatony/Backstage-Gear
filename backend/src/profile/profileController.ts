import { idIsNan } from "../validators/id.validator";
import config from "../config/config";
import mysql from "mysql2/promise";


export async function getProfileDatasById(req: any, res: any){
    const profileId: number = parseInt(req.params.profileId);
    idIsNan(profileId, res);

    const connection = await mysql.createConnection(config.database);

    try{
        const [result] = await connection.query(
            `
            SELECT 
                p.id AS profile_id,
                u.username,
                u.phone_number,
                p.profile_picture,
                COALESCE(SUM(pv.vote = 1), 0) AS up_votes,
                COALESCE(SUM(pv.vote = -1), 0) AS down_votes
            FROM profiles p
            INNER JOIN users u ON p.user_id = u.id
            LEFT JOIN profile_votes pv ON pv.profile_id = p.id
            WHERE p.id = ?
            GROUP BY p.id, u.username, u.phone_number, p.profile_picture
            `,
            [profileId]
        ) as Array<any>;

        if(result.length > 0){
            const BASE_URL = "http://localhost:3000"; // később .env-be

            const profile = {
                ...result[0],
                profile_picture: `${BASE_URL}/profile-pictures/${result[0].profile_picture}`
            };

            res.status(200).send(profile);
            return;
        };

        res.status(404).send("Ilyen azonosítójú felhasználó még nem létezik.");
    }
    catch(err){
        console.log(err);
    }
};


export async function getUsersProfileDatasById(req: any, res: any){
    const userId: number = parseInt(req.user.id);

    const connection = await mysql.createConnection(config.database);

    try{
        const [result] = await connection.query(
            `
            SELECT 
                p.id AS profile_id,
                u.username,
                u.phone_number,
                p.profile_picture,
                COALESCE(SUM(pv.vote = 1), 0) AS up_votes,
                COALESCE(SUM(pv.vote = -1), 0) AS down_votes
            FROM profiles p
            INNER JOIN users u ON p.user_id = u.id
            LEFT JOIN profile_votes pv ON pv.profile_id = p.id
            WHERE p.user_id = ?
            GROUP BY p.id, u.username, u.phone_number, p.profile_picture
            `,
            [userId]
        ) as Array<any>;

        if(result.length > 0){
            res.status(200).send(result);
            return;
        };

        res.status(404).send("Ilyen azonosítójú felhasználó még nem létezik.");
    }
    catch(err){
        console.log(err);
    }
};


export async function voteProfileById(req: any, res: any) {
    const userId: number = parseInt(req.user.id);
    const profileId: number = parseInt(req.params.profileId);
    const vote: number = Number(req.body.vote);

    idIsNan(profileId, res);

    if (vote !== 1 && vote !== -1) {
        res.status(400).send("Érvénytelen szavazat.");
        return;
    };

    const connection = await mysql.createConnection(config.database);

    try{
        const [profiles] = await connection.query(
            "SELECT user_id FROM profiles WHERE id = ?",
            [profileId]
        ) as Array<any>;

        if (profiles.length === 0) {
            res.status(404).send("Profil nem található.");
            return;
        };

        if (profiles[0].user_id === userId) {
            res.status(403).send("A saját profilodat nem szavazhatod.");
            return;
        };


        await connection.query(
            `
            INSERT INTO profile_votes (profile_id, voter_user_id, vote)
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE vote = VALUES(vote)
            `,
            [profileId, userId, vote]
        );

        res.status(200).send("Szavazat rögzítve.");
    }
    catch(err){
        console.log(err);
    }
};