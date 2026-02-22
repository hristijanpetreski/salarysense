// @refresh reload
import { mount, StartClient } from "@solidjs/start/client";

// biome-ignore lint: the app container will be created in the final output
mount(() => <StartClient />, document.getElementById("app")!);
