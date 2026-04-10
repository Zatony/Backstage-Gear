import mysql from "mysql2/promise";
import fs from "fs";
import db from "../database/db";
import {
    deleteAdFromReportedAdsByIdService,
    deleteOwnAdByIdService,
    getAdsService,
    getFilteredAdvertisementsService,
    getUserAdByIdService,
    patchAdByIdService,
    postNewAdvertisementService,
    reportAdByIdService,
    UploadedAdvertisementFile
} from "./advertisementService";

jest.mock("mysql2/promise");
jest.mock("fs", () => ({
    __esModule: true,
    default: {
        mkdirSync: jest.fn(),
        renameSync: jest.fn(),
        unlinkSync: jest.fn()
    }
}));
jest.mock("../database/db", () => ({
    __esModule: true,
    default: {
        getConnection: jest.fn()
    }
}));

describe("advertisementService tests", () => {
    let mockConnection: any;
    let mockPoolConnection: any;

    beforeEach(() => {
        mockConnection = {
            beginTransaction: jest.fn(),
            query: jest.fn(),
            commit: jest.fn(),
            rollback: jest.fn(),
            end: jest.fn()
        };

        mockPoolConnection = {
            query: jest.fn(),
            release: jest.fn()
        };

        (mysql.createConnection as jest.Mock).mockResolvedValue(mockConnection);
        (db.getConnection as jest.Mock).mockResolvedValue(mockPoolConnection);
        jest.clearAllMocks();
    });

    describe("getAdsService", () => {
        it("should return formatted advertisements", async () => {
            mockConnection.query.mockResolvedValueOnce([[
                {
                    id: 1,
                    name: "Amp",
                    description: "Vintage combo",
                    price: 120000,
                    files: "default-ad-picture,amp-1.jpg"
                }
            ]]);

            await expect(getAdsService()).resolves.toEqual([
                {
                    id: 1,
                    name: "Amp",
                    description: "Vintage combo",
                    price: 120000,
                    files: [
                        "http://localhost:3000/ad-pictures/default-ad-picture.png",
                        "http://localhost:3000/ad-pictures/amp-1.jpg"
                    ]
                }
            ]);

            expect(mockConnection.query).toHaveBeenCalledWith(expect.stringContaining("FROM advertisements"));
            expect(mockConnection.end).toHaveBeenCalled();
        });

        it("should throw NO_ADS when no advertisements exist", async () => {
            mockConnection.query.mockResolvedValueOnce([[]]);

            await expect(getAdsService()).rejects.toThrow("NO_ADS");
            expect(mockConnection.end).toHaveBeenCalled();
        });
    });

    describe("getUserAdByIdService", () => {
        it("should keep stored file names unchanged for user ad details", async () => {
            mockConnection.query.mockResolvedValueOnce([[
                {
                    id: 2,
                    item_name: "Guitar",
                    files: "default-ad-picture,guitar-2.jpg"
                }
            ]]);

            await expect(getUserAdByIdService(3, 2)).resolves.toEqual([
                {
                    id: 2,
                    item_name: "Guitar",
                    files: [
                        "http://localhost:3000/ad-pictures/default-ad-picture",
                        "http://localhost:3000/ad-pictures/guitar-2.jpg"
                    ]
                }
            ]);

            expect(mockConnection.query).toHaveBeenCalledWith(
                expect.stringContaining("WHERE users.id = ? AND advertisements.id = ?"),
                [3, 2]
            );
            expect(mockConnection.end).toHaveBeenCalled();
        });
    });

    describe("reportAdByIdService", () => {
        it("should mark an advertisement as reported", async () => {
            mockConnection.query
                .mockResolvedValueOnce([[{ user_id: 9 }]])
                .mockResolvedValueOnce([{ affectedRows: 1 }]);

            await expect(reportAdByIdService(5, 1)).resolves.toBeUndefined();

            expect(mockConnection.query).toHaveBeenNthCalledWith(1, "SELECT user_id FROM advertisements WHERE id = ?", [5]);
            expect(mockConnection.query).toHaveBeenNthCalledWith(2, "UPDATE advertisements SET is_reported = 1 WHERE id = ?", [5]);
            expect(mockConnection.end).toHaveBeenCalled();
        });

        it("should throw OWN_AD_FORBIDDEN when the user reports their own ad", async () => {
            mockConnection.query.mockResolvedValueOnce([[{ user_id: 1 }]]);

            await expect(reportAdByIdService(5, 1)).rejects.toThrow("OWN_AD_FORBIDDEN");
            expect(mockConnection.end).toHaveBeenCalled();
        });
    });

    describe("postNewAdvertisementService", () => {
        const payload = {
            categoryId: 1,
            brandId: 2,
            itemName: "Jazz Bass",
            price: 300000,
            condition: "used",
            description: "Good condition"
        };

        it("should throw INVALID_AD_PAYLOAD before opening a connection", async () => {
            await expect(postNewAdvertisementService(1, { description: "missing fields" })).rejects.toThrow("INVALID_AD_PAYLOAD");

            expect(mysql.createConnection).not.toHaveBeenCalled();
        });

        it("should create a new advertisement with default picture when no files are uploaded", async () => {
            mockConnection.query
                .mockResolvedValueOnce([{ insertId: 10 }])
                .mockResolvedValueOnce([{ insertId: 20 }])
                .mockResolvedValueOnce([{ insertId: 30 }])
                .mockResolvedValueOnce([{ affectedRows: 1 }]);

            await expect(postNewAdvertisementService(1, payload)).resolves.toBe(30);

            expect(mockConnection.beginTransaction).toHaveBeenCalled();
            expect(mockConnection.query).toHaveBeenNthCalledWith(4, expect.stringContaining("INSERT INTO ad_files"), [30, "default-ad-picture"]);
            expect(mockConnection.commit).toHaveBeenCalled();
            expect(mockConnection.end).toHaveBeenCalled();
        });

        it("should save uploaded files and link them to the advertisement", async () => {
            const files: UploadedAdvertisementFile[] = [
                { filename: "img-1.jpg", originalname: "bass-front.jpg", size: 1234 },
                { filename: "img-2.jpg", originalname: "bass-back.jpg", size: 5678 }
            ];

            mockConnection.query
                .mockResolvedValueOnce([{ insertId: 10 }])
                .mockResolvedValueOnce([{ insertId: 20 }])
                .mockResolvedValueOnce([{ insertId: 30 }])
                .mockResolvedValueOnce([{ affectedRows: 1 }])
                .mockResolvedValueOnce([{ affectedRows: 1 }])
                .mockResolvedValueOnce([{ affectedRows: 1 }])
                .mockResolvedValueOnce([{ affectedRows: 1 }]);

            await expect(postNewAdvertisementService(1, payload, files)).resolves.toBe(30);

            expect(fs.mkdirSync).toHaveBeenCalled();
            expect(fs.renameSync).toHaveBeenNthCalledWith(
                1,
                expect.stringContaining("uploads\\img-1.jpg"),
                expect.stringContaining("uploads\\ad-pictures\\img-1.jpg")
            );
            expect(fs.renameSync).toHaveBeenNthCalledWith(
                2,
                expect.stringContaining("uploads\\img-2.jpg"),
                expect.stringContaining("uploads\\ad-pictures\\img-2.jpg")
            );
            expect(mockConnection.commit).toHaveBeenCalled();
            expect(mockConnection.end).toHaveBeenCalled();
        });

        it("should rollback and cleanup saved files when file persistence fails", async () => {
            const files: UploadedAdvertisementFile[] = [
                { filename: "img-1.jpg", originalname: "bass-front.jpg", size: 1234 }
            ];

            mockConnection.query
                .mockResolvedValueOnce([{ insertId: 10 }])
                .mockResolvedValueOnce([{ insertId: 20 }])
                .mockResolvedValueOnce([{ insertId: 30 }]);

            (fs.renameSync as jest.Mock).mockImplementationOnce(() => {
                throw new Error("MOVE_FAILED");
            });

            await expect(postNewAdvertisementService(1, payload, files)).rejects.toThrow("MOVE_FAILED");

            expect(mockConnection.rollback).toHaveBeenCalled();
            expect(mockConnection.commit).not.toHaveBeenCalled();
            expect(mockConnection.end).toHaveBeenCalled();
        });
    });

    describe("getFilteredAdvertisementsService", () => {
        it("should build filtered query results and release the pooled connection", async () => {
            mockPoolConnection.query.mockResolvedValueOnce([[
                {
                    advertisementId: 5,
                    description: "Tube head",
                    price: 250000,
                    item_condition: "used",
                    item_name: "Marshall DSL",
                    category: "Amplifiers",
                    brand: "Marshall",
                    files: "default-ad-picture,head.jpg"
                }
            ]]);

            await expect(getFilteredAdvertisementsService({
                categoryIds: "1,2",
                brandId: "3",
                conditions: "used,like-new",
                minPrice: "100",
                maxPrice: "500",
                q: "tube",
                page: "2",
                limit: "5"
            })).resolves.toEqual({
                page: 2,
                limit: 5,
                count: 1,
                data: [
                    {
                        advertisementId: 5,
                        description: "Tube head",
                        price: 250000,
                        item_condition: "used",
                        item_name: "Marshall DSL",
                        category: "Amplifiers",
                        brand: "Marshall",
                        files: [
                            "http://localhost:3000/ad-pictures/default-ad-picture.png",
                            "http://localhost:3000/ad-pictures/head.jpg"
                        ]
                    }
                ]
            });

            expect(mockPoolConnection.query).toHaveBeenCalledWith(
                expect.stringContaining("LIMIT 5 OFFSET 5"),
                [1, 2, 3, "used", "like-new", 100, 500, "%tube%", "%tube%"]
            );
            expect(mockPoolConnection.release).toHaveBeenCalled();
        });
    });

    describe("deleteOwnAdByIdService", () => {
        it("should delete an owned advertisement and related item data", async () => {
            mockConnection.query
                .mockResolvedValueOnce([[{ id: 4, used_item_id: 7 }]])
                .mockResolvedValueOnce([[{ item_id: 9 }]])
                .mockResolvedValueOnce([{ affectedRows: 1 }])
                .mockResolvedValueOnce([{ affectedRows: 1 }])
                .mockResolvedValueOnce([[{ count: 0 }]])
                .mockResolvedValueOnce([{ affectedRows: 1 }])
                .mockResolvedValueOnce([[{ count: 0 }]])
                .mockResolvedValueOnce([{ affectedRows: 1 }]);

            await expect(deleteOwnAdByIdService(4, 1)).resolves.toBeUndefined();

            expect(mockConnection.beginTransaction).toHaveBeenCalled();
            expect(mockConnection.commit).toHaveBeenCalled();
            expect(mockConnection.rollback).not.toHaveBeenCalled();
            expect(mockConnection.end).toHaveBeenCalled();
        });

        it("should throw AD_FORBIDDEN_OR_NOT_FOUND when the ad is not owned by the user", async () => {
            mockConnection.query.mockResolvedValueOnce([[]]);

            await expect(deleteOwnAdByIdService(4, 1)).rejects.toThrow("AD_FORBIDDEN_OR_NOT_FOUND");

            expect(mockConnection.rollback).toHaveBeenCalled();
            expect(mockConnection.end).toHaveBeenCalled();
        });
    });

    describe("patchAdByIdService", () => {
        it("should update advertisement fields and replace ad files", async () => {
            const files: UploadedAdvertisementFile[] = [
                { filename: "updated.jpg", originalname: "updated.jpg", size: 1111 }
            ];

            mockConnection.query
                .mockResolvedValueOnce([[{ id: 3, used_item_id: 8, user_id: "1" }]])
                .mockResolvedValueOnce([[{ item_id: 11 }]])
                .mockResolvedValueOnce([{ affectedRows: 1 }])
                .mockResolvedValueOnce([{ affectedRows: 1 }])
                .mockResolvedValueOnce([{ affectedRows: 1 }])
                .mockResolvedValueOnce([{ affectedRows: 1 }])
                .mockResolvedValueOnce([{ affectedRows: 1 }])
                .mockResolvedValueOnce([{ affectedRows: 1 }]);

            await expect(patchAdByIdService(3, 1, {
                itemName: "Updated name",
                categoryId: 5,
                brandId: 6,
                price: 99999,
                condition: "like-new",
                description: "Updated description"
            }, files)).resolves.toBeUndefined();

            expect(mockConnection.query).toHaveBeenCalledWith("DELETE FROM ad_files WHERE ad_id = ?", [3]);
            expect(fs.renameSync).toHaveBeenCalledWith(
                expect.stringContaining("uploads\\updated.jpg"),
                expect.stringContaining("uploads\\ad-pictures\\updated.jpg")
            );
            expect(mockConnection.commit).toHaveBeenCalled();
            expect(mockConnection.end).toHaveBeenCalled();
        });

        it("should throw AD_FORBIDDEN when the ad belongs to another user", async () => {
            mockConnection.query.mockResolvedValueOnce([[{ id: 3, used_item_id: 8, user_id: "99" }]]);

            await expect(patchAdByIdService(3, 1, {})).rejects.toThrow("AD_FORBIDDEN");

            expect(mockConnection.rollback).toHaveBeenCalled();
            expect(mockConnection.end).toHaveBeenCalled();
        });

        it("should rollback and cleanup newly moved files when patching fails after save", async () => {
            const files: UploadedAdvertisementFile[] = [
                { filename: "updated-1.jpg", originalname: "updated-1.jpg", size: 1111 },
                { filename: "updated-2.jpg", originalname: "updated-2.jpg", size: 2222 }
            ];

            mockConnection.query
                .mockResolvedValueOnce([[{ id: 3, used_item_id: 8, user_id: "1" }]])
                .mockResolvedValueOnce([[{ item_id: 11 }]])
                .mockResolvedValueOnce([{ affectedRows: 1 }])
                .mockResolvedValueOnce([{ affectedRows: 1 }])
                .mockResolvedValueOnce([{ affectedRows: 1 }])
                .mockResolvedValueOnce([{ affectedRows: 1 }])
                .mockResolvedValueOnce([{ affectedRows: 1 }])
                .mockResolvedValueOnce([{ affectedRows: 1 }])
                .mockRejectedValueOnce(new Error("LINK_INSERT_FAILED"));

            await expect(patchAdByIdService(3, 1, { description: "Updated" }, files)).rejects.toThrow("LINK_INSERT_FAILED");

            expect(mockConnection.rollback).toHaveBeenCalled();
            expect(fs.unlinkSync).toHaveBeenCalledWith(expect.stringContaining("uploads\\ad-pictures\\updated-1.jpg"));
            expect(mockConnection.end).toHaveBeenCalled();
        });
    });

    describe("deleteAdFromReportedAdsByIdService", () => {
        it("should throw REPORTED_AD_NOT_FOUND when no reported ad is updated", async () => {
            mockConnection.query.mockResolvedValueOnce([{ affectedRows: 0 }]);

            await expect(deleteAdFromReportedAdsByIdService(77)).rejects.toThrow("REPORTED_AD_NOT_FOUND");

            expect(mockConnection.end).toHaveBeenCalled();
        });
    });
});