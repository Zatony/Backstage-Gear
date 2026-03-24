import dotenv from "dotenv";
import path from "path";

dotenv.config();

const dbDefaults = {
    host: process.env.DB_HOST || "127.0.0.1",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "jelszo",
    database: process.env.DATABASE || "backstagegear",
    port: Number(process.env.DB_PORT) || 3306,
};

const config: any = {
    jwtSecret: process.env.JWT_SECRET || "secret",
    baseUrl: process.env.BASE_URL || "http://localhost:3000",
    database: dbDefaults,
    maxSize: parseInt(process.env.MAX_FILE_SIZE ?? "2097152"),
    baseDir: process.cwd(),
    uploadDir: path.resolve(process.cwd(), process.env.UPLOAD_DIR_NAME ?? "uploads")
};

export default config;