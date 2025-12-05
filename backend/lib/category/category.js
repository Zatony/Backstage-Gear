"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
;
var Category = /** @class */ (function () {
    function Category(catgeory) {
        this.categoryId = null;
        this.name = "";
        this.picture = "";
        this.categoryId = catgeory.categoryId;
        this.name = catgeory.name;
        this.picture = catgeory.picture;
        //Object.assign(this, catgeory as Partial<Category>);
    }
    ;
    return Category;
}());
exports.default = Category;
;
