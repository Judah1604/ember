"use client";
import { useState } from "react";
import "../styles/authform.css";
import signupAction from "./signupAction";

function page() {
	const [formData, setFormData] = useState({
		username: "",
		email: "",
		password: "",
	});
	const [loading, setLoading] = useState(false);

	function handleChange(e) {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	}

	async function handleSubmit(e) {
		e.preventDefault();
		setLoading(true);

		try {
			await signupAction(formData);
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="max-w wrapper">
			<div className="login authform container-sm sign-up">
				<div className="header">
					<h1>Create your account</h1>
					<p>Connect your accounts once, Ember tracks the rest.</p>
				</div>
				<form action="#" onSubmit={handleSubmit}>
					<div className="form-group">
						<label htmlFor="username-email">Username</label>
						<input
							id="username"
							name="username"
							className="form-control"
							type="text"
							placeholder="Please input your username"
							value={formData.username}
							onChange={(e) => handleChange(e)}
							required
						/>
					</div>
					<div className="form-group">
						<label htmlFor="username-email">Email address</label>
						<input
							id="email"
							name="email"
							className="form-control"
							type="email"
							placeholder="Please input your email"
							value={formData.email}
							onChange={(e) => handleChange(e)}
							required
						/>
					</div>
					<div className="form-group">
						<label htmlFor="password">Password</label>
						<input
							id="password"
							name="password"
							className="form-control"
							type="password"
							placeholder="Please input your password"
							value={formData.password}
							onChange={(e) => handleChange(e)}
							required
						/>
					</div>
					<div className="btns d-flex justify-content-between align-items-end">
						<span>
							Already have an account? <a href="/login">Log in</a>
						</span>
						<button
							type="submit"
							className="btn btn-primary"
							disabled={loading}
						>
							{loading
								? "Signing you up..."
								: "Create account"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

export default page;
