import mysql from "mysql2/promise";
import {
	deleteAdFromCartByAdIdService,
	getAdByIdFromUserCartService,
	getAdsFromUserCartService,
	putNewAdIntoCartByAdIdService
} from "./cartService";

jest.mock("mysql2/promise");

describe("cartService tests", () => {
	let mockConnection: any;

	beforeEach(() => {
		mockConnection = {
			query: jest.fn(),
			end: jest.fn()
		};

		(mysql.createConnection as jest.Mock).mockResolvedValue(mockConnection);
		jest.clearAllMocks();
	});

	describe("getAdsFromUserCartService", () => {
		it("should return formatted cart ads", async () => {
			const ads = [
				{
					id: 1,
					name: "Amp",
					description: "Tube amp",
					price: 120000,
					files: "default-ad-picture,amp-1.jpg"
				}
			];

			mockConnection.query.mockResolvedValueOnce([ads]);

			await expect(getAdsFromUserCartService(1)).resolves.toEqual([
				{
					id: 1,
					name: "Amp",
					description: "Tube amp",
					price: 120000,
					files: [
						"http://localhost:3000/ad-pictures/default-ad-picture.png",
						"http://localhost:3000/ad-pictures/amp-1.jpg"
					]
				}
			]);

			expect(mockConnection.query).toHaveBeenCalledWith(
				expect.stringContaining("FROM carts"),
				[1]
			);
			expect(mockConnection.end).toHaveBeenCalled();
		});

		it("should throw NO_CART_ADS when the cart is empty", async () => {
			mockConnection.query.mockResolvedValueOnce([[]]);

			await expect(getAdsFromUserCartService(1)).rejects.toThrow("NO_CART_ADS");

			expect(mockConnection.end).toHaveBeenCalled();
		});
	});

	describe("getAdByIdFromUserCartService", () => {
		it("should return one formatted cart ad", async () => {
			const ad = [
				{
					id: 2,
					name: "Guitar",
					brand_name: "Fender",
					item_condition: "used",
					price: 200000,
					email: "seller@example.com",
					description: "Stratocaster",
					files: "guitar-1.jpg,guitar-2.jpg"
				}
			];

			mockConnection.query.mockResolvedValueOnce([ad]);

			await expect(getAdByIdFromUserCartService(1, 2)).resolves.toEqual([
				{
					id: 2,
					name: "Guitar",
					brand_name: "Fender",
					item_condition: "used",
					price: 200000,
					email: "seller@example.com",
					description: "Stratocaster",
					files: [
						"http://localhost:3000/ad-pictures/guitar-1.jpg",
						"http://localhost:3000/ad-pictures/guitar-2.jpg"
					]
				}
			]);

			expect(mockConnection.query).toHaveBeenCalledWith(
				expect.stringContaining("WHERE users.id = ? AND advertisements.id = ?"),
				[1, 2]
			);
			expect(mockConnection.end).toHaveBeenCalled();
		});

		it("should throw AD_NOT_FOUND when the ad is not in the cart", async () => {
			mockConnection.query.mockResolvedValueOnce([[]]);

			await expect(getAdByIdFromUserCartService(1, 2)).rejects.toThrow("AD_NOT_FOUND");

			expect(mockConnection.end).toHaveBeenCalled();
		});
	});

	describe("putNewAdIntoCartByAdIdService", () => {
		it("should insert a new cart entry", async () => {
			mockConnection.query
				.mockResolvedValueOnce([[{ id: 2 }]])
				.mockResolvedValueOnce([[]])
				.mockResolvedValueOnce([[{ uid: 3 }]])
				.mockResolvedValueOnce([{ affectedRows: 1 }]);

			await expect(putNewAdIntoCartByAdIdService(1, 2)).resolves.toBeUndefined();

			expect(mockConnection.query).toHaveBeenNthCalledWith(1, "SELECT id FROM advertisements WHERE id = ?", [2]);
			expect(mockConnection.query).toHaveBeenNthCalledWith(2, "SELECT id FROM carts WHERE user_id = ? AND ad_id = ?", [1, 2]);
			expect(mockConnection.query).toHaveBeenNthCalledWith(3, "SELECT user_id AS uid FROM advertisements WHERE id = ?", [2]);
			expect(mockConnection.query).toHaveBeenNthCalledWith(4, "INSERT INTO carts(user_id, ad_id) VALUES (?, ?)", [1, 2]);
			expect(mockConnection.end).toHaveBeenCalled();
		});

		it("should throw AD_NOT_FOUND when the ad does not exist", async () => {
			mockConnection.query.mockResolvedValueOnce([[]]);

			await expect(putNewAdIntoCartByAdIdService(1, 2)).rejects.toThrow("AD_NOT_FOUND");

			expect(mockConnection.end).toHaveBeenCalled();
		});

		it("should throw AD_ALREADY_IN_CART when the ad is already saved", async () => {
			mockConnection.query
				.mockResolvedValueOnce([[{ id: 2 }]])
				.mockResolvedValueOnce([[{ id: 99 }]]);

			await expect(putNewAdIntoCartByAdIdService(1, 2)).rejects.toThrow("AD_ALREADY_IN_CART");

			expect(mockConnection.end).toHaveBeenCalled();
		});

		it("should throw OWN_AD_FORBIDDEN when the ad belongs to the user", async () => {
			mockConnection.query
				.mockResolvedValueOnce([[{ id: 2 }]])
				.mockResolvedValueOnce([[]])
				.mockResolvedValueOnce([[{ uid: 1 }]]);

			await expect(putNewAdIntoCartByAdIdService(1, 2)).rejects.toThrow("OWN_AD_FORBIDDEN");

			expect(mockConnection.end).toHaveBeenCalled();
		});

		it("should throw ADD_TO_CART_FAILED when insert affects no rows", async () => {
			mockConnection.query
				.mockResolvedValueOnce([[{ id: 2 }]])
				.mockResolvedValueOnce([[]])
				.mockResolvedValueOnce([[{ uid: 3 }]])
				.mockResolvedValueOnce([{ affectedRows: 0 }]);

			await expect(putNewAdIntoCartByAdIdService(1, 2)).rejects.toThrow("ADD_TO_CART_FAILED");

			expect(mockConnection.end).toHaveBeenCalled();
		});
	});

	describe("deleteAdFromCartByAdIdService", () => {
		it("should delete a cart entry", async () => {
			mockConnection.query
				.mockResolvedValueOnce([[{ id: 2 }]])
				.mockResolvedValueOnce([{ affectedRows: 1 }]);

			await expect(deleteAdFromCartByAdIdService(1, 2)).resolves.toBeUndefined();

			expect(mockConnection.query).toHaveBeenNthCalledWith(1, "SELECT id FROM advertisements WHERE id = ?", [2]);
			expect(mockConnection.query).toHaveBeenNthCalledWith(2, "DELETE FROM carts WHERE user_id = ? AND ad_id = ?", [1, 2]);
			expect(mockConnection.end).toHaveBeenCalled();
		});

		it("should throw AD_NOT_FOUND when the ad does not exist", async () => {
			mockConnection.query.mockResolvedValueOnce([[]]);

			await expect(deleteAdFromCartByAdIdService(1, 2)).rejects.toThrow("AD_NOT_FOUND");

			expect(mockConnection.end).toHaveBeenCalled();
		});

		it("should throw DELETE_FROM_CART_FAILED when nothing is deleted", async () => {
			mockConnection.query
				.mockResolvedValueOnce([[{ id: 2 }]])
				.mockResolvedValueOnce([{ affectedRows: 0 }]);

			await expect(deleteAdFromCartByAdIdService(1, 2)).rejects.toThrow("DELETE_FROM_CART_FAILED");

			expect(mockConnection.end).toHaveBeenCalled();
		});
	});
});
