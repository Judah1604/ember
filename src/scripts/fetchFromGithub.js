export async function fetchFromGithub(username, githubKey) {
	const to = new Date();
	const from = new Date();
	from.setDate(from.getDate() - 7);

	const response = await fetch("https://api.github.com/graphql", {
			method: "POST",
			headers: {
				Authorization: `Bearer ${githubKey}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				query: `
          query($username: String!, $from: DateTime!, $to: DateTime!) {
            user(login: $username) {
              contributionsCollection(from: $from, to: $to) {
                contributionCalendar {
                  weeks {
                    contributionDays {
                      date
                      contributionCount
                    }
                  }
                }
              }
            }
          }
        `,
				variables: {
					username: username,
					from: from.toISOString(),
					to: to.toISOString(),
				},
			}),
		}),
		data = await response.json();

	return data;
}
