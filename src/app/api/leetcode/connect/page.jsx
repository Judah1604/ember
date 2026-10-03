"use client";
import { useState } from "react";
import "@/app/styles/authform.css";
import connectLeetcodeAction from "./connectLeetcodeAction";

function page() {
	const [formData, setFormData] = useState({
		username: "",
	});
	const [error, setError] = useState("");
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
			const result = await connectLeetcodeAction(formData);

			if (!result.success) {
				setError(result.error);
			}
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="max-w wrapper">
			<div className="login authform container-sm">
				<img src="/logo.svg" alt="Ember" />

				<div className="header">
					<h1>Connect to Leetcode</h1>
				</div>
				<form action="#" onSubmit={handleSubmit} className="mt-3">
					<div className="form-col">
						<div className="form-group">
							<label htmlFor="username">Username</label>
							<input
								id="username"
								name="username"
								className="form-control"
								type="text"
								placeholder="Please input your Leetcode username"
								onChange={(e) => handleChange(e)}
								required
							/>
						{error === "Username is incorrect" && (
							<div className="form-valid">
								Incorrect Username
							</div>
						)}
						</div>
					</div>
					<div className="btns mt-3 d-flex justify-content-end align-items-end">
						<button
							type="submit"
							className="btn btn-primary"
							disabled={loading}
						>
							{loading ? "Checking..." : "Check Username"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

export default page;
