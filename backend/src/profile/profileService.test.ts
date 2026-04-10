import mysql from "mysql2/promise";
import fs from "fs";
import {
    getProfileDatasByIdService,
    getUsersProfileDatasByIdService,
    patchProfileByIdService,
    UploadedProfileFile,
    voteProfileByIdService
} from "./profileService";

jest.mock("mysql2/promise");
jest.mock("fs", () => ({
    __esModule: true,
    default: {
        mkdirSync: jest.fn(),
        renameSync: jest.fn(),
        unlinkSync: jest.fn()
    }
}));

describe("profileService tests", () => {
    let mockConnection: any;

    beforeEach(() => {
        mockConnection = {
            beginTransaction: jest.fn(),
            query: jest.fn(),
            commit: jest.fn(),
            rollback: jest.fn(),
            end: jest.fn()
        };

        (mysql.createConnection as jest.Mock).mockResolvedValue(mockConnection);
        jest.clearAllMocks();
    });

    describe("getProfileDatasByIdService", () => {
        it("should return a profile with a full picture url", async () => {
            mockConnection.query.mockResolvedValueOnce([[{
                profile_id: 3,
                username: "robi",
                phone_number: "123456",
                profile_picture: "profile-1.jpg",
                up_votes: 4,
                down_votes: 1
            }]]);

            await expect(getProfileDatasByIdService(3)).resolves.toEqual({
                profile_id: 3,
                username: "robi",
                phone_number: "123456",
                profile_picture: "http://localhost:3000/profile-pictures/profile-1.jpg",
                up_votes: 4,
                down_votes: 1
            });

            expect(mockConnection.query).toHaveBeenCalledWith(expect.stringContaining("WHERE p.id = ?"), [3]);
            expect(mockConnection.end).toHaveBeenCalled();
        });

        it("should throw PROFILE_NOT_FOUND when the profile does not exist", async () => {
            mockConnection.query.mockResolvedValueOnce([[]]);

            await expect(getProfileDatasByIdService(3)).rejects.toThrow("PROFILE_NOT_FOUND");
            expect(mockConnection.end).toHaveBeenCalled();
        });
    });

    describe("getUsersProfileDatasByIdService", () => {
        it("should return the logged-in user's profile", async () => {
            mockConnection.query.mockResolvedValueOnce([[{
                profile_id: 7,
                username: "gearuser",
                phone_number: "55555",
                profile_picture: "default-profile-picture.jpg",
                up_votes: 2,
                down_votes: 0
            }]]);

            await expect(getUsersProfileDatasByIdService(9)).resolves.toEqual({
                profile_id: 7,
                username: "gearuser",
                phone_number: "55555",
                profile_picture: "http://localhost:3000/profile-pictures/default-profile-picture.jpg",
                up_votes: 2,
                down_votes: 0
            });

            expect(mockConnection.query).toHaveBeenCalledWith(expect.stringContaining("WHERE p.user_id = ?"), [9]);
            expect(mockConnection.end).toHaveBeenCalled();
        });
    });

    describe("voteProfileByIdService", () => {
        it("should throw INVALID_VOTE before opening a connection", async () => {
            await expect(voteProfileByIdService(1, 2, 0)).rejects.toThrow("INVALID_VOTE");

            expect(mysql.createConnection).not.toHaveBeenCalled();
        });

        it("should save a vote", async () => {
            mockConnection.query
                .mockResolvedValueOnce([[{ user_id: 5 }]])
                .mockResolvedValueOnce([{ affectedRows: 1 }]);

            await expect(voteProfileByIdService(1, 2, 1)).resolves.toBeUndefined();

            expect(mockConnection.query).toHaveBeenNthCalledWith(1, "SELECT user_id FROM profiles WHERE id = ?", [2]);
            expect(mockConnection.query).toHaveBeenNthCalledWith(
                2,
                expect.stringContaining("INSERT INTO profile_votes"),
                [2, 1, 1]
            );
            expect(mockConnection.end).toHaveBeenCalled();
        });

        it("should throw PROFILE_NOT_FOUND when the target profile does not exist", async () => {
            mockConnection.query.mockResolvedValueOnce([[]]);

            await expect(voteProfileByIdService(1, 2, 1)).rejects.toThrow("PROFILE_NOT_FOUND");
            expect(mockConnection.end).toHaveBeenCalled();
        });

        it("should throw OWN_PROFILE_VOTE_FORBIDDEN when voting on your own profile", async () => {
            mockConnection.query.mockResolvedValueOnce([[{ user_id: 1 }]]);

            await expect(voteProfileByIdService(1, 2, -1)).rejects.toThrow("OWN_PROFILE_VOTE_FORBIDDEN");
            expect(mockConnection.end).toHaveBeenCalled();
        });
    });

    describe("patchProfileByIdService", () => {
        it("should throw PROFILE_NOT_FOUND when the user has no profile", async () => {
            mockConnection.query.mockResolvedValueOnce([[]]);

            await expect(patchProfileByIdService(1, { username: "newname" })).rejects.toThrow("PROFILE_NOT_FOUND");

            expect(mockConnection.beginTransaction).toHaveBeenCalled();
            expect(mockConnection.rollback).toHaveBeenCalled();
            expect(mockConnection.end).toHaveBeenCalled();
        });

        it("should update username and phone number without changing the picture", async () => {
            mockConnection.query
                .mockResolvedValueOnce([[{ id: 4, profile_picture: "default-profile-picture.jpg" }]])
                .mockResolvedValueOnce([{ affectedRows: 1 }]);

            await expect(patchProfileByIdService(1, {
                username: "updated-user",
                phone_number: "111222"
            })).resolves.toBeUndefined();

            expect(mockConnection.query).toHaveBeenNthCalledWith(2,
                "UPDATE users SET username = COALESCE(?, username), phone_number = COALESCE(?, phone_number) WHERE id = ?",
                ["updated-user", "111222", 1]
            );
            expect(mockConnection.commit).toHaveBeenCalled();
            expect(mockConnection.end).toHaveBeenCalled();
        });

        it("should update the profile picture and remove the previous custom picture", async () => {
            const file: UploadedProfileFile = {
                filename: "new-profile.jpg",
                originalname: "avatar.jpg",
                size: 2048
            };

            mockConnection.query
                .mockResolvedValueOnce([[{ id: 4, profile_picture: "old-profile.jpg" }]])
                .mockResolvedValueOnce([{ affectedRows: 1 }])
                .mockResolvedValueOnce([{ affectedRows: 1 }])
                .mockResolvedValueOnce([{ affectedRows: 1 }]);

            await expect(patchProfileByIdService(1, {
                username: "updated-user"
            }, file)).resolves.toBeUndefined();

            expect(fs.mkdirSync).toHaveBeenCalled();
            expect(fs.renameSync).toHaveBeenCalledWith(
                expect.stringContaining("uploads\\new-profile.jpg"),
                expect.stringContaining("uploads\\profile-pictures\\new-profile.jpg")
            );
            expect(fs.unlinkSync).toHaveBeenCalledWith(expect.stringContaining("uploads\\profile-pictures\\old-profile.jpg"));
            expect(mockConnection.query).toHaveBeenLastCalledWith(
                "UPDATE profiles SET profile_picture = ? WHERE id = ?",
                ["new-profile.jpg", 4]
            );
            expect(mockConnection.commit).toHaveBeenCalled();
            expect(mockConnection.end).toHaveBeenCalled();
        });

        it("should rollback and cleanup the uploaded file when storing file metadata fails", async () => {
            const file: UploadedProfileFile = {
                filename: "new-profile.jpg",
                originalname: "avatar.jpg",
                size: 2048
            };

            mockConnection.query
                .mockResolvedValueOnce([[{ id: 4, profile_picture: "default-profile-picture.jpg" }]])
                .mockResolvedValueOnce([{ affectedRows: 1 }])
                .mockRejectedValueOnce(new Error("FILE_INSERT_FAILED"));

            await expect(patchProfileByIdService(1, {
                username: "updated-user"
            }, file)).rejects.toThrow("FILE_INSERT_FAILED");

            expect(mockConnection.rollback).toHaveBeenCalled();
            expect(fs.unlinkSync).toHaveBeenCalledWith(expect.stringContaining("uploads\\profile-pictures\\new-profile.jpg"));
            expect(mockConnection.end).toHaveBeenCalled();
        });
    });
});