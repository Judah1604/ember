import { cookies } from "next/headers";

export async function setSessionCookie ( sessionToken, expiresAt ) {
	const cookieStore = await cookies();

	cookieStore.set("session", sessionToken, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		path: "/",
		expires: expiresAt,
	});
}

