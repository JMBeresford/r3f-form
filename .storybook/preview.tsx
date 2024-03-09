import * as React from "react";
import "./style.css";
import type { Preview } from "@storybook/react";
import { Scene } from "./common";

const preview: Preview = {
  decorators: [
    (Story) => (
      <React.Suspense fallback={null}>
        <div style={{ height: "100dvh" }}>
          <Scene>
            <Story />
          </Scene>
        </div>
      </React.Suspense>
    ),
  ],
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
  },
};

export default preview;
