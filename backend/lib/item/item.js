"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
;
var Item = /** @class */ (function () {
    function Item(item) {
        this.itemId = null;
        this.name = "";
        this.categoryId = null;
        this.brand = "";
        this.itemId = item.itemId;
        this.name = item.name;
        this.categoryId = item.categoryId;
        this.brand = item.brand;
        //Object.assign(this, item as Partial<Item>);
    }
    ;
    return Item;
}());
exports.default = Item;
;
