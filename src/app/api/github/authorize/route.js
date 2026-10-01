import { NextResponse } from "next/server";

export async function GET() {
	const githubUrl = new URL("https://github.com/login/oauth/authorize");

	githubUrl.searchParams.set("client_id", process.env.GITHUB_CLIENT_ID);

	githubUrl.searchParams.set(
		"redirect_uri",
		"http://localhost:3000/api/github/callback",
	);

	githubUrl.searchParams.set("scope", "read:user");

	return NextResponse.redirect(githubUrl);
}
