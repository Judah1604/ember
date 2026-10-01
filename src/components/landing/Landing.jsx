import "./landing.css";

function Landing() {
	return (
		<div className="max-w wrapper">
			<div className="landing container">
				<div className="header">
                    <img src="/logo.svg" alt="Ember" />
					<h1>Your streak doesn't lie.</h1>
					<p>
						Ember pulls your GitHub, LeetCode, and Hackatime
						activity into one place, so the group can see who's
						actually grinding and who's just talking about it.
					</p>
				</div>
				<div className="how-it-works">
					<ol>
						<li>
							<span>Connect your accounts:</span>
							GitHub, LeetCode, Hackatime. Takes a minute.
						</li>
						<li>
							<span>We sync daily:</span>
							your activity gets pulled in automatically, no
							manual tracking.
						</li>
						<li>
							<span>See where you stand:</span>
							one score, one leaderboard, nowhere to hide.
						</li>
					</ol>
				</div>
				<div className="btns">
					<a href="/signup" className="btn btn-primary">Get Started</a>
					<a href="/login" className="btn btn-secondary">Log In</a>
				</div>
			</div>
		</div>
	);
}

export default Landing;
