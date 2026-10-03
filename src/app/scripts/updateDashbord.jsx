import { supabase } from "@/lib/supabase";
import { calcDays } from "@/scripts/dateAndTime";
import fetchLeetcodeActivity from "@/scripts/fetchFromLeetcode";

export async function updateGithubInfo({setGithubInfo, userId}) {
	const { data: platformUserData, error } = await supabase
		.from("platform_accounts")
		.select("*")
		.eq("user_id", userId)
		.eq("platform", "github")
		.maybeSingle();

	if (error) {
		console.error(error);
	}

	if (!platformUserData) {
		setGithubInfo((prev) => ({
			...prev,
			username: "",
			commitsNo: 0,
			reposNo: 0,
		}));
	} else {
		setGithubInfo((prev) => ({
			...prev,
			username: platformUserData.platform_username,
		}));
		const res = await fetch(
			`https://api.github.com/users/${platformUserData.platform_username}/events`,
			{
				headers: {
					Authorization: `Bearer ${platformUserData.access_token}`,
					Accept: "application/vnd.github+json",
				},
			},
		);

		const userRes = await fetch(`https://api.github.com/user`, {
			headers: {
				Authorization: `Bearer ${platformUserData.access_token}`,
				Accept: "application/vnd.github+json",
			},
		});
		const userData = await userRes.json();
		setGithubInfo((prev) => ({
			...prev,
			reposNo: userData.public_repos,
		}));

		const githubActivity = await res.json();

		const filtered = githubActivity.filter(
			(activity) =>
				activity.type === "PushEvent" ||
				activity.type === "CreateEvent",
		);
		const logs = [];

		for (let index = 0; index < filtered.length; index++) {
			const element = filtered[index];

			if (element.type === "PushEvent") {
				const before = element.payload.before,
					head = element.payload.head;

				const response = await fetch(
					`https://api.github.com/repos/${element.repo.name}/compare/${before}...${head}`,
					{
						headers: {
							Authorization: `Bearer ${platformUserData.access_token}`,
							Accept: "application/vnd.github+json",
						},
					},
				);

				const info = await response.json(),
					commitCount = info.total_commits;

				logs.push({
					action: element.type,
					user_id: userId,
					subject: element.repo.name,
					commit_count: commitCount,
					platform: "Github",
					date: element.created_at,
				});
			} else {
				logs.push({
					action: element.type,
					user_id: userId,
					subject: element.repo.name,
					platform: "Github",
					date: element.created_at.slice(0, 10),
				});
			}
		}

		const map = [];
		let commitCount = 0;

		for (const item of logs) {
			const prev = map[map.length - 1];

			if (
				prev &&
				prev.subject === item.subject &&
				prev.action === "PushEvent" &&
				item.action === "PushEvent"
			) {
				prev.commit_count += item.commit_count ?? 0;
			} else {
				map.push({
					...item,
				});
			}

			commitCount += item.commit_count ?? 0;
		}
		setGithubInfo((prev) => ({ ...prev, commitsNo: commitCount }));
		console.log(map);

		if (map.length === 0) return;

		const { error } = await supabase.from("activity_log").upsert(map, {
			onConflict: "user_id,platform,action,subject,date",
		});

		if (error) {
			console.error(error);
			return;
		}
	}
}
export async function updateGithubActivity({ setActivity, setGithubInfo, userId }) {
	const { data: activityData, error } = await supabase
		.from("activity_log")
		.select("*")
		.eq("user_id", userId)
		.order("date", { ascending: false });

	if (error) {
		console.error(error);
	}

	setGithubInfo((prev) => ({
		...prev,
		activity: activityData ?? [],
	}));
	setActivity(activityData ?? []);
}
export async function updateHackatimeInfo({setHackatimeInfo, userId}) {
	const { data: platformUserData, error } = await supabase
		.from("platform_accounts")
		.select("*")
		.eq("user_id", userId)
		.eq("platform", "hackatime")
		.maybeSingle();

	if (error) {
		console.error(error);
	}

	if (!platformUserData) {
		setHackatimeInfo((prev) => ({
			...prev,
			username: "",
			hours: 0,
			totalHours: 0,
			streak: 0,
			mostActiveProject: "",
		}));
	} else {
		const accessToken = platformUserData.access_token;
		const {params: params30} = calcDays(30);
		const {params: params60} = calcDays(60);

		const streakRes = await fetch(
			"https://hackatime.hackclub.com/api/v1/authenticated/streak",
			{
				headers: {
					Authorization: `Bearer ${accessToken}`,
					Accept: "application/vnd.github+json",
				},
			},
		);

		const hours30Res = await fetch(
			`https://hackatime.hackclub.com/api/v1/authenticated/hours?${params30}`,
			{
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			},
		);
		const hours60Res = await fetch(
			`https://hackatime.hackclub.com/api/v1/authenticated/hours?${params60}`,
			{
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			},
		);

		const mostActiveProjectRes = await fetch(
			"https://hackatime.hackclub.com/api/v1/authenticated/projects",
			{
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			},
		);

		const streakData = await streakRes.json();
		const hours30Data = await hours30Res.json();
		const hours60Data = await hours60Res.json();
		const mostActiveProjectData = await mostActiveProjectRes.json();

		const mostActiveProject = mostActiveProjectData.projects.reduce(
			(most, project) =>
				project.total_seconds > most.total_seconds ? project : most,
		);

		setHackatimeInfo((prev) => ({
			...prev,
			username: platformUserData.platform_username,
			streak: streakData.streak_days ?? 0,
			hours: hours30Data.total_seconds ?? 0,
			totalHours: hours60Data.total_seconds ?? 0,
			mostActiveProject: mostActiveProject?.name ?? "",
		}));
	}
}
export async function updateLeetcodeInfo({setLeetcodeInfo, userId}) {
	const { data: platformUserData, error } = await supabase
		.from("leetcode_stats")
		.select("*")
		.eq("user_id", userId)
		.single();

	if (error) {
		console.error(error);
	}

	setLeetcodeInfo((prev) => ({
		...prev,
		username: platformUserData?.username ?? "",
		ranking: platformUserData?.ranking ?? 0,
		totalProblemsSolved: platformUserData?.total_problems_solved ?? 0,
		easyProblems: platformUserData?.easyproblems ?? 0,
		mediumProblems: platformUserData?.mediumproblems ?? 0,
		hardProblems: platformUserData?.hardproblems ?? 0,
	}));
}
export async function updateLeetcodeActivity({userId}) {
	const { data: platformUserData, error: platformError } = await supabase
		.from("platform_accounts")
		.select("*")
		.eq("user_id", userId)
		.eq("platform", "leetcode")
		.maybeSingle();

	if (platformError) {
		console.error(platformError);
	}
	let logs = [];
	const leetcodeActivity = await fetchLeetcodeActivity(
		platformUserData?.platform_username,
	);

	for (const activity of leetcodeActivity) {
		logs.push({
			action: "Solved ",
			user_id: userId,
			subject: activity.title,
            difficulty: activity.difficulty,
			platform: "Leetcode",
			date: new Date(activity.timestamp * 1000).toISOString(),
		}); 
	}

	const { error: upsertError } = await supabase
		.from("activity_log")
		.upsert(logs, {
			onConflict: "user_id,platform,action,subject,date",
			ignoreDuplicates: true,
		});

	if (upsertError) {
		console.error(upsertError);
		return;
	}
}

export async function updateActivity({ setActivity, userId }) {
	const { data, error } = await supabase
		.from("activity_log")
		.select("*")
		.eq("user_id", userId);

	if (error) {
		console.error(error);
		return;
	}

	const sorted = [...data].sort(
		(a, b) => new Date(b.date) - new Date(a.date),
	);

	setActivity(sorted);
}
