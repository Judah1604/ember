"use client";
import { useEffect, useState } from "react";
import SideBar from "../dashboard/SideBar";
import "@/app/styles/dashboard.css";
import { calcDays } from "@/scripts/dateAndTime";
import { supabase } from "@/lib/supabase";
import { getUser } from "../scripts/getUser";
import { getCurrentUser } from "@/scripts/getCurrentUser";

function page() {
	const [userId, setUserId] = useState();
	const [username, setUsername] = useState("");

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
		if (!userId) return;
		console.log("User ID:", userId);

		// 1 commit = 1, 1 easy = 2, 1 medium = 4, 1 hard = 6, 1 hour = 2

		async function calculateEmbers(userId, startDate, endDate, params) {
			const { data: activityData, error: activityErr } = await supabase
				.from("activity_log")
				.select("*")
				.eq("user_id", userId)
				.order("date", { ascending: false })
				.gte("date", startDate)
				.lte("date", endDate);

			const { data: platformUserData, error } = await supabase
				.from("platform_accounts")
				.select("*")
				.eq("user_id", userId)
				.eq("platform", "hackatime")
				.maybeSingle();

			if (activityErr) {
				console.error(activityErr);
			}

			if (error) {
				console.error(error);
			}
			const accessToken = platformUserData.access_token;

			const githubData = activityData.filter(
				(activity) => activity.platform === "Github",
			);
			const leetcodeData = activityData.filter(
				(activity) => activity.platform === "Leetcode",
			);

			const githubEmbers = githubData.reduce(
				(total, activity) => total + (activity.commit_count ?? 0),
				0,
			);
			let leetEmbers = 0;

			for (let index = 0; index < leetcodeData.length; index++) {
				const element = leetcodeData[index];

				if (element.difficulty === "Easy") {
					leetEmbers += 2;
				} else if (element.difficulty === "Medium") {
					leetEmbers += 4;
				} else if (element.difficulty === "Hard") {
					leetEmbers += 6;
				}
			}

			const hoursRes = await fetch(
				`https://hackatime.hackclub.com/api/v1/authenticated/hours?${params}`,
				{
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				},
			);

			const hoursData = await hoursRes.json();
			const totalSeconds = hoursData.total_seconds;
			const hackatimeEmbers = Math.floor((totalSeconds / 3600) * 2);
			const totalEmbers = githubEmbers + leetEmbers + hackatimeEmbers;

			return {
				userId: userId,
				github: githubEmbers,
				leetcode: leetEmbers,
				hackatime: hackatimeEmbers,
				totalScore: totalEmbers,
			};
		}

		async function load() {
			const { startDate, endDate, params } = calcDays(30);
			const embers = await calculateEmbers(
				userId,
				startDate,
				endDate,
				params,
			);
			console.log(embers);
		}

		load();
	}, [userId]);

	return (
		<div className="dashboard">
			<SideBar />
			<div className="main">
				<h1>Leaderboard</h1>
			</div>
		</div>
	);
}

export default page;
