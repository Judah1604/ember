"use client";
import { useState } from "react";
import loginAction from "./loginAction";
import "../styles/authform.css";

function page() {
	const [formData, setFormData] = useState({
		username_email: "",
		password: "",
	});
	const [error, setError] = useState("");

	function handleChange(e) {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	}

	async function handleSubmit(e) {
		e.preventDefault();
        setError('')
		const result = await loginAction(formData);
		if (!result.success) {
			setError(result.error);
		}
	}

	return (
		<div className="max-w wrapper">
			<div className="login authform container-sm">
				<div className="header">
					<h1>Welcome back</h1>
					<p>Your streak's been waiting.</p>
				</div>
				<form action="#" onSubmit={handleSubmit}>
					<div className="form-col">
						<div className="form-group">
							<label htmlFor="username-email">
								Email address/Username
							</label>
							<input
								id="username-email"
								name="username_email"
								className="form-control"
								type="text"
								placeholder="Please input your username or email"
								onChange={(e) => handleChange(e)}
								required
							/>
							{error === "Username or email is incorrect" && (
								<div className="form-valid">
									Incorrect Username or Email
								</div>
							)}
						</div>
						<div className="form-group">
							<label htmlFor="password">Password</label>
							<input
								id="password"
								name="password"
								className="form-control"
								type="password"
								placeholder="Please input your password"
								onChange={(e) => handleChange(e)}
								required
							/>
							{error === "Password is incorrect" && (
								<div className="form-valid">
									Incorrect Password
								</div>
							)}
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
