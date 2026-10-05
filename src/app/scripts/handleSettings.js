"use server";
import { supabase } from "@/lib/supabase";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function handleSignOut(userId) {
	const cookieStore = await cookies();

	const { error } = await supabase
		.from("platform_accounts")
		.delete()
		.eq("user_id", userId)

	if (error) {
		throw error;
	}

	cookieStore.delete("session");
	redirect("/login");
}

export async function disconnectPlatform(userId, platform) {
	const { error } = await supabase
		.from("platform_accounts")
		.delete()
		.eq("user_id", userId)
		.eq("platform", platform);

	if (error) {
		throw error;
	}
}
