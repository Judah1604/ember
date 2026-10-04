import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import generateSessionToken from "@/scripts/generateSessionToken";

export async function GET() {
	const redirecturi =
		process.env.NODE_ENV === "development"
			? "http://localhost:3000/api/hackatime/callback"
			: "http://ember-streak.vercel.app/api/hackatime/callback";

	const hackUrl = new URL("https://hackatime.hackclub.com/oauth/authorize");

	hackUrl.searchParams.set("client_id", process.env.HACKATIME_UID);

	hackUrl.searchParams.set("redirect_uri", redirecturi);

	hackUrl.searchParams.set("response_type", "code");
	hackUrl.searchParams.set("scope", "profile read");

	const state = generateSessionToken();
	const cookieStore = await cookies();
	cookieStore.set("hackatime_oauth_state", state, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		maxAge: 60 * 10,
	});

	hackUrl.searchParams.set("state", state);

	return NextResponse.redirect(hackUrl);
}
