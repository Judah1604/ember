"use server";
import bcrypt from "bcryptjs";
import { supabase } from "@/lib/supabase";
import { redirect } from "next/navigation";
import { createSession } from "@/lib/createSession";

export async function signupAction(formData) {
	const passwordHash = await bcrypt.hash(formData.password, 10);
	const { data, error } = await supabase
		.from("users")
		.insert({
			username: formData.username,
			email: formData.email,
			password_hash: passwordHash,
		})
		.select("id")
		.single();

	if (error) {
		console.log("Error inserting", error);
	} else {
		console.log("Inserted", data);
	}

    await createSession(data.id)
	redirect("/dashboard");
}

export default signupAction;
