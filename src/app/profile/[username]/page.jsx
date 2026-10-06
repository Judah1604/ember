"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { ClimbingBoxLoader } from "react-spinners";
import SideBar from "@/components/SideBar";
import { useParams } from "next/navigation";
import "@/app/styles/dashboard.css";
import { timeAgo } from "@/scripts/dateAndTime";

function page() {
	const [isLoading, setIsLoading] = useState(true);
	const [userId, setUserId] = useState();
	const [foundUser, setFoundUser] = useState(true);
	const [activity, setActivity] = useState([]);
	const [githubInfo, setGithubInfo] = useState({
		activity: [],
        username: '',
		commitsNo: 0,
		reposNo: 0,
	});
	const [hackatimeInfo, setHackatimeInfo] = useState({
		hours: 0,
		totalHours: 0,
		streak: 0,
		mostActiveProject: "",
	});
	const [leetcodeInfo, setLeetcodeInfo] = useState({
		activity: [],
        username: '',
		ranking: 0,
		totalProblemsSolved: 0,
		easyProblems: 0,
		mediumProblems: 0,
		hardProblems: 0,
	});
	const params = useParams();
	const username = params.username;

	useEffect(() => {
		async function getUser() {
			const { data, error } = await supabase
				.from("users")
				.select("id")
				.ilike("username", username)
				.maybeSingle();

			if (error) {
				console.error(error);
				return;
			}

			if (data) {
				setUserId(data?.id ?? null);
			} else {
				setFoundUser(false);
				return;
			}
		}
		getUser();
	}, []);

	useEffect(() => {
		if (!userId) return;
		console.log("User ID:", userId);

		async function checkUser() {
			const { data: platformUserData, error: platusererr } =
				await supabase
					.from("platform_accounts")
					.select("*")
					.eq("user_id", userId);

			if (platusererr) {
				console.error(platusererr);
			}

			if (!platformUserData) {
				setFoundUser(false);
			}
		}

		async function fetchGithubInfo() {
			const { data: platformUserData, error: platusererr } =
				await supabase
					.from("platform_accounts")
					.select("*")
					.eq("user_id", userId)
					.eq("platform", "github");

			if (platusererr) {
				console.error(platusererr);
			}

			if (!platformUserData) {
				setGithubInfo((prev) => ({
					...prev,
					commitsNo: 0,
					reposNo: 0,
				}));
			}

			// get github stats

			const { data: githubStats, error: gitError } = await supabase
				.from("github_stats")
				.select("*")
				.eq("user_id", userId)
				.maybeSingle();

			if (gitError) {
				console.error(gitError);
			}

			if (!githubStats) {
				setGithubInfo((prev) => ({
					...prev,
					commitsNo: 0,
					reposNo: 0,
				}));
			} else {
				setGithubInfo((prev) => ({
					...prev,
                    username: githubStats?.username ?? '',
					commitsNo: githubStats?.commits ?? 0,
					reposNo: githubStats?.reponos ?? 0,
				}));
			}

			// get github activity

			const { data: githubActivity, error: githubActError } =
				await supabase
					.from("activity_log")
					.select("*")
					.eq("user_id", userId)
					.eq("platform", "Github")
					.limit(10)
					.order("date", { ascending: false });

			if (githubActError) {
				console.error(githubActError);
			}

			setGithubInfo((prev) => ({
				...prev,
				activity: githubActivity ?? [],
			}));
			setActivity(githubActivity ?? []);
		}

		async function fetchHackInfo() {
			const { data: platformUserData, error: platusererr } =
				await supabase
					.from("platform_accounts")
					.select("*")
					.eq("user_id", userId)
					.eq("platform", "hackatime");

			if (platusererr) {
				console.error(platusererr);
			}

			if (!platformUserData) {
				setHackatimeInfo((prev) => ({
					...prev,
					hours: 0,
					totalHours: 0,
					streak: 0,
					mostActiveProject: "",
				}));
			} else {
				// get hackatime stats

				const { data: hackStats, error: hackError } = await supabase
					.from("hackatime_stats")
					.select("*")
					.eq("user_id", userId)
					.maybeSingle();

				if (hackError) {
					console.error(hackError);
				}

				if (hackStats) {
					setHackatimeInfo((prev) => ({
						...prev,
						hours: Number(hackStats?.hours30) ?? 0,
						totalHours: Number(hackStats?.hours60) ?? 0,
						streak: Number(hackStats?.streak) ?? 0,
						mostActiveProject: hackStats?.most_active_project ?? "",
					}));
				} else {
					setHackatimeInfo((prev) => ({
						...prev,
						hours: 0,
						totalHours: 0,
						streak: 0,
						mostActiveProject: "",
					}));
				}
			}
		}
		async function fetchLeetInfo() {
			const { data: platformUserData, error: platusererr } =
				await supabase
					.from("platform_accounts")
					.select("*")
					.eq("user_id", userId)
					.eq("platform", "leetcode");

			if (platusererr) {
				console.error(platusererr);
			}

			if (!platformUserData) {
				setLeetcodeInfo((prev) => ({
					...prev,
					activity: [],
					ranking: 0,
					totalProblemsSolved: 0,
					easyProblems: 0,
					mediumProblems: 0,
					hardProblems: 0,
				}));
			} else {
				// get leetcode stats

				const { data: leetStats, error: leetError } = await supabase
					.from("leetcode_stats")
					.select("*")
					.eq("user_id", userId)
					.maybeSingle();

				if (leetError) {
					console.error(leetError);
				}

				if (leetStats) {
					setLeetcodeInfo((prev) => ({
						...prev,
						username: leetStats?.username ?? "",
						ranking: leetStats?.ranking ?? 0,
						totalProblemsSolved:
							leetStats?.total_problems_solved ?? 0,
						easyProblems: leetStats?.easyproblems ?? 0,
						mediumProblems: leetStats?.mediumproblems ?? 0,
						hardProblems: leetStats?.hardproblems ?? 0,
					}));
				} else {
					setLeetcodeInfo((prev) => ({
						...prev,
						activity: [],
						ranking: 0,
						totalProblemsSolved: 0,
						easyProblems: 0,
						mediumProblems: 0,
						hardProblems: 0,
					}));
				}
			}
		}

		async function load() {
			try {
				await checkUser();
				await fetchGithubInfo();
				await fetchHackInfo();
				await fetchLeetInfo();
			} finally {
				setIsLoading(false);
			}
		}

		load();
	}, [userId]);

	return (
		<>
			<div className="dashboard">
				<SideBar />
				{!foundUser ? (
					<div className="text-center mt-4">
						User hasn't connected any platform to display yet or
						doesn't exist.
					</div>
				) : (
					<div className="main">
						<div className="header">
							<h1>
								{username === "" ? (
									"Loading..."
								) : (
									<div>
										<span className="capitalize">
											{username}
										</span>
									</div>
								)}
							</h1>
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
									Loading your user data...
								</div>
							) : (
								<div className="panels">
									<div className="col1">
                                    <div className="panel general user">
											<div className="info">
												<h1>
													{hackatimeInfo.totalHours >
													0
														? `${Math.floor(hackatimeInfo.totalHours / 3600)} hrs ${Math.floor((hackatimeInfo.totalHours % 3600) / 60)} min`
														: "0 hrs 0 min"}{" "}
												</h1>
												<p>Tracked the last 60 days</p>
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
														.map(
															(
																activity,
																index,
															) => (
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
																		{activity.subject
																			.replace(
																				`${githubInfo.username}`,
																				"",
																			)
																			.replace(
																				`/`,
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
															),
														)
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
													{githubInfo.commitsNo}{" "}
													commits (past 30 days)
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
				)}
			</div>
		</>
	);
}

export default page;
