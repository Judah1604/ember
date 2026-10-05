import { usePathname } from "next/navigation";
import React from "react";

function SideBar() {
	const navlinks = [
		{ title: "Dashboard", to: "/dashboard" },
		{ title: "Leaderboards", to: "/leaderboards" },
		{ title: "Settings", to: "/settings" },
	];

	const pathname = usePathname();

	return (
		<div className="sidebar">
			<img src="/logo.svg" className="logo" alt="Ember" />
			<div className="nav-links">
				{navlinks.map((navlink, index) => (
					<a
						href={navlink.to}
						key={index}
						className={
							pathname.includes(navlink.to) ? "active" : ""
						}
					>
						{navlink.title}
					</a>
				))}
			</div>
		</div>
	);
}

export default SideBar;
