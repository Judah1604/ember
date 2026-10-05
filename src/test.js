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
			username: "ayomidee",
		},
	}),
});

if (!res.ok) {
	throw new Error(`LeetCode returned ${res.status}`);
}
const data = await res.json();
const user = data.data.matchedUser;

console.log(user.submitStats);
