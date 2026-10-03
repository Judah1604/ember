"use server";

import { supabase } from "@/lib/supabase";
import { getCurrentUser } from "@/scripts/getCurrentUser";
import { redirect } from "next/navigation";

export default async function connectLeetcodeAction(formData) {
	const username = formData.username;

	const query = `
		query($username: String!) {
			matchedUser(username: $username) {
				username
				profile {
					ranking
				}
				submitStats: submitStatsGlobal {
					acSubmissionNum {
						difficulty
						count
						submissions
					}
				}
			}
		}
	`;

	const res = await fetch("https://leetcode.com/graphql", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			query,
			variables: {
				username,
			},
		}),
	});

	if (!res.ok) {
		throw new Error(`LeetCode returned ${res.status}`);
	}
	const data = await res.json();
	const user = data.data.matchedUser;

	if (!user) {
		return {
			success: false,
			error: "Username is incorrect",
		};
	}

	const trimmed = {
		username: user.username,
		ranking: user.profile.ranking,
		totalProblemsSolved: user.submitStats.acSubmissionNum[0].count,
		easyProblems: user.submitStats.acSubmissionNum[1].count,
		mediumProblems: user.submitStats.acSubmissionNum[2].count,
		hardProblems: user.submitStats.acSubmissionNum[3].count,
	};

    const userId = await getCurrentUser();

	const { data: platformUserData, error: err } = await supabase
		.from("platform_accounts")
		.select("*")
		.eq("user_id", userId)
		.eq("platform", "leetcode")
		.maybeSingle();

	if (err) {
		console.error(err);
	}

	if (!platformUserData) {
		const { error: insertError } = await supabase
			.from("platform_accounts")
			.insert({
				user_id: userId,
				platform: "leetcode",
				platform_username: username,
			})
			.select();

		if (insertError) {
			console.error(insertError);
		}
	}
    const { data: newPlatformUserData, error: newErr } = await supabase
		.from("leetcode_stats")
		.upsert({
			user_id: userId,
			username: username,
			ranking: String(trimmed.ranking),
			total_problems_solved: String(trimmed.totalProblemsSolved),
			easyproblems: String(trimmed.easyProblems),
			mediumproblems: String(trimmed.mediumProblems),
			hardproblems: String(trimmed.hardProblems),
		})
		.select();

	if (newErr) {
		console.error(newErr);
	}

    redirect("/dashboard");
}
