"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { getCurrentUser } from "@/scripts/getCurrentUser";
import fetchLeetcodeActivity from "@/scripts/fetchFromLeetcode";
import { ClimbingBoxLoader } from "react-spinners";
import SideBar from "@/components/SideBar";
import { calcDays, timeAgo } from "@/scripts/dateAndTime";
import "@/app/styles/dashboard.css";

function page() {
	const [isLoading, setIsLoading] = useState(true);
	const [username, setUsername] = useState("");
	const [userId, setUserId] = useState();
	const [activity, setActivity] = useState([]);
	const [githubInfo, setGithubInfo] = useState({
		activity: [],
		username: "",
		commitsNo: 0,
		reposNo: 0,
	});
	const [hackatimeInfo, setHackatimeInfo] = useState({
		username: "",
		hours: 0,
		totalHours: 0,
		streak: 0,
		mostActiveProject: "",
	});
	const [leetcodeInfo, setLeetcodeInfo] = useState({
		activity: [],
		username: "",
		ranking: 0,
		totalProblemsSolved: 0,
		easyProblems: 0,
		mediumProblems: 0,
		hardProblems: 0,
	});

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

		async function updateGithubInfo() {
			const { data: platformUserData, error: platfromErr } =
				await supabase
					.from("platform_accounts")
					.select("*")
					.eq("user_id", userId)
					.eq("platform", "github")
					.maybeSingle();

			const { data: githubStats, error: statsErr } = await supabase
				.from("github_stats")
				.select("*")
				.eq("user_id", userId)
				.maybeSingle();

			if (statsErr) {
				console.error(statsErr);
			}
			if (platfromErr) {
				console.error(platfromErr);
			}

			if (!platformUserData) {
				setGithubInfo((prev) => ({
					...prev,
					username: githubStats?.username ?? "",
					commitsNo: githubStats?.commits ?? 0,
					reposNo: githubStats?.reponos ?? 0,
				}));

				return;
			}

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

			let commitCount = 0;

			const map = {};

			for (const item of logs) {
				const date = item.date.slice(0, 10);

				const key = `${item.user_id}-${item.platform}-${item.action}-${item.subject}-${date}`;

				if (map[key]) {
					map[key].commit_count =
						(map[key].commit_count ?? 0) + (item.commit_count ?? 0);
				} else {
					map[key] = {
						...item,
						date,
					};
				}

				commitCount += item.commit_count ?? 0;
			}

			const uniqueLogs = Object.values(map);

			if (uniqueLogs.length > 0) {
				const { error } = await supabase
					.from("activity_log")
					.upsert(uniqueLogs, {
						onConflict: "user_id,platform,action,subject,date",
					});

				if (error) {
					console.error(error);
					return;
				}
			}

			setGithubInfo((prev) => ({
				...prev,
				username: platformUserData.platform_username,
				commitsNo: commitCount,
				reposNo: userData.public_repos,
			}));

			const { error: newErr } = await supabase
				.from("github_stats")
				.upsert(
					{
						user_id: userId,
						username: platformUserData.platform_username,
						commits: commitCount,
						reponos: userData.public_repos,
					},
					{
						onConflict: "user_id",
					},
				)
				.select();

			if (newErr) {
				console.error(newErr);
			}
		}
		async function updateGithubActivity() {
			const { data: githubActivity, error } = await supabase
				.from("activity_log")
				.select("*")
				.eq("user_id", userId)
				.eq("platform", "Github")
				.order("date", { ascending: false });

			if (error) {
				console.error(error);
			}

			setGithubInfo((prev) => ({
				...prev,
				activity: githubActivity ?? [],
			}));
			setActivity(githubActivity ?? []);
		}
		async function updateHackatimeInfo() {
			const { data: platformUserData, error } = await supabase
				.from("platform_accounts")
				.select("*")
				.eq("user_id", userId)
				.eq("platform", "hackatime")
				.maybeSingle();

			const { data: hackStats, error: statsErr } = await supabase
				.from("hackatime_stats")
				.select("*")
				.eq("user_id", userId)
				.maybeSingle();

			if (error) {
				console.error(error);
			}

			if (statsErr) {
				console.error(statsErr);
			}

			if (!platformUserData) {
				setHackatimeInfo((prev) => ({
					...prev,
					username: hackStats?.username ?? "",
					hours: hackStats?.hours30 ?? 0,
					totalHours: hackStats?.hours60 ?? 0,
					streak: hackStats?.streak ?? 0,
					mostActiveProject: hackStats?.most_active_project ?? "",
				}));

				return;
			}

			const accessToken = platformUserData.access_token;
			const { params: params30 } = calcDays(30);
			const { params: params60 } = calcDays(60);

			const streakRes = await fetch(
				"https://hackatime.hackclub.com/api/v1/authenticated/streak",
				{
					headers: {
						Authorization: `Bearer ${accessToken}`,
						Accept: "application/vnd.github+json",
					},
				},
			);

			const hours30Res = await fetch(
				`https://hackatime.hackclub.com/api/v1/authenticated/hours?${params30}`,
				{
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				},
			);
			const hours60Res = await fetch(
				`https://hackatime.hackclub.com/api/v1/authenticated/hours?${params60}`,
				{
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				},
			);

			const mostActiveProjectRes = await fetch(
				"https://hackatime.hackclub.com/api/v1/authenticated/projects",
				{
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				},
			);

			const streakData = await streakRes.json();
			const hours30Data = await hours30Res.json();
			const hours60Data = await hours60Res.json();
			const mostActiveProjectData = await mostActiveProjectRes.json();
			console.log(mostActiveProjectData.projects[0]);

			const mostActiveProject = mostActiveProjectData.projects.reduce(
				(most, project) =>
					project.total_seconds > most.total_seconds ? project : most,
				mostActiveProjectData.projects[0],
			);

			setHackatimeInfo((prev) => ({
				...prev,
				username: platformUserData.platform_username,
				streak: streakData.streak_days ?? 0,
				hours: hours30Data.total_seconds ?? 0,
				totalHours: hours60Data.total_seconds ?? 0,
				mostActiveProject: mostActiveProject?.name ?? "",
			}));

			const { error: newErr } = await supabase
				.from("hackatime_stats")
				.upsert(
					{
						user_id: userId,
						username: platformUserData.platform_username,
						streak: streakData.streak_days,
						hours30: hours30Data.total_seconds,
						hours60: hours60Data.total_seconds,
						most_active_project: mostActiveProject?.name ?? "",
					},
					{
						onConflict: "user_id",
					},
				);

			if (newErr) {
				console.error(newErr);
			}
		}
		async function updateLeetcodeInfo() {
			if (!userId) return;
			const { data: platformUserData, error } = await supabase
				.from("leetcode_stats")
				.select("*")
				.eq("user_id", userId)
				.maybeSingle();

			if (error) {
				console.error(error);
			}

			if (!platformUserData) {
				setLeetcodeInfo((prev) => ({
					...prev,
					activity: [],
					username: "",
					ranking: 0,
					totalProblemsSolved: 0,
					easyProblems: 0,
					mediumProblems: 0,
					hardProblems: 0,
				}));
			} else {
				setLeetcodeInfo((prev) => ({
					...prev,
					username: platformUserData?.username ?? "",
					ranking: platformUserData?.ranking ?? 0,
					totalProblemsSolved:
						platformUserData?.total_problems_solved ?? 0,
					easyProblems: platformUserData?.easyproblems ?? 0,
					mediumProblems: platformUserData?.mediumproblems ?? 0,
					hardProblems: platformUserData?.hardproblems ?? 0,
				}));
			}
		}
		async function updateLeetcodeActivity() {
			const { data: platformUserData, error: platformError } =
				await supabase
					.from("platform_accounts")
					.select("*")
					.eq("user_id", userId)
					.eq("platform", "leetcode")
					.maybeSingle();

			if (platformError) {
				console.error(platformError);
			}

			if (!platformUserData) {
				setLeetcodeInfo((prev) => ({
					...prev,
					activity: [],
					username: "",
					ranking: 0,
					totalProblemsSolved: 0,
					easyProblems: 0,
					mediumProblems: 0,
					hardProblems: 0,
				}));
			} else {
				let logs = [];
				const leetcodeActivity = await fetchLeetcodeActivity(
					platformUserData?.platform_username,
				);

				for (const activity of leetcodeActivity) {
					logs.push({
						action: "Solved ",
						user_id: userId,
						subject: activity.title,
						difficulty: activity.difficulty,
						platform: "Leetcode",
						date: new Date(activity.timestamp * 1000).toISOString(),
					});
				}

				const { error: upsertError } = await supabase
					.from("activity_log")
					.upsert(logs, {
						onConflict: "user_id,platform,action,subject,date",
						ignoreDuplicates: true,
					});

				if (upsertError) {
					console.error(upsertError);
					return;
				}
			}
		}

		async function updateActivity() {
			const { data, error } = await supabase
				.from("activity_log")
				.select("*")
				.eq("user_id", userId);

			if (error) {
				console.error(error);
				return;
			}

			const sorted = [...data].sort(
				(a, b) => new Date(b.date) - new Date(a.date),
			);

			setActivity(sorted);
		}

		async function load() {
			try {
				updateGithubInfo();
				updateGithubActivity();
				updateHackatimeInfo();
				updateLeetcodeInfo();
				updateLeetcodeActivity();
				updateActivity();
			} finally {
				setIsLoading(false);
			}
		}

		load();
	}, [userId]);

	function connectGithub() {
		window.location.href = "/api/github/authorize";
	}
	function connectHackatime() {
		window.location.href = "/api/hackatime/authorize";
	}
	function connectLeetcode() {
		window.location.href = "/api/leetcode/connect";
	}

	return (
		<>
			<div className="dashboard">
				<SideBar />
				<div className="main">
					<div className="header">
						<h1>
							{username === "" ? (
								"Loading..."
							) : (
								<span>
									Welcome back,{" "}
									<span className="capitalize">
										{username}
									</span>
									.
								</span>
							)}
						</h1>
						<p>Here’s your development activity at a glance.</p>
					</div>
					<div className="overall-activity">
						<h3>Overall Activity</h3>

						{isLoading ? (
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
							<div className="panels">
								<div className="col1">
									<div className="panel general">
										<div className="info">
											<h1>
												{hackatimeInfo.totalHours > 0
													? `${Math.floor(hackatimeInfo.totalHours / 3600)} hrs ${Math.floor((hackatimeInfo.totalHours % 3600) / 60)} min`
													: "0 hrs 0 min"}{" "}
											</h1>
											<p>Tracked the last 60 days</p>
										</div>
										<div className="connected">
											<div className="item">
												<img
													src="/platforms/github.png"
													alt="Github"
												/>
												<span className="thick">
													Github:
												</span>{" "}
												{githubInfo.username === "" ? (
													<span
														className="trans"
														onClick={connectGithub}
													>
														Connect
													</span>
												) : (
													<span>
														@{githubInfo.username}
													</span>
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
												{hackatimeInfo.username ===
												"" ? (
													<span
														className="trans"
														onClick={
															connectHackatime
														}
													>
														Connect
													</span>
												) : (
													<span>
														@
														{hackatimeInfo.username}
													</span>
												)}
											</div>
											<div className="item">
												<img
													src="/platforms/leetcode.png"
													alt="Leetcode"
												/>
												<span className="thick">
													Leetcode:
												</span>{" "}
												{leetcodeInfo.username ===
												"" ? (
													<span
														className="trans"
														onClick={
															connectLeetcode
														}
													>
														Connect
													</span>
												) : (
													<span>
														@{leetcodeInfo.username}
													</span>
												)}
											</div>
										</div>
									</div>
									<div className="panel recent-activity">
										<h4>Recent Activity</h4>
										<div className="logs">
											{activity.length === 0 ? (
												<div>
													No recent activity to
													display.
												</div>
											) : (
												activity
													.slice(0, 10)
													.map((activity, index) => (
														<div
															className="log"
															key={index}
														>
															<div className="text">
																{activity.action ===
																"PushEvent"
																	? "Pushed"
																	: activity.action ===
																		  "CreateEvent"
																		? "Created"
																		: "Solved"}{" "}
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
																	{timeAgo(
																		activity.date,
																	)}
																</span>
															</div>
															<img
																src={`/platforms/${activity.platform.toLowerCase()}.png`}
																alt={
																	activity.platform
																}
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
												{githubInfo.commitsNo} commits
												(past 30 days)
											</div>
											<div className="item">
												<img
													src="/icons/repo.svg"
													alt="Repo count"
												/>
												{githubInfo.reposNo}{" "}
												repositories
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
												{hackatimeInfo.hours > 0
													? `${Math.floor(hackatimeInfo.hours / 3600)} hrs ${Math.floor((hackatimeInfo.hours % 3600) / 60)} min`
													: "0 hrs 0 min"}{" "}
												(in 30 days)
											</div>

											<div className="item">
												<img
													src="/icons/streak.svg"
													alt="streak count"
												/>
												Current streak:{" "}
												{hackatimeInfo.streak} days
											</div>
											<div className="item">
												<img
													src="/icons/star.svg"
													alt="star"
												/>
												<p>
													<span>
														Most active
														project:{" "}
													</span>
													{
														hackatimeInfo.mostActiveProject
													}
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
												{
													leetcodeInfo.totalProblemsSolved
												}{" "}
												problems solved
											</div>
											<div className="item">
												<img
													src="/icons/activity.svg"
													alt="Activity"
												/>
												<div className="categories">
													<div className="item">
														<span>
															{
																leetcodeInfo.easyProblems
															}
														</span>
														Easy
													</div>
													<div className="item">
														<span>
															{
																leetcodeInfo.mediumProblems
															}
														</span>
														Medium
													</div>
													<div className="item">
														<span>
															{
																leetcodeInfo.hardProblems
															}
														</span>
														Hard
													</div>
												</div>
											</div>
											<div className="item">
												<img
													src="/icons/ranking.svg"
													alt="Ranking"
												/>
												Ranking:{" "}
												{Number(
													leetcodeInfo.ranking,
												).toLocaleString()}
											</div>
										</div>
									</div>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</>
	);
}

export default page;
