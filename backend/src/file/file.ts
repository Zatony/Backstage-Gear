import mysql from "mysql2/promise";
import config from "../config/config";
import fs from "fs";
import path from "path";

export interface IFile{
    fileId?: string;
    fileName?: string;
    fileSize?: number;
};

export interface IMulterFile{
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    destination: string;
    filename: string;
    path: string;
    size: number;
};

export class File implements IFile{
    fileId?: string;
    fileName?: string;
    fileSize?: number;
    adId?: number;

    getAllData = () => {
        return this;
    };

    constructor(file?: IMulterFile, adId?: number){
        if(file && adId){
            this.setData(file, adId);
        };

        this.fileId = file?.filename;
        this.fileName = file?.originalname;
        this.fileSize = file?.size;
        this.adId = adId;
    };

    setData(file: IMulterFile, adId: number){
        this.fileId = file.filename;
        this.fileName = file.originalname;
        this.fileSize = file.size;
        this.adId = adId;
    };

    async loadDataFromDb(fileId: string){
        const connection = await mysql.createConnection(config.database);

        try{
            const [results]: any = await connection.query(
                'SELECT * FROM files WHERE id = ?',
                [fileId]
            );

            Object.assign(this, results[0] as Partial<IFile>);
        }
        catch(err){
            throw err;
        }
    };

    async deleteFromDbAndDir(){
        const connection = await mysql.createConnection(config.database);

        try{
            const reuslt = await connection.query(
                'DELETE FROM files WHERE id = ?',
                [this.fileId]
            );

            Object.assign(this, reuslt[0] as Partial<IFile>);
            this.deleteFileDir();
        }
        catch(err){
            throw err;
        }
    };

    async saveToDatabase(){
        const connection = await mysql.createConnection(config.database);

        try{
            connection.beginTransaction();

            if(!this.adId){
                throw "Nem található ez az adId.";
            };

            let [results]: any = await connection.query(
                'INSERT INTO files(id, file_name, file_size) VALUES(?, ?, ?)',
                [this.fileId, this.fileName, this.fileSize]
            );

            if(results.affectedRows === 0){
                throw "Hiba a files táblába történő mentésekor.";
            };

            [results] = await connection.query(
                'INSERT INTO ad_files VALUES(?, ?)',
                [this.adId, this.fileId]
            );

            if(results.affectedRows === 0){
                throw "Hiba az ad_files táblába történő mentésekor.";
            };

            connection.commit();
        }
        catch(err){
            this.deleteFileDir();
            connection.rollback();
            console.log(err);
        }
    };

    deleteFileDir(){
        try{
            fs.unlinkSync(path.join(config.uploadDir, this.fileId ?? ""));
        }
        catch(err){
            throw err;
        }
    }
};