import { getCurrentUser } from "@/scripts/getCurrentUser";

export async function getUser({setUserId}) {
	const user = await getCurrentUser();
	setUserId(user);
}
