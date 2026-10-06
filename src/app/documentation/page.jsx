'use client'

import "@/app/styles/dashboard.css";
import SideBar from "@/components/SideBar";

function page() {
	return (
		<div className="dashboard">
			<SideBar />
			<div className="main docs">
                <div className="header">
                    <h1>Documentation</h1>
                </div>
				<section className="docs-section">
					<h2>How Embers Are Calculated</h2>

					<p>
						Embers are Ember’s activity score. Each connected
						platform contributes Embers based on measurable
						activity, and the scores are combined into a total.
					</p>

					<h3>GitHub</h3>

					<p>GitHub activity is measured through commits.</p>

					<p>
						<strong>1 commit = 1 Ember</strong>
					</p>

					<p>For example:</p>

					<ul>
						<li>5 commits → 5 Embers</li>
						<li>30 commits → 30 Embers</li>
					</ul>

					<p>
						GitHub activity is grouped by repository and calendar
						day, so repeated push events for the same repository on
						the same day are combined into a single activity record.
					</p>

					<h3>LeetCode</h3>

					<p>LeetCode problems are weighted based on difficulty.</p>

					<table>
						
						<tbody>
							<tr>
								<td>Easy</td>
								<td>2</td>
							</tr>
							<tr>
								<td>Medium</td>
								<td>4</td>
							</tr>
							<tr>
								<td>Hard</td>
								<td>6</td>
							</tr>
						</tbody>
					</table>

					<p>For example:</p>

					<ul>
						<li>3 Easy problems → 6 Embers</li>
						<li>2 Medium problems → 8 Embers</li>
						<li>1 Hard problem → 6 Embers</li>
					</ul>

					<p>
						<strong>Total: 20 Embers</strong>
					</p>

					<h3>Hackatime</h3>

					<p>
						Hackatime measures coding time in seconds. Ember
						converts this into hours and awards{" "}
						<strong>2 Embers per hour</strong>.
					</p>

					<p>
						<strong>2 Embers = 1 hour of coding</strong>
					</p>

					<p>For example:</p>

					<ul>
						<li>1 hour → 2 Embers</li>
						<li>10 hours → 20 Embers</li>
						<li>25.5 hours → 51 Embers</li>
					</ul>

					<p>
						Only whole Embers are stored, so the calculated score is
						rounded down.
					</p>

					<h3>Total Embers</h3>

					<p>
						A user’s total score is the sum of the contributions
						from all three platforms:
					</p>

					<p>
						<strong>
							Total Embers = GitHub Embers + LeetCode Embers +
							Hackatime Embers
						</strong>
					</p>

					<p>For example:</p>

					<table>
						<tbody>
							<tr>
								<td>GitHub</td>
								<td>30</td>
							</tr>
							<tr>
								<td>LeetCode</td>
								<td>20</td>
							</tr>
							<tr>
								<td>Hackatime</td>
								<td>51</td>
							</tr>
							<tr>
								<td>
									<strong>Total</strong>
								</td>
								<td>
									<strong>101</strong>
								</td>
							</tr>
						</tbody>
					</table>

					<p>
						Users do not need to connect every platform. A platform
						that is not connected simply contributes{" "}
						<strong>0 Embers</strong>.
					</p>

					<h3>Ranking Periods</h3>

					<p>Ember calculates scores over three periods:</p>

					<ul>
						<li>Last 24 hours</li>
						<li>Last 7 days</li>
						<li>Last 30 days</li>
					</ul>

					<p>
						The leaderboard ranks users by their total Embers for
						the selected period. Platform-specific leaderboards use
						only the score contributed by that platform.
					</p>
				</section>
			</div>
		</div>
	);
}

export default page;
