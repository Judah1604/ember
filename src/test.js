const query = `
	query {
		matchedUser(username: "judah1604") {
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
	body: JSON.stringify({ query }),
});

const data = await res.json();
const trimmed = {
    username: data.data.matchedUser.username,
    ranking: data.data.matchedUser.profile.ranking,
    totalProblemsSolved: data.data.matchedUser.submitStats.acSubmissionNum[0].count,
    easyProblems: data.data.matchedUser.submitStats.acSubmissionNum[1].count,
    mediumProblems: data.data.matchedUser.submitStats.acSubmissionNum[2].count,
    hardProblems: data.data.matchedUser.submitStats.acSubmissionNum[3].count,
}

console.log(trimmed);