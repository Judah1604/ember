"use server";
export default async function fetchLeetcodeActivity(username) {
	const response = await fetch("https://leetcode.com/graphql/", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			query: `
			query recentAcSubmissionList($username: String!, $limit: Int!) {
				recentAcSubmissionList(username: $username, limit: $limit) {
					title
					titleSlug
					timestamp
				}
			}
		`,
			variables: {
				username: username,
				limit: 10,
			},
		}),
	});

	const data = await response.json();

	return data.data.recentAcSubmissionList;
}
