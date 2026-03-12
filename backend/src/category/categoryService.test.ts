import mysql from "mysql2/promise";
import { getCategoriesService } from "./categoryService";

jest.mock("mysql2/promise");

describe("categoryService tests", () => {
	let mockConnection: any;

	beforeEach(() => {
		mockConnection = {
			query: jest.fn(),
			end: jest.fn()
		};

		(mysql.createConnection as jest.Mock).mockResolvedValue(mockConnection);
		jest.clearAllMocks();
	});

	describe("getCategoriesService", () => {
		it("should return categories with full picture urls", async () => {
			const categories = [
				{ categoryId: 1, name: "Guitar", picture: "guitar.png" },
				{ categoryId: 2, name: "Drums", picture: "drums.png" }
			];

			mockConnection.query.mockResolvedValueOnce([categories]);

			await expect(getCategoriesService()).resolves.toEqual([
				{
					categoryId: 1,
					name: "Guitar",
					picture: "http://localhost:3000/categories-pictures/guitar.png"
				},
				{
					categoryId: 2,
					name: "Drums",
					picture: "http://localhost:3000/categories-pictures/drums.png"
				}
			]);

			expect(mockConnection.query).toHaveBeenCalledWith("SELECT * FROM categories");
			expect(mockConnection.end).toHaveBeenCalled();
		});

		it("should throw NO_CATEGORIES when there are no categories", async () => {
			mockConnection.query.mockResolvedValueOnce([[]]);

			await expect(getCategoriesService()).rejects.toThrow("NO_CATEGORIES");

			expect(mockConnection.query).toHaveBeenCalledWith("SELECT * FROM categories");
			expect(mockConnection.end).toHaveBeenCalled();
		});
	});
});
