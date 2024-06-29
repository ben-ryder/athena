import { defineConfig } from "cypress";

export default defineConfig({
	component: {
		specPattern: "src/**/*.unit.test.tsx",
		devServer: {
			framework: "react",
			bundler: "vite",
			viteConfig: {
				port: 3002,
			},
		},
	},
	e2e: {
		specPattern: "src/**/*.e2e.test.tsx",
		baseUrl: "http://localhost:3000",
	},
	env: {
		apiBaseUrl: "http://localhost:3001/v1",
	},
});
