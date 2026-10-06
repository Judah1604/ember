"use client";
import React, { useEffect, useState } from "react";
import SideBar from "../../components/SideBar";
import "@/app/styles/dashboard.css";
import "../styles/sidepages.css";
import { getCurrentUser } from "@/scripts/getCurrentUser";
import { disconnectPlatform, handleSignOut } from "../scripts/handleSettings";
import { supabase } from "@/lib/supabase";

function page() {
	const [userId, setUserId] = useState();
	const [platforms, setPlatforms] = useState([]);

	useEffect(() => {
		async function getUser() {
			const user = await getCurrentUser();
			setUserId(user);
		}

		getUser();
	}, []);
	useEffect(() => {
		if (!userId) return;
		async function getPlatforms() {
			const { data: platforms, error } = await supabase
				.from("platform_accounts")
				.select("platform")
				.eq("user_id", userId);

			if (error) {
				console.error(error);
				return;
			}

			const trimmed = platforms?.map((element) => element.platform);
			setPlatforms(trimmed);
		}

		getPlatforms();
	}, [userId]);

	return (
		<div className="dashboard">
			<SideBar />
			<div className="main settings">
				<div className="header">
					<h1>Settings</h1>
					<p>Change your tins...</p>
				</div>

				<div className="section mt-4">
					<p>Sign out of your Ember account</p>
					<button
						className="btn btn-primary"
						onClick={() => handleSignOut(userId)}
					>
						Sign out
					</button>
				</div>

				<div className="disconnect">
					<h2>Disconnect your platforms</h2>
					<div className="items">
						{platforms.length === 0 ? (
							<>
								<div>No platform to disconnect...</div>
							</>
						) : (
							platforms.map((platform, index) => (
								<div className="item" key={index}>
									<div className="text">
										<img
											src={`/platforms/${platform}.png`}
											alt={platform}
										/>
										<span>{platform}</span>
									</div>
									<button
										className="btn btn-primary"
										onClick={() =>
											disconnectPlatform(userId, platform)
										}
									>
										Disconnect
									</button>
								</div>
							))
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

export default page;
