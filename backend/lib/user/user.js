"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
;
var User = /** @class */ (function () {
    function User(user) {
        this.userId = null;
        this.name = "";
        this.userName = "";
        this.email = "";
        this.phoneNumber = "";
        this.dateOfBirth = "";
        this.password = "";
        this.token = null;
        this.userId = user.userId;
        this.name = user.name;
        this.userName = user.userName;
        this.email = user.email;
        this.phoneNumber = user.phoneNumber;
        this.dateOfBirth = user.dateOfBirth;
        this.password = user.password;
        this.token = user.token;
        //Object.assign(this, user as Partial<User>);
    }
    ;
    return User;
}());
exports.default = User;
;
