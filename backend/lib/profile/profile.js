"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
;
var Profile = /** @class */ (function () {
    function Profile(profile) {
        this.profilePicture = "";
        this.profileId = profile.profileId;
        this.profilePicture = profile.profilePicture;
        this.downVote = profile.downVote;
        this.upVote = profile.upVote;
        this.userId = profile.userId;
        //Object.assign(this, profile as Partial<Profile>);
    }
    ;
    return Profile;
}());
exports.default = Profile;
;
