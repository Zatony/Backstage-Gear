import * as userService from "./userService";
import { signIn, getIsAdminById } from "./userController";
import { signUpService, deleteOwnUserByIdService } from "./userService";
import mysql from "mysql2/promise";
import jwt from "jsonwebtoken";

jest.mock("mysql2/promise");
jest.mock("jsonwebtoken");


describe("signIn", () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    req = { body: { email: "test@example.com", password: "password123" } };
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      json: jest.fn()
    };
  });

  it("should return 400 if email or password is missing", async () => {
    req.body = { email: "", password: "" };
    await signIn(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith(expect.stringContaining("Nem megfelelően megadott adatok"));
  });
});


describe("signUpService", () => {

  it("sikeres regisztráció és token visszaadása", async () => {

    const mockQuery = jest.fn()
      .mockResolvedValueOnce([{ affectedRows: 1, insertId: 1 }])
      .mockResolvedValueOnce([{}])
      .mockResolvedValueOnce([[{ id: 1 }]])
      .mockResolvedValueOnce([[{ is_admin: 0 }]]);

    const mockConnection = {
      beginTransaction: jest.fn(),
      query: mockQuery,
      commit: jest.fn(),
      rollback: jest.fn(),
      end: jest.fn()
    };

    (mysql.createConnection as jest.Mock).mockResolvedValue(mockConnection);

    (jwt.sign as jest.Mock).mockReturnValue("fake-token");

    const userData = {
      name: "Test User",
      userName: "testuser",
      email: "test@test.com",
      phoneNumber: "123456",
      dateOfBirth: "2000-01-01",
      password: "123456"
    };

    const result = await signUpService(userData);

    expect(result.message).toBe("Sikeres regisztráció");
    expect(result.token).toBe("fake-token");
    expect(mockConnection.beginTransaction).toHaveBeenCalled();
    expect(mockConnection.commit).toHaveBeenCalled();
  });
});


describe("getIsAdminById", () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    req = { user: { id: "1" } };
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  it("should return 200 and is_admin true if user is admin", async () => {
    jest.spyOn(userService, "getIsAdminService").mockResolvedValue(true);
    await getIsAdminById(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({ is_admin: true });
  });

  it("should return 200 and is_admin false if user is not admin", async () => {
    jest.spyOn(userService, "getIsAdminService").mockResolvedValue(false);
    await getIsAdminById(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({ is_admin: false });
  });

  it("should return 404 if user not found", async () => {
    jest.spyOn(userService, "getIsAdminService").mockResolvedValue(null);
    await getIsAdminById(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith(expect.stringContaining("Nem létezik ilyen azonosítójú felhasználó"));
  });

  it("should return 500 on error", async () => {
    jest.spyOn(userService, "getIsAdminService").mockRejectedValue(new Error("fail"));
    await getIsAdminById(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith(expect.stringContaining("Szerver hiba"));
  });
});


describe("deleteOwnUserByIdService", () => {
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

  it("should delete user and related data, then commit", async () => {
    mockConnection.query
      .mockResolvedValueOnce([[{ id: 1, used_item_id: 2 }]]) // ads
      .mockResolvedValueOnce(undefined) // DELETE carts by adIds
      .mockResolvedValueOnce(undefined) // DELETE carts by userId
      .mockResolvedValueOnce(undefined) // DELETE ads
      .mockResolvedValueOnce([[{ item_id: 3 }]]) // itemRows
      .mockResolvedValueOnce(undefined) // DELETE used_items
      .mockResolvedValueOnce(undefined) // DELETE items
      .mockResolvedValueOnce(undefined); // DELETE user
    await expect(deleteOwnUserByIdService(1)).resolves.toBeUndefined();
    expect(mockConnection.beginTransaction).toHaveBeenCalled();
    expect(mockConnection.commit).toHaveBeenCalled();
    expect(mockConnection.rollback).not.toHaveBeenCalled();
    expect(mockConnection.end).toHaveBeenCalled();
  });

  it("should rollback and throw on error", async () => {
    mockConnection.query
      .mockResolvedValueOnce([[{ id: 1, used_item_id: 2 }]]) // ads
      .mockRejectedValueOnce(new Error("fail")); // fail on the next query
    await expect(deleteOwnUserByIdService(1)).rejects.toThrow("fail");
    expect(mockConnection.rollback).toHaveBeenCalled();
    expect(mockConnection.end).toHaveBeenCalled();
  });
});