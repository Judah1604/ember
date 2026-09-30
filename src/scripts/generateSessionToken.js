import crypto from "node:crypto";

export default function generateSessionToken() {
	const bytes = crypto.randomBytes(20),
		token = bytes.toString("base64url");

	return token;
}
