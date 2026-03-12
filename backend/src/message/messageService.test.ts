import mysql from "mysql2/promise";
import {
  deleteMessageByIdService,
  getUserIncomingMessagesService,
  getUserIncomingMessageByIdService,
  getUserSentMessagesService,
  getUserSentMessageByIdService,
  patchMessageByIdService,
  postNewMessageService
} from "./messageService";

jest.mock("mysql2/promise");

describe("messageService tests", () => {
  let mockConnection: any;

  beforeEach(() => {
    mockConnection = {
      query: jest.fn(),
      end: jest.fn()
    };

    (mysql.createConnection as jest.Mock).mockResolvedValue(mockConnection);
    jest.clearAllMocks();
  });

  describe("getUserIncomingMessagesService", () => {
    it("should return incoming messages", async () => {
      const messages = [{ id: 1, sender_id: 2, receiver_id: 1, content: "hello" }];

      mockConnection.query
        .mockResolvedValueOnce([[{ id: 1 }]])
        .mockResolvedValueOnce([messages]);

      await expect(getUserIncomingMessagesService(1)).resolves.toEqual(messages);

      expect(mockConnection.query).toHaveBeenNthCalledWith(1, "SELECT id FROM users WHERE id = ?", [1]);
      expect(mockConnection.end).toHaveBeenCalled();
    });

    it("should throw USER_NOT_FOUND when user does not exist", async () => {
      mockConnection.query.mockResolvedValueOnce([[]]);

      await expect(getUserIncomingMessagesService(1)).rejects.toThrow("USER_NOT_FOUND");

      expect(mockConnection.end).toHaveBeenCalled();
    });

    it("should throw NO_INCOMING_MESSAGES when there are no incoming messages", async () => {
      mockConnection.query
        .mockResolvedValueOnce([[{ id: 1 }]])
        .mockResolvedValueOnce([[]]);

      await expect(getUserIncomingMessagesService(1)).rejects.toThrow("NO_INCOMING_MESSAGES");

      expect(mockConnection.end).toHaveBeenCalled();
    });
  });

  describe("getUserIncomingMessageByIdService", () => {
    it("should return a specific incoming message", async () => {
      const message = [{ id: 5, sender_id: 2, receiver_id: 1, content: "hello" }];

      mockConnection.query
        .mockResolvedValueOnce([[{ id: 1 }]])
        .mockResolvedValueOnce([message]);

      await expect(getUserIncomingMessageByIdService(1, 5)).resolves.toEqual(message);

      expect(mockConnection.end).toHaveBeenCalled();
    });

    it("should throw MESSAGE_NOT_FOUND when the incoming message does not exist", async () => {
      mockConnection.query
        .mockResolvedValueOnce([[{ id: 1 }]])
        .mockResolvedValueOnce([[]]);

      await expect(getUserIncomingMessageByIdService(1, 5)).rejects.toThrow("MESSAGE_NOT_FOUND");

      expect(mockConnection.end).toHaveBeenCalled();
    });
  });

  describe("getUserSentMessagesService", () => {
    it("should return sent messages", async () => {
      const messages = [{ id: 7, sender_id: 1, receiver_id: 3, content: "sent" }];

      mockConnection.query
        .mockResolvedValueOnce([[{ id: 1 }]])
        .mockResolvedValueOnce([messages]);

      await expect(getUserSentMessagesService(1)).resolves.toEqual(messages);

      expect(mockConnection.end).toHaveBeenCalled();
    });

    it("should throw NO_SENT_MESSAGES when there are no sent messages", async () => {
      mockConnection.query
        .mockResolvedValueOnce([[{ id: 1 }]])
        .mockResolvedValueOnce([[]]);

      await expect(getUserSentMessagesService(1)).rejects.toThrow("NO_SENT_MESSAGES");

      expect(mockConnection.end).toHaveBeenCalled();
    });
  });

  describe("getUserSentMessageByIdService", () => {
    it("should return a specific sent message", async () => {
      const message = [{ id: 9, sender_id: 1, receiver_id: 4, content: "sent one" }];

      mockConnection.query
        .mockResolvedValueOnce([[{ id: 1 }]])
        .mockResolvedValueOnce([message]);

      await expect(getUserSentMessageByIdService(1, 9)).resolves.toEqual(message);

      expect(mockConnection.end).toHaveBeenCalled();
    });

    it("should throw MESSAGE_NOT_FOUND when the sent message does not exist", async () => {
      mockConnection.query
        .mockResolvedValueOnce([[{ id: 1 }]])
        .mockResolvedValueOnce([[]]);

      await expect(getUserSentMessageByIdService(1, 9)).rejects.toThrow("MESSAGE_NOT_FOUND");

      expect(mockConnection.end).toHaveBeenCalled();
    });
  });

  describe("postNewMessageService", () => {
    it("should insert a new message", async () => {
      mockConnection.query
        .mockResolvedValueOnce([[{ id: 2 }]])
        .mockResolvedValueOnce([{ affectedRows: 1 }]);

      await expect(postNewMessageService(1, 2, "hello there")).resolves.toBeUndefined();

      expect(mockConnection.query).toHaveBeenNthCalledWith(1, "SELECT id FROM users WHERE id = ?", [2]);
      expect(mockConnection.query).toHaveBeenNthCalledWith(
        2,
        "INSERT INTO messages(sender_id, receiver_id, content) VALUES(?, ?, ?)",
        [1, 2, "hello there"]
      );
      expect(mockConnection.end).toHaveBeenCalled();
    });

    it("should throw INVALID_MESSAGE_CONTENT when content is blank", async () => {
      await expect(postNewMessageService(1, 2, "   ")).rejects.toThrow("INVALID_MESSAGE_CONTENT");

      expect(mysql.createConnection).not.toHaveBeenCalled();
    });

    it("should throw USER_NOT_FOUND when receiver does not exist", async () => {
      mockConnection.query.mockResolvedValueOnce([[]]);

      await expect(postNewMessageService(1, 2, "hello there")).rejects.toThrow("USER_NOT_FOUND");

      expect(mockConnection.end).toHaveBeenCalled();
    });

    it("should throw MESSAGE_SEND_FAILED when insert affects no rows", async () => {
      mockConnection.query
        .mockResolvedValueOnce([[{ id: 2 }]])
        .mockResolvedValueOnce([{ affectedRows: 0 }]);

      await expect(postNewMessageService(1, 2, "hello there")).rejects.toThrow("MESSAGE_SEND_FAILED");

      expect(mockConnection.end).toHaveBeenCalled();
    });
  });

  describe("deleteMessageByIdService", () => {
    it("should delete a message when the user is sender or receiver", async () => {
      mockConnection.query.mockResolvedValueOnce([{ affectedRows: 1 }]);

      await expect(deleteMessageByIdService(5, 1)).resolves.toBeUndefined();

      expect(mockConnection.query).toHaveBeenCalledWith(
        `
			DELETE FROM messages
			WHERE id = ?
			  AND (sender_id = ? OR receiver_id = ?)
			`,
        [5, 1, 1]
      );
      expect(mockConnection.end).toHaveBeenCalled();
    });

    it("should throw MESSAGE_NOT_FOUND when the message does not exist", async () => {
      mockConnection.query
        .mockResolvedValueOnce([{ affectedRows: 0 }])
        .mockResolvedValueOnce([[]]);

      await expect(deleteMessageByIdService(5, 1)).rejects.toThrow("MESSAGE_NOT_FOUND");

      expect(mockConnection.end).toHaveBeenCalled();
    });

    it("should throw MESSAGE_FORBIDDEN when the user cannot delete the message", async () => {
      mockConnection.query
        .mockResolvedValueOnce([{ affectedRows: 0 }])
        .mockResolvedValueOnce([[{ id: 5 }]]);

      await expect(deleteMessageByIdService(5, 1)).rejects.toThrow("MESSAGE_FORBIDDEN");

      expect(mockConnection.end).toHaveBeenCalled();
    });
  });

  describe("patchMessageByIdService", () => {
    it("should update a sent message", async () => {
      mockConnection.query.mockResolvedValueOnce([{ affectedRows: 1 }]);

      await expect(patchMessageByIdService(5, 1, "updated content")).resolves.toBeUndefined();

      expect(mockConnection.query).toHaveBeenCalledWith(
        `
			UPDATE messages
			SET content = ?
			WHERE id = ? AND sender_id = ?
			`,
        ["updated content", 5, 1]
      );
      expect(mockConnection.end).toHaveBeenCalled();
    });

    it("should throw INVALID_MESSAGE_CONTENT when content is blank", async () => {
      await expect(patchMessageByIdService(5, 1, "")).rejects.toThrow("INVALID_MESSAGE_CONTENT");

      expect(mysql.createConnection).not.toHaveBeenCalled();
    });

    it("should throw MESSAGE_NOT_FOUND when the message does not exist", async () => {
      mockConnection.query
        .mockResolvedValueOnce([{ affectedRows: 0 }])
        .mockResolvedValueOnce([[]]);

      await expect(patchMessageByIdService(5, 1, "updated content")).rejects.toThrow("MESSAGE_NOT_FOUND");

      expect(mockConnection.end).toHaveBeenCalled();
    });

    it("should throw MESSAGE_FORBIDDEN when the user is not the sender", async () => {
      mockConnection.query
        .mockResolvedValueOnce([{ affectedRows: 0 }])
        .mockResolvedValueOnce([[{ id: 5 }]]);

      await expect(patchMessageByIdService(5, 1, "updated content")).rejects.toThrow("MESSAGE_FORBIDDEN");

      expect(mockConnection.end).toHaveBeenCalled();
    });
  });
});