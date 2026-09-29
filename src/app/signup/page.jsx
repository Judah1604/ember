"use client";
import { useState } from "react";
import bcrypt from "bcryptjs";
import { supabase } from "@/lib/supabase";
import "../styles/authform.css";

function page() {
	const [formData, setFormData] = useState({
		username: "",
		email: "",
		password: "",
	});

	function handleChange(e) {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	}
	async function handleSubmit(e) {
		e.preventDefault()

        const passwordHash = await bcrypt.hash(formData.password, 10);
        const {data, error} = await supabase.from('users').insert({
            username: formData.username,
            email: formData.email,
            password_hash: passwordHash
        }).select()

        if (error) {
            console.log('Error inserting', error)
        }else {
            console.log('Inserted', data)
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
