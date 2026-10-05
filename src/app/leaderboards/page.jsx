"use client";
import { useEffect, useState } from "react";
import SideBar from "../dashboard/SideBar";
import "@/app/styles/dashboard.css";
import { supabase } from "@/lib/supabase";
import { getCurrentUser } from "@/scripts/getCurrentUser";
import './leaderboards.css'
import calculateEmbers, { getRankings } from "../scripts/rankingEmbers";

function page() {
	const [userId, setUserId] = useState();
	const [username, setUsername] = useState("");
	const [rankings, setRankings] = useState([]);

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

	// useEffect(() => {
	// 	if (!userId) return;
	// 	console.log("User ID:", userId);

	// 	async function load() {

	// 		const fetchedRankings = await getRankings();
	//         console.log(fetchedRankings)
	//         setRankings(fetchedRankings)
	// 	}

	// 	load();
	// }, [userId]);

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
							<div className="item active">Last 24 hours</div>
							<div className="item">Last 7 days</div>
							<div className="item">Last 30 days</div>
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
					<div className="item">
						<div className="count">1</div>
						<div className="text">
							<span className="name">Judah</span>

							<div className="score">
								<div className="content">301</div>
								<img src="/icons/ember.svg" alt="Ember" />
							</div>
						</div>
					</div>
					<div className="item">
						<div className="count">1</div>
						<div className="text">
							<span className="name">Judah</span>

							<div className="score">
								<div className="content">301</div>
								<img src="/icons/ember.svg" alt="Ember" />
							</div>
						</div>
					</div>
					<div className="item">
						<div className="count">1</div>
						<div className="text">
							<span className="name">Judah</span>

							<div className="score">
								<div className="content">301</div>
								<img src="/icons/ember.svg" alt="Ember" />
							</div>
						</div>
					</div>
					<div className="item">
						<div className="count">1</div>
						<div className="text">
							<span className="name">Judah</span>

							<div className="score">
								<div className="content">301</div>
								<img src="/icons/ember.svg" alt="Ember" />
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default page;
