import { supabase } from "@/lib/supabase";
import { getCurrentUser } from "@/scripts/getCurrentUser";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request) {
	const cookieStore = await cookies();
	const { searchParams } = new URL(request.url);
	const savedState = cookieStore.get("hackatime_oauth_state")?.value;
	const returnedState = searchParams.get("state"); // from the callback URL

	if (!savedState || savedState !== returnedState) {
		return NextResponse.redirect(new URL("/dashboard", request.url));
	}

	const code = searchParams.get("code");
	// console.log("code", code);

	const response = await fetch("https://hackatime.hackclub.com/oauth/token", {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/x-www-form-urlencoded",
		},
		body: new URLSearchParams({
			client_id: process.env.HACKATIME_UID,
			client_secret: process.env.HACKATIME_SECRET,
			code: code,
			redirect_uri: "http://localhost:3000/api/hackatime/callback",
			grant_type: "authorization_code",
		}),
	});

	const tokenData = await response.json(),
		accessToken = tokenData.access_token;

	const res = await fetch(
		"https://hackatime.hackclub.com/api/v1/authenticated/me",
		{
			headers: {
				Authorization: `Bearer ${accessToken}`,
				Accept: "application/vnd.github+json",
			},
		},
	);

	const hackUser = await res.json();

	const userId = await getCurrentUser();

    const { data: platformExists, error } = await supabase
		.from("platform_accounts")
		.select("*")
		.eq("user_id", userId)
		.eq("platform", "hackatime");

	if (error) {
		console.error(error);
	}

	if (platformExists.length === 0) {
		const { data, error } = await supabase
			.from("platform_accounts")
			.insert({
				user_id: userId,
				platform: "hackatime",
				platform_username: hackUser.github_username,
				access_token: accessToken,
			})
			.select();

		if (error) {
			console.error(error);
		}
	} else {
		const { data, error } = await supabase
			.from("platform_accounts")
			.update({
				platform_username: hackUser.github_username,
				access_token: accessToken,
			})
			.eq("user_id", userId)
			.select();

		if (error) {
			console.error(error);
		}
	}

	return NextResponse.redirect(new URL("/dashboard", request.url));
}
