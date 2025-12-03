export interface IItem{
    itemId: number | null | undefined,
    name: string,
    categoryId: number | null | undefined,
    brand: string
};

export default class Item implements IItem{
    itemId: number | null | undefined = null;
    name: string = "";
    categoryId: number | null | undefined = null;
    brand: string = "";

    constructor(item: IItem){
        this.itemId = item.itemId;
        this.name = item.name;
        this.categoryId = item.categoryId;
        this.brand = item.brand;

        //Object.assign(this, item as Partial<Item>);
    };
};