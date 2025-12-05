export interface IProfile {
    profileId: number | null | undefined;
    profilePicture: string;
    downVote: number | null | undefined;
    upVote: number | null | undefined;
    userId: number | null | undefined;
}
export default class Profile implements IProfile {
    profileId: number | null | undefined;
    profilePicture: string;
    downVote: number | null | undefined;
    upVote: number | null | undefined;
    userId: number | null | undefined;
    constructor(profile: IProfile);
}
