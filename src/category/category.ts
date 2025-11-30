export interface ICategory{
    categoryId: number | null | undefined,
    name: string,
    picture: string
};

export default class Category implements ICategory{
    categoryId: number | null | undefined = null;
    name: string = "";
    picture: string = "";

    constructor(catgeory: ICategory){
        this.categoryId = catgeory.categoryId;
        this.name = catgeory.name;
        this.picture = catgeory.picture;

        //Object.assign(this, catgeory as Partial<Category>);
    };
};