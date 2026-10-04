import { NextResponse } from "next/server";

export async function GET() {
	const githubUrl = new URL("https://github.com/login/oauth/authorize");
	const redirecturi =
		process.env.NODE_ENV === "development"
			? "http://localhost:3000/api/github/callback"
			: "http://ember-streak.vercel.app/api/github/callback";

	githubUrl.searchParams.set("client_id", process.env.GITHUB_CLIENT_ID);

	githubUrl.searchParams.set("redirect_uri", redirecturi);

	githubUrl.searchParams.set("scope", "read:user");

	return NextResponse.redirect(githubUrl);
}
