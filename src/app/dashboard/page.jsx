"use client";
import { getCurrentUser } from "@/scripts/getCurrentUser";
import React, { useEffect, useState } from "react";
import "./dashboard.css";
import SideBar from "./SideBar";

function page() {
	const [userId, setUserId] = useState();

	useEffect(() => {
		async function getUser() {
			const user = await getCurrentUser();
			setUserId(user);
		}

		getUser();
	}, []);

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
										<span
											className="trans"
											onClick={connectGithub}
										>
											Connect
										</span>
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
									<div className="log">
										<div className="text">
											Pushed 4 commits to dev-tracker —{" "}
											<span>2 hrs ago</span>
										</div>
										<img
											src="/platforms/github.png"
											alt="Github"
										/>
									</div>
									<div className="log">
										<div className="text">
											Pushed 4 commits to dev-tracker —{" "}
											<span>2 hrs ago</span>
										</div>
										<img
											src="/platforms/github.png"
											alt="Github"
										/>
									</div>
									<div className="log">
										<div className="text">
											Pushed 4 commits to dev-tracker —{" "}
											<span>2 hrs ago</span>
										</div>
										<img
											src="/platforms/github.png"
											alt="Github"
										/>
									</div>
									<div className="log">
										<div className="text">
											Pushed 4 commits to dev-tracker —{" "}
											<span>2 hrs ago</span>
										</div>
										<img
											src="/platforms/github.png"
											alt="Github"
										/>
									</div>
									<div className="log">
										<div className="text">
											Pushed 4 commits to dev-tracker —{" "}
											<span>2 hrs ago</span>
										</div>
										<img
											src="/platforms/github.png"
											alt="Github"
										/>
									</div>
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
										47 commits
									</div>
									<div className="item">
										<img
											src="/icons/repo.svg"
											alt="Repo count"
										/>
										8 repositories
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
