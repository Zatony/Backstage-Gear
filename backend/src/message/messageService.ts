import mysql from "mysql2/promise";
import config from "../config/config";


async function ensureUserExists(connection: any, userId: number): Promise<void> {
	const [result]: any = await connection.query(
		"SELECT id FROM users WHERE id = ?",
		[userId]
	);

	if (result.length === 0) {
		throw new Error("USER_NOT_FOUND");
	}
}


export async function getUserIncomingMessagesService(userId: number): Promise<any[]> {
	const connection = await mysql.createConnection(config.database);

	try {
		await ensureUserExists(connection, userId);

		const [results]: any = await connection.query(
			`SELECT
				messages.id,
				messages.sender_id,
				messages.receiver_id,
				messages.content,
				DATE_FORMAT(messages.sent_at, '%Y-%m-%d %H:%i:%s') AS sent_at
			FROM messages
			INNER JOIN users AS receiver ON messages.receiver_id = receiver.id
			WHERE messages.receiver_id = ?
			ORDER BY messages.sent_at DESC;`,
			[userId]
		);

		if (results.length === 0) {
			throw new Error("NO_INCOMING_MESSAGES");
		}

		return results;
	}
	finally {
		await connection.end();
	}
}


export async function getUserIncomingMessageByIdService(userId: number, messageId: number): Promise<any[]> {
	const connection = await mysql.createConnection(config.database);

	try {
		await ensureUserExists(connection, userId);

		const [result]: any = await connection.query(
			`SELECT
				messages.id,
				messages.sender_id,
				messages.receiver_id,
				messages.content,
				DATE_FORMAT(messages.sent_at, '%Y-%m-%d %H:%i:%s') AS sent_at
			FROM messages
			INNER JOIN users AS receiver ON messages.receiver_id = receiver.id
			WHERE messages.receiver_id = ? AND messages.id = ?
			ORDER BY messages.sent_at DESC;`,
			[userId, messageId]
		);

		if (result.length === 0) {
			throw new Error("MESSAGE_NOT_FOUND");
		}

		return result;
	}
	finally {
		await connection.end();
	}
}


export async function getUserSentMessagesService(userId: number): Promise<any[]> {
	const connection = await mysql.createConnection(config.database);

	try {
		await ensureUserExists(connection, userId);

		const [results]: any = await connection.query(
			`SELECT
				messages.id,
				messages.sender_id,
				messages.receiver_id,
				messages.content,
				DATE_FORMAT(messages.sent_at, '%Y-%m-%d %H:%i:%s') AS sent_at
			FROM messages
			INNER JOIN users AS sender ON messages.sender_id = sender.id
			WHERE messages.sender_id = ?
			ORDER BY messages.sent_at DESC;`,
			[userId]
		);

		if (results.length === 0) {
			throw new Error("NO_SENT_MESSAGES");
		}

		return results;
	}
	finally {
		await connection.end();
	}
}


export async function getUserSentMessageByIdService(userId: number, messageId: number): Promise<any[]> {
	const connection = await mysql.createConnection(config.database);

	try {
		await ensureUserExists(connection, userId);

		const [result]: any = await connection.query(
			`SELECT
				messages.id,
				messages.sender_id,
				messages.receiver_id,
				messages.content,
				DATE_FORMAT(messages.sent_at, '%Y-%m-%d %H:%i:%s') AS sent_at
			FROM messages
			INNER JOIN users AS sender ON messages.sender_id = sender.id
			WHERE messages.sender_id = ? AND messages.id = ?
			ORDER BY messages.sent_at DESC;`,
			[userId, messageId]
		);

		if (result.length === 0) {
			throw new Error("MESSAGE_NOT_FOUND");
		}

		return result;
	}
	finally {
		await connection.end();
	}
}


export async function postNewMessageService(senderId: number, receiverId: number, content: string): Promise<void> {
	if (typeof content !== "string" || content.trim() === "") {
		throw new Error("INVALID_MESSAGE_CONTENT");
	}

	const connection = await mysql.createConnection(config.database);

	try {
		await ensureUserExists(connection, receiverId);

		const [result]: any = await connection.query(
			"INSERT INTO messages(sender_id, receiver_id, content) VALUES(?, ?, ?)",
			[senderId, receiverId, content]
		);

		if (result.affectedRows !== 1) {
			throw new Error("MESSAGE_SEND_FAILED");
		}
	}
	finally {
		await connection.end();
	}
}


export async function deleteMessageByIdService(messageId: number, userId: number): Promise<void> {
	const connection = await mysql.createConnection(config.database);

	try {
		const [result]: any = await connection.query(
			`
			DELETE FROM messages
			WHERE id = ?
			  AND (sender_id = ? OR receiver_id = ?)
			`,
			[messageId, userId, userId]
		);

		if (result.affectedRows === 1) {
			return;
		}

		const [rows]: any = await connection.query(
			"SELECT id FROM messages WHERE id = ?",
			[messageId]
		);

		if (rows.length === 0) {
			throw new Error("MESSAGE_NOT_FOUND");
		}

		throw new Error("MESSAGE_FORBIDDEN");
	}
	finally {
		await connection.end();
	}
}


export async function patchMessageByIdService(messageId: number, userId: number, content: string): Promise<void> {
	if (typeof content !== "string" || content.trim() === "") {
		throw new Error("INVALID_MESSAGE_CONTENT");
	}

	const connection = await mysql.createConnection(config.database);

	try {
		const [result]: any = await connection.query(
			`
			UPDATE messages
			SET content = ?
			WHERE id = ? AND sender_id = ?
			`,
			[content, messageId, userId]
		);

		if (result.affectedRows === 1) {
			return;
		}

		const [rows]: any = await connection.query(
			"SELECT id FROM messages WHERE id = ?",
			[messageId]
		);

		if (rows.length === 0) {
			throw new Error("MESSAGE_NOT_FOUND");
		}

		throw new Error("MESSAGE_FORBIDDEN");
	}
	finally {
		await connection.end();
	}
}
