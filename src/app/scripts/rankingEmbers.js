// 1 commit = 1, 1 easy = 2, 1 medium = 4, 1 hard = 6, 1 hour = 2

import { supabase } from "@/lib/supabase";
import { calcDays } from "@/scripts/dateAndTime";

export async function calculateEmbers(userId, startDate, endDate, params) {
	const { data: activityData, error: activityErr } = await supabase
		.from("activity_log")
		.select("*")
		.eq("user_id", userId)
		.order("date", { ascending: false })
		.gte("date", startDate)
		.lte("date", endDate);

	const { data: platformUserData, error } = await supabase
		.from("platform_accounts")
		.select("*")
		.eq("user_id", userId)
		.eq("platform", "hackatime")
		.maybeSingle();

	if (activityErr) {
		console.error(activityErr);
	}

	if (error) {
		console.error(error);
	}
	const accessToken = platformUserData?.access_token;

	const githubData = activityData.filter(
		(activity) => activity.platform === "Github",
	);
	const leetcodeData = activityData.filter(
		(activity) => activity.platform === "Leetcode",
	);

	const githubEmbers = githubData.reduce(
		(total, activity) => total + (activity.commit_count ?? 0),
		0,
	);
	let leetEmbers = 0;

	for (let index = 0; index < leetcodeData.length; index++) {
		const element = leetcodeData[index];

		if (element.difficulty === "Easy") {
			leetEmbers += 2;
		} else if (element.difficulty === "Medium") {
			leetEmbers += 4;
		} else if (element.difficulty === "Hard") {
			leetEmbers += 6;
		}
	}

	let hackatimeEmbers = 0;
	if (accessToken) {
		const hoursRes = await fetch(
			`https://hackatime.hackclub.com/api/v1/authenticated/hours?${params}`,
			{
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			},
		);
		const hoursData = await hoursRes.json();
		const totalSeconds = hoursData.total_seconds;
		hackatimeEmbers = Math.floor((totalSeconds / 3600) * 2);
	}

	const totalEmbers = githubEmbers + leetEmbers + hackatimeEmbers;

	const { data: user, err: userErr } = await supabase
		.from("users")
		.select("username")
		.eq("id", userId)
		.single();

	if (userErr) {
		console.error(userErr);
	}

	return {
		userId: userId,
		username: user.username,
		github: githubEmbers,
		leetcode: leetEmbers,
		hackatime: hackatimeEmbers,
		totalScore: totalEmbers,
	};
}

export async function getStoredRankings() {
	const { data: rankings, error } = await supabase
		.from("embers")
		.select("*")
		.order("total_score", { ascending: false });

	if (error) {
		console.error(error);
	}

	return rankings;
}
