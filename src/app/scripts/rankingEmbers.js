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
	const accessToken = platformUserData.access_token;

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
	const hackatimeEmbers = Math.floor((totalSeconds / 3600) * 2);
	const totalEmbers = githubEmbers + leetEmbers + hackatimeEmbers;

	return {
		userId: userId,
		github: githubEmbers,
		leetcode: leetEmbers,
		hackatime: hackatimeEmbers,
		totalScore: totalEmbers,
	};
}

export async function getRankings() {
	let rankings = [];
	const { startDate, endDate, params } = calcDays(30);

	const { data: users, error: userErr } = await supabase
		.from("platform_accounts")
		.select("user_id");

	if (userErr) {
		console.error(userErr);
	}

	let ids = [];

	for (let index = 0; index < users.length; index++) {
		const element = users[index];

		ids.push(element.user_id);
	}

	const distinctIDs = new Set(ids);
	const distinctIDsArr = Array.from(distinctIDs.keys());

	for (let index = 0; index < distinctIDsArr.length; index++) {
		const id = distinctIDsArr[index];

		const embers = await calculateEmbers(id, startDate, endDate, params);

		rankings.push(embers);
	}

    rankings.sort((a, b) => b.totalScore - a.totalScore)

	return rankings;
}
