import dotenv from "dotenv";
import config from "../config/config";
import { uploadMiddleware, uploadMiddlewareMultiple } from "../middleware/upload";
import { File, IFile, IMulterFile } from "../file/file";
import mysql from "mysql2/promise";
import { idIsNan } from "../validators/id.validator";

dotenv.config();


export async function getFileList(req: any, res: any) {
    const id: number = parseInt(req.params.adId);
    idIsNan(id, res);

    const connection = await mysql.createConnection(config.database);

    try{
        const [results]: any = await connection.query(
            'SELECT * FROM files JOIN ad_files ON files.id = ad_files.file_id WHERE ad_files.ad_id = ?',
            [id]
        );

        if(results.length === 0){
            return res.status(404).send("Nincsenek feltöltött képek.");
        };

        const fileInfos: any[] = [];

        results.map((file: IFile) => {
            fileInfos.push({name: file.fileName, url: 'http://localhost:3000/file/' + file.fileId});
        });

        res.status(200).send(fileInfos);
    }
    catch(err){
        console.log(err);
    }
};


export async function uploadFile(req: any, res: any) {
    try{
        await uploadMiddleware(req, res);

        if(req.file === undefined){
            return res.status(400).send({error: "Töltsön fel fájlt!"});
        };

        const file: File = new File(req.file, req.adId);
        await file.saveToDatabase();

        res.status(201).send({message: `A fájl feltöltése sikerült! ${req.file.originalname}`});
    }
    catch(err){
        res.status(500).send({
            error: `A fájl feltöltése nem sikerült! ${req.file.originalname}` + err
        });
    }
};


export async function uploadFileMultiple(req: any, res: any) {
    try{
        await uploadMiddlewareMultiple(req, res);

        if(req.files === undefined){
            return res.status(400).send({error: "Töltsön fel fájlokat!"});
        };

        req.files.map(async (file: IMulterFile) => {
            const newFile: File = new File(file, req.adId);
            await newFile.saveToDatabase();
        });

        res.status(201).send({message: `A fájlok feltöltése nem sikerült! ${req.files}`});
    }
    catch(err){
        res.status(500).send({
            error: `A fájlok feltöltése nem sikerült! ${req.files}` + err
        });
    }
};