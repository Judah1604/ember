"use client";
import { useEffect, useState } from "react";
import SideBar from "../dashboard/SideBar";
import "@/app/styles/dashboard.css";
import { supabase } from "@/lib/supabase";
import { getCurrentUser } from "@/scripts/getCurrentUser";
import "./leaderboards.css";
import { getStoredRankings } from "../scripts/rankingEmbers";

function page() {
	const [userId, setUserId] = useState();
	const [username, setUsername] = useState("");
	const [rankings, setRankings] = useState([]);
	const [filteredRankings, setFilteredRankings] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [selected, setSelected] = useState("1d");

	useEffect(() => {
		async function getUser() {
			const user = await getCurrentUser();
			setUserId(user);

			await getUsername(user);
		}

		async function getUsername(userId) {
			const { data, error } = await supabase
				.from("users")
				.select("username")
				.eq("id", userId)
				.single();

			if (error) {
				console.error(error);
			}
			setUsername(data.username);
		}

		getUser();
	}, []);

	useEffect(() => {
		setFilteredRankings((prev) =>
			prev.filter((r) => r.period === selected),
		);
	}, [selected]);

	useEffect(() => {
		if (!userId) return;
		console.log("User ID:", userId);

		async function load() {
			try {
				const fetchedRankings = await getStoredRankings();
				setRankings(fetchedRankings);
			} finally {
				setIsLoading(false);
			}
		}

		load();
	}, [userId]);

	return (
		<div className="dashboard">
			<SideBar />
			<div className="main leaderboard">
				<div className="header">
					<h1>Leaderboards</h1>
					<p>here are the rankings...</p>
				</div>
				<div className="top mt-4">
					<div className="filters">
						<div className="period">
							<div
								className={
									selected === "1d" ? "item active" : "item"
								}
								onClick={() => setSelected("1d")}
							>
								Last 24 hours
							</div>
							<div
								className={
									selected === "7d" ? "item active" : "item"
								}
								onClick={() => setSelected("7d")}
							>
								Last 7 days
							</div>
							<div
								className={
									selected === "30d" ? "item active" : "item"
								}
								onClick={() => setSelected("30d")}
							>
								Last 30 days
							</div>
						</div>
						<div className="platform">
							<select
								name="plaftorm select"
								className="form-select"
							>
								<option value="All">All</option>
								<option value="Github">Github</option>
								<option value="Hackatime">Hackatime</option>
								<option value="Leetcode">Leetcode</option>
							</select>
						</div>
					</div>

					<div className="desc">
						<img src="/icons/ember.svg" alt="Ember" />
						<span>= embers</span>
					</div>
				</div>
				<div className="board mt-3">
					{isLoading && rankings.length > 0 ? (
						<div className="loader">
							<div className="contain">
								<ClimbingBoxLoader
									color="#f54927"
									size={16}
									speedMultiplier={1.3}
								/>
							</div>
							Loading your data...
						</div>
					) : (
						rankings.map((item, index) => (
							<div
								className={
									item.user_id === userId
										? "item active"
										: "item"
								}
								key={index}
							>
								<div className="count">{index + 1}</div>
								<div className="text">
									<span className="name">
										{item.username}
									</span>

									<div className="score">
										<div className="content">
											{item.totalScore}
										</div>
										<img
											src="/icons/ember.svg"
											alt="Ember"
										/>
									</div>
								</div>
							</div>
						))
					)}
				</div>
			</div>
		</div>
	);
}

export default page;
