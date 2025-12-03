export interface IAdvertisement{
    adId: number | null | undefined,
    userId: number | null | undefined,
    usedItemId: number | null | undefined,
    isReported: boolean,
    description: string,
    image: string,
    dateOfAd: Date | string
};

export default class Advertisement implements IAdvertisement{
    adId: number | null | undefined = null;
    userId: number | null | undefined = null;
    usedItemId: number | null | undefined = null;
    isReported: boolean = false;
    description: string = "";
    image: string = "";
    dateOfAd: Date | string = "";

    constructor(advertisement: IAdvertisement){
        this.adId = advertisement.adId;
        this.userId = advertisement.userId;
        this.usedItemId = advertisement.usedItemId;
        this.isReported = advertisement.isReported;
        this.description = advertisement.description;
        this.image = advertisement.image;
        this.dateOfAd = advertisement.dateOfAd;

        //Object.assign(this, advertisement as Partial<Advertisement>);
    };
};