import "server-only";
import { supabase } from "@/lib/supabase";
import { calcDays } from "@/scripts/dateAndTime";

async function refreshGithubStats(account) {
	const { user_id, platform_username, access_token } = account;

	const res = await fetch(
		`https://api.github.com/users/${platform_username}/events`,
		{
			headers: {
				Authorization: `Bearer ${access_token}`,
				Accept: "application/vnd.github+json",
			},
		},
	);

	if (!res.ok) {
		throw new Error(`GitHub events request failed: ${res.status}`);
	}

	const userRes = await fetch("https://api.github.com/user", {
		headers: {
			Authorization: `Bearer ${access_token}`,
			Accept: "application/vnd.github+json",
		},
	});

	if (!userRes.ok) {
		throw new Error(`GitHub user request failed: ${userRes.status}`);
	}

	const userData = await userRes.json();
	const githubActivity = await res.json();

	const filtered = githubActivity.filter(
		(activity) =>
			activity.type === "PushEvent" || activity.type === "CreateEvent",
	);

	const logs = [];

	for (const element of filtered) {
		if (element.type === "PushEvent") {
			const before = element.payload.before;
			const head = element.payload.head;

			const response = await fetch(
				`https://api.github.com/repos/${element.repo.name}/compare/${before}...${head}`,
				{
					headers: {
						Authorization: `Bearer ${access_token}`,
						Accept: "application/vnd.github+json",
					},
				},
			);

			if (!response.ok) {
				continue;
			}

			const info = await response.json();

			logs.push({
				action: element.type,
				user_id,
				subject: element.repo.name,
				commit_count: info.total_commits,
				platform: "Github",
				date: element.created_at,
			});
		} else {
			logs.push({
				action: element.type,
				user_id,
				subject: element.repo.name,
				platform: "Github",
				date: element.created_at,
			});
		}
	}

	let commitCount = 0;
	const map = {};

	for (const item of logs) {
		const date = item.date.slice(0, 10);

		const key = `${item.user_id}-${item.platform}-${item.action}-${item.subject}-${date}`;

		if (map[key]) {
			map[key].commit_count =
				(map[key].commit_count ?? 0) + (item.commit_count ?? 0);
		} else {
			map[key] = {
				...item,
				date,
			};
		}

		commitCount += item.commit_count ?? 0;
	}

	const uniqueLogs = Object.values(map);

	if (uniqueLogs.length > 0) {
		const { error } = await supabase
			.from("activity_log")
			.upsert(uniqueLogs, {
				onConflict: "user_id,platform,action,subject,date",
			});

		if (error) {
			throw error;
		}
	}

	const { error: statsError } = await supabase.from("github_stats").upsert(
		{
			user_id,
			username: platform_username,
			commits: commitCount,
			reponos: userData.public_repos ?? 0,
		},
		{
			onConflict: "user_id",
		},
	);

	if (statsError) {
		throw statsError;
	}
}

async function refreshHackatimeStats(account) {
	const { user_id, platform_username, access_token } = account;

	const { params: params30 } = calcDays(30);
	const { params: params60 } = calcDays(60);

	const streakRes = await fetch(
		"https://hackatime.hackclub.com/api/v1/authenticated/streak",
		{
			headers: {
				Authorization: `Bearer ${access_token}`,
			},
		},
	);

	const hours30Res = await fetch(
		`https://hackatime.hackclub.com/api/v1/authenticated/hours?${params30}`,
		{
			headers: {
				Authorization: `Bearer ${access_token}`,
			},
		},
	);

	const hours60Res = await fetch(
		`https://hackatime.hackclub.com/api/v1/authenticated/hours?${params60}`,
		{
			headers: {
				Authorization: `Bearer ${access_token}`,
			},
		},
	);

	const projectsRes = await fetch(
		"https://hackatime.hackclub.com/api/v1/authenticated/projects",
		{
			headers: {
				Authorization: `Bearer ${access_token}`,
			},
		},
	);

	if (!streakRes.ok || !hours30Res.ok || !hours60Res.ok || !projectsRes.ok) {
		throw new Error("Hackatime request failed");
	}

	const streakData = await streakRes.json();
	const hours30Data = await hours30Res.json();
	const hours60Data = await hours60Res.json();
	const projectsData = await projectsRes.json();

	const projects = projectsData.projects ?? [];

	const mostActiveProject =
		projects.length > 0
			? projects.reduce((most, project) =>
					project.total_seconds > most.total_seconds ? project : most,
				)
			: null;

	const { error } = await supabase.from("hackatime_stats").upsert(
		{
			user_id,
			username: platform_username,
			streak: streakData.streak_days ?? 0,
			hours30: hours30Data.total_seconds ?? 0,
			hours60: hours60Data.total_seconds ?? 0,
			most_active_project: mostActiveProject?.name ?? "",
		},
		{
			onConflict: "user_id",
		},
	);

	if (error) {
		throw error;
	}
}

async function refreshLeetcodeStats(account) {
	const { user_id, platform_username } = account;

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
					}
				}
			}
		}
	`;

	const response = await fetch("https://leetcode.com/graphql/", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			query,
			variables: {
				username: platform_username,
			},
		}),
	});

	if (!response.ok) {
		throw new Error(`LeetCode request failed: ${response.status}`);
	}

	const result = await response.json();
	const userData = result.data?.matchedUser;

	if (!userData) {
		throw new Error(`LeetCode user not found: ${platform_username}`);
	}

	const submissions = userData.submitStats.acSubmissionNum;

	const easy = submissions.find((item) => item.difficulty === "Easy");
	const medium = submissions.find((item) => item.difficulty === "Medium");
	const hard = submissions.find((item) => item.difficulty === "Hard");
	const all = submissions.find((item) => item.difficulty === "All");

	const { error } = await supabase.from("leetcode_stats").upsert(
		{
			user_id,
			username: userData.username,
			ranking: userData.profile.ranking ?? 0,
			total_problems_solved: all?.count ?? 0,
			easyproblems: easy?.count ?? 0,
			mediumproblems: medium?.count ?? 0,
			hardproblems: hard?.count ?? 0,
		},
		{
			onConflict: "user_id",
		},
	);

	if (error) {
		throw error;
	}
}

export async function refreshStats() {
	const { data: accounts, error } = await supabase
		.from("platform_accounts")
		.select("user_id, platform, platform_username, access_token");

	if (error) {
		throw error;
	}

	for (const account of accounts ?? []) {
		try {
			if (account.platform === "github") {
				await refreshGithubStats(account);
			}

			if (account.platform === "hackatime") {
				await refreshHackatimeStats(account);
			}

			if (account.platform === "leetcode") {
				await refreshLeetcodeStats(account);
			}
		} catch (error) {
			console.error(
				`Failed to refresh ${account.platform} for user ${account.user_id}`,
				error,
			);
		}
	}
}
