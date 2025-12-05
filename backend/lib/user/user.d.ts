export interface IUser {
    userId: number | null | undefined;
    name: string;
    userName: string;
    email: string;
    phoneNumber: string;
    dateOfBirth: string;
    password: string;
    token: string | null;
}
export default class User implements IUser {
    userId: number | null | undefined;
    name: string;
    userName: string;
    email: string;
    phoneNumber: string;
    dateOfBirth: string;
    password: string;
    token: string | null;
    constructor(user: IUser);
}
