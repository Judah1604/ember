import { getRankings } from "@/app/scripts/getRankings";
import { refreshStats } from "@/app/scripts/refreshStats";

export async function GET() {
	try {
		await refreshStats();
		await getRankings();

		return Response.json({
			success: true,
			message: "Leaderboard refreshed",
		});
	} catch (error) {
		console.error(error);

		return Response.json(
			{
				success: false,
				error: "Failed to refresh leaderboard",
			},
			{ status: 500 },
		);
	}
}
