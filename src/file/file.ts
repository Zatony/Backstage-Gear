import mysql from "mysql2/promise";
import config from "../config/config";

export interface IFile{
    fileId: string,
    fileName: string,
    fileSize: number | null
};

export interface IMulterFile{
    fieldname: string,
    originalname: string,
    encoding: string,
    mimetype: string,
    destination: string,
    filename: string,
    path: string,
    size: number | null
};

export class File implements IFile{
    fileId: string = "";
    fileName: string = "";
    fileSize: number | null = null;
    userId: number;

    constructor(file: IMulterFile, userId: number){
        this.fileId = file.filename;
        this.fileName = file.originalname;
        this.fileSize = file.size;
        this.userId = userId;
    };

    getAllData = () => {
        return this;
    };

    async saveToDatabase(){
        const connection = await mysql.createConnection(config.database);

        try{
            const [results] = await connection.query(
                'INSERT INTO files VALUES (?, ?, ?, ?, ?)',
                [this.fileId, this.fileName, this.fileSize]
            ) as Array<any>;

            if(results.affectedRows > 0){}
        }
        catch(err){
            console.log(err);
        }
    };
};