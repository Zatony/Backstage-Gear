export interface ICategory {
    categoryId: number | null | undefined;
    name: string;
    picture: string;
}
export default class Category implements ICategory {
    categoryId: number | null | undefined;
    name: string;
    picture: string;
    constructor(catgeory: ICategory);
}
