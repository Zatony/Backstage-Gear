import mysql from "mysql2/promise";
import fs from "fs";
import path from "path";
import config from "../config/config";

export type UploadedProfileFile = {
    filename: string;
    originalname: string;
    size: number;
};

export type ProfileUpdatePayload = {
    username?: string;
    phone_number?: string;
};

function formatProfile(profile: any): any {
    return {
        ...profile,
        profile_picture: `${config.baseUrl}/profile-pictures/${profile.profile_picture}`
    };
}

function ensureProfilePicturesDir(): string {
    const profilePicturesDir = path.join(config.uploadDir, "profile-pictures");
    fs.mkdirSync(profilePicturesDir, { recursive: true });
    return profilePicturesDir;
}

function cleanupUploadedProfileFile(file?: UploadedProfileFile): void {
    if (!file) {
        return;
    }

    const profilePicturePath = path.join(config.uploadDir, "profile-pictures", file.filename);
    const rootPath = path.join(config.uploadDir, file.filename);

    try {
        fs.unlinkSync(profilePicturePath);
        return;
    }
    catch {
    }

    try {
        fs.unlinkSync(rootPath);
    }
    catch {
    }
}

export async function getProfileDatasByIdService(profileId: number): Promise<any> {
    const connection = await mysql.createConnection(config.database);

    try {
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

        if (result.length === 0) {
            throw new Error("PROFILE_NOT_FOUND");
        }

        return formatProfile(result[0]);
    }
    finally {
        await connection.end();
    }
}

export async function getUsersProfileDatasByIdService(userId: number): Promise<any> {
    const connection = await mysql.createConnection(config.database);

    try {
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

        if (result.length === 0) {
            throw new Error("PROFILE_NOT_FOUND");
        }

        return formatProfile(result[0]);
    }
    finally {
        await connection.end();
    }
}

export async function voteProfileByIdService(userId: number, profileId: number, vote: number): Promise<void> {
    if (vote !== 1 && vote !== -1) {
        throw new Error("INVALID_VOTE");
    }

    const connection = await mysql.createConnection(config.database);

    try {
        const [profiles] = await connection.query(
            "SELECT user_id FROM profiles WHERE id = ?",
            [profileId]
        ) as Array<any>;

        if (profiles.length === 0) {
            throw new Error("PROFILE_NOT_FOUND");
        }

        if (profiles[0].user_id === userId) {
            throw new Error("OWN_PROFILE_VOTE_FORBIDDEN");
        }

        await connection.query(
            `
            INSERT INTO profile_votes (profile_id, voter_user_id, vote)
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE vote = VALUES(vote)
            `,
            [profileId, userId, vote]
        );
    }
    finally {
        await connection.end();
    }
}

export async function patchProfileByIdService(
    userId: number,
    payload: ProfileUpdatePayload,
    file?: UploadedProfileFile
): Promise<void> {
    const connection = await mysql.createConnection(config.database);

    try {
        await connection.beginTransaction();

        const [rows] = await connection.query(
            `SELECT id, profile_picture FROM profiles WHERE user_id = ?`,
            [userId]
        ) as Array<any>;

        if (!rows || rows.length === 0) {
            await connection.rollback();
            throw new Error("PROFILE_NOT_FOUND");
        }

        const profile = rows[0];
        const { username, phone_number } = payload;

        if (username || phone_number) {
            await connection.query(
                `UPDATE users SET username = COALESCE(?, username), phone_number = COALESCE(?, phone_number) WHERE id = ?`,
                [username ?? null, phone_number ?? null, userId]
            );
        }

        if (file) {
            const profilePicturesDir = ensureProfilePicturesDir();

            fs.renameSync(
                path.join(config.uploadDir, file.filename),
                path.join(profilePicturesDir, file.filename)
            );

            await connection.query(
                "INSERT INTO files(id, file_name, file_size) VALUES(?, ?, ?)",
                [file.filename, file.originalname, file.size]
            );

            if (profile.profile_picture && profile.profile_picture !== "default-profile-picture.jpg") {
                try {
                    fs.unlinkSync(path.join(profilePicturesDir, profile.profile_picture));
                }
                catch {
                }
            }

            await connection.query(
                `UPDATE profiles SET profile_picture = ? WHERE id = ?`,
                [file.filename, profile.id]
            );
        }

        await connection.commit();
    }
    catch (error: any) {
        await connection.rollback();
        cleanupUploadedProfileFile(file);
        throw error;
    }
    finally {
        await connection.end();
    }
}