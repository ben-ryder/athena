import React from "react";
import {JInput, JInputControl, JLabel} from "@ben-ryder/jigsaw-react";

export function Header() {
	return (
		<header className="ath-header">
			<div className="ath-header__container">
				<div className="ath-header__logo">
					<a href="/"><p>Athena</p></a>
				</div>
				<nav className="ath-header__nav-menu">
					<ul>
						<li><a href="/notes">Notes</a></li>
						<li><a href="/tasks">Tasks</a></li>
						<li><a href="/journal">Journal</a></li>
						<li><a href="/reminders">Reminders</a></li>
					</ul>
				</nav>
				<div className="ath-header__command-bar">
					<JInputControl
						label="Command Bar"
						id="commnad-bar"
						type="text"
						hideLabel={true}
						placeholder="\command, #tags, @type, $field=value or just search... "
					/>
				</div>
				<div className="ath-header__account-menu">
					<p>My Account</p>
				</div>
			</div>

		</header>
	)
}