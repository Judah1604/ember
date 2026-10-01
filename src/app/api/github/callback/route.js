import { supabase } from "@/lib/supabase";
import { getCurrentUser } from "@/scripts/getCurrentUser";
import { NextResponse } from "next/server";

export async function GET(request) {
	const { searchParams } = new URL(request.url);

	const code = searchParams.get("code");

	const response = await fetch(
		"https://github.com/login/oauth/access_token",
		{
			method: "POST",
			headers: {
				Accept: "application/json",
			},
			body: new URLSearchParams({
				client_id: process.env.GITHUB_CLIENT_ID,
				client_secret: process.env.GITHUB_CLIENT_SECRET,
				code: code,
			}),
		},
	);

	const tokenData = await response.json(),
		accessToken = tokenData.access_token;

	const res = await fetch("https://api.github.com/user", {
		headers: {
			Authorization: `Bearer ${accessToken}`,
			Accept: "application/vnd.github+json",
		},
	});

	const githubUser = await res.json();

	const userId = await getCurrentUser();

	const { data, error } = await supabase
		.from("platform_accounts")
		.insert({
			user_id: userId,
			platform: "github",
			platform_username: githubUser.login,
			access_token: accessToken,
		})
		.select();

	if (error) {
		console.error(error);
	}

	return NextResponse.redirect(new URL("/dashboard", request.url));
}
