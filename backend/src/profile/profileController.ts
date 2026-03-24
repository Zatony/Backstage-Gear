import { bodyIsUndefined, idIsNan } from "../validators/id.validator";
import config from "../config/config";
import mysql from "mysql2/promise";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

import fs from "fs";

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

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
    finally{
        await connection.end();
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
    finally{
        await connection.end();
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
    finally{
        await connection.end();
    }
};


export async function patchProfileById(req: any, res: any) {
    bodyIsUndefined(req, res);

    const userId = parseInt(req.user.id);
    const connection = await mysql.createConnection(config.database);

    try {
        await connection.beginTransaction();

        const [rows] = await connection.query(
            `SELECT id, profile_picture FROM profiles WHERE user_id = ?`,
            [userId]
        ) as Array<any>;

        if (!rows || rows.length === 0) {
            await connection.rollback();
            return res.status(404).send("Profil nem található.");
        }

        const profile = rows[0];

        const { username, phone_number } = req.body;
        if (username || phone_number) {
            await connection.query(
                `UPDATE users SET username = COALESCE(?, username), phone_number = COALESCE(?, phone_number) WHERE id = ?`,
                [username ?? null, phone_number ?? null, userId]
            );
        }

        if (req.file) {
            const fileId = req.file.filename;

            const profilePicturesDir = path.join(config.uploadDir, "profile-pictures");
            try { fs.mkdirSync(profilePicturesDir, { recursive: true }); } catch (e) { /* ignore */ }

            try {
                fs.renameSync(
                    path.join(config.uploadDir, fileId),
                    path.join(profilePicturesDir, fileId)
                );
            } catch (e) {
                console.error('Fájl áthelyezése sikertelen:', e);
                throw e;
            }

            try {
                await connection.query(
                    'INSERT INTO files(id, file_name, file_size) VALUES(?, ?, ?)',
                    [fileId, req.file.originalname, req.file.size]
                );
            } catch (e) {
                try { fs.unlinkSync(path.join(profilePicturesDir, fileId)); } catch (_) { /* ignore */ }
                throw e;
            }

            if (profile.profile_picture && profile.profile_picture !== 'default-profile-picture.jpg') {
                try {
                    const oldPath = path.join(profilePicturesDir, profile.profile_picture);
                    fs.unlinkSync(oldPath);
                } catch (e) { /* ignore deletion errors */ }
            }

            await connection.query(
                `UPDATE profiles SET profile_picture = ? WHERE id = ?`,
                [fileId, profile.id]
            );
        }

        await connection.commit();
        res.status(200).send({ message: 'Profil frissítve.' });
    } catch (err: any) {
        await connection.rollback();

        try {
            if (req.file) {
                const adPicturesPath = path.join(config.uploadDir, "profile-pictures", req.file.filename);
                const rootPath = path.join(config.uploadDir, req.file.filename);
                try { fs.unlinkSync(adPicturesPath); } catch (e) { try { fs.unlinkSync(rootPath); } catch (_) { /* ignore */ } }
            }
        } catch (e) {
            console.error('Fájl törlése sikertelen:', e);
        }

        if (err && err.code === 'ER_DUP_ENTRY') {
            return res.status(409).send('A felhasználónév már foglalt.');
        }

        console.error(err);
        res.status(500).send({ error: 'Hiba történt a profil frissítése során.' });
    } finally {
        await connection.end();
    }
};