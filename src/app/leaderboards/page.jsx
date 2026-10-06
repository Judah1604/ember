"use client";
import { useEffect, useState } from "react";
import SideBar from "@/components/SideBar";
import "@/app/styles/dashboard.css";
import { getCurrentUser } from "@/scripts/getCurrentUser";
import "./leaderboards.css";
import { getStoredRankings } from "../scripts/rankingEmbers";
import { getRankings } from "../scripts/getRankings";
import { ClimbingBoxLoader } from "react-spinners";

function page() {
	const [userId, setUserId] = useState();
	const [rankings, setRankings] = useState([]);
	const [filteredRankings, setFilteredRankings] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [selectedPeriod, setSelectedPeriod] = useState("1d");
	const [selectedPlatform, setSelectedPlatform] = useState("All");

	useEffect(() => {
		async function getUser() {
			const user = await getCurrentUser();
			setUserId(user);
		}

		getUser();
	}, []);

	useEffect(() => {
		const periodRankings = rankings.filter(
			(r) => r.period === selectedPeriod,
		);

		let sorted;

		if (selectedPlatform === "Github") {
			sorted = [...periodRankings]
				.sort((a, b) => b.github_score - a.github_score)
				.filter((r) => r.github_score !== 0);
		} else if (selectedPlatform === "Hackatime") {
			sorted = [...periodRankings]
				.sort((a, b) => b.hackatime_score - a.hackatime_score)
				.filter((r) => r.hackatime_score !== 0);
		} else if (selectedPlatform === "Leetcode") {
			sorted = [...periodRankings]
				.sort((a, b) => b.leetcode_score - a.leetcode_score)
				.filter((r) => r.leetcode_score !== 0);
		} else {
			sorted = [...periodRankings]
				.sort((a, b) => b.total_score - a.total_score)
				.filter((r) => r.total_score !== 0);
		}

		setFilteredRankings(sorted);
	}, [selectedPeriod, selectedPlatform, rankings]);

	useEffect(() => {
		if (!userId) return;
		console.log("User ID:", userId);

		async function load() {
			try {
				// await getRankings();
				const fetchedRankings = await getStoredRankings();
				setRankings(fetchedRankings);
			} finally {
				setIsLoading(false);
			}
		}

		load();
	}, [userId]);

	const handleChange = (event) => {
		setSelectedPlatform(event.target.value);
	};

	const getScore = (item) => {
		if (selectedPlatform === "Github") return item.github_score;
		if (selectedPlatform === "Hackatime") return item.hackatime_score;
		if (selectedPlatform === "Leetcode") return item.leetcode_score;

		return item.total_score;
	};

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
									selectedPeriod === "1d"
										? "item active"
										: "item"
								}
								onClick={() => setSelectedPeriod("1d")}
							>
								Last 24 hours
							</div>
							<div
								className={
									selectedPeriod === "7d"
										? "item active"
										: "item"
								}
								onClick={() => setSelectedPeriod("7d")}
							>
								Last 7 days
							</div>
							<div
								className={
									selectedPeriod === "30d"
										? "item active"
										: "item"
								}
								onClick={() => setSelectedPeriod("30d")}
							>
								Last 30 days
							</div>
						</div>
						<div className="platform">
							<select
								name="plaftorm select"
								className="form-select"
								value={selectedPlatform}
								onChange={handleChange}
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
					{isLoading ? (
						<div className="loader">
							<div className="contain">
								<ClimbingBoxLoader
									color="#f54927"
									size={16}
									speedMultiplier={1.3}
								/>
							</div>
							Loading the leaderboard...
						</div>
					) : filteredRankings.length === 0 ? (
						<>
							<div className="mt-3">No data to show...</div>
						</>
					) : (
						filteredRankings.map((item, index) => (
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
									<a
										href={
											item.user_id === userId
												? "/dashboard"
												: `${`/profile/${item.username.toLowerCase()}`}`
										}
										className="name"
									>
										{item.username}
									</a>

									<div className="score">
										<div className="content">
											{getScore(item)}
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
