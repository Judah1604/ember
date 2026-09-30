"use server";

import { cookies } from "next/headers";
import { supabase } from "@/lib/supabase";
import { redirect } from "next/navigation";
import hashToken from "./hashToken";

export async function getCurrentUser() {
	const cookieStore = await cookies();
	const sessionCookie = cookieStore.get("session")?.value;

	if (!sessionCookie) {
		redirect("/login");
	}
	const hashedCookie = hashToken(sessionCookie)

	const { data: session, error } = await supabase
		.from("sessions")
		.select("*")
		.eq("session_token", hashedCookie)
		.single();

	if (error) {
		console.error(error);
	}

	if (!session || new Date(session.expiry) < new Date()) {
		redirect("/login");
	}

	return session.user_id;
}
