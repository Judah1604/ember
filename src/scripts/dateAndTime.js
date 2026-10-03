export function timeAgo(date) {
	const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);

	if (seconds < 60) {
		return `${seconds}s ago`;
	}

	const minutes = Math.floor(seconds / 60);

	if (minutes < 60) {
		return `${minutes}m ago`;
	}

	const hours = Math.floor(minutes / 60);

	if (hours < 24) {
		return `${hours}h ago`;
	}

	const days = Math.floor(hours / 24);

	if (days < 30) {
		return `${days}d ago`;
	}

	const months = Math.floor(days / 30);

	if (months < 12) {
		return `${months}mo ago`;
	}

	const years = Math.floor(days / 365);

	return `${years}y ago`;
}

export function calcDays(days) {
	const today = new Date();

	const daysAgo = new Date();
	daysAgo.setDate(today.getDate() - days);

	const formatDate = (date) => date.toISOString().split("T")[0];

	const startDate = formatDate(daysAgo);
	const endDate = formatDate(today);

	const params = new URLSearchParams({
		start_date: startDate,
		end_date: endDate,
	});

	return { params, startDate, endDate };
}
