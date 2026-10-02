"use client";
import { getCurrentUser } from "@/scripts/getCurrentUser";
import React, { useEffect, useState } from "react";
import SideBar from "./SideBar";
import { supabase } from "@/lib/supabase";
import "./dashboard.css";

function page() {
	const [userId, setUserId] = useState();
	const [activity, setActivity] = useState([]);
	const [githubInfo, setGithubInfo] = useState({
		activity: [],
		username: "",
		commitsNo: 0,
		reposNo: 0,
	});

	function timeAgo(date) {
		const seconds = Math.floor(
			(Date.now() - new Date(date).getTime()) / 1000,
		);

		if (seconds < 60) {
			return `${seconds}s ago`;
		}

		const minutes = Math.floor(seconds / 60);

		if (minutes < 60) {
			return `${minutes}m ago`;
		}

		const hours = Math.floor(minutes / 60);

		if (hours < 24) {
			return `${hours}h ago`;
		}

		const days = Math.floor(hours / 24);

		if (days < 30) {
			return `${days}d ago`;
		}

		const months = Math.floor(days / 30);

		if (months < 12) {
			return `${months}mo ago`;
		}

		const years = Math.floor(days / 365);

		return `${years}y ago`;
	}

	useEffect(() => {
		async function getUser() {
			const user = await getCurrentUser();
			setUserId(user);
		}

		getUser();
	}, []);

	useEffect(() => {
		if (!userId) return;
		console.log("User ID:", userId);
		async function updateGithubInfo() {
			const { data: platformUserData, error } = await supabase
				.from("platform_accounts")
				.select("*")
				.eq("user_id", userId)
				.eq("platform", "github")
				.maybeSingle();

			if (error) {
				console.error(error);
			}

			if (!platformUserData) {
				setGithubInfo((prev) => ({
					...prev,
					username: "",
					commitsNo: 0,
					reposNo: 0,
				}));
			} else {
				setGithubInfo((prev) => ({
					...prev,
					username: platformUserData.platform_username,
				}));
				const res = await fetch(
					`https://api.github.com/users/${platformUserData.platform_username}/events`,
					{
						headers: {
							Authorization: `Bearer ${platformUserData.access_token}`,
							Accept: "application/vnd.github+json",
						},
					},
				);

				const userRes = await fetch(`https://api.github.com/user`, {
					headers: {
						Authorization: `Bearer ${platformUserData.access_token}`,
						Accept: "application/vnd.github+json",
					},
				});
				const userData = await userRes.json();
				setGithubInfo((prev) => ({
					...prev,
					reposNo: userData.public_repos,
				}));

				const githubActivity = await res.json();

				const filtered = githubActivity.filter(
					(activity) =>
						activity.type === "PushEvent" ||
						activity.type === "CreateEvent",
				);
				const logs = [];

				for (let index = 0; index < filtered.length; index++) {
					const element = filtered[index];

					if (element.type === "PushEvent") {
						const before = element.payload.before,
							head = element.payload.head;

						const response = await fetch(
							`https://api.github.com/repos/${element.repo.name}/compare/${before}...${head}`,
							{
								headers: {
									Authorization: `Bearer ${platformUserData.access_token}`,
									Accept: "application/vnd.github+json",
								},
							},
						);

						const info = await response.json(),
							commitCount = info.total_commits;

						logs.push({
							action: element.type,
							user_id: userId,
							subject: element.repo.name,
							commit_count: commitCount,
							platform: "Github",
							date: element.created_at,
						});
					} else {
						logs.push({
							action: element.type,
							user_id: userId,
							subject: element.repo.name,
							platform: "Github",
							date: element.created_at,
						});
					}
				}

				const map = [];
				let commitCount = 0;

				for (const item of logs) {
					const prev = map[map.length - 1];

					if (
						prev &&
						prev.subject === item.subject &&
						prev.action === "PushEvent" &&
						item.action === "PushEvent"
					) {
						prev.commit_count += item.commit_count ?? 0;
					} else {
						map.push({
							...item,
						});
					}

					commitCount += item.commit_count ?? 0;
				}
				setGithubInfo((prev) => ({ ...prev, commitsNo: commitCount }));

				if (map.length === 0) return;

				const { data: existingLogs, error } = await supabase
					.from("activity_log")
					.select("date, action, subject")
					.eq("user_id", userId);

				if (error) {
					console.error(error);
					return;
				}

				const newLogs = map.filter(
					(item) =>
						!existingLogs.some(
							(existing) =>
								existing.date === item.date &&
								existing.action === item.action &&
								existing.subject === item.subject,
						),
				);

				if (newLogs.length > 0) {
					const { data, error } = await supabase
						.from("activity_log")
						.insert(newLogs)
						.select();

					if (error) {
						console.error(error);
					}
				}
			}
		}

		async function updateGithubActivity() {
			const { data: activityData, error } = await supabase
				.from("activity_log")
				.select("*")
				.eq("user_id", userId)
				.order("date", { ascending: false });

			if (error) {
				console.error(error);
			}

			setGithubInfo((prev) => ({
				...prev,
				activity: activityData ?? [],
			}));
			setActivity(activityData ?? []);
		}

		async function load() {
			await updateGithubInfo();
			await updateGithubActivity();
		}

		load();
	}, [userId]);

	function connectGithub() {
		window.location.href = "/api/github/authorize";
	}

	return (
		<div className="dashboard">
			<SideBar />
			<div className="main">
				<div className="header">
					<h1>Good evening, Judah.</h1>
					<p>Here’s your development activity at a glance.</p>
				</div>
				<div className="overall-activity">
					<h3>Overall Activity</h3>
					<div className="panels">
						<div className="col1">
							<div className="panel general">
								<div className="info">
									<h1>127 hrs 34 min</h1>
									<p>Tracked this month</p>
								</div>
								<div className="connected">
									<div className="item">
										<img
											src="/platforms/github.png"
											alt="Github"
										/>
										<span className="thick">Github:</span>{" "}
										{githubInfo.username === "" ? (
											<span
												className="trans"
												onClick={connectGithub}
											>
												Connect
											</span>
										) : (
											<span>@{githubInfo.username}</span>
										)}
									</div>
									<div className="item">
										<img
											src="/platforms/hackatime.png"
											alt="Hackatime"
										/>
										<span className="thick">
											Hackatime:
										</span>{" "}
										<span className="trans">Connect</span>
									</div>
									<div className="item">
										<img
											src="/platforms/leetcode.png"
											alt="Leetcode"
										/>
										<span className="thick">Leetcode:</span>{" "}
										<span className="trans">Connect</span>
									</div>
								</div>
							</div>
							<div className="panel recent-activity">
								<h4>Recent Activity</h4>
								<div className="logs">
									{activity.length === 0 ? (
										<div>
											No recent activity to display.
										</div>
									) : (
										activity.map((activity, index) => (
											<div className="log" key={index}>
												<div className="text">
													{activity.action ===
													"PushEvent"
														? "Pushed"
														: "Created"}{" "}
													{activity.action ===
														"PushEvent" &&
														activity.commit_count +
															" commits to"}{" "}
													{activity.subject.replace(
														`${githubInfo.username}/`,
														"",
													)}
													—
													<span>
														{" "}
														{timeAgo(activity.date)}
													</span>
												</div>
												<img
													src={`/platforms/${activity.platform.toLowerCase()}.png`}
													alt={activity.platform}
												/>
											</div>
										))
									)}
								</div>
							</div>
						</div>
						<div className="col2">
							<div className="panel platform-info">
								<div className="name">
									<img
										src="/platforms/github.png"
										alt="Github"
									/>
									Github
								</div>
								<div className="items">
									<div className="item">
										<img
											src="/icons/branch.svg"
											alt="Commit count"
										/>
										{githubInfo.commitsNo} commits (past 30
										days)
									</div>
									<div className="item">
										<img
											src="/icons/repo.svg"
											alt="Repo count"
										/>
										{githubInfo.reposNo} repositories
									</div>
									<div className="item">
										<img
											src="/icons/streak.svg"
											alt="streak count"
										/>
										Current streak: 9 days
									</div>
								</div>
							</div>
							<div className="panel platform-info">
								<div className="name">
									<img
										src="/platforms/hackatime.png"
										alt="Hackatime"
									/>
									Hackatime
								</div>
								<div className="items">
									<div className="item">
										<img
											src="/icons/clock.svg"
											alt="Clock"
										/>
										47 hrs 12 min
									</div>

									<div className="item">
										<img
											src="/icons/streak.svg"
											alt="streak count"
										/>
										Current streak: 6 days
									</div>
									<div className="item">
										<img src="/icons/star.svg" alt="star" />
										<p>
											<span>Most active project: </span>
											tracker
										</p>
									</div>
								</div>
							</div>
							<div className="panel platform-info">
								<div className="name">
									<img
										src="/platforms/leetcode.png"
										alt="Leetcode"
									/>
									Leetcode
								</div>
								<div className="items">
									<div className="item">
										<img
											src="/icons/activity.svg"
											alt="Activity"
										/>
										82 problems solved
									</div>
									<div className="item">
										<img
											src="/icons/activity.svg"
											alt="Activity"
										/>
										<div className="categories">
											<div className="item">
												<span>61</span>Easy
											</div>
											<div className="item">
												<span>19</span>Medium
											</div>
											<div className="item">
												<span>2</span>Hard
											</div>
										</div>
									</div>
									<div className="item">
										<img
											src="/icons/streak.svg"
											alt="streak count"
										/>
										Current streak: 22 days
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default page;
