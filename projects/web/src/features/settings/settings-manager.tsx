import { ReactNode, useState } from "react";
import { AttachmentsManagerPage } from "../attachments/manager/attachments-manager";
import { JButton, JButtonGroup } from "@ben-ryder/jigsaw-react";
import {PerformanceManager} from "../performance/performance-manager";
import {ImportExportManager} from "../import-export/import-export-manager";

export type SettingsTabs = "settings" | "attachments" | "performance" | "import-export"

export function SettingsManager() {
	const [currentTab, setCurrentTab] = useState<SettingsTabs>("settings")

	let content: ReactNode
	if (currentTab === "settings") {
		content = <p>Settings</p>
	} else if (currentTab === "attachments") {
		content = <AttachmentsManagerPage />
	}
	else if (currentTab === "performance") {
		content = <PerformanceManager />
	}
	else if (currentTab === "import-export") {
		content = <ImportExportManager />
	}
	else {
		content = <p>Tab Not Found: {currentTab}</p>
	}

	return (
		<div>
			<JButtonGroup align="left">
				<JButton onClick={() => setCurrentTab("settings")}>Settings</JButton>
				<JButton onClick={() => setCurrentTab("attachments")}>Manage Attachments</JButton>
				<JButton onClick={() => setCurrentTab("import-export")}>Import/Export</JButton>
				<JButton onClick={() => setCurrentTab("performance")}>Device Benchmark</JButton>
			</JButtonGroup>

			<div>
				{content}
			</div>
		</div>
	)
}
