import { NextResponse } from "next/server";

export async function GET(request) {
	const { searchParams } = new URL(request.url);

	const code = searchParams.get("code");

	console.log("GitHub code:", code);

	return NextResponse.redirect(new URL("/dashboard", request.url));
}
