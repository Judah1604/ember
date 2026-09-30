"use server";
import bcrypt from "bcryptjs";
import { supabase } from "@/lib/supabase";
import { redirect } from "next/navigation";
import { createSession } from "@/lib/createSession";

export async function loginAction(formData) {
	const { data: user, error } = await supabase
		.from("users")
		.select("*")
		.or(
			`username.eq.${formData.username_email},email.eq.${formData.username_email}`,
		)
		.single();

	if (error || !user) {
		return {
			success: false,
			error: "Username or email is incorrect",
		};
	}

	const isMatch = await bcrypt.compare(formData.password, user.password_hash);
	console.log("IS MATCH", isMatch);

	if (!isMatch) {
		return {
			success: false,
			error: "Password is incorrect",
		};
	}

	await createSession(user.id);
	redirect("/dashboard");
}

export default loginAction;
