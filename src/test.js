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
			username: "judah1604",
			limit: 10,
		},
	}),
});

const data = await response.json();
const userProblems = data.data.recentAcSubmissionList;

let trimmed = [];

for (let index = 0; index < userProblems.length; index++) {
	const problem = userProblems[index];

	const problemRes = await fetch("https://leetcode.com/graphql/", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			query: `
			query questionData($titleSlug: String!) {
	            question(titleSlug: $titleSlug) {
	                title
	                titleSlug
	                difficulty
	                                            }
	                }
		`,
			variables: {
				titleSlug: problem.titleSlug,
			},
		}),
	});

	const problemData = await problemRes.json();
	const question = problemData.data.question;

	trimmed.push({
		title: question.title,
		difficulty: question.difficulty,
		timestamp: problem.timestamp,
	});
}

console.log(trimmed);
