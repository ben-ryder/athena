/// <reference types="vitest" />

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
	server: {
		port: 42101,
	},
	plugins: [
		tsconfigPaths(),
		react(),
		VitePWA({
			registerType: "autoUpdate",
			manifest: {
				name: "Athena",
				short_name: "Athena",
				description:
          "A local-first web app for notes, tasks, journaling, habit tracking and reminders.",
				theme_color: "#0c857a",
				icons: [
					{
						src: "/icons/icon-192.png",
						sizes: "192x192",
						type: "image/png",
					},
					{
						src: "/icons/icon-512.png",
						sizes: "512x512",
						type: "image/png",
					},
					{
						src: "/icons/icon-512-maskable.png",
						sizes: "512x512",
						type: "image/png",
						purpose: "any maskable",
					},
				],
			},
		}),
	],
	test: {
		environment: "jsdom",
		include: ["**/*.unit.test.{ts,tsx}"],
	}
});
