export interface IItem {
    itemId: number | null | undefined;
    name: string;
    categoryId: number | null | undefined;
    brand: string;
}
export default class Item implements IItem {
    itemId: number | null | undefined;
    name: string;
    categoryId: number | null | undefined;
    brand: string;
    constructor(item: IItem);
}
