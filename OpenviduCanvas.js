import {
  ref,
  onMounted,
  computed,
} from "https://elektronstudio.github.io/live/src/deps/vue.js";

import { fit } from "https://elektronstudio.github.io/live/src/lib/index.js";

const useVideoCanvas = () => {
  const videoRef = ref(null);
  const canvasRef = ref(null);
  const context = ref(null);

  onMounted(() => {
    context.value = canvasRef.value.getContext("2d");

    const draw = () => {
      context.value.drawImage(
        videoRef.value,
        0,
        0,
        videoRef.value.videoWidth,
        videoRef.value.videoHeight
      );
      context.value.font = "20px Arial";
      context.value.fillText(new Date().toISOString(), 20, 40);
      requestAnimationFrame(draw);
    };

    videoRef.value.addEventListener("loadedmetadata", ({ srcElement }) => {
      canvasRef.value.width = srcElement.videoWidth;
      canvasRef.value.height = srcElement.videoHeight;

      draw();
    });
  });

  const ws = new WebSocket("ws://localhost:8080");

  let mediaStream;
  let mediaRecorder;

  ws.addEventListener("open", (e) => {
    mediaStream = canvasRef.value.captureStream(30);
    mediaRecorder = new MediaRecorder(mediaStream, {
      mimeType: "video/webm;codecs=h264",
      videoBitsPerSecond: 1 * 1024 * 1024,
    });

    mediaRecorder.addEventListener("dataavailable", (e) => {
      console.log(e.data);
      ws.send(e.data);
    });

    mediaRecorder.addEventListener("stop", ws.close.bind(ws));

    mediaRecorder.start(1000);
  });

  ws.addEventListener("close", (e) => {
    mediaRecorder.stop();
  });

  return { videoRef, canvasRef };
};

const OpenviduVideoElement = {
  props: ["publisher"],
  setup(props) {
    const { videoRef, canvasRef } = useVideoCanvas();
    onMounted(() => {
      props.publisher.addVideoElement(videoRef.value);
    });
    return { videoRef, canvasRef };
  },
  template: `
    <video ref="videoRef" autoplay />
    <canvas ref="canvasRef" style="display: block;" />
  `,
};

export default {
  components: { OpenviduVideoElement },
  props: ["publisher"],
  setup(props) {
    const clientData = computed(() => {
      if (props.publisher) {
        const { connection } = props.publisher.stream;
        return JSON.parse(connection.data);
      }
      return { userName: null };
    });
    return { clientData };
  },
  template: `
	  <div>
      <openvidu-video-element v-if="publisher" :publisher="publisher" />
    </div>
    <!-- <div>{{ clientData.userName }}</div> -->
  `,
};
