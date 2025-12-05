"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
;
var Advertisement = /** @class */ (function () {
    function Advertisement(advertisement) {
        this.adId = null;
        this.userId = null;
        this.usedItemId = null;
        this.isReported = false;
        this.description = "";
        this.image = "";
        this.dateOfAd = "";
        this.adId = advertisement.adId;
        this.userId = advertisement.userId;
        this.usedItemId = advertisement.usedItemId;
        this.isReported = advertisement.isReported;
        this.description = advertisement.description;
        this.image = advertisement.image;
        this.dateOfAd = advertisement.dateOfAd;
        //Object.assign(this, advertisement as Partial<Advertisement>);
    }
    ;
    return Advertisement;
}());
exports.default = Advertisement;
;
