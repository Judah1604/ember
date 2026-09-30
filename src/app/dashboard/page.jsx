"use client";
import { getCurrentUser } from "@/scripts/getCurrentUser";
import React, { useEffect, useState } from "react";

function page() {
	const [userId, setUserId] = useState();

	useEffect(() => {
		async function getUser() {
			const user = await getCurrentUser();

			setUserId(user);
			console.log(user);
		}

		getUser();
	}, []);

	return <div>page</div>;
}

export default page;
