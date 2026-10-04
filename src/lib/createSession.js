// lib/createSession.js
"use server";

import { supabase } from "@/lib/supabase";
import generateSessionToken from "@/scripts/generateSessionToken";
import hashToken from "@/scripts/hashToken";
import { setSessionCookie } from "./setSessionCookie";

export async function createSession(userId) {
	const sessionToken = generateSessionToken();
	const tokenHash = hashToken(sessionToken);
	const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);

	const { data: session, error } = await supabase
		.from("sessions")
		.insert({
			user_id: userId,
			session_token: tokenHash,
			expiry: expiresAt,
		})
		.select()
		.single();

	if (error) {
		throw error;
	}

	await setSessionCookie(sessionToken, expiresAt);

	return session;
}

// lib/createSession.js
("use server");

import { supabase } from "@/lib/supabase";
import generateSessionToken from "@/scripts/generateSessionToken";
import hashToken from "@/scripts/hashToken";
import { setSessionCookie } from "./setSessionCookie";

export async function createSession(userId) {
	const sessionToken = generateSessionToken();
	const tokenHash = hashToken(sessionToken);
	const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);

	const { data: session, error } = await supabase
		.from("sessions")
		.select("*")
		.eq("user_id", userId)
		.single();

	if (error) {
		throw error;
	}
	if (!session || !session.expiry < new Date.now()) {
		const { data: newSession, error: newErr } = await supabase
			.from("sessions")
			.insert({
				user_id: userId,
				session_token: tokenHash,
				expiry: expiresAt,
			})
			.select()
			.single();

		if (newErr) {
			console.error(newErr);
		}
	}
	// } else if (session.expiry > new Date.now()) {
	//     const {error: deleteErr} = await supabase.from('sessions').delete()
	// }

	await setSessionCookie(sessionToken, expiresAt);

	return session;
}
