import SyncButton from "@/components/SyncButton";
import { fetchFromGithub } from "@/scripts/fetchFromGithub";

export default async function Home() {
	const response = await fetchFromGithub(
			"judah1604",
			process.env.GITHUB_TOKEN,
		),
		weeks =
			response.data.user.contributionsCollection.contributionCalendar
				.weeks;

	return <SyncButton weeks={weeks} />;
}
