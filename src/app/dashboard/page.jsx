"use client";
import { getCurrentUser } from "@/scripts/getCurrentUser";
import React, { useEffect, useState } from "react";
import "./dashboard.css";

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

	return (
		<div className="dashboard">
			<div className="sidebar">
				<h1>Ember</h1>
				<div className="nav-links">
					<a href="/dashboard">Home</a>
				</div>
			</div>
			<div className="main">
				<div className="header">
					<h1>Good evening, Judah.</h1>
					<p>Here’s your development activity at a glance.</p>
				</div>
			</div>
		</div>
	);
}

export default page;
