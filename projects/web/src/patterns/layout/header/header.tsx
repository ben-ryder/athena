import React from "react";
import {JInputControl} from "@ben-ryder/jigsaw-react";
import {InternalLink} from "../../components/internal-link";


export function Header() {
	return (
		<header className="ath-header">
			<div className="ath-header__container">
				<div className="ath-header__logo">
					<InternalLink href="/"><p>Athena</p></InternalLink>
				</div>
				<nav className="ath-header__nav-menu">
					<ul>
						<li><InternalLink href="/notes">Notes</InternalLink></li>
						<li><InternalLink href="/tasks">Tasks</InternalLink></li>
						<li><InternalLink href="/tags">Tags</InternalLink></li>
					</ul>
				</nav>
				<div className="ath-header__command-bar">
					<JInputControl
						label="Command Bar"
						id="commnad-bar"
						type="text"
						hideLabel={true}
						placeholder="Type a command or search and filter for content... "
					/>
				</div>
				<div className="ath-header__account-menu">
					<p>My Account</p>
				</div>
			</div>

		</header>
	)
}
