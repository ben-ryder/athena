import "../src/styles/tailwind.css";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  options: {
    showPanel: true,
  },
  layout: "full", // let the global decorator have full control over all padding etc
}

// Using a global decorator to provide a universal story background.
// This lets Storybook & Cypress share the same background.
export const decorators = [
  (Story) => (
      <div className="bg-br-atom-700 p-5 w-full h-full">
        <div className="border-t border-l border-dashed border-br-blueGrey-700">
          <Story />
        </div>
      </div>
  ),
];
