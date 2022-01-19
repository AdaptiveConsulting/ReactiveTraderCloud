import { init as workspacePlatformInit } from "@openfin/workspace-platform";
import { registerHome, showHome } from "./home";
import { registerStore } from "./store";

async function init() {
  await workspacePlatformInit({
    browser: {},
    theme: [
      {
        label: "Dark",
        palette: {
          brandPrimary: "#282E39",
          brandSecondary: "#FFF",
          backgroundPrimary: "#2F3542",
          background2: "#3D4455",
        },
      },
    ],
  });
  await registerHome();
  await registerStore();
  await showHome();
}

window.addEventListener("DOMContentLoaded", async () => {
  await init();
});
