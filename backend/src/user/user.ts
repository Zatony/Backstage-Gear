export interface IUser{
    userId: number | null | undefined,
    isAdmin: boolean,
    name: string,
    userName: string,
    email: string,
    phoneNumber: string,
    dateOfBirth: string,
    password: string,
    token: string | null
};

export class User implements IUser{
    userId: number | null | undefined = null;
    isAdmin: boolean = false;
    name: string = "";
    userName: string = "";
    email: string = "";
    phoneNumber: string = "";
    dateOfBirth: string = "";
    password: string = "";
    token: string | null = null;

    constructor(user: IUser){
        this.userId = user.userId;
        this.isAdmin = user.isAdmin;
        this.name = user.name;
        this.userName = user.userName;
        this.email = user.email;
        this.phoneNumber = user.phoneNumber;
        this.dateOfBirth = user.dateOfBirth;
        this.password = user.password;
        this.token = user.token;

        //Object.assign(this, user as Partial<User>);
    };
};