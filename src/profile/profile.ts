export interface IProfile{
    profileId: number | null | undefined,
    profilePicture: string,
    downVote: number | null | undefined,
    upVote: number | null | undefined,
    userId: number | null | undefined
};

export default class Profile implements IProfile{
    profileId: number | null | undefined;
    profilePicture: string = "";
    downVote: number | null | undefined;
    upVote: number | null | undefined;
    userId: number | null | undefined;

    constructor(profile: IProfile){
        this.profileId = profile.profileId;
        this.profilePicture = profile.profilePicture;
        this.downVote = profile.downVote;
        this.upVote = profile.upVote;
        this.userId = profile.userId;

        //Object.assign(this, profile as Partial<Profile>);
    };
};