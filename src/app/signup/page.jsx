import "../styles/authform.css";

function page() {
	return (
		<div className="max-w wrapper">
			<div className="login authform container-sm sign-up">
				<div className="header">
					<h1>Create your account</h1>
					<p>Connect your accounts once, Ember tracks the rest.</p>
				</div>
				<form action="#">
					<div className="form-group">
						<label htmlFor="username-email">
							Username
						</label>
						<input
							id="username"
							className="form-control"
							type="text"
							placeholder="Please input your username"
						/>
					</div>
					<div className="form-group">
						<label htmlFor="username-email">
							Email address
						</label>
						<input
							id="email"
							className="form-control"
							type="email"
							placeholder="Please input your email"
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
					<div className="btns d-flex justify-content-between align-items-end">
						<span>
							Already have an account? <a href="/login">Log in</a>
						</span>
						<button type="submit" className="btn btn-primary">
							Create account
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

export default page;
