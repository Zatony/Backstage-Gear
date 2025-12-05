export interface IFile {
    fileId: string;
    fileName: string;
    fileSize: number | null;
}
export interface IMulterFile {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    destination: string;
    filename: string;
    path: string;
    size: number | null;
}
export declare class File implements IFile {
    fileId: string;
    fileName: string;
    fileSize: number | null;
    userId: number;
    constructor(file: IMulterFile, userId: number);
    getAllData: () => this;
    saveToDatabase(): Promise<void>;
}
