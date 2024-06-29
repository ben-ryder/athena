import { ReactNode, useState } from "react";
import { AttachmentsManagerPage } from "../attachments/manager/attachments-manager";
import { JButton, JButtonGroup } from "@ben-ryder/jigsaw-react";
import {PerformanceManager} from "../performance/performance-manager";

export type SettingsTabs = "account" | "settings" | "attachments" | "performance"

export function SettingsManager() {
	const [currentTab, setCurrentTab] = useState<SettingsTabs>("account")

	let content: ReactNode
	if (currentTab === "account") {
		content = <p>Account</p>
	}
	else if (currentTab === "settings") {
		content = <p>Settings</p>
	} else if (currentTab === "attachments") {
		content = <AttachmentsManagerPage />
	}
	else if (currentTab === "performance") {
		content = <PerformanceManager />
	}
	else {
		content = <p>Tab Not Found: {currentTab}</p>
	}

	return (
		<div>
			<JButtonGroup align="left">
				<JButton onClick={() => setCurrentTab("account")}>Account</JButton>
				<JButton onClick={() => setCurrentTab("settings")}>Settings</JButton>
				<JButton onClick={() => setCurrentTab("attachments")}>Attachments</JButton>
				<JButton onClick={() => setCurrentTab("performance")}>Device Benchmark</JButton>
			</JButtonGroup>

			<div>
				{content}
			</div>
		</div>
	)
}
