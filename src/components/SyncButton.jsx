'use client'
import { supabase } from "@/lib/supabase";

export default function SyncButton({ weeks }) {
	const handleSync = async () => {
		let flattenedRows = [];
		for (let index = 0; index < weeks.length; index++) {
			const week = weeks[index],
				contributionDays = week.contributionDays;

			for (let i = 0; i < contributionDays.length; i++) {
				const contriDay = contributionDays[i];
				flattenedRows.push({
					user_id: 1,
					platform: "github",
					date: contriDay.date,
					count: contriDay.contributionCount,
				});
			}
		}
		const { data, error } = await supabase
			.from("activity_log")
			.insert(flattenedRows);

		if (error) {
			console.error("Insert failed", error);
		}
	};

	return <button onClick={handleSync}>Sync Github Activity</button>;
}
