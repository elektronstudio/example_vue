// To run the example, visit https://elektron.live/residence
// and turn on your camera

// We use latest Javascript feature to import external libraries to
// the page without using <script> tags

import { createApp } from "https://elektronstudio.github.io/live/src/deps/vue.js";

import { useChat } from "https://elektronstudio.github.io/live/src/lib/chat.js";
import { useUser } from "https://elektronstudio.github.io/live/src/lib/user.js";

// Replace with your personal channelname for testing
// Will be connected to https://elektron.live/residence

const channel = "residence";

const App = {
  setup() {
    return { ...useChat(channel), ...useUser() };
  },
};

const app = createApp(App);

app.mount("#app");
