export interface IAdvertisement {
    adId: number | null | undefined;
    userId: number | null | undefined;
    usedItemId: number | null | undefined;
    isReported: boolean;
    description: string;
    image: string;
    dateOfAd: Date | string;
}
export default class Advertisement implements IAdvertisement {
    adId: number | null | undefined;
    userId: number | null | undefined;
    usedItemId: number | null | undefined;
    isReported: boolean;
    description: string;
    image: string;
    dateOfAd: Date | string;
    constructor(advertisement: IAdvertisement);
}
