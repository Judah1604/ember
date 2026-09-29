import "../styles/authform.css";

function page() {
	return (
		<div className="max-w wrapper">
			<div className="login authform container-sm">
				<div className="header">
					<h1>Welcome back</h1>
					<p>Your streak's been waiting.</p>
				</div>
				<form action="#">
					<div className="form-col">
						<div className="form-group">
							<label htmlFor="username-email">
								Email address/Username
							</label>
							<input
								id="username-email"
								className="form-control"
								type="text"
								placeholder="Please input your username or email"
							/>
						</div>
						<div className="form-group">
							<label htmlFor="password">Password</label>
							<input
								id="password"
								className="form-control"
								type="password"
								placeholder="Please input your password"
							/>
						</div>
					</div>
					<div className="btns mt-3 d-flex justify-content-between align-items-end">
						<span>
							New here? <a href="/signup">Sign up</a>
						</span>
						<button type="submit" className="btn btn-primary">
							Continue to dashboard
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

export default page;
