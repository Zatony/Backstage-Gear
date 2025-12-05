export interface ICart {
    cartId: number | null | undefined;
    userId: number | null | undefined;
    adId: number | null | undefined;
}
export default class Cart implements ICart {
    cartId: number | null | undefined;
    userId: number | null | undefined;
    adId: number | null | undefined;
    constructor(cart: ICart);
}
