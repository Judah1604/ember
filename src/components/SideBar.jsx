import { usePathname } from "next/navigation";
import React, { useState } from "react";

function SideBar() {
	const navlinks = [
		{ title: "Dashboard", to: "/dashboard" },
		{ title: "Leaderboards", to: "/leaderboards" },
		{ title: "Docs", to: "/documentation" },
		{ title: "Settings", to: "/settings" },
	];

	const pathname = usePathname();
    const [isActive, setIsActive] = useState(false)

	return (
		<>
			<div className="wrapper">
				<div className="sidebar">
					<img src="/logo.svg" className="logo" alt="Ember" />
					<div className={isActive ? "hamb active" : 'hamb'} onClick={() => setIsActive(!isActive)}>
						<span></span>
						<span></span>
						<span></span>
					</div>
					<div className={"nav-links"}>
						{navlinks.map((navlink, index) => (
							<a
								href={navlink.to}
								key={index}
								className={
									pathname.includes(navlink.to)
										? "active"
										: ""
								}
							>
								{navlink.title}
							</a>
						))}
					</div>
				</div>
				<div className={isActive ? "mobile-links active" : 'mobile-links'}>
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
		</>
	);
}

export default SideBar;
