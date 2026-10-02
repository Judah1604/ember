const arr = [
	{
		action: "PushEvent",
		subject: "Judah1604/ember",
		commitCount: 1,
		platform: "Github",
		time: "9/30/2026, 2:15:53 PM",
	},
	{
		action: "PushEvent",
		subject: "Judah1604/ember",
		commitCount: 1,
		platform: "Github",
		time: "10/1/2026, 6:18:49 PM",
	},
	{
		action: "PushEvent",
		subject: "Judah1604/ember",
		commitCount: 1,
		platform: "Github",
		time: "10/1/2026, 2:21:03 AM",
	},
	{
		action: "PushEvent",
		subject: "Judah1604/ember",
		commitCount: 1,
		platform: "Github",
		time: "10/1/2026, 12:33:56 AM",
	},
	{
		action: "PushEvent",
		subject: "Judah1604/ember",
		commitCount: 1,
		platform: "Github",
		time: "9/29/2026, 11:18:04 PM",
	},
	{
		action: "PushEvent",
		subject: "Judah1604/ember",
		commitCount: 1,
		platform: "Github",
		time: "9/30/2026, 1:22:21 PM",
	},
	{
		action: "PushEvent",
		subject: "Judah1604/ember",
		commitCount: 1,
		platform: "Github",
		time: "9/29/2026, 1:46:42 PM",
	},
	{
		action: "PushEvent",
		subject: "Judah1604/ember",
		commitCount: 1,
		platform: "Github",
		time: "9/30/2026, 2:07:33 PM",
	},
	{
		action: "PushEvent",
		subject: "Judah1604/ember",
		commitCount: 1,
		platform: "Github",
		time: "9/29/2026, 5:00:59 AM",
	},
	{
		action: "PushEvent",
		subject: "Judah1604/ember",
		commitCount: 1,
		platform: "Github",
		time: "9/29/2026, 4:20:07 AM",
	},
	{
		action: "PushEvent",
		subject: "Judah1604/data-structures",
		commitCount: 1,
		platform: "Github",
		time: "9/27/2026, 9:58:23 PM",
	},
	{
		action: "PushEvent",
		subject: "Judah1604/ember",
		commitCount: 1,
		platform: "Github",
		time: "9/28/2026, 2:28:06 AM",
	},
	{
		action: "PushEvent",
		subject: "Judah1604/data-structures",
		commitCount: 1,
		platform: "Github",
		time: "9/26/2026, 3:35:16 AM",
	},
	{
		action: "PushEvent",
		subject: "Judah1604/Orbit",
		commitCount: 1,
		platform: "Github",
		time: "9/25/2026, 1:46:29 AM",
	},
	{
		action: "PushEvent",
		subject: "Judah1604/Orbit",
		commitCount: 1,
		platform: "Github",
		time: "9/24/2026, 5:59:20 PM",
	},
	{
		action: "PushEvent",
		subject: "Judah1604/Orbit",
		commitCount: 1,
		platform: "Github",
		time: "9/24/2026, 5:58:04 PM",
	},
	{
		action: "PushEvent",
		subject: "Judah1604/Orbit",
		commitCount: 1,
		platform: "Github",
		time: "9/23/2026, 12:10:31 AM",
	},
	{
		action: "PushEvent",
		subject: "Judah1604/Orbit",
		commitCount: 1,
		platform: "Github",
		time: "9/22/2026, 11:44:29 PM",
	},
	{
		action: "PushEvent",
		subject: "Judah1604/Orbit",
		commitCount: 1,
		platform: "Github",
		time: "9/23/2026, 2:53:04 AM",
	},
	{
		action: "PushEvent",
		subject: "Judah1604/Orbit",
		commitCount: 1,
		platform: "Github",
		time: "9/22/2026, 12:47:02 AM",
	},
	{
		action: "PushEvent",
		subject: "Judah1604/data-structures",
		commitCount: 1,
		platform: "Github",
		time: "9/21/2026, 1:16:53 AM",
	},
	{
		action: "PushEvent",
		subject: "Judah1604/data-structures",
		commitCount: 1,
		platform: "Github",
		time: "9/20/2026, 12:52:37 AM",
	},
	{
		action: "PushEvent",
		subject: "Judah1604/data-structures",
		commitCount: 1,
		platform: "Github",
		time: "9/19/2026, 3:21:40 AM",
	},
	{
		action: "PushEvent",
		subject: "Judah1604/data-structures",
		commitCount: 1,
		platform: "Github",
		time: "9/18/2026, 1:45:41 AM",
	},
	{
		action: "PushEvent",
		subject: "Judah1604/data-structures",
		commitCount: 1,
		platform: "Github",
		time: "9/17/2026, 12:32:55 AM",
	},
	{
		action: "PushEvent",
		subject: "Judah1604/data-structures",
		commitCount: 1,
		platform: "Github",
		time: "9/16/2026, 3:20:49 AM",
	},
];

const map = []

for (const item of arr) {
	const prev = map[map.length - 1];

	if (prev && prev.subject === item.subject) {
		prev.commitCount += item.commitCount;
	} else {
		map.push({
			...item,
		});
	}
}

console.log(map)