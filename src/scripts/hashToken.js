import crypto from "node:crypto";

export default function hashToken(token) {
	return crypto.createHash("sha256").update(token).digest("hex");
}
