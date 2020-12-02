// To run the example, visit https://elektron.live/residence
// and turn on your camera

// We use latest Javascript feature to import external libraries to
// the page without using <script> tags

import { createApp } from "https://elektronstudio.github.io/live/src/deps/vue.js";

import {
  useChat,
  useUser,
  useOpenvidu,
} from "https://elektronstudio.github.io/live/src/lib/index.js";

import OpenviduCanvas from "./OpenviduCanvas.js";

// Replace with your personal channelname for testing
// Will be connected to https://elektron.live/residence

const channel = "residence";

const App = {
  components: { OpenviduCanvas },
  setup() {
    return {
      ...useChat(channel),
      ...useUser(),
      ...useOpenvidu(channel),
    };
  },
};

const app = createApp(App);

app.mount("#app");
