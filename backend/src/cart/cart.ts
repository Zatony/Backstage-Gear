export interface ICart{
    cartId: number | null | undefined,
    userId: number | null | undefined,
    adId: number | null | undefined
};

export class Cart implements ICart{
    cartId: number | null | undefined = null;
    userId: number | null | undefined = null;
    adId: number | null | undefined = null;

    constructor(cart: ICart){
        this.cartId = cart.cartId;
        this.userId = cart.userId;
        this.adId = cart.adId;
    };
};