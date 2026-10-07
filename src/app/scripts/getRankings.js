import { supabase } from "@/lib/supabase";
import { calcDays } from "@/scripts/dateAndTime";
import { calculateEmbers } from "./rankingEmbers";

export async function getRankings() {
	const { data: users, error: userErr } = await supabase
		.from("platform_accounts")
		.select("user_id");

	if (userErr) {
		console.error(userErr);
	}

	let onedayRankings = [],
		weekRankings = [],
		monthRanking = [];
	const distinctIDs = [...new Set(users.map((user) => user.user_id))];
	const {
		startDate: startDate1,
		endDate: endDate1,
		params: params1,
	} = calcDays(1);
	const {
		startDate: startDate7,
		endDate: endDate7,
		params: params7,
	} = calcDays(7);
	const {
		startDate: startDate30,
		endDate: endDate30,
		params: params30,
	} = calcDays(30);

	for (const user of distinctIDs) {
		const embers = await calculateEmbers(
			user,
			startDate1,
			endDate1,
			params1,
		);

		onedayRankings.push(embers);
	}
	for (const user of distinctIDs) {
		const embers = await calculateEmbers(
			user,
			startDate7,
			endDate7,
			params7,
		);

		weekRankings.push(embers);
	}
	for (const user of distinctIDs) {
		const embers = await calculateEmbers(
			user,
			startDate30,
			endDate30,
			params30,
		);

		monthRanking.push(embers);
	}

	const embers1 = onedayRankings.map((ranking) => ({
		user_id: ranking.userId,
		username: ranking.username,
		period: "1d",
		github_score: ranking.github,
		leetcode_score: ranking.leetcode,
		hackatime_score: ranking.hackatime,
		total_score: ranking.totalScore,
	}));
	const embers7 = weekRankings.map((ranking) => ({
		user_id: ranking.userId,
		username: ranking.username,
		period: "7d",
		github_score: ranking.github,
		leetcode_score: ranking.leetcode,
		hackatime_score: ranking.hackatime,
		total_score: ranking.totalScore,
	}));
	const embers30 = monthRanking.map((ranking) => ({
		user_id: ranking.userId,
		username: ranking.username,
		period: "30d",
		github_score: ranking.github,
		leetcode_score: ranking.leetcode,
		hackatime_score: ranking.hackatime,
		total_score: ranking.totalScore,
	}));

	const { error: error1 } = await supabase.from("embers").upsert(embers1, {
		onConflict: "user_id,period",
	});
	const { error: error7 } = await supabase.from("embers").upsert(embers7, {
		onConflict: "user_id,period",
	});
	const { error: error30 } = await supabase.from("embers").upsert(embers30, {
		onConflict: "user_id,period",
	});

	if (error1) throw error1;
	if (error7) throw error7;
	if (error30) throw error30;

	console.log("USERS:", users);
	console.log("DISTINCT IDS:", distinctIDs);
	console.log("1D:", embers1);
	console.log("7D:", embers7);
	console.log("30D:", embers30);
}