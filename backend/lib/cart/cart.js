"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
;
var Cart = /** @class */ (function () {
    function Cart(cart) {
        this.cartId = null;
        this.userId = null;
        this.adId = null;
        this.cartId = cart.cartId;
        this.userId = cart.userId;
        this.adId = cart.adId;
        //Object.assign(this, cart as Partial<Cart>);
    }
    ;
    return Cart;
}());
exports.default = Cart;
;
